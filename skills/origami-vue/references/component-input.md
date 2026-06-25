---
title: 输入框 Input
impact: HIGH
impactDescription: 使用错误 API 会导致输入框状态显示异常、搜索功能失效或组合输入框配置错误
type: component
tags: [origami-vue, form]
---

# 输入框 Input

**Impact: HIGH** - 使用错误 API 会导致输入框状态显示异常、搜索功能失效或组合输入框配置错误

## 何时使用

- 需要用户输入表单域内容时。
- 提供组合型输入框，带搜索的输入框，还可以进行大小选择。

## API 参考

### Input Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 声明 input 类型，同原生 input 标签的 type 属性 | _string_ | `text` |
| placeholder | placeholder 输入提示 | _string_ | `''` |
| autoFocus | 自动聚焦 | _boolean_ | `false` |
| readOnly | 只读 | _boolean_ | `false` |
| value (v-model) | 输入框内容，v-model 值 | _string_ | `''` |
| min | 最小值 | _any_ | `-` |
| max | 最大值 | _any_ | `-` |
| borderBottom | 是否只显示下边框 | _boolean_ | `false` |
| addonBefore | 前置标签，可使用插槽 | _string \| slot_ | `''` |
| addonAfter | 后置标签，可使用插槽 | _string \| slot_ | `''` |
| disabled | 是否禁用 | _boolean_ | `false` |
| warning | 是否警告状态 | _boolean_ | `false` |
| error | 是否错误状态 | _boolean_ | `false` |
| success | 是否成功状态 | _boolean_ | `false` |
| fail | 是否失败状态 | _boolean_ | `false` |
| tipMsg | 状态提示信息 | _string_ | `''` |
| size | 输入框尺寸，可选参数 default、large、small | _string_ | `default` |
| rows | textarea 行数 | _number_ | `2` |
| maxLength | 最大长度 | _number_ | `150` |
| resize | textarea 是否可改变大小 | _boolean_ | `true` |
| showLength | 是否显示已输入文字长度 | _boolean_ | `false` |
| beforeMargin | 是否显示前置组合输入框间距 | _boolean_ | `false` |
| addonBorder | 是否显示前置后置内容边框 | _boolean_ | `true` |
| afterMargin | 是否显示后置组合输入框间距 | _boolean_ | `false` |
| rangeValue | 区间输入框内容 | _array_ | `null` |
| rangePlaceholder | 区间输入框输入提示 | _array_ | `["最小值", "最大值"]` |
| rangeText | 区间输入框分割内容 | _string_ | `-` |
| clear | 是否清空 | _boolean_ | `false` |
| clearIcon | 清空按钮，可使用插槽 | _string \| slot_ | `hide` |
| showPassword | 是否显示密码按钮 | _boolean_ | `false` |
| inputStyle | input 自定义样式 | _object_ | `-` |

### Input Slots

| 名称 | 说明 |
| --- | --- |
| addonBefore | 前置标签 |
| addonAfter | 后置标签 |
| iconBefore | 前置图标 |
| iconAfter | 后置图标 |
| clearIcon | 清空按钮 |
| passwordIcon | 密码按钮 |

### Input Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | change 事件 | _(event: MouseEvent)_ |
| input | input 事件 | _(event: MouseEvent)_ |
| focus | focus 事件 | _(event: MouseEvent)_ |
| blur | blur 事件 | _(event: MouseEvent)_ |

### Search Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| searchIcon | 是否显示搜索框图标/搜索框图标插槽 | _boolean \| slot_ | `true` |
| searchBtn | 是否显示搜索按钮/可使用 addonAfter 插槽 | _boolean_ | `false` |
| searchRadius | 搜索框是否展示圆角 | _boolean_ | `false` |

### Search Slots

| 名称 | 说明 |
| --- | --- |
| searchIcon | 搜索框图标 |

### Search Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| search | search 事件 | _(val: string)_ |

## 子组件访问方式

Search 作为 Input 的子组件，通过 `OriInput.Search` 访问：

```typescript
import { Input as OriInput } from 'origami-vue'

// 方式一：直接使用 OriInput.Search
// 方式二：解构赋值
const OriInputSearch = OriInput.Search
```

```vue
<!-- 直接使用 OriInput.Search -->
<OriInput.Search v-model="keyword" search-btn @search="handleSearch" />

<!-- 解构后使用 -->
<OriInputSearch v-model="keyword" @search="handleSearch" />
```

## 使用示例

### 正确用法

