---
title: 布局 (Layout)
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, navigation]
---

# 布局 (Layout)

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 当需要快速构建一个基础的页面布局时
- 典型布局包括：上下布局、T 型布局（含侧边栏）、可折叠侧边栏布局

## API 参考

### Layout Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| class | 容器 class | `string` | `-` |
| hasSider | 表示子元素里有 Sider | `boolean` | `false` |
| style | 指定样式 | `object` | `-` |

### Layout.Sider Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| class | 容器 class | `string` | `-` |
| collapsed (v-model) | 当前收起状态 | `boolean` | `false` |
| collapsedWidth | 收缩宽度 | `number` | `80` |
| collapsible | 是否可收起 | `boolean` | `false` |
| defaultCollapsed | 是否默认收起 | `boolean` | `false` |
| reverseArrow | 翻转折叠提示箭头的方向，当 Sider 在右边时可以使用 | `boolean` | `false` |
| style | 指定样式 | `object \| string` | `-` |
| trigger | 自定义 trigger，设置为 null 时隐藏 trigger | `string \| slot` | `-` |
| width | 宽度 | `number` | `256` |

### Layout Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| collapse | 展开-收起时的回调函数 | `(collapsed, type) => {}` |

## 子组件访问方式

Layout 的子组件通过 `OriLayout` 的点号访问：

```typescript
import { Layout as OriLayout } from 'origami-vue'

// 方式一：直接使用 OriLayout.Header / OriLayout.Content / OriLayout.Footer / OriLayout.Sider
// 方式二：解构赋值
const { Header, Content, Footer, Sider } = OriLayout
```

```vue
<!-- 直接使用 OriLayout.Header 等 -->
<OriLayout>
  <OriLayout.Header>Header</OriLayout.Header>
  <OriLayout.Content>Content</OriLayout.Content>
  <OriLayout.Footer>Footer</OriLayout.Footer>
</OriLayout>

<!-- 解构后使用 -->
<OriLayout>
  <Header>Header</Header>
  <Content>Content</Content>
  <Sider v-model:collapsed="collapsed" collapsible>Sider</Sider>
</OriLayout>
```

## 使用示例

### 正确用法

```vue
<!-- 上下布局 -->
<OriLayout>
  <OriLayout.Header>Header</OriLayout.Header>
  <OriLayout.Content>Content</OriLayout.Content>
  <OriLayout.Footer>Footer</OriLayout.Footer>
</OriLayout>

<!-- T 型布局（含侧边栏） -->
<OriLayout>
  <OriLayout.Header>Header</OriLayout.Header>
  <OriLayout :has-sider="true">
    <OriLayout.Sider>Sider</OriLayout.Sider>
    <OriLayout.Content>Content</OriLayout.Content>
  </OriLayout>
  <OriLayout.Footer>Footer</OriLayout.Footer>
</OriLayout>

<!-- 可折叠侧边栏 -->
<OriLayout>
  <OriLayout.Sider
    v-model:collapsed="collapsed"
    collapsible
    :width="256"
    :collapsed-width="80"
  >
    <div class="logo">Logo</div>
    <!-- 侧边栏菜单内容 -->
  </OriLayout.Sider>
  <OriLayout>
    <OriLayout.Header>Header</OriLayout.Header>
    <OriLayout.Content>Content</OriLayout.Content>
  </OriLayout>
</OriLayout>

<!-- 自定义 trigger -->
<OriLayout.Sider v-model:collapsed="collapsed" collapsible trigger="自定义">
  <!-- trigger 内容 -->
</OriLayout.Sider>

<!-- 隐藏 trigger -->
<OriLayout.Sider v-model:collapsed="collapsed" collapsible :trigger="null">
  <!-- 无 trigger，通过外部按钮控制 -->
</OriLayout.Sider>

<!-- Sider 在右侧时翻转箭头 -->
<OriLayout.Sider v-model:collapsed="collapsed" collapsible reverse-arrow>
  <!-- 右侧侧边栏 -->
</OriLayout.Sider>
```

### 常见错误

```vue
<!-- 错误：未设置 hasSider 导致布局异常 -->
<OriLayout>
  <OriLayout.Sider>Sider</OriLayout.Sider>
  <OriLayout.Content>Content</OriLayout.Content>
</OriLayout>
<!-- 当 Layout 包含 Sider 时，应设置 hasSider -->

<!-- 错误：width 传了字符串 -->
<OriLayout.Sider width="256px">
  <!-- width 类型为 number，应传 :width="256" -->
</OriLayout.Sider>

<!-- 错误：collapsedWidth 写成 collapsed-width 字符串 -->
<OriLayout.Sider collapsed-width="80">
  <!-- 应传数字 :collapsed-width="80" -->
</OriLayout.Sider>
```

## 与其他组件库的差异

| 差异点 | origami-vue | ant-design-vue | element-plus |
| --- | --- | --- | --- |
| Sider 默认宽度 | `256` | `200` | `300` |
| Sider 折叠宽度 | `80` | `80` | `64` |
| v-model 绑定 | `v-model:collapsed` | `v-model:collapsed` | 不支持 v-model |
| 隐藏 trigger | `:trigger="null"` | `:trigger="null"` | 不支持 |
| 翻转箭头 | `reverseArrow` | `reverseArrow` | 不支持 |
| hasSider | `hasSider` prop | 自动检测 | 不支持 |
