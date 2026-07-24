---
title: 气泡确认框 (Popconfirm)
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, modal]
---

# 气泡确认框 (Popconfirm)

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 点击某个元素弹出一个简单的气泡确认框
- 适用于轻量级的确认操作，不需要 Modal 那么重的交互

## API 参考

### Popconfirm Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | `string` | `-` |
| confirmButtonText | 确认按钮文字 | `string` | `-` |
| cancelButtonText | 取消按钮文字 | `string` | `-` |
| confirmButtonType | 确认按钮类型（v1.0.5+） | `string` | `'primary'` |
| cancelButtonType | 取消按钮类型（v1.0.5+） | `string` | `-` |
| icon-color | Icon 颜色 | `string` | `-` |
| hide-icon | 是否隐藏 Icon | `boolean` | `false` |
| teleported | 是否将 popover 的下拉列表插入至 body 元素 | `boolean` | `true` |
| minWidth | 气泡确认框的宽度 | `number` | `250` |

### Popconfirm Slots

| 插槽名 | 说明 |
| --- | --- |
| reference | 触发 Popconfirm 显示的 HTML 元素 |

### Popconfirm Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| confirm | 点击确认按钮时触发 | `-` |
| cancel | 点击取消按钮时触发 | `-` |

## 使用示例

### 正确用法

```vue
<!-- 基础用法 -->
<ori-popconfirm title="确定删除吗？" @confirm="handleConfirm" @cancel="handleCancel">
  <template #reference>
    <ori-button type="danger">删除</ori-button>
  </template>
</ori-popconfirm>

<!-- 自定义按钮文字 -->
<ori-popconfirm
  title="确定要提交吗？"
  confirm-button-text="确定提交"
  cancel-button-text="再想想"
  @confirm="handleSubmit"
>
  <template #reference>
    <ori-button type="primary">提交</ori-button>
  </template>
</ori-popconfirm>

<!-- 确认按钮使用 danger 类型 -->
<ori-popconfirm
  title="此操作不可恢复，确定删除？"
  confirm-button-type="danger"
  confirm-button-text="确认删除"
  @confirm="handleDelete"
>
  <template #reference>
    <ori-button type="danger">删除</ori-button>
  </template>
</ori-popconfirm>

<!-- 隐藏图标 -->
<ori-popconfirm title="确定操作吗？" hide-icon @confirm="handleConfirm">
  <template #reference>
    <span class="cursor-pointer">点击确认</span>
  </template>
</ori-popconfirm>

<!-- 自定义宽度 -->
<ori-popconfirm title="确定吗？" :min-width="300" @confirm="handleConfirm">
  <template #reference>
    <ori-button>操作</ori-button>
  </template>
</ori-popconfirm>
```

### 常见错误

```vue
<!-- 错误：使用了 ant-design-vue 的 okText/cancelText -->
<ori-popconfirm title="确定吗？" ok-text="确定" cancel-text="取消">
  <!-- 应使用 confirmButtonText / cancelButtonText -->
</ori-popconfirm>

<!-- 错误：使用了 element-plus 的 confirmButtonText 但类型写法不同 -->
<ori-popconfirm title="确定吗？" confirm-button-type="danger">
  <!-- 注意：confirmButtonType 控制按钮类型，不是 confirmButtonType="primary" 这种 ant 的写法 -->
</ori-popconfirm>

<!-- 错误：触发元素未使用 reference 插槽 -->
<ori-popconfirm title="确定吗？">
  <ori-button>删除</ori-button>
  <!-- 触发元素必须放在 #reference 插槽中 -->
</ori-popconfirm>
```

## 与其他组件库的差异

| 差异点 | origami-vue | ant-design-vue | element-plus |
| --- | --- | --- | --- |
| 确认按钮文字 | `confirmButtonText` | `okText` | `confirmButtonText` |
| 取消按钮文字 | `cancelButtonText` | `cancelText` | `cancelButtonText` |
| 确认按钮类型 | `confirmButtonType` | `okType` | 不支持 |
| 取消按钮类型 | `cancelButtonType` | 不支持 | 不支持 |
| 触发元素 | `reference` 插槽 | `default` 插槽 | `reference` 插槽 |
| 最小宽度 | `minWidth` (number) | 不支持 | `width` |
| 传送门 | `teleported` | `getPopupContainer` | `teleported` |
