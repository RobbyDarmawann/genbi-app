---
name: responsive-ui-ux
description: Standards for responsive, accessible, non-generic UI in React 19 + Tailwind 4 + shadcn/ui Inertia apps. Covers mobile-first layouts from 360px to wide desktop, tables, forms, dashboards, every UI state, Indonesian formatting, and Playwright visual QA. Use whenever creating or changing a page, component, layout, form, table, dashboard, chart, or style, or when asked to make the UI responsive, modern, attractive, polished, or less AI-looking.
---

# Responsive UI/UX standards

Applies to every visible change. Reuse the project's tokens, layouts and components before adding anything. For Tailwind syntax questions load Boost's `tailwindcss-development` if it exists; for a distinctive look on a brand-new page also load a `frontend-design` skill if one is available. This skill sets the system-level rules.

## 1. Decide before coding (30 seconds)

State in one line each: who uses this and on what device (assume mid-range Android at 360-412px plus an office laptop at 1366x768), the one task the page exists for, and the density (admin data screens compact, self-service screens roomier). Then look at the nearest existing page and `resources/css/app.css`. A new page must look like it belongs; never introduce a second visual language.

## 2. Responsive rules (mobile-first, Tailwind 4)

- Unprefixed classes are the mobile design; `sm:` `md:` `lg:` `xl:` `2xl:` (40, 48, 64, 80, 96 rem) only enhance it. Never design for desktop and patch down.
- Always check 360, 390, 768, 1024, 1280 and 1536 px, plus a 667x375 landscape phone and 200% zoom. The page never scrolls horizontally (`documentElement.scrollWidth <= clientWidth`).
- Layout with grid or flex and `gap`. Fluid widths (`w-full max-w-*`), no fixed pixel widths on containers. Add `min-w-0` to flex or grid children that truncate. Card grids: `grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]`. Use `min-h-dvh`, not `h-screen`.
- Container queries (`@container`, `@md:`, built into v4) for components that live in slots of different widths (cards, widgets, panels); viewport breakpoints for page layout.
- Touch: the kit's controls are 36px (`h-9`). Make primary inputs and buttons at least 44px on mobile (for example `h-11 md:h-9`), keep 8px between targets, never hide actions behind hover. Input text stays 16px on mobile (the kit's `text-base md:text-sm` does this; it prevents iOS zoom on focus). WCAG 2.2 AA minimum is 24x24 px.
- Type and media: body 16px, prose 60-75ch, headings scale (`text-xl md:text-2xl`), `tabular-nums` for numbers, `truncate` or `line-clamp-*` with a tooltip or title for full text. Images get `width` and `height` or `aspect-*`, `loading="lazy"`, `object-cover`.
- Sticky bottom bars need bottom padding for the iOS home indicator (`pb-[env(safe-area-inset-bottom)]`, requires `viewport-fit=cover` in the viewport meta).

## 3. Patterns for information systems

- **Shell**: reuse the kit's `AppLayout` (shadcn Sidebar: collapsible on desktop, off-canvas Sheet below `md` through `useIsMobile()`, breakpoint 768). Page = title (the kit's `Heading`) + one primary action on the right (below the title on mobile) -> filters -> content. Condense breadcrumbs on mobile.
- **Lists and tables**: search, sort, filter and pagination are server-side through the query string (`router.get(url, params, { preserveState: true, preserveScroll: true, replace: true, only: ['rows', 'filters'] })`, search debounced about 300 ms). From `md` up render a `<table>` (sticky header, numbers right-aligned, row actions in a `DropdownMenu`, low-priority columns `hidden lg:table-cell`). Below `md` render stacked cards (main field, 2-3 key fields, status badge, actions menu), not a squeezed table:
  ```tsx
  <div className="hidden md:block"><Table>{/* ... */}</Table></div>
  <ul className="grid gap-3 md:hidden">{rows.map((r) => <li key={r.id}><RowCard row={r} /></li>)}</ul>
  ```
  Filters sit inline from `lg`, and in a `Sheet` below it with an active-count badge on the trigger. Bulk-action bar appears only when rows are selected. Mobile pagination: Previous, "page X of Y", Next.
