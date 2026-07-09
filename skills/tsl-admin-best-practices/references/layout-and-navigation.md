# Layout And Navigation

Use this reference before implementing the app frame.

## Frame

- Use a full-height root: `html`, `body`, and `#app` are `100%`.
- Use a flex layout named with the `tsl-layout` block.
- Default shell is a top header plus left sider plus content:
  - Header height: `48px`.
  - Sider width: `224px`, collapsed width: `56px`.
  - Content background: `#F2F3F5`.
  - Content padding: `20px 2px 20px 20px`.
- Page content normally sits inside a white `BaseBox` with `20px` padding, `4px` radius, and full available height.

## Header

- Header is white with bottom border `#e7e9ec`.
- In the top product header, do not place the sider collapse control before the logo. The collapse control belongs to the workspace breadcrumb header.
- Left side contains the logo/product name followed by the top module menu.
- Logo area is fixed at `210px` wide with `24px` logo height, `8px` right padding, and the title starts about `32px` from the logo area's left edge.
- Top-level modules appear as 72px-wide text items with active color `#5E66F2` and active background `rgba(242, 243, 245, 0.97)`.
- The first top-level menu item starts immediately after the 210px logo area; do not add an extra collapse-icon gap or large custom margin between logo and menu.
- Right side uses outline buttons, SVG icons, assistant entry, vertical divider, and avatar dropdown.
- Keep icon buttons at 20px visual size with 16px-20px spacing.

## Sider

- Sider is white, padded `12px 4px 12px 12px`, with subtle right shadow `1px 0 8px rgba(0, 0, 0, 0.06)`.
- Menu active text is `#5E66F2`; hover background is `#F2F3F5`; menu item radius is `4px`.
- Implement left-side navigation with origami-vue `Menu` (`ori-menu`) plus `Menu.menuItem`, `Menu.subMenu`, `Menu.menuItemGroup`, and `Divider`. Do not hand-roll side navigation with plain `div`/`ul` when reproducing Tacos layouts.
- Tacos side navigation has two common second-level forms:
  - flat module menu: a module title plus direct leaf items, for workbench/ticket/personal task modules;
  - grouped module menu: a module title plus gray section labels and leaf items, for resource-heavy modules.
- When collapsed outside micro-app mode, width is `56px`.
- In micro-frontend mode, allow a narrow or hidden menu:
  - Expanded micro menu width: about `157px`.
  - Use semi-transparent white, `backdrop-filter: blur(8px)`, and rounded top-left when embedded in a host shell.

## Flat Sider Menu

Use the flat menu pattern for modules such as `工作台`, personal todo/done pages, ticket launch pages, and other modules with a small set of direct entries. This form matches the screenshot with `工作台` as a blue module title and four direct rows below it.

### Structure

- The top row is the module title, for example `工作台`, with a collapse/expand chevron on the right.
- Under the module title, render direct leaf items only. Do not create gray group labels or dividers for this form.
- Each leaf item has `name`, `path`, and `icon`.
- Keep all leaf rows aligned to the same icon/text x-position as grouped-menu leaf rows.

Recommended data shape:

```js
export default [
  {
    key: 'navbar-workbench',
    name: '工作台',
    icon: 'icon_menu_workbench',
    isParent: true,
    children: [
      { key: 'menu-my-workbench', name: '我的工作台', path: '/dashboard', icon: 'icon_workbench' },
      { key: 'menu-my-todo', name: '我的待办', path: '/workbench/todo', icon: 'icon_todo' },
      { key: 'menu-my-done', name: '我的已办', path: '/workbench/done', icon: 'icon_done' },
      { key: 'menu-create-ticket', name: '发起工单', path: '/workbench/tickets/create', icon: 'icon_ticket' }
    ]
  }
]
```

### Layout And States

- Expanded sider width remains `224px`; flat menu uses the inner width after sider padding.
- Module title row follows the grouped menu title row: height `36px`, padding `0 16px`, color `#5E66F2`, font size `14px`, line height `22px`.
- The first leaf row starts `8px` below the module title.
- Leaf row uses height `36px`, vertical gap `4px`-`8px`, nested item padding-left `20px` through the `ori-menu` deep override, radius `4px`, 16px icon, 8px icon/text gap, text color `#4E5969`, and one-line ellipsis.
- Active, hover, disabled, collapsed, and route-matching rules are identical to grouped menu leaf rows.
- Do not add group dividers, badges, secondary text, or left rails unless the source page explicitly contains them.

## Grouped Sider Menu

Use the grouped menu pattern for resource-heavy modules such as computing monitor, storage, cloud resources, network resources, container resources, and compute center. This is not a deeply indented tree; it is a flat resource navigation grouped by gray section labels.

### Structure

- The top row is the module title, for example `算力监控`, with a collapse/expand chevron on the right.
- Under the module title, render groups. Each group has:
  - `name`: gray group label, for example `计算设施`.
  - `children`: leaf menu items with `name`, `path`, and `icon`.
- Do not render group labels as clickable menu items.
- Render leaf items as direct rows under their group; do not indent nested levels beyond the icon/text alignment.
- Add a divider after every group except the last. The divider starts at the same x-position as group labels and spans the content width, matching the screenshot rhythm.

Recommended data shape:

```js
export default [
  {
    key: 'navbar-monitor',
    name: '算力监控',
    icon: 'icon_monitor',
    isParent: true,
    group: true,
    children: [
      {
        key: 'compute-facilities',
        name: '计算设施',
        border: true,
        children: [
          { key: 'compute-card', name: '算力卡', path: '/monitor/computing/card', icon: 'icon_compute_card' }
        ]
      }
    ]
  }
]
```

### Layout And Sizes

- Expanded sider width remains `224px`; grouped menu content uses the inner width after sider padding.
- Module title row:
  - height `36px`;
  - horizontal padding `0 16px`;
  - color `#5E66F2`;
  - font size `14px`;
  - line height `22px`;
  - chevron size `14px`-`16px`.
- Group label:
  - margin top `12px` for the first group after module title, `10px` after dividers;
  - padding `0 16px`;
  - color `#86909C`;
  - font size `14px`;
  - line height `22px`;
  - no hover state and no pointer cursor.
- Leaf row:
  - height `36px`;
  - margin top `4px`;
  - nested item padding-left `20px` through the `ori-menu` deep override;
  - border radius `4px`;
  - icon size `16px`;
  - icon/text gap `8px`;
  - text color `#4E5969`;
  - one-line ellipsis for long labels.
- Divider:
  - margin `10px 16px 0`;
  - border top `1px solid #E5E6EB`.

### States

- Active leaf row:
  - background `#E8EDFF`;
  - text and icon color `#5E66F2`;
  - no left rail, bold text, or extra indicator.
- Hover leaf row:
  - background `#F2F3F5`;
  - text remains `#4E5969` unless active.
- Disabled leaf row:
  - color `#C9CDD4`;
  - cursor `not-allowed`;
  - no hover background.
- Collapsed sider:
  - hide module title text, group labels, and dividers;
  - show only leaf icons centered in 36px rows;
  - keep active background and radius.

### Routing

- Active state matches the leaf whose `path` equals the current route path; for detail pages, match the nearest list ancestor by explicit `activePath` or by `route.path.startsWith(item.path)`.
- Module title expansion is local UI state. Do not conflate it with route state.
- When a top-level module changes, clear cached list search state and rebuild grouped menu data before selecting the first enabled leaf.

## Content

- Content scrolls vertically inside the content region, not the whole page.
- Use `overflow-y: overlay` where matching the source console matters.
- Add `cont-padding-right` when a page needs right breathing room for overlay scrollbars.
- Use `.block__animation` on page-level boxes for the 0.5s slide-in.

## Breadcrumbs And Route State

- Place breadcrumbs in the right workspace header, above the gray content canvas and to the right of the side menu. Do not put breadcrumbs inside the white content card.
- Use a 48px-high white breadcrumb bar with `0 16px` horizontal padding, centered alignment, and bottom border `#e7e9ec`. In micro-frontend shells, this bar may share the rounded/white embedded layout surface.
- Put the sider collapse/expand icon at the far left of the breadcrumb bar, before the breadcrumb text. Use a 20px square hover target, 16px icon, 11px right margin, and hover background `#F2F3F5`.
- Render breadcrumbs with origami-vue `Breadcrumb` and `Breadcrumb.Item`. Use the default `/` separator unless a local design explicitly requires another separator.
- Use 14px text and 22px line height by default. In micro-frontend embedded layouts, upgrade breadcrumb text to 16px and make the last item bold, matching the source console.
- Use text color `#4E5969` for clickable ancestors and `#1D2129` for the current page. The last item is never clickable. Disabled/non-clickable ancestors use the normal current text style without hover.
- On hover, clickable ancestors use the primary color `#5E66F2` and cursor pointer. Do not add pill backgrounds, underlines, icons, or large typography.
- Long breadcrumb labels must not push layout controls offscreen. Use origami-vue `long-text` for labels likely to exceed 120px, or apply a single-line ellipsis with tooltip when custom rendering.

## Breadcrumb Data Contract

- Store page-level override breadcrumbs in the user store as `breadcrumbs`.
- Expose a store action named `changeBreadcrumb(value)`; pass `null` after the layout consumes an override so stale breadcrumbs do not leak into the next route.
- Each breadcrumb item uses this shape:

```js
{
  title: '告警规则',
  routeConfig: '/alarm-center/alarm-rules' // optional string or route location object
}
```

- `title` is required and must be user-facing Chinese copy in Chinese admin projects.
- `routeConfig` is optional. If absent, the item renders as text-only.
- The first item is not clickable when it has no `routeConfig`.
- The last item is always the current page and must not navigate, even if `routeConfig` exists.
- Build default breadcrumbs from route metadata when no page override exists:
  - parent/module title from the active top or side menu;
  - current route title from `route.meta.title`;
  - detail/create/edit suffix from page context when needed.
- Pages with static hierarchy should set breadcrumbs on mount:

```js
userStore.changeBreadcrumb([
  { title: '系统管理' },
  { title: '标签管理' }
])
```

- Detail pages should include a navigable list ancestor:

```js
userStore.changeBreadcrumb([
  { title: '告警中心' },
  { title: '告警规则', routeConfig: '/alarm-center/alarm-rules' },
  { title: '告警规则详情' }
])
```

- Dynamic menu modules must initialize menu data before computing breadcrumbs. For resource/detail flows, include the module title, resource type/list page, and final detail label, for example `运维监控 / 云主机 / 资源详情`.
- Clear cached list search state when changing menu modules.
- Derive active menu from route path and route metadata, but let explicit `changeBreadcrumb()` override visual breadcrumb labels for detail pages, wizard steps, and sub-app routes.
