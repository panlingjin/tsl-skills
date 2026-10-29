# 故障排查

按实际安装包声明和实现定位。优先记录功能、事件、非敏感请求 ID 与错误类型，不打印 token 或完整鉴权查询参数。API 细节见 [公共 API](api.md)，配置入口见 [运行时配置](configuration.md)。

## TypeScript 导入或类型报错

- 核对根入口导出，不从内部目录绕过。旧的 `RecoderStatus/Tool/wakeupConfig` 改用 `RecorderStatus/McpTool/WakeupConfig`，`SpeechOptions/SpeechEventMap` 改用 `SpeechConfig/SpeechEventData`。
- 对照实际安装包声明判断可用导出，不仅凭包名称或版本号推断接口。
- `SpeechInstance` 是播报片段；实际语音客户端是 `Speech`。`McpEventData` 需要事件类型参数，例如 `McpEventData<typeof mcpEvent.SUCCESS>`。
- `stop()` 返回 `Promise<null> | undefined`，音频文件由录音 `stop` 事件提供。`SpeechConfig` 的厂家参数是联合类型，不能混用两家字段。

## 配置缺失或 SSR 初始化异常

- 使用统一配置入口，在启动对应功能时验证必填值。只有文本对话需要 LLM 应用名，不为纯 MCP、独立 TTS 或录音强制要求它。
- 按项目构建工具核对公开环境变量规则；前端变量不会因存放于 `.env` 而保密。
- 不把类型断言或空凭据当作配置完成。补齐运行时参数后再启用 TTS。
- SDK 依赖 `window/document/localStorage/Web Audio`。`autoInitRecorder: false` 只关闭自动麦克风初始化，不能让对话实例在 Node/SSR 中运行。若模块导入也访问浏览器对象，改为客户端动态导入。
- 初始化可同步抛错；实例的错误监听无法捕获创建之前的错误，需在调用处捕获。

## 麦克风初始化或停止失败

- 检查 HTTPS/localhost、浏览器和系统麦克风权限、`audioTrackSet` 约束。由用户操作开始授权。
- 同时处理 `recorder.init(success, fail)` 的失败回调与 `AudioEventType.error`；部分授权失败只走回调。
- 避免同时运行多个录音实例，当前实现共享底层句柄。旧实例授权未完成时不要立即并行创建新实例。
- `init` 不返回 Promise，不能仅写 `await recorder.init()`。`stop()` 的 Promise 完成也不等于所有异步转码和后端识别均完成，按对应事件消费结果。
- 页面卸载时调用 `close()`；对于卸载后才完成的授权，仍需在回调中释放麦克风。

## LLM 无法连接或网络状态不准确

- 核对非空 `application`、必填 `notify`、鉴权与代理。
- 在开发者工具检查 `/v1/llm/ws/...` 是否连接到了当前页面域名。`wsOrigin` 不是 SDK 参数，不会改变目标；通过同源 WebSocket 代理转发。
- 检查代理 Upgrade、TLS 和 token 有效期。监听 `LLMEventType.connected/error`。
- `LLMEventType.close` 在实例销毁时触发，不覆盖全部网络断开；`progress` 当前未主动触发。不要据此实现不准确的在线状态或加载进度。
- 最终卸载使用 `close()`，`closeConnection()` 不释放录音与语音。

## 请求超时或界面一直等待

- `wsConfig.requestTimeout` 默认 30000 毫秒，表示连续无响应时间；每次匹配响应刷新计时，完成或对应服务端错误清除计时。
- 用 `LLMErrorCode.RequestTimeout` 收窄后读取 `requestId/timeout`。不要假设连接错误也有这些字段。
- 核对服务端回复的 `request_id` 与发送值一致；并行请求的自定义 ID 必须唯一。
- 超时并不自动取消后端请求或重发。界面按请求 ID 处理迟到响应，重试策略遵循业务，不添加无界重试。
- `send/inputMessage` 返回 `void`，`chatWithModel` 的 Promise 也只表示发送阶段。通过数据事件和 `finished` 判断服务端完成，不以 `Speech.end` 代替。
- 连接未就绪时底层发送可能只打印日志，Promise 不拒绝也不代表已经发出；检查连接事件及匹配请求的实际响应。

