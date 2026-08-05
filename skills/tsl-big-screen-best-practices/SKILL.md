---
name: tsl-big-screen-best-practices
description: 为 TSL Vue 3 可视化大屏提供专项实现、维护与评审规范，覆盖 1920×1080 缩放画布、数字孪生场景、ECharts 数据展示、卡片与标题、Modal、Page Switch、静态中国地图及 LLM/MCP 控制。使用于新建或维护 Vue CLI 5 + Webpack 大屏，以及依据 Figma、截图或设计 MCP 还原大屏；通用 JavaScript、Yarn、目录、命名、安全和错误处理服从 frontend-engineering-standards。
---

# TSL 可视化大屏最佳实践

将本 Skill 与 `frontend-engineering-standards` 一起使用。本 Skill 只覆盖大屏领域规则和 Vue CLI 5/Webpack 兼容适配，不重新定义通用前端工程规范。

## 规则边界

| 领域 | 规则来源 |
| --- | --- |
| JavaScript、Yarn、目录与命名、组件边界、Router、Pinia、安全、错误处理 | `frontend-engineering-standards` |
| 构建、环境变量、SVG loader、单元测试运行器 | 本 Skill 的 Vue CLI 5/Webpack 适配 |
| 缩放画布、场景叠层、侧栏预算、图表、卡片、Modal、Page Switch、dt-engine、LLM/MCP | 本 Skill |
| 明确的视觉细节 | 用户提供的 Figma、设计 MCP、截图或设计文件 |

Vue CLI 5/Webpack 适配只允许以下例外：

- 使用 `vue.config.js`、Babel、Webpack loader 和 `VUE_APP_*`。
- 使用 Jest，而不是为测试额外引入 Vite/Vitest。
- 使用 `svg-sprite-loader` 处理 `src/assets/icons/svg/`。
- 新项目使用团队统一的 Yarn Classic 1.x；维护项目沿用现有 Yarn 主版本。

不得借此覆盖通用规范中的 JavaScript、Composition API、Yarn、PascalCase SFC、camelCase JavaScript、`composables/`、`stores/`、`src/assets/styles/`、运行时校验、安全或错误处理规则。新建大屏不使用 `origami-vue`；维护旧项目时不在无关任务中强制移除已有依赖，但不得新增耦合。

## 按任务加载

只读取当前任务所需文档：

| 任务 | 读取文档 |
| --- | --- |
| 创建项目，修改依赖、环境、Webpack、HTML 外壳或 Jest | `references/project-setup.md` |
| 复制模板、资源或组织场景级源码 | `references/source-architecture.md` |
| 处理大屏组件分区、图表/Modal/引擎所有权或资源清理 | `references/vue-patterns.md` |
| 实现画布缩放、场景叠层、Header/侧栏布局 | `references/big-screen-ui.md` |
| 选择或实现 KPI、图表、表格、时间线、列表 | `references/data-visualization.md` |
| 使用静态雅安风格全国地图 | `references/china-map.md` |
| 定义卡片层级、网格、密度、交互或浮动卡片 | `references/card-patterns.md` |
| 实现标题背景、分隔线、角标或图标装饰 | `references/title-decoration.md` |
| 实现 Dialog、Confirm、Drawer、Media 或 Scene Callout | `references/modal-patterns.md` |
| 接入共享请求、Vue CLI MockJS、轮询或 WebSocket | `references/data-integration.md` |
| 接入 Unity/WebGL、POI、相机、特效或模型事件 | `references/dt-engine.md`，并核对目标项目实际 dt-engine 版本 |
| 实现多项目或多场景切换 | `references/page-switch.md` |
| 接入 AI 助手、MCP 工具、LLM 或 `frontControl` | `references/llm-and-mcp.md` |
| 交付大屏改动 | `references/quality-checks.md`，并执行通用工程检查 |

一个任务涉及多个领域时组合读取对应文档，不要因为修改一个卡片就加载项目搭建、Router、Pinia、dt-engine 和 LLM 全部规则。

## 视觉优先级

按领域处理来源：

1. 用户明确指令最高。
2. Figma、设计 MCP、截图和批准的设计文件决定视觉细节。
3. 维护项目沿用已有工程和主题约定。
4. 未指定视觉采用本 Skill 的 TSL 默认值。

视觉来源不得破坏大屏画布坐标系、侧栏高度预算、弹层语义、键盘可用性、资源所有权、安全或私有配置边界。具体缩放和叠层规则只在 `big-screen-ui.md` 维护。

## 核心兼容约定

- 新项目使用 Vue 3、JavaScript、Composition API、Vue CLI 5、Webpack、Vue Router 4、Pinia、Less 和 ECharts。
- 维护项目先读取 `package.json` 和锁文件；不得因本 Skill 自动迁移构建工具、目录或依赖主版本。
- 新项目默认安装最新版 `@tslfe/dt-engine`（以 `npm view @tslfe/dt-engine version` 为准）；维护项目沿用已安装版本并按其公共导出核对 API。
- 仅在 MCP 输入 schema 需要时使用 `zod@3.23.8`。
- 仅在数字计数动效需要时添加 `countup.js`，不默认安装旧 `countup` 包。
- 所有 HTTP 请求通过 `src/api/request.js`；请求层不直接调用 Toast 或其他 UI 组件。
- 使用 `#infraApp` 作为缩放根节点，所有应用弹层保持在同一坐标系内。
- 复用 `assets/template/` 中的代码和生命周期契约，不手工重建易错行为。
- 不复制第三方字体、密钥、私有 URL、模型 ID、Token、JWT、App Secret 或客户数据。

最终按照 `references/quality-checks.md` 完成自动化与人工验收。
