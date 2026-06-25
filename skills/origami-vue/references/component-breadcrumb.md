---
title: 面包屑 Breadcrumb
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, navigation]
---

# 面包屑 Breadcrumb

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 页面需要为用户提供快捷的路由切换功能。

## API 参考

### Breadcrumb Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| separator | 分隔符自定义 | `string \| slot` | `'/'` |
| size | 用于指定字体大小，仅支持 `'small'`。默认为 14px，当设定为 `small` 时为 12px | `string` | - |

### Breadcrumb.Item Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| href | 链接的目的地 | `string` | - |
| overlay | 下拉菜单的内容 | `Menu \| () => Menu` | - |
| disabled | 禁用单个 item | `boolean` | `false` |
| longText | 启用带省略号的面包屑（文字超过 120px 后省略内容，并支持 tooltip 显示） | `boolean` | `false` |

### Breadcrumb.Item Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击 | `(e: MouseEvent) => void` |

### Breadcrumb.Separator Props

无额外属性。

> **注意**：在使用 `Breadcrumb.Separator` 时，其父组件的分隔符必须设置为 `separator=""`，否则会出现父组件默认的分隔符。

## 使用示例

### 正确用法

```vue
<template>
  <!-- 基础面包屑 -->
  <OriBreadcrumb>
    <OriBreadcrumb.Item>首页</OriBreadcrumb.Item>
    <OriBreadcrumb.Item>应用中心</OriBreadcrumb.Item>
    <OriBreadcrumb.Item>应用详情</OriBreadcrumb.Item>
  </OriBreadcrumb>

  <!-- 小尺寸 -->
  <OriBreadcrumb size="small">
    <OriBreadcrumb.Item>首页</OriBreadcrumb.Item>
    <OriBreadcrumb.Item>当前页</OriBreadcrumb.Item>
  </OriBreadcrumb>

  <!-- 自定义分隔符 -->
  <OriBreadcrumb separator=">">
    <OriBreadcrumb.Item>首页</OriBreadcrumb.Item>
    <OriBreadcrumb.Item>列表</OriBreadcrumb.Item>
  </OriBreadcrumb>

  <!-- 使用分隔符插槽 -->
  <OriBreadcrumb separator="">
    <OriBreadcrumb.Item>首页</OriBreadcrumb.Item>
    <OriBreadcrumb.Separator>→</OriBreadcrumb.Separator>
    <OriBreadcrumb.Item>详情</OriBreadcrumb.Item>
  </OriBreadcrumb>

  <!-- 带链接 -->
  <OriBreadcrumb>
    <OriBreadcrumb.Item href="/home">首页</OriBreadcrumb.Item>
    <OriBreadcrumb.Item href="/list">列表</OriBreadcrumb.Item>
    <OriBreadcrumb.Item>详情</OriBreadcrumb.Item>
  </OriBreadcrumb>

  <!-- 带图标 -->
  <OriBreadcrumb>
    <OriBreadcrumb.Item>
      <HomeIcon /> 首页
    </OriBreadcrumb.Item>
    <OriBreadcrumb.Item>列表</OriBreadcrumb.Item>
  </OriBreadcrumb>

  <!-- 禁用项 -->
  <OriBreadcrumb>
    <OriBreadcrumb.Item>首页</OriBreadcrumb.Item>
    <OriBreadcrumb.Item disabled>禁用项</OriBreadcrumb.Item>
    <OriBreadcrumb.Item>当前</OriBreadcrumb.Item>
  </OriBreadcrumb>

  <!-- 长文本自动省略 + tooltip -->
  <OriBreadcrumb>
    <OriBreadcrumb.Item>首页</OriBreadcrumb.Item>
    <OriBreadcrumb.Item long-text>这是一个非常长的面包屑文本内容</OriBreadcrumb.Item>
  </OriBreadcrumb>

  <!-- 带下拉菜单 -->
  <OriBreadcrumb>
    <OriBreadcrumb.Item>首页</OriBreadcrumb.Item>
    <OriBreadcrumb.Item :overlay="menu">更多</OriBreadcrumb.Item>
    <OriBreadcrumb.Item>当前</OriBreadcrumb.Item>
  </OriBreadcrumb>
</template>
```

### 常见错误

```vue
<template>
  <!-- 错误：使用 size="large"（仅支持 small） -->
  <OriBreadcrumb size="large">
    <OriBreadcrumb.Item>首页</OriBreadcrumb.Item>
  </OriBreadcrumb>

  <!-- 错误：使用 Breadcrumb.Separator 但未清空父组件 separator -->
  <OriBreadcrumb>
    <OriBreadcrumb.Item>首页</OriBreadcrumb.Item>
    <OriBreadcrumb.Separator>→</OriBreadcrumb.Separator>
    <OriBreadcrumb.Item>详情</OriBreadcrumb.Item>
  </OriBreadcrumb>
  <!-- 应设置 separator="" -->
  <OriBreadcrumb separator="">
    <OriBreadcrumb.Item>首页</OriBreadcrumb.Item>
    <OriBreadcrumb.Separator>→</OriBreadcrumb.Separator>
    <OriBreadcrumb.Item>详情</OriBreadcrumb.Item>
  </OriBreadcrumb>

  <!-- 错误：使用 routes 属性（Ant Design Vue 的 API） -->
  <OriBreadcrumb :routes="routes" />
</template>
```

## 与其他组件库的差异

| 特性 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| `size` 属性 | 仅 `'small'` | 不支持 | 不支持 |
| `disabled` 属性 | 支持（Breadcrumb.Item） | 不支持 | 不支持 |
| `longText` 属性 | 支持（自动省略 + tooltip） | 不支持 | 不支持 |
| `overlay` 属性 | 支持（下拉菜单） | 支持（`overlay`） | 不支持 |
| `routes` 属性 | 不支持 | 支持 | 不支持 |
| `separator` 属性 | 支持 | 支持 | 支持（`separator`） |
| `Breadcrumb.Separator` | 支持自定义分隔符组件 | 不支持 | 不支持 |
| `itemRender` | 不支持 | 支持 | 不支持 |
