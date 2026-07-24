---
title: 复选框 (Checkbox)
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, form]
---

# 复选框 (Checkbox)

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 一组备选项中进行多选
- 需要全选/半选状态控制时使用 `indeterminate`

## API 参考

### Checkbox Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model-value / v-model | 选中项绑定值 | `string \| number \| boolean` | `-` |
| label | 在 CheckboxGroup 中标识该项的值 | `string \| number \| boolean` | `-` |
| true-label | 选中时的值 | `string \| number` | `-` |
| false-label | 没有选中时的值 | `string \| number` | `-` |
| disabled | 是否禁用 | `boolean` | `false` |
| border | 是否显示边框 | `boolean` | `false` |
| size | Checkbox 的尺寸 | `'default' \| 'small'` | `-` |
| name | 原生 name 属性 | `string` | `-` |
| checked | 当前是否勾选 | `boolean` | `false` |
| indeterminate | 设置 indeterminate 状态，只负责样式控制 | `boolean` | `false` |

### Checkbox Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 当绑定值变化时触发的事件 | `value` |

### CheckboxGroup Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model-value / v-model | 绑定值 | `array` | `-` |
| size | 多选框组尺寸 | `'default' \| 'small'` | `-` |
| disabled | 是否禁用 | `boolean` | `false` |
| min | 可被勾选的 checkbox 的最小数量 | `number` | `-` |
| max | 可被勾选的 checkbox 的最大数量 | `number` | `-` |

### CheckboxGroup Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 当绑定值变化时触发的事件 | `value` |

### CheckboxButton Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model-value / v-model | 选中项绑定值 | `string \| number \| boolean` | `-` |
| label | 在 CheckboxGroup 中标识该项的值 | `string \| number \| boolean` | `-` |
| true-label | 选中时的值 | `string \| number` | `-` |
| false-label | 没有选中时的值 | `string \| number` | `-` |
| disabled | 是否禁用 | `boolean` | `false` |
| name | 原生 name 属性 | `string` | `-` |
| checked | 当前是否勾选 | `boolean` | `false` |

### CheckboxButton Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 当绑定值变化时触发的事件 | `value` |

## 使用示例

### 正确用法

```vue
<!-- 基础用法 -->
<OriCheckbox v-model="checked">复选框</OriCheckbox>

<!-- 自定义选中/未选中值 -->
<OriCheckbox v-model="status" true-label="active" false-label="inactive">
  启用状态
</OriCheckbox>

<!-- 带边框 -->
<OriCheckbox v-model="checked" border>带边框复选框</OriCheckbox>

<!-- 复选框组 + min/max 限制 -->
<OriCheckbox.checkboxGroup v-model="selectedList" :min="1" :max="3">
  <OriCheckbox label="a">选项A</OriCheckbox>
  <OriCheckbox label="b">选项B</OriCheckbox>
  <OriCheckbox label="c">选项C</OriCheckbox>
  <OriCheckbox label="d">选项D</OriCheckbox>
</OriCheckbox.checkboxGroup>

<!-- 全选 + indeterminate -->
<OriCheckbox
  v-model="checkAll"
  :indeterminate="isIndeterminate"
  @change="handleCheckAllChange"
>
  全选
</OriCheckbox>
<OriCheckbox.checkboxGroup v-model="selectedList" @change="handleSelectedChange">
  <OriCheckbox label="a">选项A</OriCheckbox>
  <OriCheckbox label="b">选项B</OriCheckbox>
</OriCheckbox.checkboxGroup>

<!-- 按钮样式的复选框组 -->
<OriCheckbox.checkboxGroup v-model="selectedList">
  <OriCheckbox.checkboxButton label="a">选项A</OriCheckbox.checkboxButton>
  <OriCheckbox.checkboxButton label="b">选项B</OriCheckbox.checkboxButton>
  <OriCheckbox.checkboxButton label="c">选项C</OriCheckbox.checkboxButton>
</OriCheckbox.checkboxGroup>
```

### 常见错误

```vue
<!-- 错误：true-label/false-label 传了布尔值 -->
<OriCheckbox v-model="status" :true-label="true" :false-label="false">
  <!-- true-label/false-label 类型为 string | number，不接受 boolean -->
</OriCheckbox>

<!-- 错误：indeterminate 误以为能控制选中状态 -->
<OriCheckbox :indeterminate="true">
  <!-- indeterminate 仅控制样式，不控制实际选中逻辑 -->
</OriCheckbox>

<!-- 错误：CheckboxGroup v-model 绑定字符串而非数组 -->
<OriCheckbox.checkboxGroup v-model="selected">
  <!-- v-model 类型应为 array，不是 string -->
</OriCheckbox.checkboxGroup>

<!-- 错误：使用 OriCheckbox.Group 而非 OriCheckbox.checkboxGroup -->
<OriCheckbox.Group v-model="selectedList">
  <!-- 子组件应使用 checkboxGroup（小写开头），而非 Group（大写开头） -->
</OriCheckbox.Group>
```

## 与其他组件库的差异

| 差异点 | origami-vue | ant-design-vue | element-plus |
| --- | --- | --- | --- |
| 子组件访问 | `OriCheckbox.checkboxGroup` / `OriCheckbox.checkboxButton` | `Checkbox.Group` | `ElCheckboxGroup` / `ElCheckboxButton` |
| 自定义选中值 | `true-label` / `false-label` | 不支持 | `true-label` / `false-label` |
| 边框模式 | `border` prop | 不支持 | `border` prop |
| 选中数量限制 | `min` / `max` | 不支持 | `min` / `max` |
| 半选状态 | `indeterminate` | `indeterminate` | `indeterminate` |
| 尺寸选项 | `default` / `small` | 不支持 size | `large` / `default` / `small` |
