# TSL Skills

面向 TSL 项目与通用前端工程的 Agent Skills 集合。仓库将团队实践、框架规范和第三方库知识整理为可被智能编码代理按需加载的操作指南、API 参考、代码模板与静态资源。

本仓库是技能文档库，不是一个可直接启动的应用，也没有统一的构建入口。

## 技能一览

当前包含 10 个技能：

| 分类 | 技能 | 适用场景 |
| --- | --- | --- |
| TSL 专项 | [`ai-sdk-best-practices`](skills/ai-sdk-best-practices/SKILL.md) | 集成 `@tslfe/ai-sdk` 的 LLM、语音、TTS、离线唤醒和浏览器 MCP 能力 |
| TSL 专项 | [`dt-engine-best-practices`](skills/dt-engine-best-practices/SKILL.md) | 使用 `@tslfe/dt-engine` 开发和排查 WebGL、Unity Cloud 与数字孪生功能 |
| TSL 专项 | [`origami-vue`](skills/origami-vue/SKILL.md) | 使用 `origami-vue` 组件库及其 37 个组件的准确 API |
| TSL 专项 | [`tsl-admin-best-practices`](skills/tsl-admin-best-practices/SKILL.md) | 创建、还原或重构 TSL 风格的 Vue 3 管理后台 |
| TSL 专项 | [`tsl-big-screen-best-practices`](skills/tsl-big-screen-best-practices/SKILL.md) | 创建、维护或评审 TSL 风格的 Vue 3 数字孪生与数据可视化大屏 |
| 前端开发 | [`frontend-developer`](skills/frontend-developer/SKILL.md) | 实现前端功能、修复缺陷、还原设计并开展界面质量检查 |
| 工程规范 | [`frontend-engineering-standards`](skills/frontend-engineering-standards/SKILL.md) | 规范 Vue 3、JavaScript、Vite 项目的架构、编码、测试、性能与安全 |
| 工程规范 | [`document-structure-standards`](skills/document-structure-standards/SKILL.md) | 统一产品需求、前后端设计及整体说明文档的结构和存放路径 |
| 生态参考 | [`pinia`](skills/pinia/SKILL.md) | 使用 Pinia 定义 Store、组织状态逻辑以及处理 SSR、插件和测试 |
| 生态参考 | [`anime`](skills/anime/SKILL.md) | 使用 Anime.js v4 创建时间轴、拖拽、滚动、SVG 和文本动画 |

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

每个技能都以 `SKILL.md` 为入口，其中定义触发范围、工作流和核心约束。技能可按需包含：

- `references/`：API、规范、示例与故障排查资料。
- `assets/`：可直接复用的项目模板、代码和静态资源。
- `agents/`：Agent 展示信息与默认提示词。
- `scripts/`：技能、模板或资产的自动化检查。
- `GENERATION.md`：外部技术资料的生成来源与维护说明。

## 使用方式

请先安装 Node.js（包含 npm 和 `npx`），再使用 Skills CLI 安装。命令执行后，按提示选择需要的技能和目标 Agent：

```bash
npx skills add panlingjin/tsl-skills
```

如需预览或直接安装指定技能：

```bash
npx skills add panlingjin/tsl-skills --list
npx skills add panlingjin/tsl-skills --skill tsl-admin-best-practices
```

安装后，可在提示词中显式指定技能：

```text
使用 $frontend-engineering-standards，检查这个 Vue 3 项目的工程结构和代码规范。

使用 $tsl-admin-best-practices，基于模板创建一个 TSL 风格的管理后台。

使用 $ai-sdk-best-practices，在 Vue 3 项目中接入文本对话并处理卸载清理。

使用 $tsl-big-screen-best-practices，搭建一个 1920 × 1080 的数字孪生大屏。
```

支持 Skills 自动发现的 Agent 也可根据各技能 frontmatter 中的 `description` 自动选择技能。
