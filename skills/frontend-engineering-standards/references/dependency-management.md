# 依赖管理规范

本文档定义前端项目的依赖管理、版本控制、依赖更新等标准。

---

## 依赖分类

### dependencies vs devDependencies

**dependencies:**
- 生产环境必需的依赖
- 运行时依赖
- 打包后仍需要的库

**devDependencies:**
- 开发环境依赖
- 构建工具
- 测试工具
- 代码检查工具

### 常见依赖分类

**生产依赖:**
- Vue、Vue Router、Pinia
- UI 组件库
- 工具库(lodash、dayjs)

**开发依赖:**
- Vite、TypeScript
- ESLint、Prettier
- Vitest、Playwright
- 构建插件

---

## 版本管理规范

### 语义化版本号

**版本格式:** `MAJOR.MINOR.PATCH`

- **MAJOR**: 不兼容的 API 修改
- **MINOR**: 向下兼容的功能新增
- **PATCH**: 向下兼容的问题修正

### 版本范围符号

| 符号 | 说明 | 示例 |
|------|------|------|
| `^` | 兼容版本更新 | `^1.2.3` → `>=1.2.3 <2.0.0` |
| `~` | 补丁版本更新 | `~1.2.3` → `>=1.2.3 <1.3.0` |
| `*` | 任意版本 | `*` → 任意版本 |
| `>` | 大于某版本 | `>1.2.3` |
| `>=` | 大于等于 | `>=1.2.3` |

### 版本锁定

**推荐做法:**
- 使用 `pnpm-lock.yaml` 锁定版本
- 提交锁文件到 Git
- 不手动修改锁文件

---

## 依赖安装规范

### 安装命令

**pnpm 命令:**
```bash
pnpm add package-name        # 安装生产依赖
pnpm add -D package-name     # 安装开发依赖
pnpm install                 # 安装所有依赖
pnpm update                  # 更新依赖
pnpm remove package-name     # 删除依赖
```

### 安装策略

**避免全局安装:**
- 项目依赖本地安装
- 使用 npm scripts 运行
- 避免版本冲突

**按需安装:**
- 只安装必要的依赖
- 避免安装相似的库
- 定期清理无用依赖

---

## 依赖更新策略

### 更新原则

1. **定期更新**: 每月检查并更新依赖
2. **小版本更新**: 优先更新 PATCH 和 MINOR 版本
3. **测试验证**: 更新后运行测试验证
4. **安全更新**: 及时修复安全漏洞

### 更新流程

```
检查可更新依赖
  ↓
查看更新日志
  ↓
小范围测试更新
  ↓
运行测试验证
  ↓
提交更新
```

### 更新工具

**推荐工具:**
- `pnpm outdated`: 检查过期依赖
- `pnpm update`: 更新依赖
- `npm-check-updates`: 批量更新

---

## 依赖安全

### 安全检查

**检查命令:**
```bash
pnpm audit        # 检查安全漏洞
pnpm audit fix    # 修复安全漏洞
```

### 安全策略

- 定期运行安全检查
- 及时修复高危漏洞
- 关注依赖的安全公告
- 避免使用有漏洞的版本

---

## 依赖优化

### 减少依赖体积

**优化措施:**
- 按需引入组件库
- 使用 Tree Shaking
- 避免重复依赖
- 使用更小的替代库

### 依赖分析

**分析工具:**
- `vite-plugin-visualizer`: 构建产物分析
- `bundlephobia`: 检查包大小
- `pnpm list`: 查看依赖树

---

## 私有依赖管理

### 私有 npm 仓库

**配置方式:**
```bash
# .npmrc
@company:registry=https://npm.company.com
registry=https://registry.npmjs.org
```

### 认证配置

**认证方式:**
- 使用 `.npmrc` 文件
- 使用环境变量
- 使用 CI/CD secrets

---

## 依赖管理检查清单

### 安装前检查

- [ ] 确认依赖必要性
- [ ] 检查包大小和依赖
- [ ] 查看维护状态和更新频率
- [ ] 检查安全漏洞

### 安装后检查

- [ ] 正确分类(dependencies vs devDependencies)
- [ ] 版本范围合理
- [ ] 更新锁文件
- [ ] 运行测试验证

### 定期维护

- [ ] 检查过期依赖
- [ ] 运行安全检查
- [ ] 清理无用依赖
- [ ] 更新安全漏洞