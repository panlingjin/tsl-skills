---
title: 栅格 (Grid)
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, navigation]
---

# 栅格 (Grid)

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 需要进行页面区域等分或比例布局时
- 需要响应式布局时，通过设置不同断点的 span 值实现

## API 参考

### Row Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| align | flex 布局下的垂直对齐方式 | `'top' \| 'middle' \| 'bottom'` | `'top'` |
| gutter | 栅格间隔，可以写成像素值或支持响应式的对象写法 `{ xs: 8, sm: 16, md: 24 }`。或者使用数组形式同时设置 `[水平间距, 垂直间距]` | `number \| object \| array` | `0` |
| justify | flex 布局下的水平排列方式 | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between'` | `'start'` |
| wrap | 是否自动换行 | `boolean` | `false` |

### Col Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| flex | flex 布局填充 | `string \| number` | `-` |
| offset | 栅格左侧的间隔格数，间隔内不可以有栅格 | `number` | `0` |
| order | 栅格顺序，flex 布局模式下有效 | `number` | `0` |
| pull | 栅格向左移动格数 | `number` | `0` |
| push | 栅格向右移动格数 | `number` | `0` |
| span | 栅格占位格数，为 0 时相当于 `display: none` | `number` | `-` |
| xs | `<576px` 响应式栅格，可为栅格数或一个包含其他属性的对象 | `number \| object` | `-` |
| sm | `≥576px` 响应式栅格，可为栅格数或一个包含其他属性的对象 | `number \| object` | `-` |
| md | `≥768px` 响应式栅格，可为栅格数或一个包含其他属性的对象 | `number \| object` | `-` |
| lg | `≥992px` 响应式栅格，可为栅格数或一个包含其他属性的对象 | `number \| object` | `-` |
| xl | `≥1200px` 响应式栅格，可为栅格数或一个包含其他属性的对象 | `number \| object` | `-` |
| xxl | `≥1440px` 响应式栅格，可为栅格数或一个包含其他属性的对象 | `number \| object` | `-` |

## 导入方式

Grid 没有父组件包装，Row 和 Col 是独立导出的：

```typescript
import { Row as OriRow, Col as OriCol } from 'origami-vue'
```

```vue
<OriRow>
  <OriCol :span="12">Left</OriCol>
  <OriCol :span="12">Right</OriCol>
</OriRow>
```

## 使用示例

### 正确用法

```vue
<!-- 基础栅格 -->
<OriRow>
  <OriCol :span="12">左半边</OriCol>
  <OriCol :span="12">右半边</OriCol>
</OriRow>

<!-- 带间隔 -->
<OriRow :gutter="16">
  <OriCol :span="8">col-8</OriCol>
  <OriCol :span="8">col-8</OriCol>
  <OriCol :span="8">col-8</OriCol>
</OriRow>

<!-- 响应式间隔 -->
<OriRow :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
  <OriCol :span="6">col-6</OriCol>
  <OriCol :span="6">col-6</OriCol>
  <OriCol :span="6">col-6</OriCol>
  <OriCol :span="6">col-6</OriCol>
</OriRow>

<!-- 水平排列方式 -->
<OriRow justify="center" align="middle">
  <OriCol :span="6">col-6</OriCol>
  <OriCol :span="6">col-6</OriCol>
</OriRow>

<!-- 允许换行 -->
<OriRow :wrap="true">
  <OriCol :span="16">col-16</OriCol>
  <OriCol :span="16">col-16</OriCol>
</OriRow>

<!-- 响应式布局 -->
<OriRow>
  <OriCol :xs="24" :sm="12" :md="8" :lg="6">响应式列</OriCol>
</OriRow>

<!-- 偏移 -->
<OriRow>
  <OriCol :span="8" :offset="8">偏移8格</OriCol>
</OriRow>
```

### 常见错误

```vue
<!-- 错误：justify 使用了 CSS 原始值 -->
<OriRow justify="flex-start">
  <!-- 应使用 start，不是 flex-start -->
</OriRow>

<!-- 错误：期望自动换行但未设置 wrap -->
<OriRow>
  <!-- wrap 默认为 false，超出 24 栅格不会自动换行 -->
  <OriCol :span="16">col-16</OriCol>
  <OriCol :span="16">col-16</OriCol>
</OriRow>

<!-- 错误：gutter 只写了数字但期望垂直间距 -->
<OriRow :gutter="16">
  <!-- 垂直间距需用数组形式：[16, 24] -->
</OriRow>
```

## 与其他组件库的差异

| 差异点 | origami-vue | ant-design-vue | element-plus |
| --- | --- | --- | --- |
| wrap 默认值 | `false` | `true` | `true` |
| justify 值 | `start` / `end` | `start` / `end` | `start` / `end` |
| 垂直间距 | 数组形式 `[水平, 垂直]` | 数组形式 `[水平, 垂直]` | 不支持 |
| 栅格系统 | 24 栅格 | 24 栅格 | 24 栅格 |
