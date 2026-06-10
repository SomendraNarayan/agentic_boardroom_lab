# Agentic Governance Boardroom

An executive serious game on the **autonomy–governance gap** in agentic AI.

The Agentic Governance Boardroom puts the player in command of a firm crossing the transition from assistive automation to autonomous agentic operations. Over twelve quarters, you make boardroom decisions that move the firm's underlying state, and you learn, by playing, that deployed capability which outruns the institution's capacity to oversee it does not add value: it produces value the firm cannot safely realize.

It is a fully client-side React application with no backend, suitable for classroom and executive-education use and free to host anywhere static files can be served.

## What it teaches

The simulation is built around a single idea: **governance is a constraint on realizing value, not a currency to be traded against performance.** A firm generates value through performance and market position, but the fraction it can actually keep is gated by the state of its weakest oversight control. When the weakest control keeps pace with performance, nearly all generated value is realized. When performance outruns it, the realized value collapses, however large the performance.

Players leave with a concrete instinct: do not let performance outrun your weakest control, and build the recovery capacity to fail gracefully when a shock lands.

## Scoring model

Scoring lives in a single authoritative module, `src/scoring/`, which is the only place scoring math exists. The score modal and the run report are pure display layers over it.

```
Score = (Performance + Market Share, modified by alignment & interoperability)
        × ResilienceFactor − Penalties
```

The **ResilienceFactor** is a continuous multiplier in `[floor, 1]`, set by the gap between performance and the firm's **weakest** governance vector (the minimum of trust, compliance, and auditability). The resilience floor is raised by the firm's `recoverability`, so resilient firms degrade gracefully rather than catastrophically. Workforce strain acts as a hard drag with a terminal threshold; vendor dependency is a soft strategic drag.

Outcomes are reported as a continuous score plus a **trajectory-derived profile** (for example "Architect of the Agentic Turn", "Buffered Aggressor", "Reactive Crisis Manager"), earned by the shape of the whole run rather than a threshold on the number.

Model parameters are deliberate design choices documented in `src/scoring/constants.ts`. A self-check harness (`src/scoring/model.test.ts`, run in CI) asserts that reference archetypes reproduce, so the intended ordering cannot silently break.

## Tech stack

- React 19 and TypeScript
- Vite for development and optimized builds
- Tailwind CSS for styling
- Motion for animation
- Recharts for in-game charts

## Getting started

Prerequisites: [Node.js](https://nodejs.org/) 20 or higher, and npm.

```bash
npm install        # install dependencies
npm run dev        # local dev server on http://localhost:3000
npm run lint       # type-check (tsc --noEmit)
npm run build      # production build to dist/
npm run preview    # serve the production build locally
```

Run the scoring self-check:

```bash
npx tsx src/scoring/model.test.ts
```

## Deployment

`npm run build` emits a static bundle to `dist/`, deployable to any static host.

### GitHub Pages (automated)

This repository includes a workflow (`.github/workflows/deploy.yml`) that builds and
publishes the site to GitHub Pages on every push to `main`. To enable it once:

1. In the repository settings, under **Pages**, set **Source** to **GitHub Actions**.
2. Push to `main` (or run the workflow manually from the Actions tab).

The site is served from `https://<user>.github.io/agentic_boardroom_lab/`. Because that
is a sub-path, the build must use a matching base path. The workflow passes
`--base=/agentic_boardroom_lab/` automatically, and the same value is the default in
`vite.config.ts`. If you fork the repo under a different name, update the base in both
places, or set the `VITE_BASE` environment variable at build time.

> Note: serving the repository source directly (rather than the built `dist/` output)
> produces a blank page, because the browser cannot execute the TypeScript entry file.
> Always deploy the build output, which the workflow handles for you.

### Other hosts (Vercel, Netlify, etc.)

Build with the base appropriate to where the app will live. At a domain root, build with
`--base=/`. Under a sub-path, pass that path as the base.

## Access gate

The simulation includes a lightweight **classroom access gate**. It is deterrence, not authentication: this is a fully client-side app, so any passcode shipped here is visible to anyone who inspects the bundle. Do not place anything sensitive behind it. See [`SECURITY.md`](./SECURITY.md) for the complete model. No secrets are stored in this repository.

An optional instructor-view passcode can be injected at build time via `VITE_INSTRUCTOR_PASSCODE` (see `.env.example`); it is a convenience toggle, not a privilege boundary.

## Project structure

```
src/
  App.tsx              Root component: game state, decision/round reducer, dynamics
  types.ts             Domain model and initial state
  gameData.ts          Scenarios, decisions, competitors, crises
  scoring/             The authoritative scoring module (single source of truth)
    constants.ts         All tunable parameters
    model.ts             Score, governance gate, resilience factor, terminal/warning checks
    profiles.ts          Trajectory-derived outcome profiles
    model.test.ts        Self-check harness (run in CI)
  components/          Views and modals
  utils/report.ts      Exported run report
  config/security.ts   Client-side classroom access gate
```

## Extending the simulation

To add scenarios, append to `SCENARIOS` in `src/gameData.ts`, ensuring decision options exercise the governance vectors and recoverability so the gate has teeth. To retune difficulty or scoring, edit `src/scoring/constants.ts` only, then re-run the self-check. To add an outcome profile, extend `deriveProfile` so it keys off trajectory statistics rather than the final score alone.

## Author and citation

Created by **Dr. Somendra Narayan**, Assistant Professor of Strategy and Innovation, Amsterdam Business School, University of Amsterdam. The conceptual background is developed in *The Bridgerton Paradox in Artificial Intelligence* (Palgrave Macmillan / Springer Nature, 2025).

If you use this simulation in teaching or research, please cite the repository and the author:

> Narayan, S. (2026). *Agentic Governance Boardroom* (Version 1.0.0) [Computer software]. https://github.com/SomendraNarayan/agentic_boardroom_lab

## License

Released under the [MIT License](./LICENSE).
