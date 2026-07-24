---
title: 加载中 Spin
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, feedback]
---

# 加载中 Spin

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 页面局部处于等待异步数据或正在渲染的过程时。

## API 参考

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 组件大小 | `'small' \| 'default' \| 'large'` | `'default'` |
| spinning | 控制是否为加载中状态 | `boolean` | `true` |
| tip | 自定义描述文案 | `string` | - |
| indicator | 加载指示符 | `VNode \| slot` | - |
| wrapperClassName | 包装器的类属性 | `string` | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 包裹的内容 |
| indicator | 自定义加载指示符 |

## 使用示例

### 正确用法

```vue
<template>
  <!-- 仅图标 -->
  <OriSpin />

  <!-- 仅文字 -->
  <OriSpin tip="加载中..." />

  <!-- 图标 + 文字 -->
  <OriSpin size="default" tip="正在加载">
    <template #indicator>
      <LoadingIcon />
    </template>
  </OriSpin>

  <!-- 不同尺寸：small 用于文本加载，default 用于卡片容器级加载，large 用于页面级加载 -->
  <OriSpin size="small" />
  <OriSpin size="default" />
  <OriSpin size="large" />

  <!-- 包裹内容 -->
  <OriSpin :spinning="loading" tip="数据加载中...">
    <div class="content">
      <p>需要加载的内容</p>
    </div>
  </OriSpin>

  <!-- 自定义指示符 -->
  <OriSpin>
    <template #indicator>
      <CustomSpinner />
    </template>
  </OriSpin>

  <!-- 控制加载状态 -->
  <OriSpin :spinning="isLoading" wrapper-class-name="my-spin-wrapper">
    <DataTable :data="tableData" />
  </OriSpin>
</template>
```

### 常见错误

```vue
<template>
  <!-- 错误：使用 delay 属性（Ant Design Vue 的 API） -->
  <OriSpin :delay="500" />

  <!-- 错误：使用 size="mini"（不是有效值） -->
  <OriSpin size="mini" />
  <!-- 有效值为 small/default/large -->

  <!-- 错误：不传 spinning 但期望可以控制显隐 -->
  <!-- spinning 默认为 true，不传则始终显示加载状态 -->
  <OriSpin>
    <Content />
  </OriSpin>
  <!-- 应显式控制 -->
  <OriSpin :spinning="loading">
    <Content />
  </OriSpin>
</template>
```

## 与其他组件库的差异

| 特性 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| `size` 属性 | `'small' \| 'default' \| 'large'` | `'small' \| 'default' \| 'large'` | 不支持（使用 `size` prop: `'large' \| 'default' \| 'small'`） |
| `spinning` 属性 | 支持 | 支持 | 不支持（使用 `v-loading` 指令） |
| `tip` 属性 | 支持 | 支持 | 不支持（`v-loading` 使用 `element-loading-text`） |
| `indicator` | VNode / 插槽 | 插槽 | 不支持（`v-loading` 使用 `element-loading-spinner`） |
| `delay` 属性 | 不支持 | 支持 | 不支持 |
| `wrapperClassName` | 支持 | 不支持 | 不适用 |
| 包裹内容 | 支持 | 支持 | 使用 `v-loading` 指令 |
