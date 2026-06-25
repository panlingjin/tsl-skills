---
title: 按钮 Button
impact: HIGH
impactDescription: 使用错误 API 会导致按钮样式和行为异常，特别是 primary 和 type 的用法与 Ant Design Vue 完全不同
type: component
tags: [origami-vue, basic]
---

# 按钮 Button

**Impact: HIGH** - 使用错误 API 会导致按钮样式和行为异常，特别是 `primary` 和 `type` 的用法与 Ant Design Vue 完全不同

## 何时使用

标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。

按钮按照样式类型分为：

- 容器按钮
- 线框按钮（outline-实线，dashed-虚线）
- 文本按钮（普通文本、链接）

按钮按照状态分为：

- 主要：primary，主行动点，一个操作区域只能有一个主按钮
- 危险：danger，删除/移动/修改权限等危险操作，一般需要二次确认
- 禁用：行动点不可用，一般需要文案解释
- 加载中：用于异步操作等待反馈的时候，也可以避免多次提交

## API 参考

### Props

| 参数     | 说明                       | 类型                                     | 默认值      |
| -------- | -------------------------- | ---------------------------------------- | ----------- |
| type     | 样式类型                   | _container \| outline \| dashed \| text \| link_ | `container` |
| primary  | 是否为主按钮               | _boolean_                                | `false`     |
| danger   | 是否为危险按钮             | _boolean_                                | `false`     |
| disabled | 是否禁用                   | _boolean_                                | `false`     |
| loading  | 是否处于加载状态           | _boolean_                                | `false`     |
| size     | 尺寸，默认不设置           | _large \| small \| tiny_                 | -           |
| shape    | 形状，默认不设置           | _round \| circle_                                  | -           |
| htmlType | 设置 button 原生的 type 值 | _button \| submit \| reset_              | `button`    |

### Slots

| 名称 | 说明             |
| ---- | ---------------- |
| —    | 按钮默认文本内容 |
| icon | 按钮传入的图标   |

### Events

| 事件名 | 说明     | 回调参数                    |
| ------ | -------- | --------------------------- |
| click  | 点击事件 | _(event: MouseEvent): void_ |

## 使用示例

### 正确用法

```vue
<!-- 主按钮：primary 是 boolean prop，不是 type 的值 -->
<ori-button primary>主按钮</ori-button>

<!-- 容器按钮（默认 type） -->
<ori-button type="container">容器按钮</ori-button>

<!-- 线框按钮 -->
<ori-button type="outline">线框按钮</ori-button>
<ori-button type="dashed">虚线按钮</ori-button>

<!-- 文本/链接按钮 -->
<ori-button type="text">文本按钮</ori-button>
<ori-button type="link">链接按钮</ori-button>

<!-- 危险主按钮 -->
<ori-button primary danger>危险主按钮</ori-button>

<!-- 不同尺寸：large/small/tiny（无 medium） -->
<ori-button primary size="large">大按钮</ori-button>
<ori-button primary size="small">小按钮</ori-button>
<ori-button primary size="tiny">迷你按钮</ori-button>

<!-- 圆角按钮 -->
<ori-button primary shape="round">圆角按钮</ori-button>

<!-- 圆形按钮（仅图标） -->
<ori-button primary shape="circle">
  <template #icon><AddFill /></template>
</ori-button>

<!-- 加载状态 -->
<ori-button primary loading>加载中</ori-button>

<!-- 带图标的按钮 -->
<ori-button primary>
  <template #icon><SearchIcon /></template>
  搜索
</ori-button>

<!-- 表单提交按钮 -->
<ori-button primary html-type="submit">提交</ori-button>
```

### 常见错误

```vue
<!-- ❌ 错误：primary 不是 type 的值，这是 Ant Design Vue 的写法 -->
<ori-button type="primary">主按钮</ori-button>

<!-- ✅ 正确：primary 是独立的 boolean prop -->
<ori-button primary>主按钮</ori-button>

<!-- ❌ 错误：size 不支持 medium -->
<ori-button size="medium">中按钮</ori-button>

<!-- ✅ 正确：size 可选 large/small/tiny，不设置则为默认中等尺寸 -->
<ori-button>默认尺寸按钮</ori-button>

<!-- ❌ 错误：type="primary" 不会生效，type 只控制样式类型 -->
<ori-button type="primary" danger>危险主按钮</ori-button>

<!-- ✅ 正确：primary 和 danger 是独立 prop -->
<ori-button primary danger>危险主按钮</ori-button>
```

## 与其他组件库的差异

### 与 Ant Design Vue 的差异

| 差异点 | Ant Design Vue | origami-vue |
|--------|---------------|-------------|
| 主按钮 | `type="primary"` | `primary` (boolean prop) |
| 危险按钮 | `danger` 是 type 的值 或 `danger` prop | `danger` 是独立 boolean prop |
| 按钮样式类型 | `type` 同时控制主色和样式 | `type` 仅控制样式类型 (container/outline/dashed/text/link) |
| 尺寸选项 | `large / middle / small` | `large / small / tiny` |
| 圆形按钮 | `shape="circle"` | `shape="circle"` 支持，配合 icon 插槽使用 |
| 幽灵按钮 | `ghost` prop | 不支持 |
| block 按钮 | `block` prop | 不支持 |
| 图标按钮 | `icon` prop | `icon` 插槽 |
| 按钮组 | `Button.Group` | `OriButton.ButtonGroup` |

## ButtonGroup 子组件

ButtonGroup 用于将多个按钮组合为一组，常用于工具栏等场景。

### 访问方式

ButtonGroup 作为 Button 的子组件，通过 `OriButton.ButtonGroup` 访问：

```typescript
import { Button as OriButton } from 'origami-vue'

// 方式一：直接使用 OriButton.ButtonGroup
// 方式二：解构赋值
const OriButtonGroup = OriButton.ButtonGroup
```

### 使用示例

```vue
<!-- 方式一：直接使用 OriButton.ButtonGroup -->
<OriButton.ButtonGroup>
  <OriButton primary>按钮1</OriButton>
  <OriButton primary>按钮2</OriButton>
  <OriButton primary>按钮3</OriButton>
</OriButton.ButtonGroup>

<!-- 方式二：解构后使用 -->
<OriButtonGroup>
  <OriButton type="outline">取消</OriButton>
  <OriButton primary>确认</OriButton>
</OriButtonGroup>
```
