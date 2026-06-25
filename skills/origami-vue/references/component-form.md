---
title: 表单 Form
impact: HIGH
impactDescription: 使用错误 API 会导致表单校验、布局和重置功能失效
type: component
tags: [origami-vue, form]
---

# 表单 Form

**Impact: HIGH** - 使用错误 API 会导致表单校验、布局和重置功能失效

## 何时使用

- 用于创建一个实体或收集信息。
- 需要对输入的数据类型进行校验时。

## API 参考

### 子组件访问

FormItem 通过 `Form.item` 访问（小写 `item`），而非 `Form.Item`：

```typescript
import { Form as OriForm } from 'origami-vue'
// FormItem 挂载在 Form.item 上
const OriFormItem = OriForm.item
```

在模板中使用：

```vue
<OriForm :model="formData" :rules="rules">
  <OriForm.item label="用户名" prop="username">
    <OriInput v-model="formData.username" />
  </OriForm.item>
</OriForm>
```

### Form Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model | 表单数据对象 | _Record\<string, any\>_ | `-` |
| rules | 表单验证规则 | _FormRules_ | `-` |
| inline | 行内表单模式 | _boolean_ | `false` |
| label-position | 表单域标签的位置，当设置为 left 或 right 时，则也需要设置 label-width 属性 | _'left' \| 'right' \| 'top'_ | `right` |
| label-width | 标签的长度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。可以使用 auto。 | _string \| number_ | `-` |
| label-suffix | 表单域标签的后缀 | _string_ | `-` |
| hide-required-asterisk | 是否显示必填字段的标签旁边的红色星号 | _boolean_ | `false` |
| show-message | 是否显示校验错误信息 | _boolean_ | `true` |
| item-distance-size | form item 间距，small 小间距 | _string_ | `-` |
| inline-message | 是否以行内形式展示校验信息 | _boolean_ | `false` |
| status-icon | 行内表单模式 | _boolean_ | `false` |
| validate-on-rule-change | 是否在 rules 属性改变后立即触发一次验证 | _boolean_ | `true` |
| size | 用于控制该表单内组件的尺寸 | _'large' \| 'default' \| 'small'_ | `-` |
| itemSpace | 用于控制 Form Item 间距 | _string_ | `24` |

### Form Methods

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| validate | 对整个表单的内容进行验证。接收一个回调函数，或返回 Promise。 | _(callback?: (isValid: boolean, invalidFields?: ValidateFieldsError) => void) => Promise\<void\>_ |
| validateField | 验证具体的某个字段。 | _(props?: Arrayable\<FormItemProp\>, callback?: (isValid: boolean, invalidFields?: ValidateFieldsError) => void) => Promise\<void\>_ |
| resetFields | 重置该表单项，将其值重置为初始值，并移除校验结果 | _(props?: Arrayable\<FormItemProp\>) => void_ |
| scrollToField | 滚动到指定的字段 | _(prop: FormItemProp) => void_ |
| clearValidate | 清理某个字段的表单验证信息。 | _(props?: Arrayable\<FormItemProp\>) => void_ |

### Form Item Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| prop | model 的键名。它可以是一个路径数组(例如 ['a', 'b', 0])。在定义了 validate、resetFields 的方法时，该属性是必填的 | _string \| string[]_ | `-` |
| label | 标签文本 | _string_ | `-` |
| label-width | 标签宽度，例如 '50px'。可以使用 auto。 | _string \| number_ | `-` |
| required | 是否为必填项，如不设置，则会根据校验规则确认 | _boolean_ | `false` |
| rules | 表单验证规则，具体配置见下表，更多内容可以参考 async-validator | _FormItemRule \| FormItemRule[]_ | `-` |
| error | 表单域验证错误时的提示信息。设置该值会导致表单验证状态变为 error，并显示该错误信息。 | _string_ | `-` |
| show-message | 是否显示校验错误信息 | _boolean_ | `true` |
| inline-message | 是否在行内显示校验信息 | _boolean_ | `false` |
| size | 用于控制该表单域下组件的默认尺寸 | _'large' \| 'default' \| 'small'_ | `default` |

### Form Item Rules

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| trigger | 验证逻辑的触发方式 | _'blur' \| 'change'_ |

### Form Item Slots

| 插槽名 | 说明 | 插槽作用域 |
| --- | --- | --- |
| — | 表单的内容 | `-` |
| label | 标签位置显示的内容 | _{ label }_ |
| error | 验证错误信息的显示内容 | _{ error }_ |

### Form Item Methods

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| resetField | 对该表单项进行重置，将其值重置为初始值并移除校验结果 | _() => void_ |
| clearValidate | 移除该表单项的校验结果 | _() => void_ |

## 使用示例

### 正确用法

```vue
<template>
  <OriForm
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-position="right"
    label-width="80px"
    :item-space="'16'"
  >
    <OriForm.item label="用户名" prop="username">
      <ori-input v-model="formData.username" placeholder="请输入用户名" />
    </OriForm.item>
    <OriForm.item label="邮箱" prop="email">
      <ori-input v-model="formData.email" placeholder="请输入邮箱" />
    </OriForm.item>
    <OriForm.item>
      <ori-button primary @click="handleSubmit">提交</ori-button>
      <ori-button @click="handleReset">重置</ori-button>
    </OriForm.item>
  </OriForm>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'origami-vue'

const formRef = ref<FormInstance>()

const formData = reactive({
  username: '',
  email: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    // 校验通过，提交表单
  } catch {
    // 校验失败
  }
}

const handleReset = () => {
  formRef.value?.resetFields()
}
</script>
```

### 常见错误

```vue
<!-- ❌ 错误：使用 layout 属性控制标签位置（Ant Design Vue 写法） -->
<OriForm :model="formData" layout="horizontal">

<!-- ✅ 正确：使用 label-position 属性 -->
<OriForm :model="formData" label-position="right">

<!-- ❌ 错误：FormItem 不设置 prop，导致校验和重置不生效 -->
<OriForm.item label="用户名">
  <ori-input v-model="formData.username" />
</OriForm.item>

<!-- ✅ 正确：必须设置 prop 才能绑定校验和重置 -->
<OriForm.item label="用户名" prop="username">
  <ori-input v-model="formData.username" />
</OriForm.item>

<!-- ❌ 错误：手动清空数据代替 resetFields，不会清除校验状态 -->
formData.username = ''

<!-- ✅ 正确：使用 resetFields 重置为初始值并移除校验结果 -->
formRef.value?.resetFields()
```

## 与其他组件库的差异

### 与 Ant Design Vue 的差异

| 差异点 | Ant Design Vue | origami-vue |
|--------|---------------|-------------|
| 标签位置 | `layout="horizontal/vertical/inline"` | `label-position="left/right/top"` |
| 标签宽度 | `label-col` + `wrapper-col` | `label-width` (如 '80px') |
| 标签对齐 | `label-align` | `label-position` 包含对齐方向 |
| 表单间距 | 无直接属性 | `itemSpace` 和 `item-distance-size` |
| 表单尺寸 | `size="large/default/small"` | `size="large/default/small"` |
| 校验规则触发 | `rules` 中 `trigger` | 相同，支持 `blur/change` |
| 重置方法 | `resetFields()` | 相同 |
| 清除校验 | `clearValidate()` | 相同 |
| 行内表单 | `layout="inline"` | `inline` boolean prop |
| FormItem prop | `name` | `prop` |
