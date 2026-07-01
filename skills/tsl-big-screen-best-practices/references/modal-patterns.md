# 页面弹层规范

本规范用于大屏页面中的 Dialog、Confirm、Drawer、Media Viewer，以及与三维场景绑定的非模态 Callout/Popover。弹层必须先按交互语义分类，再决定尺寸、遮罩、焦点和关闭策略，不能只因为“内容浮在页面上”就统一做成 Modal。

## 目录

- [类型选择](#类型选择)
- [视觉来源与归一化](#视觉来源与归一化)
- [结构与职责](#结构与职责)
- [层级与并发](#层级与并发)
- [挂载与缩放](#挂载与缩放)
- [关闭策略](#关闭策略)
- [焦点与键盘](#焦点与键盘)
- [尺寸与布局](#尺寸与布局)
- [异步与资源清理](#异步与资源清理)
- [非模态场景浮层](#非模态场景浮层)
- [模板使用](#模板使用)
- [检查清单](#检查清单)

## 类型选择

| 类型 | 适用内容 | 默认遮罩关闭 | 默认角色 | 典型尺寸 |
| --- | --- | --- | --- | --- |
| Dialog | 普通信息、短表单、单条详情、详情表格 | 允许 | `dialog` | `md` / `lg` |
| Confirm | 确认、警告、不可逆操作 | 禁止 | `alertdialog` | `sm` |
| Drawer | 长详情、控制面板、连续浏览 | 允许 | `dialog` | 480px 宽 |
| Media Viewer | 视频、图片、监控画面 | 允许 | `dialog` | `xl` |
| Scene Callout / Popover | 场景点位说明、轻量操作、空间锚定信息 | 无遮罩 | 非模态 | 随内容 |

Toast 是短时反馈，LLM 控制面板是持续工作区，卡片是页面内容容器；三者不套用本规范的模态结构。

## 视觉来源与归一化

默认视觉来自 `ai-park-screen` 的实际弹窗模式，不是对多个项目做像素频次统计。AI Park 当前画布和业务弹窗尺寸不适合作为 1920×1080 模板直接复制，因此只固化稳定的视觉特征，并把排版尺寸归一到本 Skill 的 8px 间距体系。

| AI Park 原始模式 | 1920×1080 规范值 | 处理方式 |
| --- | --- | --- |
| 主表面 `rgba(0,0,0,.4)` | `rgba(0,0,0,.4)` | 保留半透明黑色，遮罩保持独立 |
| 134°、2px、`#65F2FC` 渐变描边 | 相同颜色和角度 | 使用双层 background 支持 8px 圆角 |
| 主弹窗 `blur(32px)` | `blur(32px)` | 保留复杂场景上的可读性 |
| 标题栏 60px、标题 28px | 标题栏 48px、标题 20px | 按 1080p 与 8px 网格收敛 |
| 标题栏 `rgba(16,23,22,.4)`、青蓝内发光 | 保留，内发光 13px | 作为主弹窗识别特征 |
| 操作按钮 186×77px、文字 24px | 最小宽 120px、高 48px、文字 16px | 保留青色描边和内外发光 |
| 场景浮层 `rgba(15,31,47,.72)`、`#6C8097`、`blur(16px)` | 原色与模糊值保留 | 独立为轻量 Scene Callout |

`sm/md/lg/xl`、Drawer 480px、32px 画布边缘和应用层级继续使用本 Skill 的统一规格。不要复制 AI Park 的固定坐标、业务宽高、图片标题背景或客户数据。

## 结构与职责

模态弹窗统一使用 header、body、footer：

- header 放标题、上下文元信息和关闭按钮，不放主要业务操作。
- 关闭按钮始终贴紧 header 右侧安全间距；其定位不得依赖可选的 `header-extra` slot 是否渲染。
- body 承载内容并独立滚动，弹窗整体不得随长内容超出画布。
- footer 放确认、取消或下一步操作；没有操作时不渲染空 footer。
- 关闭控件必须使用真实 `<button type="button">`，不能用可点击的 `div`。

`BaseModal.vue` 只负责 Teleport、弹层结构、ARIA、Transition、关闭事件和 slots。Feature Modal 负责请求、表单状态、按钮行为、视频实例及业务文案。不要把领域接口或 Pinia store 写进基础外壳。

## 层级与并发

统一层级如下：

| 内容 | z-index |
| --- | ---: |
| LLM 控制层 | 1999 |
| 主弹窗 | 2000 |
| Confirm | 2100 |
| Toast / 紧急反馈预留 | 2200 |

禁止业务模块使用 `9999`、`99999` 等临时层级解决覆盖问题。

同一时间只允许一个主弹窗和一个 Confirm：

- 打开新主弹窗时，以 `replaced` 原因关闭旧主弹窗；若旧主弹窗上还有 Confirm，先关闭 Confirm。
- Confirm 可以覆盖主弹窗，并始终是最顶层键盘交互目标。
- 新 Confirm 替换旧 Confirm，不能叠出多层确认框。
- 非模态 Scene Callout 不进入主弹窗栈，但必须避开主弹窗和 Confirm 的层级。

页面局部组件默认使用本地状态管理弹窗。只有跨页面调度、LLM 指令或多个无父子关系模块共同控制时才提升到 Pinia；store 保存声明式状态，不保存 DOM、组件实例和播放器实例。

## 挂载与缩放

大屏以 1920×1080 画布缩放时，默认 Teleport 到 `#infraApp`，使弹层与页面共享缩放和坐标系。不要默认 Teleport 到 `body`，否则尺寸、点击坐标和场景锚点可能脱离画布缩放。

- `#infraApp` 必须是统一缩放根节点或其稳定子节点，并建立定位上下文。
- `.modal-layer` 使用绝对定位铺满画布，而不是使用浏览器视口尺寸。
- 最大宽高始终保留 32px 画布边缘。
- 只有项目挂载结构明确不使用缩放根节点时，才通过 `teleport-to` 显式覆盖目标。

## 关闭策略

关闭原因统一为：

```text
close-button | backdrop | escape | replaced | programmatic
```

- Dialog、Drawer、Media 默认允许点击遮罩关闭；Confirm 默认禁止。
- Esc 只关闭弹层栈最顶层，并遵循 `closeOnEsc`。
- `busy=true` 时，Esc、遮罩和关闭按钮全部失效，防止提交过程中退出。
- 父组件把 `open` 直接改为 `false` 时，记录为 `programmatic`。
- 关闭动作必须幂等；连续点击不能重复发请求、重复解锁滚动或重复销毁资源。
- 不可逆动作必须使用 Confirm，并明确写出动作对象与后果，不使用含糊的“是否确定”。

## 焦点与键盘

每个模态弹窗打开时：

1. 保存当前触发元素。
2. 优先聚焦 `[autofocus]`，其次聚焦第一个可操作元素；都不存在时聚焦弹窗容器。
3. Tab 与 Shift+Tab 在当前最顶层弹窗内循环。
4. 关闭并完成离场动画后，将焦点恢复到仍存在且可聚焦的触发元素。

主弹窗与 Confirm 叠加时，Confirm 获取焦点；Confirm 关闭后，焦点回到主弹窗内。页面滚动锁使用引用计数，关闭 Confirm 不能提前解除仍由主弹窗持有的锁。

有可见标题时使用 `aria-labelledby`；没有标题时必须提供 `ariaLabel`。Confirm 使用 `role="alertdialog"`，其余模态变体使用 `role="dialog"`，并设置 `aria-modal="true"`。

## 尺寸与布局

尺寸基线：

| 尺寸 | 宽度 | 适用场景 |
| --- | ---: | --- |
| `sm` | 360px | Confirm、短提示、小表单 |
| `md` | 560px | 普通详情、短表单 |
| `lg` | 800px | 表格详情、多分区表单 |
| `xl` | 1200px | Media、复杂详情 |

Drawer 默认宽 480px，从左或右贴边进入；Media 默认使用 `xl`。所有尺寸仍受 `calc(100% - 64px)` 和 `calc(100% - 64px)` 最大宽高限制。

- header 高度和内边距使用 modal token，避免业务页面重复写值。
- body 使用 `min-height: 0` 与 `overflow: auto`，确保 Flex 容器内正确滚动。
- 表格详情优先使用 `lg`；列很多时优化列、Tooltip 和横向滚动，不直接升级为全屏。
- Media body 可移除普通内容 padding，但播放器必须有稳定比例、加载态和错误态。
- Drawer 适合连续浏览，关闭后可恢复列表滚动和当前选中项。

## 异步与资源清理

打开弹窗后创建的资源必须在关闭、替换、路由离开和组件卸载时清理：

- 使用 `AbortController` 或等价机制取消未完成请求。
- 清理轮询、延时器、全局事件监听、ResizeObserver 和动态容器。
- 暂停视频并释放媒体流、HLS/WebRTC 实例和对象 URL。
- 销毁临时 ECharts、Three.js 控制器或第三方组件实例。
- `keepMounted` 只保留 DOM，不代表业务副作用可以继续运行；副作用由 `open` 驱动启停。

动态创建 Feature Modal 时必须保存 `createApp()` 返回值，并在关闭后执行 `app.unmount()` 与容器移除。优先使用声明式模板和本地状态，只有跨模块调用确有需要时才动态挂载。

## 非模态场景浮层

Scene Callout / Popover 与 Modal 的核心区别：

- 不渲染遮罩，不锁页面滚动，不设置 `aria-modal`，也不进行全局焦点锁。
- 与三维点位或二维坐标保持锚定，超出画布时翻转或收缩。
- 点击场景空白处可以关闭，但不能拦截无关的场景拖拽和缩放。
- 信息复杂、需要键盘连续操作或会遮挡大量场景时，升级为 Drawer 或 Dialog。

使用 `.scene-callout` 预设时，标题装饰由 CSS 斜切渐变生成，不依赖 AI Park 图片资源。关闭控件仍使用真实 button；浮层本身使用 `aside`、`section` 或普通容器即可，不添加 `aria-modal`。

## 模板使用

复制以下模板到项目：

```text
assets/template/modal/BaseModal.vue
  -> src/components/modal/BaseModal.vue

assets/template/modal/use-modal-lifecycle.js
  -> src/hooks/use-modal-lifecycle.js

assets/template/data-visualization/modal.less
  -> src/assets/style/modal.less
```

`modal.less` 依赖同目录的 `data-tokens.less`。项目全局入口应只引入一次，Feature Modal 不重复覆盖基础层级和尺寸。

公共 Vue 合约：

```text
Props
open: Boolean
title: String
variant: dialog | confirm | drawer | media
size: sm | md | lg | xl
layer: main | confirm
placement: left | right
closable: Boolean
closeOnBackdrop: Boolean
closeOnEsc: Boolean
busy: Boolean
keepMounted: Boolean
teleportTo: String
ariaLabel: String

Emits
update:open
close({ reason })
after-enter
after-leave

Slots
title | header-extra | default | footer
```

公共 CSS 合约：

```text
.modal-layer--main | --confirm
.modal-backdrop
.modal-shell--dialog | --confirm | --drawer | --media
.modal-shell--sm | --md | --lg | --xl
.modal-shell--left | --right
.modal__header | __title | __extra | __close | __body | __footer
.modal-action
.modal-action--primary | .modal-action--secondary
.scene-callout
.scene-callout__header | .scene-callout__title
.scene-callout__close | .scene-callout__body
```

```vue
<BaseModal
  v-model:open="open"
  title="空间详情"
  variant="dialog"
  size="md"
  layer="main"
  :busy="saving"
  teleport-to="#infraApp"
  @close="handleClose"
>
  <template #header-extra />
  <template #default />
  <template #footer />
</BaseModal>
```

```html
<aside class="scene-callout" aria-label="点位详情">
  <header class="scene-callout__header">
    <h3 class="scene-callout__title">点位详情</h3>
    <button class="scene-callout__close" type="button" aria-label="关闭点位详情"></button>
  </header>
  <div class="scene-callout__body">...</div>
</aside>
```

## 检查清单

- 类型、尺寸、关闭策略与内容语义一致。
- 同时最多一个主弹窗和一个 Confirm，最顶层处理 Esc 与 Tab。
- 无标题时有 `ariaLabel`，Confirm 使用 `alertdialog`。
- busy 状态阻断所有退出入口，并提供明确反馈。
- 焦点进入、循环、恢复正确；关闭按钮是真实 button。
- 有无 `header-extra` 时关闭按钮都保持右对齐；存在 extra 时二者间距为 12px。
- Teleport 后仍处于 1080p 画布缩放和坐标系内。
- 滚动锁引用计数在叠层、替换和卸载场景下归零。
- reduced-motion 下禁用不必要位移与缩放动画。
- 主弹窗使用 AI Park 归一化表面；Scene Callout 使用轻量蓝灰表面，二者不混用。
- 请求、计时器、媒体、监听器和动态挂载均可清理。
