---
title: 时间选择器 (TimePicker)
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, form]
---

# 时间选择器 (TimePicker)

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 当用户需要输入一个时间点时
- 当用户需要选择一个时间范围时，使用 TimeRangePicker

## API 参考

### 共同的 Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| allowClear | 是否显示清除按钮 | `boolean` | `true` |
| disabled | 禁用 | `boolean` | `false` |
| format | 展示的时间格式 | `string` | `'HH:mm:ss'` / `'HH:mm'` |
| footer | 底部操作 | `boolean` | `false` |
| placeholder | 输入框提示文字 | `string \| [string, string]` | `-` |
| suffixIcon | 自定义的选择框后缀图标 | `v-slot:suffixIcon` | `-` |

### 共同的方法

| 名称 | 描述 |
| --- | --- |
| blur() | 移除焦点 |
| focus() | 获取焦点 |

### TimePicker Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| placeholder | 输入框提示文字 | `string` | `-` |
| value (v-model) | 当前时间 | `dayjs` | `-` |

### TimePicker 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 时间发生变化的回调 | `function(date: dayjs)` |

### TimeRangePicker Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| placeholder | 输入框提示文字 | `[string, string]` | `-` |
| value (v-model) | 当前时间 | `dayjs[]` | `-` |

### TimeRangePicker 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 时间发生变化的回调 | `function(date: dayjs[])` |

## 子组件访问

TimePicker 的子组件通过小驼峰属性访问：
- `OriTimePicker.rangePicker` — 时间范围选择器

```vue
<OriTimePicker.rangePicker v-model="timeRange" />
```

## 使用示例

### 正确用法

```vue
<script setup lang="ts">
import dayjs from 'dayjs'
const time = ref<dayjs.Dayjs | null>(null)
const timeRange = ref<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
</script>

<template>
  <!-- 基础用法 -->
  <OriTimePicker v-model:value="time" />

  <!-- 指定格式 -->
  <OriTimePicker v-model:value="time" format="HH:mm" />

  <!-- 带底部确认操作 -->
  <OriTimePicker v-model:value="time" :footer="true" />

  <!-- 自定义 placeholder -->
  <OriTimePicker v-model:value="time" placeholder="请选择时间" />

  <!-- 禁用 -->
  <OriTimePicker v-model:value="time" disabled />

  <!-- 时间范围选择 -->
  <OriTimePicker.rangePicker v-model:value="timeRange" />

  <!-- 范围选择自定义 placeholder -->
  <OriTimePicker.rangePicker
    v-model:value="timeRange"
    :placeholder="['开始时间', '结束时间']"
  />

  <!-- 自定义后缀图标 -->
  <OriTimePicker v-model:value="time">
    <template #suffixIcon>
      <ClockOutline />
    </template>
  </OriTimePicker>
</template>
```

### 常见错误

```vue
<!-- 错误：v-model 绑定字符串而非 dayjs 对象 -->
<OriTimePicker v-model:value="timeStr" />
<!-- value 类型为 dayjs，不是 string -->

<!-- 错误：format 使用了不支持的格式 -->
<OriTimePicker v-model:value="time" format="hh:mm:ss" />
<!-- 应使用 HH（24小时制），不是 hh（12小时制） -->

<!-- 错误：TimeRangePicker placeholder 传字符串 -->
<OriTimePicker.rangePicker v-model:value="range" placeholder="选择时间" />
<!-- placeholder 应为数组 [string, string] -->

<!-- 错误：footer 传字符串 -->
<OriTimePicker v-model:value="time" footer="true" />
<!-- footer 为 boolean 类型，应使用 :footer="true" -->
```

## 与其他组件库的差异

| 差异点 | origami-vue | ant-design-vue | element-plus |
| --- | --- | --- | --- |
| v-model 绑定 | `v-model:value` | `v-model:value` | `v-model` / `v-model:modelValue` |
| 时间值类型 | `dayjs` | `dayjs` | `Date` / `string` |
| 底部操作 | `footer` (boolean) | 不支持 | 不支持 |
| 默认格式 | `'HH:mm:ss'` / `'HH:mm'` | `'HH:mm:ss'` | `'HH:mm:ss'` |
| 范围选择 | `OriTimePicker.rangePicker` | `a-time-range-picker` | `el-time-picker is-range` |
| 后缀图标 | `suffixIcon` 插槽 | `suffixIcon` 插槽 | `prefix-icon` / `suffix-icon` prop |
