# Vue Patterns

## SFC Defaults

Use Vue 3 Composition API with `<script setup>`.

Order SFC blocks:

```vue
<script setup>
</script>

<template>
</template>

<style scoped lang="less">
</style>
```

Move derivation and branching into script with `computed`; keep templates declarative.

## Component Boundaries

Keep route views thin. Split screen features into:

- screen container
- left panel
- center scene/map/canvas
- right panel
- shared modal(s)
- shared card/chart/counter components

Split a component when it owns data orchestration and multiple independent UI sections, or when it manages timers/listeners plus substantial markup.

## Props And Emits

Use typed and explicit contracts where possible:

```js
const props = defineProps({
  visible: Boolean,
  data: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(["close", "update:visible"]);
```

Use `v-model` only for true two-way component contracts such as active tab or modal visibility.

## Composables

Put reusable stateful behavior in `src/hooks` or in a component-local `use*.js` file.

Composables that allocate resources must expose cleanup or clean up in lifecycle hooks:

- `setInterval` -> `clearInterval`
- `setTimeout` -> `clearTimeout` when retained
- DOM/window events -> remove listener
- WebSocket listener -> unsubscribe/close
- dynamic Vue app/modal -> unmount and remove container
- dt-engine effects/POI -> remove or clear effect ids

## Modal Ownership

Read `references/modal-patterns.md` before implementing a modal or scene popover.

- Use `BaseModal.vue` for Teleport, ARIA, Transition, close reasons, and slots; Feature Modal components own business data and actions.
- Use `v-model:open`, not parallel `visible` and `open` states.
- Keep ordinary feature modal visibility local. Use Pinia only for cross-feature, route-independent, LLM, or `frontControl` orchestration.
- Keep one main modal plus one Confirm. Do not render feature-specific modal stacks with arbitrary z-index values.
- Side effects follow `open`: abort requests, stop timers/media, and remove listeners on close, replacement, route leave, and unmount. `keepMounted` does not keep side effects active.
- Use the shared lifecycle composable for topmost Escape, Tab trapping, focus restoration, and reference-counted scroll locking.

## Chart Ownership

Use the bundled `use-echarts.js` composable for charts inside responsive Grid/Flex layouts or content that appears after loading.

- Keep the ECharts instance in a `shallowRef`; never deep-proxy it.
- Wait for `nextTick`, then initialize only when the container reports positive layout width and height. Prefer `clientWidth/clientHeight` so root zoom or transforms are not applied twice.
- Observe the chart element with `ResizeObserver`. A zero-size callback is a waiting state, not an initialization signal or an error.
- Use a `flush: "post"` watcher for option changes so DOM updates finish before render scheduling.
- Let a changed template ref rebind the observer and dispose the instance owned by the replaced element.
- Dispose the chart, observer, animation frame, and window fallback listener on unmount.
- Do not repair lifecycle races with fixed chart widths, arbitrary `setTimeout`, or repeated unconditional `echarts.init()` calls.

## Pinia

Use Pinia for cross-feature state:

- cross-feature modal visibility and serializable payloads
- current scene/step state
- LLM assistant visibility and command state
- data shared by several panels

Keep stores focused by domain. Export store modules from `src/store/index.js`.

Prefer minimal source state and computed getters. Store async actions may call `api/` functions, but presentational components should not.

## Router

Use Vue Router 4:

```js
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/home")
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/"
  }
];

export default createRouter({
  history: createWebHistory("/"),
  routes
});
```

Use route `meta` for scene keys or app codes only when navigation behavior needs them.

## Lifecycle Safety

Never leave these unmanaged:

- resize handlers
- click handlers on `document` or `window`
- timers
- chart instances
- WebSocket subscriptions
- dt-engine camera/effect sequences

Add `onUnmounted` cleanup in the component or composable that created the resource.
