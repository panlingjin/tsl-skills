---
title: 空状态 Empty
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, data-display]
---

# 空状态 Empty

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 任何内容区域（页面、区块、组件、单数据）没有内容/数据呈现给用户时显示提示。
- 初始化场景下引导用户操作。

## API 参考

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| image | 自定义图片 | `string` | - |
| imageStyle | 自定义图片样式 | `CSSProperties` | - |
| title | 空状态标题 | `string` | - |
| description | 空状态描述文本 | `string` | - |
| size | 尺寸 | `'default' \| 'mini' \| 'small' \| 'large'` | `'default'` |

### Slots

| 名称 | 说明 |
| --- | --- |
| image | 自定义图片 |
| title | 空状态标题 |
| description | 空状态描述文本 |
| default | 附属内容 |

## 使用示例

### 正确用法

```vue
<template>
  <!-- 基本用法 -->
  <OriEmpty />

  <!-- 带标题和描述 -->
  <OriEmpty title="暂无数据" description="请先添加数据" />

  <!-- 自定义图片 -->
  <OriEmpty image="https://example.com/empty.png" title="暂无内容" />

  <!-- 不同尺寸 -->
  <OriEmpty size="mini" title="迷你" />
  <OriEmpty size="small" title="小号" />
  <OriEmpty size="default" title="默认" />
  <OriEmpty size="large" title="大号" />

  <!-- 使用插槽自定义 -->
  <OriEmpty>
    <template #image>
      <img src="/custom-empty.svg" alt="空" />
    </template>
    <template #title>自定义标题</template>
    <template #description>自定义描述内容</template>
    <OriButton type="primary" size="small">添加数据</OriButton>
  </OriEmpty>

  <!-- 无标题无描述 -->
  <OriEmpty :image="simpleImage" />
</template>
```

### 常见错误

```vue
<template>
  <!-- 错误：使用 imageStyle 传入字符串（应为 CSSProperties 对象） -->
  <OriEmpty image-style="width: 100px" />

  <!-- 正确：imageStyle 传入对象 -->
  <OriEmpty :image-style="{ width: '100px' }" />

  <!-- 错误：使用 description 替代 title（两者是独立的） -->
  <OriEmpty description="暂无数据" />
  <!-- 应使用 title 作为主标题 -->
  <OriEmpty title="暂无数据" description="请先添加数据" />

  <!-- 错误：使用 size="medium"（不是有效值） -->
  <OriEmpty size="medium" />
  <!-- 应使用 size="default" -->
  <OriEmpty size="default" />
</template>
```

## 与其他组件库的差异

| 特性 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| `title` 属性 | 支持（主标题） | 不支持（使用 `description` 作为主文案） | 不支持 |
| `description` 属性 | 支持（辅助描述） | 支持（主文案） | 支持（`description`） |
| `size` 属性 | `'mini' \| 'small' \| 'default' \| 'large'` | 不支持 | 不支持 |
| `image` 属性 | 支持 | 支持 | 支持 |
| `imageStyle` 属性 | 支持 | 支持 | 不支持 |
| 附属内容插槽 | `default` | `default` | `default` |
| `image` 插槽 | 支持 | 支持 | 支持 |
