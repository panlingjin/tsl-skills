# 接入示例

所有示例复用 [运行时配置](configuration.md) 中的 `config/tsl-ai-sdk.ts`，不重复定义配置结构。示例文件名用于说明目标项目的组织方式；不需要在技能目录创建这些应用文件。

以下为浏览器端 TypeScript。SSR 项目将 SDK 的运行时导入放在客户端边界；`import type` 可保留。厂家参数、应用名和 MCP ID 均由目标项目配置提供。

## 结构化错误提示

```ts
// llm-errors.ts
import { LLMErrorCode } from "@tslfe/ai-sdk";
import type { LLMErrorData } from "@tslfe/ai-sdk";

export function describeLLMError(error: LLMErrorData): string {
  switch (error.code) {
    case LLMErrorCode.ConnectionError:
      return `连接失败：${error.message}`;
    case LLMErrorCode.ServerError:
      return `服务端错误：${error.message}（请求：${error.requestId ?? "未知"}）`;
    case LLMErrorCode.RequestTimeout:
      return `请求 ${error.requestId} 连续 ${error.timeout} 毫秒无响应，请稍后重试。`;
  }
}
```

## 文本对话与清理

```ts
// conversation.ts
import { AudioEventType, createllm, LLMEventType, MessageType } from "@tslfe/ai-sdk";
import type { LLMErrorData, LLMMessage, LLMRequestOptions } from "@tslfe/ai-sdk";
import { getTextConversationConfig } from "./config/tsl-ai-sdk";

export function createTextConversation(
  onMessage: (message: LLMMessage) => void,
  onError: (error: LLMErrorData) => void
) {
  const llm = createllm(getTextConversationConfig());
  let connectedOnce = false;
  let disposed = false;
  const unsubscribers = [
    llm.on(LLMEventType.connected, () => { connectedOnce = true; }),
    llm.on(LLMEventType.data, onMessage),
    llm.on(LLMEventType.error, onError),
    llm.recorder.on(AudioEventType.error, (error) => console.error("录音错误", error)),
    llm.speech.on("error", (error) => console.error("播报错误", error))
  ];

  return {
    llm,
    async send(text: string, options?: LLMRequestOptions): Promise<void> {
      if (disposed || !connectedOnce) throw new Error("对话尚未就绪或已经关闭。");
      if (!text.trim()) return;
      // 可捕获发送阶段拒绝；服务端结果和超时仍由事件通知。
      await llm.chatWithModel(text, MessageType.Request, options);
    },
    close(): void {
      if (disposed) return;
      disposed = true;
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      llm.close();
    }
  };
}
```

在应用的客户端启动流程中调用 `createTextConversation`，捕获其同步初始化异常；发送时捕获返回 Promise 的拒绝，卸载时调用返回对象的 `close()`。若不需要等待发送阶段，也可使用 `llm.send({ text, type, options })`，但它返回 `void`，不能靠 `await llm.send(...)` 等待服务端完成。

`connectedOnce` 仅表示曾建立连接，不是实时网络状态。SDK 未将全部 WebSocket 断线转发为 LLM `close` 事件；需要实时在线状态的产品应另行接入项目连接监测。请求超时不会自动重发，重试由业务决定。

## 独立录音与 ONNX 唤醒

从用户操作中调用 `start()`。示例只允许一个录音会话，并添加应用层模型就绪超时，处理当前 SDK 的模型失败可能不使 `initWakeUp` 拒绝的问题。超时只是界面兜底，不会取消 SDK 内部模型下载。

```ts
// wakeup-recorder.ts
import { AudioEventType, createAudioRecorder } from "@tslfe/ai-sdk";
import { getRuntimeTslAiSdkConfig } from "./config/tsl-ai-sdk";

export function createWakeupRecorder(
  onWakeup: () => void,
  onError: (error: unknown) => void,
  modelReadyTimeoutMs: number
) {
  if (!Number.isFinite(modelReadyTimeoutMs) || modelReadyTimeoutMs <= 0) {
    throw new Error("模型就绪超时必须为正数毫秒。");
  }
  const config = getRuntimeTslAiSdkConfig();
  const recorder = createAudioRecorder({ ...config.recordConfig, mode: "wakeup" });
  let disposed = false;
  let started = false;
  let readyTimer: ReturnType<typeof setTimeout> | undefined;
  let cancelStart: (() => void) | undefined;
  const unsubscribers = [
    recorder.on(AudioEventType.error, onError),
    recorder.on(AudioEventType.wakeup, (detected) => {
      if (detected && !disposed) onWakeup();
    })
  ];

  function close(): void {
    if (disposed) return;
    disposed = true;
    cancelStart?.();
    if (readyTimer !== undefined) clearTimeout(readyTimer);
    unsubscribers.forEach((unsubscribe) => unsubscribe());
    recorder.close();
  }

  return {
    async start(): Promise<void> {
      if (disposed) throw new Error("录音会话已经关闭，请重新创建。");
      if (started) return;
      started = true;
      const cancelled = new Promise<never>((_, reject) => {
        cancelStart = () => reject(new Error("录音初始化已取消。"));
      });
      try {
        await Promise.race([
          new Promise<void>((resolve, reject) => {
            recorder.init(() => {
              if (disposed) {
                // 授权可能在卸载后才完成，释放晚到的麦克风资源。
                recorder.close();
                reject(new Error("录音初始化已取消。"));
              } else resolve();
            }, reject);
          }),
          cancelled
        ]);
        if (disposed) return;
        await Promise.race([
          recorder.initWakeUp({
            ...config.wakeup,
            mode: "ONNX",
            onReady: () => { if (!disposed) config.wakeup.onReady?.(); }
          }),
          new Promise<never>((_, reject) => {
            readyTimer = setTimeout(() => reject(new Error("唤醒模型加载超时。")), modelReadyTimeoutMs);
          }),
          cancelled
        ]);
        if (!disposed) recorder.listen();
      } catch (error) {
        if (!disposed) onError(error);
        close();
      } finally {
        cancelStart = undefined;
        if (readyTimer !== undefined) clearTimeout(readyTimer);
        readyTimer = undefined;
      }
    },
    close
  };
}
```

