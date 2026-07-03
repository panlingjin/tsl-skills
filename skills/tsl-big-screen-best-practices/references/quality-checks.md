# Quality Checks

## Formatting And Naming

Use `.editorconfig`:

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
insert_final_newline = false
trim_trailing_whitespace = false
```

Use ls-lint rules:

```yaml
ls:
  src/**:
    .js: kebab-case | PascalCase | point.case
    .ts: kebab-case | PascalCase | point.case
    .tsx: kebab-case | PascalCase | point.case
    .vue: kebab-case | PascalCase | point.case
    .less: kebab-case | point.case
    .spec.js: kebab-case | point.case

  types:
    .d.ts: kebab-case
```

## Commitlint

Use conventional commit types:

- `feat`
- `fix`
- `refactor`
- `style`
- `chore`
- `test`
- `perf`
- `docs`

## Required Vue CLI Config Checks

Before implementing feature UI, confirm these base files and package entries exist:

- `babel.config.js` exists and uses `tsl-cli-helper/preset`.
- `package.json.eslintConfig.extends` includes `tsl-standard`.
- `.eslintignore` exists and includes `iconfont.js` and `public/*`.
- `.editorconfig` exists.
- `.ls-lint.yml` exists.
- `jest.config.js` exists.
- `devDependencies` include `@vue/cli-plugin-babel`, `@vue/cli-service`, `eslint-config-tsl-standard`, `svg-sprite-loader`, and `tsl-cli-helper`.
- `vue.config.js` excludes `src/assets/icons` from the default SVG rule and loads those SVGs with `svg-sprite-loader` using a custom `symbolId(filePath)` that preserves nested folders.
- `vue.config.js` has one `module.exports` that combines dev server, style resources, and SVG sprite config.

When the project uses dt-engine, also confirm `.env` includes:

```env
VUE_APP_TACOS_LOAD_MODE = unity-exe
VUE_APP_DTENGINE_WS = ws://127.0.0.1:8181
```

When the project uses LLM/MCP, also confirm `.env` includes:

```env
VUE_APP_MCP_SERVER_NAME = bigscreen
```

## Tests

Use Vue CLI Jest defaults unless the project already has another runner.

Focus tests on:

- Axios response normalization
- MockJS endpoint envelopes
- Pinia store actions
- Page Switch composable behavior
- `frontControl` action dispatch
- pure chart option builders
- modal close-reason, stack, and lifecycle behavior

For the bundled data-visualization builders, cover:

- null or omitted input produces a valid empty option
- numeric zero remains visible and is not replaced by `--`
- negative comparison values remain numeric
- long category labels can use horizontal comparison mode
- arrays in `overrides` replace preset arrays while nested objects merge without mutating inputs
- composition totals ignore invalid values and show `--` when no valid values exist
- composition center text and donut use the same `center` in internal and external legend modes
- composition geometry parameters remain authoritative when `overrides` attempts to set a different title or series center
- composition center typography uses `22/28/600` for the value, `12/28` for the separate unit, and `12/18/400` for the label; units are not concatenated into `centerValue`
- composition center text keeps `title.triggerEvent: false` after `overrides`; ECharts `graphic` alternatives use `silent: true` and HTML center overlays use `pointer-events: none`
- external composition mode hides the ECharts legend and uses the documented chart/HTML-legend layout without overlap
- raw composition counts never receive a `%` suffix unless they are converted to shares of the valid total
- a chart container that starts at `0×0` does not call `echarts.init`; initialization occurs once after `ResizeObserver` reports positive dimensions
- option changes received while the chart is hidden are rendered after it becomes measurable
- replacing a conditional chart element rebinds observation and disposes the instance owned by the old element
- gauge values clamp to the configured range and threshold ratios remain ordered
- `ensureChinaMapRegistered` registers only `china` and `china-map-outline`, reuses concurrent and repeated calls, and allows retry after a failed import
- `createChinaMapOption` always returns one geo plus two map series, all on `zlevel: 0` with stable `z: 0/1/2`, and contains no business series, Tooltip, VisualMap, animation, or interaction
- pure resize notifications call `resize` without reapplying an unchanged option; changing the option source or explicitly calling `render` applies it once

For the bundled modal templates, cover:

- Dialog, Confirm, Drawer, and Media defaults plus every documented size and Drawer direction
- `v-model:open` and `close-button`, `backdrop`, `escape`, `replaced`, and `programmatic` reasons
- busy state blocks Escape, backdrop, and close-button exits
- the close button remains right-aligned with and without the optional `header-extra` slot
- only the topmost modal handles Escape and Tab; one Confirm may cover one main modal
- replacing a modal does not restore focus into the obscured page, while normal close restores its trigger
- scroll locking remains active until the last modal closes and returns to its original value after unmount
- `keepMounted` preserves DOM without leaving modal listeners or locks active while closed
- AI Park visual tokens compile to the normalized black surface, 134-degree cyan gradient border, 48px header, 20px title, and 32px blur
- the translucent modal surface is a separate background and the gradient border cannot bleed into the content box
- primary and secondary modal actions retain visible hover, disabled, active, and keyboard-focus states
- Scene Callout uses its 16px blur preset without entering the modal stack or rendering a backdrop

Do not snapshot huge visual components unless the project already uses snapshot tests.

## Manual QA

Before delivery:

- Start the dev server when feasible.
- Confirm the root screen mounts to `#infraApp`.
- Confirm the screen is not blank.
- Confirm resize scaling works.
- Confirm both side panels remain inside the 1080p canvas safe area and that the page root, screen root, `.dashboard-panel`, and `.dashboard-panel__content` have no vertical scrollbar.
- After real data renders, confirm each `.dashboard-panel` and `.dashboard-panel__content` satisfies `scrollHeight <= clientHeight + 1`; hidden overflow must not conceal unbudgeted cards.
- Confirm header and Page Switch/fixed-control safe areas are reserved through panel padding, all critical cards remain visible, and no card is clipped at the bottom edge.
- Confirm only an explicitly bounded table or live-list body can scroll or auto-scroll; the whole side column never scrolls, and automatic movement pauses on hover/focus.
- Confirm an over-budget column is resolved through prioritization, compact density, aggregation, tabs/paging/controlled rotation, or Drawer/Dialog drill-down rather than `overflow-y: auto`, tiny text, or `height: max-content`.
- Confirm each data panel answers one clear question and follows the selection matrix in `data-visualization.md`.
- Confirm panel, content, and item cards follow the hierarchy and anatomy in `card-patterns.md`; modals remain separate.
- Confirm Dialog, Confirm, Drawer, Media Viewer, and Scene Callout choices follow `modal-patterns.md` rather than using one generic overlay for every case.
- Confirm modals Teleport to `#infraApp` by default and remain inside the 1080p scaled coordinate system.
- Confirm only one main modal and one overlaid Confirm can be active; the layer values remain LLM `1999`, main `2000`, Confirm `2100`, and Toast reserve `2200`.
- Confirm Dialog, Drawer, and Media allow backdrop close by default, while Confirm does not; busy blocks Escape, backdrop, and close-button exits.
- Confirm opening moves focus inside, Tab/Shift+Tab loop in the topmost modal, Escape closes only the topmost allowed modal, and focus returns after closing.
- Confirm a title provides `aria-labelledby`; a titleless modal provides `ariaLabel`; Confirm uses `alertdialog`, and close controls are real buttons.
- Confirm the close button stays at the header's right edge when `header-extra` is absent, and keeps a 12px gap after it when present.
- Confirm body overflow, long content, optional header/footer slots, Drawer placement, Media layout, and 32px canvas edges at all documented sizes.
- Confirm Dialog, Confirm, Drawer, and Media share the normalized AI Park surface: translucent black, cyan gradient edge, 48px glowing header, and 32px blur.
- Confirm the cyan gradient is confined to the 2px modal edge; the body contains no diagonal cyan wash from a `border-box` background layer.
- Confirm modal primary/secondary actions use the shared classes and remain readable in default, hover, active, focus, and disabled states.
- Confirm Scene Callout uses the lighter blue-gray surface, CSS title accent, 16px blur, no copied image asset, no backdrop, and no modal focus lock.
- Confirm modal and drawer transitions respect reduced motion, and reference-counted scroll locking survives main-plus-Confirm stacking.
- Confirm close, replacement, route leave, and unmount abort requests and clean timers, media, listeners, observers, charts, and dynamic containers.
- Confirm `.card-grid` uses the documented `12/8/6/4` spans for single, main/secondary, double, and triple layouts, with DOM order matching visual order.
- Confirm cards in one grid row align in height without absolute-positioning ordinary content.
- Confirm compact, standard, and spacious cards use the shared padding/header tokens instead of feature-specific duplicates.
- Confirm Panel, content-card, section, floating-card, and repeated-item titles use the `cap`/`rail`/`marker-or-line`/`bracket`/plain hierarchy from `title-decoration.md`.
- Confirm Cap, Ya'an Rail, AI Park Marker, generic Section Line, Bracket, and Meta typography uses `20/28/500/1px`, `24/32/700/2px`, `22/normal/400/0`, `16/24/500/0`, `18/24/400/0`, and `14/20/400` respectively; Rail title color is `#EFEDE9` and Marker title color is `#C9CDD4`.
- Confirm reusable title classes contain no third-party font-family and inherit the browser/page font unless an explicit brand-font requirement exists; numeric titles do not silently opt into DIN or another display font.
- Confirm `.data-card__title-icon` uses `20/18/16/16px` for Cap/Rail/generic Section Line/Bracket with an `8px` text gap, and Cap omits the icon by default. The AI Park Marker instead uses its fixed `24px` source ornament with the same `8px` gap.
- Confirm business-supplied English titles use right-side `.data-card__meta--en`, are never auto-translated, use `.06em` letter spacing, and use `.data-card__meta--preserve-case` when capitalization is semantic.
- Confirm Cap/Rail/Bracket Meta widths do not exceed `96/120/96px`; duplicate English Meta truncates before the primary title and exposes its complete value through context or an accessible tooltip.
- Confirm decorated titles stay on one line and use no gradient fill, text outline, or strong text glow; active/selected changes recolorable SVG decoration without changing ordinary title typography or tinting the Rail or AI Park Marker PNGs.
- Confirm each card uses at most one primary title treatment; title backgrounds, capped dividers, corner pairs, glow borders, and animated orbits are not stacked into visual noise.
- Confirm every Rail header is the direct child of `.data-card--panel.data-card--rail-panel`; the open modifier has no fill, border, radius, shadow, backdrop blur, or outer padding, and a closed rounded Panel never contains a Rail.
- Confirm `.data-card--rail-panel` is not combined with interactive, active, success, warning, danger, or disabled card modifiers; apply those states to inner cards instead.
- Confirm decoration assets exist under `src/assets/img/decorations`, contain no text, scale cleanly at `420px`, `480px`, and `520px` panel widths, and do not cover titles, meta text, or actions.
- Confirm Rail headers have a transparent fill, use Shapan's native 1080p `45px` height and `14px` horizontal padding (Ya'an's `2160p` `28px` inset scaled by `0.5`), and contain no feature-level color wash or duplicate background.
- Confirm Rail title text begins at the shared `14px` inset with `margin: 0`; omit `.data-card__title-icon` unless a semantic icon exists, and ensure an empty icon node consumes no width.
- Confirm `card-title-rail.png` remains the original `1424 × 130` RGBA asset, renders at `100% 100%`, and is not redrawn, filtered, hue-rotated, masked, or token-recolored.
- Confirm `section-title-marker.png` remains byte-identical to AI Park `gray-title.png`, renders at `24 × 24px` with the original `5px` top offset, and is not redrawn, filtered, masked, or token-recolored.
- Confirm the AI Park Marker contains no generated underline, cyan dot, background strip, or additional glow. Other title-mask horizontal lines stay in the top/bottom edge band and never cross the title or Meta glyph area.
- Confirm Panel Cap/Rail/AI Park Marker/generic Section Line/Floating geometry remains `48/45/29/32/28px`, stays inside the side-panel height budget, and does not reduce chart containers below their minimum measurable size.
- Confirm cyan remains the default decoration color, gold appears only for selected/active or deliberate emphasis, and running icon-orbit motion represents a real running/loading/syncing state.
- Confirm `prefers-reduced-motion` stops orbit animation while preserving its static shape, and all decoration remains non-interactive and hidden from assistive technology when rendered inline.
- Confirm static cards have no hover affordance; interactive cards provide hover and visible keyboard focus, and active cards use the gold selection accent.
- Confirm success, warning, and danger cards use a semantic edge plus text/icon meaning instead of saturated full-card fills.
- Confirm that among card variants only panel and floating cards use backdrop blur, and visible card-surface nesting does not exceed two levels; modal and Scene Callout blur follow their separate overlay specification.
- Confirm floating cards remain readable over the scene, keep reusable styles free of viewport coordinates, and use pointer events only when interactive.
- Confirm empty or omitted footers render no divider, and loading/empty/error states preserve the card's context and minimum height.
- Confirm KPI groups use Grid for equal-weight metrics and stay within the recommended two-to-six primary values.
- Confirm trend, comparison, composition, progress, table, timeline, radar, and map forms match their data semantics rather than field names alone.
- Confirm a static Ya'an-style China map follows `china-map.md`, copies only the `110515`-byte province map and `61554`-byte outline, and does not include the two unused approximately `457 KB` geography files.
- Confirm the China map uses one bottom outline geo, one main map series, and one top outline series on one Canvas; every layer has `zlevel: 0`, `z: 0/1/2`, `silent: true`, `roam: false`, hidden labels, disabled emphasis, and no animation.
- Confirm the 1080p shadow geometry is `4px / +/-17px / 42px`, the main province edge is `1px`, the main area is `rgba(29,49,64,.5)`, and the map preserves the Ya'an `50%/40%`, `50%/42%`, and `105%` composition.
- Confirm `.china-map-canvas` fills a parent with measurable height, initializes with Canvas and capped device-pixel ratio, sets the static option once, performs resize-only updates, and disposes on unmount.
- Confirm the static map creates no timers, DOM labels, event handlers, API calls, point/line layers, data refresh, drill-down, Tooltip, or rotation. Verify Taiwan, Hong Kong, Macao, Hainan, and all other source geometry remain visible; record that the copied source has no separately named `南海诸岛` feature, and require project-level map review before public release.
- Confirm every donut keeps its center text concentric with the ring after resize; external legends occupy a separate `.composition-layout` column and hide the ECharts legend.
- Confirm donut center text remains visually subordinate to the ring, keeps value/unit/label as separate typographic roles, and does not overflow the inner radius with representative short and long values.
- Confirm hovering any visible ring segment still triggers its item emphasis and Tooltip even when the pointer overlaps the center text's rectangular bounds; only the geometric donut hole has no item hover target.
- Confirm external donut layouts use equal `1fr / 1fr` chart and legend tracks with the shared `16px` gap; no `42% / 58%` or feature-specific split remains.
- Confirm the external donut stays at `50% / 50%` inside the left track rather than being centered against the full card, and widths below `360px` use the stacked layout.
- Confirm composition legend values either retain their real unit or show calculated shares whose total is approximately 100%; raw counts are never mislabeled as percentages.
- Confirm charts, tables, KPI cards, statuses, and empty states use the bundled blue-cyan tokens unless a supplied design system explicitly overrides them.
- Confirm gold is reserved for selected or deliberately highlighted states.
- Confirm data displays preserve zero, use `--` only for missing/invalid values, and render explicit loading, empty, error, stale, or partial states as required.
- Confirm chart components own initialization, updates, resize handling, and disposal; option builders remain pure.
- Confirm responsive Grid/Flex charts use `use-echarts.js`, never initialize at `0×0`, and recover when loading, `v-if`, `v-show`, tabs, drawers, or panels make the container measurable.
- Confirm tables use fixed headers in bounded regions, show four-to-eight columns on passive screens, truncate overflow with a tooltip, pair status color with text, and pause auto-scroll on hover/focus.
- Confirm API calls go through `src/utils/axios.js`.
- Confirm `.env` contains `VUE_APP_MOCK = true` and mock registration is controlled only by `process.env.VUE_APP_MOCK === "true"`.
- Confirm mock data is reached through Axios and MockJS interception.
- Confirm no component imports mock records directly.
- Confirm Page Switch only appears when enabled.
- Confirm Page Switch uses the bottom-center switch style: `120px x 8px` collapsed handle, `1920px x 99px` base, `120px x 104px` items, and `160px x 140px` active item.
- Confirm Page Switch assets exist when used: `swiper-item-icon.svg`, `switch-base.png`, `switch-icon.png`, and `switch-item-bg.png`.
- Confirm Page Switch default text/icon color is `#f2f3f5`, active/hover text/icon color is `#e5c569`, and `swiper-item-icon.svg` follows `currentColor`.
- Confirm `src/components/svg-icon/SvgIcon.vue` and `src/components/svg-icon/index.js` exist when any SVG icon is used.
- Confirm `src/components/svg-icon/index.js` imports all icons with `require.context("@/assets/icons/svg", true, /\.svg$/)` and globally registers `SvgIcon`.
- Confirm `src/plugin/index.js` installs the svg-icon plugin before components render.
- Confirm `SvgIcon.vue` supports `prefix`, so weather icons can use `prefix="weather" icon-class="qing"`.
- Confirm Page Switch is mounted inside the same scaled big-screen root as the rest of the UI.
- Confirm dt-engine code is included only when required.
- When dt-engine is used, confirm the home/scene view renders `three-container` and actually calls `await init()`.
- When dt-engine is used, confirm `#three-container` fills the page or full scene area with `position: absolute`, `inset: 0`, `width: 100%`, and `height: 100%`.
- Confirm Header, left dashboard, right dashboard, Page Switch, modals, and LLM/MCP controls overlay the 3D scene instead of shrinking or pushing the scene container.
- Confirm the center of the screen remains available for the 3D model and center overlays do not resize `#three-container`.
- Confirm MCP/LLM code is included only when required.
- Confirm MCP server creation uses `new mcpServer(process.env.VUE_APP_MCP_SERVER_NAME || "bigscreen")`.
- Confirm generated code does not hard-code `green-computing-body`.
- Confirm LLM quick question buttons are fixed at the bottom-right interaction area, use icon-only `56px` groups, and throttle clicks.
- Confirm LLM quick-question icons exist when used: `icon-refresh.svg`, `icon-question-1.svg`, and `icon-question-2.svg`.
- Confirm weather icons are copied when Header/weather UI is included.

## Security Review

Search before delivery:

```bash
rg -n "token|secret|appSecret|Authorization|jwt|http://|https://|ws://|wss://" .
```

Private hosts, tokens, secrets, app credentials, JWTs, and customer-specific model ids must not be committed. Replace them with environment variables or placeholders.

## Skill-Specific Acceptance

For projects generated from this skill:

- Only `zod@3.23.8` and `@tslfe/dt-engine@4.3.1-1` are forced exact versions.
- HTTP uses the shared Axios instance in `src/utils/axios.js`.
- Vue CLI Babel and ESLint config are present before running or building.
- dt-engine local development env uses `unity-exe` and `ws://127.0.0.1:8181`.
- LLM uses `@tslfe/ai-sdk` + MCP tools when requested.
- MCP handlers delegate to `frontControl`.
- Timers, event listeners, charts, WebSockets, dynamic modals, POI, and effects are cleaned up.
- Data-display forms follow `data-visualization.md`, and copied visualization templates remain at their documented target paths.
- Static Ya'an-style national maps follow `china-map.md`; both source assets remain byte-identical, registration is cached, and the three static layers share one Canvas.
- Card hierarchy, layout spans, density, surfaces, interaction states, and nesting follow `card-patterns.md`.
- Card-title hierarchy, fixed-color Rail and AI Park Marker PNGs, reusable SVG masks, restrained decoration, active color, and motion behavior follow `title-decoration.md`; copied assets remain at their documented target path.
- Decorated title typography uses the browser/page default font and the documented metrics, icon spacing, bilingual Meta, truncation, and text-effect rules.
- Modal type, stack, focus, close, Teleport, sizing, layer, motion, and cleanup behavior follows `modal-patterns.md`; copied modal templates remain at their documented target paths.
