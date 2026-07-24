---
title: 单选框 (Radio)
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, form]
---

# 单选框 (Radio)

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 用于在多个备选项中选中单个状态
- 和 Select 的区别是，Radio 所有选项默认可见，方便用户在比较中选择，因此选项不宜过多

## API 参考

### Radio Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked (v-model) | 指定当前是否选中 | `boolean` | `false` |
| disabled | 禁用 Radio | `boolean` | `false` |
| value | 根据 value 进行比较，判断是否选中 | `any` | `-` |
| type | 单选框类型 | `'default' \| 'button' \| 'card'` | `'default'` |

### Radio Slots

| 插槽名 | 说明 |
| --- | --- |
| tip | 单选卡片的辅助文本，同时需设置 `type="card"` |

### RadioGroup Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value (v-model) | 用于设置当前选中的值 | `any` | `-` |
| size | 单选框组尺寸，只对按钮样式生效 | `'large' \| 'default' \| 'small'` | `'default'` |
| disabled | 禁选所有子单选器 | `boolean` | `false` |
| optionType | 用于设置 Radio options 类型 | `'default' \| 'button'` | `'default'` |
| options | 以配置形式设置子元素 | `Array<{ label: string, value: string, disabled?: boolean }>` | `-` |

### RadioGroup Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 选项变化时的回调函数 | `value` |

## 子组件访问

Radio 的子组件通过大驼峰属性访问：
- `OriRadio.RadioGroup` — 单选按钮组
- `OriRadio.RadioButton` — 按钮样式单选

```vue
<OriRadio.RadioGroup v-model:value="value">
  <OriRadio value="a">选项A</OriRadio>
  <OriRadio.RadioButton value="b">选项B</OriRadio.RadioButton>
</OriRadio.RadioGroup>
```

## 使用示例

### 正确用法

```vue
<!-- 基础单选 -->
<OriRadio v-model:checked="checked" value="1">选项一</OriRadio>

<!-- RadioGroup 配置方式 -->
<OriRadio.RadioGroup v-model:value="selected" :options="radioOptions" />
<script setup lang="ts">
const radioOptions = [
  { label: '选项A', value: 'a' },
  { label: '选项B', value: 'b' },
  { label: '选项C', value: 'c', disabled: true },
]
</script>

<!-- 按钮样式的单选框组 -->
<OriRadio.RadioGroup v-model:value="selected" option-type="button" size="small">
  <OriRadio value="a">选项A</OriRadio>
  <OriRadio value="b">选项B</OriRadio>
</OriRadio.RadioGroup>

<!-- 卡片类型 + 辅助文本 -->
<OriRadio.RadioGroup v-model:value="selected">
  <OriRadio value="a" type="card">
    选项A
    <template #tip>这是选项A的辅助说明</template>
  </OriRadio>
  <OriRadio value="b" type="card">
    选项B
    <template #tip>这是选项B的辅助说明</template>
  </OriRadio>
</OriRadio.RadioGroup>
```

### 常见错误

```vue
<!-- 错误：RadioGroup 使用了不存在的 v-model 语法 -->
<OriRadio.RadioGroup v-model="selected">
  <!-- 应使用 v-model:value -->
</OriRadio.RadioGroup>

<!-- 错误：optionType 写成了 options-type -->
<OriRadio.RadioGroup v-model:value="selected" options-type="button">
  <!-- 应使用 option-type（kebab-case）或 optionType（camelCase） -->
</OriRadio.RadioGroup>

<!-- 错误：在非 card 类型下使用 tip 插槽 -->
<OriRadio value="a">
  选项A
  <template #tip>不会显示</template>
  <!-- tip 插槽仅在 type="card" 时生效 -->
</OriRadio>
```

## 与其他组件库的差异

| 差异点 | origami-vue | ant-design-vue | element-plus |
| --- | --- | --- | --- |
| 卡片类型 | `type="card"` 支持 | 不支持 | 不支持 |
| 辅助文本 | `tip` 插槽（配合 card） | 不支持 | 不支持 |
| RadioGroup v-model | `v-model:value` | `v-model:value` | `v-model` |
| 按钮样式 | `optionType="button"` | 使用 `a-radio-button` | 使用 `el-radio-button` |
| 配置式选项 | `options` prop | 不支持 | 不支持 |
