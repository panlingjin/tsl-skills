---
title: 对话框 Modal
impact: HIGH
impactDescription: 使用错误 API 会导致对话框无法正常显示、异步关闭失效或静态方法调用异常
type: component
tags: [origami-vue, modal]
---

# 对话框 Modal

**Impact: HIGH** - 使用错误 API 会导致对话框无法正常显示、异步关闭失效或静态方法调用异常

## 何时使用

- 需要用户处理事务，又不希望跳转页面以致打断工作流程时，可以使用 Modal 在当前页面正中打开一个浮层，承载相应的操作。
- 需要一个简洁的确认框询问用户时，可以使用 Modal.confirm() 等语法糖方法。

## API 参考

### Modal Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 是否可见 | _boolean_ | `false` |
| title | 标题 | _string \| slot_ | `-` |
| renderToBody | 是否挂载在 body | _boolean_ | `true` |
| closable | 是否显示右上角关闭 | _boolean_ | `true` |
| footer | 底部内容，当不需要默认底部按钮时，可以设为 :footer="null" | _null \| slot_ | `-` |
| okText | 确认按钮文字 | _string_ | `确认` |
| cancelText | 取消按钮文字 | _string_ | `取消` |
| size | 对话框尺寸，可取值：default/large/small | _string_ | `small` |
| mask | 是否显示蒙层 | _boolean_ | `true` |
| width | 自定义对话框宽度 | _string_ | `-` |
| height | 自定义对话框高度（不包含 header 和 footer） | _string_ | `-` |
| popupContainer | 对话框挂载节点 | _string_ | `body` |
| draggable | 对话框是否可拖拽 | _boolean_ | `false` |
| bodyStyle | 对话框 body 自定义样式 | _CSSProperties_ | `-` |
| cancelButtonProps | 取消按钮属性，同 ori-button | _object_ | `-` |
| okButtonProps | 确认按钮属性，同 ori-button | _object_ | `-` |
| centered | 是否居中显示 | _boolean_ | `false` |
| confirmLoading | 是否异步加载 | _boolean_ | `false` |
| modalClass | 对话框 class | _string_ | `-` |
| maskClosable | 是否点击蒙层关闭 | _boolean_ | `true` |
| maskStyle | 蒙层自定义样式 | _object_ | `-` |
| zIndex | 层级 | _number_ | `1400` |
| content | 对话框内容 | _string \| slot_ | `-` |
| simple | 是否简洁模式 | _boolean_ | `false` |
| hideCancel | 是否隐藏取消按钮 | _boolean_ | `false` |
| onBeforeOk | 关闭前回调 | _Function_ | `-` |
| onBeforeCancel | 取消前回调 | _Function_ | `-` |

### 通知提示 Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| icon | 通知提示图标，不需要展示图标设置 :icon="null" | _VNode \| () => VNode_ | `-` |
| messageType | 通知类型，可取值：info/success/error/warning/confirm | _string_ | `-` |
| simple | 是否简洁模式 | _boolean_ | `true` |
| content | 对话框内容 | _string \| VNode \| function(h)_ | `-` |
| onOk | 通知提示确认方法 | _Function_ | `-` |
| onCancel | 通知提示取消方法 | _Function_ | `-` |
| onClose | 通知提示关闭方法 | _Function_ | `-` |

### Modal Slots

| 名称 | 说明 |
| --- | --- |
| title | 标题 |
| footer | 底部内容 |
| content | 对话框内容 |
| closeIcon | 关闭按钮 |

### Modal Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| cancel | 取消按钮的回调 | void |
| ok | 点击确定回调 | void |
| close | 点击遮罩层或右上角叉 | void |

### Modal Methods（静态方法）

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| confirm | confirm 对话框 | _(config: ModalConfig)_ |
| info | 信息提示 | _(config: ModalConfig)_ |
| success | 成功提示 | _(config: ModalConfig)_ |
| error | 错误提示 | _(config: ModalConfig)_ |
| warning | 警告提示 | _(config: ModalConfig)_ |
| destroyAll | 销毁全部实例 | - |

### 通知提示 Methods

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| destroy | 关闭 | - |
| update | 更新 | _(config: ModalConfig)_ |

## 使用示例

### 正确用法

