---
title: 分页 Pagination
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, data-display]
---

# 分页 Pagination

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 当数据量过多时，使用分页分解数据，便于用户查看。

## API 参考

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| current (v-model) | 当前页数 | `number` | - |
| pageSize (v-model) | 每页条数 | `number` | `10` |
| disabled | 禁用分页 | `boolean` | `false` |
| pageSizeOptions | 指定每页可以显示多少条 | `string[]` | `['10', '20', '30', '40']` |
| showQuickJumper | 是否可以快速跳转至某页 | `boolean` | `false` |
| showSizeChanger | 是否可以改变 pageSize | `boolean` | `false` |
| showTotal | 用于显示数据总量和当前数据顺序 | `Function(total, range)` | - |
| size | 当为 `'small'` 时，是小尺寸分页 | `string` | `''` |
| total | 数据总数 | `number` | `0` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 页码或 pageSize 改变的回调 | `(page: number, pageSize: number) => void` |
| showSizeChange | pageSize 变化的回调 | `(current: number, size: number) => void` |

## 使用示例

### 正确用法

```vue
<template>
  <!-- 基本分页 -->
  <OriPagination v-model:current="currentPage" :total="50" />

  <!-- 更多页数 -->
  <OriPagination v-model:current="currentPage" :total="500" />

  <!-- 大量页面 + 页码选择器 -->
  <OriPagination
    v-model:current="currentPage"
    v-model:page-size="pageSize"
    :total="1000"
    :show-size-changer="true"
    :page-size-options="['10', '20', '50', '100']"
  />

  <!-- 页码 + 快速跳转 -->
  <OriPagination
    v-model:current="currentPage"
    :total="500"
    :show-quick-jumper="true"
  />

  <!-- 显示总数 -->
  <OriPagination
    v-model:current="currentPage"
    :total="100"
    :show-total="showTotal"
  />

  <!-- 小尺寸 -->
  <OriPagination
    v-model:current="currentPage"
    :total="100"
    size="small"
  />

  <!-- 禁用分页 -->
  <OriPagination
    v-model:current="currentPage"
    :total="100"
    :disabled="true"
  />

  <!-- 完整功能 -->
  <OriPagination
    v-model:current="currentPage"
    v-model:page-size="pageSize"
    :total="500"
    :show-size-changer="true"
    :show-quick-jumper="true"
    :show-total="(total, range) => `${range[0]}-${range[1]} / 共 ${total} 条`"
    :page-size-options="['10', '20', '50']"
    @change="onPageChange"
    @show-size-change="onSizeChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentPage = ref(1)
const pageSize = ref(10)

const showTotal = (total: number, range: [number, number]) => {
  return `${range[0]}-${range[1]} / 共 ${total} 条`
}

const onPageChange = (page: number, size: number) => {
  console.log('页码变化:', page, size)
}

const onSizeChange = (current: number, size: number) => {
  console.log('每页条数变化:', current, size)
}
</script>
```

### 常见错误

```vue
<template>
  <!-- 错误：使用 current 而非 v-model:current（非受控模式不推荐） -->
  <OriPagination :current="1" :total="100" />

  <!-- 错误：使用 onChange 事件（Ant Design Vue 的 API） -->
  <OriPagination v-model:current="page" :total="100" @change="onChange" />
  <!-- origami-vue 也支持 change 事件，但推荐使用 v-model 双向绑定 -->

  <!-- 错误：showSizeChanger 但未配置 pageSizeOptions -->
  <OriPagination
    v-model:current="page"
    :total="100"
    :show-size-changer="true"
  />
  <!-- 应配合 pageSizeOptions 使用 -->
  <OriPagination
    v-model:current="page"
    v-model:page-size="size"
    :total="100"
    :show-size-changer="true"
    :page-size-options="['10', '20', '50']"
  />

  <!-- 错误：size 使用了不存在的值 -->
  <OriPagination v-model:current="page" :total="100" size="mini" />
  <!-- 仅支持 'small' -->
</template>
```

## 与其他组件库的差异

| 特性 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| `current` v-model | 支持 | 支持 | 支持（`v-model:current-page`） |
| `pageSize` v-model | 支持 | 支持（`v-model:pageSize`） | 支持（`v-model:page-size`） |
| `disabled` 属性 | 支持 | 支持 | 支持 |
| `size` 属性 | 仅 `'small'` | `'small' \| 'default'` | `'small'` |
| `showQuickJumper` | 支持 | 支持 | 不支持（使用 `quickjump` slot） |
| `showSizeChanger` | 支持 | 支持 | 支持（`page-sizes`） |
| `showTotal` | `Function(total, range)` | `Function(total, range)` | 不支持（使用 slot） |
| `pageSizeOptions` | `string[]` | `string[]` | `number[]`（`page-sizes`） |
| `change` 事件 | `(page, pageSize)` | `(page, pageSize)` | 不支持（拆分为 `current-change` 和 `size-change`） |
| `showSizeChange` 事件 | `(current, size)` | `(current, size)` | `size-change` 事件 |
| `itemRender` | 不支持 | 支持 | 不支持 |
| `prevIcon/nextIcon` | 不支持 | 不支持 | 支持（slots） |