`modelReadyTimeoutMs` 由项目配置传入，不是 SDK 的 `wsConfig.requestTimeout`。不要在旧授权或模型加载仍未结束时并行创建替代录音实例；底层录音句柄是共享的。当前模型异步异常可能另外成为未处理拒绝，应用超时不能修复 SDK 的异常转发缺口，也不保证释放 ONNX 会话。

普通录音可复用同样的初始化与清理流程，改为 `recorder.start()`；通过 `AudioEventType.stop` 获取 `{ blob, trigger }`，不要把 `stop()` 的返回值当作音频文件。默认 `funasr` 的 `audio` 事件传输音频数据给后端，并不自行提供完整 ASR 连接；独立识别需接入项目对应的后端流程。

## 独立 TTS 与指令消费

先在统一配置中启用 TTS 并补齐对应厂家参数，再从客户端用户操作调用工厂。指令处理函数使用项目已有的分发逻辑，按 `serverId/toolName/params` 验证后执行。

```ts
// standalone-speech.ts
import { Speech, SpeechType } from "@tslfe/ai-sdk";
import type { McpCommand, SpeechEventData } from "@tslfe/ai-sdk";
import { getRuntimeTslAiSdkConfig, requireConfigString } from "./config/tsl-ai-sdk";

export function createStandaloneSpeech(
  handleCommand: (command: McpCommand) => Promise<void>,
  onEnd: () => void,
  onError: (error: unknown) => void
) {
  const { tts } = getRuntimeTslAiSdkConfig();
  if (!tts.enable) throw new Error("请先在项目配置入口启用并配置 TTS。");
  if (tts.type !== SpeechType.ALI) {
    requireConfigString("TTS appid", tts.params?.app?.appid);
    requireConfigString("TTS token", tts.params?.app?.token);
    requireConfigString("TTS cluster", tts.params?.app?.cluster);
  }
  const speech = new Speech(tts);
  let disposed = false;
  const onProcess = (segment: SpeechEventData["process"]): void => {
    if (segment.command && !disposed) {
      // SDK 的事件发射器不等待异步处理器，显式处理异步失败。
      void handleCommand(segment.command).catch(onError);
    }
  };
  const unsubscribers = [
    speech.on("process", onProcess),
    speech.on("end", onEnd),
    speech.on("error", onError)
  ];

  return {
    speak(text: string, requestId?: string): void {
      if (disposed) throw new Error("语音实例已经关闭。");
      speech.tts(text, requestId);
    },
    close(): void {
      if (disposed) return;
      disposed = true;
      // 先取消应用事件，避免销毁触发的 end 启动下一轮交互。
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      speech.close();
    }
  };
}
```

`process` 可在纯指令输入时同步触发，所以先注册事件再 `tts`。合成失败也可能触发指令；如果业务要求“必须成功播报才能执行”，需由业务明确处理。多个指令回调按片段顺序发出，但不等待上一个异步业务操作完成；需要串行执行时使用应用自己的任务队列。

## 浏览器 MCP 工具与 helper

应用直接使用 `zod` 时应声明兼容的依赖。此例返回普通对象，由 SDK 转为文本结果，不声明不匹配的结构化输出 schema。

