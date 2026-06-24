# WebGL Plugins

Import every factory from the root:

```ts
import { webglPlugin } from "@tslfe/dt-engine";
const instance = meta.plugin.use(webglPlugin.poi());
```

Do not import plugin implementation files. `meta.dispose()` removes installed plugins; explicit `plugin.remove(name)` is appropriate for earlier teardown.

## Plugin index

Each entry gives factory signature; required/default parameters; returned API; side effects/lifecycle; minimal use; and common errors. Native implementation details are mentioned only when they affect initialization, ownership, or teardown choices.

### `renderPass`

`webglPlugin.renderPass(): PluginCreator<{renderPass: RenderPass}>`. No required parameters. Adds a `RenderPass(scene,camera)` to the composer and disposes it on removal. Installed by default.

```ts
const pass = meta.plugin.get<{ renderPass: unknown }>("render-pass");
```

Do not install a duplicate; duplicate keys return the existing instance. This pass is an `EffectComposer` render pass, so ordering with other composer passes matters.

### `light`

`webglPlugin.light(props: DTLight | DTLight[])` where each item is `{type, color?, intensity?, position?}`. Supported types are `DirectionalLight`, `AmbientLight`, and `SpotLight`; unknown types warn. Defaults: directional `0xffe499`, intensity 5, position `[0.5,0.5,1]`; ambient `0xbababa`, `0.7`; spot `0xb0b0b0`, `0.8`, origin. Returns `{lights, createLight, remove, clear}`. Removal disposes lights.

```ts
const lights = meta.plugin.use(webglPlugin.light([
  { type: "AmbientLight", color: 0xffffff, intensity: 0.8 },
  { type: "DirectionalLight", color: 0xffffff, intensity: 0.8 }
]));
```

`createWebglEngine` already installs equivalent default lights. Use this plugin to replace or control engine-owned lights instead of adding unmanaged lights casually.

### `orbitControl`

`webglPlugin.orbitControl(props?: Record<string, any>)` returns `{control, mode("2d"|"3d"), enabled, update(time)}`. Defaults include damping false, max polar π/2, key pan 15, min distance 0.1; source contains misspelled `zommSpeed`. It binds the current camera and renderer canvas, stops camera animation on user interaction, updates each frame, and disposes controls on removal. Installed by default.

```ts
const orbit = meta.plugin.get<{ mode(type: "2d" | "3d"): void }>("orbit-control");
orbit?.mode("2d");
```

Backed by `OrbitControls`; do not create before `amount()` if relying on a usable canvas.

### `fxaaPass`

`webglPlugin.fxaaPass()` returns `{fxaaPass: ShaderPass}`. It configures FXAA resolution from container dimensions and pixel ratio, adds the pass only for WebGL, and disposes it. Requires composer/render pass ordering.

```ts
meta.plugin.use(webglPlugin.fxaaPass());
```

Backed by a shader pass; composer ordering matters.

### `skyBox`

`webglPlugin.skyBox({path, type?})` returns `{createSkybox, clear}`. `path` required; `type` defaults `.jpg`. Loads six cube faces named `posx` through `negz`. `clear()` sets background null but does not explicitly dispose the cube texture.

```ts
const sky = meta.plugin.use(webglPlugin.skyBox({ path: "/sky/", type: ".jpg" }));
```

Ensure all six cube-face files exist. `clear()` does not explicitly dispose the loaded cube texture.

### `hoverColor`

`webglPlugin.hoverColor({color?, opacity?})` returns `{hover, blur, interceptor, dispose}`. Defaults red and `0.5`. It listens to dt-engine hover events, stores/restores prior model color, and removes its event listener on disposal.

```ts
const hover = meta.plugin.use(webglPlugin.hoverColor({ color: "#00ffff", opacity: 0.4 }));
const removeGuard = hover.interceptor((event) => Boolean(event.params.component));
```

Call `removeGuard()` when replacing the interceptor. Fast pointer movement/removal can miss blur according to project issue notes.

### `stats`

`webglPlugin.stats({mode?})` returns `{update, remove}`. Mode `0=fps`, `1=ms`, `2=mb`; default 0. Appends a Stats panel and updates each frame; removal detaches it.

