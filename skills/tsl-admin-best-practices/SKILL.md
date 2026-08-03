---
name: tsl-admin-best-practices
description: 为 Vue 3 PC 管理后台提供 TSL/Tacos 风格的专项实现规范。用于新建、改造或审查采用 origami-vue 的后台项目，覆盖应用外壳、顶部导航、侧栏、面包屑、紧凑型表格、详情容器、Less 视觉令牌、本地 SVG 和 Wujie 子应用适配；通用工程规范服从 frontend-engineering-standards。
---

# TSL 管理后台最佳实践

本技能是 `frontend-engineering-standards` 的专项补充，只定义 TSL/Tacos 管理后台独有的视觉、布局和组件模式。通用的 JavaScript、目录、命名、依赖管理、路由、Pinia、测试和构建规则不在此重复定义。

## 优先级

同时应用两个技能，并按以下顺序处理规则：

1. `frontend-engineering-standards` 是通用基线，优先级最高。
2. 本技能只在基线未规定或明确允许项目特化时补充 TSL 约束。
3. 发生冲突时，使用 JavaScript、Yarn、PascalCase、`stores/`、`layouts/`、`src/assets/styles/`、`src/icons/`、`vite.config.js` 和基线规定的 Vite 插件。
4. 保留 TSL 的布局尺寸、信息密度、配色、Origami Vue 用法、页面范式和 Wujie 条件适配。

## 工作流

1. 阅读 `references/project-setup.md`，确认模板、技术栈和目录边界。
2. 修改应用外壳、导航或面包屑时，阅读 `references/layout-and-navigation.md`。
3. 修改视觉令牌、Less 或 Origami 样式覆盖时，阅读 `references/style-system.md`。
4. 实现公共组件或表格封装时，阅读 `references/component-patterns.md`。
5. 创建列表、详情、配置或树表页面时，阅读 `references/page-patterns.md`。
6. 添加本地图标或图片时，阅读 `references/assets-and-icons.md`。
7. 交付前执行 `references/quality-checks.md`。

## 组件模板

`assets/tsl-admin-template/` 不是完整项目脚手架，只保存可复制的通用组件及其直接依赖。先按 `frontend-engineering-standards` 建立目标项目，再按需复制其中的组件、Less 令牌、工具函数和通用 SVG。

模板不提供应用入口、布局、路由、Store、页面、包清单或构建配置，也不包含源系统的 `.env`、内部主机、令牌、密钥、客户数据或私有业务逻辑。

## 组件导入约定

- 组件目录和 SFC 使用 PascalCase。
- 组件目录不创建 `index.js` 或 `index.ts` 二次导出。
- 统一直接导入具体文件，例如 `@/components/common/BaseBox/BaseBox.vue`。
- 只有真正的独立 npm 包才设计包级公共入口；项目内部组件不使用 barrel。

## 默认约定

- 新代码使用纯 JavaScript、Composition API 与 `<script setup>`；不创建 `.ts`、`.tsx` 文件，也不写 TypeScript 类型语法。
- Origami Vue 是默认 UI 组件库；其他 UI 库只能在明确缺失能力时局部引入并记录原因。
- 组件保持单一职责，使用运行时 props、明确的 emits、属性向下和事件向上；复杂公共参数使用 JSDoc 补充说明。
- 业务、菜单和资源 SVG 使用本地雪碧图；通用控件图标优先使用 `origami-vue/es/icon`。
- Wujie 支持是条件能力，普通独立项目保持 `base: '/'`。
