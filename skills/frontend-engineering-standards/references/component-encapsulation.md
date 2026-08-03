# 公共组件封装规范

## 组件职责划分原则

### 单一职责原则

每个组件应该只负责一件事：
- 展示型组件：只负责 UI 展示
- 容器型组件：负责数据获取和状态管理
- 交互型组件：负责用户交互处理

### 组件拆分时机

当组件出现以下情况时应拆分：
- 代码超过 200 行
- 有多个独立的 UI 部分
- 需要在多处复用
- 过多的 props 传递

## Props/Emits 设计规范

### Props 定义

使用 JavaScript 运行时声明定义 Props：

```javascript
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
})
```

### Props 命名规范

- 布尔值使用 is/has 前缀：`isLoading`, `hasError`
- 数组使用复数：`userList`
- 对象使用 data/info：`userData`

### Emits 定义

显式声明组件可能触发的事件：

```javascript
const emit = defineEmits(['update', 'change', 'update:modelValue'])
```

### Emits 命名规范

使用动词命名：`click`, `change`, `submit`, `close`

## 插槽使用规范

### 默认插槽

```vue
<button class="base-button">
  <slot>默认文本</slot>
</button>
```

### 具名插槽

```vue
<div class="card">
  <slot name="header"></slot>
  <slot></slot>
  <slot name="footer"></slot>
</div>
```

### 作用域插槽

```vue
<slot :user="user" :index="index"></slot>
```

## 组件通信方式选择

### 父子通信

| 方式 | 适用场景 | 示例 |
|------|---------|------|
| Props | 父传子 | `<UserCard :user="user" />` |
| Emits | 子传父 | `@click="handleClick"` |
| v-model | 双向绑定 | `<Input v-model="value" />` |
| 插槽 | 内容分发 | `<template #header>` |

### 跨层级通信

| 方式 | 适用场景 | 说明 |
|------|---------|------|
| provide/inject | 深层嵌套 | 避免 props drilling |
| Pinia | 全局状态 | 跨组件共享状态 |

### provide/inject 使用

使用 Symbol 作为 key：

```javascript
export const ThemeKey = Symbol('theme')
provide(ThemeKey, theme)
const theme = inject(ThemeKey)
```

## 组件命名规范

- 使用 PascalCase：`UserCard.vue`
- 多词组件名：`UserCard.vue`（不是 `User.vue`）
- 描述性命名：`UserAvatar.vue`

## Props 默认值规范

数组/对象使用函数：

```javascript
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
})
```

## 避免 Props Drilling

使用 provide/inject 替代层层传递：

```javascript
provide('user', user)
const user = inject('user')
```

## 组件懒加载

路由级或条件懒加载：

```javascript
const UserList = defineAsyncComponent(() => import('@/components/UserList.vue'))
```
