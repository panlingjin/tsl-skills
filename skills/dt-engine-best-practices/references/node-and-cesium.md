# NodeServer and Cesium

## `createNodeServer`

```ts
createNodeServer(options: NodeServerConfig): Promise<NodeServer>
```

`NodeServerConfig` is the socket config: an object with optional type fields but runtime requires a valid `url`. Default retry limit is 5. Connection resolves only after the server sends project configuration.

`NodeServer` public API:

| API | Signature / defaults / return | Side effects/lifecycle | Common error |
| --- | --- | --- | --- |
| `projects` | `Project[]` where Project has title, description, preview URL, package URL | Populated from server handshake. | Server payload may be malformed; parser falls back. |
| `start` | `(el, options, callback?) => Promise<Meta<UnityCreator>>` | Starts selected display, creates Cloud engine, mounts it. `options` may be URL string or `{url,width?,height?,minio?,modelsFolderName?}`. | Missing element or display URL throws. |
| `close` | `(url: string) => void` | Sends `CloseClient` to server. | URL must match the started display. |
| `dispose` | `() => void` | Closes NodeServer socket. | Also dispose each returned Meta instance. |

```ts
const server = await createNodeServer({ url: "ws://127.0.0.1:9000" });
const meta = await server.start(container, { url: server.projects[0].packageUrl });
// later
await meta.dispose();
server.dispose();
```

Native concept: remote Unity renderer/process orchestration, not Three.js.

## `createCesiumEngine`

Public declaration:

```ts
createCesiumEngine(
  callback?: (config: {}) => {}
): Promise<void>
```

The source `createCesiumDefaultConfig` returns an empty object and `cesiumCreator` contains only TODO comments. The function is exported but has no engine result or lifecycle.

Do not generate implementation code using it. Report that Cesium support is a placeholder and require a package version/source change before use.
