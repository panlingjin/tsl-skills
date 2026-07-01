# Source Architecture

## Directory Contract

Use this source shape for new projects:

```text
src/
  api/
  assets/
    font/
    icons/svg/
      weather/
    img/
      switch/
    style/
  components/
    modal/
    svg-icon/
  constant/
  hooks/
  mock/
  plugin/
  router/
  store/
  utils/
  views/
  App.vue
  main.js
  public-path.js
```

Use `src/store` for new projects. Only use `src/stores` when maintaining an existing codebase that already uses it.

## Responsibilities

- `api/`: endpoint functions grouped by business domain. Export functions, not raw URLs.
- `assets/`: visual assets, fonts, SVG icon sources, image backgrounds, and global Less files.
- `components/`: reusable UI and behavior components such as cards, charts, counters, modals, Page Switch, weather, SVG icons, and LLM/MCP controls.
- `constant/`: load modes, selector names, route keys, scene maps, action maps, and UI enums.
- `hooks/`: composables such as `useScale`, `useEngine`, timers, sequence/stepper helpers, and reusable interaction logic.
- `mock/`: MockJS registration only. Components and stores must not import mock records directly.
- `plugin/`: app-wide Vue plugin registration, global components, icon registration, and error handler wiring.
- `router/`: route definitions and optional guards.
- `store/`: Pinia stores for cross-feature state, modal state, scene state, and LLM state.
- `utils/`: Axios instance, query parsing, dt-engine initialization, WebSocket helpers, action sequencing, and generic utilities.
- `views/`: route-level screens. Keep them as composition surfaces that assemble feature components.

## Common Asset Pack

This skill includes reusable big-screen assets under `assets/`. When generating a project that uses Page Switch, LLM quick questions, weather, or common screen controls, copy the relevant files into the project instead of redrawing or inventing replacements.

Copy targets:

```text
skill assets/icons/svg/*.svg          -> project src/assets/icons/svg/
skill assets/icons/svg/weather/*.svg  -> project src/assets/icons/svg/weather/
skill assets/img/switch/*.png         -> project src/assets/img/switch/
```

Included common assets:

- Page Switch: `swiper-item-icon.svg`, `switch-base.png`, `switch-icon.png`, `switch-item-bg.png`
- LLM quick questions: `icon-refresh.svg`, `icon-question-1.svg`, `icon-question-2.svg`
- Common controls: `ganta.svg`
- Weather: `qing.svg`, `duoyun.svg`, `yin.svg`, `yu.svg`, `xue.svg`, `feng.svg`, `wu.svg`, `mai.svg`, `shachenbao.svg`, `longjuanfeng.svg`

Keep the existing project `svg-icon` registration mechanism. Do not add another icon system only to consume these assets.

## Data Visualization Templates

When the project needs standard card layouts, KPI, chart, table, progress, or empty-state styling, copy the bundled data-visualization templates:

```text
skill assets/template/data-visualization/data-tokens.less
  -> project src/assets/style/data-tokens.less
skill assets/template/data-visualization/data-display.less
  -> project src/assets/style/data-display.less
skill assets/template/data-visualization/chart-theme.js
  -> project src/utils/chart-theme.js
skill assets/template/data-visualization/chart-options.js
  -> project src/utils/chart-options.js
skill assets/template/data-visualization/use-echarts.js
  -> project src/hooks/use-echarts.js
```

Import `data-display.less` once from the global style entry. Keep both Less files in the same directory because `data-display.less` imports `data-tokens.less`.

Keep chart responsibilities separated:

- `chart-theme.js` owns the stable palette and shared axis, grid, tooltip, and legend styling.
- `chart-options.js` turns normalized feature data into ECharts options.
- `use-echarts.js` waits for measurable geometry, then owns ECharts initialization, reactive updates, `ResizeObserver`, resize handling, and disposal.
- chart components own the DOM ref, option source, loading/empty UI, and feature interaction wiring.
- feature code owns business labels, units, threshold meaning, geographic data, and advanced map/radar/heatmap/bar-line options.

Do not fetch APIs, start timers, or create ECharts instances inside an option builder.

## Modal Templates

When the project needs Dialog, Confirm, Drawer, or Media Viewer behavior, copy the shared modal templates:

```text
skill assets/template/modal/BaseModal.vue
  -> project src/components/modal/BaseModal.vue
skill assets/template/modal/use-modal-lifecycle.js
  -> project src/hooks/use-modal-lifecycle.js
skill assets/template/data-visualization/modal.less
  -> project src/assets/style/modal.less
```