```ts
meta.plugin.use(webglPlugin.stats({ mode: 0 }));
```

Requires a mounted container. Three.js examples Stats panel.

### `color`

`webglPlugin.color(defaults?: {color?, opacity?})` returns `set(target, options?)`, `clear(target?)`, `dispose()`. Defaults red/0.5. Targets may be IDs, components, Object3Ds, or arrays. It tracks colored objects, clones/replaces materials where needed, and supports per-instance color.

```ts
const color = meta.plugin.use(webglPlugin.color());
color.set(component, { color: "#ffcc00", opacity: 0.6 });
color.clear(component);
```

Unknown IDs are ignored. Cleanup restores tracked objects and disposes overlay materials.

### `poi`, `poi2d`, `poiv2`

Factories:

- `webglPlugin.poi({scale?})`: CSS3D renderer.
- `webglPlugin.poi2d({scale?})`: CSS2D renderer.
- `webglPlugin.poiv2({scale?, type?})`: unified implementation; `type: "2d"` selects CSS2D, otherwise CSS3D.

Each returns `keepVisible`, `createText`, `createImage`, `createHtml`, `clear`, `clearAll`, `update`, `dispose`, an overlay renderer, and `addEventListener`. `createText` requires `text`; `createImage` requires `url`; `createHtml` requires an existing element. Instances support `applyToComponent`, `applyToType`, and/or `applyToPosition`.

```ts
const poi = meta.plugin.use(webglPlugin.poiv2({ type: "2d" }));
const label = poi.createText({ text: "Pump", offsets: { x: 0, y: 2, z: 0 } });
label.applyToComponent(component);
await poi.clear(component);
```

Side effects: appends a full-container CSS2D/CSS3D overlay renderer, registers resize/render/events, and may move supplied HTML elements into overlay DOM. `dispose()` clears POIs, removes overlay DOM/listeners, and restores HTML parents when supported. Large CSS images can blur in Chrome.

### `lod`

`webglPlugin.lod(options?)` returns `{reset, enable, disable, update}`. Defaults: include all, excludes floor/room/wall/group/city/campus/building, size 9 px, distance Infinity, throttle 50 ms. Uses supplied `OrbitControls` or the existing `"orbit-control"` plugin; missing control throws `"需要orbit-control实例"`.

```ts
const lod = meta.plugin.use(webglPlugin.lod({ include: "AICamera", size: 12 }));
lod.update();
```

It changes model visibility and restores it on plugin destruction. Current screen-size calculation samples only two box corners, so treat as approximate.

### `path`

`webglPlugin.path()` returns `create`, `transition`, `hide`, `show`, `remove`, `edit`, `clear`, plus `list` and `defaultPathData`.

`create(points, options?)` defaults: speed 1, radius 0.15, tubular segments 40 per point, radial segments 2, open, built-in arrow texture, white, indent 1, repeatY 2, offsets 0, Catmull-Rom, tension 0, depth test true. At least two points are required for editing/routes. Transition supports `speed`, `duration`, easing, and process callback.

```ts
const path = meta.plugin.use(webglPlugin.path());
const line = path.create([{x:0,y:0,z:0}, {x:5,y:0,z:5}], { color: "#00ffff" });
path.remove(line);
```

`show(points)` contains a source bug that sets visibility false for point-array lookup; use returned Mesh for reliable show. Clear generated route meshes on teardown.

### `boxSelection`

`webglPlugin.boxSelection(options?)` returns selection `list`, `start`, `end`, `clear`, `undo(sum=1)`, `dispose`, event registration, and internal `_update`. Defaults: polygon, red closed line, radius 0.02, radial segments 20, no texture. It auto-installs `tool` and `path` if absent and captures click/mousemove/contextmenu on the container.

```ts
const select = meta.plugin.use(webglPlugin.boxSelection({ mode: "rect" }));
const off = select.addEventListener("end" as any, () => console.log(select.list));
select.start();
```

Call `end`/`dispose` and listener removers. Starting twice warns. Dense polygon input has documented performance/sliding issues.

### `picker`

`webglPlugin.picker({})` returns `fromVector2`, `fromVector3`, `fromMulVector3`, `fromBrowserEvent`; all return matching Components.

