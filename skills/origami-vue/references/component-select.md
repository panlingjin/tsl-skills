---
title: 选择器 Select
impact: MEDIUM
impactDescription: 使用错误 API 会导致组件功能异常
type: component
tags: [origami-vue, form]
---

# 选择器 Select

**Impact: MEDIUM** - 使用错误 API 会导致组件功能异常，如 v-model 绑定方式、options 格式、fieldNames 映射等配置不当会使选择器无法正常工作。

## 何时使用

- 弹出一个下拉菜单给用户选择操作，用于代替原生的 select，当选项数量较多时使用
- 需要单选或多选场景
- 需要搜索、清除、分组等高级选择功能时

## API 参考

### Select Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue(v-model) | 选择器所绑定的值 | `string \| number` | - |
| size | 选择器尺寸 | `'large' \| 'small'` | - |
| placeholder | 选择器默认占位字符 | `string` | - |
| multiple | 是否多选 | `boolean` | `false` |
| bordered | 是否显示边框 | `boolean` | `true` |
| disabled | 是否禁用 | `boolean` | `false` |
| width | 宽度，如果传入 number 类型，默认单位 px | `string \| number` | - |
| options | 可传入 options 数组，直接构造选择器 | `Array<{value, label, [disabled]}>` | - |
| clearable | 是否可清除选项 | `boolean` | `false` |
| searchable | 是否可搜索 | `boolean` | `false` |
| fieldNames | 自定义属性配置，仅支持通过 options 设置 | `{label: string; value: string}` | - |
| filter | 输入项筛选的方法 | `(inputValue, option) => boolean` | - |

### Select Slots

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| dropdownRender | 下拉框插槽，可追加自定义内容 | - |
| customContent | 自定义列表项内容插槽，需配合 options 使用 | `{ ...SelectOption.props }` |
| multipleCustom | 自定义多选列表项内容插槽 | `{ ...SelectOption.props }` |

### Select Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | value 值发生改变时触发 | `(entry: { label, value }) => {}` |
| blur | 选择器失去焦点时触发 | `(e: Event) => {}` |
| focus | 选中选择器时触发 | `(e: Event) => {}` |
| tagClose | 点击 tag 的关闭按钮时触发 | `(value) => {}` |

### Select.SelectOption Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签名 | `string` | - |
| value | 标识值 | `string \| number` | - |
| disabled | 选项禁用 | `boolean` | `false` |

### Select.SelectOption Slots

| 名称 | 说明 |
| --- | --- |
| icon | 图标插槽 |

### Select.SelectOptionGroup Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 分组名 | `string` | - |

## 子组件访问方式

SelectOption 和 SelectOptionGroup 作为 Select 的子组件，通过 `OriSelect.SelectOption` 和 `OriSelect.SelectOptionGroup` 访问：

```typescript
import { Select as OriSelect } from 'origami-vue'

// 方式一：直接使用 OriSelect.SelectOption / OriSelect.SelectOptionGroup
// 方式二：解构赋值
const OriSelectOption = OriSelect.SelectOption
const OriSelectOptionGroup = OriSelect.SelectOptionGroup
```

```vue
<!-- 直接使用 OriSelect.SelectOption -->
<OriSelect v-model="selectedValue" placeholder="请选择">
  <OriSelect.SelectOption label="选项一" :value="1" />
  <OriSelect.SelectOption label="选项二" :value="2" />
</OriSelect>

<!-- 选项分组 -->
<OriSelect v-model="selectedValue">
  <OriSelect.SelectOptionGroup label="分组一">
    <OriSelect.SelectOption label="选项一" :value="1" />
  </OriSelect.SelectOptionGroup>
</OriSelect>
```

## 使用示例

### 正确用法

