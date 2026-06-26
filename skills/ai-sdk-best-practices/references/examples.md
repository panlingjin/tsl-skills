# Integration Examples

Use a runtime configuration boundary before creating SDK instances. Replace TODO values in the config boundary, not inside feature code. Never commit live provider credentials.

## Runtime config boundary

Adapt this pattern to the host project's existing config module and environment conventions:

```ts
// config/tsl-ai-sdk.ts
import { SpeechType } from "@tslfe/ai-sdk";
import type { AudioRecordConfig, SpeechOptions } from "@tslfe/ai-sdk";

export interface TslAiSdkRuntimeConfig {
  application: string;
  notify: 0 | 1;
  token?: string;
  recordConfig: AudioRecordConfig;
  tts: SpeechOptions & {
    enable?: boolean;
    stopSpeechOnNewOrAbort?: boolean;
  };
  wakeup: {
    modelPath: string;
    wasmPaths: string;
    confidence_threshold?: number;
    highScoreCount?: number;
  };
  mcp: {
    mcpId: string;
    configUrl?: string;
    tokenUrl?: string;
    userInfoUrl?: string;
  };
}

function requirePublicEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing ${name}; configure it in the app runtime environment.`);
  }
  return value;
}

export function getRuntimeTslAiSdkConfig(): TslAiSdkRuntimeConfig {
  return {
    application: requirePublicEnv(
      "VITE_TSL_AI_APPLICATION",
      import.meta.env.VITE_TSL_AI_APPLICATION
    ),
    notify: 0,
    token: undefined, // TODO: fetch a short-lived token from the application backend if required.
    recordConfig: {
      type: "sentence",
      waveView: { enable: false }
    },
    tts: {
      enable: false,
      type: SpeechType.BYTEDANCE,
      volume: 1,
      params: undefined // TODO: load provider params from the approved runtime source.
    },
    wakeup: {
      modelPath: import.meta.env.VITE_TSL_AI_WAKEUP_MODEL_PATH || "/ai-sdk/models/model.onnx",
      wasmPaths: import.meta.env.VITE_TSL_AI_WAKEUP_WASM_PATH || "/ai-sdk/onnxruntime/web/"
    },
    mcp: {
      mcpId: import.meta.env.VITE_TSL_AI_MCP_ID || "frontend-tools",
      configUrl: import.meta.env.VITE_TSL_AI_MCP_CONFIG_URL,
      tokenUrl: import.meta.env.VITE_TSL_AI_MCP_TOKEN_URL,
      userInfoUrl: import.meta.env.VITE_TSL_AI_MCP_USER_INFO_URL
    }
  };
}
```

## Conversation with cleanup

```ts
import { LLMEventType, createllm } from "@tslfe/ai-sdk";
import type { LLMInstance } from "@tslfe/ai-sdk";
import { getRuntimeTslAiSdkConfig } from "./config/tsl-ai-sdk";

let llm: LLMInstance | undefined;
let disposeConnected: (() => void) | undefined;
let disposeData: (() => void) | undefined;
let disposeError: (() => void) | undefined;

const handleConnected = () => {
  console.info("TSL AI connection established");
};

const handleData = (message: unknown) => {
  renderSdkMessage(message);
};

const handleError = (error: unknown) => {
  showConnectionError(error);
};

export function startConversation(): LLMInstance {
  const config = getRuntimeTslAiSdkConfig();

  llm = createllm({
    application: config.application,
    notify: config.notify,
    token: config.token,
    recordConfig: config.recordConfig,
    autoInitRecorder: true,
    tts: {
      ...config.tts,
      enable: true
    }
  });

  disposeConnected = llm.on(LLMEventType.connected, handleConnected);
  disposeData = llm.on(LLMEventType.data, handleData);
  disposeError = llm.on(LLMEventType.error, handleError);

  return llm;
}

export function stopConversation(): void {
  disposeConnected?.();
  disposeData?.();
  disposeError?.();
  disposeConnected = undefined;
  disposeData = undefined;
  disposeError = undefined;
  llm?.close();
  llm = undefined;
}
```

Use application-specific implementations for `renderSdkMessage` and `showConnectionError`.

## Recorder and wake word

```ts
import { AudioEventType, createAudioRecorder } from "@tslfe/ai-sdk";
import { getRuntimeTslAiSdkConfig } from "./config/tsl-ai-sdk";

const config = getRuntimeTslAiSdkConfig();
const recorder = createAudioRecorder({
  ...config.recordConfig,
  mode: "wakeup",
  type: "live"
});

const disposeRecorderError = recorder.on(AudioEventType.error, (error) => {
  console.error("Recorder failed", error);
});

const disposeWakeup = recorder.on(AudioEventType.wakeup, (detected) => {
  if (detected) {
    console.info("Wake word detected");
  }
});

export function startWakeupFromUserGesture(): void {
  recorder.init(
    async () => {
      await recorder.initWakeUp({
        ...config.wakeup,
        onReady: () => recorder.listen()
      });
    },
    (error: string) => {
      console.error("Microphone initialization failed", error);
    }
  );
}

