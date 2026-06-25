---
title: 表格 Table
impact: HIGH
impactDescription: 使用错误 API 会导致表格数据不渲染、列配置失效或功能异常，且基于 vxe-table 封装，API 与常见组件库差异大
type: component
tags: [origami-vue, data-display]
---

# 表格 Table

**Impact: HIGH** - 使用错误 API 会导致表格数据不渲染、列配置失效或功能异常，且基于 vxe-table 封装，API 与常见组件库差异大

## 何时使用

- 当有大量结构化的数据需要展现时；
- 当需要对数据进行排序、搜索、分页、自定义操作等复杂行为时。

> 当前 table 组件基于 vxe-table 封装而成，详细文档见 https://vxetable.cn/#/table/api

## 重要提示

> **`columns` prop 不可用**：虽然 `columns` 在类型定义中存在，但组件渲染函数中从未消费该 prop。**定义列的唯一方式是通过 `<OriTable.column>` 子组件放在默认插槽中**。所有官方 demo 均使用此方式。

## API 参考

### Table Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| dataSource | 表格数据 | _any[]_ | `[]` |
| size | 表格的尺寸 | _medium \| small \| mini_ | `-` |
| loading | 表格是否显示加载中 | _boolean_ | `false` |
| align | 所有的列对齐方式 | _left \| center \| right_ | `left` |
| stripe | 是否带有斑马纹 | _boolean_ | `false` |
| max-height | 表格的最大高度 | _number \| string_ | `-` |
| height | 表格的高度；支持铺满父容器或者固定高度，如果设置 auto 为铺满父容器（如果设置为 auto，则必须确保存在父节点且不允许存在相邻元素） | _number \| string_ | `-` |
| show-header | 是否显示表头 | _boolean_ | `true` |
| empty-text | 空状态文本 | _string_ | `-` |
| pagination | 分页配置对象（详见下方 Pagination 配置） | _object_ | `-` |
| paginationDirection | pagination 对齐方向 | _left \| right_ | `right` |
| row-class-name | 给行附加 className | _string \| (({ row, rowIndex, $rowIndex }) => any)_ | `-` |
| bordered | 边框模式 | _default \| full \| outer \| inner \| none \| true_ | `inner` |
| dragable | 是否支持拖拽 | _boolean_ | `false` |
| dragconfig | 拖拽配置，具体参考 SortableJS 配置项 | _object_ | `-` |
| tooltip-config | 提示框配置 | _{ theme?: string, enterable?: boolean }_ | `{ theme: 'light', enterable: true }` |
| expand-config | 展开行配置 | _{ iconOpen?: string, iconClose?: string }_ | `-` |
| radio-config | 单选配置 | _{ checkMethod?: function }_ | `-` |
| checkbox-config | 多选配置 | _{ checkMethod?: function }_ | `-` |
| row-config | 行配置 | _{ isHover?: boolean, isCurrent?: boolean, keyField?: string }_ | `-` |
| tree-config | 树形配置 | _{ transform?: boolean, rowField?: string, parentField?: string }_ | `-` |

### Pagination 配置

通过 `:pagination` 传入分页配置对象，Table 内部会渲染 Pagination 组件。分页器仅在 `dataSource` 非空且 `pagination` 存在时渲染。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| current | 当前页码 | _number_ | `-` |
| pageSize | 每页条数 | _number_ | `10` |
| total | 数据总数 | _number_ | `0` |
| disabled | 是否禁用 | _boolean_ | `false` |
| showSizeChanger | 是否显示页码大小选择器 | _boolean_ | `false` |
| showQuickJumper | 是否显示快速跳转 | _boolean_ | `false` |
| showTotal | 显示总数的函数 | _(total: number, range: [number, number]) => VNode_ | `-` |
| pageSizeOptions | 页码大小选项 | _string[]_ | `['10', '20', '30', '40']` |
| size | 分页器尺寸 | _string_ | `-` |
| onChange | 页码改变回调 | _(page: number, pageSize: number) => void_ | `-` |
| onShowSizeChange | 每页条数改变回调 | _(current: number, pageSize: number) => void_ | `-` |

