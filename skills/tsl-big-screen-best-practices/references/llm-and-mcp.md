# LLM 与 MCP 控制

仅当大屏需要自然语言控制或 MCP 工具时加载本文件。不要为普通图表、卡片或标题引入 LLM 依赖。

## 模板

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

## 生命周期

`useLlmMcp()` 是组件生命周期所有者：挂载时注册，卸载时注销。`mcp.js` 只定义工具与 Schema，`frontControl(payload, context)` 只做动作编排；后两者都不是 composable。

同一工具只注册一次。异步注销必须等待完成；页面卸载后不得继续回写状态。

## 前端控制（Front Control）上下文

调用方显式注入：

```js
await frontControl(payload, {
  meta,
  router,
  refreshData,
  onUnhandled,
})
```

- 不导入全局 Router。
- 不默认调用 `window.location.reload()`。
- dt-engine 命令通过 `createEngineActions(meta)` 执行。
- 未识别动作交给 `onUnhandled`；未提供处理器时抛出 `Error`。
- `refreshData`、Router 或引擎不可用时明确失败，不静默降级。

## 外部输入

- 动作类型在 Zod Schema 中使用 `z.literal()`，不要用无参数 `z.string()` 代替固定命令。
- 场景索引用 `z.coerce.number().int().nonnegative()` 转换并校验。
- 路由只允许应用定义的内部路径；不把任意 URL 传给 Router。
- 参数校验失败直接拒绝，错误信息不得泄露提示词、token、私有地址或客户数据。

## 控件可访问性

LLM 快捷入口使用真实按钮，提供 `aria-label`、禁用态和 `:focus-visible`。加载中避免重复提交；`prefers-reduced-motion` 下关闭非必要旋转、闪烁和位移动效。所有控件留在统一缩放根和 Modal 层级体系内。
