---
title: 文字提示 Tooltip
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, feedback]
---

# 文字提示 Tooltip

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 常用于展示鼠标 hover 时的提示信息。

## API 参考

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| append-to | 指示 Tooltip 的内容将附加在哪一个网页元素上 | `string`（CSS 选择器） | - |
| effect | 主题风格 | `'dark' \| 'light'` | `'dark'` |
| content | 显示的内容，也可被 `#content` 插槽覆盖 | `string` | - |
| raw-content | content 中的内容是否作为 HTML 字符串处理 | `boolean` | `false` |
| placement | Tooltip 组件出现的位置 | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'bottom'` |
| visible / v-model:visible | Tooltip 组件可见性 | `boolean` | `false` |
| disabled | Tooltip 组件是否禁用 | `boolean` | `false` |
| offset | 出现位置的偏移量 | `number` | `0` |
| show-arrow | 是否显示箭头 | `boolean` | `true` |
| show-after | 延迟出现，单位毫秒 | `number` | `0` |
| hide-after | 延迟关闭，单位毫秒 | `number` | `200` |
| auto-close | tooltip 出现后自动隐藏延时，单位毫秒 | `number` | `0` |
| teleported | 是否使用 teleport。设置成 true 则会被追加到 append-to 的位置 | `boolean` | `true` |
| trigger | 如何触发 tooltip | `'hover' \| 'click' \| 'focus' \| 'contextmenu'` | `'hover'` |
| popper-class | 为 Tooltip 的 popper 添加自定义类名 | `string` | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| content | 自定义内容 |

## 使用示例

### 正确用法

```vue
<template>
  <!-- 基本用法 -->
  <OriTooltip content="提示文字">
    <span>鼠标悬停查看</span>
  </OriTooltip>

  <!-- 浅色主题 -->
  <OriTooltip content="浅色提示" effect="light">
    <span>浅色主题</span>
  </OriTooltip>

  <!-- 无箭头 -->
  <OriTooltip content="无箭头提示" :show-arrow="false">
    <span>无箭头</span>
  </OriTooltip>

  <!-- 不同方向 -->
  <OriTooltip content="顶部提示" placement="top">
    <span>上方</span>
  </OriTooltip>

  <!-- 点击触发 -->
  <OriTooltip content="点击触发" trigger="click">
    <span>点击查看</span>
  </OriTooltip>

  <!-- 延迟显示/隐藏 -->
  <OriTooltip content="延迟提示" :show-after="300" :hide-after="500">
    <span>延迟显示</span>
  </OriTooltip>

  <!-- 自定义内容插槽 -->
  <OriTooltip>
    <template #content>
      <div>自定义<strong>提示</strong>内容</div>
    </template>
    <span>自定义内容</span>
  </OriTooltip>

  <!-- 受控可见性 -->
  <OriTooltip v-model:visible="tooltipVisible" content="受控提示">
    <span>受控模式</span>
  </OriTooltip>

  <!-- 自定义颜色 -->
  <OriTooltip content="自定义颜色" popper-class="custom-tooltip">
    <span>自定义颜色</span>
  </OriTooltip>
</template>
```

### 常见错误

```vue
<template>
  <!-- 错误：使用 title 属性（Ant Design Vue 的 API） -->
  <OriTooltip title="提示文字">
    <span>错误</span>
  </OriTooltip>
  <!-- 应使用 content -->
  <OriTooltip content="提示文字">
    <span>正确</span>
  </OriTooltip>

  <!-- 错误：使用 getPopupContainer 属性（Ant Design Vue 的 API） -->
  <OriTooltip content="提示" get-popup-container="body">
    <span>错误</span>
  </OriTooltip>
  <!-- 应使用 append-to -->
  <OriTooltip content="提示" append-to="body">
    <span>正确</span>
  </OriTooltip>

  <!-- 正确：placement 支持复合方向（如 top-start） -->
  <OriTooltip content="提示" placement="top-start">
    <span>正确</span>
  </OriTooltip>
  <!-- origami-vue 支持 top/bottom/left/right 及其 start/end 变体 -->
  <OriTooltip content="提示" placement="top">
    <span>正确</span>
  </OriTooltip>
</template>
```

## 与其他组件库的差异

| 特性 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| 内容属性名 | `content` | `title` | `content` |
| 主题风格 | `effect` (dark/light) | 不支持（默认 dark） | `effect` (dark/light) |
| 容器挂载 | `append-to`（CSS 选择器） | `getPopupContainer`（函数） | `teleported` + `popper-append-to-body` |
| teleport 控制 | `teleported` | 不支持 | `teleported` |
| 延迟显示 | `show-after` | `mouseEnterDelay` | `show-after` |
| 延迟隐藏 | `hide-after` | `mouseLeaveDelay` | `hide-after` |
| 自动关闭 | `auto-close` | 不支持 | `auto-close` |
| placement 方向 | top/bottom/left/right 及 start/end 变体 | 支持复合方向（如 topLeft） | 支持复合方向 |
| 箭头控制 | `show-arrow` | `arrowPointAtCenter` | `show-arrow` |
