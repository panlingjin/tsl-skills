# WebGL API

All dt-engine imports in this file come from `@tslfe/dt-engine`.

## `createWebglEngine` and `WebglConfig`

```ts
createWebglEngine(
  callback?: (config: WebglConfig) => WebglConfig
): Promise<Meta<WebglCreator>>
```

`WebglConfig` is not a named root type export, so infer the callback parameter rather than importing an internal type.

| Config field | Required / default | Behavior and constraints |
| --- | --- | --- |
| `decoderPath` | `/dt-engine/draco/` | Must resolve to deployed Draco decoder assets. |
| `decoderType` | `"wasm"`; `"js" | "wasm"` | Passed to `DRACOLoader`. |
| `modelPath` | `/` | Base used by mapping parser. |
| `renderer` | `{type:"webgl", effect:false, autoRender:true}` | `type` accepts `auto`, `webgl`, `webgpu`. |
| `cache` | enabled, 12 hours | Loader cache uses IndexedDB when available, memory otherwise. |
| `scene` | cache false, 12 hours, `SceneCacheType.enter` | Optional compiled scene cache. |
| `encrypt` | disabled; key `/dt-engine/encryption/key`, license `/` | Failed/expired license may redirect browser. |
| `performance` | autoMerge true, silent true, wall/door merge types; source `mergedTypes` default is `[]` | Mapping/render optimization. For generated project code, explicitly set `config.performance.mergedTypes` to `["floor"]` so floor mapping URLs use `graphic_merged.glb`. Root API does not export `ComponentType`; use a local `typeof config.performance.mergedTypes` cast instead of importing internals. |
| `themes.camera` | fov 10, near 10, far 20000, position `{0,800,500}`, target origin | Camera source defaults. |
| `themes.render` | antialias/alpha true, precision `lowp` | WebGL renderer options. |
| `themes.orbitControls` | damping, max polar π/2, key pan 20, min distance 0.1 | Used only when configuring the plugin explicitly. |
| `themes.hover/selected` | red, opacity 0.5 | Visual state defaults. |
| `plugins` | render pass, default lights, orbit controls | Replace/append plugin creators before returning config. |
| `interceptor.beforeRender` | absent | Return modified `ComponentOptions`; returning `void` skips that item. |

Side effects: creates renderer immediately and touches `navigator`; browser DOM is required. Minimal:

```ts
const meta = await createWebglEngine((config) => {
  config.decoderPath = "/assets/draco/";
  config.performance.mergedTypes = ["floor"] as typeof config.performance.mergedTypes;
  return config;
});
meta.amount(container);
await meta.render("/models/site.glb", true);
```

Common errors: forgetting to return config; missing DOM; invalid Draco path; calling before container exists. Native mapping: application bootstrap around `Scene`, `PerspectiveCamera`, renderer, loaders, composer.

## `WebglCreator`

