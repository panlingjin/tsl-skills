# Big-Screen UI

## Contents

- [Canvas And Scaling](#canvas-and-scaling)
- [Layout](#layout)
- [Header, Panels, And Scene Layer](#header-panels-and-scene-layer)
- [Side-Panel Height Budget](#side-panel-height-budget)
- [Visual Components](#visual-components)
- [Assets](#assets)
- [Interaction And Motion](#interaction-and-motion)

## Canvas And Scaling

Big-screen pages use a fixed design canvas and scale to the current terminal/browser window.

Copy the reusable scale helper:

```text
skill assets/template/layout/use-scale.js
  -> project src/hooks/use-scale.js
```

It fixes the authoring canvas at `1920 × 1080`, scales by `min(viewportWidth / 1920, viewportHeight / 1080)`, and centers the canvas with a transform. This prevents both horizontal clipping and vertical overflow. Keep Header, panels, Page Switch, LLM controls, and Modal Teleport targets inside this same root. The compatibility overload `useScale(target, 1080)` remains valid; new code should use `useScale(target, { width: 1920, height: 1080 })`.

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
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  transform-origin: center center;
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
  --panel-safe-top: 80px;
  --panel-safe-bottom: 24px;
  --panel-section-gap: 16px;

  position: absolute;
  top: 0;
  bottom: 0;
  height: auto;
  min-height: 0;
  padding-top: var(--panel-safe-top);
  padding-bottom: var(--panel-safe-bottom);
  overflow: hidden;
  pointer-events: auto;
}

.dashboard-panel__content {
  display: flex;
  flex-direction: column;
  gap: var(--panel-section-gap);
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.dashboard-panel__section {
  flex: 0 0 auto;
  min-height: 0;
}

.dashboard-panel__section--fill {
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
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

Canonical panel-internal structure:

```vue
<template>
  <aside>
    <div class="dashboard-panel__content">
      <section class="dashboard-panel__section">
        <!-- fixed KPI or summary card group -->
      </section>

      <section class="dashboard-panel__section dashboard-panel__section--fill">
        <!-- the one bounded chart, table, or list that may use remaining height -->
      </section>
    </div>
  </aside>
</template>
```

Panel details:

- Reserve top padding inside left/right panels for the visual header area, instead of pushing the whole scene down.
- Reserve bottom padding for Page Switch, legal text, or other fixed controls. Increase `--panel-safe-bottom` when those controls overlap a side column.
- Use fixed design-width panels on fixed-canvas screens, then let root scaling adapt them.
- Use left/right gradient shadows when the panel needs to blend into the 3D scene.
- Keep the center area visually open for the model. Center overlays must be absolute and must not resize the 3D container.
- Keep page composition layers predictable: scene `0`, panels `10`, header `20`, and Page Switch `30`. The application-level LLM/modal/Confirm/Toast stack uses `1999/2000/2100/2200`; do not invent feature-level values such as `9999`.

## Side-Panel Height Budget

Left and right dashboard columns must fit inside the scaled 1080p canvas. A passive big-screen dashboard must not create a page scrollbar or a scrollbar for the whole side panel.

Wrap the cards in `.dashboard-panel__content` and make each top-level card or card group a `.dashboard-panel__section`. At most one section in a column may use `.dashboard-panel__section--fill`; use it for the chart, bounded table, or list that is allowed to consume the remaining height.

Budget the column before implementation:

```text
available height = 1080 - safe top - safe bottom
required height  = sum(section heights) + section gap × (section count - 1)
required height <= available height
```

For the default `80px` top inset, `24px` bottom inset, and `16px` gaps, the content budget is `976px`. Replace these values with the actual header and fixed-control safe areas used by the screen; do not compensate with browser scrolling.

When the content exceeds the budget, resolve it in this order:

1. Remove, merge, or move lower-priority cards so the column answers fewer, clearer questions.
2. Use compact card density and `12px` section gaps while preserving minimum type and control sizes.
3. Aggregate repetitive statuses and reduce the number of visible table/list rows.
4. Put secondary peer sections behind tabs, pagination, or a controlled carousel/rotation with a visible current state.
5. Move long records and drill-down detail into a Drawer or Dialog.

Do not solve overflow by adding `overflow-y: auto` or `overflow-y: scroll` to `.dashboard-panel`, `.dashboard-panel__content`, the page root, or the screen root. Do not use `height: max-content`, shrink text below the documented baseline, or silently clip critical cards. A table or live-event list may scroll or auto-scroll only inside an explicitly bounded card body; that local region must pause automatic movement on hover/focus and must not move the entire side column.

The geometry contract is:

```text
dashboard panel: top = 0, bottom = 0, overflow = hidden
panel content:   height = 100%, min-height = 0, overflow = hidden
fixed section:   flex = 0 0 auto
one fill section: flex = 1 1 0, min-height = 0
```

After rendering data, both side panels and their content wrappers must satisfy `scrollHeight <= clientHeight + 1`. Treat a larger value as a layout failure even when `overflow: hidden` makes the scrollbar invisible.

## Visual Components

Read `references/data-visualization.md` before choosing a data-display form. Read `references/card-patterns.md` before defining card hierarchy, panel/content/item surfaces, card layouts, or floating cards. Read `references/title-decoration.md` before adding card-title backgrounds or decoration. Read `references/modal-patterns.md` before implementing modal types, focus behavior, close rules, or application-level overlay layers. Keep this file focused on page composition and scene-overlay layout.

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

Charts must own their ECharts instance and dispose it on unmount. Use the bundled `use-echarts.js` lifecycle template for responsive, conditional, tabbed, drawer, or asynchronously loaded chart containers so initialization waits for positive geometry.

Counters should accept value, decimals, duration, prefix/suffix, and unit. Watch value changes and update the CountUp instance instead of remounting.

Use the maintained project's theme first. In the bundled blue-cyan fallback, reserve gold for selected or deliberately highlighted states instead of mixing it into the ordinary chart-series palette.

## Assets

Use the directory and copy contracts in `references/source-architecture.md` as the single source of truth. Copy only assets required by the selected features. Do not embed generated iconfont blobs or source-project font files unless a supplied package or explicit brand requirement needs them.

## Interaction And Motion

Use motion sparingly. Modal timing, drawer direction, and reduced-motion behavior come from `modal.less` and `references/modal-patterns.md`:

- fade for modals
- slide-left/slide-right for panels
- active scaling for Page Switch items
- short loop animations for status indicators

Avoid animations that resize fixed layout containers unexpectedly.
