# ITSM Service Flow — Visual Prototype

A standalone prototype that renders an **entire parent service and its sub-services** as
an enterprise service-flow diagram: one swimlane row per sub-service, moving left to
right through the service lifecycle columns.

Data comes from a spreadsheet (`.xlsx` / `.csv`) at runtime — sample data is bundled so
the app renders something immediately.

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
| Graphite dark | `dark` | Enterprise dark, graphite surfaces, restrained blue accent |
| Enterprise light | `light` | White cards, neutral greys, blue accent |
| Slate blue | `slate` | Mid-tone navy dashboard style |

Every colour is a CSS variable defined in `src/theme/themes.ts`, so adding a fourth
theme means adding one entry to `THEMES`.

## What's on screen

- **Phase bands** — `Request`, `Intake · qualification`, `Fulfillment · resolution`
  grouping the lifecycle columns.
- **Columns** — Service, Sub-service, Entitlement, Approval flow, Fulfillment, Support
  group, SLA.
- **Rows** — one alternating-stripe swimlane per sub-service, fanning out from the
  parent-service card on the left.
- **Cards** — relevance-specific icon per stage (parent service, request form,
  entitlement, approval stamp, work order vs. service request, support headset, SLA
  timer), an accent bar for emphasis/SLA state, and detail chips (approval levels,
  fulfilment code, SLA state).
- **Orthogonal connectors** — right-angle step edges with arrow heads; dashed and dimmed
  when a stage is not applicable (e.g. auto-approved).
- **Canvas** — pan/zoom, MiniMap, Controls, dot grid, legend.

## Importing a spreadsheet

Click **Import Excel** and pick an `.xlsx`, `.xls` or `.csv` file. Every row is one
sub-service; rows are grouped into services by the `Service` column, and the service
picker in the header switches between them. **Template** downloads the currently loaded
data as a CSV in the expected shape.

Recognised headers (case-insensitive, common aliases accepted — see `COLUMN_ALIASES` in
`src/data/parseServices.ts`):

| Column | Required | Notes |
| --- | --- | --- |
| `Service` | yes | Parent service; groups the rows |
| `Sub-service` | yes | Also `Service Offering`, `Offering` |
| `Domain` | no | Shown as a chip on the parent card |
| `Entitlement` | no | Also `Entitled Users`, `Audience` |
| `Entitlement Note` | no | Small caption above the entitlement |
| `Approvals` | no | Split on `;` `,` `\|` `>` `→`; empty ⇒ "Auto-approved". `Approval 1`, `Approval 2`, … columns also work |
| `Fulfillment Type` | no | `WO`/`Work Order`, `SR`/`Service Request`, `INC`, `CHG`, or free text |
| `Support Group` | no | Also `Assignment Group`, `Resolver Group` |
| `Support Note` | no | e.g. `L2 · 24×5` |
| `SLA` | no | Empty, `No SLA`, `N/A`, `-` ⇒ rendered as at-risk red |

## Layout of the code

```
src/
  App.tsx                     page shell, spreadsheet state, service selection
  components/
    FlowCanvas.tsx            React Flow instance, node/edge type registry
    StageNode.tsx             stage card
    FlowEdge.tsx              orthogonal step edge
    PhaseBand.tsx             lifecycle phase background band
    ColumnHeader.tsx          column caption
    RowStripe.tsx             alternating row background
    Legend.tsx                colour legend
    TitleBar.tsx              heading, import/template/export, theme switcher
    ThemeSwitcher.tsx         3-way theme control
    GradientBackdrop.tsx      ambient background wash
  data/
    parseServices.ts          spreadsheet → Service[] parsing, CSV template
  flow/
    layout.ts                 turns a Service into nodes + edges
    icons.ts                  stage kind → lucide icon
    sampleService.ts          bundled sample services
    types.ts                  domain + node/edge data types
  theme/
    themes.ts                 theme token definitions
    ThemeContext.tsx          theme provider / persistence
```
