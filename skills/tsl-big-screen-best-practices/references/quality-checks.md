# Quality Checks

## Contents

- [Automated Skill Validation](#automated-skill-validation)
- [Project Foundation](#project-foundation)
- [Runtime Lifecycle](#runtime-lifecycle)
- [Layout And Visual QA](#layout-and-visual-qa)
- [Data Display QA](#data-display-qa)
- [Security And Delivery](#security-and-delivery)

This file is the acceptance entry point. Exact dimensions, colors, APIs, and copy targets live in their owning references; do not duplicate them here.

## Automated Skill Validation

Run from the repository root:

```bash
node skills/tsl-big-screen-best-practices/scripts/validate-skill.mjs
node skills/tsl-big-screen-best-practices/scripts/test-chart-options.mjs
node skills/tsl-big-screen-best-practices/scripts/test-asset-contract.mjs
python3 /path/to/skill-creator/scripts/quick_validate.py skills/tsl-big-screen-best-practices
git diff --check
```

When dependencies are available, also compile `data-display.less`, `modal.less`, and `BaseModal.vue`, and run `node --check` on every JavaScript template. The bundled validators check reference routing, long-file contents, copied-asset URLs, protected asset hashes, template lifecycle contracts, and chart-builder edge cases.

## Project Foundation

Validate against `project-setup.md`, `source-architecture.md`, and `vue-patterns.md`:

- Vue CLI 5 scaffold has Babel, ESLint, Jest, SVG loader, and their matching dependencies.
- Default routing uses HTML5 history mode with `createWebHistory(process.env.BASE_URL)`; `publicPath` is configured with absolute path `"/"` (or matching base) and server configuration provides SPA routing fallback.
- Development enables MockJS explicitly; test/master disable it explicitly.
- API code uses the shared Axios instance and preserves `null`, `0`, `false`, and empty strings according to the response envelope.
- Error handling emits one user-facing message per failure and still rejects with an Error.
- Root app is a composition surface; feature behavior lives in components, composables, services, or stores.
- No generated template declares a third-party font unless the project explicitly requires one.

## Runtime Lifecycle

Validate every owned resource through open, update, replacement, route leave, and unmount:

- `useScale` fits both width and height of the `1920 × 1080` canvas and removes observers/listeners.
- ECharts initializes only with positive geometry, updates dirty options, resizes without redundant `setOption`, and disposes on element replacement/unmount.
- Modal replacement never restores stale focus; normal close does. Scroll lock survives main-plus-Confirm stacking.
- LLM uses `shallowRef`, exposes retry/error state, calls `robot.close()`, and awaits `mcp.close()`.
- MCP creation returns its server handle; failed initialization does not leave half-created resources.
- `frontControl` calls lifecycle-free services and never invokes a component composable outside setup.
- dt-engine shares one pending promise, resets it after failure, installs listeners once, calls returned unsubscribe functions, and awaits `meta.dispose()` from the scene owner.
- Timers, WebSockets, players, dynamic mount nodes, POI/effects, and document/window listeners all have an owner and cleanup path.

## Layout And Visual QA

Validate against `big-screen-ui.md`, `card-patterns.md`, `title-decoration.md`, and `modal-patterns.md`:

- Header, panels, Page Switch, LLM controls, and Teleported modals remain in the same scaled coordinate system.
- Full-page scene remains the bottom layer; overlays do not resize it.
- Side panels pass the documented height budget and `scrollHeight <= clientHeight + 1`; only a bounded card body may scroll.
- Card hierarchy, density, nesting, blur, interaction, and status treatment follow the card reference.
- One card uses at most one primary title treatment. Title text truncates safely before decoration or actions overlap.
- Ya'an Rail and AI Park Marker source assets retain their documented hashes and fixed-color behavior.
- Dialog, Confirm, Drawer, Media, and Scene Callout use the correct semantics, layers, backdrop, close policy, and AI Park visual baseline.
- A titleless modal supplies `ariaLabel`; Confirm uses `alertdialog`; busy blocks user dismissal.

## Data Display QA

Validate against `data-visualization.md` and `china-map.md`:

- Display form follows the question and data semantics, including documented degradation rules.
- Zero remains visible; invalid/missing values become `--` only where specified.
- Trend/comparison tooltips show units and long labels remain readable.
- Donuts reject invalid/negative parts, keep center/ring geometry aligned, use one legend mode, and leave ring hover unobstructed.
- Gauge detail shows the same clamped value represented by its progress.
- Tables use `.data-table__scroll` for bounded sticky headers and never make the whole side panel scroll.
- Loading, empty, error, stale, and partial states preserve layout and provide meaningful recovery/context.
- Static China map registers only the two documented maps, keeps three static layers on one Canvas, and creates no animation, interaction, timer, or business series.

## Security And Delivery

- Search generated files for tokens, JWTs, private hosts, customer identifiers, project-specific model ids, and copied business data.
- Keep browser credentials out of committed source and use approved runtime configuration/token exchange.
- Include only requested optional integrations and assets.
- Run the closest available lint, unit, build, and visual smoke checks; report anything that could not be run.
- Preserve existing user changes and ensure `git diff --check` is clean.
