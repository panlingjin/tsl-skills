---
title: 开关 Switch
impact: MEDIUM
impactDescription: 使用错误 API 会导致组件功能异常
type: component
tags: [origami-vue, form]
---

# 开关 Switch

**Impact: MEDIUM** - 使用错误 API（如误用 `v-model:modelValue` 代替 `v-model:checked`）会导致开关状态无法正确绑定

## 何时使用

- 需要表示开关状态/两种状态之间的切换时

## API 参考

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked (v-model) | 指定当前是否选中 | _boolean_ | `false` |
| disabled | 是否禁用 | _boolean_ | `false` |
| loading | 是否处于加载状态 | _boolean_ | `false` |
| size | 尺寸 | _'default' \| 'small'_ | `'default'` |
| width | switch 的宽度 | _number_ | - |
| active-color | on 状态时的背景颜色 | _string_ | - |
| inactive-color | off 状态时的背景颜色 | _string_ | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 变化时回调函数 | _(checked: boolean, event: MouseEvent)_ |

### Slots

| 名称 | 说明 |
| --- | --- |
| loadingIcon | loading 状态时展示的图标 |

## 使用示例

### 正确用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Switch as OriSwitch } from 'origami-vue'

const enabled = ref(false)
const smallSwitch = ref(true)
const loading = ref(false)
</script>

<template>
  <!-- 基本使用 -->
  <OriSwitch v-model:checked="enabled" />

  <!-- 小尺寸 -->
  <OriSwitch v-model:checked="smallSwitch" size="small" />

  <!-- 自定义颜色 -->
  <OriSwitch
    v-model:checked="enabled"
    active-color="#0bb837"
    inactive-color="#e5e6eb"
  />

  <!-- 加载状态 -->
  <OriSwitch v-model:checked="loading" :loading="true" />

  <!-- 禁用 -->
  <OriSwitch :checked="true" disabled />

  <!-- 自定义宽度 -->
  <OriSwitch v-model:checked="enabled" :width="60" />

  <!-- 监听变化 -->
  <OriSwitch v-model:checked="enabled" @change="handleSwitchChange" />
</template>
```

### 阻止切换示例

```typescript
// 在 change 事件中通过逻辑阻止切换
const handleSwitchChange = (checked: boolean) => {
  // 某些条件下阻止切换
  if (someCondition) {
    nextTick(() => {
      enabled.value = !checked // 恢复原值
    })
    return
  }
}
```

### 常见错误

```vue
<!-- ❌ 错误：使用了 v-model:modelValue -->
<OriSwitch v-model:modelValue="enabled" />

<!-- ✅ 正确：使用 v-model:checked -->
<OriSwitch v-model:checked="enabled" />

<!-- ❌ 错误：使用了 element-plus 的 active-value/inactive-value -->
<OriSwitch :active-value="1" :inactive-value="0" />

<!-- ✅ 正确：origami-vue Switch 仅支持 boolean 值 -->
<OriSwitch v-model:checked="enabled" />

<!-- ❌ 错误：使用了 ant-design-vue 的 checkedChildren / unCheckedChildren -->
<OriSwitch checked-children="开" un-checked-children="关" />

<!-- ✅ 正确：origami-vue Switch 不支持内置文字，需自行扩展 -->

<!-- ❌ 错误：size 使用了不支持的值 -->
<OriSwitch size="large" />

<!-- ✅ 正确：size 仅支持 default 和 small -->
<OriSwitch size="small" />
```

## 与其他组件库的差异

| 差异点 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| v-model 绑定 | `checked` | `checked` | `model-value` |
| 值类型 | 仅 `boolean` | 仅 `boolean` | 支持 `active-value`/`inactive-value` 自定义值 |
| 自定义颜色 | `active-color` / `inactive-color` | 无（通过 CSS） | `active-color` / `inactive-color` |
| 加载状态 | `loading` prop | `loading` prop | 无原生支持 |
| 加载图标插槽 | `loadingIcon` | 无 | 无 |
| 内置文字 | 不支持 | `checkedChildren`/`unCheckedChildren` | `active-text`/`inactive-text` |
| 尺寸 | `default` / `small` | `default` / `small` | 无 size 属性 |
