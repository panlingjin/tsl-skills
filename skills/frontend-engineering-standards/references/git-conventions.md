# Git 提交规范

本文档定义前端项目的 Git 工作流、分支管理、提交信息规范、Code Review 流程等最佳实践。

---

## 分支命名规范

### 分支类型

| 分支类型 | 命名格式 | 说明 |
|---------|---------|------|
| 主分支 | main / master | 生产环境代码 |
| 开发分支 | develop | 开发环境代码 |
| 功能分支 | feature/<feature-name> | 新功能开发 |
| 修复分支 | fix/<bug-name> | Bug 修复 |
| 热修复分支 | hotfix/<issue-name> | 生产环境紧急修复 |
| 发布分支 | release/<version> | 版本发布准备 |
| 重构分支 | refactor/<refactor-name> | 代码重构 |
| 文档分支 | docs/<doc-name> | 文档更新 |
| 测试分支 | test/<test-name> | 测试相关 |

### 分支命名规则

**命名格式:**
```
<type>/<ticket-id>-<short-description>
```

**命名约定:**
- 使用小写字母和短横线
- 简洁明确,不超过 50 个字符
- 包含任务 ID(如果有)
- 避免特殊字符

### Git Flow 工作流

```
main (生产环境)
  ↓ hotfix
develop ←→ release
  ↓ feature
```

---

## Conventional Commits 规范

### 提交消息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| Type | 说明 |
|------|------|
| feat | 新功能 |
| fix | Bug 修复 |
| docs | 文档更新 |
| style | 代码格式(不影响功能) |
| refactor | 重构 |
| perf | 性能优化 |
| test | 测试相关 |
| build | 构建系统或依赖更新 |
| ci | CI 配置更改 |
| chore | 其他不修改 src 或测试的更改 |
| revert | 回滚之前的提交 |

### Scope 范围

常见 scope:
- api: API 相关
- auth: 认证授权
- components: 组件相关
- composables: Composables
- config: 配置文件
- deps: 依赖更新
- router: 路由
- store: 状态管理
- utils: 工具函数
- views: 页面视图

### Subject 主题

- 使用祈使句,现在时态
- 首字母小写
- 结尾不加句号
- 简洁明确,不超过 50 个字符

### Footer 页脚

- **不兼容变动**: 以 `BREAKING CHANGE:` 开头
- **关闭 Issue**: 以 `Closes` 开头

---

## Code Review 流程

### Review 检查清单

**功能性:**
- [ ] 代码是否实现了需求的功能?
- [ ] 边界情况是否被正确处理?
- [ ] 是否有潜在的 Bug?

**代码质量:**
- [ ] 代码是否清晰易读?
- [ ] 命名是否规范且有意义?
- [ ] 是否有重复代码可以抽取?

**性能:**
- [ ] 是否有性能问题?
- [ ] 是否有不必要的计算或请求?

**安全性:**
- [ ] 是否有安全漏洞(XSS、CSRF等)?
- [ ] 敏感数据是否被正确处理?

**测试:**
- [ ] 是否有单元测试?
- [ ] 测试覆盖率是否足够?

### Pull Request 模板

```markdown
## 变更类型
- [ ] 新功能(feat)
- [ ] Bug 修复(fix)
- [ ] 重构(refactor)

## 变更说明
<!-- 简要描述本次 PR 的变更内容 -->

## 关联 Issue
Closes #

## 检查清单
- [ ] 代码符合项目规范
- [ ] 已添加必要的测试
- [ ] 所有测试通过
```

### Review 流程步骤

```
开发者创建 PR
  ↓
CI 自动检查
  ↓
Reviewer 进行代码审查
  ↓
开发者处理 Review 意见
  ↓
合并 PR
```

---

## Merge 策略

### Merge 方法对比

| 方法 | 说明 | 适用场景 |
|------|------|---------|
| Merge Commit | 创建合并提交 | 长期分支、团队协作 |
| Squash and Merge | 压缩所有提交 | 功能分支合并到主分支 |
| Rebase and Merge | 变基后快进合并 | 保持线性历史 |

### 推荐策略

```
feature/fix 分支 → develop: Squash and Merge
develop → release: Merge Commit
release → main: Merge Commit
hotfix → main: Merge Commit
```

---

## Git Hooks 配置

### 常用 Hooks

**pre-commit:**
- 运行代码格式化工具
- 运行 lint 检查
- 检查提交信息格式

**commit-msg:**
- 验证提交消息格式
- 添加 Issue 编号

**pre-push:**
- 运行测试
- 检查构建

### 配置工具

**husky:** Git hooks 工具
**lint-staged:** 只对暂存文件运行 linters
**commitlint**: 提交消息格式检查

---

## CHANGELOG 生成

### 生成工具

- **standard-version**: 自动生成 CHANGELOG
- **semantic-release**: 自动化版本发布
- **conventional-changelog**: CHANGELOG 生成器

### CHANGELOG 要求

生成工具只负责从提交历史整理候选条目；版本号、分类、日期、Issue 和文案格式统一遵循 `documentation-standards.md`，不要在本文件维护第二套格式规则。
