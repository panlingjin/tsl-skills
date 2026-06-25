# Project Setup

## Baseline

Create a Vue CLI-compatible Vue 3 big-screen app.

Default stack:

- `vue` 3.x
- `@vue/cli-service` 5.x
- `vue-router` 4.x
- `pinia` 3.x when possible, or Pinia 2.x only when project constraints require it
- `axios`
- `mockjs`
- `less` and `less-loader`
- `svg-sprite-loader`
- `style-resources-loader` and `vue-cli-plugin-style-resources-loader`
- `echarts`
- `countup`
- `origami-vue`
- `@tslfe/ai-sdk` when LLM/MCP is required
- `@tslfe/dt-engine@4.3.1-1` when digital-twin scenes are required
- `zod@3.23.8` when MCP input schemas are required

Only force exact versions for:

```json
{
  "zod": "3.23.8",
  "@tslfe/dt-engine": "4.3.1-1"
}
```

Use compatible project versions for other dependencies. Do not lock every package in the skill unless a project asks for strict reproducibility.

## Package Scripts

Provide these scripts unless the project has a different established command:

```json
{
  "serve": "vue-cli-service serve",
  "build": "vue-cli-service build --mode master",
  "build:develop": "vue-cli-service build --mode development",
  "build:test": "vue-cli-service build --mode test",
  "build:master": "vue-cli-service build --mode master",
  "test:unit": "vue-cli-service test:unit",
  "lint": "vue-cli-service lint"
}
```

If TSL CLI is required, keep the same environment modes and replace the script body with the appropriate `tsl-cli` command.

## Required Project Config

When creating a project from zero, generate these files before writing feature code:

- `babel.config.js`
- `package.json` with `eslintConfig`
- `.eslintignore`
- `.editorconfig`
- `.ls-lint.yml`
- `jest.config.js`

Do not omit Babel or ESLint config. Vue CLI projects generated from this skill must be able to run `vue-cli-service serve`, `vue-cli-service build`, and `vue-cli-service lint` without failing because base config files are missing.

### Babel

Create `babel.config.js`:

```js
const plugins = [
  ["import", { libraryName: "origami-vue", libraryDirectory: "es", style: true }],
  ["@babel/plugin-proposal-private-methods"]
];

module.exports = {
  presets: ["tsl-cli-helper/preset"],
  plugins
};
```

Add the matching dev dependencies:

```json
{
  "@babel/core": "^7.12.16",
  "@babel/plugin-proposal-private-methods": "^7.18.6",
  "@vue/cli-plugin-babel": "~5.0.0",
  "@vue/cli-service": "^5.0.8",
  "babel-jest": "^27.0.6",
  "svg-sprite-loader": "^6.0.11",
  "tsl-cli-helper": "^2.1.13"
}
```

### ESLint

Add this baseline to `package.json`:

```json
{
  "eslintConfig": {
    "root": true,
    "extends": ["tsl-standard"],
    "rules": {
      "global-require": 0,
      "import/no-dynamic-require": 0,
      "no-shadow": "off",
      "no-param-reassign": "off",
      "no-plusplus": "off",
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-var-requires": "off",
      "vue/no-multiple-template-root": "off",
      "vue/multi-word-component-names": "off",
      "vue/require-prop-type-constructor": "off"
    },
    "globals": {
      "defineProps": "readonly",
      "defineExpose": "readonly",
      "defineEmits": "readonly",
      "withDefaults": "readonly"
    }
  }
}
```

Add the matching dev dependencies:

```json
{
  "eslint-config-tsl-standard": "vue",
  "eslint-plugin-prettier": "^4.2.1",
  "prettier": "^2.8.4"
}
```

Create `.eslintignore`:

```text
iconfont.js
public/*
```

### Editor, File Naming, And Jest

Create `.editorconfig` with 2-space indentation, LF endings, UTF-8, final newline, and trailing-whitespace trimming.

Create `.ls-lint.yml` using the naming rules in `references/quality-checks.md`.

Create `jest.config.js`:

```js
module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "vue"],
  testMatch: ["**/tests/unit/**/*.(spec|test).[jt]s?(x)", "**/__tests__/*.[jt]s?(x)"]
};
```

