---
title: 抽屉 Drawer
impact: MEDIUM
impactDescription: 使用错误 API 会导致组件功能异常
type: component
tags: [origami-vue, modal]
---

# 抽屉 Drawer

**Impact: MEDIUM** - 使用错误 API（如误用 `open`/`visible` 属性名、遗漏 `onBeforeOk` 异步关闭模式）会导致抽屉行为异常

## 何时使用

- 当需要一个附加的面板来承载复杂表单或信息展示时
- 需要从侧边滑出的交互面板
- 需要异步关闭确认的场景

## API 参考

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible (v-model) | Drawer 是否可见 | _boolean_ | `false` |
| title | 标题 | _string_ | - |
| placement | 抽屉的方向 | _'top' \| 'right' \| 'bottom' \| 'left'_ | `'right'` |
| closable | 是否展示关闭按钮 | _boolean_ | `true` |
| footer | 是否展示底部内容 | _boolean_ | `true` |
| mask | 是否显示遮罩层 | _boolean_ | `true` |
| maskClosable | 点击遮罩层是否可以关闭 | _boolean_ | `true` |
| width | 宽度（placement 为 left/right 时生效） | _number_ | `378` |
| height | 高度（placement 为 top/bottom 时生效） | _number_ | `378` |
| okText | 确认按钮的内容 | _string_ | `'确认'` |
| cancelText | 取消按钮的内容 | _string_ | `'取消'` |
| okLoading | 确认按钮是否为加载中状态 | _boolean_ | `false` |
| okButtonProps | 确认按钮的 Props | _object_ | - |
| cancelButtonProps | 取消按钮的 Props | _object_ | - |
| onBeforeOk | 触发 ok 事件前的回调函数。返回 `false` 则不关闭，也可使用 `done` 进行异步关闭 | _(done: (closed: boolean) => void) => void \| boolean_ | - |
| onBeforeCancel | 触发 cancel 事件前的回调函数。返回 `false` 则不关闭 | _() => boolean_ | - |
| size | 预设尺寸，支持 `small`(448px)、`medium`(684px)、`large`(920px)，仅在 placement 为 left/right 时生效。设置 size 后 width 不生效 | _'small' \| 'medium' \| 'large'_ | - |
| popupContainer | 弹出框的挂载容器 | _string_ | `'body'` |
| zIndex | 设置 Drawer 的 z-index | _number_ | `2000` |

### Events

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| ok | 点击确定按钮时的回调 | - |
| close | 点击遮罩层或左上角叉或取消按钮的回调 | - |
| enter | 抽屉打开后（动画结束）触发 | - |
| leave | 抽屉关闭后（动画结束）触发 | - |

### Slots

| 插槽名 | 描述 | 参数 |
| --- | --- | --- |
| title | 自定义标题 | - |
| footer | 自定义页脚 | - |

## 使用示例

### 正确用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Drawer as OriDrawer, Button as OriButton } from 'origami-vue'

const visible = ref(false)

// 基本使用
const openDrawer = () => {
  visible.value = true
}
</script>

<template>
  <!-- 基础抽屉 -->
  <OriButton @click="visible = true">打开抽屉</OriButton>
  <OriDrawer v-model:visible="visible" title="基础抽屉" @ok="handleOk" @close="visible = false">
    <p>抽屉内容</p>
  </OriDrawer>

  <!-- 预设尺寸 -->
  <OriDrawer v-model:visible="visible" title="中等抽屉" size="medium">
    <p>宽度 684px</p>
  </OriDrawer>

  <!-- 异步关闭 -->
  <OriDrawer
    v-model:visible="visible"
    title="异步关闭"
    :on-before-ok="handleBeforeOk"
  >
    <p>提交前会进行异步验证</p>
  </OriDrawer>

  <!-- 自定义位置 -->
  <OriDrawer v-model:visible="visible" title="左侧抽屉" placement="left" :width="400">
    <p>从左侧滑出</p>
  </OriDrawer>

  <!-- 自定义页脚 -->
  <OriDrawer v-model:visible="visible" title="自定义页脚">
    <template #footer>
      <div class="flex justify-end gap-2">
        <OriButton @click="visible = false">取消</OriButton>
        <OriButton type="primary" @click="handleSave">保存</OriButton>
      </div>
    </template>
  </OriDrawer>
</template>
```

### 异步关闭示例

```typescript
// 方式一：返回 false 阻止关闭
const handleBeforeOk = () => {
  // 验证失败时阻止关闭
  if (!formValid.value) {
    return false
  }
  // 返回非 false 值则正常关闭
}

// 方式二：使用 done 回调实现异步关闭
const handleBeforeOk = (done: (closed: boolean) => void) => {
  submitForm().then(() => {
    done(true) // 关闭抽屉
  }).catch(() => {
    done(false) // 不关闭抽屉
  })
}
```

### 常见错误

```vue
<!-- ❌ 错误：使用了 ant-design-vue 的 open 属性名 -->
<OriDrawer :open="visible">

<!-- ✅ 正确：使用 visible -->
<OriDrawer v-model:visible="visible">

<!-- ❌ 错误：使用了 element-plus 的 model-value / before-close -->
<OriDrawer :model-value="visible" :before-close="handleClose">

<!-- ❌ 错误：同时设置 size 和 width，width 不生效 -->
<OriDrawer size="medium" :width="900">

<!-- ❌ 错误：在 onBeforeOk 中直接关闭，导致异步逻辑失效 -->
<OriDrawer :on-before-ok="() => { visible = false; return true }">
```

## 与其他组件库的差异

| 差异点 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| 显示控制 | `visible` (v-model) | `open` (v-model) | `model-value` (v-model) |
| 内置按钮 | 默认有确认/取消按钮 | 默认无按钮 | 默认无按钮 |
| 确认按钮加载 | `okLoading` | `confirmLoading` | 无 |
| 按钮属性 | `okButtonProps` / `cancelButtonProps` | `okButtonProps` / `cancelButtonProps` | 无 |
| 异步关闭 | `onBeforeOk` (done 回调) | 无原生支持 | `before-close` |
| 预设尺寸 | `size` (small/medium/large) | `width` | `size` (不同值) |
| 动画事件 | `enter` / `leave` | `afterOpenChange` | `opened` / `closed` |
| 位置属性 | `placement` | `placement` | `direction` |
