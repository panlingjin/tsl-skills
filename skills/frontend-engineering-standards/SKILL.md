---
name: frontend-engineering-standards
description: 前端工程规范技能，提供 Vue 3 + JavaScript + Vite 项目的工程化规范指导，涵盖 Yarn 依赖管理、目录结构、命名、样式资源、路由、状态管理、组件封装、Mock、构建与质量保障。适用于创建、修改或审查前端项目，确保代码质量和团队协作一致性。
---

# 前端工程规范工作流程

使用此技能作为指导规范,按照以下工作流程执行前端开发任务。

## 核心原则

- **规范性优先**: 所有代码必须遵循统一的规范,确保可维护性
- **JavaScript 项目**: 项目源码、配置、Mock 和测试统一使用 JavaScript，不创建 `.ts` / `.tsx` 文件，不使用静态类型语法
- **Composition API**: 优先使用 Composition API + `<script setup>`
- **模块化设计**: 按功能模块组织代码,保持职责单一
- **性能意识**: 开发时考虑性能优化,避免反模式
- **团队协作**: 遵循规范,编写可读性强的代码,便于团队协作

## 1) 确认技术栈（必需）

**标准技术栈：**
- 框架：Vue 3
- 语言：JavaScript
- 构建：Vite
- 路由：Vue Router 4
- 状态管理：Pinia
- Mock：Mock.js
- **包管理器：yarn**（强制约束，禁止使用 npm 或 pnpm）
- **样式目录：`src/assets/styles/`**（全局主题、变量、重置和公共样式统一存放）

## 2) 应用核心规范（必需）

### 必须阅读的参考文档

在开始任何前端任务前,必须阅读以下核心参考文档：

1. **目录结构规范** - `references/directory-structure.md`
2. **代码规范** - `references/code-standards.md`
3. **文件命名规范** - `references/naming-conventions.md`
4. **MVVM 规范** - `references/mvvm-patterns.md`
5. **Vite 配置规范** - `references/vite-config.md`（确保构建配置正确）

这些核心参考文档应保持在活动的工作上下文中,贯穿整个开发过程。

### 代码规范应用要点

**Vue 组件：** 使用 Composition API + `<script setup>`，遵循 script → template → style 顺序

**JavaScript：** 使用 ES Modules；通过清晰命名、参数校验和必要的 JSDoc 提升可读性，不使用静态类型语法

**文件命名：** 功能目录使用 kebab-case，组件目录和 Vue 组件使用 PascalCase，JavaScript 文件使用 camelCase

**样式资源：** 所有公共样式统一存放在 `src/assets/styles/`，按照标准目录结构组织

## 3) 应用架构规范（按需）

根据任务类型,阅读并应用相应的架构规范：

### 路由开发
**阅读：** `references/router-best-practices.md`

### 状态管理
**阅读：** `references/state-management.md`

### 组件封装
**阅读：** `references/component-encapsulation.md`

### Mock 数据开发
**阅读：** `references/mock-data.md`

### 依赖管理
**阅读：** `references/dependency-management.md`

### 构建配置
**阅读：** `references/build-environment.md`

## 4) 应用质量保障规范（按需）

根据项目阶段,应用相应的质量保障规范：

### 性能优化
**阅读：** `references/performance-optimization.md`
**时机：** 功能开发完成后

### 安全防护
**阅读：** `references/security-guidelines.md`
**时机：** 处理用户数据、接口对接时

### 测试编写
**阅读：** `references/testing-standards.md`
**时机：** 核心功能开发完成后

### 错误处理
**阅读：** `references/error-handling.md`
**时机：** 整个开发过程

## 5) 应用协作规范（必需）

### Git 提交
**阅读：** `references/git-conventions.md`

### 文档编写
**阅读：** `references/documentation-standards.md`

## 6) 最终检查（必需）

完成任务前,进行以下检查：

- **代码质量**：命名规范、JavaScript 语法、ESLint/Prettier 检查
- **功能完整性**：符合需求、边界处理、错误处理、用户交互
- **性能**：懒加载、全局状态优化、虚拟滚动、资源优化
- **安全**：输入验证、数据脱敏、接口安全、权限控制
- **文档**：README 更新、组件文档、关键注释、CHANGELOG

## 参考文档索引

### 核心规范（必读）
1. [目录结构规范](references/directory-structure.md)
2. [代码规范](references/code-standards.md)
3. [文件命名规范](references/naming-conventions.md)
4. [MVVM 规范](references/mvvm-patterns.md)
5. [Vite 配置规范](references/vite-config.md)

### 架构规范（按需）
6. [路由规范](references/router-best-practices.md)
7. [状态管理规范](references/state-management.md)
8. [组件封装规范](references/component-encapsulation.md)
9. [数据 Mock 规范](references/mock-data.md)
10. [依赖管理规范](references/dependency-management.md)
11. [构建与环境规范](references/build-environment.md)

### 质量保障（按需）
12. [性能优化规范](references/performance-optimization.md)
13. [安全规范](references/security-guidelines.md)
14. [测试规范](references/testing-standards.md)
15. [错误处理规范](references/error-handling.md)

### 协作规范（必需）
16. [Git 提交规范](references/git-conventions.md)
17. [文档规范](references/documentation-standards.md)

## 项目类型与技能包选择

### 项目类型选择

在执行前端项目初始化时，应根据项目类型选择对应的特定技能包：

| 项目类型 | 特定技能包 | 说明 |
|----------|------------|------|
| **PC 端项目** | `tsl-admin-best-practices` | 管理后台、业务系统、企业应用 |
| **大屏展示项目** | `tsl-big-screen-best-practices` | 数据可视化大屏、指挥中心、展厅展示 |

### origami-vue 组件库适用性

**⚠️ origami-vue 组件库仅适用于 PC 端项目：**

| 项目类型 | origami-vue | 说明 |
|----------|------------|------|
| **PC 端项目** | ✓ 可使用 | 管理后台风格的组件库 |
| **大屏展示项目** | ✗ 不使用 | 大屏项目不使用 origami-vue 组件库 |

## 技术栈参考

如果需要深入了解特定技术,可参考以下技能：

- **Vue 最佳实践**: `vue-best-practices` skill（所有项目）
- **Vue Router**: `vue-router` skill（所有项目）
- **Pinia 状态管理**: `pinia` skill（所有项目）
- **origami-vue 组件库**: `origami-vue` skill（仅 **PC 端项目**）
- **管理后台最佳实践**: `tsl-admin-best-practices` skill（仅 **PC 端项目**）
- **大屏展示最佳实践**: `tsl-big-screen-best-practices` skill（仅 **大屏展示项目**）