## Vue CLI Config

Create `vue.config.js` with:

- `devServer.headers["Access-Control-Allow-Origin"] = "*"` for local integration.
- `devServer.proxy` entries that read targets from environment variables. Never hard-code private hosts in generated projects.
- `chainWebpack` SVG sprite config for `src/assets/icons`.
- `pluginOptions["style-resources-loader"]` pointing at `src/assets/style/var.less`.
- Less `modifyVars` only when the UI library theme requires it.
- UMD output settings only when the app must be consumed by a container.
- Image asset rules only when model/runtime assets must remain file URLs instead of base64.

Default complete `vue.config.js`:

```js
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  devServer: {
    host: "0.0.0.0",
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    proxy: process.env.VUE_APP_BASE_URL
      ? {
          "/api": {
            target: process.env.VUE_APP_BASE_URL,
            changeOrigin: true,
            pathRewrite: { "^/api": "" }
          }
        }
      : undefined
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [resolve("src/assets/style/var.less")]
    }
  },
  chainWebpack: (config) => {
    config.module.rule("svg").exclude.add(resolve("src/assets/icons")).end();

    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: (filePath) => {
          const relativePath = path
            .relative(resolve("src/assets/icons/svg"), filePath)
            .replace(/\\/g, "/")
            .replace(/\.svg$/, "");

          return `icon-${relativePath.replace(/\//g, "-")}`;
        }
      })
      .end();
  }
};
```

Merge additional project-specific options into this single `module.exports`. Do not create a second `module.exports`. If the project has no `VUE_APP_BASE_URL`, leave `devServer.proxy` undefined instead of hard-coding a private host. The custom `symbolId` keeps root icons as `#icon-swiper-item-icon` and nested weather icons as `#icon-weather-qing`.

## Environment Files

Use `.env`, `.env.development`, `.env.test`, and `.env.master` for build-time configuration.

Allowed variable categories:

- `VUE_APP_BASE_URL`
- `VUE_APP_MOCK`
- `VUE_APP_LLM_APP_CODE`
- `VUE_APP_MCP_SERVER_NAME`
- `VUE_APP_DTENGINE_WS`
- `VUE_APP_TACOS_LOAD_MODE`
- service base URLs represented as placeholders

Every generated project must define the MockJS switch in `.env`:

```env
VUE_APP_MOCK = true
```

Treat `true` as the default for every mode. Mode-specific environment files inherit this value unless they explicitly set `VUE_APP_MOCK = false`. Do not make MockJS activation depend implicitly on `NODE_ENV`.

When the project uses `@tslfe/dt-engine` in local Unity EXE mode, `.env` must include these fixed values:

```env
VUE_APP_TACOS_LOAD_MODE = unity-exe
VUE_APP_DTENGINE_WS = ws://127.0.0.1:8181
```

When the project uses LLM/MCP, `.env` must include this fixed value:

```env
VUE_APP_MCP_SERVER_NAME = bigscreen
```

Treat the dt-engine values as required local development defaults. Treat `VUE_APP_MCP_SERVER_NAME = bigscreen` as the required MCP server default for big-screen projects. Put these values in `.env` so every mode can read the default runtime connection/server name unless a mode-specific env file intentionally overrides it. Do not replace them with placeholders unless the user explicitly chooses another runtime mode.

Never commit real tokens, app secrets, JWTs, private hostnames, or customer-specific identifiers. Use placeholder values and document where deployment supplies real values.

## HTML Shell

In `public/index.html`:

- Use `<div id="infraApp"></div>` as the default mount element.
- Include viewport settings that prevent browser zoom on screen terminals.
- Use transparent-capable meta and dark theme color when the screen overlays a renderer.
- Keep vendor scripts out of `index.html` unless a runtime library cannot be bundled.

## TSL Config

Create `tsl.config.json` only when the project uses TSL tooling. Keep it generic:

```json
{
  "type": "project",
  "name": "tsl-big-screen",
  "micro": {
    "type": "project",
    "name": "tsl-big-screen",
    "enable": false,
    "register": []
  },
  "main": {
    "devServer": {
      "open": true,
      "port": 9900,
      "host": "0.0.0.0"
    }
  }
}
```
