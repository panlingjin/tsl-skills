# Vite 配置规范

本文档定义前端项目 Vite 配置的标准，重点覆盖插件配置与组件库按需引入。

---

## 适用项目类型说明

**⚠️ 本文档中的 origami-vue 组件库配置仅适用于 PC 端项目：**

| 配置项 | PC 端项目 | 大屏展示项目 |
|--------|----------|--------------|
| **origami-vue 按需引入** | ✓ 需配置 | ✗ 不配置 |
| **vite-plugin-importer** | ✓ 需安装 | ✗ 不安装 |
| **manualChunks.origami-vue** | ✓ 需分包 | ✗ 不分包 |
| **SVG 图标插件** | ✓ 需配置 | ✓ 需配置（所有项目都需要） |

**注意**：大屏展示项目不应使用 origami-vue 组件库，该组件库专为管理后台风格的 PC 端项目设计。

---

## 插件配置规范

### 插件注册方式

Vite 插件通过 `plugins` 数组注册，支持以下两种方式：

```typescript
// 方式一：直接调用（推荐用于需要配置的插件）
plugins: [usePluginImport({ ... })]

// 方式二：直接引用（无需配置的插件）
plugins: [vue()]
```

### 插件注册顺序

- 框架插件优先注册（如 `@vitejs/plugin-vue`）
- 功能性插件其次注册（如按需引入、图标处理）
- 开发辅助插件最后注册（如可视化分析）

---

## origami-vue 按需引入配置

**⚠️ 仅适用于 PC 端项目：**
- 大屏展示项目**不应**使用 origami-vue 组件库
- 大屏展示项目**不需要**安装 vite-plugin-importer
- 本节内容仅在 PC 端项目中执行

### 为什么需要按需引入

origami-vue 提供了 37 个组件，全量引入会导致打包体积过大。通过 `vite-plugin-importer` 实现按需引入，仅打包实际使用的组件及其样式。

### 依赖安装（PC 端项目）

```bash
# 使用 yarn 安装（强制约束）
yarn add origami-vue
yarn add -D vite-plugin-importer

# origami-vue 所需依赖
yarn add @babel/runtime lodash-es
yarn add -D less
```

**注意**：请使用 `yarn` 进行包管理，禁止使用 npm 或 pnpm。

### 配置方法

在 `vite.config.ts` 中注册插件：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import usePluginImport from 'vite-plugin-importer'

export default defineConfig({
  plugins: [
    vue(),
    usePluginImport({
      libraryName: 'origami-vue',
      libraryDirectory: 'es',
      style: true,
    }),
  ],
})
```

### 配置项说明

| 配置项 | 值 | 说明 |
|--------|------|------|
| `libraryName` | `'origami-vue'` | 组件库包名，用于匹配 import 语句 |
| `libraryDirectory` | `'es'` | ES Module 目录，确保 Tree Shaking 生效 |
| `style` | `true` | 自动引入组件对应的样式文件 |

### 按需引入效果

配置后，代码中的全量引入写法：

```typescript
import { Button as OriButton } from 'origami-vue'
```

会被自动转换为：

```typescript
import { Button as OriButton } from 'origami-vue/es/button'
import 'origami-vue/es/button/style'
```

---

## vite.config.ts 完整示例

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import usePluginImport from 'vite-plugin-importer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    // 框架插件
    vue(),
    // 功能性插件
    usePluginImport({
      libraryName: 'origami-vue',
      libraryDirectory: 'es',
      style: true,
    }),
    createSvgIconsPlugin({
      iconDirs: [fileURLToPath(new URL('./src/icons', import.meta.url))],
      symbolId: 'icon-[name]',
      inject: 'body-last',
      customDomId: '__svg__icons__dom__',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'origami-vue': ['origami-vue'],
        },
      },
    },
  },
})
```

---

## 构建性能优化配置

### 代码分割（manualChunks）

