# 公共 API 参考

本参考介绍 `@tslfe/ai-sdk` 的公共接口与使用行为。接入不同安装版本时，重新核对该版本的根入口导出和类型声明。

目录：根导出、对话与消息、超时与错误、录音、唤醒、TTS 与指令、MCP。

## 根入口导出

运行时导出：

```ts
import {
  version,
  AudioEventType,
  createAudioRecorder,
  RecorderStatus,
  StopTrigger,
  Speech,
  SpeechType,
  Wakeup,
  AsrMode,
  createLLMDefaultConfig,
  createllm,
  LLMErrorCode,
  LLMEventType,
  MessageType,
  OUTPUTTYPE,
  getMcpConfig,
  getMcpInfo,
  getMcpToken,
  getMcpUserInfo,
  mcpEvent,
  mcpServer
} from "@tslfe/ai-sdk";
```

类型导出，按需使用 `import type`：

```ts
import type {
  AudioEventData, AudioInstance, AudioProcessEventData, AudioRecordConfig,
  AudioStartEventData, AudioStopEventData, StartOptions,
  SpeechConfig, SpeechEventData, SpeechInstance, AliTtsConfig, BytedanceTtsConfig,
  WakeupConfig, WakeupMode, WakeupState,
  AsrResult, LLMConfig, LLMErrorData, LLMEventData, LLMInstance, LLMMessage,
  LLMOutput, LLMRequestData, LLMRequestOptions, LLMResponseData, LLMSendParams,
  LLMSocket, LLMSpeechConfig, LLMWakeupConfig, LLMWebSocketConfig, SendInfo,
  McpEventData, McpEventType, McpFailData, McpInfo, McpRecord, McpSuccessData,
  McpTool, McpToolAnnotations, McpCommand
} from "@tslfe/ai-sdk";
```

旧文档中的 `RecoderStatus`、`Tool`、小写 `wakeupConfig/wakeupMode/wakeupState` 已不在根入口导出。`AudioTimer`、`RecordingStateManager`、`waveData` 也不是根入口 API；不要导入它们。使用 `SpeechConfig` 和 `SpeechEventData`，不要导入不存在的 `SpeechOptions`、`SpeechEventMap`、`McpEventMap`。

## 对话初始化与发送

`createllm(config: LLMConfig): LLMInstance` 创建连接、录音对象和 `Speech`。配置字段：

| 字段 | 类型与行为 |
| --- | --- |
| `application` | 必填非空字符串，否则同步抛错 |
| `notify` | 必填 `0 \| 1` |
| `recordConfig` | 必填 `AudioRecordConfig`，可传 `{}` |
| `clientId` | 可选；否则复用 `localStorage.clientId` 或生成并保存 |
| `notifications` | 可选 `string[]` |
| `notify_id`、`notify_name`、`token` | 可选字符串，参与连接查询参数 |
| `autoInitRecorder` | 默认 `true`；文本场景设为 `false` |
| `wsConfig` | `LLMWebSocketConfig`：重连次数、间隔、心跳和请求超时 |
| `tts` | `LLMSpeechConfig`，即 `SpeechConfig` 加 `enable?`、`stopSpeechOnNewOrAbort?` |
| `wakeup` | `LLMWakeupConfig`：`enable`、`wakeupOnly?`；当前对话实现未据此自动初始化唤醒 |
| `ui` | 类型中声明的可选布尔值；当前实现未据此创建机器人 UI |

连接地址为当前页面协议对应的 `ws/wss://当前域名/v1/llm/ws/{application}/{clientId}?...`，不接受独立的 WebSocket origin。完整配置方式见 [运行时配置](configuration.md)。

`createLLMDefaultConfig()` 默认启用自动录音初始化和字节跳动 TTS，`notify: 0`、`requestTimeout: 30000`、`stopSpeechOnNewOrAbort: true`，关闭唤醒。默认对象使用空应用名，也没有可用的厂家凭据，不能直接当作完整业务配置。

