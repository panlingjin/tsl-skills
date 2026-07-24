---
title: 标签 Tag
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, data-display]
---

# 标签 Tag

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 用于标记事物的属性和维度。
- 进行分类。

## API 参考

### Tag Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| closable | 是否可关闭 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| size | 尺寸 | `'large' \| 'small'` | -（默认尺寸） |
| color | 自定义标签的背景色 | `string` | - |
| visible (v-model) | 控制标签的显示隐藏 | `boolean` | `false` |

### Tag Slots

| 名称 | 说明 |
| --- | --- |
| default | 标签默认文本内容 |
| icon | 标签传入的图标 |

### Tag Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| close | 标签关闭触发的事件 | `(event: MouseEvent): void` |

### CheckableTag Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked (v-model) | 是否选中 | `boolean` | `false` |

### CheckableTag Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 选中状态改变时触发的事件 | `(checked: boolean): void` |

## 子组件访问方式

CheckableTag 作为 Tag 的子组件，通过 `OriTag.CheckableTag` 访问：

```typescript
import { Tag as OriTag } from 'origami-vue'

// 方式一：直接使用 OriTag.CheckableTag
// 方式二：解构赋值
const OriCheckableTag = OriTag.CheckableTag
```

```vue
<!-- 直接使用 OriTag.CheckableTag -->
<OriTag.CheckableTag v-model:checked="checked" @change="onChange">
  可选择标签
</OriTag.CheckableTag>

<!-- 解构后使用 -->
<OriTag.CheckableTag v-model:checked="checked">可选择标签</OriTag.CheckableTag>
```

## 使用示例

### 正确用法

```vue
<template>
  <!-- 基本标签 -->
  <OriTag>标签</OriTag>

  <!-- 可关闭标签 -->
  <OriTag closable @close="onClose">可关闭</OriTag>

  <!-- 不同尺寸 -->
  <OriTag size="small">小标签</OriTag>
  <OriTag>默认标签</OriTag>
  <OriTag size="large">大标签</OriTag>

  <!-- 带图标的标签 -->
  <OriTag>
    <template #icon><StarIcon /></template>
    带图标
  </OriTag>

  <!-- 自定义颜色 -->
  <OriTag color="#f50">自定义颜色</OriTag>

  <!-- v-model 控制显示隐藏 -->
  <OriTag v-model:visible="tagVisible" closable>受控标签</OriTag>

  <!-- 禁用标签 -->
  <OriTag disabled>禁用标签</OriTag>

  <!-- 可选择标签（完全受控组件） -->
  <OriTag.CheckableTag v-model:checked="checked" @change="onChange">
    可选择标签
  </OriTag.CheckableTag>
</template>
```

### 常见错误

```vue
<template>
  <!-- 错误：使用 color 属性作为预设类型（origami-vue 的 color 仅用于自定义背景色） -->
  <OriTag color="success">成功</OriTag>

  <!-- 错误：CheckableTag 使用非受控模式（不支持非受控） -->
  <OriTag.CheckableTag :checked="true">不可切换</OriTag.CheckableTag>
  <!-- 应使用 v-model:checked -->
  <OriTag.CheckableTag v-model:checked="checked">可选择</OriTag.CheckableTag>

  <!-- 错误：使用 size="default"（default 不是有效值，不设置即为默认） -->
  <OriTag size="default">标签</OriTag>
</template>
```

## 与其他组件库的差异

| 特性 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| `visible` v-model | 支持 | 支持（v3+） | 不支持 |
| `disabled` 属性 | 支持 | 支持（v4+） | 不支持 |
| `icon` 插槽 | 支持 | 不支持（使用 `icon` prop） | 支持（`icon` prop） |
| `size` 属性 | `'large' \| 'small'`（不设置为默认） | 不支持 | `'large' \| 'default' \| 'small'` |
| `color` 属性 | 仅自定义背景色 | 支持预设色 + 自定义色 | 不支持 |
| CheckableTag | 支持，完全受控 | 支持，完全受控 | 不支持（使用 `Tag` + `effect`） |
| `checked` v-model | 支持 | 支持 | 不适用 |
