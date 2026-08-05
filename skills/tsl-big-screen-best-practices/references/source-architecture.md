# 大屏源码与资源契约

## 目录

- [适用边界](#适用边界)
- [场景级结构](#场景级结构)
- [基础模板](#基础模板)
- [数据可视化模板](#数据可视化模板)
- [弹层模板](#弹层模板modal)
- [可选集成模板](#可选集成模板)
- [资源包](#资源包)
- [入口与场景所有权](#入口与场景所有权)

## 适用边界

通用目录职责、文件命名和组件抽离服从 `frontend-engineering-standards`。本文件只规定大屏场景结构、模板复制路径和资源所有权。

新项目使用下列通用名称：

```text
src/
  api/
  assets/
    icons/svg/
    images/
    map/china/
    styles/
  components/
    common/
    business/
  composables/
  constants/
  plugins/
  router/
  services/
  stores/
  utils/
  views/
```

维护旧项目时不要为了匹配本树而重命名 `hooks/`、`store/`、`style/` 或现有组件；复制模板时将导入和目标路径适配到项目已有结构。

## 场景级结构

路由视图是场景组合面：

- 渲染全页 `#three-container` 或地图画布作为底层。
- 组合 Header、左右面板、Page Switch、Modal 和 LLM/MCP 控件。
- 初始化并最终释放该路由拥有的 dt-engine。
- 不承载卡片内部展示、图表实现或长业务动作序列。

新项目使用 `views/home/HomeScreen.vue` 等 PascalCase 路由视图。页面私有组件放在 `views/<feature>/components/`；跨页面能力按实际复用范围放入 `components/common/` 或 `components/business/`。

## 基础模板

```text
assets/template/project/babel.config.js
  -> babel.config.js
assets/template/project/vue.config.js
  -> vue.config.js
assets/template/project/jest.config.js
  -> jest.config.js
assets/template/layout/useScale.js
  -> src/composables/useScale.js
assets/template/integrations/dtEngine.js
  -> src/utils/dtEngine.js
assets/template/integrations/engineActions.js
  -> src/services/engineActions.js
assets/template/integrations/request.js
  -> src/api/request.js
```

只复制目标功能需要的模板。复制后按项目环境变量、部署路径和已安装包调整，不改变模板的生命周期与错误契约。

## 数据可视化模板

```text
assets/template/data-visualization/data-tokens.less
  -> src/assets/styles/data-tokens.less
assets/template/data-visualization/data-display.less
  -> src/assets/styles/data-display.less
assets/template/data-visualization/chartTheme.js
  -> src/utils/chartTheme.js
assets/template/data-visualization/chartOptions.js
  -> src/utils/chartOptions.js
assets/template/data-visualization/useECharts.js
  -> src/composables/useECharts.js
assets/template/data-visualization/chinaMap.js
  -> src/utils/chinaMap.js
```

职责保持分离：

- `chartTheme.js` 保存稳定的主题和图表结构默认值。
- `chartOptions.js` 将已归一化的特征数据转换为 ECharts option。
- `chinaMap.js` 只负责静态全国地图注册和三层静态 option。
- `useECharts.js` 负责正尺寸初始化、更新、ResizeObserver 和释放。
- 图表组件负责 DOM ref、loading/empty/error 和业务交互。
- 业务模块负责标签、单位、阈值语义和特征专属 option。

Option builder 不请求 API、不启动定时器，也不创建 ECharts 实例。

## 弹层模板（Modal）

```text
assets/template/modal/BaseModal.vue
  -> src/components/common/BaseModal/BaseModal.vue
assets/template/modal/useModalLifecycle.js
  -> src/composables/useModalLifecycle.js
assets/template/data-visualization/modal.less
  -> src/assets/styles/modal.less
```

`BaseModal.vue` 的普通 `<script>` 只用于 Vue 3.2 下设置 `inheritAttrs: false`，其余实现使用 `<script setup>`。Feature Modal 负责请求、表单、播放器、图表和业务清理；动态调用者负责 `app.unmount()` 并移除挂载容器。

## 可选集成模板

页面切换器（Page Switch）：

```text
assets/template/page-switch/usePageSwitch.js
  -> src/composables/usePageSwitch.js
assets/template/page-switch/useAutoCloseTimer.js
  -> src/composables/useAutoCloseTimer.js
assets/template/page-switch/pageSwitch.js
  -> src/services/pageSwitch.js
assets/template/page-switch/page-switch.less
  -> src/assets/styles/page-switch.less
```

LLM/MCP 控制：

```text
assets/template/llm/useLlmMcp.js
  -> src/composables/useLlmMcp.js
assets/template/llm/mcp.js
  -> src/services/mcp.js
assets/template/llm/frontControl.js
  -> src/services/frontControl.js
assets/template/llm/llm-controls.less
  -> src/assets/styles/llm-controls.less
```

这些是行为模板，不是完整应用脚手架。组件仍由目标设计和业务数据决定。

## 资源包

仅复制所选功能使用的资源：

```text
assets/icons/svg/*.svg          -> src/assets/icons/svg/
assets/icons/svg/weather/*.svg  -> src/assets/icons/svg/weather/
assets/img/switch/switch-base.png
  -> src/assets/images/switch/switch-base.png
assets/img/switch/switch-item-bg.png
  -> src/assets/images/switch/switch-item-bg.png
assets/img/decorations/*
  -> src/assets/images/decorations/
assets/map/china/*
  -> src/assets/map/china/
```

- Page Switch 不复制或渲染旧 `switch-icon.png`。
- 图标保留现有项目的 SVG 注册机制，不新增第二套图标系统。
- 装饰背景不注册为语义 SVG symbol。
- 地图和受保护装饰资源保持字节不变。
- 不复制参考项目字体、客户图片、私有 URL 或业务数据。

样式模板中的相对 URL 以 `src/assets/styles/` 为起点解析到 `../images/decorations/`；复制时保持该相对关系。

## 入口与场景所有权

`src/main.js` 只负责：

1. 导入共享请求和全局样式。
2. 创建 Vue app。
3. 安装 Pinia、Router 和应用插件。
4. 在 `VUE_APP_MOCK === 'true'` 时加载开发 Mock。
5. 挂载到 `#infraApp`。

不要在 `main.js` 或 `App.vue` 初始化 dt-engine。场景路由在容器挂载后初始化，并在卸载时调用 `disposeEngine()`；子面板、Page Switch 和 LLM/MCP 只复用缓存实例，不独立创建或释放引擎。

`App.vue` 保持为路由和缩放组合面：

```vue
<script setup>
import { useScale } from '@/composables/useScale'

useScale('#infraApp', { width: 1920, height: 1080 })
</script>

<template>
  <RouterView />
</template>
```
