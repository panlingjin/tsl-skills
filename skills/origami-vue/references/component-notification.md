---
title: 通知提示 Notification
impact: MEDIUM
impactDescription: 使用错误 API 会导致组件功能异常
type: component
tags: [origami-vue, feedback]
---

# 通知提示 Notification

**Impact: MEDIUM** - 使用错误 API（如误用 `message`/`description` 代替 `title`/`content`）会导致通知内容无法正确显示

## 何时使用

- 较为复杂的通知内容
- 带有交互的通知，给出用户下一步的行动点
- 系统主动推送

## API 参考

### Notification 配置项 (Config)

通过 `OriNotification.info(config)`、`OriNotification.success(config)` 等方法调用时传入的配置对象：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 提示标题 | _string \| VNode_ | - |
| content | 提示内容 | _string \| VNode_ | - |
| footer | 自定义操作按钮 | _VNode_ | - |
| icon | 自定义图标 | _VNode_ | - |
| showIcon | 是否显示图标 | _boolean_ | `true` |
| closable | 是否显示关闭按钮 | _boolean_ | `true` |
| duration | 自动关闭的延时，单位为毫秒，`null` 时不自动关闭 | _number_ | `3000` |
| position | 消息的位置 | _'topLeft' \| 'topRight' \| 'bottomLeft' \| 'bottomRight'_ | `'topRight'` |
| id | 通知唯一标识，用于更新已存在的通知 | _string_ | - |
| style | 自定义内联样式 | _CSSProperties_ | - |
| className | 自定义 CSS 类名 | _string_ | - |
| onClose | 关闭时触发的回调函数 | _function_ | - |

### Notification 静态方法

| 方法 | 说明 |
| --- | --- |
| `OriNotification.info(config)` | 信息通知 |
| `OriNotification.success(config)` | 成功通知 |
| `OriNotification.warning(config)` | 警告通知 |
| `OriNotification.error(config)` | 错误通知 |
| `OriNotification.clear()` | 清除所有通知 |
| `OriNotification.remove(id)` | 根据 id 移除指定通知 |

## 使用示例

### 正确用法

```typescript
import { Notification as OriNotification } from 'origami-vue'

// 基本使用
OriNotification.info({
  title: '通知标题',
  content: '通知内容描述',
})

// 不同类型
OriNotification.success({ title: '成功', content: '操作已完成' })
OriNotification.warning({ title: '警告', content: '请注意风险' })
OriNotification.error({ title: '错误', content: '操作失败' })

// 自定义位置
OriNotification.info({
  title: '左上角通知',
  content: '内容',
  position: 'topLeft',
})

// 自定义操作按钮（footer）
OriNotification.info({
  title: '确认操作',
  content: '是否继续执行？',
  footer: h('div', [
    h(OriButton, { size: 'small', onClick: () => handleConfirm() }, () => '确认'),
    h(OriButton, { size: 'small', onClick: () => OriNotification.clear() }, () => '取消'),
  ]),
})

// 更新已有通知（通过 id）
OriNotification.info({
  id: 'unique-id',
  title: '处理中',
  content: '正在处理您的请求...',
})
// 后续更新
OriNotification.success({
  id: 'unique-id',
  title: '已完成',
  content: '请求处理成功',
})

// 不自动关闭
OriNotification.info({
  title: '持久通知',
  content: '此通知不会自动关闭',
  duration: null,
})

// 清除所有通知
OriNotification.clear()

// 移除指定通知
OriNotification.remove('unique-id')
```

### 常见错误

```typescript
// ❌ 错误：使用了 ant-design-vue 的 message/description 字段名
OriNotification.info({
  message: '标题',      // 应使用 title
  description: '内容',  // 应使用 content
})

// ❌ 错误：使用了 ant-design-vue 的 placement 字段名
OriNotification.info({
  placement: 'topRight',  // 应使用 position
})

// ❌ 错误：使用了 ElNotification 的 type 字段
OriNotification.info({
  type: 'success',  // 不需要 type，直接使用 OriNotification.success()
})

// ❌ 错误：更新通知时未指定 id
OriNotification.info({ title: '新通知' })  // 每次调用都会创建新通知
```

## 与其他组件库的差异

| 差异点 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| 标题字段 | `title` | `message` | `title` |
| 内容字段 | `content` | `description` | `message` |
| 位置字段 | `position` | `placement` | `position` |
| 位置值 | `topLeft`/`topRight`/`bottomLeft`/`bottomRight` | `topLeft`/`topRight`/`bottomLeft`/`bottomRight` | `top-right`/`top-left`/`bottom-right`/`bottom-left` |
| 自定义操作 | `footer` (VNode) | `btn` | 无原生支持 |
| 更新通知 | `id` 字段 | `key` 字段 | 无原生支持 |
| 清除方法 | `.clear()` / `.remove(id)` | `.close()` / `.destroy()` | `.close()` |
| 类型方法 | `.info()` / `.success()` / `.warning()` / `.error()` | 同左 | 同左（但通过 `type` 字段） |
