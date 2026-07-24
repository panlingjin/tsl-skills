# 路由最佳实践规范

本文档定义前端项目的路由配置、路由守卫、动态路由等最佳实践。

---

## 路由配置规范

### 路由文件组织

**目录结构:**
```
src/router/
├── index.ts          # 路由入口
├── routes.ts         # 路由配置
└── guards.ts         # 路由守卫
```

### 路由配置结构

**基本配置:**
```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layouts/MainLayout.vue'),
    children: []
  }
]
```

### 路由元信息

**常用 meta 字段:**
- `title`: 页面标题
- `requiresAuth`: 是否需要认证
- `roles`: 允许的角色
- `permissions`: 允许的权限
- `keepAlive`: 是否缓存组件

---

## 路由懒加载

### 动态导入配置

**懒加载语法:**
```typescript
component: () => import('@/views/Home.vue')
```

**命名chunk:**
```typescript
component: () => import(
  /* webpackChunkName: "home" */ 
  '@/views/Home.vue'
)
```

### 路由分组

**按模块分组:**
```typescript
// vite.config.ts
manualChunks(id) {
  if (id.includes('/views/user/')) return 'user-module'
  if (id.includes('/views/product/')) return 'product-module'
}
```

---

## 路由守卫规范

### 全局前置守卫

**常见用途:**
- 权限验证
- 登录检查
- 页面访问控制
- 数据预加载

**配置示例:**
```typescript
router.beforeEach((to, from, next) => {
  // 权限检查
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')
    return
  }
  next()
})
```

### 全局后置守卫

**常见用途:**
- 页面标题设置
- 访问日志记录
- 进度条结束

---

## 动态路由

### 权限路由

**动态添加路由:**
```typescript
const dynamicRoutes = getRoutesByPermission(userPermissions)
dynamicRoutes.forEach(route => {
  router.addRoute('Layout', route)
})
```

**路由移除:**
```typescript
router.removeRoute(routeName)
```

### 嵌套路由

**多级路由配置:**
```typescript
{
  path: '/user',
  component: UserLayout,
  children: [
    {
      path: 'profile',
      component: UserProfile
    }
  ]
}
```

---

## 路由跳转规范

### 编程式导航

**路由跳转:**
```typescript
router.push('/home')
router.push({ name: 'Home' })
router.push({ path: '/user', query: { id: 1 } })
```

**路由替换:**
```typescript
router.replace('/login')
```

**路由返回:**
```typescript
router.back()
router.go(-1)
```

### 声明式导航

**RouterLink 使用:**
```vue
<RouterLink to="/home">首页</RouterLink>
<RouterLink :to="{ name: 'User' }">用户</RouterLink>
```

---

## 路由参数处理

### 路由参数类型

**params 参数:**
```typescript
// 路由配置
{ path: '/user/:id', component: User }

// 跳转
router.push({ name: 'User', params: { id: 1 } })

// 获取
const route = useRoute()
route.params.id
```

**query 参数:**
```typescript
// 跳转
router.push({ path: '/search', query: { keyword: 'test' } })

// 获取
route.query.keyword
```

### 参数验证

**路由参数验证:**
```typescript
{
  path: '/user/:id(\\d+)',  // 只匹配数字
  component: User
}
```

---

## 404 路由处理

### 捕获所有路由

**配置方式:**
```typescript
{
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/views/error/404.vue')
}
```

---

## 路由缓存

### KeepAlive 配置

**组件级缓存:**
```typescript
{
  path: '/list',
  component: List,
  meta: { keepAlive: true }
}
```

**视图级缓存:**
```vue
<RouterView v-slot="{ Component }">
  <KeepAlive>
    <component :is="Component" />
  </KeepAlive>
</RouterView>
```

---

## 路由最佳实践

### 核心原则

1. **懒加载**: 所有路由组件懒加载
2. **权限控制**: 路由级别权限验证
3. **命名路由**: 优先使用命名路由跳转
4. **元信息**: 完善路由元信息
5. **错误处理**: 捕获路由错误

### 性能优化

- 使用路由懒加载
- 合理分组打包
- 预加载关键路由
- 避免过深的路由嵌套

---

## 路由检查清单

### 配置检查

- [ ] 路由懒加载配置
- [ ] 路由元信息完整
- [ ] 权限路由正确配置
- [ ] 404 路由配置

### 功能检查

- [ ] 路由跳转正常
- [ ] 参数传递正确
- [ ] 路由守卫生效
- [ ] 动态路由正常