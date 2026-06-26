# Public API Reference

This reference follows the current root exports in `src/index.ts`. Re-check the installed declarations when integrating a different package version. `@tslfe/ai-sdk` is the TSL browser SDK; it is not OpenAI's AI SDK.

## Current root exports

Import runtime values and exported types from the package root only:

```ts
import {
  version,
  createAudioRecorder,
  AudioEventType,
  AudioTimer,
  RecoderStatus,
  StopTrigger,
  createllm,
  createLLMDefaultConfig,
  LLMEventType,
  MessageType,
  OUTPUTTYPE,
  Speech,
  SpeechType,
  Wakeup,
  getMcpConfig,
  getMcpInfo,
  getMcpToken,
  getMcpUserInfo,
  mcpEvent,
  mcpServer
} from "@tslfe/ai-sdk";

import type {
  AudioEventData,
  AudioInstance,
  AudioRecordConfig,
  RecordingStateManager,
  StartOptions,
  waveData,
  LLMConfig,
  LLMErrorData,
  LLMEventData,
  LLMInstance,
  LLMRequestOptions,
  LLMSendParams,
  SpeechConfig,
  SpeechEventMap,
  SpeechInstance,
  SpeechOptions,
  wakeupConfig,
  wakeupMode,
  wakeupState,
  McpEventData,
  McpEventMap,
  McpEventType,
  McpFailData,
  McpInfo,
  McpSuccessData,
  Tool
} from "@tslfe/ai-sdk";
```

Do not import package internals such as `@tslfe/ai-sdk/src/...`, `@tslfe/ai-sdk/es/...`, or `@tslfe/ai-sdk/lib/...` in application code.

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
  tts?: SpeechOptions & {
    enable?: boolean;
    stopSpeechOnNewOrAbort?: boolean;
  };
  wakeup?: {
    enable: boolean;
    wakeupOnly?: boolean;
  };
}
```

`notify` is required by the current source type even though older README examples may omit it.

Treat `application`, `notify`, `token`, WebSocket proxy/origin assumptions, `recordConfig`, TTS params, and wakeup settings as runtime configuration. Load [configuration.md](configuration.md) before generating LLM setup code, and route project-specific values through a config boundary instead of hard-coding them inside `createllm`.

Useful `LLMInstance` members:

- `inputMessage(text, options?)`: send a normal text request.
- `send({ text, type?, options? })`: send with an optional `MessageType`.
- `on(type, callback)`: subscribe to `LLMEventType.progress`, `close`, `data`, `connected`, or `error`; returns an unsubscribe function.
- `off(type, callback)`: remove a handler when not using the returned unsubscribe.
- `setRequestOption(option)`: merge context/features/request data into later sends.
- `setAutoPlay(enabled)`: enable or stop automatic TTS.
- `getTTS({ text, request_id? })`: request explicit TTS through the combined instance.
- `recorder`: the associated `AudioInstance`.
- `speech`: the associated `Speech` instance.
- `closeConnection()`: close only the WebSocket.
- `close()`: release recorder, WebSocket, and speech resources; prefer this for teardown.

`createLLMDefaultConfig()` returns defaults with `autoInitRecorder: true`, `notify: 0`, ByteDance TTS enabled, and wakeup disabled. Override `autoInitRecorder: false` for text-only UI that should not ask for microphone access on mount.

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

Treat provider credentials and recognition params as runtime configuration. Do not place ASR provider secrets or long-lived tokens in browser source.

Useful recorder methods:

- `init(success?, fail?)`
- `start({ mode?, autoStop? }?)`
- `stop()`: returns `Promise<void> | undefined`
- `cancel()`: returns `Promise<void>`
- `listen()`
- `listenCancel()`: returns `Promise<void>`
- `close(isEmit?)`
- `initWakeUp(config)`: capital `U`
- `changeMode(mode)`
- `getCurrentBlob()`
- `on(event, callback)`: subscribe to `AudioEventType` values and return an unsubscribe function.
- `off(event, callback)`, `once(event, callback)`, `offAll(event?)`

Recorder event names are exported as `AudioEventType.start`, `stop`, `error`, `text`, `audio`, `close`, `process`, `cancel`, and `wakeup`.

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
Read wakeup asset paths from runtime configuration when the consuming app's base path, CDN path, or deployment target controls where static assets are served.

## `Speech`

Construct standalone TTS in a browser:

```ts
const speech = new Speech({
  type: SpeechType.BYTEDANCE,
  volume: 1,
  params: config.tts.params
});
```

`SpeechOptions` accepts `type?: SpeechType`, `volume?: number`, and provider-specific `params`.
Treat provider-specific `params` as application configuration. Do not invent fake provider params or commit live provider credentials in examples.

Useful methods:

- `tts(text, requestId?)`
- `pauseAudio({ disableEvents? }?)`
- `clearQueue(requestIds?)`
- `setVolume(volume)`: clamps to `0.0` through `1.0`
- `close()`
- `on("process" | "end" | "pause" | "error", callback)`

The constructor creates a Web Audio context. Initialize from a browser lifecycle and expect autoplay policies to require user interaction.

## Wakeup

`Wakeup`, `wakeupConfig`, `wakeupMode`, and `wakeupState` are root exports. Most application code should use `recorder.initWakeUp(config)` so microphone frames are wired into wake-word processing. Construct `new Wakeup(config)` only for lower-level custom integrations.

## MCP helpers

- `new mcpServer(mcpId)`
- `registerTools(tools)`
- `connect()`
- `close()`
- `on(mcpEvent.SUCCESS | mcpEvent.FAIL, callback)` or `on("success" | "fail", callback)`
- `getMcpConfig(url?)`
- `getMcpToken(url?)`
- `getMcpUserInfo(url?)`
- `getMcpInfo()`

Default local endpoints:

- `http://127.0.0.1:12080/configs`
- `http://127.0.0.1:12080/token`
- `http://127.0.0.1:12080/userInfo`

`Tool<TArgs, TResult>` requires each tool to have a unique `name`, a `description`, and a `handler`. The handler receives an optional argument, so write handler code defensively. The current demo supplies Zod fields as the input schema. If generated application code imports `zod` directly, declare it as an application dependency.

Treat `mcpId` and helper endpoint URLs as runtime configuration when the application does not use the default local companion service.

In the current implementation, the `fail` event reports reverse-transport rejection and close failures, but some exceptions thrown inside `connect()` are caught and only logged. Do not promise that every connection exception reaches application code without first checking the installed SDK version.
