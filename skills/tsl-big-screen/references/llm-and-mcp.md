# LLM And MCP

## Scope

Use only the `@tslfe/ai-sdk` plus MCP tool integration pattern for new projects.

Do not implement alternate embedded-chat bridge patterns unless the user explicitly requests them.

## Dependencies

Install:

```json
{
  "zod": "3.23.8",
  "@tslfe/ai-sdk": "^1.0.13"
}
```

`zod` must be exactly `3.23.8`.

## Files

Use:

```text
src/components/llm-modal/
  index.vue
  mcp.js
  front-control.js
```

Copy quick-question icons from this skill before implementing the component:

```text
assets/icons/svg/icon-refresh.svg     -> src/assets/icons/svg/icon-refresh.svg
assets/icons/svg/icon-question-1.svg  -> src/assets/icons/svg/icon-question-1.svg
assets/icons/svg/icon-question-2.svg  -> src/assets/icons/svg/icon-question-2.svg
```

Optional helpers may live in `utils.js` only when actions need dynamic modals or data shaping.

## LLM Component

`index.vue` should:

- render fixed-position quick question buttons in the bottom-right interaction area
- generate a per-page `conversationId`
- call `getMcpInfo()`
- create the robot through `createllm()`
- pass `mcp_hub_id` in `context.params`
- throttle quick question clicks, usually 10 seconds
- call `createMcp(meta)` after `loadEngine()` resolves

Use this component shape:

```text
src/components/llm-modal/
  index.vue          fixed quick-question buttons and robot init
  mcp.js            MCP server and tool registration
  front-control.js  action orchestration
```

Do not add iframe/chat-panel/postMessage bridge files for new projects.

Example control flow:

```js
import { onMounted } from "vue";
import { throttle } from "lodash-es";
import { createllm, getMcpInfo } from "@tslfe/ai-sdk";
import { loadEngine } from "@/utils/dt-engine";
import { createMcp } from "./mcp";

const conversationId = createConversationId();
let robot = null;
let mcpInfo = null;

const handleQuestion = throttle((text) => {
  if (!robot || !mcpInfo?.config?.client_id) return;
  robot.inputMessage(text, {
    context: {
      conversation_id: conversationId,
      params: {
        mcp_hub_id: mcpInfo.config.client_id
      }
    },
    notifications: [`${process.env.VUE_APP_LLM_APP_CODE}-${mcpInfo.config.client_id}`]
  });
}, 10000, { leading: true, trailing: false });

onMounted(async () => {
  mcpInfo = await getMcpInfo();
  robot = createllm({
    autoInitRecorder: false,
    notify: 0,
    tts: { enable: false },
    token: mcpInfo?.token,
    application: process.env.VUE_APP_LLM_APP_CODE
  });

  const { meta } = await loadEngine();
  createMcp(meta);
});
```

### Quick Question UI

Use the same fixed component form across projects:

- container fixed at `right: 440px; bottom: 24px; z-index: 1999`
- vertical group layout with `16px` gaps
- each group width `56px`
- each quick question button height `55px`
- grouped buttons use translucent black background, `2px` translucent border, `12px` radius, and `backdrop-filter: blur(24px)`
- icons are SVG icon buttons; do not render long text labels on the fixed buttons
- hover color changes to gold `#e8c98c`
- click handler passes the question text to `handleQuestion(text)`

Default style:

```less
.question-container {
  position: fixed;
  right: 440px;
  bottom: 24px;
  z-index: 1999;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-group {
  width: 56px;
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(24px);
}

.question-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 55px;
  color: #f2f3f5;
  cursor: pointer;
  transition: color 0.3s ease-in-out;
}

.question-item:hover {
  color: #e8c98c;
}

.question-line {
  width: 40px;
  height: 1px;
  margin: 0 auto;
  background: #fff;
  opacity: 0.2;
}
```

Default quick questions:

- refresh button: icon `icon-refresh`, text `刷新页面`
- scene introduction button: icon `icon-question-2`, text should describe the current big-screen scenes in one concise Chinese sentence
- optional extra question button: icon `icon-question-1`, text should be a second concise scene or business question only when the screen needs more than two shortcuts

## MCP Tools

Create `mcp.js`:

```js
import { mcpServer } from "@tslfe/ai-sdk";
import { z } from "zod";
import { frontControl } from "./front-control";

export function createMcp(meta) {
  const mcp = new mcpServer(process.env.VUE_APP_MCP_SERVER_NAME || "bigscreen");

  mcp.on("fail", (data) => console.log(data));
  mcp.on("success", (data) => console.log(data));

  mcp.registerTools([
    {
      name: "switchScene",
      description: "Switch to another big-screen scene by scene index.",
      input: {
        type: z.string().describe("Action type, fixed to switchScene"),
        params: z.string().describe("Scene index")
      },
      annotations: {
        __local_only: true
      },
      handler: async (payload) => frontControl(payload, meta)
    },
    {
      name: "refresh",
      description: "Reset the current scene state and refresh screen data.",
      input: {
        type: z.string().describe("Action type, fixed to refresh")
      },
      annotations: {
        __local_only: true
      },
      handler: async (payload) => frontControl(payload, meta)
    }
  ]);

  mcp.connect();
}
```

Add business tools beside these shared tools. Keep tool names stable and descriptions written for the model, not for developers.

MCP server name rules:

- `.env` must define `VUE_APP_MCP_SERVER_NAME = bigscreen`.
- MCP creation must read `process.env.VUE_APP_MCP_SERVER_NAME || "bigscreen"`.
- Do not hard-code business names such as `green-computing-body` in `new mcpServer(...)`.
- `bigscreen` is the fixed default server name for generated big-screen projects.

## Front Control

`front-control.js` is the only place that maps tool payloads to UI, Router, Pinia, dt-engine, modal, light, POI, video, and effect actions.

Rules:

- Throw or return early when `meta` is missing.
- Keep action type strings in constants when they are reused.
- Always reset conflicting UI before starting a new scene sequence.
- Clear previous POI/effects before creating new ones.
- Use `usePageSwitch().switchProject(params)` for `switchScene`.
- Use `useEngine(meta).resetScene()` for `refresh`.
- Keep long staged playback in a stepper or action-sequence helper, not inline nested timers.

Minimal shape:

```js
import router from "@/router";
import { useEngine } from "@/hooks";
import { usePageSwitch } from "@/components/page-switch/usePageSwitch";

export async function frontControl(payload, meta, callback) {
  if (!meta) throw new Error("frontControl requires initialized meta");

  const { type, params } = payload;
  const { resetScene } = useEngine(meta);

  if (type === "refresh") {
    await resetScene();
    window.location.reload();
    return;
  }

  if (type === "switchScene") {
    const { switchProject } = usePageSwitch();
    await switchProject(params);
    return;
  }

  if (type === "router") {
    const path = typeof params === "string" ? params : params?.path;
    if (path) router.push(path);
    return;
  }

  callback?.(type, params);
}
```

Do not put business action logic directly in MCP handlers.
