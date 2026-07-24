---
title: 级联选择器 Cascader
impact: MEDIUM
impactDescription: 使用错误 API 会导致组件功能异常
type: component
tags: [origami-vue, form]
---

# 级联选择器 Cascader

**Impact: MEDIUM** - 使用错误 API（如误用 `options` 字段名、`size` 仅支持 `small`）会导致组件功能异常

## 何时使用

- 需要从一组相关联的数据集合进行选择，例如省市区、公司层级、事物分类等
- 从一个较大的数据集合中进行选择时，用多级分类进行分隔，方便选择
- 比起 Select 组件，可以在同一个浮层中完成选择，有较好的体验

## API 参考

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 级联选择器绑定的值 | _string[] \| value[]_ | - |
| options | 配置项数组 | _CascaderOption[]_ | `[]` |
| multiple | 是否多选 | _boolean_ | `false` |
| disabled | 是否禁用 | _boolean_ | `false` |
| loading | 是否显示加载状态 | _boolean_ | `false` |
| errorText | 加载异常文本 | _string_ | `''` |
| size | 尺寸，仅支持 `small` | _'small'_ | - |
| clearable | 是否可清空 | _boolean_ | `false` |
| collapseTag | 是否折叠选项卡（多选时可设置） | _boolean_ | `true` |
| searchable | 是否可搜索 | _boolean_ | `false` |
| filter | 输入项筛选的方法 | _(inputValue: string, path: CascaderOption[]) => boolean_ | - |
| fieldNames | 自定义属性配置 | _{ label: string; value: string; children: string }_ | - |

### CascaderOption 数据结构

```typescript
interface CascaderOption {
  label: string
  value: string | number
  children?: CascaderOption[]
  disabled?: boolean
}
```

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 绑定值更改后触发 | _Array<{ label: string; value: string \| number }>_ |
| tagClose | 关闭选项卡触发 | 被关闭的选项卡对应的 id |

## 使用示例

### 正确用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Cascader as OriCascader } from 'origami-vue'

const value = ref<string[]>([])
const multiValue = ref<string[]>([])

const options = [
  {
    label: '浙江省',
    value: 'zhejiang',
    children: [
      { label: '杭州市', value: 'hangzhou' },
      { label: '宁波市', value: 'ningbo' },
    ],
  },
  {
    label: '江苏省',
    value: 'jiangsu',
    children: [
      { label: '南京市', value: 'nanjing' },
      { label: '苏州市', value: 'suzhou' },
    ],
  },
]

// 自定义字段名
const customOptions = [
  {
    name: '浙江省',
    code: 'zhejiang',
    sub: [
      { name: '杭州市', code: 'hangzhou' },
    ],
  },
]
</script>

<template>
  <!-- 基本使用 -->
  <OriCascader v-model="value" :options="options" clearable />

  <!-- 多选 -->
  <OriCascader v-model="multiValue" :options="options" multiple />

  <!-- 多选 + 折叠标签 -->
  <OriCascader v-model="multiValue" :options="options" multiple :collapse-tag="true" />

  <!-- 小尺寸 -->
  <OriCascader v-model="value" :options="options" size="small" />

  <!-- 加载状态 -->
  <OriCascader v-model="value" :options="[]" :loading="true" />

  <!-- 加载异常 -->
  <OriCascader v-model="value" :options="[]" :loading="false" error-text="数据加载失败" />

  <!-- 可搜索 -->
  <OriCascader v-model="value" :options="options" searchable />

  <!-- 自定义搜索 -->
  <OriCascader
    v-model="value"
    :options="options"
    searchable
    :filter="customFilter"
  />

  <!-- 自定义字段名 -->
  <OriCascader
    v-model="value"
    :options="customOptions"
    :field-names="{ label: 'name', value: 'code', children: 'sub' }"
  />

  <!-- 禁用 -->
  <OriCascader v-model="value" :options="options" disabled />
</template>
```

### 常见错误

```vue
<!-- ❌ 错误：使用了 ant-design-vue 的 v-model:value -->
<OriCascader v-model:value="value" :options="options" />

<!-- ✅ 正确：使用 v-model（即 v-model:modelValue） -->
<OriCascader v-model="value" :options="options" />

<!-- ❌ 错误：size 使用了不支持的值 -->
<OriCascader v-model="value" :options="options" size="large" />
<OriCascader v-model="value" :options="options" size="default" />

<!-- ✅ 正确：size 仅支持 small，不设置则为默认尺寸 -->
<OriCascader v-model="value" :options="options" size="small" />

<!-- ❌ 错误：使用了 element-plus 的 props 字段名 -->
<OriCascader :props="{ label: 'name', value: 'code', children: 'sub' }" />

<!-- ✅ 正确：使用 fieldNames -->
<OriCascader :field-names="{ label: 'name', value: 'code', children: 'sub' }" />

<!-- ❌ 错误：使用了 ant-design-vue 的 showSearch -->
<OriCascader v-model="value" :options="options" show-search />

<!-- ✅ 正确：使用 searchable -->
<OriCascader v-model="value" :options="options" searchable />

<!-- ❌ 错误：使用了 ant-design-vue 的 maxTagCount 代替 collapseTag -->
<OriCascader v-model="value" :options="options" multiple :max-tag-count="2" />

<!-- ✅ 正确：使用 collapseTag -->
<OriCascader v-model="value" :options="options" multiple :collapse-tag="true" />
```

## 与其他组件库的差异

| 差异点 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| v-model 绑定 | `modelValue` | `value` | `model-value` |
| 自定义字段名 | `fieldNames` | `fieldNames` | `props` |
| 加载状态 | `loading` | 无 | 无 |
| 异常文本 | `errorText` | 无 | 无 |
| 搜索功能 | `searchable` | `showSearch` | `filterable` |
| 搜索过滤 | `filter` 函数 | `filter` 函数 | `filter-method` 函数 |
| 折叠标签 | `collapseTag` | `maxTagCount` | `collapseTags` |
| 尺寸 | 仅 `small` | `small` / `default` / `large` | `large` / `default` / `small` |
| 清空 | `clearable` | `allowClear` | `clearable` |
| 多选 | `multiple` | `multiple` | 无原生支持 |
