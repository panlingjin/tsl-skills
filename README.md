# TSL Skills

面向 TSL 项目与通用前端工程的 Agent Skills 集合。仓库将团队实践、工程规范、第三方库知识和可复用模板整理为编码 Agent 可按需加载的操作指南，帮助 Agent 在实现、维护、排查和评审任务中采用一致的技术约定。

本仓库是技能文档库，不是可直接启动的应用，也没有统一的安装依赖、构建或测试入口。每个技能都是独立单元，应根据任务选择并加载。

## 技能一览

当前包含 10 个技能：

| 分类 | 技能 | 适用场景 |
| --- | --- | --- |
| TSL 专项 | [`ai-sdk-best-practices`](skills/ai-sdk-best-practices/SKILL.md) | 集成或排查 `@tslfe/ai-sdk` 的 LLM、语音识别、TTS、离线唤醒和浏览器 MCP 能力 |
| TSL 专项 | [`dt-engine-best-practices`](skills/dt-engine-best-practices/SKILL.md) | 使用 `@tslfe/dt-engine` 开发、迁移或排查 Three.js/WebGL、Unity Cloud 与数字孪生功能 |
| TSL 专项 | [`origami-vue`](skills/origami-vue/SKILL.md) | 使用 `origami-vue` 组件库及其 37 个组件的准确 API 和推荐模式 |
| TSL 专项 | [`tsl-admin-best-practices`](skills/tsl-admin-best-practices/SKILL.md) | 创建、还原、改造或审查采用 `origami-vue` 和 Less 的 TSL/Tacos 风格 Vue 3 管理后台 |
| TSL 专项 | [`tsl-big-screen-best-practices`](skills/tsl-big-screen-best-practices/SKILL.md) | 创建、维护或评审 Vue CLI 5/Webpack 大屏，覆盖 1920 × 1080 缩放画布、ECharts、数字孪生、Modal、页面切换、静态地图及 LLM/MCP |
| 前端开发 | [`frontend-developer`](skills/frontend-developer/SKILL.md) | 实现前端功能、修复缺陷、还原设计并开展界面质量检查 |
| 工程规范 | [`frontend-engineering-standards`](skills/frontend-engineering-standards/SKILL.md) | 规范 Vue 3、JavaScript、Vite、Yarn 项目的架构、编码、测试、性能、安全与协作流程 |
| 工程规范 | [`document-structure-standards`](skills/document-structure-standards/SKILL.md) | 统一产品需求、前后端设计及整体说明文档的结构和存放路径 |
| 生态参考 | [`pinia`](skills/pinia/SKILL.md) | 使用 Pinia 定义 Store、组织状态逻辑以及处理 SSR、插件和测试 |
| 生态参考 | [`anime`](skills/anime/SKILL.md) | 使用 Anime.js v4 创建时间轴、拖拽、滚动、SVG 和文本动画 |

## 如何选择技能

- 普通 Vue 3 项目的创建、修改或审查，以 `frontend-engineering-standards` 作为通用工程基线；需要具体实现协助时可组合 `frontend-developer`。
- TSL/Tacos 管理后台在通用工程基线上组合 `tsl-admin-best-practices`，涉及组件时再加载 `origami-vue`。
- 数据可视化大屏组合 `frontend-engineering-standards` 与 `tsl-big-screen-best-practices`。大屏专项技能负责 Vue CLI 5/Webpack 兼容和大屏领域规则，通用 JavaScript、Yarn、目录、命名、安全及错误处理仍服从工程规范。
- 涉及 `@tslfe/ai-sdk`、`@tslfe/dt-engine`、Pinia 或 Anime.js 时，按实际任务追加对应技能，不需要加载无关参考资料。

用户的明确要求和目标项目现有技术基线始终优先。维护已有项目时，不应仅因加载技能而擅自升级依赖、迁移构建工具或重组无关代码。

## 使用方式

请先安装 Node.js（包含 npm 和 `npx`），再使用 [Skills CLI](https://github.com/vercel-labs/skills#readme) 安装。交互式命令会提示选择需要的技能和目标 Agent：

```bash
npx skills add panlingjin/tsl-skills
```

预览仓库中的可用技能：

```bash
npx skills add panlingjin/tsl-skills --list
```

安装指定技能：

```bash
npx skills add panlingjin/tsl-skills --skill tsl-admin-best-practices
```

安装后，可以在提示词中显式指定一个或多个技能：

```text
使用 $frontend-engineering-standards，检查这个 Vue 3 项目的工程结构和代码规范。

使用 $frontend-engineering-standards 和 $tsl-admin-best-practices，基于模板创建一个 TSL/Tacos 风格的管理后台。

使用 $ai-sdk-best-practices，在 Vue 3 项目中接入文本对话并处理卸载清理。

使用 $frontend-engineering-standards 和 $tsl-big-screen-best-practices，搭建一个 1920 × 1080 的数字孪生大屏。
```

支持 Skills 自动发现的 Agent 也可根据各技能 `SKILL.md` frontmatter 中的 `description` 自动选择技能。

## 目录结构

```text
skills/
├── ai-sdk-best-practices/
├── anime/
├── document-structure-standards/
├── dt-engine-best-practices/
├── frontend-developer/
├── frontend-engineering-standards/
├── origami-vue/
├── pinia/
├── tsl-admin-best-practices/
└── tsl-big-screen-best-practices/
```

每个技能以 `SKILL.md` 为入口，其中定义技能名称、触发范围、工作流和核心约束。技能可按需包含：

- `references/`：按任务加载的 API、规范、示例和故障排查资料。
- `assets/`：可直接复用的项目模板、代码和静态资源。
- `agents/`：Agent 展示信息与默认提示词。
- `scripts/`：用于检查技能、模板或资产契约的专项脚本。
- `GENERATION.md`：外部技术资料的生成来源与维护说明。

## 维护与校验

- 修改技能时，以对应目录中的 `SKILL.md` 为入口，并同步更新受影响的 `references/`、`assets/` 或 Agent 配置。
- 新增、删除或重命名技能后，同步维护本 README 的技能数量、技能表格和目录树。
- 包含 `scripts/` 的技能应运行其目录内的专项校验脚本；其他技能按照各自 `SKILL.md` 的完成前检查执行。
- 提交前检查 Markdown 链接、示例命令、frontmatter 描述与实际目录是否一致。
- 仓库没有统一构建入口，不应在根目录假定存在统一的 `install`、`build` 或 `test` 命令。
