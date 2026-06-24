# Supported Examples

All dt-engine imports use the package root. Native Three.js imports are used only where the wrapper intentionally exposes the underlying Scene/Object3D but provides no primitive constructor.

## Minimal WebGL scene with lights and rotating cube

```ts
import { createWebglEngine, webglPlugin } from "@tslfe/dt-engine";
import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";

export async function mountScene(container: HTMLElement) {
  const meta = await createWebglEngine((config) => {
    config.decoderPath = "/dt-engine/draco/";
    config.performance.mergedTypes = ["floor"] as typeof config.performance.mergedTypes;
    // Replace default light plugin rather than stacking duplicate lights.
    config.plugins[1] = webglPlugin.light([
      { type: "AmbientLight", color: 0xffffff, intensity: 0.8 },
      { type: "DirectionalLight", color: 0xffffff, intensity: 1, position: [5, 8, 5] }
    ]);
    return config;
  });

  meta.amount(container);
  meta.scene.skycolor("#1d2433");

  const geometry = new BoxGeometry(2, 2, 2);
  const material = new MeshStandardMaterial({ color: "#4fc3f7" });
  const cube = new Mesh(geometry, material);
  meta.scene.add(cube);

  const removeRender = meta.renderer.onRender((time) => {
    cube.rotation.y = time * 0.001;
    cube.rotation.x = time * 0.0005;
  });

  return async () => {
    removeRender();
    cube.removeFromParent();
    geometry.dispose();
    material.dispose();
    await meta.dispose();
  };
}
```

Do not create a second `requestAnimationFrame` loop. Directly added native objects are not components and require manual disposal.

## Load a GLTF with dt-engine

```ts
import { createWebglEngine } from "@tslfe/dt-engine";

export async function mountModel(container: HTMLElement) {
  const meta = await createWebglEngine((config) => {
    config.decoderPath = "/assets/draco/";
    config.performance.mergedTypes = ["floor"] as typeof config.performance.mergedTypes;
    return config;
  });

  meta.amount(container);
  const component = await meta.render("/models/factory.glb", true);
  meta.camera.adjust({ distance: 1.2 });

  return {
    meta,
    component,
    dispose: () => meta.dispose()
  };
}
```

For business scenes, floors, and campuses, default to `render(url, true)` so dt-engine loads the sibling `meta.json` mapping. Omit the second argument or pass `false` only for a confirmed standalone GLB with no mapping and no Component hierarchy requirement.

## Vue 3 lifecycle

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { createWebglEngine, type Meta, type WebglCreator } from "@tslfe/dt-engine";

const host = ref<HTMLElement>();
let meta: Meta<WebglCreator> | undefined;
let removeClick: (() => void) | undefined;
let cancelled = false;
let mountTask: Promise<void> | undefined;

onMounted(() => {
  mountTask = (async () => {
    const instance = await createWebglEngine((config) => {
      config.decoderPath = "/assets/draco/";
      config.performance.mergedTypes = ["floor"] as typeof config.performance.mergedTypes;
      return config;
    });

    if (cancelled) {
      await instance.dispose();
      return;
    }

    meta = instance;
    instance.amount(host.value!);

    try {
      await instance.render("/models/site.glb", true);
      removeClick = instance.addEventListener("click", (event: any) => {
        const component = event.params.component;
        if (component) component.model.visible = !component.model.visible;
      });
    } catch (error) {
      if (meta === instance) meta = undefined;
      await instance.dispose();
      throw error;
    }
  })();
});

onBeforeUnmount(async () => {
  cancelled = true;
  removeClick?.();
  removeClick = undefined;

  // Wait for an in-flight GLTF render before tearing down its renderer/loader.
  await mountTask?.catch(() => undefined);
  mountTask = undefined;

  const instance = meta;
  meta = undefined;
  await instance?.dispose();
});
</script>

<template><div ref="host" class="scene-host" /></template>
```

The mount task prevents the renderer/loader from being disposed in the middle of an in-flight GLTF parse.

## Create and attach a wrapped model

```ts
const child = await meta.createComponent("/models/pump.glb");
child.model.position = { x: 2, y: 0, z: 1 };
await meta.component!.add(child, true); // preserve child world transform
```

Use Component APIs so semantic and scene hierarchies stay synchronized.

## POI and event interaction

```ts
const poi = meta.plugin.use(webglPlugin.poiv2({ type: "2d" }));
const marker = poi.createText({
  text: "Pump A",
  offsets: { x: 0, y: 1.5, z: 0 },
  className: "asset-label"
});
marker.applyToComponent(component);

const removePoiClick = poi.addEventListener("click", ({ target }) => {
  console.log(target);
});

// teardown before meta.dispose() is optional but useful when replacing only this feature
removePoiClick();
await poi.clear(component);
meta.plugin.remove("poi-v2");
```

## Camera travel

```ts
const points = ["pump-a", "pump-b", "pump-c"]
  .map((id) => meta.get(id))
  .filter((item): item is NonNullable<typeof item> => Boolean(item));

const travel = meta.camera.travel(points, {
  speed: 0.5,
  distance: 10,
  mode: "loop",
  process: (index) => console.log("arrived", index)
});

// required when the feature/component is torn down
travel.stop();
```

## TacOS current and legacy initialization

```ts
const currentOS = meta.plugin.use(webglPlugin.os());
await currentOS.connect(connectOptions);
await currentOS.enter("/campus/building/floor");

// Legacy projects only:
const legacyOS = meta.plugin.use(webglPlugin.osV1());
await legacyOS.connect(legacyConnectOptions);
await legacyOS.enter("/legacy/floor");
```

Normally install only the variant matching the TacOS layout schema. Both are public and retained.

## Cloud/Unity teardown

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

// Callers may override url for production or remote services.
const meta = await createCloud(container, {
  url: "wss://cloud.example.com/unity"
});
await meta.render("space-id");

// component/framework teardown
await meta.dispose();
```

Use `mode: "server"` only with a valid `displayUrl`; dt-engine will not infer it.
