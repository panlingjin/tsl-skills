# Integration Examples

Replace placeholders with runtime configuration. Never commit live provider credentials.

## Conversation with cleanup

```ts
import { LLMEventType, SpeechType, createllm } from "@tslfe/ai-sdk";
import type { LLMInstance } from "@tslfe/ai-sdk";

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
  llm = createllm({
    application: "your-application",
    notify: 0,
    recordConfig: {
      type: "sentence",
      waveView: { enable: false }
    },
    autoInitRecorder: true,
    tts: {
      enable: true,
      type: SpeechType.BYTEDANCE,
      volume: 1,
      params: getRuntimeTtsConfig()
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

Use application-specific implementations for `getRuntimeTtsConfig`, `renderSdkMessage`, and `showConnectionError`.

## Recorder and wake word

```ts
import { AudioEventType, createAudioRecorder } from "@tslfe/ai-sdk";

const recorder = createAudioRecorder({
  mode: "wakeup",
  type: "live",
  waveView: { enable: false }
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
        modelPath: "/ai-sdk/models/model.onnx",
        wasmPaths: "/ai-sdk/onnxruntime/web/",
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
import { Speech, SpeechType } from "@tslfe/ai-sdk";

const speech = new Speech({
  type: SpeechType.BYTEDANCE,
  volume: 0.8,
  params: getRuntimeTtsConfig()
});

const disposeSpeechError = speech.on("error", (error) => {
  console.error("TTS failed", error);
});

speech.tts("你好，我可以为你做什么？", crypto.randomUUID());

export function disposeSpeech(): void {
  disposeSpeechError();
  speech.close();
}
```

## Browser-side MCP server

```ts
import { getMcpInfo, mcpEvent, mcpServer } from "@tslfe/ai-sdk";
import type { Tool } from "@tslfe/ai-sdk";
import { z } from "zod";

const mcp = new mcpServer("frontend-tools");

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
    const instance = createllm({
      application: "your-application",
      notify: 0,
      recordConfig: { waveView: { enable: false } },
      autoInitRecorder: false,
      tts: { enable: false }
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
