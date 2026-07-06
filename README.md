# TSL Skills

TSL 前端与数字孪生场景的 Agent Skills 集合。仓库将团队实践沉淀为可被智能编码代理按需加载的操作指南、API 参考、代码模板和静态资源，帮助代理在生成或审查代码时遵循真实的包 API、项目约定与生命周期要求。

本仓库是技能文档库，不是一个可直接启动的应用，也没有统一的构建入口。

## 技能一览

| 技能 | 适用场景 | 主要内容 |
| --- | --- | --- |
| [`ai-sdk-best-practices`](skills/ai-sdk-best-practices/SKILL.md) | 在 TypeScript/Vue 3 前端集成 `@tslfe/ai-sdk` | LLM 会话、录音与识别、TTS、离线唤醒、浏览器 MCP、运行时配置和故障排查 |
| [`dt-engine-best-practices`](skills/dt-engine-best-practices/SKILL.md) | 使用 `@tslfe/dt-engine` 开发或排查数字孪生功能 | WebGL、Three.js、Unity Cloud、Node 渲染、插件、动画、资源释放和迁移陷阱 |
| [`origami-vue`](skills/origami-vue/SKILL.md) | 使用 `origami-vue` 组件库开发 Vue 界面 | 37 个组件的准确 API、导入方式、子组件、`v-model`、尺寸系统和常见用法 |
| [`tsl-big-screen-best-practices`](skills/tsl-big-screen-best-practices/SKILL.md) | 创建、维护或评审 TSL 风格 Vue 3 可视化大屏 | 项目基线、页面缩放、卡片与弹窗、图表、地图、数据接入、数字孪生和 AI 控制流 |

## 目录结构

```text
skills/
├── ai-sdk-best-practices/
│   ├── SKILL.md              # 技能入口与执行工作流
│   ├── agents/openai.yaml    # Agent 展示信息与默认提示词
│   └── references/           # API、配置、示例和故障排查
├── dt-engine-best-practices/
│   ├── SKILL.md
│   ├── agents/openai.yaml
│   └── references/           # 各引擎、插件、扩展及迁移参考
├── origami-vue/
│   ├── SKILL.md
│   └── references/           # 37 个组件的独立参考文档
└── tsl-big-screen-best-practices/
    ├── SKILL.md
    ├── agents/openai.yaml
    ├── references/           # 架构、UI、数据与质量规范
    ├── assets/               # 模板、地图、图片和图标
    └── scripts/              # 技能与资产回归检查
```

每个技能都以 `SKILL.md` 为唯一入口。入口文件定义触发范围、工作流和硬性约束，代理再根据任务加载 `references/` 中的必要资料；`assets/` 提供可直接复用的实现与视觉资源。

## 使用方式

请先安装 Node.js（包含 npm 和 `npx`），再使用 Skills CLI 安装。命令执行后，按提示选择需要的技能和目标 Agent：

```bash
npx skills add panlingjin/tsl-skills
```

如需预览或直接安装指定技能：

```bash
npx skills add panlingjin/tsl-skills --list
npx skills add panlingjin/tsl-skills --skill ai-sdk-best-practices
```

安装后，可在提示词中显式指定技能：

```text
使用 $ai-sdk-best-practices，在 Vue 3 项目中接入文本对话并处理卸载清理。

使用 $dt-engine-best-practices，检查当前 WebGL 场景的初始化顺序和资源释放。

使用 $origami-vue，实现一个带查询表单、分页表格和编辑弹窗的页面。

使用 $tsl-big-screen-best-practices，搭建一个 1920 × 1080 的数字孪生大屏。
```

支持 Skills 自动发现的 Agent 也可根据各技能 frontmatter 中的 `description` 自动选择技能。
