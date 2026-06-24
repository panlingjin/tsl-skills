---
name: tsl-big-screen
description: Build or maintain TSL-style Vue 3 big-screen projects from scratch using the Vue CLI-compatible stack. Use when Codex needs to scaffold, specify, review, or extend a digital-twin/data-visualization screen with Vue Router, Pinia, Axios, MockJS, ECharts, CountUp, Page Switch, @tslfe/dt-engine, and @tslfe/ai-sdk MCP/LLM control flows.
---

# TSL Big Screen Project

Use this skill to create a usable TSL big-screen project from zero, or to align an existing project with the same conventions.

The default target is a Vue CLI-compatible Vue 3 project. Prefer this stack unless the user explicitly asks for a different build system.

## Workflow

1. Read `references/project-setup.md` first for stack, dependency, config, env, and HTML shell requirements.
2. Read `references/source-architecture.md` before creating or moving source files.
3. Read `references/vue-patterns.md` before writing Vue, Pinia, Router, composables, or lifecycle code.
4. Read `references/big-screen-ui.md` before implementing the screen layout, visual components, charts, counters, assets, and scaling.
5. Read `references/data-integration.md` before adding Axios APIs, MockJS, timed refresh, or WebSocket code.
6. Read `references/dt-engine.md` when the project uses digital-twin scenes, Unity/WebGL control, POI, camera, effects, or model events.
7. Read `references/page-switch.md` when the project needs multi-project or multi-scene switching.
8. Read `references/llm-and-mcp.md` when adding the AI assistant, MCP tools, LLM questions, or `frontControl` actions.
9. Read `references/quality-checks.md` before final delivery.

## Build Defaults

- Use Vue 3, Vue CLI 5, Vue Router 4, Pinia, Less, style-resources-loader, ECharts, CountUp, Origami Vue, TSL CLI/plugin conventions, and JavaScript with optional gradual TypeScript.
- Pin only compatibility-sensitive dependencies: `zod@3.23.8` and `@tslfe/dt-engine@4.3.1-1`.
- Use native `axios` through `src/utils/axios.js` for all HTTP calls.
- Use MockJS by intercepting real Axios requests. Do not import mock data directly into components.
- Use `#infraApp` as the default mount element.
- Reuse bundled common assets from this skill for Page Switch, LLM quick questions, weather icons, and common screen controls.
- Keep root and route components thin. Put feature UI in child components and feature behavior in composables/stores.
- Do not copy project-specific secrets, private URLs, model ids, tokens, JWTs, app secrets, or hard-coded customer data from existing projects.

## Delivery Checklist

- The project can start, render the root screen, and mount to `#infraApp`.
- API modules call the shared Axios instance.
- MockJS data is reachable only through normal Axios calls.
- Page Switch, MCP, LLM, and dt-engine code are included only when required by the requested project.
- Timers, listeners, dynamic modals, engine effects, and WebSocket handlers have cleanup paths.
- `npm run lint`, `npm run test:unit`, or the closest available checks are documented or run.