```ts
const picker = meta.plugin.use(webglPlugin.picker({}));
const hits = picker.fromBrowserEvent(event);
```

Requires rendered components and correct canvas coordinates. Uses ray picking under the wrapper.

### `tool`

`webglPlugin.tool()` returns:

- `containsComponent(positions, mode="all")`
- `buildCoordinateConvertor([{gps,vector3}, ...])`
- `calculateDistance(points)`
- `createMeasure(start)(current)`
- `threeCoordinateToScreenPoint(position)`
- `screenPointToThreeCoordinate(x,y)`

```ts
const tool = meta.plugin.use(webglPlugin.tool());
const screen = tool.threeCoordinateToScreenPoint(component.model.position);
```

Coordinate conversion accepts only one or two calibration pairs and throws otherwise. Screen-to-world can return null.

### `space`

`webglPlugin.space()` returns `render(target, {url?, replace=false}?) => Promise<Component>`. It loads mapping/options, creates a child component, copies target transform, then nests or replaces the target.

```ts
const space = meta.plugin.use(webglPlugin.space());
await space.render(component, { replace: false });
```

Missing target, URL, or replace-parent throws. Its generated declaration contains an invalid internal `dt-engine/src/...` type import and runtime calls the ignored second argument of `createComponent`; treat as fragile.

### `threeLoader3dtiles`

`webglPlugin.threeLoader3dtiles({url})` is publicly exposed but current `setup`, render, and teardown implementation are commented out and return `void`.

Do not claim that it loads tiles. It is intended for 3D Tiles runtime support but is currently nonfunctional.

### `envRoom`

`webglPlugin.envRoom({sigma, near, far})` returns `{remove}`. All fields are declared required; Three.js underlying defaults are documented as sigma 0, near 0.1, far 100, but source passes values directly, so provide them explicitly. WebGL only; sets `scene.environment` using `RoomEnvironment` and PMREM. `remove` disposes texture/generator but does not clear `scene.environment`.

```ts
meta.plugin.use(webglPlugin.envRoom({ sigma: 0, near: 0.1, far: 100 }));
```

Use this when PMREM environment lighting is desired; dispose/remove explicitly during feature teardown.

### `lightSky`

`webglPlugin.lightSky(props?: unknown)` returns `void`. It adds a hemisphere light and generated physical sky mesh during setup, but exposes no control object and declares no destroyed cleanup.

Use only when accepting engine-lifetime ownership; prefer `light` plus `skyBox/envRoom` when teardown control matters.

## TacOS integrations: both variants are supported references

### `webglPlugin.os`

Factory is `webglPlugin.os()`; plugin key is `"os-animation"`. It returns:

```ts
{
  connect(options: ConnectOptions): Promise<Core>;
  loadModelUrl(path: string): Promise<string>;
  enter(path: string, hook?: (url: string) => string): Promise<Component<WebglModel>>;
  compile(path: string, hook?: (url: string) => string): Promise<Object3D>;
  event: TacosEventEmitter;
  dispose(): void;
}
```

Current layout lookup searches `Root`, then `Space.layouts`, selecting entries where `layout.data.type === "glb"` and returning `layout.data.url`. It emits normalized device/space/spaceEvent and wildcard events; current source does not map scene events.

```ts
const os = meta.plugin.use(webglPlugin.os());
await os.connect(connectOptions);
await os.enter("/campus/building/floor");
```

Absolute paths use TacOS lookup; non-absolute paths render directly with mapping. Call `connect` before absolute `loadModelUrl`, `enter`, or `compile`. No match throws; multiple matches warn and use the first. `dispose` destroys TacOS and listeners; plugin removal/meta disposal also calls it.

### `webglPlugin.osV1`

Factory and plugin key are both `"os-v1"`. Returned API and lifecycle match `os`, but legacy lookup uses `space.layout.get("glb")` and returns the first layout's `uri`. It also maps legacy scene events.

```ts
const osV1 = meta.plugin.use(webglPlugin.osV1());
await osV1.connect(connectOptions);
await osV1.enter("/legacy-space");
```

Use `osV1` only for TacOS data exposing the legacy `layout.get("glb")` shape. Do not substitute one variant for the other based only on naming.

## Returned-method call index

