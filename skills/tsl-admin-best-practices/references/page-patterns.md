# 页面范式

## 标准列表页

- 路由视图使用 `BaseBox` 作为页面表面。
- 查询条件放入 `AdminTable` 的 `tableSearch` 插槽。
- 新增、批量操作等业务按钮放入 `tableOperate` 插槽。
- 列设置和刷新由 `AdminTable` 自己渲染。
- 父组件持有选择结果，通过 `selectedRows` 传入；批量操作后调用 `clearSelection()`。
- 每个可复用列表表格提供稳定且不含用户敏感信息的 `tableKey`。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Button as OriButton, Input as OriInput } from 'origami-vue'
import AdminTable from '@/components/business/AdminTable/AdminTable.vue'
import type { TableColumn, TableRow } from '@/components/business/AdminTable/types'
import LinkButton from '@/components/common/LinkButton/LinkButton.vue'

const tableRef = ref<InstanceType<typeof AdminTable>>()
const keyword = ref('')
const selectedRows = ref<TableRow[]>([])
const columns: TableColumn[] = [
  { type: 'checkbox' },
  { type: 'index', title: '序号' },
  { dataIndex: 'name', title: '名称' },
  { dataIndex: 'operate', title: '操作', slot: 'operate', fixed: 'right' },
]
</script>

<template>
  <AdminTable
    ref="tableRef"
    table-key="user-list"
    :columns="columns"
    :data-source="[]"
    :selected-rows="selectedRows"
    @refresh="loadList"
    @check-change="selectedRows = $event"
  >
    <template #tableSearch>
      <OriInput v-model="keyword" class="filter-item" placeholder="请输入关键字" />
      <OriButton primary @click="loadList">查询</OriButton>
    </template>
    <template #tableOperate>
      <OriButton primary @click="openCreateDrawer">新增</OriButton>
    </template>
    <template #operate="{ row }">
      <LinkButton @click="openEditDrawer(row)">编辑</LinkButton>
    </template>
  </AdminTable>
</template>
```

示例中的 `loadList`、`openCreateDrawer` 和 `openEditDrawer` 由具体页面实现。

## 树 + 表格

- 左侧树面板常用宽度为 `232px` 或 `272px`，右侧内边距 `20px`。
- 分隔区宽 `2px`，内部使用 `1px #e5e6eb` 分隔线。
- 右侧面板使用剩余宽度；左侧折叠后占满。
- 树状态、筛选和表格数据分别管理，不把所有行为塞进单一 SFC。

## 详情页

- 使用 `DetailBox` 组合页头、正文和底部操作。
- 路由视图负责数据与区块编排，独立信息块拆到页面私有组件。
- 保存/取消等持续可见操作放入 `footer` 插槽。

## 配置页与表单

- 使用带 `20px` 内边距的白色面板。
- 设置区块标题为 `16px / 500`，区块间距 `12px` 至 `16px`。
- 新增/编辑优先使用抽屉，确认或短流程使用弹窗。
- 表单状态与校验封装在抽屉/弹窗组件中，通过 typed emits 返回提交结果。

## 页面边界

- 路由视图：数据编排、加载状态、API 调用、页面组合。
- 查询组件：筛选值和查询/重置事件。
- 抽屉/弹窗：表单状态、校验和提交结果。
- 渲染组件：状态标签、链接操作、自定义单元格。
- composable/service：可复用的异步状态、字典和格式化副作用。
