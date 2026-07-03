# Card Patterns

## Contents

- [Card Hierarchy](#card-hierarchy)
- [Standard Anatomy](#standard-anatomy)
- [Choose The Card Type](#choose-the-card-type)
- [Grid And Stack Layout](#grid-and-stack-layout)
- [Density And Size](#density-and-size)
- [Surface And Visual States](#surface-and-visual-states)
- [Content Patterns](#content-patterns)
- [Nesting And Performance](#nesting-and-performance)
- [Reusable CSS Contract](#reusable-css-contract)
- [Accessibility And Data States](#accessibility-and-data-states)

## Card Hierarchy

Use cards at three levels. Do not style every rectangle as the same component.

1. **Panel card**: organize a related dashboard region. It can contain content cards but must not compete with their data hierarchy.
2. **Content card**: answer one question with a chart, table, list, or focused explanation.
3. **Item card**: show one metric, status, feature, or media item inside a panel/content card.

Keep modals separate. A modal owns focus, dismissal, and application-level layering; it is not a card variant. Use `references/modal-patterns.md` for Dialog, Confirm, Drawer, Media Viewer, and non-modal Scene Callout behavior.

A Ya'an Rail title requires an open Panel surface. Combine `.data-card--panel` with `.data-card--rail-panel`; the latter removes the closed card fill, border, radius, blur, and padding so the long Rail can define the Panel edge. Never place a Rail header directly inside the standard rounded Panel shown below it.

Use at most two visible card surfaces in one branch: a panel plus content/item cards. Avoid panel → content card → decorated item card → decorated inner block nesting.

## Standard Anatomy

Use this order when a region needs each part:

```text
data-card
├── data-card__header
│   ├── data-card__title
│   └── data-card__meta (unit, time, filter, or action)
├── data-card__body
└── data-card__footer (source, legend, paging, or secondary action)
```

- Keep the title, unit, freshness label, filter, and actions in the header rather than floating them over ordinary content.
- Use one line for a card title. Truncate only when the full title is available through context or a tooltip.
- Let the body use `flex: 1` and `min-height: 0` so charts and bounded lists can size correctly.
- Omit the footer when it has no real content. Do not render an empty divider.
- Keep decorative title backgrounds independent of text sizing and padding; a supplied image may decorate the header but must not define its layout.
- Read `title-decoration.md` before choosing a Panel cap, content rail, section marker/line, floating bracket, divider, corner, or icon orbit. Keep repeated KPI/status item titles plain by default.
- Keep reusable card-title typography on the browser/page default font. Add a brand or third-party font only when the user, supplied design, or existing project explicitly requires it.
- Reset heading margins through `.data-card__title`; do not rely on browser `h2/h3` defaults for title placement.

## Choose The Card Type

| Type | Purpose | Default composition | Avoid |
| --- | --- | --- | --- |
| Panel card | Group one dashboard topic or mode | Header plus stacked/grid content | Putting unrelated sections in one panel |
| Content/chart card | Answer one analytical question | Header, bounded body, optional footer | Mixing several unrelated charts |
| KPI card | Highlight one current value | Label, value, unit, optional icon/trend | Using a chart for one plain number |
| Status card | Show state and count/value | Status/icon, label, value, text state | Encoding state by color alone |
| Feature card | Explain a capability or category | Icon/image, title, short description | Long paragraphs or fake numeric decoration |
| Media card | Present image/video evidence | Fixed-ratio media, caption, metadata | Stretching or cropping critical evidence silently |
| Floating card | Annotate the 3D scene | Strong surface, concise content, optional pointer | Reproducing an entire side dashboard over the scene |

Use the data-display selection rules in `references/data-visualization.md` inside content, KPI, and status cards. Card type controls hierarchy and surface; it does not decide whether the body should be a line chart, table, or list.

## Grid And Stack Layout

Use `.card-stack` for vertical groups and `.card-grid` for aligned rows. The default gap is `16px`; use the compact `12px` gap only in dense side panels.

The grid has 12 equal columns:

- `.card-span--12`: one full-width card
- `.card-span--8` + `.card-span--4`: main/secondary layout
- two `.card-span--6`: equal two-column layout
- three `.card-span--4`: equal three-column layout

Keep DOM order equal to visual reading order. Do not use dense grid placement that moves later content into earlier gaps.

Use the span class on the card itself. Cards in the same grid row stretch to equal height; content inside them must not fake equal height with absolute positioning.

Inside a side dashboard around `420–520px` wide:

- prefer one full-width chart/table card
- use two columns for normal KPI/status items
- use three columns only when each item remains at least `120px` wide
- use the `8/4` main/secondary split only for concise content

Use Grid for equal-weight repeated cards. Use Flex inside a card for icons, labels, legends, units, and unequal content roles.

## Density And Size

Use the 1920 × 1080 authoring baseline and scale the screen root.

| Density | Padding | Header minimum | Gap to body | Use for |
| --- | --- | --- | --- | --- |
| Compact | `12px` | `28px` | `12px` | KPI/status groups and dense side panels |
| Standard | `16px` | `32px` | `16px` | Charts, tables, lists, and most content |
| Spacious | `24px` | `40px` | `24px` | Feature/media cards and presentation-focused panels |

Defaults:

- standard card radius: `8px`
- KPI/status minimum height: `76px`
- content/chart minimum height: `160px`
- floating card minimum width: `220px`
- card group gap: `16px`; compact gap: `12px`

Prefer minimum sizes over fixed heights. Use a fixed height only when aligned charts, bounded tables, media ratios, or passive auto-scrolling require it.

Minimum card sizes do not override the side-panel height budget. Before stacking cards in a left or right dashboard column, verify that all sections, gaps, and safe areas fit the 1080p canvas contract in `big-screen-ui.md`. If they do not fit, reduce information density through prioritization, aggregation, tabs/paging, or drill-down overlays; never make the whole card stack vertically scrollable.

## Surface And Visual States

Use the unified blue-cyan theme from `data-tokens.less`.

- **Panel**: dark blue-green gradient, stronger border, and one `32px` backdrop blur.
- **Open Rail Panel**: transparent surface with no border, radius, shadow, blur, or outer padding. Its Rail header and inner content/item cards provide the visible structure.
- **Standard content/item card**: translucent `rgba(13, 29, 48, 0.6)` surface, structural border, no backdrop blur.
- **Floating card**: more opaque surface, stronger border, backdrop blur, and a restrained external shadow for separation from the scene.
- **Active**: gold border/accent and a small focus shadow. Do not recolor ordinary chart series gold.
- **Success/warning/danger**: add a `2px` semantic edge and adjust the border. Do not fill the whole card with a saturated status color.
- **Disabled**: reduce opacity, suppress interaction, and keep text readable enough to understand the unavailable item.

Static cards do not move or glow on hover. Add hover and keyboard focus only with `.data-card--interactive`, and only when clicking the whole card performs an action.

Keep radius consistent within one screen. Do not mix sharp-corner panels, pill cards, and heavily rounded cards without a supplied design reason.

Do not combine the open horizontal language of a Rail background with the complete border of a rounded Panel. Choose one of these compositions:

```html
<section class="data-card data-card--panel data-card--rail-panel">
  <header class="data-card__header data-card__header--rail">
    <h2 class="data-card__title">核心运营数据</h2>
  </header>
  <div class="data-card__body">...</div>
</section>
```

```html
<section class="data-card data-card--panel">
  <header class="data-card__header">
    <h2 class="data-card__title">核心运营数据</h2>
  </header>
  <div class="data-card__body">...</div>
</section>
```

## Content Patterns

### KPI And Status

- Place value and unit on the same baseline; keep the unit visually subordinate.
- Use tabular numerals for changing values.
- Keep the icon area fixed so labels and values align across a row.
- Preserve numeric zero. Use `--` only for missing or invalid data.
- Pair semantic color with text or an icon.

### Feature Cards

- Use one icon or image, one short title, and a description of one to three lines.
- Align media and titles consistently across a grid.
- Do not animate every icon. Use one restrained motion motif and respect reduced motion.

### Media Cards

- Use `16:9` for video and wide captures; use `4:3` only when the source or task requires it.
- Use `object-fit: cover` for decorative media and `contain` when cropping would hide evidence.
- Keep captions and status outside the media layer unless they are genuine overlays.

### Floating Cards

- Keep content concise: usually one title and one to four metrics/statuses.
- Use `pointer-events: auto` only when the card is interactive; let its surrounding overlay remain transparent to scene input.
- Position the floating card at the scene/view level. Do not encode viewport coordinates in the reusable card style.

## Nesting And Performance

- Limit visible card-surface nesting to two levels.
- Apply backdrop blur only to panel and floating surfaces. Repeated blur on every nested card is expensive and muddies the hierarchy.
- Avoid large animated shadows and continuous transforms on a full card grid.
- Keep ordinary content in Grid/Flex flow. Reserve absolute positioning for deliberate badges, pointers, or media overlays.
- Keep z-index local. A card should not create viewport-level stacking values intended for headers, Page Switch, or modals.
- Preserve the card's minimum height during loading and empty states to avoid layout jumps.

## Reusable CSS Contract

Copy `data-tokens.less` and `data-display.less` as described in `references/data-visualization.md`.

Layout:

```text
.card-stack
.card-stack--compact
.card-grid
.card-grid--compact
.card-span--12 | --8 | --6 | --4
```

Card anatomy and variants:

```text
.data-card
.data-card--panel | --rail-panel | --floating
.data-card--compact | --spacious
.data-card--interactive | --active | --disabled
.data-card--success | --warning | --danger
.data-card__header | __title | __meta | __unit | __body | __footer
.data-card__header--cap | --rail | --bracket
.data-card__title-icon
.data-card__meta--en | --preserve-case
```

Section titles and restrained decoration:

```text
.section-title
.section-title__text
.section-title--marker | --line
.decor-divider | .decor-divider--capped
.decor-corner | .decor-corner--right
.decor-icon-orbit | .decor-icon-orbit--running
```

Specialized item patterns:

```text
.metric-item
.status-card
.feature-card
.media-card
```

Do not reproduce these surface values in scoped component styles. Use the classes and tokens, then add feature-specific layout only where needed.

Treat `.data-card--rail-panel` as a Panel modifier, not as another visible nesting level. Keep its direct children in normal flow and place visible surfaces on the inner metric/content cards only.

Do not combine `.data-card--rail-panel` with `.data-card--interactive`, status, or active card modifiers. Put interaction and semantic state on the appropriate inner card so the open Panel remains structural rather than behaving like one large button.

## Accessibility And Data States

- Use a button or link for a fully clickable card, or provide equivalent keyboard semantics and an accessible name.
- Keep `.data-card--interactive` focus visible; do not remove the outline without a replacement.
- Do not rely on hover to reveal required information.
- Pair status color with text/icon meaning and maintain readable contrast over the 3D scene.
- Keep loading, empty, error, and stale states inside the card body and preserve the card header/context.
- Stop item motion when reduced motion is requested.
