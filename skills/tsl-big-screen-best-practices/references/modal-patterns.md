# 弹层模式（Modal）

## 目录

- [类型选择](#类型选择)
- [视觉来源](#视觉来源)
- [结构与职责](#结构与职责)
- [唯一层级表](#唯一层级表)
- [挂载与缩放](#挂载与缩放)
- [关闭规则](#关闭规则)
- [焦点与键盘](#焦点与键盘)
- [尺寸与布局](#尺寸与布局)
- [异步任务与清理](#异步任务与清理)
- [非模态场景浮层](#非模态场景浮层)
- [模板接口](#模板接口)
- [验收](#验收)

先按交互语义选择 Dialog、Confirm、Drawer、Media Viewer 或 Scene Callout，不要把所有浮在页面上方的内容都实现为 Modal。

## 类型选择

| 类型 | 适用场景 | 背景遮罩 | 焦点约束 |
| --- | --- | --- | --- |
| Dialog | 表单、详情、复杂任务 | 有 | 有 |
| Confirm | 不可逆操作确认 | 有 | 有，优先级最高 |
| Drawer | 长详情、表格、分步操作 | 有 | 有 |
| Media | 视频、图片和监控画面 | 有 | 有 |
| Scene Callout / Popover | 与三维坐标关联的简短信息 | 无 | 无全局焦点陷阱 |

Toast 是短暂反馈，LLM 控制面板是持续工作区，Card 是页面内容，均不得套用 Modal 结构。

## 视觉来源

设计稿明确指定弹层视觉时优先还原设计；未指定时使用模板中的 AI Park 蓝青色表面。视觉变化不得破坏焦点、关闭、滚动、层级和缩放坐标系契约。

## 结构与职责

- Header 放标题、上下文信息和关闭按钮，主要业务动作放在 Footer。
- 关闭按钮始终位于 Header 右侧安全区，不依赖 `header-extra` 是否存在。
- Body 独立负责内容滚动，长内容不得把整个弹层推出画布。
- Footer 只在存在确认、取消或下一步动作时渲染。
- 关闭控件使用 `<button type="button">`，不得使用可点击 `div`。

基础 Modal 只负责结构、焦点、层级、滚动锁和关闭语义。Feature Modal 负责请求、表单、播放器、图表和业务资源清理。

## 唯一层级表

本文件是应用弹层层级的唯一事实源：

| 层 | z-index |
| --- | --- |
| LLM 控制区 | 1999 |
| 主 Modal / Drawer / Media | 2000 |
| Confirm | 2100 |
| Toast 或紧急反馈预留 | 2200 |

最多同时存在一个主 Modal 和一个 Confirm：

- 打开新主 Modal 时，以 `replaced` 原因关闭旧主 Modal，并先关闭已有 Confirm。
- Confirm 只覆盖当前主 Modal，不允许继续叠加 Confirm。
- 只有最上层处理 Escape 和 Tab。
- 功能级代码不得新增应用级 z-index。

弹层状态默认保留在组件内；只有跨页面编排、LLM 命令或无关模块共同控制时才进入 Pinia。Store 只保存可序列化状态，不保存 DOM、组件实例或播放器。

## 挂载与缩放

- 默认 Teleport 到 `#infraApp`。
- `.modal-layer` 使用绝对定位填满设计画布，不使用浏览器 viewport 单位。
- 最大宽高时保留至少 `32px` 画布边距。
- 只有项目存在另一个稳定的缩放弹层根时才覆盖 `teleportTo`。

## 关闭规则

统一使用以下关闭原因：

```text
close-button | backdrop | escape | programmatic | replaced
```

- Dialog、Drawer、Media 默认允许点击遮罩关闭；Confirm 不允许。
- Escape 只关闭最上层，并服从 `closeOnEsc`。
- `busy=true` 时阻止 Escape、遮罩和关闭按钮退出。
- 父组件直接将 `open` 改为 `false` 时报告 `programmatic`。
- 关闭操作必须幂等，重复输入不得重复请求、重复解锁滚动或重复销毁资源。
- 不可逆操作使用 Confirm，并明确受影响对象和后果。

## 焦点与键盘

打开弹层时：

1. 保存触发元素。
2. 优先聚焦 `[autofocus]`，其次第一个可操作元素，最后聚焦弹层 Shell。
3. 将 Tab 和 Shift+Tab 限制在最上层弹层内。
4. 离场动画完成后，将焦点恢复到仍连接的触发元素。

无标题弹层必须提供 `ariaLabel`。关闭按钮、业务按钮和表单控件均保留明显的 `:focus-visible`。

## 尺寸与布局

| 尺寸 | 建议宽度 | 用途 |
| --- | --- | --- |
| `sm` | 420px | Confirm、短表单 |
| `md` | 720px | 普通详情和表单 |
| `lg` | 1120px | 表格、复杂详情 |
| `xl` | 1600px | Media、宽内容 |

- Header 高度、间距和边框使用 Modal token，不在功能代码中重定义。
- Body 使用 `min-height: 0` 和 `overflow: auto`。
- 表格详情优先使用 `lg`，先优化列、Tooltip 和横向滚动，再考虑全屏。
- Media 可移除普通 Body padding，但播放器必须有稳定比例、Loading 和 Error 状态。

## 异步任务与清理

弹层关闭、被替换、路由变化或组件卸载时清理其创建的资源：

- 使用 `AbortController` 或等价机制取消未完成请求。
- 清除轮询、定时器、全局监听、ResizeObserver 和动态挂载容器。
- 暂停视频并释放 MediaStream、HLS/WebRTC 实例和 Object URL。
- 释放临时 ECharts、Three.js 控制器和第三方组件实例。
- 动态创建 Vue app 的调用方负责 `app.unmount()` 并移除容器。

## 非模态场景浮层

Scene Callout / Popover 与 Modal 的区别：

- 不渲染遮罩、不锁定滚动、不设置 `aria-modal`、不安装全局焦点陷阱。
- 锚定三维点或二维坐标，接近画布边缘时翻转或收缩。
- 允许点击场景背景关闭，但不阻断无关的拖拽或缩放。
- 内容复杂、需要持续键盘操作或遮挡场景过多时升级为 Drawer 或 Dialog。

## 模板接口

```text
assets/template/modal/BaseModal.vue
  -> src/components/common/BaseModal/BaseModal.vue
assets/template/modal/useModalLifecycle.js
  -> src/composables/useModalLifecycle.js
assets/template/data-visualization/modal.less
  -> src/assets/styles/modal.less
```

公开 Vue 契约保持：`v-model:open`、`title`、`variant`、`size`、`layer`、`placement`、`closable`、`closeOnBackdrop`、`closeOnEsc`、`busy`、`keepMounted`、`teleportTo`、`ariaLabel`，以及 `close`、`after-enter`、`after-leave` 事件。

为兼容 Vue 3.2，`BaseModal.vue` 可以单独使用普通 `<script>` 设置 `inheritAttrs: false`；其余逻辑使用 `<script setup>`。

## 验收

- 类型、尺寸和关闭策略与内容语义一致。
- 最多一个主 Modal 和一个 Confirm，只有最上层处理键盘。
- Busy 状态阻止全部用户关闭路径并提供反馈。
- 焦点进入、循环和恢复正确，关闭控件是真实按钮。
- Teleport 内容保持在缩放后的 1080p 坐标系内。
- 弹层替换和卸载后滚动锁引用计数归零。
- reduced-motion 下关闭非必要位移和缩放。
- 请求、定时器、媒体、监听器、Observer 和动态挂载均有清理路径。
