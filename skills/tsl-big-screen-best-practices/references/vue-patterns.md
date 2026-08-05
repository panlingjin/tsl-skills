# 大屏 Vue 所有权模式

## 目录

- [组件分区](#组件分区)
- [状态归属](#状态归属)
- [ECharts 所有权](#echarts-所有权)
- [弹层所有权](#弹层modal所有权)
- [dt-engine 所有权](#dt-engine-所有权)
- [资源清理](#资源清理)

通用 SFC、Props/Emits、响应式数据、Router、Pinia 和组件抽离规则读取 `frontend-engineering-standards`。本文件只定义大屏特有的组合和运行时所有权。

## 组件分区

保持根组件和路由视图轻量。典型场景拆为：

- 场景路由容器：组合页面并拥有 dt-engine 生命周期。
- Header：页面标题、时间和全局状态。
- LeftPanel / RightPanel：组织卡片，不创建全局场景资源。
- Scene、Map 或 Canvas：渲染底层空间内容。
- Feature Card / Chart：拥有局部展示和交互。
- PageSwitch、Modal、LlmControls：按各自 reference 维护独立契约。

一块 UI 同时包含独立数据编排、多个展示区域或资源副作用时，按通用组件抽离规范拆分。新 SFC 使用 PascalCase；路由视图使用 `HomeScreen.vue` 等语义名称，不新增 `index.vue` 公共入口。

## 状态归属

- 组件局部交互和普通 Feature Modal 可见性留在组件内。
- 多面板共享的数据、当前场景、跨功能 Modal 和 LLM 控制状态放入领域 Pinia Store。
- ECharts、SDK client、播放器和 dt-engine `meta` 等外部实例使用 `shallowRef`，不放入 Pinia，也不由 `reactive` 深代理。
- 生命周期无关的引擎命令、Page Switch 命令和 MCP action 放入 `services/`，不使用 `use` 前缀。
- 可复用且依赖 Vue 响应式或生命周期的行为放入 `composables/`。

## ECharts 所有权

使用 `assets/template/data-visualization/useECharts.js`：

- 一个图表组件只拥有一个实例。
- `nextTick` 后等待容器具有正的 `clientWidth/clientHeight` 再初始化。
- 用 `ResizeObserver` 监听图表元素；零尺寸表示等待，不是错误。
- Option 变化使用 `flush: 'post'`，Resize 只调整实例尺寸，不重复 `setOption`。
- Template ref 更换时释放旧元素拥有的实例并重新绑定。
- `theme` 和 `initOptions` 只在实例创建时读取；改变它们需要 dispose 后重建。
- 卸载时释放图表、Observer、animation frame 和 window fallback listener。

不要用固定图表宽度、任意 `setTimeout` 或重复无条件 `echarts.init()` 修复生命周期竞态。

## 弹层（Modal）所有权

实现弹层前读取 `modal-patterns.md`：

- `BaseModal.vue` 负责 Teleport、ARIA、Transition、关闭原因和 Slots。
- `useModalLifecycle.js` 负责顶层 Escape、Tab 循环、焦点恢复和引用计数滚动锁。
- Feature Modal 负责 API、验证、业务动作、播放器/图表及其清理。
- 使用 `v-model:open`，不维护平行的 `visible` 和 `open` 状态。
- 默认只允许一个主 Modal 和一个 Confirm；Feature 不发明任意 z-index。
- `keepMounted` 只保留 DOM，关闭后仍停止请求、计时器、媒体和监听器。

## dt-engine 所有权

- 只有渲染场景容器的路由视图调用 `init()` 和 `disposeEngine()`。
- 同一 JavaScript realm 只保持一个受路由拥有的活动引擎；子功能复用 `loadEngine()` 的缓存。
- `createEngineActions(meta)` 是无生命周期服务工厂，可由组件、Store 或 MCP handler 使用。
- 保存并调用所有 `addEventListener`、插件事件、相机跟随、动画和特效返回的清理函数。
- 目标项目使用非 `4.3.1-1` 版本时，先核对根导出和声明，不从包内部路径导入。
- 最终释放必须进入 `disposeEngine()` 并在内部 `await meta.dispose()`。

## 资源清理

创建资源的最小所有者负责清理：

| 资源 | 清理 |
| --- | --- |
| 轮询 / 延时器 | `clearInterval` / `clearTimeout` |
| DOM、window、SDK 事件 | 调用对应 remover 或 remove listener |
| WebSocket | unsubscribe；由连接所有者决定是否 close |
| ECharts / 观察器 / 动画帧 | dispose、disconnect、cancel |
| 动态 Vue app | `app.unmount()` 并移除 mount container |
| 媒体与 Object URL | pause/close/revoke |
| POI、特效、相机动作 | remove/clear/stop |
| dt-engine | 场景路由调用并完成 `disposeEngine()` |

检查打开、更新、替换、路由离开和组件卸载五条路径。异步操作需要取消、版本号或其他陈旧结果保护，不能在卸载后写入状态。
