# API Reference and Index

This reference describes `@tslfe/dt-engine@4.4.4-0`. Runtime Three.js is `0.183.2`; the repository's `@types/three@0.177.0` is stale.

## Authority and import boundary

Use only:

```ts
import DTEngine, {
  createWebglEngine,
  createCloudEngine,
  createNodeServer,
  createCesiumEngine,
  webglPlugin,
  unityPlugin
} from "@tslfe/dt-engine";
```

The default export contains the runtime values listed below, except `SceneCacheType`. Prefer named imports. Types are named exports. Files published under `es/`, `lib/`, and `typings/` are implementation artifacts, not supported subpath contracts.

## Root runtime export index

| Export | Signature / value | Required/default | Return and lifecycle | Minimal use | Common error / lifecycle note |
| --- | --- | --- | --- | --- | --- |
| `createWebglEngine` | `(callback?: (config: WebglConfig) => WebglConfig) => Promise<Meta<WebglCreator>>` | Callback optional; must return config | Creates scene/camera/renderer/loader and default plugins. Call `amount`, then `render`; finish with `await dispose()` | `await createWebglEngine(c => { c.performance.mergedTypes = ["floor"] as typeof c.performance.mergedTypes; return c; })` | Mutating config without returning it yields invalid setup. |
| `createCloudEngine` | `(callback?: (config: UnityConfig) => UnityConfig) => Promise<Meta<UnityCreator>>` | Callback optional; user-configurable `url`, default example URL `ws://127.0.0.1:8181`; `mode` default `client` | Connects socket and renders mapping before resolving; plugins/events are installed on `amount` | `await createCloudEngine(c => ({...c, mode, url}))` | Remote Unity scene, not Three.js renderer. |
| `createNodeServer` | `(options: NodeServerConfig) => Promise<NodeServer>` | Socket URL required | Opens Node/Unity service connection; call `server.dispose()` | `await createNodeServer({url})` | Remote renderer process manager. |
| `createCesiumEngine` | `(callback?: (config: CesiumConfig) => CesiumConfig) => Promise<void>` | None | Current source is an empty placeholder | Do not call in production | No implemented Cesium equivalent. |
| `webglPlugin` | Object of plugin factories | Factory-specific | Install with `meta.plugin.use(factory(...))`; `meta.dispose()` clears installed plugins | `meta.plugin.use(webglPlugin.poi())` | Duplicate key returns existing instance. |
| `unityPlugin` | Object of Unity plugin factories | Factory-specific | Install after Cloud engine creation; auto-configured plugins install during `amount` | `meta.plugin.use(unityPlugin.poi())` | Unity Model API helpers. |
| `SceneCacheType` | Enum: `enter`, `leave` | Default `enter` | Controls when WebGL scene snapshots are cached | `config.scene.cacheType = SceneCacheType.enter` | Scene cache can serve stale assets after studio updates. |
| `definePlugin` | `<P,S,M>(name, PluginOptions<P,S,M>) => DefinedPlugin<P,S,M>` | `name`, `setup` required | Produces plugin factory; render hook joins global frame queue; `destroyed` runs on removal | See extensions reference | Frame-system extension. Avoid duplicate names. |
| `defineAnimation` | `<P,S,M>(matcher, animation) => AnimationCreator<P,S,M>` | Matcher and factory required | Applies an animation facade to a component | See extensions reference | Component animation adapter. |
| `createAnimationFromSimilarAnimation` | `(handler: Record<string, Function>) => BaseAnimation` | Handler should implement start/pause/resume/stop/update | Registers update only after `start`; remove on stop/complete/pause | `createAnimationFromSimilarAnimation(handler)` | Adapter for AnimationAction-like objects. |
| `createAnimationFromTween` | `(tween: TWEEN.Tween<any>) => BaseAnimation` | Tween required | Drives tween from dt-engine render queue | `createAnimationFromTween(new TWEEN.Tween(v))` | Tween animation. |
| `createAnimationFromTweenGroup` | `(group: TWEEN.Group) => BaseAnimation` | Group required | Drives all group tweens and aggregates completion | `createAnimationFromTweenGroup(group)` | Tween group. |
| `TWEEN` | `@tweenjs/tween.js` namespace | N/A | Shared tween constructors/easing | `new TWEEN.Tween(state)` | Animation utility, not Three.js core. |
| `DTEvent` | `new DTEvent<P>(type, params?)` | Type required | Event object with `params`, optional browser `event`, and `stopPropagation()` | `component.emit(new DTEvent("x", data))` | Event propagation wrapper. |
| `EngineType` | `Webgl`, `UnityCloud`, `UnityExe` | N/A | `meta.type` identifies engine backend | `if (meta.type === EngineType.Webgl)` | Backend discriminator. |

## Root type export index

These are type-only and must use `import type`: `Meta`, `ComponentOptions`, `Component`, `ComponentGroup`, `WebglCreator`, `WebglRenderer`, `WebglScene`, `WebglCamera`, `WebglModel`, `UnityCreator`, `UnityModel`, `UnityRenderer`, `UnityScene`, `UnityCamera`, `PluginCreator`, `Plugin`, `PluginOptions`, `Animation`, `AnimationCreator`, `AnimationOptions`.

Use:

```ts
import type { Meta, WebglCreator, Component, WebglModel } from "@tslfe/dt-engine";
```

Detailed members are in [webgl-api.md](webgl-api.md), [unity-cloud-api.md](unity-cloud-api.md), and [extensions-and-animation.md](extensions-and-animation.md).

## Search index

| Need | Reference / search term |
| --- | --- |
| mount, render GLTF, create component, dispose | `webgl-api.md` — `WebglCreator` |
| query models and mutate component tree | `webgl-api.md` — `Meta`, `Component` |
| camera movement | `webgl-api.md` — `WebglCamera` |
| lighting, POI, selection, path, LOD | `webgl-plugins.md` |
| TacOS space lookup | `webgl-plugins.md` — `webglPlugin.os`, `webglPlugin.osV1` |
| Unity WebSocket scene | `unity-cloud-api.md` |
| custom plugin or animation | `extensions-and-animation.md` |
| lifecycle templates | `examples.md` |
| stale README, compatibility, memory | `migration-and-pitfalls.md` |
