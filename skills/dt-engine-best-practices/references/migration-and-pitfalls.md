# Migration, Compatibility, and Pitfalls

## Source-of-truth policy

Resolve conflicts in this order:

1. Root exports and public declarations.
2. Source runtime behavior.
3. README, API.md, docs, and demo.

Three.js behavior follows installed runtime `three@0.183.2`, not repository `@types/three@0.177.0`.

## Known documentation conflicts

| Conflict | Correct treatment |
| --- | --- |
| README/API.md use `Tacos.connect` from dt-engine default export | Obsolete. Root default has no `connect`. TacOS exists only through `webglPlugin.os()` and `osV1()`. |
| demo utility calls `DTEngine.connect` | Obsolete unrelated generation; never reproduce. |
| docs use `DTEngine.space/device` and `ComponentType` root import | These are not current root exports. |
| demo imports `../../src`, `src/core`, plugin internals | Repository-only testing. npm consumers import the package root. |
| demos use `@tweenjs/tween.js` directly | Prefer root `TWEEN` when demonstrating package-supported animation integration. |
| `WebglCreator.createComponent` declaration has optional second URL, source ignores it | Use one argument. `webglPlugin.space` relies on the stale second argument and is fragile. |
| shared Camera declaration says `flyTo` returns void | WebGL runtime returns `BaseAnimation`; Unity runtime returns Promise. Write portable code without consuming the return; use `camera.stop`. |
| `UnityScene` type declares sky methods | Runtime scene object is empty. Treat unsupported. |
| `createCesiumEngine` is exported | It resolves undefined from TODO implementation; do not use. |
| `threeLoader3dtiles` is exported | Setup is commented out and returns void; do not claim it works. |
| WebGL model declares `disabled` and `selected` | Source implementation is commented out; use stable plugin/event behavior instead. |
| WebGL `createWebglDefaultConfig().performance.mergedTypes` is `[]` | Project guidance is to set `config.performance.mergedTypes` to `["floor"]` in the engine callback. Because root API does not export `ComponentType`, copyable TypeScript examples should use `["floor"] as typeof config.performance.mergedTypes`. This makes floor mapping URLs prefer `graphic_merged.glb`. |
| WebGL `render(url, mapping = false)` source default is `false` | Project Skill guidance is to generate business scene/floor/campus loading code as `await meta.render(url, true)`. Use `false`/omission only for confirmed standalone GLB without sibling mapping. |
| Cloud `createUnityDefaultConfig()` omits `url` | Let callers configure `url`; default generated examples to `ws://127.0.0.1:8181` only when no URL is supplied. |
| demo says shallow has no effect | Source traversal honors shallow; Unity project notes report backend inconsistencies. Verify against target scene. |

## Native Three.js migration

| Native code | dt-engine approach |
| --- | --- |
| Create renderer/scene/camera and animation loop | `await createWebglEngine()`, `amount`, and `renderer.onRender`. |
| `GLTFLoader.load` | `await meta.render(url, true)` for a mapped business scene or `await meta.createComponent(url)` for a standalone wrapped child. |
| `scene.getObjectByName` | `meta.get(id)` or `search/filter` over Components. |
| manual OrbitControls | Default `webglPlugin.orbitControl`; retrieve by key if control access is needed. |
| manual lights | Configure/replace `webglPlugin.light` in engine callback. |
| CSS2D/CSS3D labels | `webglPlugin.poiv2`, `poi2d`, or `poi`. |
| raycaster selection | built-in mouse events, `picker`, or `boxSelection`. |
| camera tween | `flyTo`, `travel`, `moveAlong`, `faceTo`, `adjust`. |
| manual recursive disposal | `component.dispose()` or `meta.dispose()` for wrapped models. |

Native objects added directly through `meta.scene.add` remain valid when no wrapper exists, but the caller owns their disposal.

## Initialization and asynchronous behavior

