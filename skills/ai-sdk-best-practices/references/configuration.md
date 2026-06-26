# Runtime Configuration

Use a project-level runtime configuration boundary before generating SDK initialization code. The skill should help the consuming application decide where values come from; it should not store real credentials or pretend placeholder values are production-ready.

## Configuration workflow

1. Inspect the target project for its existing config style:
   - Vite or Vue: `import.meta.env` and `VITE_`-prefixed public values.
   - SSR or Node-backed apps: framework runtime config or server-injected public config.
   - Existing app config modules such as `config.ts`, `env.ts`, or `runtime-config.ts`.
   - Backend token exchange when provider credentials or long-lived tokens are involved.
2. Create or reuse one config boundary, for example `getRuntimeTslAiSdkConfig()`.
3. Keep SDK feature code consuming the config object. Do not scatter raw env reads, TODO strings, or fake tokens inside `createllm`, `createAudioRecorder`, `Speech`, wakeup, or MCP setup.
4. Validate required non-secret values at runtime with clear errors. Leave TODO comments for values the application owner must supply.
5. Treat browser-exposed config as public. Keep long-lived provider tokens, API keys, and provider secrets on the backend or exchange them for short-lived runtime tokens.

## Suggested config shape

Adapt names to the host project's conventions:

```ts
import { SpeechType } from "@tslfe/ai-sdk";
import type { AudioRecordConfig, SpeechOptions } from "@tslfe/ai-sdk";

export interface TslAiSdkRuntimeConfig {
  application: string;
  notify: 0 | 1;
  token?: string;
  wsOrigin?: string;
  recordConfig: AudioRecordConfig;
  tts?: SpeechOptions & {
    enable?: boolean;
    stopSpeechOnNewOrAbort?: boolean;
  };
  wakeup?: {
    modelPath: string;
    wasmPaths: string;
    confidence_threshold?: number;
    highScoreCount?: number;
  };
  mcp?: {
    mcpId: string;
    configUrl?: string;
    tokenUrl?: string;
    userInfoUrl?: string;
  };
}

function requirePublicEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name}; configure it in the app runtime environment.`,
    );
  }
  return value;
}

export function getRuntimeTslAiSdkConfig(): TslAiSdkRuntimeConfig {
  return {
    application: requirePublicEnv(
      "VITE_TSL_AI_APPLICATION",
      import.meta.env.VITE_TSL_AI_APPLICATION,
    ),
    notify: 0,
    token: undefined, // TODO: fetch a short-lived token from the application backend if required.
    wsOrigin: import.meta.env.VITE_TSL_AI_WS_ORIGIN,
    recordConfig: {
      type: "sentence",
      waveView: { enable: false },
    },
    tts: {
      enable: false,
      type: SpeechType.BYTEDANCE,
      volume: 1,
      params: undefined, // TODO: load provider params from the approved runtime source.
    },
    wakeup: {
      modelPath:
        import.meta.env.VITE_TSL_AI_WAKEUP_MODEL_PATH ||
        "/ai-sdk/models/model.onnx",
      wasmPaths:
        import.meta.env.VITE_TSL_AI_WAKEUP_WASM_PATH ||
        "/ai-sdk/onnxruntime/web/",
    },
    mcp: {
      mcpId: import.meta.env.VITE_TSL_AI_MCP_ID || "bigscreen",
      configUrl: import.meta.env.VITE_TSL_AI_MCP_CONFIG_URL,
      tokenUrl: import.meta.env.VITE_TSL_AI_MCP_TOKEN_URL,
      userInfoUrl: import.meta.env.VITE_TSL_AI_MCP_USER_INFO_URL,
    },
  };
}
```

## Feature-specific values

- LLM: `application`, `notify`, optional short-lived `token`, backend proxy/origin, `autoInitRecorder`, and `recordConfig`.
- Recorder or ASR: provider type, provider-specific recognition params, `audioTrackSet`, recording mode, and wave view settings.
- TTS: `SpeechType`, `volume`, provider params, voice parameters, and any runtime TTS token.
- Wakeup: `modelPath`, `wasmPaths`, confidence threshold, and count thresholds. Verify deployed files independently.
- MCP: `mcpId`, companion service availability, and optional URLs for config, token, and user info helpers.

## Missing values

- Generate a config boundary and TODO comments for ordinary missing values.
- Add runtime assertions for required values that would make the feature impossible to start.
- Ask the user before committing a browser-side design that exposes long-lived credentials.
- Do not generate fake credentials, live-looking tokens, or provider params just to make an example appear complete.
