# MVVM 规范

## Vue 响应式系统概述

Vue 3 采用响应式系统实现 MVVM 模式，通过 ref、reactive、computed、watch 等 API 实现数据绑定。

## ref 与 reactive 使用场景

### ref 使用场景

- 基础类型值（string、number、boolean）
- 单个独立值
- 需要重新赋值的场景

```typescript
const count = ref(0)
const message = ref('Hello')
const user = ref<User | null>(null)
user.value = await fetchUser()
```

### reactive 使用场景

- 对象类型（多个相关属性）
- 不需要重新赋值整个对象
- 复杂的数据结构

```typescript
const user = reactive({
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
})
```

### 选择原则

| 类型 | 推荐 API | 原因 |
|-----|---------|------|
| 基础类型 | ref | 简单直接，类型安全 |
| 对象（不重新赋值） | reactive | 更自然，无需 `.value` |
| 对象（需要重新赋值） | ref | 支持重新赋值 |
| 数组（整体替换） | ref | 方便重新赋值 |
| 数组（增删元素） | reactive 或 ref | 都支持 |

## computed 使用规范

### computed 特性

- 有缓存，依赖不变时不会重新计算
- 自动追踪依赖
- 默认只读，可写 computed 需谨慎使用

### 基本用法

```typescript
const firstName = ref('Alice')
const lastName = ref('Smith')

// 计算属性
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
```

### 使用原则

- computed 应为纯函数，避免执行副作用
- 避免昂贵计算，必要时简化计算逻辑
- 派生数据优先使用 computed

## watch 使用规范

### watch 基本用法

```typescript
const count = ref(0)

// 监听 ref
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})

// 监听 reactive 对象属性
watch(() => user.age, (newValue, oldValue) => {
  console.log(`Age changed from ${oldValue} to ${newValue}`)
})
```

### watch 选项

- **immediate**: 立即执行一次
- **deep**: 深度监听对象变化（注意性能影响）
- **flush**: 延迟执行到 DOM 更新后

```typescript
watch(userId, (id) => {
  fetchUser(id)
}, { immediate: true })
```

### watchEffect

自动追踪所有响应式依赖：

```typescript
const count = ref(0)
const multiplier = ref(2)

watchEffect(() => {
  console.log(`Result: ${count.value * multiplier.value}`)
})
```

### watch 与 watchEffect 对比

| 特性 | watch | watchEffect |
|-----|--------|------------|
| 依赖指定 | 手动指定 | 自动追踪 |
| 获取旧值 | ✓ | ✗ |
| 精确控制 | ✓ | ✗ |
| 适用场景 | 需要旧值对比 | 自动追踪依赖 |

## 响应式数据设计原则

### 1. 保持状态最小化

只存储必要状态，派生数据使用 computed：

```typescript
const items = ref<Item[]>([])
const itemCount = computed(() => items.value.length)
const hasItems = computed(() => items.value.length > 0)
```

### 2. 派生数据用 computed

使用 computed 派生数据，避免冗余状态：

```typescript
const products = ref<Product[]>([])
const activeProducts = computed(() => products.value.filter(p => p.active))
const totalPrice = computed(() => products.value.reduce((sum, p) => sum + p.price, 0))
```

### 3. 避免响应式丢失

避免解构 reactive 对象失去响应式：

```typescript
// ✓ 使用 toRefs 保持响应式
const user = reactive({ name: 'Alice', age: 30 })
const { name, age } = toRefs(user)

// ✓ 直接使用 reactive 对象
console.log(user.name)
```

### 4. 避免不必要的 watch

优先使用 computed 而非 watch：

```typescript
// ✓ 使用 computed
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
```

### 5. 响应式命名规范

```typescript
// ✓ 响应式变量不加特殊前缀
const count = ref(0)
const user = reactive({ name: 'Alice' })
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
```

### 6. 类型标注

```typescript
const count = ref<number>(0)
const user = ref<User | null>(null)
const fullName = computed<string>(() => `${firstName.value} ${lastName.value}`)
```

### 7. 性能优化

对于大型对象，使用 shallowRef/shallowReactive 减少响应式开销：

```typescript
const largeData = shallowRef<LargeObject>({ nested: { deep: { data: 'value' } } })
largeData.value = newData  // 响应式
largeData.value.nested.deep.data = 'new'  // 不响应式
```