```ts
// browser-mcp.ts
import {
  getMcpConfig, getMcpToken, getMcpUserInfo, mcpEvent, mcpServer
} from "@tslfe/ai-sdk";
import type { McpInfo, McpTool } from "@tslfe/ai-sdk";
import { z } from "zod";
import { getRuntimeTslAiSdkConfig, requireConfigString } from "./config/tsl-ai-sdk";

export async function readLocalMcpInfo(): Promise<McpInfo> {
  const { mcp } = getRuntimeTslAiSdkConfig();
  const [config, token, userInfo] = await Promise.all([
    getMcpConfig(mcp.configUrl),
    getMcpToken(mcp.tokenUrl),
    getMcpUserInfo(mcp.userInfoUrl)
  ]);
  // 由消费方检查所需字段，空对象不代表成功；不要将 token 打印到日志。
  return { config, token, userInfo };
}

export function createBrowserMcp(onError: (error: unknown) => void) {
  const config = getRuntimeTslAiSdkConfig();
  const mcp = new mcpServer(requireConfigString("VITE_TSL_AI_MCP_ID", config.mcp.mcpId));
  let disposed = false;
  const unsubscribers = [
    mcp.on(mcpEvent.SUCCESS, ({ mcpId }) => console.info("MCP 已连接", mcpId)),
    mcp.on(mcpEvent.FAIL, ({ message }) => onError(new Error(message)))
  ];
  const tools: McpTool<{ prefix?: string }, { title: string }>[] = [{
    name: "get_page_title",
    description: "获取当前浏览器页面标题",
    input: { prefix: z.string().optional().describe("可选的标题前缀") },
    annotations: { readOnlyHint: true },
    handler: async (args) => ({ title: `${args?.prefix ?? ""}${document.title}` })
  }];
  mcp.registerTools(tools);

  return {
    async connect(): Promise<void> {
      if (disposed) throw new Error("MCP 实例已经关闭。");
      await mcp.connect();
      if (disposed) {
        await mcp.close();
        return;
      }
      // connect 的部分异常只记录日志，补查状态，但这不能替代建连超时。
      if (!mcp.isConnected) throw new Error("MCP 未建立连接，请检查本机服务和网络。");
    },
    async close(): Promise<void> {
      if (disposed) return;
      disposed = true;
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      await mcp.close();
    }
  };
}
```

在客户端创建实例，调用 `connect()` 并捕获其拒绝；卸载时 `await close()`。生产应用若需要确定的等待上限，应增加应用层建连超时和晚到连接清理。默认端点可直接使用无参 `getMcpInfo()`；自定义 URL 使用上例三个 helper，不向 `getMcpInfo` 传参。

## Vue 3 文本对话

Composable 负责单次会话的连接、事件和清理，组件只保留输入和展示。示例的 `connectedOnce` 表示曾连接，并非实时在线状态；同时展示连接错误。多请求界面应按 `request_id` 组织消息，此例只展示最近一条消息。

```ts
// composables/useTslConversation.ts
import { onMounted, onUnmounted, readonly, shallowRef } from "vue";
import { createllm, LLMEventType, LLMErrorCode, MessageType } from "@tslfe/ai-sdk";
import type { LLMInstance, LLMMessage } from "@tslfe/ai-sdk";
import { getTextConversationConfig } from "../config/tsl-ai-sdk";
import { describeLLMError } from "../llm-errors";

export function useTslConversation() {
  const client = shallowRef<LLMInstance>();
  const connectedOnce = shallowRef(false);
  const errorMessage = shallowRef("");
  const lastMessage = shallowRef<LLMMessage>();
  let unsubscribers: Array<() => void> = [];

  async function send(text: string): Promise<boolean> {
    if (!text.trim() || !connectedOnce.value || !client.value) return false;
    errorMessage.value = "";
    try {
      await client.value.chatWithModel(text, MessageType.Request);
      return true;
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : String(error);
      return false;
    }
  }

  onMounted(() => {
    try {
      const instance = createllm(getTextConversationConfig());
      client.value = instance;
      unsubscribers = [
        instance.on(LLMEventType.connected, () => { connectedOnce.value = true; }),
        instance.on(LLMEventType.data, (message) => { lastMessage.value = message; }),
        instance.on(LLMEventType.error, (error) => {
          errorMessage.value = describeLLMError(error);
          if (error.code === LLMErrorCode.ConnectionError) connectedOnce.value = false;
        }),
        instance.on(LLMEventType.close, () => { connectedOnce.value = false; })
      ];
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : String(error);
    }
  });

  onUnmounted(() => {
    unsubscribers.forEach((unsubscribe) => unsubscribe());
    unsubscribers = [];
    client.value?.close();
    client.value = undefined;
    connectedOnce.value = false;
  });

  return {
    connectedOnce: readonly(connectedOnce),
    errorMessage: readonly(errorMessage),
    lastMessage: readonly(lastMessage),
    send
  };
}
```

```vue
<!-- components/TslConversation.vue -->
<script setup lang="ts">
import { shallowRef } from "vue";
import { useTslConversation } from "../composables/useTslConversation";

const message = shallowRef("");
const { connectedOnce, errorMessage, lastMessage, send } = useTslConversation();

async function submit(): Promise<void> {
  const text = message.value.trim();
  if (await send(text)) message.value = "";
}
</script>

<template>
  <form @submit.prevent="submit">
    <label>消息 <input v-model="message" :disabled="!connectedOnce" /></label>
    <button type="submit" :disabled="!connectedOnce">发送</button>
    <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>
    <p v-if="lastMessage">{{ lastMessage?.data.output.content }}</p>
  </form>
</template>
```

组件使用文本插值，不直接将模型返回的 HTML 传给 `v-html`。此示例关闭录音与播报；启用这些能力后，还需接入它们各自的错误和用户授权流程。
