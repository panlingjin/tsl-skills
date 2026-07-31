# 数据可视化

## 目录

- [从问题出发](#start-from-the-question)
- [展示形式选择矩阵](#display-selection-matrix)
- [选择与降级规则](#selection-and-degradation-rules)
- [1080p 视觉基线](#1080p-visual-baseline)
- [Grid 与 Flex 布局](#grid-and-flex-layout)
- [图表约定](#chart-conventions)
- [表格、时间线与列表](#tables-timelines-and-lists)
- [数据状态](#data-states)
- [可复用模板](#reusable-templates)
- [生命周期与无障碍](#lifecycle-and-accessibility)

## Start From The Question

Choose a display from the question the user needs to answer, not from the raw field type alone.

Before building a panel, identify:

1. the comparison target: current value, previous time, category, whole, threshold, or location
2. whether exact lookup or visual pattern recognition matters more
3. the number of categories, time points, and series
4. whether the screen is passive display or interactive analysis
5. the unit, precision, valid range, missing-value rule, and refresh cadence

Do not use a chart when a number, short list, or sentence answers the question faster.

## Display Selection Matrix

| Information task | Default display | Use when | Change to |
| --- | --- | --- | --- |
| Current total or headline metric | KPI/CountUp card | One to six independent values need immediate reading | Compact status list when there are more than six values |
| Several equal-weight metrics | CSS Grid metric cards | Items share the same hierarchy and shape | Flex when content widths or roles differ |
| Single completion or utilization percentage | Linear progress or ring progress | One value is measured against a known maximum | Gauge only when thresholds and operating zones matter |
| Part-to-whole composition | Donut chart | Two to six mutually exclusive parts and the total matter | Stacked bar or ranked list when there are more than six parts |
| Ordered time trend | Line chart | Direction, turning points, and change over time matter | Area line for one dominant series; table for sparse exact timestamps |
| Time volume plus rate | Bar-line combination | Two measures share time but have different units or meanings | Separate aligned charts when dual axes would mislead |
| Category comparison | Vertical bar chart | Two to eight categories have short labels | Horizontal bar for long labels or rankings |
| Ranking | Horizontal bar or ranked list | Order and exact values both matter | Table when records need several descriptive fields |
| Multi-dimensional profile | Radar chart | Three to six normalized dimensions describe one or two entities | Grouped bar when values use different scales or exceed six dimensions |
| Geographic distribution | Map plus scatter/effect scatter | Location is necessary to interpret the value | Ranked list when geography adds no decision value |
| Dense spatial intensity | Heatmap | A continuous surface or matrix needs hotspot detection | Scatter when individual points must remain identifiable |
| Exact multi-field records | Table | Users compare, scan, or locate values across four to eight columns | Cards for fewer than four heterogeneous records |
| Ordered events or strategy execution | Timeline | Sequence and time are the primary relationship | Table when filtering and exact field comparison matter more |
| Status distribution | Status cards, chips, or compact list | A small set of states needs current counts and semantic color | Donut when the share of a stable total is the main question |
| Image, video, or capture results | Media grid/list | Visual evidence is part of the data | Table when metadata is primary and media is secondary |
| Capability, process, or relationship content | Grid/Flex diagram | Items are descriptive nodes rather than numeric measures | Flow or graph only when edges carry real meaning |

## Selection And Degradation Rules

- Keep KPI groups to `2–6` primary values. Move secondary values into a compact list instead of shrinking every number.
- Keep a line chart to `1–4` visible series. Split charts or add an explicit series selector beyond four.
- Keep a donut to `2–6` parts. Group genuinely minor parts as “Other” only when that aggregation is valid.
- Prefer horizontal bars when a category label exceeds six Chinese characters, twelve Latin characters, or when the list is explicitly ranked.
- Prefer vertical bars for up to eight short categories. Add scrolling or pagination rather than compressing dense labels.
- Do not use a pie or donut for negative values, overlapping groups, unrelated percentages, or values that do not form a meaningful whole.
- Do not use a gauge merely because a value contains `%`. Use it only when min/max and threshold zones are meaningful.
- Do not use radar charts for raw measures with incompatible scales. Normalize values and disclose the scale.
- Avoid dual axes unless the relationship between the two measures is intentional and both axes are clearly labeled.
- Use maps only when location changes interpretation. Never use a decorative map as a substitute for category comparison.
- Use a table when exact lookup beats pattern recognition. Use a chart when shape, direction, or relative magnitude is the point.

## 1080p Visual Baseline

Treat `1920 × 1080` as the authoring baseline and scale the entire screen through `useScale`. Do not scale individual chart fonts independently.

Use the bundled `data-tokens.less` values as the default blue-cyan theme:

- primary data/accent: `#45D8FD`
- secondary series: `#78D2D6`, `#6AA2D4`, `#84CDB0`, `#A38ECE`
- warning and risk: `#D8B283`, `#E78181`
- selected/key emphasis only: `#E5C569`
- primary, secondary, muted text: `#F2F3F5`, `#E5E6EB`, `#C9CDD4`
- axis/grid structure: `rgba(143, 181, 197, 0.3)` and `rgba(143, 181, 197, 0.1)`

Use this type scale:

| Role | Size | Notes |
| --- | --- | --- |
| KPI value | `32–40px` | Use tabular numerals and semibold weight |
| Panel title | `24px` | One line; do not compete with the page header |
| Section title | `18px` | Pair with a meaningful divider or background |
| Body/table | `14–16px` | Use `16px` for passive long-distance viewing |
| Unit/secondary label | `14px` | Keep visually subordinate to the value |
| Axis/legend/tooltip | `12–14px` | Never drop below `12px` on the 1080p canvas |

Use an `8px` spacing foundation. Prefer `8`, `12`, `16`, `24`, and `32px`; use one-off values only to align a supplied design asset.

Use dark translucent surfaces and restrained structure:

- panel edge fade: opaque near the screen edge and transparent toward the 3D scene
- card background: `rgba(13, 29, 48, 0.6)`
- card border: `rgba(143, 181, 197, 0.3)`
- striped row: `rgba(255, 255, 255, 0.04)`
- hover/current row: `rgba(72, 232, 255, 0.24)`

Do not use the active/selected theme color as another chart-series color. The bundled fallback uses gold, but Page Switch must map its active state to the maintained project's theme.

## Grid And Flex Layout

Read `references/card-patterns.md` for panel/content/item card hierarchy, card anatomy, 12-column spans, density, surface variants, interaction states, and floating cards. Keep this section focused on arranging data inside a selected card.

Use Grid for repeated, equal-weight data:

- two columns for standard left/right dashboard KPI groups
- three columns only when every item remains at least `120px` wide
- `16px` column gap and `12–16px` row gap by default
- one DOM order that matches visual and reading order

Use Flex for:

- a value paired with an icon or label
- chart plus custom legend
- a title plus unit/action area
- timelines, media rows, and content with unequal widths

Keep each card responsible for one question. Use normal Grid/Flex flow inside it; reserve absolute positioning for a unit label, chart center label, badge, or deliberate media overlay that does not define ordinary content layout.

## Chart Conventions

- Put the unit in the panel subtitle or axis name. Do not repeat it in every axis label.
- Use a shared tooltip: dark translucent background, subtle border, `12px` text, and explicit series name/value/unit.
- Use solid `2px` primary lines. Add area fill only to emphasize one or two dominant series; fade it from about `0.3` to `0.03` opacity.
- Hide point symbols for dense time series; show them for sparse data or on emphasis.
- Start a bar-chart value axis at zero unless negative values or a clearly disclosed analytical range require otherwise.
- Keep legends close to the chart and in the same order as the series. Do not rely on color alone; always include a text label.
- Keep donut geometry under one source of truth: pass `center` and `radius` to `createCompositionOption`; never move `title.left` or `series[0].center` independently through `overrides`.
- Keep donut center typography subordinate to the ring: the default value is `22px / 28px / 600`, the unit is `12px / 28px`, and the label is `12px / 18px / 400`. Pass an unadorned number or value through `centerValue` and pass `类`, `%`, `台`, or another suffix through `unit`; never concatenate the unit into `centerValue`.
- The center value scales down to `20px` and then `18px` for longer content instead of expanding into the ring. If a value still does not fit, abbreviate it in business code and expose the full value outside the ring.
- Composition builders discard `null`, non-numeric, and negative values before both rendering and total calculation. Zero remains valid. Do not use a donut when negative values carry meaning.
- Center text is display-only. The builder forces `title.triggerEvent: false` after merging `overrides`. If feature code uses ECharts `graphic`, set every center-text element to `silent: true`; if it uses an absolutely positioned HTML center layer, set that layer to `pointer-events: none`. A center overlay must never create a rectangular dead zone over the donut ring.
- Use `legendMode: "echarts"` only when ECharts owns the full chart-and-legend canvas. Use `legendMode: "external"` with `.composition-layout` when the legend needs a separate value or percentage column; never render both legends.
- In external-legend mode, split `.composition-layout` into equal `1fr / 1fr` columns. Give the left chart its own `.composition-layout__chart` canvas and keep its donut at the builder default `50%/50%`. Do not render a full-width ECharts canvas underneath a separate HTML legend.
- Keep the `16px` column gap outside the equal tracks: the left chart and right legend receive the same available track width after the gap is removed. Do not reintroduce `42% / 58%` or another feature-specific ratio.
- Use `.composition-layout--stacked` when the available card width is below `360px`; do not shrink the donut and legend into overlapping columns.
- A composition legend may show raw values with their real unit, or calculate `value / validTotal × 100` before adding `%`. Never append `%` directly to raw counts whose sum is not approximately 100.
- Use semantic colors for status, not for ordinary series ordering. Series colors must remain stable across refreshes.
- Read `references/china-map.md` and use the bundled `china-map.js` only for the static Ya'an-style national base map. Build data-driven maps, radar, heatmap, and bar-line options locally because their scales, geometry, and semantics vary by feature.

## Tables, Timelines, And Lists

Use the same visual contract with native tables or a selected component library:

- show `4–8` columns on a passive big screen
- keep the header fixed inside a bounded table region
- wrap the table in `.data-table__scroll` with an explicit card-body height; sticky headers are bounded to this local scroller
- use `40–44px` row height on the 1080p canvas
- use `--` for missing values; preserve numeric zero
- right-align numeric columns and keep units in the header or a dedicated column
- truncate long cells and expose full text through a tooltip
- combine a status dot with text; never encode status by color alone
- use pagination for interactive analysis
- use continuous auto-scroll only for unattended display, pause on hover/focus, and stop it on unmount

Use a timeline when order and elapsed time matter. Keep time, location/entity, and description as separate visual roles. Use a ranked list instead of a table when only rank, name, and value are needed.

## Data States

Treat loading, empty, error, stale, and partial data as first-class states.

- Preserve `0`; only `null`, `undefined`, and invalid numbers become `--`.
- Render an empty-state block instead of an empty coordinate system when no valid points exist.
- Keep the previous valid chart visible during a short refresh when possible; use a small refresh indicator rather than blanking the card.
- Show a concise error and retry action when the user can recover. Do not display raw request errors.
- Mark stale data with its last update time when freshness matters.
- Never fabricate a `100%` denominator for incomplete percentage data.

## Reusable Templates

Use the exact data-visualization copy paths in `references/source-architecture.md`. Copy only the files required by the project.

Keep `data-tokens.less` and `data-display.less` beside each other because the display stylesheet imports the token file. Import `data-display.less` once from the global style entry.

Use the lifecycle template instead of calling `echarts.init()` directly:

```vue
<script setup>
import { computed, shallowRef } from "vue";
import { createCompositionOption } from "@/utils/chart-options";
import { useECharts } from "@/hooks/use-echarts";

const props = defineProps({ data: { type: Array, default: () => [] } });
const chartRef = shallowRef(null);
const option = computed(() => createCompositionOption({
  data: props.data,
  legendMode: "external",
}));

useECharts(chartRef, option);
</script>

<template>
  <div class="composition-layout">
    <div ref="chartRef" class="composition-layout__chart"></div>
    <div class="composition-layout__legend">...</div>
  </div>
</template>
```

Responsive layout does not guarantee that geometry is measurable during the same task that changes loading state. Treat a zero-size container as “not ready yet”: keep the latest option, wait for `ResizeObserver` to report positive dimensions, then initialize once. Do not add a fixed width merely to make initialization pass.

Lifecycle composable contract:

```js
useECharts(container, option, {
  theme,
  initOptions,
  setOptionOptions,
});
// -> { chart, ready, render, resize, dispose }
```

`container` and `option` accept a plain value, ref, computed ref, or getter. `theme` and `initOptions` are read only when an instance is created; changing them requires `dispose()` followed by `render()`. `setOptionOptions` is read whenever a dirty option is applied. Do not describe the whole config object as hot-reactive. Keep callable ECharts callbacks inside the option object; only the top-level `option` argument treats a function as a getter. The template targets Vue 3.2, so it uses a local `unref`-based resolver rather than Vue 3.3-only `toValue`.

The lifecycle helper marks options dirty only when their source changes. ResizeObserver and window resize events resize the existing instance without calling `setOption` again; calling the returned `render()` explicitly forces one option application.

The option builders expose:

```js
createTrendOption({ categories, series, unit, smooth, area, overrides });
createComparisonOption({ categories, series, unit, direction, stacked, showValue, overrides });
createCompositionOption({
  data,
  unit,
  centerLabel,
  centerValue,
  legendMode,
  center,
  radius,
  overrides,
});
createGaugeOption({ value, min, max, unit, name, thresholds, overrides });
```

The static national-map template separately exposes:

```js
await ensureChinaMapRegistered();
createChinaMapOption({ overrides });
```

It accepts no business data and is governed by `references/china-map.md` rather than the general chart-builder merge contract below.

Use `{ name, data, color? }` for trend/comparison series and `{ name, value, color? }` for composition data. Use six-digit hex values for optional series colors so the area-gradient preset can derive transparent stops. Pass gauge thresholds as `{ ratio, color }`, where `ratio` is between `0` and `1`.

For composition charts, `legendMode` is `"echarts"` or `"external"`. Internal mode defaults to `center: ["36%", "50%"]`; external mode defaults to `["50%", "50%"]` because its canvas occupies only the left layout column. The default radius is `["56%", "76%"]`.

Use `overrides` for feature-specific ECharts adjustments. Objects merge recursively and arrays replace the preset array. Composition `center`, `radius`, and legend visibility are reapplied after the merge so text and ring geometry cannot drift apart; change them only through the named parameters. Do not mutate the returned option after sharing it between components.

External legend structure:

```html
<div class="composition-layout">
  <div ref="chartRef" class="composition-layout__chart"></div>
  <div class="composition-layout__legend">
    <div class="composition-legend__item">
      <i class="composition-legend__marker" style="--composition-color: #45d8fd"></i>
      <span class="composition-legend__label">巡检任务</span>
      <span class="composition-legend__value">45 项</span>
    </div>
  </div>
</div>
```

The external layout contract is:

```less
.composition-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
```

Equal columns describe the chart and legend regions, not the ECharts series center relative to the whole card. The donut remains centered at `50% / 50%` inside the left half. When the card is narrower than `360px`, use `.composition-layout--stacked` instead of squeezing either half.

## Lifecycle And Accessibility

- Let each chart component create exactly one ECharts instance after its container is mounted and has positive width and height.
- Use `use-echarts.js` to retain the latest option while hidden/loading, initialize after measurable layout, resize on element changes, and dispose on unmount.
- Stop table/timeline animation and remove listeners on unmount.
- Respect reduced-motion preferences for number, status, and auto-scroll animations.
- Keep text contrast readable over the 3D scene and use a panel fade or backing surface when the scene becomes visually noisy.
- Pair color with text, icons, line styles, or position for status and comparison meaning.
