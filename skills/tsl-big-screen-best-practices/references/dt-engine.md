# dt-engine 大屏接入

先加载 `$dt-engine-best-practices` 获取当前 API 与生命周期规则。本文件只定义 TSL 大屏的版本、文件和场景所有权约定。

## 版本策略

- 维护项目沿用已安装的 `@tslfe/dt-engine` 版本，除非任务明确要求升级。
- 新项目默认安装最新稳定版（以 `npm view @tslfe/dt-engine version` 为准），不锁定历史补丁版本。
- 复制模板后必须按实际安装版本核对初始化、插件和事件 API，不确定时参考 `$dt-engine-best-practices` 中的 API 参考。

## 模板与位置

```text
assets/template/integrations/dtEngine.js
  -> src/utils/dtEngine.js

assets/template/integrations/engineActions.js
  -> src/services/engineActions.js
```

`dtEngine.js` 是唯一初始化入口，负责：

- 缓存初始化 Promise 和 `meta`，避免重复创建引擎。
- 根据 `VUE_APP_TACOS_LOAD_MODE` 安装 Unity 或 WebGL 插件。
- 在容器存在后挂载引擎。
- 注销事件并等待引擎释放。

`createEngineActions(meta)` 是无 Vue 生命周期的服务工厂，负责场景重置、模型显隐等命令。它不是 composable，不使用 `useEngine()` 命名，也可以安全地被 MCP 服务调用。

## 页面所有权

路由页面在 `onMounted` 初始化，在 `onUnmounted` 释放；事件监听器、POI、特效和临时图层由创建它们的页面或功能模块清理。Page Switch、LLM/MCP 和普通 UI 只接收同一个已初始化 `meta`，不得各自创建引擎。

```vue
<script setup>
import { onMounted, onUnmounted, shallowRef } from 'vue'
import { disposeEngine, init } from '@/utils/dtEngine'

const meta = shallowRef(null)

onMounted(async () => {
  meta.value = await init()
})

onUnmounted(async () => {
  await disposeEngine()
  meta.value = null
})
</script>
```

错误必须交给页面错误态或统一监控；不要静默吞错，也不要把连接地址、token 或客户数据写入日志。
