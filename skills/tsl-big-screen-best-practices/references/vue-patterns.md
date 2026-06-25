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

## Pinia

Use Pinia for cross-feature state:

- modal visibility and payloads
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
