# Test plan — ITSM service-flow prototype (PR #1)

Target: http://localhost:5173 (Vite dev, branch devin/1786186779-glass-swimlane-prototype)
and http://localhost:8080 (docker compose production build).

Evidence sources read: `src/App.tsx:11-31`, `src/components/TitleBar.tsx:49-89,106-131`,
`src/components/ThemeSwitcher.tsx:15-35`, `src/theme/themes.ts:10-140`,
`src/theme/ThemeContext.tsx:18-34`, `src/flow/layout.ts:94-201`,
`src/flow/icons.ts:17-35`, `src/data/parseServices.ts:115-127,250-255`,
`src/flow/sampleService.ts` (HR 5 rows, IT 4 rows), `docker-compose.yml`, `Dockerfile`.

Fixtures: `/home/ubuntu/Downloads/sample-services.xlsx` (Finance 3 rows / Facilities 2 rows),
`/home/ubuntu/Downloads/bad-headers.csv` (headers Foo,Bar,Baz — no Service/Sub-service),
CSV produced live by the header "Template" button (downloads `service-flow-template.csv`).

Console is monitored via `browser_console` after each phase; any React/React Flow
error or warning is recorded as a failure.

## T1 — Default load + service picker
1. Open http://localhost:5173.
   - PASS iff header reads `Service flow · HR Services`, subline
     `People & Workplace · 5 sub-services · Sample data`, Slate-blue theme active
     (3rd theme button = Waves icon highlighted; page bg mid-navy #243352),
     and exactly 5 swimlane rows are visible with columns
     Service / Sub-service / Entitlement / Approval flow / Fulfillment / Support group / SLA
     plus 3 phase bands Request | Intake · qualification | Fulfillment · resolution.
2. Change the header `Service` dropdown to `IT End-User Services`.
   - PASS iff header title/subline become `IT End-User Services` /
     `Technology Operations · 4 sub-services · Sample data`, canvas re-renders with
     exactly 4 rows (Laptop Request, Password Reset, Software Installation, Remote VPN Access),
     parent card chip reads `4 sub-services`, and the graph is re-fit (no rows clipped
     off-canvas, no leftover 5th row).
   - FAIL signal a broken impl would show: stale 5 rows, unchanged fitView/zoom, or blank canvas.

## T2 — Data-driven card rendering (on IT service, which has both edge cases)
- `Password Reset` row: PASS iff the Approval flow cell is a **dashed, dimmed** card titled
  `Auto-approved` with subtitle `No approval`, and the connectors entering/leaving it are
  dashed + faded (visibly different from the solid connectors on the Laptop Request row).
- `Remote VPN Access` row: PASS iff SLA card shows title `No SLA defined`, a **red** left accent
  bar and a red chip `At risk`; other rows show a green `SLA tracked` chip.
- Icons: PASS iff Fulfillment cards for `Work Order` rows (Laptop Request) show the wrench icon
  and `Service Request` rows (Password Reset) show the ticket icon — i.e. two *different* glyphs
  (zoom in to compare).

## T3 — Themes + persistence
1. Click theme button 1 (Moon, `Graphite dark`).
   - PASS iff page bg becomes near-black graphite, header/cards dark with light text,
     MiniMap + Controls repaint dark, legend still readable, `aria-pressed=true` on that button.
2. Click theme button 2 (Sun, `Enterprise light`).
   - PASS iff bg is light grey `#f4f6fa`, cards white with dark text, bands/edges/MiniMap/Controls
     all light with readable contrast — no leftover dark text-on-dark or white-on-white.
3. Reload the page (F5) while `Enterprise light` is active.
   - PASS iff app comes back in Enterprise light (not the Slate default), i.e. persisted via
     localStorage `itsm-flow-theme`.
4. Click theme button 3 (Waves, `Slate blue`) to restore.

## T4 — Excel import (happy path)
1. Click `Import Excel`, choose `/home/ubuntu/Downloads/sample-services.xlsx`.
   - PASS iff header becomes `Service flow · Finance Services`, subline
     `Corporate Finance · 3 sub-services · sample-services.xlsx`, canvas shows exactly 3 rows
     (Petty Cash Claim, Vendor Payment Release, + 3rd Finance row) with approver chips
     `1. Direct Manager`, `2. Finance Controller`, and the dropdown lists both
     `Finance Services` and `Facilities Services`.
2. Switch dropdown to `Facilities Services`.
   - PASS iff exactly 2 rows render and the parent card chip reads `2 sub-services`.

## T5 — Import adversarial
1. Click `Template` (downloads `service-flow-template.csv` for the currently loaded services),
   then `Import Excel` and select that downloaded CSV.
   - PASS iff the CSV round-trips: same service(s)/row count as before the export, filename
     shown in the subline, no error banner.
2. Click `Import Excel`, select `/home/ubuntu/Downloads/bad-headers.csv`.
   - PASS iff an inline red error appears in the header containing
     `Could not find the "Service" and "Sub-service" columns`, the previously rendered flow
     stays intact (no blank screen / crash / white page), and no uncaught console error.
3. Immediately re-import `sample-services.xlsx`.
   - PASS iff the error banner disappears and Finance Services renders again (recovery works).

## T6 — Canvas ergonomics
- At default fit: PASS iff MiniMap (bottom-right) and Controls (bottom-left) do not cover any
  stage card, and the bottom-center legend text is legible.
- Drag the canvas background to pan, then click the Controls `+` / `-` (or scroll-zoom) and
  finally `fit view`.
  - PASS iff the graph pans/zooms smoothly and fit-view returns all rows into view.
- Hover a stage card: PASS iff the card visibly lifts (translateY) — compare screenshots
  taken with pointer off vs on the card.

## T7 — Docker production build
1. `docker compose up --build -d` in the repo, then open http://localhost:8080.
   - PASS iff the same app renders (HR Services, 5 rows, Slate blue default).
2. On :8080, switch theme to Graphite dark and import `sample-services.xlsx`.
   - PASS iff theme applies and Finance Services (3 rows) renders — proving the prod bundle
     has working theming + xlsx parsing (not just the dev server).

## T8 — Console hygiene
After T1–T7, collect console output for both origins.
- PASS iff there are zero React errors, zero React Flow error codes (`#00x`), and no
  `Warning:` entries attributable to this app. Any warning is reported verbatim.
