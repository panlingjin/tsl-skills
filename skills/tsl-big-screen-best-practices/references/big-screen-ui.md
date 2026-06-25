# Big-Screen UI

## Canvas And Scaling

Big-screen pages use a fixed design canvas and scale to the current terminal/browser window.

Create `useScale`:

```js
import { onMounted, onUnmounted, ref } from "vue";

export function useScale(selector, designHeight = 1080) {
  const computedScale = ref(1);

  const handleScale = () => {
    const element = document.querySelector(selector);
    if (!element) return;
    computedScale.value = window.innerHeight / designHeight;
    element.style.zoom = computedScale.value;
    element.style.height = `${designHeight}px`;
  };

  onMounted(() => {
    handleScale();
    window.addEventListener("resize", handleScale);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", handleScale);
  });

  return { computedScale, handleScale };
}
```

Use `designHeight = 1080` by default. Use `2160` only when the screen design is explicitly 4K/tall.

## Layout

Use:

- full-screen root
- transparent or dark renderer background
- full-page 3D scene container as the bottom layer
- header as a top overlay, not a layout row that reduces the scene height
- center digital-twin or map region
- left and right panels as overlays for dense metrics
- absolute overlays only when they align to a fixed design canvas

Root CSS baseline:

```less
html,
body,
#infraApp {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#infraApp {
  position: relative;
  overflow: hidden;
}

*,
::before,
::after {
  box-sizing: border-box;
  outline: none;
}
```

## Header, Panels, And Scene Layer

For digital-twin big screens, the three-dimensional scene must fill the page or the dedicated full-page scene area first. Header, left dashboard, right dashboard, Page Switch, modals, and LLM/MCP controls sit above the scene as overlays.

Do not make `#three-container` a normal-flow sibling that is shortened by the header or squeezed by left/right panels. Avoid `height: calc(100% - headerHeight)` for the 3D container unless the design explicitly says the scene should not exist behind the header.

Canonical route-level structure:

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
```

Canonical Less baseline:

```less
.home-screen {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
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
  pointer-events: auto;
}

.home-header {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  pointer-events: auto;
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
```

Panel details:

- Reserve top padding inside left/right panels for the visual header area, instead of pushing the whole scene down.
- Use fixed design-width panels on fixed-canvas screens, then let root scaling adapt them.
- Use left/right gradient shadows when the panel needs to blend into the 3D scene.
- Keep the center area visually open for the model. Center overlays must be absolute and must not resize the 3D container.
- Keep z-index order predictable: scene `0`, panels `10`, header `20`, Page Switch/modals/LLM `30+`.

## Visual Components

Standard shared components:

- `card`
- `panel`
- `title` or `sub-title`
- `countup`
- `chart`
- `modal`
- `date-time`
- `weather`
- `svg-icon`
- `page-switch`

Charts must own their ECharts instance and dispose it on unmount.

Counters should accept value, decimals, duration, prefix/suffix, and unit. Watch value changes and update the CountUp instance instead of remounting.

## Assets

Use:

- `src/assets/icons/svg` for local SVG symbols
- `src/assets/icons/svg/weather` for reusable weather SVG symbols
- `src/assets/img` grouped by feature
- `src/assets/img/switch` for Page Switch base and item backgrounds
- `src/assets/font` for screen fonts
- `src/assets/style/font.less`, `reset.less`, `var.less`, and optional `common.less`

This skill bundles a common asset pack. Copy only the relevant files into the generated project:

- Page Switch assets: `swiper-item-icon.svg`, `switch-base.png`, `switch-icon.png`, `switch-item-bg.png`
- LLM quick-question icons: `icon-refresh.svg`, `icon-question-1.svg`, `icon-question-2.svg`
- Common control icon: `ganta.svg`
- Weather icons: `qing.svg`, `duoyun.svg`, `yin.svg`, `yu.svg`, `xue.svg`, `feng.svg`, `wu.svg`, `mai.svg`, `shachenbao.svg`, `longjuanfeng.svg`

Do not embed generated iconfont blobs in new projects unless a provided icon package requires it.

## Interaction And Motion

Use motion sparingly:

- fade for modals
- slide-left/slide-right for panels
- active scaling for Page Switch items
- short loop animations for status indicators

Avoid animations that resize fixed layout containers unexpectedly.
