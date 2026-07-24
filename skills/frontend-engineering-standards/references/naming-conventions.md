# 文件命名规范

## Vue 组件命名

### 组件文件命名

**使用 PascalCase:**
- 所有 Vue 组件文件使用 PascalCase 命名
- 组件名应该是多词的(避免与 HTML 元素冲突)

**示例:**
```
components/
├── UserProfile.vue         ✓ 正确
├── OrderList.vue           ✓ 正确
├── NavigationBar.vue        ✓ 正确
├── user-profile.vue        ✗ 避免(kebab-case)
├── userProfile.vue          ✗ 避免(camelCase)
├── User.vue                 ✗ 避免(单词组件名)
```

### 组件文件夹命名

**组件文件夹使用 PascalCase:**
```
components/
├── UserCard/
│   ├── UserCard.vue        # 主组件
│   ├── UserCardAvatar.vue  # 子组件
│   └── index.ts            # 导出文件
```

### 基础组件命名

**使用特定前缀:**
- 基础组件使用 `Base`、`App` 或 `V` 前缀

```
components/
├── common/
│   ├── BaseButton.vue      ✓ 基础按钮组件
│   ├── BaseInput.vue       ✓ 基础输入组件
│   ├── BaseModal.vue       ✓ 基础模态框
```

## TypeScript/JavaScript 文件命名

### 组合式函数命名

**使用 `use` 前缀 + camelCase:**
```
composables/
├── useAuth.ts              ✓ 认证相关
├── useRequest.ts           ✓ 请求相关
├── useStorage.ts           ✓ 存储相关
├── useValidation.ts        ✓ 验证相关
```

### Store 文件命名

**使用功能名 + camelCase:**
```
stores/
├── modules/
│   ├── user.ts             ✓ 用户状态
│   ├── cart.ts             ✓ 购物车状态
│   ├── app.ts              ✓ 应用状态
```

### 工具函数命名

**使用功能描述 + camelCase:**
```
utils/
├── storage.ts              ✓ 存储工具
├── validate.ts             ✓ 验证工具
├── helpers.ts              ✓ 辅助函数
├── format.ts               ✓ 格式化工具
```

### 类型定义文件命名

**使用功能名 + camelCase 或 types.ts:**
```
types/
├── user.ts                 ✓ 用户类型
├── order.ts                ✓ 订单类型
├── api.ts                  ✓ API 类型
├── global.d.ts             ✓ 全局类型声明
```

### API 文件命名

**使用模块名 + camelCase:**
```
api/
├── modules/
│   ├── user.ts             ✓ 用户接口
│   ├── order.ts            ✓ 订单接口
│   ├── auth.ts             ✓ 认证接口
├── request.ts              ✓ 请求封装
```

## 样式文件命名

### 全局样式文件

**使用功能描述 + kebab-case:**
```
styles/
├── variables.scss          ✓ 变量定义
├── mixins.scss             ✓ 混入定义
├── global.scss             ✓ 全局样式
├── reset.scss              ✓ 重置样式
```

### 组件样式文件

**与组件文件同名:**
```
components/
├── UserCard/
│   ├── UserCard.vue        # 组件文件
│   ├── UserCard.scss       ✓ 组件样式(同名)
```

## 静态资源命名

### 图片命名

**使用描述性名称 + kebab-case:**
```
assets/
├── images/
│   ├── logo-primary.png          ✓ 主 Logo
│   ├── logo-secondary.png        ✓ 副 Logo
│   ├── icon-user.png             ✓ 用户图标
│   ├── background-hero.png       ✓ Hero 背景
```

### 字体文件命名

**使用字体名 + 格式:**
```
assets/
├── fonts/
│   ├── roboto-regular.woff2      ✓ Roboto 常规
│   ├── roboto-bold.woff2         ✓ Roboto 粗体
```

## 目录命名

### 功能模块目录

**使用功能名 + kebab-case:**
```
views/
├── user-profile/           ✓ 用户模块
├── order-list/             ✓ 订单模块
├── shopping-cart/          ✓ 购物车模块
├── UserProfile/            ✗ 避免(PascalCase)
```

### 组件目录

**使用组件名 + PascalCase:**
```
components/
├── UserCard/               ✓ 组件目录
├── OrderList/              ✓ 组件目录
├── user-card/              ✗ 避免(kebab-case)
```

## 测试文件命名

### 单元测试文件

**使用 `.spec.ts` 或 `.test.ts` 后缀:**
```
tests/
├── unit/
│   ├── user.spec.ts        ✓ 用户模块测试
│   ├── validation.spec.ts  ✓ 验证工具测试
```

### 组件测试文件

**使用 `.spec.ts` 后缀:**
```
tests/
├── components/
│   ├── UserCard.spec.ts    ✓ UserCard 组件测试
│   ├── OrderList.spec.ts   ✓ OrderList 组件测试
```

## 配置文件命名

### 环境配置文件

**使用 `.env` + 环境名:**
```
.env                        ✓ 通用环境变量
.env.development            ✓ 开发环境
.env.production             ✓ 生产环境
.env.staging                ✓ 预发布环境
```

### 构建配置文件

**使用工具名 + 配置类型:**
```
vite.config.ts              ✓ Vite 配置
tsconfig.json               ✓ TypeScript 配置
.eslintrc.js                ✓ ESLint 配置
.prettierrc                 ✓ Prettier 配置
```

## 命名对比表

| 文件类型 | 命名风格 | 示例 | 说明 |
|---------|---------|------|------|
| Vue 组件 | PascalCase | `UserProfile.vue` | 多词组件名 |
| 组件目录 | PascalCase | `UserCard/` | 与组件名一致 |
| 功能目录 | kebab-case | `user-profile/` | 模块目录 |
| TS/JS 文件 | camelCase | `useAuth.ts` | 组合式函数、工具 |
| 样式文件 | kebab-case | `global.scss` | 全局样式 |
| 图片文件 | kebab-case | `logo-primary.png` | 静态资源 |
| 测试文件 | camelCase + spec | `user.spec.ts` | 测试文件 |
| 配置文件 | 工具名 + config | `vite.config.ts` | 配置文件 |