- **Forms**: one column on mobile, two from `md` for short related fields, label above, helper text below, required marked. Right `type`, `inputmode` and `autocomplete` (`inputmode="numeric"` for NIK, phone, amounts). Long forms get sections or a stepper. Actions: Cancel (ghost) + Save (primary), sticky at the bottom on mobile. While submitting, disable and show `Spinner` (the kit pattern: `{processing && <Spinner />}`). Warn on leaving with unsaved changes (`isDirty`). Move focus to the first invalid field after a failed submit.
- **Dialogs**: `Dialog` from `md`; bottom or full-height `Sheet` on mobile for forms over 3 fields. Destructive actions use `AlertDialog` naming the record and the consequence ("Hapus pelanggan 'PT Maju'? Riwayat transaksi tetap tersimpan.").
- **Dashboards**: at most 4 KPI tiles (label, value, change vs previous period), one primary chart, then tables. One column on mobile ordered by importance. Charts use a fixed height (`h-64`), fewer ticks on small screens, legend below, lazy-loaded; every chart answers a stated question and is readable without color alone.
- **Navigation**: at most 3 levels, current item marked (`aria-current="page"`), same action placement in every module.
- Components the kit does not ship yet (`table`, `tabs`, `textarea`, `alert-dialog`, `popover`, `switch`, `pagination`, `chart`, ...) come from `npx shadcn@latest add <name>`. Do not hand-roll them.

## 4. Every screen handles these states

- **Loading**: skeletons shaped like the final content (kit `Skeleton`), no layout shift. Slow secondary data: `Inertia::defer` + `<Deferred fallback={...}>`.
- **Empty**: say what this is and offer the next action. "No data yet" and "no results for these filters" are different messages; the second offers Reset.
- **Error**: what happened, what to do, a Retry. Field errors inline (`aria-invalid`, `aria-describedby`); 403 and 404 pages that help.
- **Success**: use the kit's flash toast. Server: `Inertia::flash('toast', ['type' => 'success', 'message' => __('...')])`; the `useFlashToast` hook shows it (types: success, info, warning, error).
- **Pending**: disable the submit button, prevent double submission; optimistic updates only for reversible toggles; long work (import, export) runs as a queued job with a notification.

## 5. Accessibility minimum (WCAG 2.2 AA)

Semantic HTML (`button` for actions, `Link` for navigation, one `h1`, ordered headings, `main` and `nav` landmarks). Every input has a `Label`; icon-only buttons have `aria-label`. Contrast 4.5:1 for text and 3:1 for UI borders, checked in light and dark. Never remove focus rings without a visible `focus-visible` replacement. Status is never color alone (icon or text too). Whole flows work by keyboard. Respect `prefers-reduced-motion` (`motion-safe:`). Meaningful images have alt text. `<html lang>` matches `APP_LOCALE`.

## 6. Visual system: designed, not generated

- **Tokens, not literals.** The kit's theme is shadcn semantic variables (`--primary`, `--muted`, `--border`, `--ring`, `--sidebar-*`, `--chart-*`) defined in `:root` and `.dark` in `app.css`, mapped through `@theme`. Its default primary is near-black grayscale, so the product has no identity yet: choose one brand hue from the client's logo and redefine primary, ring, sidebar-primary and chart colors in both light and dark (OKLCH). Components use semantic classes (`bg-primary`, `text-muted-foreground`), never raw hex or ad-hoc `bg-blue-600`. Add success, warning and info tokens in the same place.
- **Type**: one family (the kit loads Instrument Sans), at most 6 sizes and 3 weights, sentence-case labels, Indonesian imperative verbs ("Simpan", "Tambah pelanggan"), no marketing copy in internal tools.
- **Space and shape**: Tailwind's 4px scale, one radius token, 1px borders instead of heavy shadows, at most 2 elevation levels, related items closer than unrelated ones, roomy forms, compact tables.
- **Hierarchy**: one primary button per view, secondary as outline or ghost, red only for destructive confirmation. Status colors come from one enum-to-`Badge` map defined once.
- **Motion**: 150-200 ms ease-out for hover, expand and sheet transitions. No looping or bouncing decoration.
- **Icons**: lucide only, one size per context (16 or 20), icon plus text for primary actions, no emoji as UI.
- **Data**: seed and mock with realistic Indonesian names, places and amounts; never lorem ipsum or "John Doe".
- **Delete on sight (AI-slop)**: purple-to-blue or pink gradient backgrounds or gradient headings; glassmorphism and blur on every card; every card `rounded-3xl shadow-xl`; blob, orb or grid hero art behind a login; three-up "feature cards" with icons on internal pages; everything centered; emoji in headings, buttons or toasts; "Welcome back" greetings and taglines in admin screens; fake sparkline stat cards; cards inside cards; mixed gray scales (slate + gray + zinc + neutral); `text-gray-400` body text; full-width buttons on desktop; placeholder used as label; `animate-pulse`, `animate-bounce` or `animate-ping` as decoration; a colored rounded-square icon on every list item; uppercase `tracking-widest` everywhere; leftover shadcn demo copy.

