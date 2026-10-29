---
name: ai-sdk-best-practices
description: 指导 TSL 浏览器端 @tslfe/ai-sdk 的 TypeScript 接入与故障排查。适用于 LLM 对话、请求超时与错误处理、录音及语音识别、TTS、离线唤醒、浏览器 MCP 工具注册与语音指令联动，以及这些能力在 Vue 3 中的生命周期管理。不适用于 OpenAI SDK、Vercel AI SDK 或其他同名 SDK。
---

# TSL AI SDK 最佳实践

使用 `@tslfe/ai-sdk` 的真实公共 API 生成最小可用实现，并处理事件、错误和资源释放。说明、注释及面向用户的提示使用中文，API 标识符保持原名。

## 核对实际安装版本

接入前核对目标项目实际安装包的公开声明和运行行为，不仅凭包名称或版本号推断接口。

遇到资料冲突时，按以下顺序核对：

1. 目标项目实际安装包的公开声明和运行行为。
2. 与该安装包一致的接口参考和验证结果。
3. 演示和 README；仅用作辅助，不复制其中的凭据或旧用法。

运行时值与类型均从 `@tslfe/ai-sdk` 根入口导入。不要通过 `src`、`es`、`lib` 内部路径绕过导出限制。当前入口使用 `RecorderStatus`、`McpTool`、`SpeechConfig`、`SpeechEventData`、`WakeupConfig`；内部存在的旧别名不代表可以从根入口导入。

## 按任务加载参考资料

| 任务 | 接入路径 | 参考资料 |
| --- | --- | --- |
| 对话、ASR、自动播报 | `createllm` | [公共 API](references/api.md)、[运行时配置](references/configuration.md) |
| 独立录音、离线唤醒 | `createAudioRecorder`，随后 `initWakeUp` | [公共 API](references/api.md)、[运行时配置](references/configuration.md) |
| 独立 TTS、语音指令联动 | `Speech` 与 `process` 事件 | [公共 API](references/api.md) |
| 浏览器 MCP 工具服务 | `mcpServer` 与 MCP helper | [公共 API](references/api.md)、[运行时配置](references/configuration.md) |
| TypeScript 或 Vue 3 实现 | 按功能复用配置和清理模式 | [接入示例](references/examples.md) |
| 部署或运行失败 | 按症状定位 | [故障排查](references/troubleshooting.md) |

编写初始化代码前，先读取 API 和配置参考；只加载当前任务需要的其他资料。

## 接入流程

1. 确认是浏览器场景，并核对安装包导出。SSR 项目仅在客户端加载并初始化浏览器模块。
2. 复用项目现有配置机制，将应用名、短期 token、ASR/TTS 参数、超时、静态资源路径和 MCP 信息集中在项目配置入口，按使用的功能验证必填值。
3. 为对话提供非空 `application` 和必填 `notify`。WebSocket 固定连接当前页面域名下的 `/v1/llm/ws/...`，通过同源服务或代理对接后端；不存在 `wsOrigin` 初始化参数。
4. 文本对话显式设置 `autoInitRecorder: false` 和 `tts.enable: false`。实例仍会创建录音对象与 `Speech`，因此仍依赖浏览器、存储及 Web Audio，不能当作纯 Node 客户端。
5. 在开始录音、唤醒、播报或 MCP 连接前注册事件；`createllm` 会在创建时自动发起连接，应在返回后立即注册监听。处理初始化同步异常及异步错误。
6. 麦克风授权与音频恢复优先由用户操作触发。启用唤醒时先初始化录音，再等待 `initWakeUp(...)` 就绪，最后调用 `listen()`。
7. 通过 `LLMErrorCode` 区分连接错误、服务端错误和请求连续无响应超时。`send`、`inputMessage` 返回 `void`，不能当成服务端完成 Promise；需要捕获发送阶段异常时使用 `chatWithModel`。
8. 通过 `Speech` 的 `process` 取得 `command`，交给应用已有的指令分发逻辑。SDK 不会自动调用浏览器 MCP 工具；`end` 表示当前语音队列结束，不是服务端请求完成或业务指令执行完成。
9. 对每个实例安排释放：组合实例调用 `llm.close()`，独立实例调用 `recorder.close()`、`speech.close()`，MCP 调用并等待 `mcp.close()`；解除应用事件监听，撤销应用创建的对象 URL。

Vue 3 使用 Composition API，在 `onMounted` 中初始化，将外部 SDK 实例放入 `shallowRef`，在 `onUnmounted` 中清理。SSR 下若静态导入会执行浏览器代码，应在客户端边界动态导入 SDK。

## 实现边界

- 保留项目现有框架、包管理器和配置约定，不为使用技能迁移项目。
- 浏览器环境变量和注入配置都是公开数据；长期密钥保留在后端，使用项目认可的短期凭据或代理。不要生成看似可用的假 token。
- `closeConnection()` 仅关闭连接并清除请求计时器；最终卸载使用 `close()`。
- 唤醒模型和 WASM 不在当前 npm 发布白名单中，必须另行部署并验证响应内容；不能仅凭安装成功宣称唤醒可用。
- `LLMEventType.progress` 虽有类型声明，当前实现未主动触发；`LLMEventType.close` 由实例销毁触发，不能用于判断所有网络断线。
- MCP helper 失败可能返回空对象，`connect()` 部分异常只写日志；不要把 Promise 正常返回视为必然连接成功。
