---
title: 日期选择器 DatePicker
impact: MEDIUM
impactDescription: 使用错误 API 会导致组件功能异常
type: component
tags: [origami-vue, form]
---

# 日期选择器 DatePicker

**Impact: MEDIUM** - 使用错误 API（如误用 `value-format` 代替 dayjs 对象、混淆 `picker` 枚举值）会导致日期选择器无法正确工作

## 何时使用

- 当用户需要输入一个日期或日期范围时
- 需要选择日期、月份、年份、周或日期时间时

## API 参考

### 共同的 Props (DatePicker / RangePicker)

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| allowClear | 是否显示清除按钮 | _boolean_ | `true` |
| disabled | 禁用 | _boolean_ | `false` |
| disabledDate | 不可选择的日期 | _(currentDate: dayjs) => boolean_ | - |
| picker | 设置选择器类型 | _'time' \| 'date' \| 'month' \| 'year'_ | `'date'` |
| suffixIcon | 自定义的选择框后缀图标 | _v-slot:suffixIcon_ | - |

### 共同的方法

| 名称 | 描述 |
| --- | --- |
| blur() | 移除焦点 |
| focus() | 获取焦点 |

### DatePicker Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value (v-model) | 当前时间 | _dayjs_ | - |
| placeholder | 输入框提示文字 | _string_ | - |
| showToday | 是否展示"今天"按钮 | _boolean_ | - |

### DatePicker Events

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 时间发生变化的回调 | _(date: dayjs)_ |

### RangePicker Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value (v-model) | 当前时间范围 | _dayjs[]_ | - |
| placeholder | 输入框提示文字 | _[string, string]_ | - |

### RangePicker Events

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 时间发生变化的回调 | _(date: dayjs[])_ |

## 子组件访问方式

RangePicker 作为 DatePicker 的子组件，通过 `OriDatePicker.rangePicker` 访问：

```typescript
import { DatePicker as OriDatePicker } from 'origami-vue'

// 方式一：直接使用 OriDatePicker.rangePicker
// 方式二：解构赋值
const OriRangePicker = OriDatePicker.rangePicker
```

```vue
<!-- 直接使用 OriDatePicker.rangePicker -->
<OriDatePicker.rangePicker
  v-model:value="rangeValue"
  :placeholder="['开始日期', '结束日期']"
/>

<!-- 解构后使用 -->
<OriRangePicker v-model:value="rangeValue" />
```

## 使用示例

### 正确用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker as OriDatePicker } from 'origami-vue'
import dayjs from 'dayjs'

const dateValue = ref<dayjs.Dayjs | null>(null)
const rangeValue = ref<dayjs.Dayjs[]>([])

// 禁用未来日期
const disableFutureDate = (current: dayjs.Dayjs) => {
  return current && current > dayjs().endOf('day')
}
</script>

<template>
  <!-- 基础日期选择 -->
  <OriDatePicker v-model:value="dateValue" placeholder="请选择日期" />

  <!-- 月份选择 -->
  <OriDatePicker v-model:value="dateValue" picker="month" placeholder="请选择月份" />

  <!-- 年份选择 -->
  <OriDatePicker v-model:value="dateValue" picker="year" placeholder="请选择年份" />

  <!-- 日期时间选择 -->
  <OriDatePicker v-model:value="dateValue" picker="dateTime" placeholder="请选择日期时间" />

  <!-- 时间选择 -->
  <OriDatePicker v-model:value="dateValue" picker="time" placeholder="请选择时间" />

  <!-- 显示今天按钮 + 禁用清除 -->
  <OriDatePicker
    v-model:value="dateValue"
    :show-today="true"
    :allow-clear="false"
  />

  <!-- 禁用未来日期 -->
  <OriDatePicker
    v-model:value="dateValue"
    :disabled-date="disableFutureDate"
  />

  <!-- 禁用状态 -->
  <OriDatePicker v-model:value="dateValue" disabled />

  <!-- 日期范围选择 -->
  <OriDatePicker.rangePicker
    v-model:value="rangeValue"
    :placeholder="['开始日期', '结束日期']"
  />

  <!-- 日期时间范围选择 -->
  <OriDatePicker.rangePicker
    v-model:value="rangeValue"
    picker="dateTime"
    :placeholder="['开始时间', '结束时间']"
  />
</template>
```

### 常见错误

```vue
<!-- ❌ 错误：v-model 绑定了字符串而非 dayjs 对象 -->
<OriDatePicker v-model:value="dateStr" />
<!-- dateStr = '2024-01-01' 是错误的 -->

<!-- ✅ 正确：绑定 dayjs 对象 -->
<OriDatePicker v-model:value="dateValue" />
<!-- dateValue = dayjs('2024-01-01') -->

<!-- ❌ 错误：使用了 element-plus 的 v-model:value-format -->
<OriDatePicker v-model:value="dateValue" value-format="YYYY-MM-DD" />

<!-- ✅ 正确：origami-vue 始终使用 dayjs 对象，需手动格式化 -->
<OriDatePicker v-model:value="dateValue" @change="(d) => formatted = d?.format('YYYY-MM-DD')" />

<!-- ❌ 错误：picker 使用了 ant-design-vue 的 quarter/week 值 -->
<OriDatePicker picker="quarter" />

<!-- ✅ 正确：origami-vue 仅支持 time/date/month/year -->
<OriDatePicker picker="month" />

<!-- ❌ 错误：RangePicker placeholder 传入字符串 -->
<OriDatePicker.rangePicker placeholder="选择日期" />

<!-- ✅ 正确：RangePicker placeholder 传入数组 -->
<OriDatePicker.rangePicker :placeholder="['开始日期', '结束日期']" />
```

## 与其他组件库的差异

| 差异点 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| v-model 绑定 | `value` | `value` | `model-value` |
| 值类型 | `dayjs` 对象 | `dayjs` 对象 | `Date` 对象或字符串（可通过 `value-format` 配置） |
| 格式化 | 无 `value-format`，始终为 dayjs | 无 `value-format`，始终为 dayjs | `value-format` 支持字符串格式 |
| 选择器类型 | `picker`: time/date/month/year | `picker`: date/week/month/quarter/year/time | `type`: year/month/date/dates/datetime/week/datetimerange/daterange/monthrange |
| 周选择 | 不支持 `picker="week"` | `picker="week"` | `type="week"` |
| 季度选择 | 不支持 | `picker="quarter"` | 不支持 |
| 今天按钮 | `showToday` | `showToday` | 无 |
| 清除按钮 | `allowClear` | `allowClear` | `clearable` |
| 范围选择 | `OriDatePicker.rangePicker` | `a-range-picker` | `type="daterange"` |
| 禁用日期 | `disabledDate` (dayjs) | `disabledDate` (dayjs) | `disabledDate` (Date) |
