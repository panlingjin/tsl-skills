# Data Integration

## Axios

Use native `axios` for new projects. Create a single shared instance in `src/utils/axios.js`.

```js
import axios from "axios";
import { Toast } from "origami-vue";

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL || "/",
  timeout: 30 * 1000,
  headers: {}
});

request.interceptors.request.use((config) => {
  return config;
});

request.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data?.code === 200 || Number(data?.code) === 0) {
      return data.data ?? data;
    }

    if (data?.msg) Toast.error(data.msg);
    if (data?.message) Toast.error(data.message);
    return Promise.reject(data);
  },
  (error) => Promise.reject(error)
);

export default request;
```

All API modules must import this instance:

```js
import request from "@/utils/axios";

export function getOverview(params) {
  return request.get("/api/overview", { params });
}

export function updateScene(data) {
  return request.post("/api/scene", data);
}
```

## MockJS

Mock data must simulate real HTTP. Business code should still call Axios normally.

Use:

```text
src/mock/
  index.js
  home.js
  device.js
```

`src/mock/index.js`:

```js
import Mock from "mockjs";
import "./home";
import "./device";

Mock.setup({
  timeout: "200-600"
});
```

Domain mock:

```js
import Mock from "mockjs";

Mock.mock(/\/api\/overview/, "get", () => ({
  code: 200,
  message: "success",
  data: {
    "total|1000-9999": 1,
    "online|100-999": 1
  }
}));
```

Rules:

- Match the same URL and HTTP method used by `api/`.
- Return the same envelope as the real service: `{ code, message, data }`.
- Include error examples through the same envelope, not by throwing from components.
- Keep mock records generic. Do not copy customer data, private IDs, URLs, or tokens.
- Set `VUE_APP_MOCK = true` in `.env` so MockJS is enabled by default in every mode.
- Import `src/mock` only when `VUE_APP_MOCK === "true"`. A mode-specific environment file may explicitly set it to `false` to use real services.

## Timed Refresh

Use a composable/helper for interval refresh:

```js
export function useRefresh(callback, waiting = 10 * 60 * 1000, leading = false) {
  if (leading) callback();
  const timer = setInterval(callback, waiting);
  return () => clearInterval(timer);
}
```

Store cleanup functions in the owning store/component and run them on destroy or route leave.

## WebSocket

Use a wrapper when multiple modules subscribe to a socket.

Minimum wrapper responsibilities:

- connect lazily
- expose `send`
- expose `addEventListener` returning an unsubscribe function
- parse JSON safely
- reconnect only when the business requires it
- close or unsubscribe when the route/store is destroyed

Do not put raw WebSocket message parsing in display components.
