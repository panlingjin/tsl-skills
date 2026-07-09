# Component Patterns

Use this reference before implementing reusable admin components.

## BaseBox

- Wrap ordinary list/config pages in `BaseBox`.
- Structure: outer full-height overlay scroller plus inner `.base-box.pd-20` with `min-height: 100%`.
- Apply `.block__animation`; add `.cont-padding-right` when the page needs right scrollbar space.

## Side Menu

- Use origami-vue `Menu` for the left navigation shell; derive `MenuItem`, `SubMenu`, and `MenuItemGroup` from `Menu.menuItem`, `Menu.subMenu`, and `Menu.menuItemGroup`.
- Use `Divider` from origami-vue for grouped-menu separators.
- Keep the source structure: flat modules are one `SubMenu` with direct `MenuItem` children; grouped modules are one `SubMenu` with `MenuItemGroup` sections and leaf `MenuItem` children.
- Use `active-text-color="#5E66F2"`, `mode="vertical"`, `:collapse="collapsed"`, `:default-active="activeName"`, and `:default-openeds="defaultOpeneds"`.
- Override `ori-menu` internals with scoped `:deep()` selectors for exact Tacos density, active background, group label spacing, and collapsed width.

## Table

- Build list pages around the bundled `components/table` wrapper, which must use origami-vue `Table`, `Dropdown`, and `Checkbox`.
- Keep the source wrapper surface:
  - `tableSearch` on the left, flex-wrapped.
  - `tableOperate` on the right, no wrap, 16px bottom margin.
  - default slot between the header and table for rare inline alerts or secondary controls.
- Operation icon buttons are 32px square, 1px `#e5e6eb` border, 2px radius, hover `#f2f3f5`.
- Include column setting and refresh icons unless a page explicitly disables them with `noColsSetting` or `noRefresh`.
- Column settings use an origami dropdown containing:
  - an all-columns checkbox with indeterminate state;
  - fixed-left columns and ordinary columns split into sections;
  - pin/unpin icons (`icon_top`, `icon_no_top`) on hover or always visible in simplified templates.
- Persist user column visibility/fixed choices when a project has a front-cache API; otherwise use localStorage keyed by `tableKey`. Do not copy source-project private cache APIs into new projects.
- Pagination total text should read like `共 N 项数据` in Chinese projects.
- Guard pagination `onChange`: page values less than 1 should be coerced to `1`.
- When a page becomes empty after deletion and current page is greater than 1, request the previous page.
- Empty values render `-`; time columns default to `min-width: 170px`.
- Use tooltip overflow for long cell text.
- Standard column config:

```js
[
  { type: 'checkbox' },
  { type: 'index', title: '序号', minWidth: 80 },
  { title: '名称', dataIndex: 'name', minWidth: 160 },
  { title: '状态', dataIndex: 'status', slot: 'status', minWidth: 120 },
  { title: '创建时间', dataIndex: 'createdAt', type: 'time' },
  { title: '操作', dataIndex: 'operate', slot: 'operate', width: 160, fixed: 'right' }
]
```

- Supported column types:
  - `checkbox`: fixed-left selection column.
  - `index`: one-based row number.
  - `time`: formatted date/time and wider default width.
  - `version`: render `V${value}` when present.
  - `address`: read `row.location.address`.
  - `slot`: delegate to a named slot with `{ row, column, rowIndex }`.
  - `expandSlot`: use the table expand content slot.
- Emit `checkChange(records, checked)` for checkbox changes and `refresh` for refresh icon clicks.
- Expose `clearSelectEvent()` and `initTable()` from the table wrapper for parent pages that need imperative reset after batch operations.
- Keep `:deep(.ori-input .ori-input__inner) { padding-bottom: 0; }` inside `.table-search` even if the global reset also exists.

## DetailBox

- Detail pages use a top white header with title, optional back icon, and right operations.
- Header padding: `16px 20px 0`; title size `16px`, weight `500`.
- Body padding: `16px 20px`; white background; bottom corners radius `4px`.
- Footer action bar, when present, is fixed to the bottom of the detail content with 64px height and top shadow.
- `noBgHeader` creates transparent header/body for embedded or custom pages.

## Status And Labels

- Status chips should be compact, table-friendly, and color-coded.
- Prefer text plus subtle color; do not use large decorative badges in dense tables.
- Common states:
  - online/success: green.
  - offline/disabled: gray.
  - warning/processing: orange.
  - error/fail: red.
  - primary/current: `#5E66F2`.

## Link Actions

- Use link-style actions for table row operations.
- Primary link color is `#5E66F2`; hover is darker `#3a3dc9`; disabled is `#c9cdd4`.
- Space adjacent row actions by 16px.

## Search And Filters

- Search areas flex-wrap and align with the table operation area.
- Filter items use right margin `8px` and bottom margin `16px`.
- Standard select width is `180px`; wider multi-select is `280px`.
- Search/reset controls align with `margin-top: 6px` when inline with filters.

## Drawers And Modals

- Use `ori-drawer` for create/edit/detail flows that are secondary to a list page.
- Use top-label forms inside drawers.
- Keep footer buttons primary first, cancel second.
- Use `v-model:visible` and emit `update:visible` from child components.
- Use origami-vue form controls by default. If origami-vue lacks a required behavior, first consider a small project-local wrapper; introduce another component library only with explicit project need and keep it isolated.