## 7. Indonesian conventions

- Currency: `new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })` gives "Rp 1.500.000" (a non-breaking space follows "Rp"). Plain numbers: "1.234,56". Money is an integer of rupiah on the server.
- Dates: `Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' })` gives "1 Nov 2026". CLDR renders `id-ID` times as "08.00" with a dot; if the product wants "08:00", convert in one shared formatter, not per component. Store UTC (Laravel's `config/app.php` timezone is UTC) and render in the user's or organization's zone: WIB `Asia/Jakarta`, WITA `Asia/Makassar`, WIT `Asia/Jayapura`; show the zone label when users span regions.
- Inputs: NIK is 16 digits, kept as a string (`inputmode="numeric"`, never a JS number); normalize phone numbers (`08...` and `+62...`) on the server; one "Nama lengkap" field, because many people have a single name.
- Language: all UI strings in Bahasa Indonesia from one place (`lang/id/*.json` or a small `lib/i18n` map) so adding English later is cheap; set `APP_LOCALE=id`, and install `laravel-lang/lang` (its publisher 16 supports Laravel 13; then `php artisan lang:add id`) for validation messages.
- Network reality: variable 4G. Keep the JS payload lean, lazy-load heavy routes and components, compress images, no autoplay media, skeletons instead of blank screens.

## 8. Performance users feel

Targets at the 75th percentile on mobile: LCP at most 2.5 s, INP at most 200 ms, CLS at most 0.1. Split code by page (the kit's page resolver is lazy), `React.lazy` + `Suspense` for charts, editors, maps and PDF viewers, no moment or lodash (use `Intl` and native), paginate on the server or virtualize lists over 200 rows (`@tanstack/react-virtual`), `<Link prefetch>` on hot navigation, partial reloads with `only:`. The kit enables the React Compiler, so no reflexive `useMemo` or `useCallback`. Fonts: at most 2 files. Images: WebP or AVIF. Read the `npm run build` output for oversized chunks before adding a heavy dependency.

## 9. Visual QA before declaring done

Start the app (`composer dev` in the kit), then run this against each changed page (needs `playwright` as a dev dependency; ask before adding it, or use the project's Pest browser or Playwright setup). For pages behind login, sign in once and reuse the saved `storageState`.

```js
// responsive-check.mjs  ->  node responsive-check.mjs http://localhost:8000/products
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const sizes = [[360, 800], [390, 844], [768, 1024], [1280, 800], [1536, 864]];
mkdirSync('shots', { recursive: true });
const browser = await chromium.launch();
let failed = false;

for (const url of process.argv.slice(2)) {
  const slug = new URL(url).pathname.replace(/\W+/g, '_') || 'home';
  for (const [width, height] of sizes) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    const { overflow, small } = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      small: [...document.querySelectorAll('button, input:not([type=hidden]), select, textarea, [role=button], [role=tab]')]
        .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.width < 24 || r.height < 24); }).length,
    }));
    await page.screenshot({ path: `shots/${slug}-${width}.png`, fullPage: true });
    const bad = overflow > 0 || errors.length > 0;
    failed ||= bad;
    console.log(`${bad ? 'FAIL' : 'ok  '} ${url} @${width}px overflow=${overflow}px consoleErrors=${errors.length} targets<24px=${small}`);
    errors.slice(0, 2).forEach((e) => console.log('     ', e.slice(0, 160)));
    await page.close();
  }
}
await browser.close();
process.exit(failed ? 1 : 0);
```

Then open the 360 px and 1280 px screenshots and check them against sections 3, 4 and 6. Fix every FAIL; treat `targets<24px` as a warning to review (some Radix checkboxes are small by design but need spacing). Add `@axe-core/playwright` for an automated WCAG scan when the project already uses Playwright.
