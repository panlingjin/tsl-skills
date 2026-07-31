---
name: tsl-big-screen-best-practices
description: 从零搭建、维护或评审符合 TSL 规范的 Vue 3 可视化大屏项目，并保持与 Vue CLI 5 技术栈兼容。适用于数字孪生、数据可视化、大屏看板、Figma 或设计 MCP 还原，以及卡片、面板、标题装饰、弹窗、Dialog、Drawer、媒体查看器、浮动卡片、KPI、ECharts 图表、表格、时间线、地图和 Grid/Flex 数据布局的设计与实现；也适用于接入 Vue Router、Pinia、Axios、MockJS、CountUp、Page Switch、@tslfe/dt-engine、@tslfe/ai-sdk、MCP 与 LLM 前端控制流程。
---

# TSL 可视化大屏项目

创建、维护或评审 TSL 可视化大屏项目。除非用户明确选择其他构建系统，否则以 Vue 3 和 Vue CLI 5 作为兼容性基线。

## 工作流程

1. 先阅读 `references/project-setup.md`，了解技术栈、依赖、配置、环境变量和 HTML 外壳要求。
2. 创建或移动源码文件前，阅读 `references/source-architecture.md`。
3. 编写 Vue、Pinia、Router、composable 或生命周期代码前，阅读 `references/vue-patterns.md`。
4. 实现大屏布局、视觉组件、图表、计数器、资源和缩放逻辑前，阅读 `references/big-screen-ui.md`。
5. 选择数据展示形式，或实现 KPI 卡片、图表、表格、时间线、地图、状态列表和数据样式前，阅读 `references/data-visualization.md`。
6. 渲染雅安风格的静态全国地图及其多层阴影效果时，阅读 `references/china-map.md`。
7. 定义面板卡片、内容卡片、条目卡片层级，12 栏布局、卡片密度、交互状态或三维场景浮动卡片前，阅读 `references/card-patterns.md`。
8. 设置 Panel、卡片或区块标题样式，添加标题背景、分隔线、角标或动态图标装饰前，阅读 `references/title-decoration.md`。
9. 实现 Dialog、Confirm、Drawer、媒体查看器、焦点锁定、弹层堆叠或场景 Callout/Popover 前，阅读 `references/modal-patterns.md`。
10. 添加 Axios API、MockJS、定时刷新或 WebSocket 代码前，阅读 `references/data-integration.md`。
11. 项目涉及数字孪生场景、Unity/WebGL 控制、POI、相机、特效或模型事件时，阅读 `references/dt-engine.md`。
12. 项目需要多项目或多场景切换时，阅读 `references/page-switch.md`。
13. 添加 AI 助手、MCP 工具、LLM 问答或 `frontControl` 动作时，阅读 `references/llm-and-mcp.md`。
14. 最终交付前，阅读 `references/quality-checks.md` 并完成验收。

## 设计来源优先级

当用户提供 Figma 文件、设计系统 MCP、截图、标注视觉参考或生成式设计图，并要求据此实现时，将该来源视为视觉权威。本 Skill 负责补充设计来源未明确的工程结构、运行时生命周期、大屏缩放、数据语义、无障碍、安全和降级策略。

按以下优先级执行：

1. 用户的明确指令。
2. 用户提供的 Figma、设计 MCP 或设计文件中的视觉细节。
3. 维护现有项目时，该项目已经形成的约定。
4. 未指定部分采用本 Skill 的 TSL 视觉默认值。

按领域解决冲突：视觉细节遵循用户提供的设计来源；工程、可用性、安全和生命周期约束遵循本 Skill。不得用内置的蓝青色 TSL 默认样式覆盖明确的设计来源，也不得让设计来源破坏 `1920 × 1080` 缩放根节点、受控的侧栏高度预算、弹层层级、资源清理责任或私有配置规则。

## 默认构建规范

- 使用 Vue 3、Composition API、Vue CLI 5、Vue Router 4、Pinia、Less、ECharts 和现有 TSL 包约定。
- 仅固定对兼容性敏感的依赖版本：`zod@3.23.8` 和 `@tslfe/dt-engine@4.3.1-1`。
- 所有 HTTP 请求统一通过 `src/utils/axios.js` 中的原生 `axios` 实例发送。
- 使用 `#infraApp` 作为 `1920 × 1080` 缩放根节点，并将所有弹层保持在同一坐标系内。
- 按 `source-architecture.md` 中的复制契约复用内置模板和资源，不要手工重建其生命周期行为。
- 除非用户、设计来源或现有项目明确要求品牌字体，否则使用浏览器或页面默认字体。默认不要复制第三方源项目字体。
- 左右看板栏必须位于缩放后的 1080p 画布内。非交互侧栏必须满足文档规定的高度预算，不得产生页面级或整栏纵向滚动。
- 保持根组件和路由组件轻量。将功能 UI 放入子组件，将功能行为放入 composable、service 或 store。
- 不得从现有项目复制项目专属密钥、私有 URL、模型 ID、Token、JWT、App Secret 或硬编码客户数据。

最终按照 `references/quality-checks.md` 中的自动化与人工验收入口完成交付。