export function disposeRecorder(): void {
  disposeRecorderError();
  disposeWakeup();
  recorder.close();
}
```

Call initialization from a user gesture if browser permission or autoplay policy requires it. Ensure the model and WASM URLs return files rather than the application's HTML fallback.

## Standalone TTS

```ts
import { Speech } from "@tslfe/ai-sdk";
import { getRuntimeTslAiSdkConfig } from "./config/tsl-ai-sdk";

const config = getRuntimeTslAiSdkConfig();
const speech = new Speech(config.tts);

const disposeSpeechError = speech.on("error", (error) => {
  console.error("TTS failed", error);
});

speech.tts("Hello, how can I help?", crypto.randomUUID());

export function disposeSpeech(): void {
  disposeSpeechError();
  speech.close();
}
```

## Browser-side MCP server

```ts
import { getMcpInfo, mcpEvent, mcpServer } from "@tslfe/ai-sdk";
import type { Tool } from "@tslfe/ai-sdk";
import { getRuntimeTslAiSdkConfig } from "./config/tsl-ai-sdk";
import { z } from "zod";

const config = getRuntimeTslAiSdkConfig();
const mcp = new mcpServer(config.mcp.mcpId);

const disposeMcpSuccess = mcp.on(mcpEvent.SUCCESS, ({ mcpId }) => {
  console.info("MCP connected", mcpId);
});

const disposeMcpFail = mcp.on(mcpEvent.FAIL, ({ message }) => {
  console.error("MCP connection failed", message);
});

const tools: Tool[] = [
  {
    name: "get_page_title",
    description: "Return the current browser page title",
    input: {
      prefix: z.string().optional().describe("Optional title prefix")
    },
    handler: async (args) => {
      const prefix = typeof args?.prefix === "string" ? args.prefix : "";
      return {
        title: `${prefix}${document.title}`
      };
    }
  }
];

mcp.registerTools(tools);

const localInfo = await getMcpInfo();
console.info("Local MCP information", localInfo);
await mcp.connect();

export async function disposeMcp(): Promise<void> {
  disposeMcpSuccess();
  disposeMcpFail();
  await mcp.close();
}
```

## Vue 3 composable

Store the external SDK instance in `shallowRef` so Vue does not proxy it. Keep the component thin by putting connection and cleanup effects in a composable. This text-only example disables automatic recorder initialization so mounting it does not ask for microphone access.

```ts
// composables/useTslConversation.ts
import { onMounted, onUnmounted, readonly, shallowRef } from "vue";
import { LLMEventType, createllm } from "@tslfe/ai-sdk";
import type { LLMInstance } from "@tslfe/ai-sdk";
import { getRuntimeTslAiSdkConfig } from "@/config/tsl-ai-sdk";

export function useTslConversation() {
  const client = shallowRef<LLMInstance>();
  const connected = shallowRef(false);
  const errorMessage = shallowRef("");
  let disposeConnected: (() => void) | undefined;
  let disposeError: (() => void) | undefined;

  function send(text: string): void {
    client.value?.inputMessage(text);
  }

  const handleConnected = () => {
    connected.value = true;
  };

  const handleError = (error: unknown) => {
    errorMessage.value =
      typeof error === "object" && error && "message" in error
        ? String(error.message)
        : "TSL AI connection failed";
  };

  onMounted(() => {
    const config = getRuntimeTslAiSdkConfig();
    const instance = createllm({
      application: config.application,
      notify: config.notify,
      token: config.token,
      recordConfig: config.recordConfig,
      autoInitRecorder: false,
      tts: { ...config.tts, enable: false }
    });

    disposeConnected = instance.on(LLMEventType.connected, handleConnected);
    disposeError = instance.on(LLMEventType.error, handleError);

    client.value = instance;
  });

  onUnmounted(() => {
    disposeConnected?.();
    disposeError?.();
    disposeConnected = undefined;
    disposeError = undefined;
    client.value?.close();
    client.value = undefined;
  });

  return {
    connected: readonly(connected),
    errorMessage: readonly(errorMessage),
    send
  };
}
```

```vue
<script setup lang="ts">
import { shallowRef } from "vue";
import { useTslConversation } from "@/composables/useTslConversation";

const message = shallowRef("");
const { connected, errorMessage, send } = useTslConversation();

function submit(): void {
  const text = message.value.trim();
  if (!text) return;
  send(text);
  message.value = "";
}
</script>

<template>
  <form class="conversation-form" @submit.prevent="submit">
    <input v-model="message" :disabled="!connected" />
    <button type="submit" :disabled="!connected">Send</button>
    <p v-if="errorMessage" class="conversation-error">{{ errorMessage }}</p>
  </form>
</template>

<style scoped>
.conversation-form {
  display: grid;
  gap: 0.75rem;
}

.conversation-error {
  color: #b42318;
}
</style>
```
