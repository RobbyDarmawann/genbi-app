---
name: laravel-react-fullstack
description: Senior-level workflow for building and extending Laravel 13 + Inertia 3 + React 19 + Tailwind 4 information systems (CRUD modules, auth and roles, dashboards, reports) with low AI token use, modular code that keeps existing features working, vetted stable libraries, and quality gates. Use when creating or changing any feature, page, endpoint, migration, test, or dependency in a Laravel + React project, or when asked to refactor, add a package, upgrade versions, or review code quality.
---

# Laravel + React fullstack workflow

Pair with `laravel-react-security` (auth, input, config, dependencies) and `responsive-ui-ux` (anything visible). If Laravel Boost skills exist (`laravel-best-practices`, `testing-best-practices`, `inertia-react-development`, `wayfinder-development`, `tailwindcss-development`), load the one that matches the task instead of re-deriving its rules; this skill only adds house rules on top.

Reply in the user's language (Bahasa Indonesia if they write it). Code, identifiers and commit messages follow the project's existing language.

## 1. Work efficiently (token budget)

1. Read project memory first: `AGENTS.md`, `CLAUDE.md`, `.ai/guidelines`. If none exists, after discovery offer to write a profile of at most 20 lines (commands, folder conventions, test runner) so later sessions skip rediscovery.
2. Discover cheaply. `rg -n "<symbol>" app routes resources tests`, then read only the matched line ranges. Never open `vendor/`, `node_modules/`, lockfiles, `public/build`, or generated folders (`resources/js/{actions,routes,wayfinder}`).
3. Ask the framework, not memory: `php artisan route:list --json --path=<x>`, `php artisan model:show <Model> --json`, `php artisan about --json`. Confirm unfamiliar APIs with Boost `search-docs` or by grepping the definition in `vendor/`. Never invent method names, config keys, attribute signatures or CLI flags.
4. Consistency first: copy the structure, naming and test style of the closest existing module. Smallest diff that satisfies the request. No drive-by renames, reformatting, upgrades or new abstractions.
5. Generate boilerplate, don't type it: `php artisan make:model X -mf --policy`, `make:controller XController --resource --model=X --requests`, `make:request`, `make:policy --model=X`, `make:test` (always `--no-interaction`). UI primitives: `npx shadcn@latest add <name>`.
6. Narrowest check first (`php artisan test --filter=...`, one file), full gates once at the end. Install `laravel/pao` as a dev dependency: it prints compact JSON from test and static-analysis runs when an AI agent is detected, with zero config.
7. Batch independent reads and commands in one turn. Keep a task list for work over 3 steps. Ask at most one question, and only for a business decision that cannot be inferred; otherwise state the assumption and proceed.
8. Final report in 6 lines or fewer: files changed, commands run with results, what is left or risky. Do not paste code that is already in the diff. Do not create README, docs or summary files unless asked.
9. Safety: never run destructive commands against a non-local database (`migrate:fresh`, `db:wipe`, `truncate`) or `git reset --hard`, `git push --force`, `rm -rf` without explicit approval. Tests use a separate database.

## 2. Choose libraries and versions

Ladder, stop at the first rung that fits:
1. Built into PHP, Laravel, Inertia, the browser (`Intl`, `<dialog>`, CSS).
2. First-party or already in the project (Laravel packages, Inertia `<Form>`/`useForm`/`useHttp`, shadcn/Radix).
3. A mature community package that passes the vetting list.
4. Up to ~50 lines of own code, instead of a dependency for one function.

Vetting list (2 minutes, before `composer require` or `npm i`):
- Real need not met by rungs 1-2.
- Maintained: release or commit within 12 months, not marked `abandoned`.
- Compatible with the project's PHP, Laravel, React and Vite: read constraints and peer deps; never use `--force` or `--legacy-peer-deps` to get past a conflict.
- No known advisories (`composer audit`, `npm audit`); license fits (MIT/BSD/Apache; ask before GPL, AGPL or commercial).
- Frontend cost: ESM and tree-shakeable, small (`npm view <pkg> dist.unpackedSize`), no surprise install scripts (`npm view <pkg> scripts`); lazy-load heavy ones (charts, editors, PDF, maps).
- One package per need; remove the ones it replaces.

"Stable" rule: pick the newest release that is not alpha/beta/rc/canary, sits in the library's current or LTS major, is at least 7 days old (supply-chain cooling), and fits the lockfile. A major younger than ~90 days: stay on the previous major unless the starter kit already uses it or a needed feature requires it. Versions come from the project's own `composer.json` and `package.json`; commit lockfiles; deploy with `composer install --no-dev --optimize-autoloader` and `npm ci`.

New project: `laravel new <app> --react` (official React starter kit: Laravel 13, Inertia 3, React 19, Tailwind 4, shadcn/ui, Wayfinder, Fortify with 2FA and passkeys; add `--pest` or `--phpunit`, `--boost`). Existing projects keep their majors; upgrading is its own task.

