---
title: 警告提示 Alert
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, feedback]
---

# 警告提示 Alert

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 当某个页面需要向用户显示警告的信息时。
- 非浮层的静态展现形式，始终展现，不会自动消失，用户可以点击关闭。

## API 参考

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 样式类型 | `'success' \| 'info' \| 'error' \| 'warning'` | `'info'` |
| message | 提示内容 | `string` | - |
| description | 提示的辅助内容 | `string` | - |
| showIcon | 是否显示图标 | `boolean` | `false` |
| closable | 是否可关闭 | `boolean` | `false` |

### Slots

| 名称 | 说明 |
| --- | --- |
| message | 提示内容 |
| closeIcon | 关闭图标 |
| description | 提示的辅助内容 |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| close | 点击关闭触发 | `(event: MouseEvent): void` |

## 使用示例

### 正确用法

```vue
<template>
  <!-- 基本警告提示 -->
  <OriAlert type="info" message="提示信息" />

  <!-- 带辅助描述 -->
  <OriAlert type="warning" message="警告" description="这是一条警告的详细说明" />

  <!-- 可关闭 + 图标 -->
  <OriAlert type="success" message="操作成功" showIcon closable @close="onClose" />

  <!-- 使用插槽自定义内容 -->
  <OriAlert type="error" closable>
    <template #message>自定义错误信息</template>
    <template #description>错误的详细描述内容</template>
    <template #closeIcon><CloseIcon /></template>
  </OriAlert>
</template>
```

### 常见错误

```vue
<template>
  <!-- 错误：使用 banner 属性（Ant Design 的 API，origami-vue 不支持） -->
  <OriAlert banner message="提示" />

  <!-- 错误：使用 afterClose 属性（origami-vue 不支持） -->
  <OriAlert closable after-close="handleAfterClose" message="提示" />

  <!-- 错误：type 使用了不存在的值 -->
  <OriAlert type="normal" message="提示" />
</template>
```

## 与其他组件库的差异

| 特性 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| `banner` 属性 | 不支持 | 支持 | 不支持 |
| `afterClose` 回调 | 不支持 | 支持 | 不支持 |
| `showIcon` | 支持 | 支持 | 支持 |
| `closable` | 支持 | 支持 | 不支持（使用 `close` slot） |
| `closeIcon` 插槽 | 支持 | 支持 | 不支持 |
| `effect` 主题 | 不支持 | 不支持 | 支持 (dark/light) |
