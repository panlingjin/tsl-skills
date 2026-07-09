# Style System

Use this reference before writing tokens, Less utilities, or component overrides.

## Core Colors

Use these tokens first:

```less
@font-color-strong: #1d2129;
@font-color-regular: #4e5969;
@font-color-sub: #86909c;
@tsl-blue: #5e66f2;
@tsl-purple: #8080ff;
@tsl-fuchsia: #a7419e;
@tsl-green: #4fc08d;
@tsl-background-color: #f7f8fa;
@tsl-border-color: #f1f4f8;
```

Common literal colors:

- Page background: `#F2F3F5`.
- White panels: `#fff`.
- Border: `#e5e6eb`.
- Light fill: `#f7f8fa`.
- Hover fill: `#f2f3f5`.
- Disabled/scrollbar gray: `#c9cdd4`.
- Primary: `#5E66F2`.
- Success/accent green: `#6AD6C7`, `#34AD9D`, `#00b42a`.
- Warning: `#FDA64A`, `#FF7D00`.
- Danger: `#F56C68`, `#F24949`, `#f53f3f`.

## Typography

- Use system UI font stack with Chinese fallbacks:
  `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif`.
- Base text: `14px`, line height `22px`.
- Secondary metadata: `12px`, line height `20px`.
- Section titles: `16px`, `font-weight: 500` or bold only where the source uses stronger emphasis.
- Do not use oversized marketing typography in admin surfaces.

## Shape, Spacing, Motion

- Default radius is `4px`; compact icon buttons may use `2px`.
- Use 8px, 12px, 16px, 20px, and 24px spacing utilities.
- Prefer dense but readable tables and forms.
- Page-level entry animation:
  - duration `0.5s`;
  - translate from `100px` to `0`;
  - fade from `0` to `1`.

## Global Utilities

Keep the following utilities available:

- Spacing: `.mr-rt-8`, `.mr-lt-8`, `.mr-bt-16`, `.mr-tp-16`, `.pd-20`, `.cont-padding-right`.
- Flex: `.flex-ac`, `.flex-c-c`, `.flex-js`, `.flex-b-c-n`, `.flex-cc`, `.flex-ccc`.
- Text: `.text-nowrap`, `.word-row`, `.font-bold`.
- Interaction: `.cursor-p`, `.transform-icon`, `.scroll-y`.
- Surface: `.base-box`.

## Component Overrides

- Override origami-vue internals with `:deep()` only where the source-console density requires it.
- Reset `.ori-input .ori-input__inner { padding-bottom: 0; }` in the global reset or the relevant form/search/table scope. The upstream default `padding-bottom: 16px` can break input height, filter alignment, and form-row baselines.
- Use global dropdown classes for avatar, menu, select header, and operation dropdowns.
- Scrollbars are 6px, transparent track, thumb `#c9cdd4`, radius `4px`; in inner panels, hide the thumb until hover when appropriate.
