# Troubleshooting

## Microphone initialization fails

- Require HTTPS or localhost; ordinary insecure origins cannot reliably use `getUserMedia`.
- Start initialization from a user action when browser permission UX requires it.
- Inspect site permission state and OS-level microphone permission.
- Verify no unsupported constraints were passed through `audioTrackSet`.
- Attach the recorder `error` event and the `init` failure callback.
- Call `close()` before replacing an existing recorder.

## LLM WebSocket does not connect

- Confirm `application` is non-empty and `notify` is supplied.
- Inspect the final `/v1/llm/ws/...` request in browser developer tools.
- Because the SDK uses a relative URL, configure the frontend origin or dev-server proxy to reach the backend.
- Check authentication query parameters, token expiry, proxy upgrade headers, and TLS.
- Subscribe to both `connected` and `error`.
- Use `close()` for final teardown; `closeConnection()` closes only the socket.

## Wake-word model or WASM fails to load

- Fetch `modelPath` directly and confirm a successful response with ONNX bytes.
- Confirm `wasmPaths` is a directory URL ending in `/` and contains the ONNX Runtime files required by the installed runtime.
- Detect SPA fallback responses: a `200` response containing HTML is still a broken model/WASM deployment.
- Do not assume npm installation deployed these files. The current package publication whitelist excludes the repository's model and WASM assets; copy approved compatible assets into the consuming application's public/static output.
- Check base paths when the application is hosted below `/`.
- Check MIME types, CORS, CSP, service-worker caching, and cross-origin isolation requirements from the installed ONNX Runtime build.
- Clear IndexedDB or site storage after fixing an HTML fallback or when a stale cached model is suspected. The current loader can cache a successful HTTP response before ONNX validates its bytes.
- Do not copy model or WASM files from this Skill; source and deploy the versions approved for the application.

## TTS is silent or rejected

- Initialize in a browser and account for Web Audio autoplay restrictions.
- Resume playback from a user gesture when required.
- Verify provider type and `params` against the deployed TTS service.
- Check token exposure: do not commit long-lived provider credentials to frontend source.
- Subscribe to the speech `error`, `process`, and `end` events.
- Check volume and whether `setAutoPlay(false)` or `pauseAudio()` was called.
- Call `speech.close()` when replacing or unmounting the instance.

## MCP helpers return empty objects

- Confirm the local companion service is running on `127.0.0.1:12080`, or pass explicit URLs to the individual helper functions.
- Test `/configs`, `/token`, and `/userInfo` directly.
- Check CORS, mixed-content restrictions, endpoint response shapes, and local security software.
- Note that the helper functions catch request failures and return empty objects, so inspect browser console/network errors.

## MCP connection or tool registration fails

- Give every tool a unique non-empty `name`, a `description`, and a `handler`.
- Validate Zod input fields and handler argument assumptions.
- Register tools before calling `connect()`.
- Subscribe to the `fail` event; a rejected reverse connection is reported there.
- Be aware that the current `connect()` catches some exceptions and only logs them instead of rethrowing or emitting `fail`. Use browser network/console diagnostics and an application-level connection timeout when reliable failure state is required.
- Await `mcp.close()` during teardown.

## TypeScript declarations disagree with examples

- Prefer the installed package's declaration files.
- Confirm imports exist at the package root before generating code.
- Do not import internal paths to bypass a missing root export.
- If an internal event enum is referenced by a public method but is not root-exported, derive the parameter type with `Parameters<PublicType["on"]>[0]` and cast known runtime event names to that type.
- When declarations and runtime source disagree, use a stable public alternative and report the version-specific discrepancy. For current source, use `speech.tts()` instead of relying on the mismatched `getTTS` parameter declaration.