> **注意**：分页事件通过 pagination 对象的 `onChange` 属性传入，**不是** Table 的 `@change` 事件。Table 组件没有 `@change` 事件。

### Table Slots

| 名称 | 说明 |
| --- | --- |
| default | **必需**。放置 `<OriTable.column>` 子组件定义列 |
| empty | 空数据时显示的文本内容 |

### Table Column Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show-overflow | 设置所有内容过长时显示为省略号 | _ellipsis \| title \| tooltip_ | `-` |
| show-header-overflow | 表头内容过长时显示为省略号 | _ellipsis \| title \| tooltip_ | `-` |
| type | 列的类型 | _seq \| checkbox \| radio \| expand_ | `-` |
| dataIndex | 列字段名 | _string_ | `-` |
| title | 列标题 | _string_ | `-` |
| width | 列宽度（如果为空则均匀分配剩余宽度，如果全部列固定了，可能会存在宽屏下不会铺满，可以配合 "%" 或者 "min-width" 布局） | _number \| string_ | `-` |
| min-width | 最小列宽度；会自动将剩余空间按比例分配 | _number \| string_ | `-` |
| fixed | 将列固定在左侧或者右侧 | _left \| right_ | `-` |
| align | 列对齐方式 | _left \| center \| right_ | `left` |
| sortable | 是否允许列排序 | _boolean_ | `false` |
| sort-by | 只对 sortable 有效，指定排序的字段 | _string \| (({ row, column }) => string \| number)_ | `-` |
| filters | 配置筛选条件 | _any[]_ | `-` |
| filter-method | 只对 filters 有效，列的筛选方法 | _({ value, option, cellValue, row, column }) => boolean_ | `-` |
| tree-node | 树形节点标记列 | _boolean_ | `false` |

### Table Column Filters

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 显示的值 | _string_ | `-` |
| value | 实际的值 | _any_ | `-` |
| checked | 默认是否选中 | _boolean_ | `false` |
| resetValue | 重置时的默认值 | _any_ | `-` |

### Table Column Slots

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| default | 自定义显示内容模板 | _{ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, \_columnIndex }_ |
| header | 自定义表头内容的模板 | _{ column, columnIndex, $columnIndex, \_columnIndex, $rowIndex }_ |
| content | 只对 type=expand 有效，展开行内容模板 | _{ row, rowIndex }_ |
| title | 只对 type=checkbox,radio 有效，自定义标题模板 | _{ column, columnIndex, $columnIndex, \_columnIndex, $rowIndex }_ |
| checkbox | 只对 type=checkbox 有效，自定义复选框模板 | _{ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, \_columnIndex, checked, disabled, indeterminate }_ |
| radio | 只对 type=radio 有效，自定义单选框模板 | _{ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, \_columnIndex, checked, disabled }_ |

### Table Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| @checkbox-change | 复选框勾选/取消 | _{ checked, row, ... }_ |
| @checkbox-all | 复选框全选/全取消 | _{ checked, ... }_ |

### Table 实例方法

通过 `ref` 获取实例后，使用 `methods()` 调用 VxeTable 方法：

```typescript
const xTable = ref()
const records = xTable.value?.methods('getCheckboxRecords')()
```

## 使用示例

### 基础用法

```vue
<template>
  <OriTable :data-source="tableData" size="mini" :loading="loading" bordered="inner">
    <OriTable.column type="seq" title="序号" width="60" />
    <OriTable.column data-index="name" title="名称" width="120" />
    <OriTable.column data-index="age" title="年龄" width="80" align="center" sortable />
    <OriTable.column data-index="address" title="地址" show-overflow="tooltip" />
    <template #empty>
      <div class="text-xs text-tsl-gray-5">暂无数据</div>
    </template>
  </OriTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Table as OriTable } from 'origami-vue'

const loading = ref(false)

const tableData = ref([
  { name: '张三', age: 28, address: '北京市朝阳区' },
  { name: '李四', age: 32, address: '上海市浦东新区' },
])
</script>
```