| 方法或属性 | 说明 |
| --- | --- |
| `send({ text, type?, options? })` | 推荐的发送入口，`type` 默认 `MessageType.Request`，返回 `void` |
| `inputMessage(text, options?)` | 普通文本请求，返回 `void` |
| `chatWithModel(text, type?, options?)` | 返回 `Promise<void>`，只代表发送阶段，不等待服务端响应 |
| `setRequestOption(options)` | 替换保存的公共请求选项；不是将新选项合并到之前的公共选项 |
| `on(type, callback)`、`off(type, callback)` | 类型化事件监听；`on` 返回取消订阅函数 |
| `setAutoPlay(enabled)` | 控制自动 TTS；关闭时调用 `pauseAudio()` |
| `getTTS({ text, request_id? })` | 仅在 TTS 启用时入队；返回的 Promise 不代表播报完成 |
| `recorder`、`speech`、`socket` | 关联实例；`LLMSocket` 仅声明 `connect/send/close` |
| `closeConnection()` | 清除请求计时器、关闭 WebSocket |
| `close()` | 清除计时器，关闭录音、连接和语音，并触发实例 `close` |

`LLMRequestOptions = Partial<LLMRequestData>`。请求数据包含 `text`、`notifications`、`context?`、`features?`、`request_id?`。每次发送以默认数据、公共选项、单次选项的顺序用 Lodash `merge` 合并；嵌套对象及数组不是简单覆盖。并行请求如自定义 `request_id`，应确保唯一，避免共用计时器。

连接尚未就绪时，底层发送仅记录日志，未必抛错；`chatWithModel` 正常返回也不保证消息已经送达。通过连接事件、请求 ID 和服务端响应确认业务状态。

`MessageType` 包含 `Heartbeat`、`Request`、`Response`、`Process`、`Broadcast`、`RecordAudio`、`RecordFinish`、`AudioRecognizer`、`NewConversation`、`AbortChating`、`Error`、`Text`。`OUTPUTTYPE` 包含 `process/stream/abort/text/chart/image/video/audio/js_code/other`，注意成员名大小写与原始字符串不同。

## 对话事件与响应

| 事件 | 载荷与限制 |
| --- | --- |
| `LLMEventType.connected` | `undefined`，连接建立时触发 |
| `LLMEventType.data` | `LLMMessage`，消费响应或 ASR 结果 |
| `LLMEventType.error` | `LLMErrorData`，见下表 |
| `LLMEventType.close` | `null`，调用实例 `close()` 时触发，未转发所有 WebSocket 断线 |
| `LLMEventType.progress` | 声明为 `unknown`，当前实现未主动触发 |

服务端原始响应的 `data.output` 是数组，SDK 按项处理；对外 `LLMMessage.data.output` 是单个 `LLMOutput`，不要再按数组遍历。对话响应与 ASR 走不同处理分支，不是所有原始消息类型都会成为 `data` 事件。

- `LLMMessage<TOutput>`：`{ type: MessageType; data: LLMResponseData<TOutput> }`。
- `LLMResponseData`：`output`，可选 `conversation_id/request_id/finished` 及扩展字段。
- `LLMOutput<TExtra>`：可选 `type/content/extra/blob/is_final`，支持扩展字段和自定义输出类型。读取 `unknown` 的 `extra` 前做类型收窄。
- ASR 使用 `AsrResult`，包含 `text/is_final/mode/blob?`，`AsrMode.online/offline` 分别对应 `2pass-online/2pass-offline`。SDK 汇总在线片段与离线修正，经 `MessageType.AudioRecognizer` 输出；取消录音后不继续向外发送该识别结果。
- 响应中的思考标签会转换成 `details` 内容；思考期间仍发送数据事件，但跳过播报。按项目渲染策略处理，示例使用纯文本展示。

## 请求超时与结构化错误

`wsConfig.requestTimeout` 单位毫秒，默认 `30000`，表示请求**连续无响应**的时间，不是总耗时、建连超时或 TTS 超时。

- 仅 `MessageType.Request` 启动计时，每个请求按 `request_id` 独立管理。
- 收到匹配的未完成响应时重新计时，`finished` 为真时清除；空 `output` 的匹配消息也会更新计时。
- 服务端错误清除对应请求的计时；`closeConnection()` 和 `close()` 清除全部请求计时。
- 超时仅触发错误事件，不会自动取消服务端请求、关闭连接或重试；后续响应仍可能到达。接口没有约定 `0` 表示禁用，不要据此生成配置。

`LLMErrorData` 是可按 `code` 收窄的联合类型：

| `code` | 必有字段 | 可选字段 |
| --- | --- | --- |
| `LLMErrorCode.ConnectionError`（`CONNECTION_ERROR`） | `message` | `details` |
| `LLMErrorCode.ServerError`（`SERVER_ERROR`） | `message` | `requestId`、`serverCode: string \| number`、`details` |
| `LLMErrorCode.RequestTimeout`（`REQUEST_TIMEOUT`） | `message`、`requestId`、`timeout` | 无 |

