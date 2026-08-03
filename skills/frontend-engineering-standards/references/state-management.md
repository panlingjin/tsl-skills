# 状态管理规范

## Pinia Store 组织结构

```
stores/
├── modules/
│   ├── user.js    # 用户状态
│   ├── auth.js    # 认证状态
│   ├── app.js     # 应用状态
├── index.js       # Store 导出
```

### Store 组织原则

- 每个 Store 管理特定领域，职责单一
- Store 命名与业务模块对应
- 避免 Store 间的循环依赖
- State 保持扁平结构

## State 定义规范

使用返回对象的函数定义 State：

```javascript
state: () => ({
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

- Getter 直接从 state 派生数据
- 有缓存，依赖不变时不会重新计算
- 返回函数的 Getter 无缓存

```javascript
getters: {
  isLoggedIn: (state) => state.token !== '',
}
```

## Action 定义规范

- 同步 Action：直接修改 state
- 异步 Action：需要错误处理
- Action 可调用其他 Store

```javascript
actions: {
  increment() { this.count++ },
  async fetchUser(id) {
    this.loading = true
    try { this.userInfo = await userApi.getUser(id) }
    finally { this.loading = false }
  }
}
```

## 组合式 Store

### Setup Store 语法（推荐）

```javascript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, doubleCount, increment }
})
```

### Store 组合

组合多个 Store：

```javascript
export function useUserDashboard() {
  const userStore = useUserStore()
  const authStore = useAuthStore()
  const isLoading = computed(() => userStore.loading || authStore.loading)
  return { user: userStore, auth: authStore, isLoading }
}
```

## 持久化策略

使用 `pinia-plugin-persistedstate` 时只持久化非敏感的必要字段。不要持久化密码、会话标识或访问令牌。Setup Store 将配置放在 `defineStore` 的第三个参数中：

```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const preferences = ref({})
  return { preferences }
}, {
  persist: {
    key: 'user-preferences',
    storage: localStorage,
    pick: ['preferences'],
  },
})
```

## Store 使用规范

### 在组件中使用

```javascript
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
await userStore.login({ username, password })
```

### 解构 Store

- 使用 storeToRefs 保持响应式：`const { userInfo } = storeToRefs(userStore)`
- Actions 可直接解构：`const { login } = userStore`

### 在组合式函数中使用

```javascript
export function useAuth() {
  const userStore = useUserStore()
  const isAuthenticated = computed(() => userStore.isLoggedIn)
  return { isAuthenticated }
}
```