Use this index to locate the minimum valid shape for less common instance methods:

```ts
const renderPass = meta.plugin.use(webglPlugin.renderPass());
renderPass.renderPass.enabled = true;

const light = meta.plugin.use(webglPlugin.light({ type: "AmbientLight" }));
light.createLight({ type: "SpotLight", position: [0, 5, 0] });
light.remove([...light.lights][0]);
light.clear();

const orbit = meta.plugin.use(webglPlugin.orbitControl());
orbit.mode("3d");
orbit.enabled = false;
orbit.update(performance.now());

const fxaa = meta.plugin.use(webglPlugin.fxaaPass());
fxaa.fxaaPass.enabled = true;

const sky = meta.plugin.use(webglPlugin.skyBox({ path: "/sky/" }));
sky.createSkybox({ path: "/other-sky/", type: ".png" });
sky.clear();

const hover = meta.plugin.use(webglPlugin.hoverColor({}));
hover.hover(component);
hover.blur();
const offInterceptor = hover.interceptor(() => true);
hover.dispose();

const stats = meta.plugin.use(webglPlugin.stats({ mode: 0 }));
stats.update();
stats.remove();

const color = meta.plugin.use(webglPlugin.color());
color.set(component, { color: "#ff0000", opacity: 0.5 });
color.clear(component);
color.dispose();

const poi = meta.plugin.use(webglPlugin.poiv2({ type: "2d" }));
poi.createText({ text: "A" }).applyToComponent(component);
poi.createImage({ url: "/marker.png" }).applyToPosition({ x: 0, y: 1, z: 0 });
poi.createHtml({ el: htmlElement }).applyToComponent(component, (_target, options) => options);
poi.keepVisible = false;
poi.update();
await poi.clear(component);
await poi.clearAll();
const offPoi = poi.addEventListener("click", console.log);
poi.dispose();

const lod = meta.plugin.use(webglPlugin.lod());
lod.update();
lod.disable();
lod.enable();
lod.reset();

const path = meta.plugin.use(webglPlugin.path());
const points = [{ x: 0, y: 0, z: 0 }, { x: 5, y: 0, z: 5 }];
const line = path.create(points);
path.hide(line);
path.show(line);
const transition = path.transition(points);
await transition.to({ x: 10, y: 0, z: 10 });
await transition.back(1);
const editor = path.edit(points);
editor.add({ x: 8, y: 0, z: 8 });
editor.insert(1, { x: 2, y: 0, z: 2 });
editor.remove(1);
editor.end();
path.remove(line);
path.clear();

const selection = meta.plugin.use(webglPlugin.boxSelection({ mode: "rect" }));
const offSelection = selection.addEventListener("end" as any, console.log);
selection.start();
selection.undo();
selection.end();
selection.clear();
selection.dispose();

const picker = meta.plugin.use(webglPlugin.picker({}));
picker.fromVector2({ x: 0, y: 0 });
picker.fromVector3({ x: 0, y: 0, z: 0 });
picker.fromMulVector3({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 });
picker.fromBrowserEvent(mouseEvent);

const tool = meta.plugin.use(webglPlugin.tool());
tool.containsComponent(points);
const convert = tool.buildCoordinateConvertor(calibration);
convert.toVector3({ longitude: 0, latitude: 0 });
convert.toGps({ x: 0, y: 0, z: 0 });
tool.calculateDistance(points);
tool.createMeasure(points[0])(points[1]);
tool.threeCoordinateToScreenPoint(points[0]);
tool.screenPointToThreeCoordinate(100, 100);

const space = meta.plugin.use(webglPlugin.space());
await space.render(component, { replace: false });

const environment = meta.plugin.use(
  webglPlugin.envRoom({ sigma: 0, near: 0.1, far: 100 })
);
environment.remove();

meta.plugin.use(webglPlugin.lightSky({}));
meta.plugin.use(webglPlugin.threeLoader3dtiles({ url: "/tileset.json" })); // returns void; no current effect

offInterceptor();
offPoi();
offSelection();
meta.plugin.remove("orbit-control");
```

The placeholders must have the types implied by the surrounding method. Do not copy the `threeLoader3dtiles` line as a working feature; it is shown only to document the public signature.
