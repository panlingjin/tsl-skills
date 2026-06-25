---
title: 树形选择 (TreeSelect)
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, data-display]
---

# 树形选择 (TreeSelect)

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 用清晰的层级结构展示信息，可展开或折叠
- 需要在树形结构中选择一个或多个节点时

## API 参考

TreeSelect 是 Tree 组件和 Select 组件组合而成，支持两者的核心 API。以下是组件特有的功能：

### 基础功能

| 功能 | 说明 |
| --- | --- |
| 基础选择 | 点击选择单个树节点 |
| 多选 | 通过 `multiple` 属性控制树形多选 |
| 禁用项 | 通过 `disabled` 属性设置树形禁止项 |
| 默认选中 | 通过 v-model 设置默认选中项 |
| 搜索 | 通过 `showFilter` 属性控制是否带搜索 |
| 尺寸 | 通过 `size` 属性控制大小 |
| 全局禁用 | 设置整个树形选择禁用 |

### 核心 Props（继承自 Tree + Select）

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value (v-model) | 当前选中值 | `any \| any[]` | `-` |
| multiple | 是否支持多选 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'default' \| 'large'` | `'default'` |
| showFilter | 是否显示搜索框 | `boolean` | `false` |
| placeholder | 输入框占位文本 | `string` | `-` |
| allowClear | 是否允许清除 | `boolean` | `false` |
| treeData | 树形数据 | `array` | `-` |
| fieldNames | 自定义字段名 | `object` | `-` |
| treeDefaultExpandAll | 是否默认展开所有节点 | `boolean` | `false` |

## 使用示例

### 正确用法

```vue
<script setup lang="ts">
const selectedValue = ref<string | undefined>(undefined)
const selectedValues = ref<string[]>([])
const treeData = [
  {
    title: '节点一',
    value: '1',
    children: [
      { title: '子节点 1-1', value: '1-1' },
      { title: '子节点 1-2', value: '1-2' },
    ],
  },
  {
    title: '节点二',
    value: '2',
    children: [
      { title: '子节点 2-1', value: '2-1', disabled: true },
    ],
  },
]
</script>

<template>
  <!-- 基础树形选择 -->
  <ori-tree-select
    v-model:value="selectedValue"
    :tree-data="treeData"
    placeholder="请选择"
  />

  <!-- 多选模式 -->
  <ori-tree-select
    v-model:value="selectedValues"
    :tree-data="treeData"
    multiple
    placeholder="请选择（多选）"
  />

  <!-- 带搜索 -->
  <ori-tree-select
    v-model:value="selectedValue"
    :tree-data="treeData"
    show-filter
    placeholder="搜索并选择"
  />

  <!-- 不同尺寸 -->
  <ori-tree-select
    v-model:value="selectedValue"
    :tree-data="treeData"
    size="small"
  />

  <!-- 禁用状态 -->
  <ori-tree-select
    v-model:value="selectedValue"
    :tree-data="treeData"
    disabled
  />
</template>
```

### 常见错误

```vue
<!-- 错误：多选模式下 v-model 绑定字符串 -->
<ori-tree-select v-model:value="selected" multiple :tree-data="treeData" />
<!-- 多选模式下 value 应绑定数组 -->

<!-- 错误：搜索属性名写错 -->
<ori-tree-select v-model:value="val" :tree-data="data" show-search />
<!-- 应使用 showFilter，不是 showSearch -->

<!-- 错误：treeData 数据缺少必要字段 -->
<ori-tree-select
  v-model:value="val"
  :tree-data="[{ label: '节点', key: '1' }]"
/>
<!-- 默认字段为 title/value/children，如使用 label/key 需配置 fieldNames -->
```

## 与其他组件库的差异

| 差异点 | origami-vue | ant-design-vue | element-plus |
| --- | --- | --- | --- |
| 搜索属性 | `showFilter` | `showSearch` | `filterable` |
| 数据源 | `treeData` | `treeData` | `data` |
| 多选 | `multiple` | `multiple` | `multiple`（需 `show-checkbox`） |
| 组件组合 | Tree + Select 组合 | 独立组件 | 独立组件 |
| API 文档 | 引用 Tree + Select 文档 | 独立完整文档 | 独立完整文档 |
