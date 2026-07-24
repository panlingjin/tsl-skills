---
title: 分割线 Divider
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, basic]
---

# 分割线 Divider

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 对不同章节的文本段落进行分割。
- 对行内文字/链接进行分割，例如表格的操作列。

## API 参考

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| dashed | 是否虚线 | `boolean` | `false` |
| type | 类型：水平或者垂直 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| orientation | 分割线标题的位置 | `'left' \| 'right' \| 'center'` | `'center'` |
| orientationMargin | 标题离 left/right 的距离，去除 left/right 的分割线，同时 orientation 必须为 left 或 right | `string \| number` | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 分割线中间的文字内容 |

## 使用示例

### 正确用法

```vue
<template>
  <!-- 水平分割线 -->
  <OriDivider />

  <!-- 带文字的分割线 -->
  <OriDivider>分割线文字</OriDivider>

  <!-- 文字居左 -->
  <OriDivider orientation="left">左侧文字</OriDivider>

  <!-- 文字居右 + 自定义边距 -->
  <OriDivider orientation="right" orientation-margin="20px">右侧文字</OriDivider>

  <!-- 虚线 -->
  <OriDivider dashed>虚线分割</OriDivider>

  <!-- 垂直分割线（行内使用） -->
  <span>文字</span>
  <OriDivider type="vertical" />
  <span>链接</span>
</template>
```

### 常见错误

```vue
<template>
  <!-- 错误：垂直分割线使用 orientation（仅水平分割线支持） -->
  <OriDivider type="vertical" orientation="left">文字</OriDivider>

  <!-- 错误：orientationMargin 在 orientation 为 center 时无效 -->
  <OriDivider orientation="center" orientation-margin="20px">文字</OriDivider>

  <!-- 错误：使用 plain 属性（Ant Design Vue 的 API） -->
  <OriDivider plain>文字</OriDivider>
</template>
```

## 与其他组件库的差异

| 特性 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| `dashed` 属性 | 支持 | 支持 | 支持 |
| `type` 属性 | `'horizontal' \| 'vertical'` | `'horizontal' \| 'vertical'` | `'horizontal' \| 'vertical'` |
| `orientation` | 支持 | 支持 | 不支持（使用 `content-position`） |
| `orientationMargin` | 支持 | 支持 | 不支持 |
| `plain` 属性 | 不支持 | 支持 | 不支持 |
| `content-position` | 不支持（使用 `orientation`） | 不支持（使用 `orientation`） | 支持 (left/center/right) |
| `border-style` 属性 | 不支持 | 不支持 | 支持 |