| Need | Use | Avoid |
| --- | --- | --- |
| Forms and validation | Inertia `<Form>` or `useForm` + Laravel FormRequest (Precognition for live validation) | react-hook-form + zod duplicating server rules |
| Requests without navigation (lookups, toggles) | Inertia `useHttp` | adding axios or TanStack Query for the same job |
| Auth | Fortify (in the kit); Sanctum only for external or mobile API tokens | hand-rolled auth, `token` guard |
| Roles | enum + Policies for a few fixed roles; `spatie/laravel-permission` when roles are editable at runtime | role strings scattered in code |
| Data tables | shadcn `table` + server-side sort, filter, paginate via query string; `@tanstack/react-table` only for pinning, grouping or virtual columns | client-side paging of large sets |
| Charts | `recharts` through shadcn `chart`, lazy-loaded | several chart libraries |
| Dates | `Intl` or `date-fns` in the browser, Carbon on the server, store UTC | moment |
| Excel/CSV | `maatwebsite/excel` 4 (queue and chunk big exports); `spatie/simple-excel` for streaming CSV | loading whole sheets in memory |
| PDF | `spatie/laravel-pdf` (needs headless Chromium) or `barryvdh/laravel-dompdf` (simple layouts) | PDF from the browser |
| Audit trail | `owen-it/laravel-auditing` or `spatie/laravel-activitylog` 5 (PHP 8.4+) | hand-made log tables |
| Tests | whatever the project already runs (the kit uses PHPUnit; Pest 4 fits PHP 8.3, Pest 5 needs PHP 8.4+) | switching runners mid-project |
| Lint and types | Pint, Larastan, and the kit's `npm run check` / `types:check` | adding ESLint or Prettier next to the kit's tool |
| Animation | CSS transitions; `motion` only if needed, pinned | animation libraries for hover effects |

Version cautions: keep TypeScript on the kit's 5.x (TS 7 is not supported by `typescript-eslint` yet); `lucide-react` is pinned to 0.475 in the kit and 1.x may rename icons; `@tanstack/react-table` v9 and Vitest 5 are young, so pin exact versions; Wayfinder is 0.x, so pin it and expect changes; Vite 8 needs Node `^20.19 || >=22.12`.

## 3. Architecture: modular, extendable, nothing breaks

Backend, thin to thick:
- Route -> Controller (HTTP only: authorize, call, respond; about 15 lines per method) -> FormRequest (validate + authorize) -> Action class (one business operation with `handle()`, wrapping writes in `DB::transaction`, reusable from controllers, jobs and commands) -> Eloquent model (relations, scopes, `casts()`, backed enums) -> explicit output fields (Resource or array).
- Policy for every model; Enum for statuses and roles; no business values hard-coded; `env()` only inside `config/*.php`.
- Extract only when it earns it: reuse, testability, about 20 lines or more, or side effects. No repository layer over Eloquent, no service per model, no interface with one implementation. Interfaces belong at external boundaries (payment, SMS/WhatsApp, government APIs).
- Group by feature as the app grows (`app/Actions/<Domain>`, `app/Http/{Controllers,Requests}/<Domain>`). Add a modules package only when several teams need it or the user asks.
- Laravel 13 PHP attributes (`#[Fillable]`, `#[Hidden]`, `#[Table]`, `#[UsePolicy]`, controller `#[Middleware]`/`#[Authorize]`): use them where the project already does, and check the constructor signature in `vendor/laravel/framework/src/Illuminate/...` first. There is no `#[Casts]`; use the `casts()` method.
- Database: additive migrations (add, backfill, remove in a later release); never edit a migration that has shipped; index every foreign key; constraints enforce invariants, not only validation; money as integer (IDR has no decimals); store UTC. In `AppServiceProvider::boot()`: `Model::shouldBeStrict(! app()->isProduction())`.
- Performance: eager load (`with`), select needed columns, `paginate` (never `get()` on an unbounded table), `chunkById` or `lazyById` for batches, deterministic order with a unique tie-breaker. Mail, PDF, export, WhatsApp/SMS and anything over ~1s go to queued jobs (idempotent, `afterCommit`).

Frontend (mirrors the starter kit, files in kebab-case):
- `pages/<module>/{index,create,edit,show}.tsx` stay thin: props in, composition out. Feature components in `components/<module>/`; shadcn primitives in `components/ui/` (change tokens and variants only); `hooks/use-*.ts`; pure helpers in `lib/`; shared TS types in `types/`.
- URLs come from Wayfinder imports (`@/routes/...`, `@/actions/...`), never hard-coded strings. After route changes run `php artisan wayfinder:generate`; `types:check` then fails on stale calls, which is your regression net.
- Server data lives in Inertia props; do not add Redux, Zustand or TanStack Query for it. Use `useRemember` for state that must survive navigation, `router.reload({ only: [...] })` for partial reloads, `Inertia::defer` + `<Deferred>` for slow secondary data, `<InfiniteScroll>` or `<WhenVisible>` for long lists, `<Link prefetch>` on hot paths.
- Extract a component when markup repeats 3 times or passes ~150 lines; extract a hook when stateful logic repeats. Type all props (no `any`). Derive values instead of syncing state in effects. The kit enables the React Compiler, so do not add `useMemo`/`useCallback` by habit.
- Keep shared props (`HandleInertiaRequests::share`) minimal. The kit shares the whole `auth.user` model: list every new sensitive column in the model's `#[Hidden]` (see the security skill).

