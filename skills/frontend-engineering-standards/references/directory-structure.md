# 目录结构规范

## 标准目录结构

Vue 3 + Vite + JavaScript 项目的标准目录结构：

```
project-root/
├── public/                 # 静态资源目录(不经过构建处理)
│   └── favicon.ico
├── src/                    # 源代码目录
│   ├── api/                # API 接口模块
│   │   ├── modules/        # 按业务模块组织的接口
│   │   ├── request.js      # Axios 封装
│   │   └── index.js        # API 统一导出
│   ├── assets/             # 需要构建处理的静态资源
│   │   ├── images/         # 图片资源
│   │   ├── fonts/          # 字体资源
│   │   └── styles/         # 全局主题、变量、重置和公共样式
│   ├── components/         # 公共组件
│   │   ├── common/         # 通用基础组件
│   │   ├── business/       # 业务公共组件
│   │   └── ui/             # UI 组件库扩展
│   ├── composables/        # 组合式函数(hooks)
│   │   ├── useAuth.js      # 认证相关
│   │   ├── useRequest.js   # 请求相关
│   │   └── useUtils.js     # 工具函数
│   ├── directives/         # 自定义指令
│   ├── layouts/            # 布局组件
│   │   ├── DefaultLayout.vue
│   │   └── AdminLayout.vue
│   ├── router/             # 路由配置
│   │   ├── modules/        # 路由模块
│   │   ├── guards.js       # 路由守卫
│   │   └── index.js        # 路由入口
│   ├── stores/             # Pinia 状态管理
│   │   ├── modules/        # Store 模块
│   │   └── index.js        # Store 入口
│   ├── utils/              # 工具函数
│   │   ├── storage.js      # 本地存储
│   │   ├── validate.js     # 验证函数
│   │   └── helpers.js      # 辅助函数
│   ├── views/              # 页面视图
│   │   ├── home/           # 首页模块
│   │   ├── user/           # 用户模块
│   │   └── admin/          # 管理模块
│   ├── App.vue             # 根组件
│   └── main.js             # 应用入口
├── .env*                   # 环境变量文件
├── eslint.config.js        # ESLint 配置（新项目）
├── .prettierrc             # Prettier 配置
├── .gitignore              # Git 忽略文件
├── index.html              # HTML 入口模板
├── package.json            # 项目配置
├── jsconfig.json           # JavaScript 路径与编辑器配置
├── vite.config.js          # Vite 配置
└── README.md               # 项目说明
```

## 核心目录职责

### api/
- 封装 Axios 实例,统一请求/响应处理
- 定义各业务模块的接口请求函数
- 统一导出所有 API 接口

### assets/
- 存放需要经过构建处理的静态资源
- 包括图片、字体、样式等资源
- 所有公共样式统一存放在 `src/assets/styles/`，按照标准目录结构组织
- 避免放置大型静态资源(应使用 CDN 或 public)

### components/
- `common/`: 通用基础组件(Button、Input、Form 等)
- `business/`: 业务公共组件(UserCard、OrderItem 等)
- `ui/`: UI 组件库扩展或自定义 UI 组件
- 具体文件与目录命名遵循文件命名规范

### composables/
- 组合式函数(hooks),用于提取和复用逻辑
- 状态逻辑复用、生命周期钩子封装
- 不放置与响应式或生命周期无关的普通工具函数

### views/
- 页面级组件,对应路由
- 每个业务模块一个文件夹
- 页面组件使用 PascalCase

### stores/
- Pinia 状态管理目录
- 按功能模块组织 Store
- `modules/`: 各功能模块的 Store
- `index.js`: 统一导出所有 Store

### utils/
- 优先放置数据转换、格式化和验证等纯函数
- 浏览器存储等适配器必须通过命名和文档明确其副作用
- 依赖响应式状态或生命周期的逻辑放入 composables

环境变量、Node.js 与构建文件的详细约定统一参见 `build-environment.md`；本文件只定义它们在项目根目录中的位置。