### 带分页

```vue
<template>
  <OriTable
    :data-source="tableData"
    :pagination="pagination"
    size="mini"
    :loading="loading"
    bordered="inner"
  >
    <OriTable.column type="seq" title="序号" width="60" />
    <OriTable.column data-index="name" title="名称" />
    <OriTable.column data-index="age" title="年龄" width="80" />
  </OriTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Table as OriTable } from 'origami-vue'

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const tableData = ref([
  { name: '张三', age: 28 },
  { name: '李四', age: 32 },
])

const pagination = ref({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: 50,
  showSizeChanger: true,
  onChange: (page: number, size: number) => {
    currentPage.value = page
    pageSize.value = size
    // 重新请求数据
  },
})
</script>
```

### 自定义列内容

```vue
<template>
  <OriTable :data-source="tableData" size="mini" bordered="inner">
    <OriTable.column data-index="name" title="名称" />
    <OriTable.column data-index="status" title="状态" width="120">
      <template #default="{ row }">
        <span :class="['status-icon', statusCssMap[row.status]]">{{ statusMap[row.status] }}</span>
      </template>
    </OriTable.column>
    <OriTable.column data-index="action" title="操作" width="170" fixed="right">
      <template #default="{ row }">
        <OriButton type="text" primary @click="handleDetail(row.id)">详情</OriButton>
        <OriButton type="text" primary @click="handleEdit(row.id)">编辑</OriButton>
      </template>
    </OriTable.column>
  </OriTable>
</template>
```

### 展开行

```vue
<template>
  <OriTable :data-source="tableData" size="mini" bordered="inner">
    <OriTable.column type="expand" data-index="sex" title="详情">
      <template #default="{ row }">
        <span>{{ row.sex }}</span>
      </template>
      <template #content="{ row }">
        <div>
          <p>ID：{{ row.id }}</p>
          <p>Name：{{ row.name }}</p>
        </div>
      </template>
    </OriTable.column>
    <OriTable.column data-index="name" title="名称" />
  </OriTable>
</template>
```

### 多选与单选

```vue
<template>
  <!-- 多选 -->
  <OriTable :data-source="tableData" size="mini" :checkbox-config="{ checkMethod }" @checkbox-change="handleCheckChange">
    <OriTable.column type="checkbox" width="50" />
    <OriTable.column data-index="name" title="名称" />
  </OriTable>

  <!-- 单选 -->
  <OriTable :data-source="tableData" size="mini" :radio-config="{ checkMethod }">
    <OriTable.column type="radio" width="50" />
    <OriTable.column data-index="name" title="名称" />
  </OriTable>
</template>
```

### 行悬停与固定高度

```vue
<template>
  <OriTable
    :data-source="tableData"
    size="mini"
    :row-config="{ isHover: true }"
    height="300px"
    bordered="inner"
  >
    <OriTable.column data-index="name" title="名称" />
    <OriTable.column data-index="age" title="年龄" />
  </OriTable>
</template>
```

### 树形数据

```vue
<template>
  <OriTable
    :data-source="tableData"
    size="mini"
    :tree-config="{ transform: true, rowField: 'id', parentField: 'parentId' }"
    bordered="inner"
  >
    <OriTable.column data-index="name" title="名称" tree-node />
    <OriTable.column data-index="size" title="大小" />
  </OriTable>
</template>
```

### 拖拽排序

```vue
<template>
  <OriTable :data-source="tableData" size="mini" dragable bordered="inner">
    <OriTable.column data-index="name" title="名称" />
    <OriTable.column data-index="age" title="年龄" />
  </OriTable>
</template>
```

