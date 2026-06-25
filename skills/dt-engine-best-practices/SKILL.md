---
name: dt-engine-best-practices
description: Use @tslfe/dt-engine to create or modify Three.js/WebGL, Unity Cloud, or Node-rendered digital-twin features; query the package API, parameters, defaults, and examples; diagnose dt-engine errors; migrate native Three.js code to the wrapper; or review initialization, asynchronous loading, render-loop ownership, lifecycle, and resource disposal.
---

# DT Engine Best Practices

Use the package as published. Treat root exports and their public types as authoritative; never invent APIs from native Three.js or copy internal `src/*` imports from this repository.

## Workflow

1. Read the consumer project's `package.json`. Confirm the installed `@tslfe/dt-engine` version, module system, installed `three` version, and how Draco files are served. This reference set describes dt-engine `4.4.4-0` with runtime `three` `0.183.2`.
2. Search only the references needed for the task:
   - Root exports and routing: [api-reference.md](references/api-reference.md)
   - WebGL engine and object lifecycle: [webgl-api.md](references/webgl-api.md)
   - WebGL plugins, including both OS variants: [webgl-plugins.md](references/webgl-plugins.md)
   - Unity/Cloud: [unity-cloud-api.md](references/unity-cloud-api.md)
   - NodeServer and Cesium status: [node-and-cesium.md](references/node-and-cesium.md)
   - Extensions, events, and animation: [extensions-and-animation.md](references/extensions-and-animation.md)
   - wrapper boundaries and native ownership: [concepts.md](references/concepts.md)
   - Supported patterns: [examples.md](references/examples.md)
   - Migration, conflicts, and traps: [migration-and-pitfalls.md](references/migration-and-pitfalls.md)
3. Before writing code, verify every dt-engine symbol is exported from `@tslfe/dt-engine`. Do not use `@tslfe/dt-engine/src/*`, `dist/*`, `es/*`, `lib/*`, or undocumented subpaths.
4. Prefer `createWebglEngine`, `createCloudEngine`, `Meta`, `Component`, and built-in plugins over manually recreating engine behavior. Use native `three` only for concepts that dt-engine intentionally exposes without a higher-level constructor, such as a custom `Mesh` added through `meta.scene`.
5. If documentation conflicts, apply this order: root exports and declarations, then source behavior, then README/demo. Inspect declarations and source when uncertain; never guess from Three.js.
6. After coding, audit initialization order, awaited loading, event/listener removal, render-loop ownership, plugin cleanup, component/model disposal, and final `await meta.dispose()`.

## Hard Rules

- Keep `webglPlugin.os` and `webglPlugin.osV1` distinct. `os` uses the current `Space.layouts[].data`; `osV1` uses legacy `space.layout.get("glb")`.
- Use Three.js `0.183.2` behavior when runtime and `@types/three` disagree.
- Do not generate obsolete `Tacos.connect`, `DTEngine.connect`, `DTEngine.space`, or package-internal imports.
- Do not present `createCesiumEngine` as implemented.
- In framework components, create one engine instance per mount and dispose it on unmount. Store and call listener/plugin cleanup functions.