| API | Signature, defaults, return | Side effects / lifecycle | Common error / Three.js concept |
| --- | --- | --- | --- |
| `amount` | `(el: string | HTMLElement) => void` | Appends internal div/canvas, observes resize, starts frame queue. Repeated calls only resize. | Missing selector throws `el 不存在`. Mount once after DOM exists. |
| `render` | `(url: string, mapping = false) => Promise<Component<WebglModel>>` | Disposes previous scene; with mapping loads sibling `meta.json`; builds component tree; compiles shaders. Same URL returns current tree. | Source default is `false`, but generated business scene/floor/campus loading code should call `render(url, true)`. Omit/pass `false` only for standalone GLB without sibling mapping. Always await. |
| `compile` | `(url: string, mapping = false, force = false) => Promise<Object3D>` | Preloads/caches an Object3D snapshot; concurrent same-URL requests coalesce. | `force` evicts scene cache first. Native `Object3D` result is not a Component. |
| `clear` | `() => Promise<void>` | Disposes current tree and clears current URL, preserving engine/plugins. | Prefer for scene switch without destroying engine. |
| `dispose` | `() => Promise<void>` through `Meta` | Clears plugins, current tree, renderer/composer/canvas, loader queue, global frame loop, listeners. | Terminal; do not reuse instance. |
| `loadOption` | `(url: string) => Promise<ComponentOptions>` | `.json` loads directly; other URL resolves sibling `meta.json`. Mapping loader catches errors and returns `[]`. | Validate returned shape; mapping failure can look like empty data. |
| `createComponent` | `(options: string | Partial<ComponentOptions>, url?: string) => Promise<Component<WebglModel>>` in declaration; runtime ignores second argument | Loads a standalone model/component but does not add it to current tree automatically. String is treated as model URL. | URL is required. Add with `meta.add` or `parent.add`. Declaration/source mismatch on second argument. |
| `container` | `HTMLElement | undefined` readonly | Internal wrapper div after construction. | Use for overlays; do not remove it manually. |
| `component` / `global` | current root component or `undefined` | Updated by `render`/`clear`. | Check after awaited render. |
| `model` | root `WebglModel | undefined` | Shortcut to `component?.model`. | Not a semantic tree. |
| `loader` | public Loader instance | Allows `loadModel`, `load`, `loadMapping`, `clear`; disposed by meta. | Do not dispose independently unless abandoning engine. |

## `Meta<T>`

| API | Signature / default / return | Side effects and errors | Three.js concept |
| --- | --- | --- | --- |
| `search` | `(type: string, shallow = false) => Component[]` | Includes root if matching. `shallow=true` checks direct children only. | Semantic type query. |
| `get` | `(id: string, shallow = false) => Component | undefined` | Matches `modelId`, business `id`, or comma-delimited ID subset. | `getObjectByName` plus business IDs. |
| `filter` | `(predicate, shallow = false) => Component[]` | Includes root if predicate matches. | Scene traversal. |
| `add` | `(child: Component) => Promise<void>` | Sets root if absent; otherwise adds below current root. | `Object3D.add`. |
| `remove` | `(child: Component) => Promise<void>` | Detaches from parent without geometry/material disposal. | `removeFromParent`. |
| `clear` | backend-specific `() => Promise<void>` | WebGL disposes current scene; Unity warns and does nothing. | Scene clearing. |
| `dispose` | `() => Promise<void>` | Clears plugins first, then backend resources. | Full renderer/app teardown. |
| `use` | `(extension: (meta) => any) => result` | Calls arbitrary extension; built-in plugin installation normally uses `plugin.use`. | Extension injection. |
| `plugin.use` | `(creator) => plugin instance` | Same plugin key returns existing instance and warns. | Add-on manager. |
| `plugin.get/has` | `(name) => instance/boolean` | Read only. Note `webglPlugin.os` key is `"os-animation"`. | Add-on registry. |
| `plugin.remove` | `(nameOrCreator) => void` | Runs plugin `destroyed` cleanup. | Remove pass/control/helper. |
| `plugin.clear` | `() => void` | Disposes all plugins; called by meta disposal. | Full add-on cleanup. |

## `Component` and `ComponentGroup`

Properties: `id`, `modelId`, `type`, `ext`, `parent`, `children`, `model`, `isComponent`.

| API | Signature / return | Lifecycle and errors | Three.js mapping |
| --- | --- | --- | --- |
| `search/get/filter` | Same traversal semantics as Meta; search/filter return `ComponentGroup` | Operates below this node. | Subtree traversal. |
| `add` | `(child: Component | string | Partial<ComponentOptions>, attach = false) => Promise<Component>` | Existing component is attached; string/options path requires URL. Runtime returns the parent for an existing child, but a newly constructed child for options. | `add` or `attach`. |
| `remove` | `(child) => Promise<void>` | Detaches child and updates semantic tree; does not dispose. | `Object3D.remove`. |
| `removeFromParent` | `() => Promise<void>` | Detaches this component and semantic relation; preserves GPU resources. | `Object3D.removeFromParent`. |
| `replace` | `(target) => void` | Replaces sibling relation and model. Root replacement throws; use `meta.clear`. | Parent swap. |
| `clear` | `() => Promise<void>` | Disposes children; implementation starts child promises without awaiting all of them. | Subtree cleanup. |
| `dispose` | `() => Promise<void>` | Recursively disposes listeners, geometry, and materials. Some recursive calls are not awaited; avoid immediate reuse. | GPU resource disposal. |
| group `.model` setters | `visible`, `color`, `opacity`, `disabled` | Batch mutation. | Multi-object mutation. |
| group cleanup | `removeFromParent/dispose/clear(): Promise<void>` | Iterates group. Model-group implementation does not await each internal call despite Promise type. | Batch detach/dispose. |

