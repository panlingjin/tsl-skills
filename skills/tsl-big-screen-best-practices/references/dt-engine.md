# DT Engine

## Contents

- [Dependency](#dependency)
- [Constants](#constants)
- [Engine Initialization](#engine-initialization)
- [Scene Hook](#scene-hook)
- [View Integration](#view-integration)
- [Cleanup](#cleanup)

## Dependency

When the project uses digital-twin scenes, install exactly:

```json
{
  "@tslfe/dt-engine": "4.3.1-1"
}
```

## Constants

Define engine constants in `src/constant/index.js`:

```js
export const TACOS_LOAD_MODE = {
  UNITY_CLOUD: "unity-cloud",
  UNITY_EXE: "unity-exe",
  WEBGL: "webgl"
};

export const THREE_SELECTOR = "three-container";
```

## Engine Initialization

Copy the verified `4.3.1-1` integration template:

```text
skill assets/template/integrations/dt-engine.js
  -> project src/utils/dt-engine.js
```

Its public lifecycle is:

```js
loadEngine(idSelector); // shared concurrent promise; rejection can retry
init(idSelector);       // installs the shared click listener once
disposeEngine();        // removes listeners and awaits meta.dispose()
```

The template was checked against the installed `@tslfe/dt-engine@4.3.1-1` declarations: `addEventListener()` returns an unsubscribe function and `Meta.dispose()` returns a Promise. Keep `pending` reset in `finally`; otherwise one failed connection permanently poisons all later attempts.

## Scene Hook

Create `src/hooks/use-engine.js` to wrap Unity/plugin commands. Keep business names in constants and keep the hook generic:

```js
export function useEngine(meta) {
  const resetScene = () => meta.unity.invoke("ResetScene");

  const changeScene = (name, options = {}) =>
    meta.unity.invoke("ChangeState", {
      Name: name,
      IsNeedMergeBuilding: Boolean(options.mergeBuilding),
      IsNeedSplitBuilding: Boolean(options.splitBuilding),
      IsNeedMergeAfterSplit: Boolean(options.mergeAfterSplit)
    });

  const changeViewPoint = (cameraInfo, duration = 3) =>
    meta.unity.invoke("ChangeViewPoint", {
      Position: cameraInfo.Position,
      EulerAngles: cameraInfo.EulerAngles,
      Duration: duration
    });

  return { resetScene, changeScene, changeViewPoint };
}
```

Add POI, line effects, wall effects, lights, and room controls only when the requested project needs them.

## View Integration

Use a stable route-level container. Follow the canonical structure and CSS in `references/big-screen-ui.md`; do not duplicate that layout in this integration reference. The scene-owning view initializes after the container exists and disposes on unmount:

```vue
<script setup>
import { onBeforeUnmount, onMounted, shallowRef } from "vue";
import { disposeEngine, init } from "@/utils/dt-engine";
import { useEngine } from "@/hooks";

const metaRef = shallowRef(null);

onMounted(async () => {
  const meta = await init();
  metaRef.value = meta;

  const engine = useEngine(meta);
  // Use engine actions here or pass meta/engine to feature composables.
});

onBeforeUnmount(() => {
  void disposeEngine();
});
</script>
```

This initialization is mandatory whenever the project includes dt-engine. Creating `src/utils/dt-engine.js` is not enough.

Rules:

- Call `init()` only in a route view or dedicated scene container that renders `<div id="three-container">`.
- Render `#three-container` as the full-page bottom scene layer. Header and left/right dashboards must overlay it and must not reduce its width or height.
- Do not call `init()` in `main.js`, `App.vue`, left/right panel components, Page Switch, or LLM components.
- Page Switch, LLM/MCP, `frontControl`, and `useEngine(meta)` must reuse the same initialized `meta` or call `loadEngine()` to access the cached instance.
- If a custom container id is used, pass it explicitly: `await init("three-container")`.
- Do not run scene actions until `init()` resolves.
- Only the route/scene owner calls `disposeEngine()`. Child panels, Page Switch, and LLM/MCP code reuse the cached instance and never dispose shared ownership independently.

## Cleanup

Track and clear:

- POI ids returned from `applyToPosition` or `applyToComponent`
- segment wall ids
- line effect handles
- dynamic modal instances opened by scene actions
- timers used in staged scene playback

Wrap removal in functions that can be called during reset and before running a new scene action.