不要把所有异常都当作此联合类型：初始化可同步抛错，发送阶段 Promise 可拒绝，响应解析分支也可能先经 `data` 输出 `MessageType.Error` 再抛错。录音、Speech、MCP 的错误还需分别监听。

## 录音

`createAudioRecorder(config: AudioRecordConfig): AudioInstance` 至少传 `{}`。常用配置包括：

- `provider: { type: "dui" | "funasr", product_id?, apikey?, ... }`；厂家参数按部署核对。
- `mode: "normal" | "wakeup"`，`type: "sentence" | "live"`。
- `audioTrackSet: MediaTrackConstraints`，`waveView: { enable?, el?, type?, options? }`。
- 音量与自动停止参数：`powerLevelLimit/remainTime/stopTime/maximumTime/cancelTime`。不要仅根据注释推断默认值或参数已生效，实际实现应再次核对。

| 方法 | 签名或行为 |
| --- | --- |
| `init(success?, fail?)` | 返回 `void`；失败回调接收字符串，不是 Promise |
| `start(options?)` | `StartOptions` 包含 `mode?`、`autoStop?` |
| `stop()` | `Promise<null> \| undefined`；未开始时触发错误并返回 `undefined`，完成时的 blob 通过 `stop` 事件获取 |
| `cancel()`、`listenCancel()` | `Promise<void>` |
| `listen()` | 开始唤醒监听，先完成录音与模型初始化 |
| `initWakeUp(config)` | 注意大写 `U`，返回 `Promise<Wakeup>` |
| `changeMode(mode)` | 切换普通或唤醒模式 |
| `getCurrentBlob()` | `Blob \| null` |
| `close(isEmit?)` | 关闭麦克风，清除监听与录音计时器 |
| `on/off/once/offAll/has` | `on` 返回取消订阅函数，`once` 返回 `void` |
| `status/isCancel` | 当前 `RecorderStatus` 与取消标记 |

`RecorderStatus` 的成员为 `STOP/WAKEUP/RECODER/LISTEN`，其中 `RECODER` 是当前 API 拼写，不应自行改名。

`AudioEventData`：`start` 为 `{ status }`；`stop` 为 `{ blob, trigger }`；`process` 包含 `buffers/powerLevel/bufferDuration/bufferSampleRate/newBufferIdx`；`audio` 为 `{ text, type: MessageType }`；`wakeup` 为布尔值；`error/text` 为 `unknown`；`close` 为字符串 `"close"`；`cancel` 为 `undefined`。`trigger` 使用 `StopTrigger.AUTO/MANUAL/TIMEOUT`。

当前录音底层句柄 `rec` 位于模块级，避免同时创建和运行多个录音实例。关闭不等于取消所有已经开始的异步操作，处理授权回调晚于页面卸载的情况。

## 离线唤醒

优先通过 `recorder.initWakeUp(config)` 接入麦克风帧；只有自定义底层音频流程才直接构造 `new Wakeup(config)`。

`WakeupConfig` 支持 `mode?: "ONNX" | "Normal"`、`wasmPaths?`、`modelPath?`、`confidence_threshold?`、`highScoreCount?`、`onReady?`。实现默认模型为 `/ai-sdk/models/model.onnx`、WASM 目录为 `/ai-sdk/onnxruntime/web/`，置信度为 `0.85`、高分计数为 `3`；注释中的 `0.90` 不是实际默认值。

`initWakeUp` 在模型 `onReady` 后 resolve；目前 `Normal` 分支没有同样的就绪回调，不能假设两种模式行为一致。模型异步加载失败也未可靠传回此 Promise，不要承诺只用 `try/catch` 就能捕获全部失败。部署与超时诊断见 [故障排查](troubleshooting.md)。

发布白名单只有 `es/lib/dist/typings`，不包含模型和 WASM。由应用单独部署兼容资源。`WakeupState` 为 `listen/recognize/success/stop`；当前没有公开的完整销毁接口，不要编造 `wakeup.close()`。

## TTS 与 MCP 指令联动

`new Speech(config?: SpeechConfig)` 创建 Web Audio 上下文。`SpeechConfig` 按 `SpeechType` 区分厂家：

- 字节跳动：`type?: SpeechType.BYTEDANCE`，`params?: Partial<BytedanceTtsConfig>`。
- ALI：`type: SpeechType.ALI`，`params?: Partial<AliTtsConfig>`。
- 两者均支持 `volume?`。`Partial` 只放宽第一层字段，不表示嵌套的 `app/audio` 等字段也全部可选。

