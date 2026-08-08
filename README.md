# ITSM Service Flow — Visual Prototype

A standalone visual prototype that renders **one hardcoded sample ITSM service flow**
("Employee Onboarding Request", parent service "HR Services") in a dark
glassmorphism / swimlane aesthetic.

This is a look-and-feel prototype only: there is no data ingestion, no filters and no
service tree — just the single flow so the visual style can be validated before the
rest of the app is wired up.

## Stack

- React + Vite + TypeScript
- Tailwind CSS (dark by default)
- [reactflow](https://reactflow.dev) for the node/edge canvas
- [framer-motion](https://www.framer.com/motion/) for entrance/hover animation
- [lucide-react](https://lucide.dev) line-art icons

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

Then open the printed URL (http://localhost:5173 by default) in a browser.

Other scripts:

```bash
npm run build     # type-check + production build
npm run preview   # serve the production build
npm run lint      # oxlint
```

## What's on screen

- **Title bar** — "Flow of Employee Onboarding Request" with the parent-service
  subtitle, plus placeholder Export and theme-toggle buttons.
- **Drifting gradient backdrop** — four large blurred violet/blue/teal/fuchsia radial
  blobs slowly drifting behind the canvas (CSS keyframes).
- **Swimlanes** — `INTAKE` (top) and `FULFILLMENT` (bottom) bands with rotated side
  labels, separated by a dashed divider.
- **Glass stage cards** — rounded-2xl, semi-transparent dark fill, backdrop blur, thin
  light border, soft outer glow, centered line-art icon, label, and optional detail
  chips. Hover lifts and intensifies the glow.
- **Glowing animated connectors** — custom bezier edge with a violet→blue→teal gradient
  stroke, blurred halo, and a moving dashed pulse. The intake → fulfillment link is a
  thicker "hero" connector.
- **Canvas** — pan/zoom, MiniMap and Controls, faint dot grid, default React Flow node
  chrome hidden.

### Sample flow

`Onboarding Request` → `Entitlement (All DEWA Users)` → `Approval Flow (① Direct
Manager, ② HR Head)` → `Fulfillment Type (WO)` → `Support Group (HR-Ops)` →
`SLA (3 WD)`

The SLA card colour-codes risk: a timed SLA renders with a green glow, and a
`slaRisk: 'none'` SLA renders with a red glow (see `src/flow/sampleService.ts`).

## Layout of the code

```
src/
  App.tsx                     page shell (backdrop + title bar + canvas)
  components/
    FlowCanvas.tsx            React Flow instance, node/edge type registry
    GradientBackdrop.tsx      drifting blurred gradient blobs
    LaneNode.tsx              swimlane band background + side label
    StageNode.tsx             glassmorphism stage card
    GlowEdge.tsx              glowing animated gradient edge
    TitleBar.tsx              heading + Export / theme toggle placeholders
  flow/
    sampleService.ts          the hardcoded sample flow (nodes, lanes, edges)
    types.ts                  node/edge data types
```

To try a different sample, edit `src/flow/sampleService.ts` — positions are absolute
canvas coordinates inside the two lane bands.