## 常见错误

```vue
<!-- ❌ 错误：使用 :columns 传入列配置（columns prop 声明但未消费，不会生效） -->
<OriTable :data-source="tableData" :columns="columns" />

<!-- ✅ 正确：使用 OriTable.column 子组件定义列 -->
<OriTable :data-source="tableData">
  <OriTable.column data-index="name" title="名称" />
</OriTable>

<!-- ❌ 错误：使用 :data 传入数据（Ant Design Vue 写法） -->
<OriTable :data="tableData" />

<!-- ✅ 正确：使用 :data-source 传入数据 -->
<OriTable :data-source="tableData" />

<!-- ❌ 错误：size 使用 middle -->
<OriTable size="middle" />

<!-- ✅ 正确：size 可选 medium/small/mini -->
<OriTable size="mini" />

<!-- ❌ 错误：使用 @change 监听分页变化（Table 没有 change 事件） -->
<OriTable :pagination="pagination" @change="handleChange" />

<!-- ✅ 正确：分页事件通过 pagination 对象的 onChange 传入 -->
<OriTable :pagination="{ ...pagination, onChange: handleChange }" />

<!-- ❌ 错误：使用 :scroll="{ y: 400 }" 实现虚拟滚动（Ant Design Vue 写法） -->
<OriTable :scroll="{ y: 400 }" />

<!-- ✅ 正确：使用 height 或 max-height 属性 -->
<OriTable height="400" />

<!-- ❌ 错误：使用 rowKey 设置行唯一标识 -->
<OriTable row-key="id" />

<!-- ✅ 正确：基于 vxe-table，行标识配置方式不同，需通过 row-id 属性 -->
<OriTable row-id="id" />

<!-- ❌ 错误：模板中使用 dataIndex 驼峰（应为 kebab-case） -->
<OriTable.column dataIndex="name" title="名称" />

<!-- ✅ 正确：模板中使用 kebab-case -->
<OriTable.column data-index="name" title="名称" />
```

## 与其他组件库的差异

### 与 Ant Design Vue 的差异

| 差异点 | Ant Design Vue | origami-vue |
|--------|---------------|-------------|
| 数据源 | `:data-source` 或 `:dataSource` | `:data-source` |
| 列定义 | `columns` 配置数组 | **`OriTable.column` 子组件**（`columns` prop 不可用） |
| 列字段映射 | `dataIndex` | `dataIndex`（相同） |
| 列标题 | `title` | `title`（相同） |
| 表格尺寸 | `default / middle / small` | `medium / small / mini` |
| 行唯一标识 | `rowKey` | `row-id`（vxe-table 方式） |
| 边框 | `bordered` boolean | `bordered` 枚举 (default/full/outer/inner/none) + true |
| 分页 | `pagination` prop | `pagination` 配置对象（相同，但事件通过 onChange 传入） |
| 分页事件 | `@change` 事件 | pagination 对象的 `onChange` 属性 |
| 列固定 | `fixed: 'left'/'right'` | 相同 |
| 列排序 | `sorter: true/function` | `sortable: boolean` |
| 列筛选 | `filters` 数组 + `onFilter` | `filters` 数组 + `filter-method` |
| 内容溢出 | `ellipsis: true` | `show-overflow: 'ellipsis'/'title'/'tooltip'` |
| 虚拟滚动 | `:scroll="{ y: 400 }"` | `height` 或 `max-height` 属性 |
| 多选列 | `type: 'selection'` | `type: 'checkbox'` |
| 序号列 | 无内置 | `type: 'seq'` |
| 单选列 | 无内置 | `type: 'radio'` |
| 展开列 | `type: 'expand'` | 相同（使用 `#content` 插槽定义展开内容） |
| 底层实现 | 自研 | 基于 vxe-table 封装 |