## `WebglModel`

Publicly extends `Object3D` and `DTModel`, and exposes `target`, `isInstancedMesh`, `instancedId`.

| API | Type / default / return | Side effects / pitfalls | Three.js mapping |
| --- | --- | --- | --- |
| `position`, `scale`, `rotation` | `{x,y,z}`; rotation radians and optional Euler order | Setters propagate transform deltas to logical descendants; instanced models update matrices/bounds. | Object3D transforms. |
| `visible` | boolean | Inherited Object3D visibility. | `Object3D.visible`. |
| `color` | setter string; runtime accepts `"color opacity"` and empty string to restore | Clones/draws materials; for instancing sets per-instance color/opacity. | Material color overlay. |
| `opacity` | setter number | Non-instanced materials are cloned once and made transparent; instanced geometry gets `instanceOpacity`. | Material opacity. |
| `disabled`, `selected` | Declared, but WebGL source implementation is commented out | Do not rely on these for WebGL behavior; use plugins/events. | No stable native equivalent. |
| `add/attach/remove/replace` | Model-level hierarchy methods | Do not update semantic Component tree when called directly. Prefer Component methods. | Object3D hierarchy. |
| `removeFromParent` | `Promise<void>` | Detaches only. | Object3D detach. |
| `dispose` | `Promise<void>` | Recursively removes and disposes geometry/material. Shared resources may be invalidated if manually shared. | Explicit GPU cleanup. |

## `WebglScene`

- `skybox(path: string, format = ".jpg"): void`: loads `posx/negx/posy/negy/posz/negz`; asynchronous texture load; no returned Promise.
- `skycolor(color: string): void`: sets `Scene.background = new Color(color)`.
- Inherited `Scene.add`: accepts native Three.js objects. Objects added directly are not owned by the component tree; dispose them manually.

## `WebglRenderer`

| API | Signature/default | Lifecycle |
| --- | --- | --- |
| `type` | `"webgl" | "webgpu"` | `webgpu` falls back to WebGL if unsupported and warns. |
| `start/stop` | `() => void` | Toggles dt-engine rendering; plugins may inspect `isPaused`. |
| `render` | `() => void` | Immediate render. Composer/direct-render condition in source is inconsistent with frame render; avoid manual loops unless needed. |
| `resize` | `(width?, height?) => void` | Defaults to mounted container size; updates pixel ratio, composer, passes, camera listener. |
| `onRender` | `(fn: (time) => void) => () => void` | Registers global frame callback; always call returned remover. |
| `onResize` | `(fn: (w,h) => void) => () => void` | Always call returned remover. |
| `dispose` | `() => void` | Removes canvas, composer, renderer, observer, and frame callback. Prefer `meta.dispose()`. |

Browser requirements: DOM, Canvas/WebGL, `requestAnimationFrame`, `ResizeObserver` or window resize fallback, IndexedDB optional, WebAssembly for encrypted/Draco workflows. WebGPU is optional and experimental in this package.

## `WebglCamera`

Inherited PerspectiveCamera members remain available. Wrapper methods:

