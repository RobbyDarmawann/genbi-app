---
name: laravel-react-security
description: Security workflow for Laravel 13 + Inertia + React apps. Verifies live advisories first (composer audit, npm audit, PHP and Laravel releases), applies OWASP Top 10:2025 controls, hardens config and supply chain, and writes security tests. Use when touching authentication, authorization, roles, file uploads, user input, database queries, sessions, .env or config, dependencies, CI or deployment, or when asked to audit, review, prepare for a pentest, or make an app secure.
---

# Laravel + React security

Security claims need evidence. Memory of CVEs and versions goes stale: verify with the commands and sources below, and write "unverified" plus the command to run when you cannot. Passing tests do not prove an app is secure; report what was checked and what was not. If Laravel Boost skills exist, also load `laravel-best-practices` (rules/security) and `testing-best-practices` (rules/security).

## 1. Verify first

```bash
php -v && php artisan --version         # runtime versions
composer audit --locked                  # PHP advisories (non-zero exit = findings)
npm audit --omit=dev                     # JS advisories, production deps (use the project's package manager)
composer outdated --direct; npm outdated
php artisan about --only=environment     # Debug Mode must be OFF in production
```

Then use web search or fetch only for what those cannot tell you: the latest PHP patch for the project's branch (php.net/ChangeLog or the php-src tags), `github.com/laravel/framework/security/advisories`, and the current OWASP Top 10 (owasp.org/Top10). Pass criteria: PHP is on a supported branch at its latest patch (distro builds backport fixes without changing the version, so read the distro advisory), Laravel is on the latest 13.x, and `composer audit` and `npm audit` are clean or each finding has a written verdict. With no network, run the local commands and list the rest as unverified.

## 2. Threat-model every change in three questions

1. Who can call it: guest, user, API token, internal job?
2. On which records may they act: owner, tenant, role, state of the record?
3. What untrusted data comes in (request, file, header, third-party API, existing DB content) and where does it go out (HTML, SQL, shell, URL, file path, mail, log)?

## 3. Controls by OWASP Top 10:2025 category

**A01 Broken Access Control (SSRF included)**
- Authorize every action at record level: `Gate::authorize()` or FormRequest `authorize()` backed by a Policy; the `auth` middleware alone is not authorization. Default is deny.
- Stop IDOR by scoping queries to the actor (`$request->user()->projects()->findOrFail($id)`), `->scopeBindings()` on nested resources, tenant scope plus tenant-scoped `Rule::exists()` / `unique()`. Return 404 when existence itself is sensitive.
- Mass assignment: allow-list with `#[Fillable]` or `$fillable`, never `$guarded = []`; write from `$request->validated()`, never `all()`; set `role`, `is_admin`, `status`, `tenant_id`, `user_id` on the server only.
- Hiding a button is UX. Compute permission flags on the server (`can.update`) and re-check on every request.
- Outbound requests to user-supplied URLs: https only, host allow-list, reject private, loopback and link-local ranges (127/8, 10/8, 172.16/12, 192.168/16, 169.254/16, ::1), `Http::withoutRedirecting()`, `->timeout(5)`.
- Uploads: validate `mimes` (reads content), `image`, `max`; add `extensions` when the filename extension matters. Store on a private disk with a generated name, serve through an authorized controller or temporary URL, never build paths from input, never serve user SVG or HTML inline from your origin.

