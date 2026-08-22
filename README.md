# ITSM Service Flow — Visual Prototype

A standalone prototype for browsing an ITSM service catalog: search a **Service**, see the
service details plus its **sub-services**, then open a sub-service to get its end-to-end
flow (Service Request → entitlement → approval levels → child tickets → SLA), one box per
record.

Data comes from a normalised multi-sheet workbook (`.xlsx`) at runtime — sample data is
bundled so the app renders something immediately.

## Stack

- React + Vite + TypeScript
- Tailwind CSS with a CSS-variable theme layer (3 themes)
- [reactflow](https://reactflow.dev) for the node/edge canvas (orthogonal step edges)
- [framer-motion](https://www.framer.com/motion/) for entrance/hover animation
- [lucide-react](https://lucide.dev) line-art icons
- [read-excel-file](https://www.npmjs.com/package/read-excel-file) for `.xlsx` parsing

## Prerequisites

Node.js **20.19+ or 22.12+** (Vite 7 requirement). The repo ships an `.nvmrc`:

```bash
nvm use
```

## Install & run

```bash
npm install
npm run dev
```

Then open the printed URL (http://localhost:5173 by default).

Other scripts:

```bash
npm run build     # type-check + production build
npm run preview   # serve the production build
npm run lint      # oxlint
```

## Run with Docker (Docker Desktop)

The image builds the app with Node 22 and serves the static bundle with nginx.

```bash
docker compose up --build       # http://localhost:8080
docker compose down
```

Without compose:

```bash
docker build -t itsm-service-flow .
docker run --rm -p 8080:80 itsm-service-flow
```

The container serves a production build, so it does not hot-reload — use
`npm run dev` for development.

## Themes

Three themes are switchable from the top-right control and persisted in
`localStorage`:

| Theme | Id | Look |
| --- | --- | --- |
| Corporate light (default) | `light` | Navy header bar, white cards, blue accent — matches the corporate dashboard reference |
| Corporate dark | `dark` | Same structure on navy-black surfaces |
| Slate blue | `slate` | Same structure on a mid-navy canvas |

Every colour is a CSS variable defined in `src/theme/themes.ts`, so adding a fourth
theme means adding one entry to `THEMES`.

## What's on screen

- **Left panel** — collapsible to an icon rail; search matches service *and* sub-service
  names; each service expands to its sub-services.
- **Service view** — selecting a service shows its card (id, domain, owner name / PR ID /
  email, description) and a grid of sub-service tiles summarising approval levels, child
  tickets (parallel or sequence) and SLA.
- **Sub-service flow** — breadcrumb + sub-service switcher above the canvas, then phase
  bands (`Request`, `Intake · qualification`, `Fulfillment · resolution`) over numbered
  columns.
- **One box per record** — three approval rows render as three chained approval boxes,
  `PARALLEL` assignments stack in a single split column, `SEQUENCE` assignments become
  ordered steps. No approvals ⇒ a muted "Auto-approved" box; no SLA row ⇒ a red
  "No SLA defined" box.
- **Canvas** — orthogonal connectors, pan/zoom, MiniMap, Controls, legend.

## Exporting a flow

With a sub-service flow open, **Export** offers:

- **PNG image** — 2× pixel ratio raster of the whole flow.
- **PDF document** — single page sized to the flow, so nothing is scaled down or cropped.

Both cover the full flow extent (not just the visible viewport), keep the active theme's
colours, and are named `<service>-<sub-service>.<ext>`. Logic lives in
`src/flow/exportFlow.ts`; bounds come from the same `buildLayout` used by the canvas.

## Importing a workbook

Click **Import workbook** and pick an `.xlsx` file; **Template** downloads the expected
workbook. Sheets (parsed by `src/data/parseWorkbook.ts`, names/headers case- and
separator-insensitive):

| Sheet | Grain | Columns |
| --- | --- | --- |
| `Services` | one parent service | `service_id, service_name, domain, owner_name, owner_pr_id, owner_email, description` |
| `SubServices` | one Service Request definition | `sub_service_id, service_id, sub_service_name, request_type, active, owner_name, owner_email` |
| `Entitlements` | one entitlement rule | `entitlement_id, sub_service_id, entitlement, entitlement_note` |
| `SLAs` | one SLA per sub-service | `sla_id, sub_service_id, sla_target, sla_unit` |
| `Approvals` | one approval level | `sub_service_id, level, approver_type, approver, condition` |
| `Assignments` | one child ticket (WO/INC) | `sub_service_id, seq, support_group, ticket_type, execution_mode` (`PARALLEL` \| `SEQUENCE`), `condition` |
| `SupportGroups` | one support group | `support_group_id, support_group, tier, coverage, email` |
| `Attributes` | one key/value extra | `entity_type, entity_id, key, value, data_type` |

The Service Request is always the parent; every `Assignments` row is a child ticket under
it. No `Approvals` rows ⇒ auto-approved; no `SLAs` row ⇒ "No SLA defined".

Sub-service `owner_name` / `owner_email` are shown on the Service Request card. Cards grow to
fit their content, so long entitlement or approval text is never clipped.

Both `Approvals` and `Assignments` carry a `condition` (blank = always applies):

- a conditional approval level gets a decision diamond in front of it, with a `Yes` branch
  into the approval and a dashed `No · skip approval` path routed to the next step;
- more than one `PARALLEL` assignment gets a split diamond before the child-ticket column,
  with each assignment's condition drawn on its own branch and on its card.

`tools/convert_legacy_csv.py` converts a legacy flat catalogue export (one row per service,
free-text approval/support-group columns) into this workbook.

## Layout of the code

```
src/
  App.tsx                     page shell, catalog state, service/sub-service selection
  components/
    Sidebar.tsx               collapsible catalog panel: search + expandable services
    ServiceOverview.tsx       service details + sub-service tiles
    ServiceContextBar.tsx     breadcrumb + sub-service switcher above the flow
    FlowCanvas.tsx            React Flow instance, node/edge type registry
    StageNode.tsx             stage card
    FlowEdge.tsx              orthogonal step edge
    PhaseBand.tsx             lifecycle phase background band
    ColumnHeader.tsx          numbered column caption
    Legend.tsx                colour legend
    TitleBar.tsx              heading, import/template/export, theme switcher
    ThemeSwitcher.tsx         3-way theme control
    GradientBackdrop.tsx      ambient background wash
  data/
    parseWorkbook.ts          multi-sheet workbook → Service[]
  flow/
    layout.ts                 turns a SubService into nodes + edges
    icons.ts                  stage kind → lucide icon
    sampleCatalog.ts          bundled sample catalog
    types.ts                  domain + node/edge data types
  theme/
    themes.ts                 theme token definitions
    ThemeContext.tsx          theme provider / persistence
```
