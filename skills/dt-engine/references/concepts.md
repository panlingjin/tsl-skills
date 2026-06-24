# Core Concepts and Wrapper Boundaries

Three.js comparisons here are guardrails for choosing the dt-engine wrapper API and understanding ownership. They are not permission to bypass public dt-engine APIs or import package internals.

## Object map

| dt-engine abstraction | Native Three.js 0.183.2 concept | Important difference |
| --- | --- | --- |
| `Meta<WebglCreator>` | Application/controller around renderer, scene, camera, loaders, events | Owns shared frame queue, current rendered component tree, plugins, and teardown. |
| `WebglScene` | `THREE.Scene` | Extended with `skybox(path, format)` and `skycolor(color)`. |
| `WebglCamera` | `THREE.PerspectiveCamera` | Adds tweened `flyTo`, `travel`, `moveAlong`, `adjust`, `follow`, `faceTo`, and `setZoom`. |
| `WebglRenderer` | `THREE.WebGLRenderer` or `WebGPURenderer` | Adds mounting, resize observation, pause/start, composer, and global render callbacks. |
| `Component<WebglModel>` | Semantic node mapped to a rendered object | Carries business IDs/types and hierarchy; use it for search and lifecycle. |
| `WebglModel` | `THREE.Object3D` facade | Also exposes `target`, component model ID, instancing metadata, color/opacity setters, and disposal. |
| `ComponentGroup.model` | Batch facade over models | Batch setters for visibility/color/opacity/disabled and batch cleanup. |
| `Loader` | `GLTFLoader` + `DRACOLoader` + `FileLoader` | Adds six-request queue, duplicate-request coalescing, cache, mapping JSON, and optional decryption. |
| `webglPlugin.renderPass` | `EffectComposer` `RenderPass` | Installed by default by `createWebglEngine`. |
| `webglPlugin.orbitControl` | `OrbitControls` | Installed by default; syncs control target with dt-engine camera and stops camera animation on user input. |
| `webglPlugin.light` | Three.js light objects | Default engine creates one directional and one ambient light at intensity `0.8`. |
| `DTEvent` | Event object | Component events bubble through semantic parents until `stopPropagation()`. |

## Lifecycle

```text
createWebglEngine(config)
  -> creates renderer/scene/camera/loader
  -> installs default plugins and mouse events
amount(container)
  -> appends internal container and canvas
  -> starts shared requestAnimationFrame queue
render(url, mapping?)
  -> for generated WebGL business scenes, pass true to load sibling meta.json
  -> loads/caches GLTF resources
  -> builds WebglModel and Component tree
  -> compiles shaders and resolves
clear() or next render()
  -> disposes current component/model resources
dispose()
  -> clears plugins, current tree, renderer, loader, frame queue, listeners
```

For Cloud/Unity, creation connects and renders mapping before resolving. `amount()` mounts an iframe only in server mode and installs configured plugins/events. `dispose()` closes the socket.

## Scene graph and semantic hierarchy

The semantic `Component.children` tree can differ from the physical Three.js scene graph. Current WebGL rendering flattens models into the scene and manually propagates parent transform deltas to logical children. Therefore:

- Mutate through `component.model.position`, `rotation`, and `scale` when semantic descendants must follow.
- `component.add(child, false)` uses `Object3D.add`; `attach=true` uses `Object3D.attach` to preserve world transforms.
- `removeFromParent()` detaches without disposing geometry/material.
- `dispose()` detaches and disposes geometry/material recursively.

## Render ownership

dt-engine owns a module-level render queue. `amount()` starts it; plugins and animations register callbacks. `meta.dispose()` stops the shared queue. Avoid creating multiple simultaneously active WebGL engines in one JavaScript realm: disposing one stops the shared queue used by the others.

## Native Three.js usage boundary

Use dt-engine lifecycle and query APIs first. Native Three.js is appropriate only when no wrapper constructor exists, such as creating a custom primitive mesh:

```ts
import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";

const cube = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial());
meta.scene.add(cube);
```

Because this object is not a dt-engine `Component`, track and dispose its geometry/material yourself. Do not reach through package-internal modules to construct internal models.
