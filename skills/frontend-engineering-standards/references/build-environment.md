# 构建与环境规范

本文档定义前端项目的环境配置、构建流程、环境变量管理等标准。

---

## 环境配置规范

### Node.js 版本管理

**版本要求:**
- Node.js >= 18.0.0
- 使用 LTS 版本
- 使用 nvm 或 fnm 管理版本

**版本锁定:**
- 项目根目录创建 `.nvmrc` 文件
- package.json 中指定 engines.node

### 包管理器选择

**强制使用 yarn:**
- 项目统一使用 yarn 进行包管理
- 禁止使用 npm 或 pnpm
- 确保依赖版本一致性

**配置文件:**
- `.yarnrc.yml`: yarn 配置（可选）
- `yarn.lock`: 依赖锁定文件（自动生成）

**安装命令:**
```bash
# 安装依赖
yarn install

# 添加依赖
yarn add [package-name]
yarn add -D [package-name]

# 移除依赖
yarn remove [package-name]
```

---

## 环境变量管理

### 环境变量文件

**文件命名:**
- `.env`: 默认环境变量
- `.env.local`: 本地环境变量(不提交到 Git)
- `.env.development`: 开发环境变量
- `.env.production`: 生产环境变量
- `.env.staging`: 预发布环境变量

### 环境变量命名规范

**命名规则:**
- 以 `VITE_` 开头(Vite 项目)
- 使用大写字母和下划线
- 简洁明确,易于理解

**常见变量:**
```
VITE_APP_TITLE=应用名称
VITE_API_URL=https://api.example.com
VITE_ENABLE_MOCK=true
VITE_APP_VERSION=1.0.0
```

### 环境变量使用

**访问方式:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL
const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD
```

**类型定义:**
```typescript
// src/env.d.ts
interface ImportMetaEnv {
  VITE_APP_TITLE: string
  VITE_API_URL: string
  VITE_ENABLE_MOCK: string
}
```

---

## 构建配置规范

### Vite 配置

**核心配置:**
```typescript
// vite.config.ts
export default defineConfig({
  base: '/',
  mode: 'production',
  root: process.cwd(),
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild'
  }
})
```

### 构建优化配置

**优化选项:**
- 代码分割(manualChunks)
- 压缩配置(minify)
- 资源处理(assetsInlineLimit)
- 构建速度优化

---

## 开发服务器配置

### 本地开发服务器

**配置要点:**
- 端口配置(port)
- 自动打开浏览器(open)
- 热更新(hmr)
- 代理配置(proxy)

**代理配置示例:**
```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

---

## 构建脚本规范

### package.json scripts

**常用脚本:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "build:prod": "vite build --mode production",
    "build:staging": "vite build --mode staging"
  }
}
```

### 构建流程

**标准流程:**
1. 安装依赖: `yarn install`
2. 开发调试: `yarn dev`
3. 代码检查: `yarn lint`
4. 运行测试: `yarn test`
5. 生产构建: `yarn build`
6. 预览构建: `yarn preview`

---

## CI/CD 配置

### GitHub Actions

**工作流配置:**
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'
      - run: yarn install --frozen-lockfile
      - run: yarn lint
      - run: yarn test
      - run: yarn build
```

### 构建优化

**缓存策略:**
- 缓存 node_modules
- 缓存构建产物
- 缓存依赖锁文件

---

## 构建产物规范

### 输出目录结构

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [name]-[hash].[ext]
└── favicon.ico
```

### 构建检查清单

- [ ] 构建无错误和警告
- [ ] 输出文件大小合理
- [ ] 静态资源正确引用
- [ ] 环境变量正确注入
- [ ] Source map 配置正确
- [ ] 压缩优化已启用