---
name: ai-sdk
description: Integrate and troubleshoot the browser package @tslfe/ai-sdk in TypeScript frontend applications. Use when implementing TSL voice recording or recognition, LLM conversations, TTS playback, offline wake-word detection, or the SDK's browser-side MCP server; when adapting these features to Vue 3; or when diagnosing microphone, WebSocket, ONNX/WASM, speech, or local MCP service failures. Do not use for unrelated packages that are merely described as an AI SDK.
---

# Use TSL AI SDK

Integrate `@tslfe/ai-sdk` from its actual exported API and browser runtime requirements. Generate the smallest working TypeScript implementation, then add lifecycle cleanup and targeted diagnostics.

## Follow the source of truth

Use this priority whenever documentation and code disagree:

1. Installed package declarations or this repository's `src/index.ts` exports and source types
2. Repository demos
3. README examples

Do not invent imports from internal modules. The current root exports are documented in [references/api.md](references/api.md).

Treat version drift as a real possibility. Check the installed package version or repository `package.json` before relying on a signature. In particular:

- Pass the required `notify` property to `createllm`; the README quick start currently omits it.
- Call `recorder.initWakeUp(...)` with a capital `U`; older documentation may show `initWakeup`.
- Prefer `instance.speech.tts(text, requestId)` for explicit TTS when the installed `getTTS` declaration and implementation disagree.

## Choose the integration path

- Use `createllm` for a combined WebSocket conversation, recorder, and TTS instance.
- Use `createAudioRecorder` for standalone microphone capture, recognition, or wake-word handling.
- Use `Speech` for standalone TTS playback.
- Use `mcpServer` plus `getMcpInfo` for browser-side MCP tool registration and reverse connection.

Read [references/api.md](references/api.md) before generating code that uses the selected path. Read [references/examples.md](references/examples.md) for minimal TypeScript and Vue 3 patterns. Read [references/troubleshooting.md](references/troubleshooting.md) when the request involves setup, deployment, or failures.

## Apply the integration workflow

1. Confirm that the target runs in a browser. Guard browser-only initialization in SSR applications.
2. Confirm the installed SDK version and TypeScript declarations.
3. Identify required backend details:
   - LLM application name, `notify` mode, token, and WebSocket proxy/origin
   - ASR provider credentials when applicable
   - TTS provider credentials and voice parameters
   - MCP identifier and availability of the local companion service
4. Request microphone access only from a user-driven flow where practical. Handle denial and insecure-context failures.
5. Configure static wake-word assets when wakeup is enabled. Verify both the ONNX model URL and the ONNX Runtime WASM directory.
6. Register event handlers before starting recording or connecting when events could fire immediately.
7. Surface connection, recorder, speech, and MCP errors to the application instead of logging success only.
8. Release every created resource:
   - Call `llm.close()` for the combined instance.
   - Call `recorder.close()` for a standalone recorder.
   - Call `speech.close()` for standalone TTS.
   - Await `mcp.close()` for an MCP server.
   - Remove application-owned event handlers and revoke application-created object URLs.

For Vue 3, keep SDK class instances in `shallowRef`, initialize them in `onMounted`, and release them in `onUnmounted`. Prefer a composable when the integration owns multiple events or lifecycle effects.

## Keep generated code honest

- Import runtime values and exported types only from `@tslfe/ai-sdk`.
- Do not import `Wakeup`, internal event enums, internal MCP types, or paths under `src/`.
- Do not expose provider tokens in committed frontend source. Use the deployment's approved runtime configuration or token exchange.
- Do not claim wake-word support works until the model and WASM files are actually served with successful HTTP responses.
- Do not treat `closeConnection()` as full cleanup; use `close()` unless only the WebSocket must be disconnected.
- Preserve the application's framework, package manager, and existing lifecycle conventions.
