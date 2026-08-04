# 文件命名规范

## Vue 组件命名

### 组件文件命名

**使用 PascalCase:**
- 所有 Vue 组件文件使用 PascalCase 命名
- 组件名应该是多词的(避免与 HTML 元素冲突)
- `App.vue` 等框架约定的入口组件可作为单词名称例外

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
│   └── index.js            # 导出文件
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

## JavaScript 文件命名

### 组合式函数命名

**使用 `use` 前缀 + camelCase:**
```
composables/
├── useAuth.js              ✓ 认证相关
├── useRequest.js           ✓ 请求相关
├── useStorage.js           ✓ 存储相关
├── useValidation.js        ✓ 验证相关
```

### Store 文件命名

**使用功能名 + camelCase:**
```
stores/
├── modules/
│   ├── user.js             ✓ 用户状态
│   ├── cart.js             ✓ 购物车状态
│   ├── app.js              ✓ 应用状态
```

### 工具函数命名

**使用功能描述 + camelCase:**
```
utils/
├── storage.js              ✓ 存储工具
├── validate.js             ✓ 验证工具
├── helpers.js              ✓ 辅助函数
├── format.js               ✓ 格式化工具
```

### API 文件命名

**使用模块名 + camelCase:**
```
api/
├── modules/
│   ├── user.js             ✓ 用户接口
│   ├── order.js            ✓ 订单接口
│   ├── auth.js             ✓ 认证接口
├── request.js              ✓ 请求封装
```

## 样式文件命名

### 全局样式文件

**使用功能描述 + kebab-case，样式文件统一使用 Less：**
```
assets/styles/
├── variables.less          ✓ 变量定义
├── mixins.less             ✓ 混入定义
├── global.less             ✓ 全局样式
├── reset.less              ✓ 重置样式
```

### 组件样式文件

**抽取为共享文件时统一放入 `src/assets/styles/components/`，文件名使用 kebab-case：**
```
assets/styles/
├── components/
│   ├── user-card.less      ✓ UserCard 共享样式
│   └── order-list.less     ✓ OrderList 共享样式
```

组件私有样式保留在 SFC 的 `<style scoped>` 中；跨组件公共样式统一存放在 `src/assets/styles/`。

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

**单元测试和组件测试统一使用 `.test.js` 后缀:**
```
tests/
├── unit/
│   ├── user.test.js        ✓ 用户模块测试
│   ├── validation.test.js  ✓ 验证工具测试
```

### E2E 测试文件

**使用 `.spec.js` 后缀:**
```
e2e/
├── auth/
│   ├── login.spec.js       ✓ 登录流程测试
│   ├── register.spec.js    ✓ 注册流程测试
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
vite.config.js              ✓ Vite 配置
jsconfig.json               ✓ JavaScript 路径与编辑器配置
eslint.config.js            ✓ 新项目 ESLint Flat Config
.prettierrc                 ✓ Prettier 配置
```

## 命名对比表

| 文件类型 | 命名风格 | 示例 | 说明 |
|---------|---------|------|------|
| Vue 组件 | PascalCase | `UserProfile.vue` | 多词组件名 |
| 组件目录 | PascalCase | `UserCard/` | 与组件名一致 |
| 功能目录 | kebab-case | `user-profile/` | 模块目录 |
| JavaScript 文件 | camelCase | `useAuth.js` | 组合式函数、工具 |
| 样式文件 | kebab-case | `global.less` | 统一使用 Less |
| 图片文件 | kebab-case | `logo-primary.png` | 静态资源 |
| 单元/组件测试 | camelCase + test | `user.test.js` | Vitest 测试 |
| E2E 测试 | kebab-case + spec | `login.spec.js` | Playwright 测试 |
| 配置文件 | 工具名 + config | `vite.config.js` | 配置文件 |
