---
title: 结果页 Result
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, feedback]
---

# 结果页 Result

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 用于反馈一系列操作任务的处理结果，当有重要操作需告知用户处理结果，且反馈内容较为复杂时使用。

## API 参考

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 一级说明（title）文字 | `string` | - |
| subTitle | 二级说明（subTitle）文字 | `string` | - |
| status | 结果的状态，决定图标和颜色 | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` |

### Slots

| 名称 | 说明 |
| --- | --- |
| icon | 自定义 icon |
| title | 一级说明（title）文字 |
| subTitle | 二级说明（subTitle）文字 |
| status | 结果的状态，决定图标和颜色 |
| extra | 操作区 |
| default | 附属内容 |

## 使用示例

### 正确用法

```vue
<template>
  <!-- 基本状态 -->
  <OriResult status="info" title="信息提示" />

  <!-- 成功状态 -->
  <OriResult status="success" title="操作成功" subTitle="请稍后跳转至首页" />

  <!-- 警告状态 -->
  <OriResult status="warning" title="警告" subTitle="请注意相关事项" />

  <!-- 错误状态 + 操作区 -->
  <OriResult status="error" title="提交失败" subTitle="请检查表单数据后重试">
    <template #extra>
      <OriButton type="primary" size="small">返回修改</OriButton>
    </template>
  </OriResult>

  <!-- 自定义图标 -->
  <OriResult title="自定义" subTitle="自定义图标结果页">
    <template #icon>
      <CustomIcon />
    </template>
  </OriResult>

  <!-- 使用插槽自定义标题和副标题 -->
  <OriResult status="success">
    <template #title>自定义标题内容</template>
    <template #subTitle>自定义副标题内容</template>
  </OriResult>
</template>
```

### 常见错误

```vue
<template>
  <!-- 错误：使用 icon 属性传入图标（origami-vue 使用插槽而非属性） -->
  <OriResult icon="check-circle" title="成功" />
  <!-- 应使用 #icon 插槽 -->
  <OriResult title="成功">
    <template #icon><CheckCircleIcon /></template>
  </OriResult>

  <!-- 错误：status 使用了不存在的值 -->
  <OriResult status="loading" title="加载中" />
  <!-- 有效值仅为 info/success/warning/error -->

  <!-- 错误：使用 extra 属性（origami-vue 使用插槽） -->
  <OriResult extra="操作按钮" title="结果" />
  <!-- 应使用 #extra 插槽 -->
  <OriResult title="结果">
    <template #extra><OriButton>操作</OriButton></template>
  </OriResult>
</template>
```

## 与其他组件库的差异

| 特性 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| `status` 类型 | `'info' \| 'success' \| 'warning' \| 'error'` | `'success' \| 'error' \| 'info' \| 'warning' \| '404' \| '403' \| '500'` | `'success' \| 'warning' \| 'info' \| 'error'` |
| `icon` 自定义 | 插槽 | 属性（`icon` slot） | 属性 + 插槽 |
| `title` | prop + 插槽 | prop + 插槽 | prop + 插槽 |
| `subTitle` | prop + 插槽 | prop + 插槽 | prop + 插槽（`sub-title`） |
| `extra` | 仅插槽 | prop + 插槽 | 仅插槽 |
| HTTP 状态码 | 不支持 | 支持（404/403/500） | 不支持 |
