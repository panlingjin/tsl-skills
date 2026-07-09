---
name: tsl-big-screen-best-practices
description: Build or maintain TSL-style Vue 3 big-screen projects from scratch using the Vue CLI-compatible stack. Use when Codex needs to scaffold, specify, review, or extend a digital-twin/data-visualization screen; honor supplied Figma/design-MCP visuals while preserving TSL engineering constraints; select and standardize card, panel, card-title decoration, modal, dialog, drawer, media-viewer, floating-card, KPI, chart, table, timeline, map, or Grid/Flex data displays; or add Vue Router, Pinia, Axios, MockJS, ECharts, CountUp, Page Switch, @tslfe/dt-engine, and @tslfe/ai-sdk MCP/LLM control flows.
---

# TSL Big Screen Project

Create, maintain, or review TSL big-screen projects. The compatibility baseline is Vue 3 with Vue CLI 5 unless the user explicitly chooses another build system.

## Workflow

1. Read `references/project-setup.md` first for stack, dependency, config, env, and HTML shell requirements.
2. Read `references/source-architecture.md` before creating or moving source files.
3. Read `references/vue-patterns.md` before writing Vue, Pinia, Router, composables, or lifecycle code.
4. Read `references/big-screen-ui.md` before implementing the screen layout, visual components, charts, counters, assets, and scaling.
5. Read `references/data-visualization.md` before choosing data-display forms or implementing KPI cards, charts, tables, timelines, maps, status lists, or data-display styling.
6. Read `references/china-map.md` when rendering the static Ya'an-style national China map and its multi-layer shadow treatment.
7. Read `references/card-patterns.md` before defining panel/content/item card hierarchy, 12-column card layouts, card density, interactive states, or floating cards over the 3D scene.
8. Read `references/title-decoration.md` before styling Panel/card/section titles, adding title backgrounds, dividers, corner marks, or animated icon decoration.
9. Read `references/modal-patterns.md` before implementing Dialog, Confirm, Drawer, Media Viewer, focus trapping, modal stacking, or scene callouts/popovers.
10. Read `references/data-integration.md` before adding Axios APIs, MockJS, timed refresh, or WebSocket code.
11. Read `references/dt-engine.md` when the project uses digital-twin scenes, Unity/WebGL control, POI, camera, effects, or model events.
12. Read `references/page-switch.md` when the project needs multi-project or multi-scene switching.
13. Read `references/llm-and-mcp.md` when adding the AI assistant, MCP tools, LLM questions, or `frontControl` actions.
14. Read `references/quality-checks.md` before final delivery.

## Design Source Priority

When the user supplies a Figma file, design-system MCP, screenshot, marked visual reference, or generated design image and asks to implement from it, treat that source as the visual authority. Use this skill for engineering structure, runtime lifecycle, big-screen scaling, data semantics, accessibility, safety, and fallback decisions where the design source is silent.

Priority order:

1. Explicit user instructions.
2. Supplied Figma/design-MCP/design-file output for visual details.
3. Maintained project conventions when working inside an existing project.
4. This skill's TSL visual defaults for unspecified areas.

Resolve conflicts by domain: visual details follow the supplied design source; engineering, usability, security, and lifecycle constraints follow this skill. Do not force the bundled blue-cyan TSL defaults over a concrete design source, and do not let a design source break the `1920 x 1080` scaled root, bounded side-panel budget, overlay layering, cleanup ownership, or private-configuration rules.

## Build Defaults

- Use Vue 3, Composition API, Vue CLI 5, Vue Router 4, Pinia, Less, ECharts, and the existing TSL package conventions.
- Pin only compatibility-sensitive dependencies: `zod@3.23.8` and `@tslfe/dt-engine@4.3.1-1`.
- Use native `axios` through `src/utils/axios.js` for all HTTP calls.
- Use `#infraApp` as the `1920 × 1080` scaled root and keep all overlays in its coordinate system.
- Reuse bundled templates and assets through the copy contracts in `source-architecture.md`; do not hand-rebuild their lifecycle behavior.
- Use the browser/page default font unless the user, supplied design, or maintained project explicitly requires a brand font. Do not copy third-party source-project fonts by default.
- Keep left and right dashboard columns inside the scaled 1080p canvas. Passive side panels must pass the documented height budget and must not create page-level or whole-panel vertical scrolling.
- Keep root and route components thin. Put feature UI in child components and feature behavior in composables, services, or stores.
- Do not copy project-specific secrets, private URLs, model ids, tokens, JWTs, app secrets, or hard-coded customer data from existing projects.

Finish with the automated and manual acceptance entry in `references/quality-checks.md`.
