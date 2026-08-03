---
name: frontend-engineering-standards
description: 为 Vue 3 + JavaScript 项目提供工程规范与审查流程，覆盖 Vite、Yarn、目录与命名、组件、路由、Pinia、Mock、测试、性能、安全、错误处理和团队协作。用于创建、修改或审查前端项目；根据任务类型按需加载参考文档，避免把 TypeScript 或无关规范带入上下文。
---

# 前端工程规范工作流程

先确认项目类型和现有技术基线，再只加载与当前任务直接相关的参考文档。不要为了简单修改读取全部规范。

## 核心约束

- 使用 Vue 3、JavaScript、Composition API 和 `<script setup>`；源码、配置、Mock 与测试均不创建 `.ts` / `.tsx` 文件。
- 使用 ES Modules，并在外部数据边界执行运行时校验；复杂公共接口使用必要的 JSDoc。
- 使用 Yarn，禁止生成 npm、pnpm 命令或锁文件。已有项目沿用其 Yarn 主版本，新项目默认 Yarn 4。
- 使用 `src/assets/styles/` 存放主题、变量、重置和跨组件公共样式；组件私有样式可保留在 SFC 中。
- 优先遵循目标项目已声明的框架与工具版本，不擅自升级依赖或替换构建系统。

## 按任务加载参考文档

| 任务 | 读取文档 | 适用条件 |
| --- | --- | --- |
| 修改 Vue 或 JavaScript 代码 | [代码规范](references/code-standards.md) | 涉及源码或配置代码时 |
| 新增、移动或重命名文件 | [目录结构规范](references/directory-structure.md)、[文件命名规范](references/naming-conventions.md) | 只审查现有文件内容时无需加载 |
| 设计响应式数据 | [MVVM 规范](references/mvvm-patterns.md) | 涉及 `ref`、`reactive`、`computed`、`watch` 时 |
| 判断或执行组件抽离 | [组件抽离与封装规范](references/component-encapsulation.md) | 涉及职责边界、复用范围、页面私有组件或逻辑抽取时 |
| 开发路由 | [路由规范](references/router-best-practices.md) | 涉及路由配置、守卫、权限或缓存时 |
| 使用 Pinia | [状态管理规范](references/state-management.md) | 涉及 Store、持久化或跨组件状态时 |
| 配置 Node、Yarn、依赖、环境或 CI | [构建、环境与依赖管理规范](references/build-environment.md) | 安装依赖、修改环境变量或流水线时 |
| 修改 Vite 或 SVG 插件 | [Vite 配置规范](references/vite-config.md) | 仅限 Vite 项目 |
| 开发接口模拟 | [数据 Mock 规范](references/mock-data.md) | 开发服务器 API Mock；测试替身读取测试规范 |
| 编写测试 | [测试规范](references/testing-standards.md) | 单元、组件、集成或 E2E 测试 |
| 优化或审查性能 | [性能优化规范](references/performance-optimization.md) | 先测量，再选择优化手段 |
| 处理用户数据或权限 | [安全规范](references/security-guidelines.md) | 输入、认证、授权、存储和接口对接 |
| 设计错误处理 | [错误处理规范](references/error-handling.md) | 异步请求、错误边界、日志和上报 |
| 提交或审查代码 | [Git 提交规范](references/git-conventions.md) | 用户要求提交、PR 或 Code Review 时 |
| 编写项目文档 | [文档规范](references/documentation-standards.md) | README、组件/API 文档和 CHANGELOG 内容 |

任务同时涉及多个领域时，组合读取对应文档；不要因为一个领域的检查项而加载整个参考目录。

## 项目类型与专项技能

| 项目类型 | 专项技能 | 构建与组件约束 |
| --- | --- | --- |
| 普通 Vue 3 项目 | 当前技能 | 默认使用现有项目的 Vite 与 Yarn 基线 |
| PC 管理后台 | `tsl-admin-best-practices` | 可使用 `origami-vue`；通用工程规则仍以当前技能为基线 |
| 大屏展示项目 | `tsl-big-screen-best-practices` | 不使用 `origami-vue`；构建工具及大屏专属规则以专项技能为准 |

使用专项技能时只让专项规则覆盖其明确负责的领域。语言仍保持 JavaScript；如果外部参考提供 TypeScript 示例，将其转换为等价 JavaScript。

需要更深入的技术资料时，按需使用当前环境已安装的 `vue-best-practices`、`vue-router-best-practices`、`pinia` 或 `origami-vue`，不要假定未安装的技能可用。

## 完成前检查

- 运行项目已有的 lint、测试和构建命令；不要凭空引入新的质量工具。
- 检查需求、边界条件、错误处理和用户交互是否完整。
- 只应用与改动相关的性能、安全和文档检查项。
- 确认没有引入 TypeScript 文件、非 Yarn 锁文件或与项目基线冲突的配置。
