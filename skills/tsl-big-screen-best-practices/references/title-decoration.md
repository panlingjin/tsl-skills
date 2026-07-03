# Card Titles And Decoration

## Contents

- [Source Patterns](#source-patterns)
- [Hierarchy And Selection](#hierarchy-and-selection)
- [Typography Matrix](#typography-matrix)
- [Default Font Policy](#default-font-policy)
- [Title Variants](#title-variants)
- [Icons And Bilingual Meta](#icons-and-bilingual-meta)
- [Decoration Primitives](#decoration-primitives)
- [Markup](#markup)
- [Assets And Tokens](#assets-and-tokens)
- [Restraint And Layout Safety](#restraint-and-layout-safety)
- [Accessibility And Motion](#accessibility-and-motion)

## Source Patterns

This system normalizes reusable visual grammar from the four reference projects. The Ya'an Rail and AI Park Section Marker are deliberate exceptions: their text-free source PNGs are retained for visual fidelity.

| Source | Reusable visual grammar | Normalized use |
| --- | --- | --- |
| `ai-park-screen` | half-frame `gray-title.png` beside a restrained gray subtitle; separate divider with bright end caps | canonical fixed-color Section Marker, capped divider |
| `infra-yaan` | long title rail, top locator blocks, bottom diagonal ticks, paired edge lines | canonical fixed-color Rail PNG |
| `infra-xunfei` | centered panel crown, inward chevrons, compact floating title strip | panel cap and floating bracket |
| `infra-shapan` | the same title-rail structure with a different palette, plus icon orbit and short text bands | reuse the Ya'an Rail layout; keep orbit as a separate primitive |

Typography normalization uses each project's design height: AI Park `1536px`, Ya'an `2160px`, and Xunfei/Shapan `1080px`. The AI Park Marker is an explicit fidelity exception and retains the source component's declared `22px` text, `24px` icon, `8px` gap, and `5px` icon offset. All treatments deliberately ignore the projects' custom font-family declarations.

Keep the unified blue-cyan theme. Gold is a selected/active or deliberately emphasized state, not the default ornament color. The fixed Ya'an Rail and AI Park Marker PNGs do not participate in token-driven color changes.

## Hierarchy And Selection

Use title decoration to communicate hierarchy, not to fill empty space.

| Content level | Default | Allowed alternative | Avoid |
| --- | --- | --- | --- |
| Panel card | `cap` | Ya'an `rail` on an open Rail Panel, or plain header | Rail inside a closed rounded Panel |
| Content/chart card | plain header or section `marker` | `line` for a light subdivision | a full Rail background inside a bordered card |
| Section inside a card | `marker` or `line` | plain text | using another full card header |
| Floating scene card | `bracket` | plain compact header | a panel-sized title crown |
| KPI, status, feature item | plain label | one semantic icon/orbit | repeated background rails on every item |

Apply the restrained hierarchy by default:

1. Give the outer Panel the strongest title treatment.
2. Keep content cards closed and quiet with plain or Marker titles; let the outer open Panel own the Rail.
3. Use a marker or line for internal subsections.
4. Keep repeated KPI and status items quiet so their values remain dominant.

Do not select a decoration from a field name alone. Select it from the card level and the reading hierarchy.

## Typography Matrix

Use this 1920 × 1080 baseline:

| Treatment | Size / line height | Weight | Alignment | Letter spacing |
| --- | --- | --- | --- | --- |
| Panel `cap` | `20px / 28px` | `500` | centered | `1px` |
| Ya'an `rail` | `24px / 32px` | `700` | left | `2px` |
| AI Park Section `marker` | `22px / normal` | `400` | left | `0` |
| Generic Section `line` | `16px / 24px` | `500` | left | `0` |
| Floating `bracket` | `18px / 24px` | `400` | left | `0` |
| Header Meta | `14px / 20px` | `400` | right | `0`; English Meta uses `.06em` |

Keep every decorated title on one line. Use normal text color with no gradient fill, text outline, or strong text glow; the decoration already supplies the visual accent. Active/selected state may change recolorable SVG decoration to gold but does not recolor the Rail or Marker PNGs or change title typography and ordinary title color.

## Default Font Policy

Do not declare a font family in reusable title, section-title, Meta, or numeric-title classes unless the user, supplied design, or maintained project explicitly requires one.

- In the default generated project, omit `font-family` and inherit the page/browser font.
- Do not add Alimama, HYQiHei, OPPOSans, DIN, or another project font merely because it appeared in a source project.
- Do not copy source font files or `@font-face` declarations into the Skill or generated project by default.
- Do not assign a special numeric font to a title or Meta value by default.
- Treat a project-level brand font as an explicit override outside the reusable title template.

## Title Variants

### Panel Cap

Use `.data-card__header--cap` only for a Panel title. It uses the centered crown and inward-chevron language normalized from `infra-xunfei`.

- Height: `48px`
- Title: `20px / 28px`, weight `500`, centered, `1px` letter spacing
- Meta/action: pinned to the right edge
- Maximum: one cap per Panel
- Active state: cyan mask changes to gold through `.data-card--active`

Do not use a cap on every content card; repeated crowns flatten the hierarchy and consume the side-panel height budget.

### Ya'an Rail

Use `.data-card__header--rail` only as the direct header of `.data-card--panel.data-card--rail-panel`. It uses Ya'an's original text-free `1424 × 130` RGBA PNG so the rail geometry, line weights, transparency, and source cyan remain exact. The open Panel modifier removes the competing rounded frame and lets inner cards carry the visible surfaces.

- Height: `45px`, taken from Shapan's native 1080p title height while retaining Ya'an's shared rail geometry
- Title: `24px / 32px`, weight `700`, color `#EFEDE9`, left aligned, `2px` letter spacing
- Meta/action: remains in normal Flex flow at the right
- Surface: transparent; render `card-title-rail.png` through a full-size pseudo-element with `background-size: 100% 100%`
- Text safe area: `14px` on both sides. Ya'an's original `2160p` inset is `28px`, so the `1080p` baseline uses the exact `0.5` scale
- Icon: omit by default. Render `.data-card__title-icon` only when a real semantic icon is supplied; never emit an empty placeholder
- Ornament: use the PNG as-is; do not redraw it, tint it, apply CSS filters, or add a duplicate underline
- Color: fixed to the source PNG. If a future requirement needs another color, provide a separately approved asset rather than approximate it with `filter` or `hue-rotate`

### Floating Bracket

Use `.data-card__header--bracket` for a concise floating card over the scene. It is normalized from `infra-xunfei` floating title strips.

- Height: `28px`
- Title: `18px / 24px`, weight `400`, no extra letter spacing
- Keep content to one short title and one to four metrics/statuses
- Do not combine it with a Panel cap

### Section Marker And Line

Use `.section-title--marker` for a named subsection that must reproduce the AI Park home-screen title. Use `.section-title--line` for a lighter generic divider title; it is not presented as an exact AI Park asset.

AI Park Marker:

- Source: AI Park `gray-title.png`, copied byte-for-byte as `section-title-marker.png`
- Layout: `29px` line box, composed from the source `24px` icon plus its original `5px` top offset
- Title: `22px`, browser-normal line height, weight `400`, color `#C9CDD4`, no extra letter spacing
- Icon: `24 × 24px`, followed by an `8px` gap
- Surface: transparent; do not add a long underline, cyan dot, background strip, glow, mask, filter, or generated frame
- Color: fixed to the source PNG. A different palette requires an approved replacement asset

Generic Line:

- Height: `32px`
- Title: `16px / 24px`, weight `500`, no extra letter spacing
- Use only when a quieter internal divider is required

Wrap the visible text in `.section-title__text` (or use a direct heading element). It keeps the title single-line and truncates before the line decoration or action area can overlap it.

## Icons And Bilingual Meta

Keep icons subordinate to the title text:

| Treatment | Icon size | Gap to text |
| --- | --- | --- |
| Cap | `20px`; omit by default | `8px` |
| Rail | `18px`; omit by default | `8px` |
| AI Park Marker | source ornament `24px` | `8px` |
| Generic Line | optional semantic icon `16px` | `8px` |
| Bracket | `16px` | `8px` |

Use `.data-card__title-icon` inside the title. Do not replace the semantic heading with an icon.

When a Chinese interface also provides an English title:

- Render English as `.data-card__meta.data-card__meta--en` at the right; do not create a second title row.
- Use only English supplied by the business or source data. Do not generate or guess a translation.
- English Meta uses `14px / 20px`, weight `400`, uppercase, and `.06em` letter spacing.
- Add `.data-card__meta--preserve-case` for product names or other copy whose case must remain unchanged.
- Limit Meta width to `96px` in Cap, `120px` in Rail, and `96px` in Bracket.
- When space is tight, shrink and truncate the duplicate English Meta before sacrificing the primary title. Preserve the complete value through context, `title`, or an accessible tooltip.

## Decoration Primitives

- `.decor-divider`: a low-contrast horizontal separator.
- `.decor-divider--capped`: a separator with AI Park-style glowing end caps. Use between major groups, not between every row.
- `.decor-corner`: one structural top-left corner mark; add `.decor-corner--right` only when a balanced pair is justified.
- `.decor-icon-orbit`: a `40px` icon frame normalized from `infra-shapan`.
- `.decor-icon-orbit--running`: rotate the orbit only when the icon means running, syncing, scanning, or loading.

Decorative elements must remain `pointer-events: none`. Static decoration receives no hover state. Do not animate an orbit merely to make an idle card feel active.

## Markup

Panel cap:

```html
<article class="data-card data-card--panel">
  <header class="data-card__header data-card__header--cap">
    <h2 class="data-card__title">设备概览</h2>
    <span class="data-card__meta data-card__meta--en" title="Robot Overview">Robot Overview</span>
  </header>
  <div class="data-card__body">...</div>
</article>
```

Open Rail Panel and subsection:

```html
<section class="data-card data-card--panel data-card--rail-panel">
  <header class="data-card__header data-card__header--rail">
    <h2 class="data-card__title">设备状态</h2>
  </header>
  <div class="data-card__body">
    <div class="section-title section-title--marker">
      <span class="section-title__text">Fault Distribution</span>
    </div>
  </div>
</section>
```

Semantic orbit:

```html
<span class="decor-icon-orbit decor-icon-orbit--running" aria-hidden="true">
  <svg-icon icon-class="sync" :size="20" />
</span>
```

The decoration assets contain no text. Keep semantic titles in HTML so truncation, localization, and assistive technology continue to work.

If a card has neither a title nor header metadata/actions, omit the header element. The decorated header classes hide a truly empty element as a fallback, but templates should not emit whitespace-only headers.

## Assets And Tokens

Copy the five assets from the skill's `assets/img/decorations/` directory to project `src/assets/img/decorations/`. Keep `data-display.less` in `src/assets/style/`; its `../img/decorations/` URLs depend on that layout.

Rail and AI Park Marker are fixed-color source PNGs; the remaining assets are monochrome SVG masks:

```text
card-title-cap.svg
card-title-rail.png
section-title-marker.png
floating-title-bracket.svg
icon-orbit.svg
```

Use the title and decoration tokens in `data-tokens.less` instead of recreating feature-scoped sizes, shadows, or colors. For SVG masks, the mask owns geometry and `--card-title-accent` owns color. The Rail and Marker PNGs retain their embedded colors and do not switch to gold under `.data-card--active`.

The typography tokens contain sizes, line heights, weights, spacing, icon geometry, and Meta limits only. They intentionally contain no font-family token.

## Restraint And Layout Safety

- Give one card only one primary title treatment: `cap`, `rail`, or `bracket`.
- Pair Rail only with `.data-card--rail-panel`. Do not wrap the long transparent Rail in a rounded border, colored Panel fill, or backdrop blur.
- Do not combine a title background, glow border, corner pair, capped divider, and animated orbit on the same card.
- Keep Panel strong, content card medium, subsection light, and repeated items plain.
- Do not add decorative English text, sequence numbers, or status words that are not present in the data.
- Do not position title text with project-specific absolute coordinates.
- Do not add source-project font names or font files without an explicit brand-font requirement.
- Do not let an SVG define title padding, text width, or card height; CSS tokens own layout.
- Keep horizontal ornament lines in the top or bottom edge band, outside the title line box. A line may frame text but must never run behind, through, or immediately across its glyphs. The AI Park Marker has no horizontal line.
- Keep Rail fill transparent. Use only the shared `card-title-rail.png`; do not add a feature-level color wash, duplicate background, or title underline.
- Keep the Rail title at the `14px` header inset. Do not add another title padding, margin, invisible icon slot, or nested content wrapper before the text.
- Use the fixed Ya'an Rail asset by default for Ya'an- and Shapan-derived screens. Do not attempt runtime recoloring; a true palette variant requires another approved raster asset.
- Use the fixed AI Park Marker only for internal subsection titles. Do not promote it to a Panel title or combine it with a Rail, Cap, or another marker.
- Include title heights in the side-panel budget from `big-screen-ui.md`. Decoration is not permission to create column scrolling.
- At `420px`, `480px`, and `520px` side-panel widths, preserve title text and meta before decorative line length. Truncate the title only when its full value is available through context or tooltip.

## Accessibility And Motion

- Use heading elements that match the actual document hierarchy; classes do not determine heading level.
- Mark inline decorative assets and orbit wrappers `aria-hidden="true"`.
- Pair color-coded active/status meaning with text or an icon.
- Keep required actions in normal DOM flow with visible keyboard focus; decoration must not cover them.
- Respect `prefers-reduced-motion`; the running orbit becomes static.
- Preserve readable contrast when the 3D scene behind a Panel changes brightness.
