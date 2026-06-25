---
title: 全局提示 Toast
impact: MEDIUM
impactDescription: 使用错误 API 会导致组件功能异常
type: component
tags: [origami-vue, feedback]
---

# 全局提示 Toast

**Impact: MEDIUM** - 使用错误 API（如误用 `message`/`description` 代替 `content`、混淆 Toast 与 Notification 的使用场景）会导致提示无法正确显示

## 何时使用

- 可提供成功、警告和错误等反馈信息
- 顶部居中显示并自动消失，是一种不打断用户操作的轻量级提示方式

> **Toast vs Notification**：Toast 用于轻量级的操作反馈（顶部居中，自动消失），Notification 用于较复杂的通知内容（角落弹出，可带交互按钮）。

## API 参考

### 函数式调用

```
OriToast(content, [duration], onClose)
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 提示内容 | _string \| VNode_ | - |
| duration | 自动关闭的延时，单位为毫秒，`0` 表示不自动关闭 | _number_ | `3000` |
| onClose | 关闭时触发的回调函数 | _function_ | - |

### 带图标的静态方法

```
OriToast.info(content, [duration], onClose)
OriToast.success(content, [duration], onClose)
OriToast.warn(content, [duration], onClose)
OriToast.error(content, [duration], onClose)
OriToast.loading(content, [duration], onClose)
```

参数与 `OriToast()` 相同。

### Config 对象调用

```
OriToast(config)
OriToast.success(config)
OriToast.warn(config)
OriToast.error(config)
OriToast.loading(config)
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 提示内容 | _string \| VNode_ | - |
| duration | 自动关闭的延时，单位为毫秒 | _number_ | `3000` |
| onClose | 关闭时触发的回调函数 | _function_ | - |
| showClose | 是否显示关闭按钮 | _boolean_ | `false` |
| maxCount | 最大显示数，超过限制时最早的消息会被自动关闭 | _number_ | - |

### 实例方法

| 方法 | 说明 | 参数 |
| --- | --- | --- |
| `OriToast.close(id, onClose)` | 根据 id 关闭指定 Toast 实例（v1.0.5+） | _id: string, onClose?: function_ |

## 使用示例

### 正确用法

```typescript
import { Toast as OriToast } from 'origami-vue'

// 基本使用
OriToast('操作成功')

// 带图标
OriToast.success('保存成功')
OriToast.error('操作失败')
OriToast.warn('请注意风险')
OriToast.info('提示信息')
OriToast.loading('加载中...')

// 自定义时长
OriToast.success('操作成功', 5000) // 5秒后关闭
OriToast.loading('加载中', 0)      // 不自动关闭

// 关闭回调
OriToast.success('操作成功', 3000, () => {
  console.log('提示已关闭')
})

// 使用 config 对象
OriToast({
  content: '自定义内容',
  duration: 5000,
  onClose: () => console.log('已关闭'),
})

// 显示关闭按钮
OriToast({
  content: '可手动关闭的提示',
  showClose: true,
})

// 限制最大显示数
OriToast({
  content: '最多显示3条',
  maxCount: 3,
})

// 自定义 VNode 内容
OriToast({
  content: h('div', [
    h('span', '操作成功，'),
    h('a', { onClick: () => handleView() }, '查看详情'),
  ]),
})

// 手动关闭指定 Toast（v1.0.5+）
const id = OriToast.loading('处理中...', 0)
// 异步操作完成后关闭
await doSomething()
OriToast.close(id)
```

### 常见错误

```typescript
// ❌ 错误：使用了 ant-design-vue 的 message 组件名
import { message as OriMessage } from 'some-other-lib'
OriMessage.success('成功')

// ✅ 正确：使用 OriToast
import { Toast as OriToast } from 'origami-vue'
OriToast.success('成功')

// ❌ 错误：使用了 Notification 的 title/content 结构
OriToast({ title: '标题', content: '内容' })

// ✅ 正确：Toast 使用 content 字段，无 title
OriToast({ content: '提示内容' })

// ❌ 错误：使用了 element-plus 的 ElMessage 方法名
OriToast({ message: '成功', type: 'success' })

// ✅ 正确：使用 OriToast.success() 方法
OriToast.success('成功')

// ❌ 错误：混淆 warn 和 warning
OriToast.warning('警告')

// ✅ 正确：使用 warn
OriToast.warn('警告')

// ❌ 错误：Toast 用于复杂通知场景（应使用 Notification）
OriToast({
  content: '非常长的通知内容，包含操作按钮...',
  duration: 0,
})

// ✅ 正确：复杂通知使用 Notification
Notification.info({
  title: '系统通知',
  content: '非常长的通知内容',
  footer: h(OriButton, { onClick: handleAction }, () => '查看详情'),
})
```

## 与其他组件库的差异

| 差异点 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| 组件名 | `OriToast` | `message` | `ElMessage` |
| 内容字段 | `content` | `content` | `message` |
| 警告方法 | `OriToast.warn()` | `message.warning()` | `ElMessage.warning()` |
| 加载方法 | `OriToast.loading()` | `message.loading()` | 无原生支持 |
| 关闭按钮 | `showClose` (config) | 无 | `showClose` |
| 最大数量 | `maxCount` | `maxCount` | 无 |
| 手动关闭 | `OriToast.close(id)` | 返回值 `.then()` | 返回 `close()` 方法 |
| VNode 内容 | `content: VNode` | `content: VNode` | 无原生支持 |
| 定位 | 顶部居中 | 顶部居中 | 顶部居中 |
| 与 Notification 区别 | OriToast 轻量反馈 / Notification 复杂通知 | 同左 | 同左 |
