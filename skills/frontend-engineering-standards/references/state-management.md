# 状态管理规范

## Pinia Store 组织结构

```
stores/
├── modules/
│   ├── user.ts    # 用户状态
│   ├── auth.ts    # 认证状态
│   ├── app.ts     # 应用状态
├── index.ts       # Store 导出
└── types.ts       # Store 类型定义
```

### Store 组织原则

- 每个 Store 管理特定领域，职责单一
- Store 命名与业务模块对应
- 避免 Store 间的循环依赖
- State 保持扁平结构

## State 定义规范

必须为 State 定义类型：

```typescript
interface UserState {
  userInfo: User | null
  token: string
  loading: boolean
}

state: (): UserState => ({
  userInfo: null,
  token: '',
  loading: false,
})
```

### State 修改方式

- 直接修改：`userStore.userInfo = newUser`
- $patch 批量更新：`userStore.$patch({ userInfo, token })`
- $reset 重置：`userStore.$reset()`

## Getter 定义规范

- Getter 自动推断类型
- 有缓存，依赖不变时不会重新计算
- 返回函数的 Getter 无缓存

```typescript
getters: {
  isLoggedIn: (state) => state.token !== '',
}
```

## Action 定义规范

- 同步 Action：直接修改 state
- 异步 Action：需要错误处理
- Action 可调用其他 Store

```typescript
actions: {
  increment() { this.count++ },
  async fetchUser(id: number) {
    this.loading = true
    try { this.userInfo = await userApi.getUser(id) }
    finally { this.loading = false }
  }
}
```

## 组合式 Store

### Setup Store 语法（推荐）

```typescript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, doubleCount, increment }
})
```

### Store 组合

组合多个 Store：

```typescript
export function useUserDashboard() {
  const userStore = useUserStore()
  const authStore = useAuthStore()
  const isLoading = computed(() => userStore.loading || authStore.loading)
  return { user: userStore, auth: authStore, isLoading }
}
```

## 持久化策略

使用 pinia-plugin-persistedstate：

```typescript
persist: {
  key: 'user-store',
  storage: localStorage,
  paths: ['token', 'preferences'],
}
```

## Store 使用规范

### 在组件中使用

```typescript
const userStore = useUserStore()
const userInfo = userStore.userInfo
await userStore.login({ username, password })
```

### 解构 Store

- 使用 storeToRefs 保持响应式：`const { userInfo } = storeToRefs(userStore)`
- Actions 可直接解构：`const { login } = userStore`

### 在组合式函数中使用

```typescript
export function useAuth() {
  const userStore = useUserStore()
  const isAuthenticated = computed(() => userStore.isLoggedIn)
  return { isAuthenticated }
}
```