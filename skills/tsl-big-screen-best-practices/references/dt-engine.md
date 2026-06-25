# DT Engine

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

Create `src/utils/dt-engine.js`:

```js
import Engine, { unityPlugin, webglPlugin } from "@tslfe/dt-engine";
import { TACOS_LOAD_MODE, THREE_SELECTOR } from "@/constant";

let cachedMeta = null;
let pending = null;

function usePlugin(meta) {
  const mode = process.env.VUE_APP_TACOS_LOAD_MODE;
  const plugins = mode === TACOS_LOAD_MODE.WEBGL ? webglPlugin : unityPlugin;

  for (const name in plugins) {
    if (!meta.plugin.has(name)) {
      meta.plugin.use(plugins[name].call());
    }
  }
}

export async function loadEngine(idSelector = THREE_SELECTOR) {
  if (cachedMeta) return { meta: cachedMeta };
  if (pending) return pending;

  pending = Engine.createCloudEngine((config) => {
    config.url = process.env.VUE_APP_DTENGINE_WS;
    config.mode = "client";
    return config;
  }).then((meta) => {
    meta.amount(idSelector);
    const el = document.getElementById(idSelector);
    if (el) el.style.background = "transparent";
    usePlugin(meta);
    cachedMeta = meta;
    pending = null;
    return { meta };
  });

  return pending;
}

export async function init(idSelector = THREE_SELECTOR) {
  const { meta } = await loadEngine(idSelector);
  meta.addEventListener("click", (event) => {
    if (!event.params?.component) return;
  });
  return meta;
}
```

Use a cached promise so concurrent components do not create multiple engine instances.

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

Use a stable route-level container. For the default home screen, create `src/views/home/index.vue` with a real `three-container` element and initialize dt-engine after the element exists.

```vue
<template>
  <div class="home-screen">
    <Header class="home-header" />

    <main class="scene-shell">
      <div id="three-container" class="three-container"></div>

      <div class="dashboard-layer">
        <LeftPanel class="dashboard-panel dashboard-panel-left" />
        <RightPanel class="dashboard-panel dashboard-panel-right" />
      </div>

      <PageSwitch v-if="switchShow" class="page-switch-layer" />
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { init } from "@/utils/dt-engine";
import { useEngine } from "@/hooks";

const metaRef = ref(null);

onMounted(async () => {
  const meta = await init();
  metaRef.value = meta;

  const engine = useEngine(meta);
  // Use engine actions here or pass meta/engine to feature composables.
});
</script>

<style lang="less" scoped>
.home-screen {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.scene-shell {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.three-container {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
}

.home-header {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
}

.dashboard-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}

.dashboard-panel {
  position: absolute;
  top: 0;
  bottom: 0;
  pointer-events: auto;
}

.dashboard-panel-left {
  left: 0;
}

.dashboard-panel-right {
  right: 0;
}

.page-switch-layer {
  position: absolute;
  z-index: 30;
}
</style>
```

This initialization is mandatory whenever the project includes dt-engine. Creating `src/utils/dt-engine.js` is not enough.

Rules:

- Call `init()` only in a route view or dedicated scene container that renders `<div id="three-container">`.
- Render `#three-container` as the full-page bottom scene layer. Header and left/right dashboards must overlay it and must not reduce its width or height.
- Do not call `init()` in `main.js`, `App.vue`, left/right panel components, Page Switch, or LLM components.
- Page Switch, LLM/MCP, `frontControl`, and `useEngine(meta)` must reuse the same initialized `meta` or call `loadEngine()` to access the cached instance.
- If a custom container id is used, pass it explicitly: `await init("three-container")`.
- Do not run scene actions until `init()` resolves.

## Cleanup

Track and clear:

- POI ids returned from `applyToPosition` or `applyToComponent`
- segment wall ids
- line effect handles
- dynamic modal instances opened by scene actions
- timers used in staged scene playback

Wrap removal in functions that can be called during reset and before running a new scene action.