**A02 Security Misconfiguration** (production checklist)
- `APP_ENV=production`, `APP_DEBUG=false` (`.env.example` ships `true`), secret `APP_KEY`, `php artisan optimize`. Document root is `public/`; dotfiles, `.git`, `storage` and `vendor` are not served.
- Cookies and sessions: `SESSION_SECURE_COOKIE=true`, `SESSION_HTTP_ONLY=true`, `SESSION_SAME_SITE=lax`; `SESSION_DRIVER=database` or `redis`, not `cookie`.
- Apps upgraded from Laravel 12 or older: set `config/session.php` `'serialization' => 'json'` and `config/cache.php` `'serializable_classes' => false` (the 13 skeleton ships both; changing session serialization logs everyone out).
- CSRF: keep `PreventRequestForgery` (the old `VerifyCsrfToken` name is a deprecated alias). Configure in `bootstrap/app.php` with `$middleware->preventRequestForgery(except: [...], originOnly: false, allowSameSite: false)`. Exclude only webhooks that verify an HMAC signature. `originOnly: true` relies on the `Sec-Fetch-Site` header, which browsers send to secure/trustworthy origins (plain-HTTP production gets no origin check). The middleware is skipped in unit tests, so cover CSRF with a browser smoke test or a check that it is not removed. Inertia 3's built-in client reads the `XSRF-TOKEN` cookie and sends `X-XSRF-TOKEN` (checked in `@inertiajs/core` 3.10), so dropping axios is safe.
- `$middleware->trustProxies(at: [...])` for your load balancer and `$middleware->trustHosts(at: [...])` against Host-header poisoning; `URL::forceScheme('https')` in production.
- Headers: HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, CSP (start report-only; `Vite::useCspNonce()` supplies the nonce), `frame-ancestors`. CORS only for known origins, never `*` with credentials.
- Telescope, Debugbar, Horizon, Pulse and Pail are removed from production (`--no-dev`) or gated by `Gate`. The database user has no DDL rights at runtime; the database is not publicly reachable; backups are encrypted and restore-tested.
- PHP ini: `expose_php=Off`, `display_errors=Off`, `session.upload_progress.enabled=0` (PHP's interim mitigation for CVE-2026-115560, see section 9).

**A03 Software Supply Chain Failures**
- Commit `composer.lock` and `package-lock.json`. Production installs with `composer install --no-dev --prefer-dist --optimize-autoloader` and `npm ci`. Update one package at a time (`composer update vendor/pkg --with-dependencies`) and read its changelog. Never ship `dev-main` constraints.
- `.npmrc`: `ignore-scripts=true` and `min-release-age=7` (days, needs npm 11.10+; for an urgent fix temporarily lower it, see `npm help config`). Run `npm audit signatures` in CI. For pnpm the setting is `minimumReleaseAge` (minutes; verify where in pnpm docs). Use the project's package manager: `pnpm audit` / `pnpm install --frozen-lockfile` where a pnpm lockfile exists.
- Add `roave/security-advisories` (`dev-latest`) as a dev dependency so known-vulnerable versions cannot be installed. Vet new packages with the list in `laravel-react-fullstack`.
- CI: pin third-party GitHub Actions by commit SHA, `permissions: contents: read`, `persist-credentials: false`, secrets only in the secret store, a secret scanner such as gitleaks.
- React Server Components advisories concern `react-server-dom-*` and RSC frameworks. Inertia with Vite and `@vitejs/plugin-react` does not use RSC, but keep `react` and `react-dom` patched.

**A04 Cryptographic Failures**
- Passwords: `Hash::make` (bcrypt or argon2id via `config/hashing.php`); reuse the kit's `PasswordValidationRules` or `Password::defaults(fn () => Password::min(12)->uncompromised())`.
- Sensitive columns (NIK, NPWP, bank account, medical): `encrypted` cast in `casts()`, listed in `#[Hidden]` or `$hidden`, `TEXT` column. Encrypted values cannot be queried; for exact-match search store an HMAC hash column. Encryption is not access control.
- Random tokens: `Str::random()` or `random_bytes()`; compare with `hash_equals()`; never `md5`, `sha1`, `rand`, `mt_rand` for security.
- Do not log or return secrets or full personal data; mask NIK (last 4 digits).
- Key rotation: set the new `APP_KEY` and keep the old one in `APP_PREVIOUS_KEYS` (comma-separated) while data is re-encrypted.

**A05 Injection and XSS**
- SQL: Eloquent or bindings (`whereRaw('col = ?', [$v])`). Bindings do not protect identifiers: sort column, direction and table names come from allow-lists. Never put request data in `orderByRaw`, `DB::raw`, `DB::unprepared`. `LIKE` treats `%` and `_` in user terms as wildcards.
- XSS: React escapes by default. Review `dangerouslySetInnerHTML`, `innerHTML`, Blade `{!! !!}`, and user-controlled `href`/`src` (allow only `http:`, `https:`, `mailto:`, `tel:`; reject `javascript:`). Rich text goes through DOMPurify in the browser or HTMLPurifier on the server. `target="_blank"` needs `rel="noopener noreferrer"`.
- Inertia props are embedded in the page and visible to that user. Send explicit fields, never whole models with sensitive columns, never secrets. The kit shares the full `auth.user`: every new sensitive column goes into `#[Hidden]`. Nothing secret in `VITE_*` variables (they are bundled).
- Shell and paths: avoid shell calls; use `Process::run([...])` with an argument array; never concatenate user input into paths (use `Storage`, UUID names).
- CSV and Excel exports: prefix cells that start with `=`, `+`, `-`, `@`, tab or carriage return with `'` (formula injection).
- Never `unserialize()` untrusted data; use JSON.

**A06 Insecure Design**
- Rate-limit login, password reset, OTP, 2FA, public forms, search, export and any expensive endpoint (`RateLimiter::for()` + `throttle:name`; key by email plus IP, not IP alone).
- Business limits: max file size, rows per import, export size. Idempotency keys for payments and submissions. Statuses as an enum with allowed transitions. `lockForUpdate()` inside a transaction or `Cache::lock()` for races. Recalculate prices and totals on the server.

**A07 Authentication Failures**
- Use Fortify. Require 2FA for admin roles (`Features::twoFactorAuthentication(['confirm' => true, 'confirmPassword' => true])`); passkeys come with the kit. Email verification for self-registration.
- Same error for unknown email and wrong password; throttle login and reset; short reset-token lifetime. After a password change invalidate other sessions (`Illuminate\Session\Middleware\AuthenticateSession` plus `Auth::logoutOtherDevices()`).
- API tokens: Sanctum with abilities and `expiration`. Do not use a guard with `'driver' => 'token'` (see GHSA-f9x3-7vq9-cph6 in section 9).

**A08 Software or Data Integrity Failures**
- Webhooks: verify an HMAC with `hash_equals()`, a timestamp tolerance and replay protection. Download and verification links use `URL::temporarySignedRoute()`. Never trust client-sent totals, ownership or status.
- Third-party scripts: self-host, or pin with SRI. Protected branches and required reviews on the deploy branch.

**A09 Logging and Alerting Failures**
- Log login success and failure, password and 2FA changes, role changes, exports, deletes and permission denials with user id, IP, user agent and UTC time; model-level history through an audit package. Never log passwords, tokens, OTPs or full NIK.
- Alert on bursts of failed logins, 403s and 500s (Nightwatch, Pulse, Sentry or similar). Keep logs per the retention policy.

**A10 Mishandling of Exceptional Conditions**
- Fail closed: an error never grants access. Users see a generic message, `report()` records details, `APP_DEBUG=false`. Multi-step writes sit in `DB::transaction`. External calls have timeouts, bounded retries with backoff, and a failure path that denies. No empty `catch`. Queue `failed()` handlers alert someone. Inertia 403, 404, 419 and 500 pages leak nothing.

## 4. Security tests to write per feature

- Guest gets 302 or 401 on every protected route; an unverified user is blocked where `verified` applies.
- Each unprivileged role gets 403 (use a dataset or data provider over roles).
- Another user's or tenant's record: show, update and delete return 403 or 404; a child record under the wrong parent fails.
- Extra privileged fields in the payload (`role`, `is_admin`, `tenant_id`) are ignored and the row is unchanged.
- Validation edge cases: oversize and wrong-type files (`.php`, `.svg`, double extension), arrays where scalars are expected, 10k-character strings, HTML and SQL metacharacters.
- Injection in dynamic query parts: `?sort=password`, `?dir=desc;drop`, unknown filter keys fall back to defaults.
- User text is escaped in mail, Blade and rendered output; sensitive keys are absent from Inertia page props (`assertInertia`).
- Rate limit returns 429 after the limit (clear the limiter in setup).
- Security headers and cookie flags are present on a real HTML response.
- CSRF is bypassed in unit tests: cover it with a browser smoke test.
- CI also runs `composer audit`, `npm audit --omit=dev`, Larastan and a secret scan; optionally a DAST baseline scan (OWASP ZAP) against staging.

## 5. Red-flag scan (each hit needs a verdict: fix, or a written reason it is safe)

```bash
rg -n --glob '!resources/js/{actions,routes,wayfinder}/**' \
  -e '\$guarded\s*=\s*\[\s*\]' -e '\bunserialize\(' -e '\b(eval|shell_exec|passthru|proc_open|popen)\(' \
  -e '(whereRaw|orderByRaw|selectRaw|havingRaw|groupByRaw|DB::raw|DB::unprepared)\([^)]*(\$|\{)' \
  -e '\{!!' -e 'dangerouslySetInnerHTML|\.innerHTML\s*=' -e '\$request->all\(\)' \
  -e '\b(md5|sha1|mt_rand|rand)\(' -e 'VITE_\w*(SECRET|KEY|TOKEN|PASSWORD)' \
  app routes resources config database bootstrap
rg -n 'preventRequestForgery|validateCsrfTokens|VerifyCsrfToken|PreventRequestForgery' bootstrap app
git ls-files | rg '(^|/)\.env(\.|$)' | rg -v '\.example$'    # tracked env files = leaked secrets
```

Bash syntax; adapt quoting for other shells.

## 6. Leaked secret or suspected compromise

1. Assume the secret is already copied. Rotate everything it unlocked (`APP_KEY`, DB passwords, API, mail, S3 and OAuth keys). A leaked `APP_KEY` always allows forging/decrypting cookies and sessions, and can mean remote code execution through deserialization when `session.serialization` is `php` or `cache.serializable_classes` allows classes (CVE-2018-15133; CVE-2024-55556 with `SESSION_DRIVER=cookie`).
2. Invalidate sessions and tokens (clear the sessions table, revoke `personal_access_tokens`, force password resets where relevant).
3. Redeploy from a clean build. Remove the secret from git history (`git filter-repo` or BFG); history rewriting does not un-leak it.
4. Review auth logs, access logs and audit trails; look for new users, new files, cron entries and webshells on the server.
5. If personal data may be exposed, UU PDP Pasal 46 requires written notice to the data subjects and the authority within 3x24 hours. Involve legal counsel (this is not legal advice).
6. Add detection afterwards: pre-commit and CI secret scanning.

## 7. Audit report format

Per finding: ID, severity (impact x likelihood), OWASP 2025 category, `file:line`, evidence (code or command output), exploit scenario in one or two lines, exact fix, test added. Order by severity. Keep "verified" separate from "unverified or needs access". No generic advice padding.

## 8. Indonesia (not legal advice)

UU PDP No. 27/2022 has applied in full since 2024-10-17. Design for it: collect the minimum, record consent and purpose, support access, correction and deletion requests, set retention and purge jobs, encrypt and mask sensitive fields (NIK, NPWP, health, finance), keep an audit trail, and have a breach procedure (Pasal 46: notice within 3x24 hours). Government Regulation PP 33/2026 (reported as promulgated 2026-07-16, effective 2027-01-16, adding ROPA, DPIA and DPO duties) is known only from a law-firm summary: verify against the official text before relying on it.

## 9. Advisory snapshot (2026-11-01): leads to re-verify, not facts to quote

- PHP "php2shell": CVE-2026-109618 and CVE-2026-109619, unauthenticated RCE (CVSS v4 9.2), patched 2026-10-21. Fixed in PHP 8.5.12, 8.4.27, 8.3.36, 8.2.35; PHP 8.1 and older get no official fix, so upgrade. Highest risk on Apache mod_php; exploitation attempts were reported the same day.
- CVE-2026-115560 (PHP, configuration-dependent RCE; fix announced for the next regular release, not yet shipped as of 2026-10-26). Secondary sources say it needs all of: `session.serialize_handler` set to `php_binary` or `php_serialize`; code that switches it to `php` with `ini_set()` and calls `session_start()`; `session.upload_progress.enabled` on (the default). Mitigation named by PHP, Red Hat and JPCERT/CC: `session.upload_progress.enabled=0` in php.ini, the FPM pool or server config (not `ini_set` or `.user.ini`). Laravel's framework code never calls `session_start()` (grep of 13.x), but a library might. Unverified: affected versions, fixed release, CVSS.
- Laravel: GHSA-f9x3-7vq9-cph6, TokenGuard authentication bypass (critical; `'driver' => 'token'` guard on MySQL or MariaDB; Sanctum and Passport not affected; fixed in 12.68.0 and 13.29.0). GHSA-5wcm-3v2w-8362, JSON:API resources data destruction (fixed in 12.68.0 and 13.27.0). CVE-2026-48019, mail CRLF injection (fixed in 12.60.0 and 13.10.0; severity differs between sources). CVE-2026-102279, debug-page XSS (fixed in 12.69.0 and 13.30.0). Staying on the latest 13.x covers all four.
- React: the 2026-10-14 patch releases (19.0.9, 19.1.10, 19.2.9, 19.3.1 on npm) fix an RSC deserialization RCE in `react-server-dom-webpack|turbopack|parcel` (Mend WS-2026-0170, listing GHSA-xqc2-xf4c-x3h3; secondary source, confirm on GitHub). Not applicable to Inertia without RSC; update anyway.
- npm supply chain in 2026 (secondary sources): axios 1.14.1 and 0.30.4 compromised in March; the TanStack "Mini Shai-Hulud" worm in May. These are why `ignore-scripts`, `min-release-age` and lockfile-only installs are mandatory here.