Keep existing behaviour working:
1. Before touching shared code, `rg` for every usage (PHP, TS, routes, tests) and list who depends on it.
2. No test covers it? Write a characterization test of current behaviour first.
3. Add, do not alter: optional parameters with defaults, optional props, new routes and columns. Keep route names, prop shapes, enum values and column names stable. If a breaking change is unavoidable, keep the old path working, mark it deprecated with a date, migrate callers in the same change, and flag it in the report.
4. Refactor and behaviour change are separate steps; rerun the affected tests after each.
5. Do not fix unrelated problems silently; list them in the report.

## 4. Recipe: new CRUD module (vertical slice)

Order: migration (indexes, FKs) -> model, factory, enum -> policy -> FormRequests (`authorize()` via the policy) -> Action(s) -> resource controller -> routes (`Route::resource(...)` inside the `auth` + `verified` group) -> Inertia pages (index with search, sort, filter, pagination in the query string; create and edit sharing one form component; show) -> nav entry -> tests (happy path, validation, each role, another user's record) -> gates.

Server list pattern: sort columns come from an allow-list, search is trimmed, order is deterministic.

```php
public function index(Request $request): Response
{
    Gate::authorize('viewAny', Product::class);

    $sort = in_array($request->query('sort'), ['name', 'price', 'created_at'], true)
        ? $request->query('sort') : 'created_at';
    $dir = $request->query('dir') === 'asc' ? 'asc' : 'desc';

    return Inertia::render('products/index', [
        'products' => Product::query()
            ->select(['id', 'name', 'price', 'status', 'created_at'])
            ->when($request->string('q')->trim()->toString(), fn ($q, $term) => $q->where('name', 'like', "%{$term}%"))
            ->orderBy($sort, $dir)->orderByDesc('id')
            ->paginate(15)->withQueryString(),
        'filters' => $request->only('q', 'sort', 'dir'),
    ]);
}
```

Client form pattern (same shape as the kit's login page; `store.form()` needs the Wayfinder `formVariants` option, which the kit enables):

```tsx
import { Form, Head } from '@inertiajs/react';
import { store } from '@/routes/products';

export default function CreateProduct() {
    return (
        <>
            <Head title="Tambah produk" />
            <Form {...store.form()} className="grid gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama</Label>
                            <Input id="name" name="name" required autoComplete="off" />
                            <InputError message={errors.name} />
                        </div>
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            Simpan
                        </Button>
                    </>
                )}
            </Form>
        </>
    );
}
```

## 5. Definition of done

Use the project's own scripts (read `composer.json` and `package.json` first). The official kit provides: `composer lint` / `lint:check` (Pint), `composer types:check` (Larastan), `composer test`, `npm run check`, `npm run types:check`, `npm run build`, and `composer ci:check` for the whole bundle. Add `composer audit` and `npm audit --omit=dev` (see the security skill).

Done means:
- Gates are green, and new behaviour has tests: happy path, validation failure, unauthorized, edge case.
- UI checked at 360, 768 and 1280 px (see `responsive-ui-ux`).
- No debug leftovers (`dd`, `ray`, `console.log`, TODO) and no unrelated changes in the diff.
- A failing gate gets a root-cause fix. Never silence it (`@ts-ignore`, `phpcs:ignore`, growing the PHPStan baseline, deleting or skipping tests, `--no-verify`) without telling the user why.
- PHP has return types and typed properties; TypeScript is strict with no `any`.

## 6. Code anti-slop

Delete on sight: comments that restate the code; dead code and unused imports; `utils.ts` junk drawers; wrappers that only forward; one-implementation interfaces; god components over ~150 lines; copy-pasted blocks; duplicated types; empty `catch`; magic numbers and hard-coded colors, URLs or role names; `any`; invented helper APIs; new dependencies for one-liners; placeholder data ("John Doe", lorem); features nobody asked for.

## 7. Version snapshot (2026-11-01, re-verify before relying)

Laravel 13.39 on PHP 8.3-8.5 (use the latest patch of your branch); `inertiajs/inertia-laravel` 3.6, `@inertiajs/react` 3.10; React 19.3.1; Vite 8.3 (the kit aliases Vite+ 1.4); Tailwind 4.3; TypeScript 5.9 (kit `^5.7`); shadcn CLI 4.23; Fortify 1.41; Sanctum 4.3; Wayfinder 0.1.x; Boost 2.10; PAO 1.1; Pint 1.32; Larastan 3.13; `spatie/laravel-permission` 8.3 (PHP 8.3+); `maatwebsite/excel` 4.0 (PHP 8.3+).

Refresh with `composer outdated --direct`, `npm outdated`, `npm view <pkg> version time --json`, and the Laravel upgrade guide and release notes at laravel.com/docs/13.x.
