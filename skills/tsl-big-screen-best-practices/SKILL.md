---
name: tsl-big-screen-best-practices
description: Build or maintain TSL-style Vue 3 big-screen projects from scratch using the Vue CLI-compatible stack. Use when Codex needs to scaffold, specify, review, or extend a digital-twin/data-visualization screen; select and standardize card, panel, card-title decoration, modal, dialog, drawer, media-viewer, floating-card, KPI, chart, table, timeline, map, or Grid/Flex data displays; or add Vue Router, Pinia, Axios, MockJS, ECharts, CountUp, Page Switch, @tslfe/dt-engine, and @tslfe/ai-sdk MCP/LLM control flows.
---

# TSL Big Screen Project

Use this skill to create a usable TSL big-screen project from zero, or to align an existing project with the same conventions.

The default target is a Vue CLI-compatible Vue 3 project. Prefer this stack unless the user explicitly asks for a different build system.

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

## Build Defaults

- Use Vue 3, Vue CLI 5, Vue Router 4, Pinia, Less, style-resources-loader, ECharts, CountUp, Origami Vue, TSL CLI/plugin conventions, and JavaScript with optional gradual TypeScript.
- Pin only compatibility-sensitive dependencies: `zod@3.23.8` and `@tslfe/dt-engine@4.3.1-1`.
- Use native `axios` through `src/utils/axios.js` for all HTTP calls.
- Use MockJS by intercepting real Axios requests. Do not import mock data directly into components.
- Use `#infraApp` as the default mount element.
- Reuse bundled common assets from this skill for Page Switch, LLM quick questions, weather icons, and common screen controls.
- Reuse the bundled data-visualization Less and option-builder templates when the project needs a standard TSL data-display baseline.
- Reuse the bundled Ya'an China-map assets and `china-map.js` only for a static national map surface. Do not add business data, interaction, animation, or extra geographic layers to that template.
- Copy the bundled decoration assets with the data-display Less when decorated Panel, content-card, section, or floating-card titles are required. The Ya'an Rail and AI Park Section Marker use their fixed-color source PNGs; Cap, Bracket, and orbit ornaments remain recolorable SVG masks.
- Pair the Ya'an Rail only with the open `.data-card--rail-panel` surface. Use Cap, Marker, or plain text for closed rounded cards instead of creating a bordered frame around the Rail.
- Reuse the bundled `use-echarts.js` lifecycle template for responsive or asynchronously mounted charts; never initialize ECharts while its container has zero width or height.
- Reuse the bundled BaseModal, modal lifecycle, and Less templates instead of rebuilding focus, scroll-lock, and layer behavior per feature.
- Use the browser/page default font unless the user, supplied design, or maintained project explicitly requires a brand font. Do not copy third-party source-project fonts by default.
- Keep left and right dashboard columns inside the scaled 1080p canvas. Passive side panels must pass the documented height budget and must not create page-level or whole-panel vertical scrolling.
- Keep root and route components thin. Put feature UI in child components and feature behavior in composables/stores.
- Do not copy project-specific secrets, private URLs, model ids, tokens, JWTs, app secrets, or hard-coded customer data from existing projects.

## Delivery Checklist

- The project can start, render the root screen, and mount to `#infraApp`.
- API modules call the shared Axios instance.
- MockJS data is reachable only through normal Axios calls.
- Page Switch, MCP, LLM, and dt-engine code are included only when required by the requested project.
- Timers, listeners, dynamic modals, engine effects, and WebSocket handlers have cleanup paths.
- Left and right dashboard columns fit between their top and bottom safe areas without page or whole-panel scrollbars; only explicitly bounded table/list bodies may scroll.
- Card titles follow the Panel/content/section/item hierarchy, use at most one primary title treatment per card, and retain their decoration assets at the documented path.
- Rail titles use the open Panel preset, align to the documented `14px` inset, and never render an empty title-icon placeholder.
- AI Park Marker titles use the original half-frame PNG at `24px`, `22px` inherited-font text in `#C9CDD4`, and no generated underline, dot, or token recoloring.
- Decorated title typography follows the documented size, weight, line-height, spacing, and Meta rules without introducing a third-party font family.
- A static Ya'an-style China map copies only the two documented source assets, registers them once, and renders one geo plus two map layers on a single Canvas.
- `npm run lint`, `npm run test:unit`, or the closest available checks are documented or run.
