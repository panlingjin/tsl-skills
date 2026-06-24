# Unity and Cloud API

Unity/Cloud is a remote Model API backend over WebSocket. It is not a Three.js renderer and does not expose WebGL scene resources.

## `createCloudEngine`

```ts
createCloudEngine(
  callback?: (config: UnityConfig) => UnityConfig
): Promise<Meta<UnityCreator>>
```

`UnityConfig` combines `{mode:"client"|"server", displayUrl, plugins}` with optional socket fields: `url`, protocols, heartbeat/reconnect timings, repeat limit, and interceptors. Source defaults: client mode, empty display URL, no plugins, and no built-in `url`. Generated code should let callers configure both `mode` and `url`; default `mode` to `"client"` and default `url` to `"ws://127.0.0.1:8181"` only when the caller did not provide one. Source requires `url` when connecting; retry limit defaults to 5.

```ts
type CloudMode = "client" | "server";

type CloudOptions = {
  mode?: CloudMode;
  url?: string;
  displayUrl?: string;
};

async function createCloud(container: HTMLElement, options: CloudOptions = {}) {
  const {
    mode = "client",
    url = "ws://127.0.0.1:8181",
    displayUrl
  } = options;

  const meta = await createCloudEngine((config) => ({
    ...config,
    mode,
    url,
    displayUrl
  }));

  meta.amount(container);
  return meta;
}
```

Callers can override `url` for production or remote services:

```ts
const meta = await createCloud(container, {
  url: "wss://cloud.example.com/unity",
  mode: "client"
});
```

In `server` mode, also pass a valid `displayUrl`; dt-engine will not infer it:

```ts
const meta = await createCloud(container, {
  mode: "server",
  url: "ws://127.0.0.1:8181",
  displayUrl: "http://127.0.0.1:8080/display"
});
```

Creation waits for socket `"loaded"`, creates the Unity facade, and calls `meta.render()` before resolving. In server mode, `amount()` also requires `displayUrl` and mounts an iframe. Repeated `amount()` throws.

## `UnityCreator`

| API | Signature / return | Side effects and lifecycle | Error / concept |
| --- | --- | --- | --- |
| `amount` | `(el) => void` | Stores container; server mode appends iframe; configured plugins and mouse events install after mount. | Missing element, repeated mount, or empty server `displayUrl` throws. |
| `render` | `(spaceId?, freshMapping=false) => Promise<Component<UnityModel>>` | Optionally refreshes scene metadata; invokes `GoIntoSpace`; updates current component. | Mapping parse error logs raw data and throws. |
| `reset` | `() => Promise<void>` | Invokes `ResetScene`, then refreshes root mapping. | Unity only. |
| `clear` | `() => Promise<void>` | Warns and does nothing. | Do not use for Unity scene cleanup. |
| `dispose` | through Meta `Promise<void>` | Clears plugins, camera listeners, components, socket, iframe, events. | Terminal. |
| `unity` | `UnitySocket` readonly | Low-level socket is publicly reachable through type, but prefer wrapper/plugin APIs. | Direct Model API coupling. |
| `component/global/model` | current/root model shortcuts | `global` is full mapping tree; `component` is current space. | May be undefined before render. |
| `renderer` | empty `DTRender` facade | No supported renderer methods. | Do not port WebGL renderer calls. |
| `scene` | typed with `skybox/skycolor`, but source scene returns empty object | Effectively unsupported. | Type/source conflict; do not call. |
| `createComponent` | runtime TODO, absent from `UnityCreator` declaration | Unsupported. | Do not use. |

Meta and Component traversal APIs match WebGL semantically, but Unity project notes report shallow-search inconsistencies on some scenes.

## `UnityModel`

Extends shared `DTModel` and adds:

```ts
update(params: {
  position?: {x:number;y:number;z:number};
  scale?: {x:number;y:number;z:number};
  rotation?: {x:number;y:number;z:number;order:string};
  duration?: number;   // seconds
  moveSpeed?: number;  // m/s
}): Promise<void>
```

Model property mutations issue Unity Model API requests rather than changing an Object3D. Await async operations. `dispose/removeFromParent` affect remote scene objects.

## `UnityCamera`

Shared type declares `lookAt`, `fit`, `setZoom`, `flyTo`, `travel`, `stop`, `follow`, `faceTo`; Unity adds `move`, `update`, `dispose`, and position setter.

- `flyTo` runtime is async even though shared declaration says void; source sends `ChangeViewPoint`, default duration 2 seconds, default angles 45/45 when no position/lookAt, default distance 15.
- `faceTo` focuses a model or delegates coordinates to flyTo; defaults duration 2000 ms and zoom/distance scale 5.
- `follow` returns `{continue,stop}` and sends follow requests.
- `fit` invokes hover-around and returns a stop function; speed defaults 36.
- `travel` chains async flyTo calls; pause/continue are incomplete, while stop prevents subsequent steps.
- `setZoom` and `moveAlong/adjust` are not supported.
- `move(direction, offset, duration)` validates Left/Right/Up/Down/Forward/Back; default offset expression is 10; duration is converted from ms to seconds.
- `dispose` removes notification listeners.

## Unity plugins

Install from `unityPlugin`, never internal paths.

### `unityPlugin.poi`

Returns `TemplateType`, `createText`, `createImage`, `createHtml`, `createTemplate`, `clear`, `clearAll`, `update`, `dispose`, and `addEventListener`. Text requires text, image requires URL, template requires template, HTML requires element plus Unity commonly needs numeric width/height. Apply methods are async and operate on components, types, positions, or string IDs.

