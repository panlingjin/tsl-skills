# Vue CLI 5 / Webpack 项目适配

## 目录

- [适用边界](#适用边界)
- [依赖与 Yarn](#依赖与-yarn)
- [脚本与配置模板](#脚本与配置模板)
- [Webpack 与 SVG](#webpack-与-svg)
- [环境变量](#环境变量)
- [HTML 外壳](#html-外壳)
- [TSL 配置](#tsl-配置)

## 适用边界

本文件只定义 `frontend-engineering-standards` 未覆盖的 Vue CLI 5/Webpack 适配。通用目录、命名、JavaScript、Yarn、安全和代码质量继续服从通用规范。

- 新建大屏使用 Vue 3、Vue CLI 5、Webpack、Composition API 和 `<script setup>`。
- 维护项目先读取 `package.json`、`yarn.lock`、`vue.config.js`、Babel、Jest 和 CI；沿用已存在的兼容版本。
- 不把项目迁移到其他构建系统，也不把其他构建工具的插件、环境变量或配置复制进来。
- 新项目使用 `composables/`、`stores/`、`src/assets/styles/`、PascalCase SFC 和 camelCase JavaScript。
- 旧项目采用 `hooks/`、`store/` 或 `src/assets/style/` 时，维护任务沿用旧结构，不做无关迁移。

## 依赖与 Yarn

默认运行时能力按需选择：

- 必需：`vue`、`vue-router`、`pinia`、`axios`、`less`、`less-loader`、`echarts`。
- Webpack SVG：`svg-sprite-loader`。
- 全局 Less 变量：`style-resources-loader` 与 `vue-cli-plugin-style-resources-loader`，仅在项目确实需要时添加。
- 开发 Mock：`mockjs`，仅在开发 Mock 被请求时添加。
- 数字动效：`countup.js`，仅在计数动效被请求时添加。
- LLM/MCP：`@tslfe/ai-sdk` 与 `zod@3.23.8`，仅在功能需要时添加。
- 数字孪生：新项目默认安装最新版 `@tslfe/dt-engine`（`npm view @tslfe/dt-engine version` 取最新稳定版）；维护项目沿用已安装版本并按其公共导出核对 API。

新项目使用团队统一的 Yarn Classic 1.x 并提交 `yarn.lock`，不创建 Yarn Modern 专用的 `.yarnrc.yml` 或 `nodeLinker` 配置。团队模板已经声明 `packageManager` 时保持其 Yarn 1 精确版本，否则不为此引入 Corepack。维护项目沿用现有 Yarn 主版本；不生成 npm 或 pnpm 锁文件。

## 脚本与配置模板

新项目提供：

```json
{
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build --mode master",
    "build:develop": "vue-cli-service build --mode development",
    "build:test": "vue-cli-service build --mode test",
    "build:master": "vue-cli-service build --mode master",
    "test:unit": "vue-cli-service test:unit",
    "lint": "vue-cli-service lint"
  }
}
```

目标项目已有不同命令时沿用现状。只有实际使用 TSL CLI 时才替换脚本主体，并保持相同环境模式。

按需复制配置模板：

```text
assets/template/project/babel.config.js -> babel.config.js
assets/template/project/vue.config.js   -> vue.config.js
assets/template/project/jest.config.js  -> jest.config.js
```

配置规则：

- Babel 默认使用 `@vue/cli-plugin-babel/preset`；只有目标项目已经依赖 `tsl-cli-helper/preset` 时才沿用该 preset。
- 不安装 `babel-plugin-import`，不配置 UI 组件库按需加载。
- Jest 只匹配 JavaScript 与 Vue 文件，不声明 `.ts`、`.tsx` 或 TypeScript 转换。
- ESLint 沿用目标项目兼容格式；Vue CLI 旧项目可以使用 legacy config，但不关闭多词组件名、Promise、未使用变量或生产调试代码检查。
- `App.vue` 是允许的单词组件名；不要为 `index.vue` 关闭全局命名规则，新建路由视图使用 `HomeScreen.vue` 等 PascalCase 名称。
- Prettier 使用通用规范的单引号、无分号和 2 空格配置。

## Webpack 与 SVG

`vue.config.js` 模板包含：

- `publicPath: '/'` 和关闭生产 Source Map 的默认值。
- 从 `VUE_APP_API_PROXY_TARGET` 读取开发代理；未配置时不创建代理。
- 将 `src/assets/icons` 从默认 SVG rule 排除，并使用 `svg-sprite-loader` 注册 `src/assets/icons/svg`。
- 根图标生成 `#icon-name`，嵌套图标生成带目录前缀的 symbol id。
- 可选的 Less 全局变量文件为 `src/assets/styles/variables.less`。
- UMD、图片 file URL 和其他 loader 只在目标项目确实需要时增加。

本地跨应用联调需要 CORS 响应头时显式启用，不把 `Access-Control-Allow-Origin: *` 作为默认配置。开发服务器若监听 `0.0.0.0`，必须确认所在网络和访问边界。

## 环境变量

使用 `.env`、`.env.development`、`.env.test` 和 `.env.master`。客户端变量统一使用 `VUE_APP_`，使用前校验和转换。

允许的常见变量：

- `VUE_APP_BASE_URL`
- `VUE_APP_API_PROXY_TARGET`
- `VUE_APP_MOCK`
- `VUE_APP_LLM_APP_CODE`
- `VUE_APP_MCP_SERVER_NAME`
- `VUE_APP_DTENGINE_WS`
- `VUE_APP_TACOS_LOAD_MODE`

Mock 必须显式分模式：

```env
# .env.development
VUE_APP_MOCK=true

# .env.test / .env.master
VUE_APP_MOCK=false
```

不要在共享 `.env` 中启用 Mock，也不要只根据 `NODE_ENV` 推断。

本地 Unity EXE 模式可以在 `.env.development` 使用：

```env
VUE_APP_TACOS_LOAD_MODE=unity-exe
VUE_APP_DTENGINE_WS=ws://127.0.0.1:8181
```

测试和 master 环境必须提供部署值，不继承 localhost。LLM/MCP 项目可使用非敏感默认值 `VUE_APP_MCP_SERVER_NAME=bigscreen`。客户端环境变量不能保存 token、App Secret、JWT 或其他秘密。

## HTML 外壳

`public/index.html` 使用 `<div id="infraApp"></div>` 作为默认挂载点，并提供标准 viewport、透明背景支持和与场景一致的 theme color。

- 默认保留浏览器缩放能力，不写 `user-scalable=no` 或限制 `maximum-scale`。
- 只有经过批准的专用 kiosk 容器负责锁定终端缩放时，才由容器策略处理。
- 第三方脚本优先通过构建系统引入；只有无法打包的运行时库才放入 HTML。

## TSL 配置

只在项目使用 TSL 工具时创建 `tsl.config.json`。使用通用项目名和端口配置，不复制客户名、私有服务地址或生产注册信息。已有项目保留其配置结构，不因普通功能修改重写。