通过 `build.rollupOptions.output.manualChunks` 将第三方依赖拆分为独立 chunk，优化缓存命中率和加载性能：

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vue-vendor': ['vue', 'vue-router', 'pinia'],
        'origami-vue': ['origami-vue'],
      },
    },
  },
},
```

**分包策略：**

| Chunk 名称 | 包含内容 | 说明 |
|-------------|----------|------|
| `vue-vendor` | vue、vue-router、pinia | 框架核心依赖，变动频率低，利于缓存 |
| `origami-vue` | origami-vue | 组件库单独分包，配合按需引入减少体积 |

### Chunk 大小警告阈值

```typescript
build: {
  chunkSizeWarningLimit: 1000, // 单位 KB，默认 500
},
```

当单个 chunk 超过阈值时 Vite 会输出警告。若已合理拆分仍超过默认值，可适当调高。

---

## SVG 图标转组件配置

### 为什么使用 vite-plugin-svg-icons

项目中使用 SVG 图标时，`vite-plugin-svg-icons` 可将 `src/icons` 目录下的 SVG 文件自动生成 SVG Sprite（雪碧图），实现：

- **合并请求**：N 个 SVG 文件合并为 1 个 Sprite，从 N 次 HTTP 请求减少为 1 次
- **按需渲染**：仅渲染页面实际使用的 `<symbol>`，未使用的图标不占用渲染资源
- **内置 SVGO 压缩**：自动压缩 SVG 代码，减小 Sprite 体积
- **HMR 支持**：修改 SVG 文件后页面实时更新，无需重启开发服务器

### 依赖安装

```bash
pnpm add -D vite-plugin-svg-icons
```

### vite.config.ts 配置

```typescript
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [fileURLToPath(new URL('./src/icons', import.meta.url))],
      symbolId: 'icon-[name]',
      inject: 'body-last',
      customDomId: '__svg__icons__dom__',
    }),
  ],
})
```

### 配置项说明

| 配置项 | 值 | 说明 |
|--------|------|------|
| `iconDirs` | `[path.resolve('./src/icons')]` | SVG 图标文件存放目录，支持多个目录 |
| `symbolId` | `'icon-[name]'` | 生成的 symbol ID 格式，`[name]` 为文件名 |
| `inject` | `'body-last'` | Sprite 注入 DOM 的位置 |
| `customDomId` | `'__svg__icons__dom__'` | Sprite 容器的 DOM ID |

### 注册脚本引入

在 `src/main.ts` 中引入注册脚本，使 Sprite 在页面加载时注入：

```typescript
import 'virtual:svg-icons-register'
```

### SvgIcon 封装组件

在 `src/components/common/SvgIcon.vue` 中封装通用图标组件：

```vue
<script setup lang="ts">
interface Props {
  name: string
  prefix?: string
  color?: string
  size?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  prefix: 'icon',
  color: 'currentColor',
  size: '1em',
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<template>
  <svg
    aria-hidden="true"
    :width="size"
    :height="size"
    :fill="color"
  >
    <use :href="symbolId" />
  </svg>
</template>
```

### 使用方式

```vue
<script setup lang="ts">
import SvgIcon from '@/components/common/SvgIcon.vue'
</script>

<template>
  <SvgIcon name="home" />
  <SvgIcon name="user" color="#1890ff" :size="24" />
</template>
```

### 图标目录结构约定

```
src/
├── icons/                # SVG 图标源文件目录
│   ├── home.svg          # 图标文件，文件名即为引用名称
│   ├── user.svg
│   └── setting.svg
```

**命名规范：**
- 文件名使用 kebab-case（如 `arrow-left.svg`）
- 文件名即为 `<SvgIcon name="arrow-left" />` 中的 `name` 值
- 避免在 SVG 中硬编码 `fill` 颜色，以支持通过 `color` 属性自定义

---

## 常见问题与注意事项

### style: true 的作用

设置 `style: true` 后，按需引入组件时会自动引入对应的样式文件，无需手动导入 CSS。如果不设置或设为 `false`，则需要手动引入样式，否则组件样式将丢失。

### 按需引入 vs 全量引入

| 对比项 | 按需引入 | 全量引入 |
|--------|----------|----------|
| 打包体积 | 仅包含使用的组件 | 包含全部组件 |
| 样式处理 | 自动引入对应样式 | 需手动引入全量样式 |
| 开发体验 | 无感知，写法不变 | 无感知 |
| 推荐场景 | 生产项目（推荐） | 快速原型验证 |

### 插件注册顺序

`vite-plugin-importer` 应在 `@vitejs/plugin-vue` 之后注册，确保 import 转换在 Vue SFC 编译之后执行。

---

## 大屏项目配置差异

### 配置差异说明

大屏展示项目与 PC 端项目在 Vite 配置上有以下关键差异：

| 配置项 | PC 端项目 | 大屏展示项目 |
|--------|----------|--------------|
| **origami-vue** | 安装并配置按需引入 | 不安装 |
| **vite-plugin-importer** | 安装并配置 | 不安装 |
| **@babel/runtime、lodash-es、less** | 安装（origami-vue 依赖） | 不安装 |
| **manualChunks** | 包含 `origami-vue` 分包 | 不包含 `origami-vue` 分包 |
| **SVG 图标插件** | 安装并配置 | 安装并配置（相同） |

### 大屏项目 vite.config.ts 示例

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    // 框架插件
    vue(),
    // SVG 图标插件（所有项目都需要）
    createSvgIconsPlugin({
      iconDirs: [path.resolve(__dirname, './src/icons')],
      symbolId: 'icon-[name]',
      inject: 'body-last',
      customDomId: '__svg__icons__dom__',
    }),
    // 注意：大屏项目不配置 vite-plugin-importer
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // 注意：大屏项目不包含 origami-vue 分包
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
        },
      },
    },
  },
})
```

### 大屏项目特定建议

1. **组件库选择**：大屏项目建议使用专门的图表库（如 ECharts）和 UI 组件库，而非 origami-vue
2. **尺寸适配**：大屏项目需要配置视口缩放适配（如 `postcss-px-to-viewport` 或 `v-scale-screen`）
3. **性能优化**：大屏项目应特别关注渲染性能，建议使用虚拟滚动、按需渲染等技术
