# 构建、环境与依赖管理规范

本文件统一管理 Node.js、Yarn、依赖、环境变量、构建脚本和 CI。Vite 插件及打包细节参见 [Vite 配置规范](vite-config.md)。专项 Skill 明确使用其他构建工具时，构建配置、环境变量前缀和测试运行器服从专项 Skill；Yarn、依赖安全和 CI 质量要求仍服从本文件。

## 技术基线

### Node.js 与 Vite

- 先读取 `package.json`、锁文件、`.nvmrc` 和 CI 配置，确认项目当前的 Vite 与 Node.js 基线。
- 已有项目遵循其 Vite 主版本支持的 Node.js 范围，不因执行普通任务而升级运行时。
- 新项目使用当前 Vite 官方支持的 Node.js LTS 版本，并让 `package.json#engines.node`、`.nvmrc` 与 CI 的 `node-version` 保持一致。
- 当前版本要求以 [Vite 官方文档](https://vite.dev/guide/) 为准，不在规范中长期固定易过期的版本号。

### Yarn 版本识别

只使用 Yarn。优先读取 `package.json#packageManager` 判断版本；未声明时运行 `yarn --version`，再按实际主版本选择命令。

- 已有项目保持当前 Yarn 主版本和锁文件格式。
- 新项目默认使用 Yarn Classic 1.x，并使用团队锁定的具体版本。
- 提交 `yarn.lock`，不要手动编辑锁文件，不生成 `package-lock.json` 或 `pnpm-lock.yaml`。

## 依赖分类与版本

### dependencies 与 devDependencies

- `dependencies`：Vue、Vue Router、Pinia、HTTP 客户端、UI 组件库及其他运行时依赖。
- `devDependencies`：Vite、ESLint、Prettier、Vitest、Playwright 和构建插件。
- 安装前确认依赖必要性、维护状态、包体积、许可证和安全风险，避免功能重复的库。

版本使用语义化版本号。更新时先阅读变更日志，优先处理安全修复和兼容的小版本，并在更新后运行 lint、测试和构建。

## Yarn 命令

### 通用命令

```bash
yarn install
yarn add package-name
yarn add -D package-name
yarn remove package-name
yarn run script-name
```

### Yarn Classic（1.x）

```bash
yarn install --frozen-lockfile
yarn upgrade package-name
yarn outdated
yarn audit
```

### Yarn Modern（2+）

```bash
yarn install --immutable
yarn up package-name
yarn npm audit
```

不要在未确认 Yarn 主版本时复制 Classic 或 Modern 专属命令。

## 环境变量

### 文件约定

- `.env`：可提交的通用默认值。
- `.env.local`：本地覆盖，不提交到 Git。
- `.env.development`、`.env.staging`、`.env.production`：对应模式的可提交配置。
- 私密值由部署平台或 CI Secret 注入，不写入任何 `.env*` 示例。

客户端可见变量必须以 `VITE_` 开头并使用 UPPER_SNAKE_CASE：

```env
VITE_APP_TITLE=My App
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_MOCK=false
```

Vite 暴露的环境变量均为字符串。使用前校验必需值，并显式转换布尔值和数字：

```javascript
const enableMock = import.meta.env.VITE_ENABLE_MOCK === 'true'
```

## 构建脚本

项目至少提供与实际流程一致的脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest run"
  }
}
```

只有项目确实支持对应模式时才增加 `build:staging` 等脚本。不要在 Vite 配置中固定运行模式；通过 CLI 的 `--mode` 选择环境。

## CI

CI 使用项目锁定的 Node.js 与 Yarn 版本。以下示例适用于新建的 Yarn Classic 项目：

```yaml
name: CI
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'yarn'
      - run: yarn install --frozen-lockfile
      - run: yarn lint
      - run: yarn test
      - run: yarn build
```

已有 Yarn Modern 项目按项目基线启用 Corepack，并将安装命令替换为 `yarn install --immutable`。不要缓存 `node_modules` 或把构建产物作为依赖缓存；优先使用包管理器缓存。

## 依赖维护与安全

- 定期检查过期依赖和安全公告，但不要无验证地批量升级主版本。
- 对高危漏洞优先评估可利用性并升级、替换或隔离依赖。
- 私有仓库认证只使用环境变量或 CI Secret，不提交 token、用户名或内部凭据。
- 通过构建分析确认依赖体积和重复模块；不要仅凭包名强制拆分 Chunk。

## 检查清单

- [ ] Node.js、Vite、Yarn、`.nvmrc` 与 CI 版本一致
- [ ] 只存在 `yarn.lock`，安装命令匹配 Yarn 主版本
- [ ] 依赖分类、版本范围和许可证合理
- [ ] 环境变量无秘密信息，必需值已校验
- [ ] lint、测试、构建和预览脚本可执行
- [ ] 生产构建无错误，静态资源和 Source Map 策略符合部署要求
