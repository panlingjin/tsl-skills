# 运行时配置

先检查目标项目已有的配置入口，再决定使用 `import.meta.env`、Vue CLI 环境变量、运行时 JSON、服务端注入或后端 token 交换。SDK 功能代码只消费配置对象，不到处读取环境变量或填入假凭据。

浏览器环境变量和运行时配置均可被用户读取。长期厂家密钥留在后端，通过既有代理或短期凭据机制接入；不要把注入配置误当成保密手段。

## 统一配置示例

以下是 Vite 项目的配置边界，其他构建工具按宿主约定替换。仅在启用对应功能时验证所需值：文本对话需要应用名，MCP 需要 ID，独立 TTS 需要明确启用并补齐服务参数。示例不要求未使用的功能也配置完成。

```ts
// config/tsl-ai-sdk.ts
import { SpeechType } from "@tslfe/ai-sdk";
import type {
  AudioRecordConfig,
  LLMConfig,
  LLMSpeechConfig,
  LLMWebSocketConfig,
  WakeupConfig
} from "@tslfe/ai-sdk";

export interface TslAiSdkRuntimeConfig {
  application?: string;
  notify: 0 | 1;
  token?: string;
  wsConfig: LLMWebSocketConfig;
  recordConfig: AudioRecordConfig;
  tts: LLMSpeechConfig;
  wakeup: WakeupConfig;
  mcp: {
    mcpId?: string;
    configUrl?: string;
    tokenUrl?: string;
    userInfoUrl?: string;
  };
}

export function requireConfigString(name: string, value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error(`缺少配置 ${name}，请在项目配置入口中提供。`);
  }
  return value;
}

export function getRuntimeTslAiSdkConfig(): TslAiSdkRuntimeConfig {
  return {
    application: import.meta.env.VITE_TSL_AI_APPLICATION,
    notify: 0,
    // TODO：如需鉴权，从项目后端获取短期 token 后，在此配置入口统一接入。
    token: undefined,
    wsConfig: { requestTimeout: 30000 },
    recordConfig: {
      provider: { type: "funasr" },
      type: "sentence",
      waveView: { enable: false }
    },
    tts: {
      enable: false,
      type: SpeechType.BYTEDANCE,
      volume: 1,
      stopSpeechOnNewOrAbort: true,
      // TODO：启用播报前，从项目认可的运行时来源补齐厂家参数。
      params: undefined
    },
    wakeup: {
      mode: "ONNX",
      modelPath:
        import.meta.env.VITE_TSL_AI_WAKEUP_MODEL_PATH || "/ai-sdk/models/model.onnx",
      wasmPaths:
        import.meta.env.VITE_TSL_AI_WAKEUP_WASM_PATH || "/ai-sdk/onnxruntime/web/"
    },
    mcp: {
      mcpId: import.meta.env.VITE_TSL_AI_MCP_ID,
      configUrl: import.meta.env.VITE_TSL_AI_MCP_CONFIG_URL,
      tokenUrl: import.meta.env.VITE_TSL_AI_MCP_TOKEN_URL,
      userInfoUrl: import.meta.env.VITE_TSL_AI_MCP_USER_INFO_URL
    }
  };
}

// 文本场景统一关闭自动录音和自动播报，其他场景按功能另行启用。
export function getTextConversationConfig(): LLMConfig {
  const config = getRuntimeTslAiSdkConfig();
  return {
    application: requireConfigString("VITE_TSL_AI_APPLICATION", config.application),
    notify: config.notify,
    token: config.token,
    wsConfig: config.wsConfig,
    recordConfig: config.recordConfig,
    autoInitRecorder: false,
    tts: { ...config.tts, enable: false },
    wakeup: { enable: false }
  };
}
```

异步获取凭据的项目应让现有配置加载流程先完成，再创建实例；不要通过类型断言将未完成的配置伪装为可用值。`VITE_` 仅是此示例的构建约定，不是 SDK 要求。

## 各功能需要核对的配置

| 功能 | 配置与部署要求 |
| --- | --- |
| 对话 | 非空 `application`、必填 `notify`、按部署提供的短期 `token`，以及同源 WebSocket 代理 |
| 请求超时 | `wsConfig.requestTimeout` 为连续无响应毫秒数，默认 30000；使用正数，不把 0 当作禁用 |
| ASR | 厂家类型、对应参数、音轨约束、录音及自动停止模式；默认 `funasr` 通过录音事件与对话后端协作 |
| TTS | 按 `SpeechType` 选择参数类型，再启用播报；字节跳动参数包含 `app`，ALI 使用自身服务参数 |
| 唤醒 | `WakeupConfig` 中的模型与 WASM 路径；LLM 的 `wakeup` 配置不代替 `recorder.initWakeUp` |
| MCP | 应用自行指定唯一、非空的 `mcpId`，并确认本机伴随服务及反向连接服务可达 |

厂家配置使用 `SpeechConfig` 的联合类型，不拼接不存在的通用字段。`Partial<BytedanceTtsConfig>` 不是深层 Partial，例如提供 `app` 时必须包含声明要求的 `appid/token/cluster`。以实际服务契约验证值是否齐全，类型检查不替代服务鉴权。

## WebSocket 与 HTTP 代理

SDK 根据当前页面协议和 `window.location.host` 拼接 `/v1/llm/ws/{application}/{clientId}`，配置对象不支持 `wsOrigin` 或独立连接 URL。需要其他后端域名时，在开发服务器或生产反向代理中配置该路径的 WebSocket 转发，并核对 Upgrade、TLS 和鉴权。

TTS 同样使用相对 HTTP 路径：字节跳动为 `/v1/tts`，ALI 为 `/v1/llm/inference_zero_shot/CosyVoice2-0.5B/base64`。根据启用的厂家配置同源代理，不在业务代码中虚构 SDK endpoint 参数。

## MCP 地址与返回值

`getMcpInfo()` 固定聚合默认本机地址，不接受配置对象或 URL。需要自定义地址时，分别把 `config.mcp.configUrl/tokenUrl/userInfoUrl` 传给 `getMcpConfig/getMcpToken/getMcpUserInfo`，再组合返回值，见 [接入示例](examples.md)。

这些 URL 只控制 helper 的 HTTP 请求，不会改变 `mcpServer` 的反向连接地址。helper 的失败可返回 `{}`，必须核对真实字段；配置泛型只约束编译期，不校验响应。

## 唤醒静态资源

默认路径是资源约定，并不表示 npm 包包含文件。由目标应用从认可来源部署与所用 ONNX Runtime 匹配的模型、WASM 及伴随模块文件。WASM 目录 URL 保留结尾 `/`。

验证模型返回 ONNX 字节、WASM 返回正确内容；避免 SPA 的 HTML fallback。子路径部署、CDN、缓存和跨域限制需一起核对。模型当前按文件名缓存到 IndexedDB，更换同名模型后应处理旧缓存。

## 缺失配置时

- 保留明确的 TODO 和功能启动前的配置检查，错误说明缺少哪个配置，不回显凭据。
- 只要求当前功能所需的值，不为 MCP 或纯录音强制要求 LLM 应用名。
- 启用语音前补齐真实服务参数；不要在未配置时强制将 `enable` 改为 `true`。
- 若接入方案必须向浏览器暴露长期密钥，先指出该具体设计问题并确认凭据方案，不因普通公开配置缺失而反复请求确认。