```vue
<template>
  <!-- 基础输入框 -->
  <OriInput v-model="value" placeholder="请输入" />

  <!-- 带状态提示的输入框 -->
  <OriInput v-model="value" error tip-msg="请输入正确的邮箱" />
  <OriInput v-model="value" warning tip-msg="密码强度不足" />
  <OriInput v-model="value" success tip-msg="格式正确" />

  <!-- 只显示下边框 -->
  <OriInput v-model="value" border-bottom placeholder="请输入" />

  <!-- 前后置标签 -->
  <OriInput v-model="url" addon-before="https://" addon-after=".com" />

  <!-- 前后置标签（插槽方式） -->
  <OriInput v-model="url">
    <template #addonBefore>https://</template>
    <template #addonAfter>.com</template>
  </OriInput>

  <!-- 区间输入框 -->
  <OriInput v-model="range" :range-value="rangeValue" range-placeholder="['最小值', '最大值']" />

  <!-- 带清空按钮 -->
  <OriInput v-model="value" clear />

  <!-- 密码输入框 -->
  <OriInput v-model="password" type="password" show-password />

  <!-- 文本域 -->
  <OriInput v-model="content" type="textarea" :rows="4" show-length :max-length="200" />

  <!-- 搜索框 -->
  <OriInput.Search v-model="keyword" search-btn @search="handleSearch" />

  <!-- 搜索框（仅图标） -->
  <OriInput.Search v-model="keyword" @search="handleSearch" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const url = ref('')
const rangeValue = ref(null)
const password = ref('')
const content = ref('')
const keyword = ref('')

const handleSearch = (val: string) => {
  console.warn('搜索:', val)
}
</script>
```

### 常见错误

```vue
<!-- ❌ 错误：使用 status 属性设置状态（Ant Design Vue 写法） -->
<OriInput v-model="value" status="error" />

<!-- ✅ 正确：使用独立的 boolean prop 设置状态 -->
<OriInput v-model="value" error />

<!-- ❌ 错误：使用 prefix/suffix 插槽名（Ant Design Vue 写法） -->
<OriInput v-model="value">
  <template #prefix><SearchIcon /></template>
</OriInput>

<!-- ✅ 正确：使用 iconBefore/iconAfter 插槽 -->
<OriInput v-model="value">
  <template #iconBefore><SearchIcon /></template>
</OriInput>

<!-- ❌ 错误：使用 allow-clear 属性 -->
<OriInput v-model="value" allow-clear />

<!-- ✅ 正确：使用 clear 属性 -->
<OriInput v-model="value" clear />

<!-- ❌ 错误：使用 addonBefore/addonAfter 的 slot 名为 prefix/suffix -->
<OriInput v-model="value">
  <template #prefix>https://</template>
</OriInput>

<!-- ✅ 正确：使用 addonBefore/addonAfter 插槽 -->
<OriInput v-model="value">
  <template #addonBefore>https://</template>
</OriInput>

<!-- ❌ 错误：搜索框使用 enter-button 属性 -->
<OriInput.Search v-model="keyword" enter-button />

<!-- ✅ 正确：使用 search-btn 属性 -->
<OriInput.Search v-model="keyword" search-btn />
```

## 与其他组件库的差异

### 与 Ant Design Vue 的差异

| 差异点 | Ant Design Vue | origami-vue |
|--------|---------------|-------------|
| 状态控制 | `status="error/warning"` | 独立 boolean prop: `error`/`warning`/`success`/`fail` |
| 状态提示 | 需配合 Form.item | `tipMsg` prop 直接设置 |
| 前后置标签 | `addonBefore`/`addonAfter` prop + 插槽 | 相同，但插槽名也是 `addonBefore`/`addonAfter` |
| 前后缀图标 | `prefix`/`suffix` 插槽 | `iconBefore`/`iconAfter` 插槽 |
| 清空按钮 | `allowClear` | `clear` |
| 密码切换 | 内置（type=password 时自动） | `showPassword` prop |
| 搜索框 | `a-input-search` + `enter-button` | `ori-input-search` + `search-btn` |
| 搜索图标 | 默认显示 | `searchIcon` prop 控制 |
| 搜索圆角 | 无 | `searchRadius` prop |
| 区间输入 | `a-input-group` + 两个 Input | `rangeValue` prop + 单个 Input |
| 下边框模式 | 无 | `borderBottom` prop |
| 失败状态 | 无 | `fail` boolean prop |
| 文本域字数 | `showCount` | `showLength` |
| 组合间距 | 无 | `beforeMargin`/`afterMargin` |
| 组合边框 | 无 | `addonBorder` |
