---
title: 进度条 Progress
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, feedback]
---

# 进度条 Progress

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 当需要显示一个操作完成的百分比时。
- 当一个操作会打断当前界面，或者需要在后台运行。

## API 参考

### Progress Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 类型 | `'line' \| 'circle'` | `'line'` |
| percent | 百分比 | `number` | `0` |
| size | 控制进度条尺寸 | `'small' \| 'huge'` | -（默认大小） |
| showInfo | 是否显示进度数值或状态图标 | `boolean` | `true` |
| status | 状态 | `'success' \| 'exception'` | -（默认状态） |
| strokeColor | 进度条的色彩 | `string` | - |
| trailColor | 未完成的分段的颜色 | `string` | - |

### Progress.Line Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| strokeWidth | 进度条线的宽度 | `number` | `10` |

### Progress.Circle Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| strokeWidth | 圆形进度条线的宽度，单位是进度条画布宽度的百分比 | `number` | `6` |

## 使用示例

### 正确用法

```vue
<template>
  <!-- 基础进度条 -->
  <OriProgress :percent="30" />

  <!-- 进度完成 -->
  <OriProgress :percent="100" status="success" />

  <!-- 进度发生错误 -->
  <OriProgress :percent="70" status="exception" />

  <!-- 不显示信息 -->
  <OriProgress :percent="50" :show-info="false" />

  <!-- 大尺寸 -->
  <OriProgress :percent="60" size="huge" />

  <!-- 小尺寸 -->
  <OriProgress :percent="40" size="small" />

  <!-- 自定义颜色 -->
  <OriProgress :percent="80" stroke-color="#0bb837" trail-color="#f2f3f5" />

  <!-- 圆形进度条 -->
  <OriProgress type="circle" :percent="75" />

  <!-- 圆形进度条自定义宽度 -->
  <OriProgress type="circle" :percent="60" :stroke-width="8" />
</template>
```

### 常见错误

```vue
<template>
  <!-- 错误：使用 size="default"（default 不是有效值，不设置即为默认） -->
  <OriProgress :percent="50" size="default" />

  <!-- 错误：使用 size="medium"（不是有效值） -->
  <OriProgress :percent="50" size="medium" />

  <!-- 错误：percent 超出范围 -->
  <OriProgress :percent="120" />

  <!-- 错误：使用 format 属性（Ant Design Vue 的 API） -->
  <OriProgress :percent="50" format="() => '50%'" />

  <!-- 错误：使用 strokeColor 传入对象（渐变色，Ant Design Vue 支持） -->
  <OriProgress :percent="50" :stroke-color="{ from: '#108ee9', to: '#87d068' }" />
  <!-- origami-vue 的 strokeColor 仅支持字符串 -->
  <OriProgress :percent="50" stroke-color="#108ee9" />
</template>
```

## 与其他组件库的差异

| 特性 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| `type` 属性 | `'line' \| 'circle'` | `'line' \| 'circle' \| 'dashboard'` | `'line' \| 'circle' \| 'dashboard'` |
| `size` 属性 | `'small' \| 'huge'` | `'small' \| 'default'` | 不支持（使用 `stroke-width`） |
| `dashboard` 类型 | 不支持 | 支持 | 支持 |
| `format` 属性 | 不支持 | 支持 | 不支持 |
| `strokeColor` | 仅字符串 | 字符串或渐变对象 | 字符串或渐变对象 |
| `trailColor` | 支持 | 不支持（使用 `trailColor`） | 不支持（使用 `define-back-color`） |
| `steps` 属性 | 不支持 | 支持 | 支持 |
| `strokeLinecap` | 不支持 | 支持 | 支持 |