```vue
<!-- 基本使用 v-model 绑定 -->
<OriSelect v-model="selectedValue" placeholder="请选择">
  <OriSelect.SelectOption label="选项一" :value="1" />
  <OriSelect.SelectOption label="选项二" :value="2" />
</OriSelect>

<!-- 使用 options 数组 -->
<OriSelect v-model="selectedValue" :options="options" />

<!-- 多选模式 -->
<OriSelect v-model="selectedValues" multiple placeholder="请选择">
  <OriSelect.SelectOption label="选项一" :value="1" />
  <OriSelect.SelectOption label="选项二" :value="2" />
</OriSelect>

<!-- 可搜索 + 可清除 -->
<OriSelect v-model="selectedValue" searchable clearable placeholder="请选择">
  <OriSelect.SelectOption label="选项一" :value="1" />
</OriSelect>

<!-- 使用 fieldNames 自定义字段映射 -->
<OriSelect
  v-model="selectedValue"
  :options="customOptions"
  :field-names="{ label: 'name', value: 'id' }"
/>

<!-- 选项分组 -->
<OriSelect v-model="selectedValue">
  <OriSelect.SelectOptionGroup label="分组一">
    <OriSelect.SelectOption label="选项一" :value="1" />
  </OriSelect.SelectOptionGroup>
  <OriSelect.SelectOptionGroup label="分组二">
    <OriSelect.SelectOption label="选项二" :value="2" />
  </OriSelect.SelectOptionGroup>
</OriSelect>

<!-- 自定义下拉渲染 -->
<OriSelect v-model="selectedValue" :options="options">
  <template #dropdownRender>
    <div class="p-2 text-xs text-tsl-gray-5">自定义底部内容</div>
  </template>
</OriSelect>
```

### 常见错误

```vue
<!-- ❌ 错误：使用 :value 而非 v-model 绑定 -->
<OriSelect :value="selectedValue" @change="handleChange">
  <OriSelect.SelectOption label="选项一" :value="1" />
</OriSelect>

<!-- ✅ 正确：使用 v-model 双向绑定 -->
<OriSelect v-model="selectedValue">
  <OriSelect.SelectOption label="选项一" :value="1" />
</OriSelect>

<!-- ❌ 错误：fieldNames 与 Select.SelectOption 子组件混用 -->
<OriSelect v-model="val" :field-names="{ label: 'name', value: 'id' }">
  <OriSelect.SelectOption label="选项" :value="1" />
</OriSelect>

<!-- ✅ 正确：fieldNames 仅配合 options 使用 -->
<OriSelect v-model="val" :options="opts" :field-names="{ label: 'name', value: 'id' }" />

<!-- ❌ 错误：多选时 v-model 绑定非数组 -->
<OriSelect v-model="selectedValue" multiple>
  <OriSelect.SelectOption label="选项" :value="1" />
</OriSelect>
<!-- 多选时 selectedValue 应为数组 -->

<!-- ❌ 错误：clearable 在多选模式下使用 -->
<OriSelect v-model="values" multiple clearable>
  <!-- clearable 仅支持单选 -->
</OriSelect>
```

## 与其他组件库的差异

| 差异点 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| 数据绑定 | `modelValue` (v-model) | `value` / `v-model:value` | `modelValue` (v-model) |
| 自定义字段映射 | `fieldNames`（仅配合 options） | `fieldNames` | 无原生支持 |
| 搜索功能 | `searchable` | `showSearch` | `filterable` |
| 可清除 | `clearable` | `allowClear` | `clearable` |
| 选项数据 | `options` 数组 | `options` 数组 | 无（需用子组件） |
| 自定义下拉 | `#dropdownRender` 插槽 | `dropdownRender` 属性 | 无原生支持 |
| 自定义列表项 | `#customContent` / `#multipleCustom` 插槽 | `option` 插槽 | 无原生支持 |
| 选项分组 | `Select.SelectOptionGroup` | `Select.OptGroup` | `ElOptionGroup` |
| 选项图标 | `Select.SelectOption` 的 `#icon` 插槽 | 无原生支持 | 无原生支持 |
| 虚拟滚动 | 列表项超过 200 自动启用 | 需手动配置 | 需手动配置 |
