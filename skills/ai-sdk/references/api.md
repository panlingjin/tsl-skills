# Public API Reference

This reference follows the current root exports in `src/index.ts`. Re-check the installed declarations when integrating a different package version.

## Root exports

```ts
import {
  version,
  createAudioRecorder,
  createllm,
  mcpServer,
  Speech,
  getMcpInfo,
  getMcpConfig,
  getMcpToken,
  getMcpUserInfo,
  OUTPUTTYPE
} from "@tslfe/ai-sdk";

import type {
  AudioRecordConfig,
  LLMConfig,
  LLMInstance
} from "@tslfe/ai-sdk";
```

Do not import internal `Wakeup`, `AudioEventType`, `MessageType`, `SpeechType`, or MCP implementation types from the package root; they are not currently root exports.

Some current public interfaces refer to internal event enums that are not root exports. If TypeScript rejects a valid runtime event string, derive the event-name type from the public method instead of importing an internal path:

```ts
type LlmEventName = Parameters<LLMInstance["on"]>[0];
const connectedEvent = "connected" as LlmEventName;
```

## `createllm(config)`

Creates a browser-side conversation instance backed by a relative WebSocket URL:

```text
/v1/llm/ws/{application}/{clientId}?...
```

The host application must provide a compatible same-origin backend or reverse proxy.

Important `LLMConfig` fields:

```ts
interface LLMConfig {
  recordConfig: AudioRecordConfig;
  application: string;
  notify: 0 | 1;
  clientId?: string;
  notifications?: string[];
  ui?: boolean;
  autoInitRecorder?: boolean;
  notify_id?: string;
  notify_name?: string;
  token?: string;
  wsConfig?: {
    reconnectInterval?: number;
    heartbeatInterval?: number;
    maxReconnectAttempts?: number;
  };
  tts?: {
    enable?: boolean;
    type?: string;
    volume?: number;
    params?: object;
    stopSpeechOnNewOrAbort?: boolean;
  };
  wakeup?: {
    enable: boolean;
    wakeupOnly?: boolean;
  };
}
```

`notify` is required by the current source type even though an older README example omits it.

Useful `LLMInstance` members:

- `inputMessage(text, options?)`: send a normal text request.
- `send({ text, type?, options? })`: send with an optional message type; verify available type exports in the installed version.
- `on(event, callback)` / `off(event, callback)`: subscribe to `connected`, `data`, `progress`, `close`, or `error`.
- `setRequestOption(option)`: merge context/features/request data into later sends.
- `setAutoPlay(enabled)`: enable or stop automatic TTS.
- `recorder`: the associated recorder instance.
- `speech`: the associated speech instance.
- `closeConnection()`: close only the WebSocket.
- `close()`: release recorder, WebSocket, and speech resources; prefer this for teardown.

The current source implementation accepts `{ text, request_id }` in `getTTS`, while its public interface declaration only mentions `{ text }`. Prefer `instance.speech.tts(text, requestId)` or follow the installed declarations.

## `createAudioRecorder(config)`

Pass at least an empty object:

```ts
const recorder = createAudioRecorder({});
```

Useful `AudioRecordConfig` fields:

- `provider`: `{ type: "dui" | "funasr", ...providerOptions }`
- `mode`: `"normal" | "wakeup"`
- `type`: `"sentence" | "live"`
- `audioTrackSet`: browser media-track constraints
- `powerLevelLimit`, `remainTime`, `stopTime`, `maximumTime`, `cancelTime`
- `waveView`: `{ enable, el, type, options }`

Useful recorder methods:

- `init(success?, fail?)`
- `start({ mode?, autoStop? }?)`
- `stop(callback?)`, `cancel()`, `close()`
- `listen()`, `listenCancel()`
- `initWakeUp(config)`
- `changeMode(mode)`, `getCurrentBlob()`
- `on(event, callback)`, `off`, `once`, `offAll`

Common event names are `start`, `stop`, `error`, `text`, `audio`, `close`, `process`, `cancel`, and `wakeup`.

Wakeup configuration passed to `initWakeUp` supports:

```ts
{
  mode?: "ONNX" | "Normal";
  wasmPaths?: string;
  modelPath?: string;
  confidence_threshold?: number;
  highScoreCount?: number;
  onReady?: () => void;
}
```

Defaults are `/ai-sdk/onnxruntime/web/` for WASM files and `/ai-sdk/models/model.onnx` for the model.

The current package publication whitelist contains `es`, `lib`, `dist`, and `typings`; it does not publish the repository's model or WASM assets. The consuming application must deliberately deploy compatible asset files.

## `Speech`

Construct standalone TTS in a browser:

```ts
const speech = new Speech({
  type: "bytedance",
  volume: 1,
  params: {}
});
```

Useful methods:

- `tts(text, requestId?)`
- `pauseAudio({ disableEvents? }?)`
- `clearQueue(requestIds?)`
- `setVolume(volume)`
- `close()`
- `on("process" | "end" | "pause" | "error", callback)`

The constructor creates a Web Audio context. Initialize from a browser lifecycle and expect autoplay policies to require user interaction.

## MCP helpers

- `new mcpServer(mcpId)`
- `registerTools(tools)`
- `connect()`
- `close()`
- `on("success" | "fail", callback)`
- `getMcpConfig(url?)`
- `getMcpToken(url?)`
- `getMcpUserInfo(url?)`
- `getMcpInfo()`

Default local endpoints:

- `http://127.0.0.1:12080/configs`
- `http://127.0.0.1:12080/token`
- `http://127.0.0.1:12080/userInfo`

`registerTools` requires each tool to have a unique `name`, a `description`, and a `handler`. The current demo supplies Zod fields as the input schema. If generated application code imports `zod` directly, declare it as an application dependency.

In the current implementation, the `fail` event reports reverse-transport rejection and close failures, but some exceptions thrown inside `connect()` are caught and only logged. Do not promise that every connection exception reaches application code without first checking the installed SDK version.