```vue
<template>
  <!-- 基础对话框 -->
  <ori-modal
    v-model:visible="visible"
    title="对话框标题"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <p>对话框内容</p>
  </ori-modal>

  <!-- 自定义尺寸 -->
  <ori-modal v-model:visible="visible" title="大对话框" size="large">
    <p>内容</p>
  </ori-modal>

  <!-- 居中显示 -->
  <ori-modal v-model:visible="visible" title="居中对话框" centered>
    <p>内容</p>
  </ori-modal>

  <!-- 无底部按钮 -->
  <ori-modal v-model:visible="visible" title="提示" :footer="null">
    <p>内容</p>
  </ori-modal>

  <!-- 异步关闭 -->
  <ori-modal
    v-model:visible="visible"
    title="异步关闭"
    :confirm-loading="loading"
    :on-before-ok="handleBeforeOk"
  >
    <p>点击确定后异步关闭</p>
  </ori-modal>

  <!-- 可拖拽对话框 -->
  <ori-modal v-model:visible="visible" title="可拖拽" draggable>
    <p>试着拖动 header 部分</p>
  </ori-modal>

  <!-- 自定义页脚 -->
  <ori-modal v-model:visible="visible" title="自定义页脚">
    <p>内容</p>
    <template #footer>
      <ori-button @click="visible = false">取消</ori-button>
      <ori-button primary @click="handleOk">确定</ori-button>
    </template>
  </ori-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Modal as OriModal } from 'origami-vue'

const visible = ref(false)
const loading = ref(false)

const handleOk = () => {
  visible.value = false
}

const handleCancel = () => {
  visible.value = false
}

const handleBeforeOk = async () => {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    visible.value = false
  } finally {
    loading.value = false
  }
}

// 静态方法
const showConfirm = () => {
  OriModal.confirm({
    title: '确认删除',
    content: '确定要删除该项吗？此操作不可恢复。',
    onOk: () => {
      // 确认操作
    },
    onCancel: () => {
      // 取消操作
    },
  })
}

const showInfo = () => {
  OriModal.info({
    title: '提示',
    content: '这是一条信息提示',
  })
}

// 手动更新和销毁
const showAndUpdate = () => {
  const instance = OriModal.info({
    title: '加载中',
    content: '请稍候...',
  })
  // 更新内容
  instance.update({ title: '完成', content: '操作已完成' })
  // 销毁
  // instance.destroy()
}

// 销毁所有实例
const destroyAll = () => {
  OriModal.destroyAll()
}
</script>
```

### 常见错误

```vue
<!-- ✅ 正确：使用 v-model:visible 双向绑定 -->
<ori-modal v-model:visible="visible" />

<!-- ⚠️ 替代写法：使用 :visible prop + @cancel/@close 事件手动控制 -->
<ori-modal :visible="visible" @cancel="visible = false" @ok="handleOk" />

<!-- ❌ 错误：使用 v-model（无修饰符，origami-vue 不支持） -->
<ori-modal v-model="visible" />

<!-- ❌ 错误：使用 v-model:open（Ant Design Vue 写法） -->
<ori-modal v-model:open="visible" />

<!-- ❌ 错误：使用 width 数字类型 -->
<ori-modal :width="520" />

<!-- ✅ 正确：width 使用字符串 -->
<ori-modal width="520px" />

<!-- ❌ 错误：size 使用 middle -->
<ori-modal size="middle" />

<!-- ✅ 正确：size 可选 default/large/small -->
<ori-modal size="default" />

<!-- ❌ 错误：异步关闭使用 afterClose 属性 -->
<ori-modal :after-close="handleAfterClose" />

<!-- ✅ 正确：使用 onBeforeOk 回调 -->
<ori-modal :on-before-ok="handleBeforeOk" :confirm-loading="loading" />

<!-- ❌ 错误：静态方法使用 waring（拼写错误） -->
OriModal.waring({ title: '警告' })

<!-- ✅ 正确：静态方法名是 warning -->
OriModal.warning({ title: '警告' })

<!-- ❌ 错误：隐藏底部使用 footer={false} -->
<ori-modal :footer="false" />

<!-- ✅ 正确：隐藏底部使用 :footer="null" -->
<ori-modal :footer="null" />
```

## 与其他组件库的差异

### 与 Ant Design Vue 的差异

| 差异点 | Ant Design Vue | origami-vue |
|--------|---------------|-------------|
| 显示控制 | `v-model:open` (v4) / `v-model:visible` (v3) | `v-model:visible` 双向绑定 |
| 对话框尺寸 | `width` 数字 | `size` 枚举 (default/large/small) + `width` 字符串 |
| 默认尺寸 | 无默认 | `small` |
| 异步关闭 | `confirmLoading` + `onOk` 返回 Promise | `confirmLoading` + `onBeforeOk` 回调 |
| 取消前回调 | 无 | `onBeforeCancel` |
| 隐藏底部 | `:footer="null"` | 相同 |
| 隐藏取消按钮 | 无直接属性 | `hideCancel` prop |
| 简洁模式 | 无 | `simple` prop |
| 可拖拽 | 无内置 | `draggable` prop |
| 挂载容器 | `getContainer` | `popupContainer` |
| 居中显示 | `centered` | 相同 |
| 确认对话框 | `Modal.confirm()` | 相同 |
| 信息提示 | `Modal.info/success/error/warning` | 相同 |
| 销毁全部 | `Modal.destroyAll()` | 相同 |
| 手动更新 | `instance.update()` | 相同 |
| 通知类型 | 无 messageType | `messageType` prop (info/success/error/warning/confirm) |
| 内容属性 | `content` 仅用于静态方法 | `content` prop + slot 均可用 |
