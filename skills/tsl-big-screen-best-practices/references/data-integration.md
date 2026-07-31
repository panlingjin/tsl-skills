# 数据集成

## 目录

- [Axios](#axios)
- [MockJS](#mockjs)
- [定时刷新](#timed-refresh)
- [WebSocket](#websocket)

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
    const code = data?.code;
    if ([200, "200", 0, "0"].includes(code)) {
      return Object.prototype.hasOwnProperty.call(data, "data") ? data.data : data;
    }

    const message = data?.message || data?.msg || "请求失败";
    Toast.error(message);
    return Promise.reject(new Error(message));
  },
  (error) => {
    const message = error?.response?.data?.message
      || error?.response?.data?.msg
      || error?.message
      || "网络连接失败";
    Toast.error(message);
    return Promise.reject(error instanceof Error ? error : new Error(message));
  }
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
- Set `VUE_APP_MOCK = true` only in `.env.development`.
- Set `VUE_APP_MOCK = false` in `.env.test` and `.env.master` unless a dedicated isolated build explicitly requires mocks.
- Import `src/mock` only when `VUE_APP_MOCK === "true"`.

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