Keep `modal.less` beside `data-tokens.less`, which it imports. Import `modal.less` once from the global style entry. Feature Modal components may style their content, but must not duplicate the base backdrop, layer, focus, scroll-lock, or transition implementation.

Responsibilities remain separate:

- `BaseModal.vue` owns the reusable shell and public Vue/CSS contract.
- `use-modal-lifecycle.js` owns the single-main-plus-Confirm registry, focus stack, keyboard behavior, and scroll-lock reference count.
- Feature Modal components own APIs, validation, business actions, player/chart instances, and cleanup.
- Dynamic callers own `createApp()` unmounting and removal of their temporary mount container.

## SVG Icon Component

When any SVG icon is used, generate the `svg-icon` component and register all SVG symbols globally. Do not rely on copied SVG files alone.

Create:

```text
src/components/svg-icon/
  index.js
  SvgIcon.vue
```

`SvgIcon.vue`:

```vue
<script setup>
import { computed } from "vue";

const props = defineProps({
  iconClass: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    default: ""
  },
  color: {
    type: String,
    default: "currentColor"
  },
  size: {
    type: [Number, String],
    default: 16
  }
});

const symbolName = computed(() => (props.prefix ? `${props.prefix}-${props.iconClass}` : props.iconClass));
const symbolId = computed(() => `#icon-${symbolName.value}`);
const fontSize = computed(() => (typeof props.size === "number" ? `${props.size}px` : props.size));
</script>

<template>
  <svg class="svg-icon" :style="{ color, fontSize }" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  vertical-align: -0.15em;
  fill: currentColor;
}
</style>
```

`index.js`:

```js
import SvgIcon from "./SvgIcon.vue";

const req = require.context("@/assets/icons/svg", true, /\.svg$/);
req.keys().forEach(req);

export default {
  install(app) {
    app.component("SvgIcon", SvgIcon);
  }
};
```

Register it in `src/plugin/index.js`:

```js
import icons from "@/components/svg-icon";

export default function plugin(app) {
  app.use(icons);
  return app;
}
```

Use icons as:

```vue
<svg-icon icon-class="swiper-item-icon" :size="40" />
<svg-icon icon-class="icon-refresh" :size="28" />
<svg-icon prefix="weather" icon-class="qing" :size="20" />
```

Vue maps `icon-class` to the `iconClass` prop. Keep asset file names aligned with the symbol id rule: `swiper-item-icon.svg` becomes `#icon-swiper-item-icon`, and `weather/qing.svg` is referenced as `prefix="weather" icon-class="qing"` to produce `#icon-weather-qing`.

## Entry Flow

`src/main.js` should:

1. Import Axios setup before API usage.
2. Import global reset/style entry.
3. Create the Vue app.
4. Install Pinia, Router, and app plugins.
5. Mount to `#infraApp`.
6. Import `src/mock` only when `VUE_APP_MOCK === "true"`. The default `.env` value is `true` for every mode.

`src/main.js` must not initialize dt-engine. Initialize dt-engine only inside the route view or scene container that owns the rendered `three-container` element. This prevents `meta.amount(idSelector)` from running before the container exists.

Keep app creation explicit:

```js
import "./utils/axios";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import plugin from "@/plugin";
import "@/assets/style/reset.less";

if (process.env.VUE_APP_MOCK === "true") {
  require("./mock");
}

const app = plugin(createApp(App));
app.use(createPinia()).use(router).mount("#infraApp");
```

## Root App

Keep `App.vue` thin:

```vue
<template>
  <router-view />
</template>

<script setup>
import { useScale } from "@/hooks";

useScale("#infraApp");
</script>
```

Do not put feature markup, engine action sequences, or API orchestration in `App.vue`.

## DT Engine View Ownership

When dt-engine is required, the default owner is `src/views/home/index.vue`.

That view must:

- render `<div id="three-container">` as the full-page bottom scene layer
- render Header, left dashboard, right dashboard, Page Switch, modals, and LLM/MCP controls as overlays above the scene
- import `init` from `@/utils/dt-engine`
- call `await init()` inside `onMounted`
- retain or pass the resulting `meta` for scene actions, Page Switch, and LLM/MCP behavior

Do not use the header or left/right panels to define the 3D container size. The 3D container owns the full scene/page area; panels reserve internal padding for the visual header area and float above the scene.

Panels and shared components can call `loadEngine()` only to reuse the cached instance. They must not create independent engine instances.

## Naming

Use:

- kebab-case for folders and most files.
- PascalCase for Vue component files only when the surrounding project already does so.
- `use-*.js` or `use*.js` composables consistently within a folder.
- `index.vue` for folder entry components when the component is the folder's public API.
