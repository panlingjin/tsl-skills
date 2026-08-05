# 大屏数据接入

本文件只定义 Vue CLI/Webpack 大屏的数据接入例外。通用 API 分层、错误处理、安全、状态管理规则以 `$frontend-engineering-standards` 为准。

## HTTP 请求

新项目复制请求适配器：

```text
assets/template/integrations/request.js
  -> src/api/request.js
```

请求层只负责：

- 创建 Axios 实例并读取 `VUE_APP_API_BASE_URL`。
- 将成功响应归一化为业务 `data`。
- 将 HTTP、网络和业务失败统一拒绝为 `Error`。

请求层不得导入 Toast、Modal 或任何 UI 组件库。页面或业务 composable 捕获错误后决定如何展示；日志不得包含 token、完整请求体或客户敏感数据。

旧项目已有 `src/utils/axios.js` 时可以继续维护，不在普通任务中迁移路径；新增调用保持项目内一致。

## MockJS（Vue CLI）

仅在开发环境且 `VUE_APP_MOCK=true` 时动态加载 MockJS：

```js
if (process.env.NODE_ENV === 'development' && process.env.VUE_APP_MOCK === 'true') {
  import('@/mock')
}
```

- Mock 模块不得进入生产路径。
- Mock 响应必须复用真实接口的 envelope、分页和错误语义。
- 不复制 Vite 插件配置；Vue CLI 项目直接接入 MockJS。

## 轮询

- 页面可见且功能启用后再启动。
- 请求未完成时不启动下一轮，避免堆叠。
- 在 `onUnmounted`、路由离开或功能关闭时清理定时器。
- 使用退避或合理间隔；失败不可高频重试。
- 使用序号或 `AbortController` 防止旧响应覆盖新状态。

## WebSocket 连接

- URL 来自 `VUE_APP_*` 环境变量，不硬编码 token。
- 连接、消息、错误、关闭分别处理；解析外部消息前校验结构。
- 重连采用有上限的指数退避，主动关闭时停止重连。
- 组件、store 或服务中只能有一个明确所有者；所有者负责注销监听器和关闭连接。

## Pinia 边界

跨页面共享且需要缓存的数据进入 `stores/`；图表实例、定时器、WebSocket 对象和 dt-engine `meta` 不进入可序列化 store。旧项目采用 `store/` 时沿用现有结构。