`tts(text, requestId?)` 入队，返回 `void`；`pauseAudio({ disableEvents? }?)` 停止播放并清空队列，不是可恢复的暂停；`clearQueue(requestIds?)` 清队列；`setVolume` 将值限制到 `0..1`；`close()` 关闭上下文并移除监听。指定 ID 清队列时也会停止当前播放，不要承诺只影响那些 ID 的音频。

`SpeechEventData`：`process: SpeechInstance`，`end/pause: undefined`，`error: unknown`。`pause` 虽有声明，当前实现未主动触发。`SpeechInstance` 是播报片段数据，不是 `Speech` 类，包含 `requestId/content/base64Audio?/command?`。

### 流式文本与队列完成

- 对话的 `OUTPUTTYPE.text` 内容由 SDK 累积，在中文 `。！？；，` 处分句，结束包刷新剩余文字；MCP 标签内的标点不参与分句。不要在应用中再对同一份响应重复自动播报。
- 思考阶段跳过 TTS；`extra.type` 为 `new/abort` 时，默认停止语音，可通过 `stopSpeechOnNewOrAbort` 调整。
- 多个 MCP 标签按顺序生成片段。纯指令不请求 TTS，也会触发 `process`；所有合成请求、待处理文本和播放片段都结束后才触发自然完成的 `end`。
- 带音频片段在播放开始时触发 `process`；`audioDelay`（毫秒）延迟音频调度和对应回调，纯指令分支没有同样的音频延迟。强制暂停或关闭也可能触发 `end`，应用应区分主动停止与自然结束。
- 合成失败会触发 `error`，有效指令仍可能入队并触发 `process`。`end` 不等待应用的异步指令处理器完成。

### 指令协议

```ts
const commandText = `<mcp serverId="page-tools" toolName="show_panel" params='{"panel":"overview"}' audioDelay="200"></mcp>展示概览。`;
```

`McpCommand` 包含字符串 `serverId/toolName`、必有的 `params: unknown`、可选 `audioDelay: number | string`，允许其他属性。解析保留标签属性；`params` 若为合法 JSON 则解析，否则保留字符串。支持 HTML 实体解码。旧的仅含 `data` 属性的标签不产生有效指令。

从 `speech.on("process", ({ command }) => ...)` 获取指令，再按应用已有协议验证和分发。SDK 提取与通知，不自动执行工具或任意代码。文本分句和标签解析工具属于内部实现，根入口只导出 `McpCommand` 类型，不要从内部路径导入工具函数。

## 浏览器 MCP 工具服务与 helper

`new mcpServer(mcpId)` 后注册工具，再 `await connect()`。监听 `mcpEvent.SUCCESS/FAIL`，分别收到 `{ mcpId }` 和 `{ mcpId, message }`。成功事件在 `server.connect` 完成后发送；部分连接异常被捕获且只记录日志，不能保证都抛出或触发 `fail`。关闭使用 `await close()`。

`McpTool<TArgs extends McpRecord = McpRecord, TResult = unknown>` 包含：

- 必填且唯一的 `name`、必填 `description`、`handler(arg?: TArgs): TResult | Promise<TResult>`。
- 可选 `input/output: z.ZodRawShape`，传字段映射而不是完整 `z.object(...)`。
- 可选 `annotations: McpToolAnnotations`，支持 `readOnlyHint/destructiveHint/idempotentHint/openWorldHint` 等；这些是描述信息，不实施权限控制。

`registerTools` 返回注册结果映射。当前包装器把结果转换成文本 `content`，没有设置 `structuredContent`；不要仅因提供 `output` schema 就承诺可返回结构化结果。`false/0/""` 等假值会被替换成 `"执行成功"`，需保留这些值时返回包含它们的对象。应用直接导入 `zod` 时，应声明自己的依赖。

| helper | 默认地址 | 提取响应字段 |
| --- | --- | --- |
| `getMcpConfig<T>(url?)` | `http://127.0.0.1:12080/configs` | `body` |
| `getMcpToken<T>(url?)` | `http://127.0.0.1:12080/token` | `data` |
| `getMcpUserInfo<T>(url?)` | `http://127.0.0.1:12080/userInfo` | `body` |
| `getMcpInfo<TConfig, TToken, TUserInfo>()` | 并行调用上述默认地址 | `{ config, token, userInfo }` |

泛型约束为 `Record<string, unknown>`，不提供运行时校验。单独 helper 的请求失败或字段缺失可返回空对象；`getMcpInfo()` 不接收 URL，需要自定义地址时分别调用三个 helper。
