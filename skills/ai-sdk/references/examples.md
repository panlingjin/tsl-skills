# Integration Examples

Replace placeholders with runtime configuration. Never commit live provider credentials.

## Conversation with cleanup

```ts
import { createllm } from "@tslfe/ai-sdk";
import type { LLMInstance } from "@tslfe/ai-sdk";

let llm: LLMInstance | undefined;
type LlmEventName = Parameters<LLMInstance["on"]>[0];

const llmEvents = {
  connected: "connected" as LlmEventName,
  data: "data" as LlmEventName,
  error: "error" as LlmEventName
};

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
      type: "bytedance",
      volume: 1,
      params: getRuntimeTtsConfig()
    }
  });

  llm.on(llmEvents.connected, handleConnected);
  llm.on(llmEvents.data, handleData);
  llm.on(llmEvents.error, handleError);

  return llm;
}

export function stopConversation(): void {
  llm?.off(llmEvents.connected, handleConnected);
  llm?.off(llmEvents.data, handleData);
  llm?.off(llmEvents.error, handleError);
  llm?.close();
  llm = undefined;
}
```

Use application-specific implementations for `getRuntimeTtsConfig`, `renderSdkMessage`, and `showConnectionError`.

## Recorder and wake word

```ts
import { createAudioRecorder } from "@tslfe/ai-sdk";

const recorder = createAudioRecorder({
  mode: "wakeup",
  type: "live",
  waveView: { enable: false }
});

type RecorderEventName = Parameters<typeof recorder.on>[0];

recorder.on("error" as RecorderEventName, (error) => {
  console.error("Recorder failed", error);
});

recorder.on("wakeup" as RecorderEventName, (detected) => {
  if (detected) {
    console.info("Wake word detected");
  }
});

recorder.init(
  async () => {
    await recorder.initWakeUp({
      modelPath: "/ai-sdk/models/model.onnx",
      wasmPaths: "/ai-sdk/onnxruntime/web/",
      onReady: () => recorder.listen()
    });
  },
  (error: unknown) => {
    console.error("Microphone initialization failed", error);
  }
);

export function disposeRecorder(): void {
  recorder.close();
}
```

Call initialization from a user gesture if browser permission or autoplay policy requires it. Ensure the model and WASM URLs return files rather than the application's HTML fallback.

## Standalone TTS

```ts
import { Speech } from "@tslfe/ai-sdk";

const speech = new Speech({
  type: "bytedance",
  volume: 0.8,
  params: getRuntimeTtsConfig()
});

speech.on("error", (error) => {
  console.error("TTS failed", error);
});

speech.tts("你好，我可以为你做什么？", crypto.randomUUID());

export function disposeSpeech(): void {
  speech.close();
}
```

## Browser-side MCP server

```ts
import { getMcpInfo, mcpServer } from "@tslfe/ai-sdk";
import { z } from "zod";

const mcp = new mcpServer("frontend-tools");

mcp.on("success", ({ mcpId }) => {
  console.info("MCP connected", mcpId);
});

mcp.on("fail", ({ message }) => {
  console.error("MCP connection failed", message);
});

mcp.registerTools([
  {
    name: "get_page_title",
    description: "Return the current browser page title",
    input: {
      prefix: z.string().optional().describe("Optional title prefix")
    },
    handler: async ({ prefix }: { prefix?: string }) => ({
      title: `${prefix ?? ""}${document.title}`
    })
  }
]);

const localInfo = await getMcpInfo();
console.info("Local MCP information", localInfo);
await mcp.connect();

export async function disposeMcp(): Promise<void> {
  await mcp.close();
}
```

## Vue 3 composable

Store the external SDK instance in `shallowRef` so Vue does not proxy it. Keep the component thin by putting connection and cleanup effects in a composable.

```ts
// composables/useTslConversation.ts
import { onMounted, onUnmounted, readonly, shallowRef } from "vue";
import { createllm } from "@tslfe/ai-sdk";
import type { LLMInstance } from "@tslfe/ai-sdk";

export function useTslConversation() {
  const client = shallowRef<LLMInstance>();
  const connected = shallowRef(false);
  const errorMessage = shallowRef("");

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

  type LlmEventName = Parameters<LLMInstance["on"]>[0];
  const connectedEvent = "connected" as LlmEventName;
  const errorEvent = "error" as LlmEventName;

  onMounted(() => {
    const instance = createllm({
      application: "your-application",
      notify: 0,
      recordConfig: { waveView: { enable: false } },
      tts: { enable: false }
    });

    instance.on(connectedEvent, handleConnected);
    instance.on(errorEvent, handleError);

    client.value = instance;
  });

  onUnmounted(() => {
    client.value?.off(connectedEvent, handleConnected);
    client.value?.off(errorEvent, handleError);
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
