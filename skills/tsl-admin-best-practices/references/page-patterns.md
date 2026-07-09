# Page Patterns

Use this reference before building route-level pages.

## Standard List Page

- Wrap the route in `BaseBox`.
- Put filters in the table `tableSearch` slot.
- Put batch operations, create button, column settings, and refresh in the table operation area.
- Use a feature-local search component when filters exceed simple one-row controls.
- Keep row operations as link buttons.
- Store selected rows in parent state and pass them to `Table` as `selectList`; clear selection through the exposed `clearSelectEvent()` only after data changes or batch operations.
- Give every reusable list table a stable `tableKey` so column visibility and fixed-left preferences can persist.
- Use `noRefresh` and `noColsSetting` only for small embedded tables where those controls would add noise.

Recommended skeleton:

```vue
<Table
  ref="tableRef"
  table-key="user-list"
  :columns="columns"
  :data-source="list"
  :pagination="pagination"
  :loading="loading"
  :select-list="selectedRows"
  @refresh="getList"
  @check-change="handleCheckChange"
>
  <template #tableSearch>
    <OriInput v-model="query.keyword" class="filter-item" placeholder="请输入关键字" />
    <OriButton type="primary" @click="getList">查询</OriButton>
  </template>
  <template #tableOperate>
    <OriButton type="primary" @click="drawerVisible = true">新增</OriButton>
  </template>
  <template #operate="{ row }">
    <LinkButton @click="handleEdit(row)">编辑</LinkButton>
  </template>
</Table>
```

## Tree + Table Page

- Use a left tree panel and right table/content panel.
- Left panel width is commonly `232px` or `272px`, with `20px` right padding.
- Divider is 1px `#e5e6eb` inside a 2px split area.
- Add a vertical collapse handle at the panel boundary:
  - width `14px`;
  - height `44px`;
  - white background;
  - 1px border;
  - 7px radius;
  - subtle shadow.
- Right panel width is `calc(100% - leftWidth - dividerWidth)` and becomes `100%` when collapsed.

## Detail Page

- Use `DetailBox`.
- Keep route detail pages as composition shells; move sections into child components when there are multiple blocks.
- Use a footer slot for persistent save/cancel or primary actions.
- Use transparent header mode for pages that supply their own visual frame.

## Config Page

- Use white panels with 20px padding.
- Group related settings into sections with 16px titles and 12px-16px gaps.
- Prefer drawers for add/edit and modals for confirmations or tests.

## Login And Error Pages

- Login may use branded bitmap background assets; keep form density consistent with the app.
- Error pages should be simple white/gray admin surfaces, not marketing pages.
- Use source-like 401/404 illustration assets only after checking they are appropriate for the new project.

## Page Component Boundaries

- Route view: data orchestration, state, API calls, composition.
- Search component: filters and submit/reset events.
- Drawer/modal component: form state and validation.
- Table render helpers: status, action links, custom cells.
- Composables/services: reusable API state, dictionaries, and formatting side effects.