| API | Signature/default/return | Behavior / common error |
| --- | --- | --- |
| `lookAt` | `(vector) | (x,y,z)` | Updates wrapper target through overridden runtime method. |
| `flyTo` | Public declaration `(lookAt, params?) => void`; runtime returns `BaseAnimation` | Defaults duration 3000, distance 3, route `none`, Quartic easing. Treat return as unsupported in consumer types unless locally narrowed. |
| `travel` | `(positions, options?) => AnimationActions` | `duration` overrides `speed`; mode optional/loop/reverse; stop returned action on teardown. Empty positions are invalid. |
| `moveAlong` | `(positions, options?) => AnimationActions` | Moves camera through points; stop on teardown. |
| `adjust` | `(options?) => BaseAnimation` | Frames current component/scene; source defaults apply. |
| `setZoom` | `({zoom, duration=1000, easing=Quartic.InOut}) => void` | Updates projection matrix via tween. |
| `follow` | `(modelOrComponent, options?) => {continue,stop}` | Registers frame callback; `stop()` is mandatory. Options support remains incomplete. |
| `faceTo` | `(target, {duration=800, zoom=current, easing?}) => void` | Tweens look target and zoom. |
| `fit` | `(options) => () => void` | WebGL implementation is TODO/no-op; do not rely on it. |
| `stop` | `() => void` | Stops current camera animation. |

## Loader

`loadModel(url, progress?) => Promise<GLTF>`, `load<T>(url, progress?, responseType?)`, `loadMapping(url)`, `clear(url?)`, `dispose()`.

- Maximum parallel loads: six.
- Same-URL requests are coalesced.
- Cache expiry default: 12 hours.
- `loadMapping` swallows parse/network errors and resolves `[]`.
- `dispose` clears pending records/queue and Draco loader, but does not clear persistent cache.
- Loader uses `GLTFLoader.parseAsync`, `DRACOLoader`, `FileLoader`, optional decryption.

## Minimal call index

```ts
meta.amount(container);
const root = await meta.render("/scene.glb", true);
await meta.compile("/scene.glb", false, true);
const options = await meta.loadOption("/scene.glb");
const child = await meta.createComponent("/child.glb");

meta.search("Light");
meta.get("model-id");
meta.filter((component) => component.model.visible);
await meta.add(child);
await meta.remove(child);       // detach, preserve resources
await meta.clear();             // dispose current WebGL scene

root.search("Light");
root.get("model-id");
root.filter((component) => component.ext.tags.includes("alarm"));
await root.add(child, true);
await root.remove(child);
await child.removeFromParent();
child.replace(await meta.createComponent("/replacement.glb"));
await root.clear();
await root.dispose();

root.model.position = { x: 1, y: 2, z: 3 };
root.model.rotation = { x: 0, y: Math.PI / 2, z: 0 };
root.model.scale = { x: 2, y: 2, z: 2 };
root.model.color = "#ff0000 0.5";
root.model.opacity = 0.5;

meta.scene.skycolor("#20242c");
meta.scene.skybox("/sky/", ".jpg");
meta.scene.add(nativeObject);

meta.renderer.stop();
meta.renderer.start();
meta.renderer.resize();
meta.renderer.render();
const offFrame = meta.renderer.onRender((time) => update(time));
const offResize = meta.renderer.onResize((width, height) => layout(width, height));

meta.camera.lookAt(0, 0, 0);
meta.camera.flyTo(root, { distance: 10, duration: 1000 });
const travel = meta.camera.travel([root], { speed: 0.5 });
const move = meta.camera.moveAlong([root.model.position], { duration: 1000 });
meta.camera.adjust({ distance: 1.2 });
meta.camera.setZoom({ zoom: 2 });
const follow = meta.camera.follow(root);
meta.camera.faceTo(root, { zoom: 2 });
meta.camera.stop();

await meta.loader.loadModel("/model.glb");
await meta.loader.load<ArrayBuffer>("/data.bin", undefined, "arraybuffer");
await meta.loader.loadMapping("/meta.json");
await meta.loader.clear("/model.glb");

travel.stop();
move.stop();
follow.stop();
offFrame();
offResize();
await meta.dispose();
```

Names such as `nativeObject`, `update`, and `layout` above are caller-owned placeholders. `fit()` is intentionally omitted because its WebGL implementation is a no-op.
