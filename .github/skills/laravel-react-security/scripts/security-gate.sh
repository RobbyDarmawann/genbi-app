#!/usr/bin/env bash
# security-gate.sh - read-only security checks for a Laravel + React project.
# Usage: bash security-gate.sh [project-dir] [--strict]
# Exit 1 on an audit failure or a tracked secret file; with --strict also on any red-flag hit.
# Red-flag hits are leads: each needs a human verdict (fix, or a written reason it is safe).
set -u

strict=0
dir=.
for arg in "$@"; do
  case "$arg" in
    --strict) strict=1 ;;
    *) dir="$arg" ;;
  esac
done
cd "$dir" || { echo "cannot cd to $dir"; exit 2; }

fail=0
warn=0
section() { printf '\n== %s\n' "$*"; }
have() { command -v "$1" >/dev/null 2>&1; }

section "Runtime"
if have php; then
  php -v | head -1
  [ -f artisan ] && php artisan --version 2>/dev/null
else
  echo "php: not found"
  warn=$((warn + 1))
fi

section "composer audit"
if [ -f composer.lock ] && have composer; then
  composer audit --locked --no-interaction || fail=1
else
  echo "skipped (needs composer and composer.lock)"
  warn=$((warn + 1))
fi

section "npm audit (production dependencies)"
if [ -f package-lock.json ] && have npm; then
  npm audit --omit=dev || fail=1
else
  echo "skipped (needs npm and package-lock.json; use your package manager's audit otherwise)"
  warn=$((warn + 1))
fi

section "Tracked env files"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  tracked=$(git ls-files | grep -E '(^|/)\.env(\.|$)' | grep -v '\.example$' || true)
  if [ -n "$tracked" ]; then
    echo "FAIL tracked env file(s):"
    echo "$tracked"
    fail=1
  else
    echo "ok"
  fi
else
  echo "not a git repository (skipped)"
fi

section "npm hardening (.npmrc)"
if grep -q '^ignore-scripts=true' .npmrc 2>/dev/null; then echo "ok ignore-scripts=true"; else echo "warn: .npmrc lacks ignore-scripts=true"; warn=$((warn + 1)); fi
if grep -q '^min-release-age=' .npmrc 2>/dev/null; then echo "ok min-release-age is set"; else echo "warn: .npmrc lacks min-release-age (needs npm 11.10+)"; warn=$((warn + 1)); fi

section "Laravel config (review the values)"
for pair in "config/session.php:serialization" "config/cache.php:serializable_classes"; do
  file=${pair%%:*}
  key=${pair##*:}
  [ -f "$file" ] || continue
  found=$(grep -n "'$key'" "$file" | head -2)
  if [ -n "$found" ]; then echo "$file: $found"; else echo "warn: '$key' not set in $file"; warn=$((warn + 1)); fi
done
if [ -f .env ]; then
  if grep -q '^APP_ENV=production' .env && ! grep -q '^APP_DEBUG=false' .env; then
    echo "FAIL .env has APP_ENV=production without APP_DEBUG=false"
    fail=1
  fi
fi

section "Red-flag scan"
hits=0
if have rg; then
  out=$(rg -n --glob '!resources/js/{actions,routes,wayfinder}/**' \
    -e '\$guarded\s*=\s*\[\s*\]' -e '\bunserialize\(' -e '\b(eval|shell_exec|passthru|proc_open|popen)\(' \
    -e '(whereRaw|orderByRaw|selectRaw|havingRaw|groupByRaw|DB::(raw|unprepared|statement|select))\(\s*("[^"]*\$|\x27[^\x27]*\x27\s*\.|\$)' \
    -e '\{!!' -e 'dangerouslySetInnerHTML|\.innerHTML\s*=' -e '\$request->all\(\)' \
    -e '\b(md5|sha1|mt_rand|rand)\(' -e 'VITE_\w*(SECRET|KEY|TOKEN|PASSWORD)' \
    app routes resources config database bootstrap 2>/dev/null)
  if [ -n "$out" ]; then
    hits=$(printf '%s\n' "$out" | wc -l | tr -d ' ')
    printf '%s\n' "$out"
  fi
  echo "-- CSRF configuration sites:"
  rg -n 'preventRequestForgery|validateCsrfTokens|VerifyCsrfToken|PreventRequestForgery' bootstrap app 2>/dev/null
else
  echo "ripgrep (rg) not found: install it to run the scan"
  warn=$((warn + 1))
fi
[ "$strict" -eq 1 ] && [ "$hits" -gt 0 ] && fail=1

section "Summary"
echo "failures=$fail warnings=$warn red-flag-hits=$hits"
[ "$fail" -eq 0 ] && echo "PASS (hits and warnings still need a verdict)" || echo "FAIL"
exit "$fail"