```ts
const poi = meta.plugin.use(unityPlugin.poi());
const marker = poi.createTemplate({
  template: poi.TemplateType.symbol_3,
  text: "Alarm"
});
await marker.applyToComponent(component);
```

Dispose removes Unity notifications; clear remote objects before teardown where needed.

### `unityPlugin.tool`

`toScreenPoint(position) => Promise<{x,y}>`, plus `dispose()`. Converts world coordinates through Unity Model API. Install, await conversion, remove plugin/meta when done.

### `unityPlugin.effect`

Returns async creators for point, area, line, heatmap, temperature-map, and segmented defence-wall effects. Created handles expose `remove`; heat/temperature maps expose updates/visibility, and wall effect exposes color update. All options are required according to their creator type; invalid or version-incompatible Model API calls reject.

```ts
const effects = meta.plugin.use(unityPlugin.effect());
const effect = await effects.createPointEffect(options);
effect.remove();
```

These are Unity effects, not Three.js particles/materials.

### `unityPlugin.ai`

Returns `invoke`, `before`, `after`, `action`, `dispose`, and `ActionType` (`scene`, `panel`, `poi`, `camera`, `model`, `view`). It dispatches configurable AI actions and logs warnings for unimplemented actions. Dispose interceptors/actions when replacing.

### `unityPlugin.robot`

`unityPlugin.robot({map_calibration:{robot,three}})` returns `update(component, params)`. Both coordinate arrays must have equal lengths and at least three points or setup throws. It transforms robot 2D positions into Unity coordinates before model update.

## Capability matrix

| Capability | WebGL | Unity/Cloud |
| --- | --- | --- |
| `amount`, `render`, query, events, dispose | Yes | Yes |
| `clear` current scene | Yes | No-op warning |
| `compile`, `loadOption`, `createComponent` | Yes | Unsupported |
| `reset` remote scene | No | Yes |
| renderer API/composer | Yes | No |
| scene background/add native object | Yes | No |
| model as Object3D | Yes | No |
| Model API effects/POI | No | Yes |

## Minimal call index

```ts
const mode: "client" | "server" = userSelectedMode ?? "client";
const url = userConfiguredUrl ?? "ws://127.0.0.1:8181";

const meta = await createCloudEngine((config) => ({
  ...config,
  mode,
  url
}));
meta.amount(container);
const space = await meta.render("space-id");
await meta.render("space-id", true); // refresh mapping
await meta.reset();

meta.search("Camera");
meta.get("model-id");
meta.filter((component) => component.model.visible);

await space.model.update({
  position: { x: 1, y: 2, z: 3 },
  duration: 1
});

meta.camera.lookAt(0, 0, 0);
meta.camera.flyTo(space, { distance: 5, duration: 2000 });
meta.camera.faceTo(space, { zoom: 3 });
const stopOrbit = meta.camera.fit({ target: space, speed: 36 });
const follow = meta.camera.follow(space);
const travel = meta.camera.travel([space], { duration: 1000 });
meta.camera.move("Forward", 10, 1000);
meta.camera.stop();
await meta.camera.update();

const poi = meta.plugin.use(unityPlugin.poi());
await poi.createText({ text: "A" }).applyToComponent(space);
await poi.createImage({ url: "/marker.png" }).applyToPosition({ x: 0, y: 1, z: 0 });
await poi.createHtml({ el: htmlElement, width: "100px", height: "50px" }).applyToComponent(space);
await poi.createTemplate({ template: poi.TemplateType.symbol_1, text: "A" }).applyToComponent(space);
await poi.update({ text: "B" } as any, space);
await poi.clear(space);
await poi.clearAll();
const offPoi = poi.addEventListener("click", console.log);
poi.dispose();

const tool = meta.plugin.use(unityPlugin.tool());
await tool.toScreenPoint({ x: 0, y: 0, z: 0 });
tool.dispose();

const effects = meta.plugin.use(unityPlugin.effect());
const point = await effects.createPointEffect(pointOptions);
const area = await effects.createAreaEffect(areaOptions);
const line = await effects.createLineEffect(lineOptions);
const heat = await effects.createHeatMapEffect(heatMapOptions);
const temperature = await effects.createTemperatureMapEffect(temperatureOptions);
const wall = await effects.createSegmentDefenceWallEffect(wallOptions);
point.remove();
area.remove();
line.remove();
heat.update([{ x: 0, y: 0, z: 0, w: 1 }]);
heat.updateSetting(heatMapSetting);
heat.setVisiblity(false);
temperature.setVisiblity(false);
wall.updateColor([{ id: "wall-id", color: "#ff0000" }]);

const ai = meta.plugin.use(unityPlugin.ai());
ai.before((type, params) => params);
ai.after((type, params) => params);
ai.action(ai.ActionType.CAMERA, (params, previous) => previous(params));
ai.invoke(ai.ActionType.CAMERA, {});
ai.dispose();

const robot = meta.plugin.use(unityPlugin.robot({
  map_calibration: { robot: robotPoints, three: scenePoints }
}));
robot.update(space, { position: { x: 1, y: 2 } });

stopOrbit();
follow.stop();
travel.stop();
offPoi();
await meta.dispose();
```

Option placeholders such as `pointOptions` must follow the corresponding public declaration. `meta.clear`, Unity `setZoom`, `moveAlong`, and `adjust` are intentionally absent because the backend does not support them.