- Create after browser DOM is available. The package accesses `navigator`, `document`, window size/pixel ratio, Canvas, and requestAnimationFrame.
- `createWebglEngine` is async by signature but mostly constructs synchronously. Await it.
- Call `amount` before features relying on real container dimensions.
- Await `render`, `compile`, `createComponent`, Cloud creation/render, POI remote operations, and disposal.
- Mapping mode rewrites model URL to sibling `meta.json`; generated WebGL scene code should default to `render(url, true)` and ensure the server hosts that mapping file.
- `loadMapping` catches errors and returns `[]`, so explicitly validate mapping-dependent results.
- Unity socket invokes can reject with Model API errors; wrap boundary operations in try/catch.
- Cloud engine connection can retry up to `repeatLimit` or default 5.

## Render-loop and performance traps

- Use `meta.renderer.onRender`, plugin `render`, or package animations; do not add an independent perpetual RAF unless isolated and cancelled.
- The frame queue is module-global. Multiple engines can interfere; one engine's dispose calls global `stopRequestAnimationFrame`.
- Loader concurrency is six and duplicate URLs coalesce.
- Persistent loader cache defaults to 12 hours. `loader.dispose()` does not clear IndexedDB; use `loader.clear()` when fresh assets are required.
- Scene cache clones Object3Ds and can serve stale models after studio updates; default is disabled.
- `performance.autoMerge` is enabled. Animation application may temporarily de-optimize models.
- Instanced model color/opacity uses custom per-instance attributes; avoid replacing shaders/materials without preserving them.
- POI overlays add DOM and per-frame occlusion work. Clear unused markers.
- Dense polygon box selection and huge CSS POI images have documented performance/quality issues.
- WebGPU path is incomplete relative to WebGL composer/plugins; default to WebGL unless tested.

## Resource-release rules

Use the narrowest correct operation:

- `removeFromParent`: detach and preserve resources for reuse.
- `component.remove`: detach child and update semantic tree.
- `component.dispose`: detach, clear listeners, dispose model geometry/material recursively.
- `meta.clear`: dispose only current WebGL scene; retain engine/plugins.
- `plugin.remove`/plugin-specific `dispose`: remove feature overlays, listeners, controls, passes.
- `meta.dispose`: terminal full cleanup.

For native objects:

```ts
object.removeFromParent();
geometry.dispose();
for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
  material.dispose();
}
texture.dispose();
```

Store and call every remover returned by `addEventListener`, `onRender`, `onResize`, plugin event registration, and interceptors. Stop camera travel/follow and animations during teardown.

## Errors and browser compatibility

- Missing mount selector: `el 不存在`.
- Unity repeated mount: `不可重复挂载`.
- Missing Unity URL: `未指定 Unity 连接地址`.
- Server mode without display URL throws.
- Component creation without URL throws.
- Root Component replacement throws; clear/render instead.
- POI missing text/URL/element throws.
- OS path not found throws; multiple layouts warn/use first.
- LOD without OrbitControls throws a string.
- IndexedDB absence warns and falls back to memory.
- WebGPU request in unsupported browser warns and falls back to WebGL.
- Draco WASM, WebAssembly, TextEncoder/TextDecoder, ResizeObserver, IndexedDB, WebSocket, and modern DOM APIs may need environment support. Package browserslist is `>1%`, last two versions, not dead, but actual Three.js 0.183.2 requirements are stricter than the package's historical Node `>=10` declaration.

## Packaging and test baseline

- Package entrypoints: CommonJS `lib/index.js`, ESM-like `es/index.js`, types `typings/index.d.ts`, UMD under `dist/@tslfe/`.
- There is no `exports` map; do not interpret that as approval for deep imports.
- Direct Node CommonJS loading currently fails on an extensionless Three examples subpath; direct native Node ESM loading also fails on directory imports. Use a browser bundler supported by the consuming app.
- Current `npm test` script targets missing `test/index.test.ts` and reports no tests.
- Package includes Draco files, but applications still need to serve/copy them at the configured URL.