## 响应文字、ASR 或思考内容异常

- 对外事件的 `data.output` 是单个对象；服务端的数组已由 SDK 拆分。
- `output.extra` 是 `unknown`，先判断再取业务字段；自定义输出类型也可能出现。
- ASR 的在线片段、离线修正和最终结果含义不同，通过 `MessageType.AudioRecognizer` 与 `is_final` 判断；取消后不会继续向外推送该结果。
- 思考内容转换为 `details` 后仍会通知界面，但不播报。展示 HTML 前按项目既有安全策略处理。
- 不重复将同一对话文本交给 TTS，SDK 已有自动分句。无标点尾部在服务端结束包到达后才刷新。

## 模型或 WASM 加载失败、唤醒一直未就绪

- 分别检查 `modelPath` 与 `wasmPaths`，确认成功响应包含真实文件，而非状态为 200 的 SPA HTML。
- WASM 路径应为以 `/` 结尾的目录，文件与安装的 ONNX Runtime 兼容；npm 发布白名单不含这些静态资源。
- 核对子路径部署、MIME、CORS、CSP、缓存及所用运行时构建的跨源隔离要求。
- IndexedDB 按模型文件名缓存，且 HTTP 成功的内容可先于 ONNX 验证被缓存。同名模型更新或误缓存 HTML 后应清理相应缓存。
- 顺序为录音初始化、`initWakeUp` 就绪、`listen()`。只设置 LLM 的 `wakeup.enable` 不会自动完成这些步骤。
- `Normal` 模式未提供与 ONNX 相同的就绪回调；当前模型加载异步错误也未可靠传回 `initWakeUp`。增加应用就绪超时和错误提示，不能宣称外层 Promise 捕获了所有模型失败或取消了内部加载。
- SDK 没有公开的完整 Wakeup 销毁接口，不编造 `wakeup.close()`；需要保证模型会话释放时应定位 SDK 的能力缺口。

## TTS 静音、指令缺失或结束事件时机异常

- 检查 Web Audio 自动播放限制，必要时在用户操作中恢复上下文；检查音量、`setAutoPlay(false)` 和 `pauseAudio()`。
- 根据 `SpeechType` 验证厂家参数及同源 HTTP 代理。监听 `speech.error/process/end`，LLM 错误监听不代替语音错误监听。
- 使用 `<mcp serverId="..." toolName="..." params='{}'></mcp>` 协议；仅含旧 `data` 属性的标签不会生成指令。`params` 可为对象或字符串，应用消费前验证。
- 纯指令也会触发 `process`，必须在 `tts` 之前订阅。多指令按顺序通知，异步业务处理不会被 SDK 等待。
- `audioDelay` 单位为毫秒，音频由 AudioContext 调度；纯指令分支不等待此音频延迟。
- 自然 `end` 等到当前合成与播放队列空闲后触发；强制暂停和关闭也可能触发。销毁前解除会开启下一轮交互的监听。
- `pauseAudio` 会清队列，不是暂停后恢复；`pause` 事件虽有类型声明，当前未主动触发。
- 合成失败后有效指令仍可能触发 `process`，不要假设业务指令只会在播报成功时执行。

## MCP helper 返回空对象或工具连接失败

- 核对 `127.0.0.1:12080` 伴随服务及 `/configs`、`/token`、`/userInfo`，检查 CORS、混合内容限制和本机安全配置。
- config/userInfo helper 提取 `body`，token helper 提取 `data`；失败或缺字段时可能返回 `{}`。泛型不是运行时验证。
- `getMcpInfo()` 无参数；自定义地址分别传给三个 helper，不能用于修改反向连接地址。
- 工具名称必须唯一，包含描述与处理器；`input/output` 传 Zod 字段映射，handler 参数允许缺省。使用 Zod 的应用应显式声明依赖。
- 先注册工具和事件，再连接；成功事件在底层连接完成后触发。部分异常仅记录日志，需要网络诊断、状态检查及必要的应用建连超时。
- 工具结果当前按文本包装，未设置 `structuredContent`。声明 `output` schema 时需检查协议要求；`false/0/空字符串` 会被包装器替换，需要保留时返回对象。
- 清理时解除应用监听并 `await mcp.close()`，处理连接在页面关闭后才完成的情况。
