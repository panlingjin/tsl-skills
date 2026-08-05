# 页面切换器（Page Switch）

页面切换器是同一大屏内的项目/场景切换器，不替代 Vue Router。只有设计或需求明确需要时才接入。

## 模板

```text
assets/template/page-switch/usePageSwitch.js
  -> src/composables/usePageSwitch.js
assets/template/page-switch/useAutoCloseTimer.js
  -> src/composables/useAutoCloseTimer.js
assets/template/page-switch/pageSwitch.js
  -> src/services/pageSwitch.js
assets/template/page-switch/page-switch.less
  -> src/assets/styles/page-switch.less
assets/img/switch/*
  -> src/assets/images/switch/*
```

references 只定义接口；计时、切换命令和样式以模板为准。

## 行为契约

- 默认收起；展开后在无操作时自动收起。
- Pointer、键盘或焦点交互会重置计时器。
- 组件卸载、功能禁用或切换完成时清理计时器。
- 切换场景前将外部索引转换为非负整数；无效输入直接拒绝。
- 服务接收已初始化的 `meta`，不创建 dt-engine，也不导入全局 Router。
- 切换失败保留当前场景，并把错误交给调用方呈现。

## 可访问性与动效

- 展开入口和项目项使用 `<button type="button">`，提供 `aria-label`、`aria-expanded`、当前态和禁用态。
- 保留 `:focus-visible` 焦点样式；装饰图使用 `aria-hidden="true"`。
- 只 transition 明确属性，不使用 `transition: all`。
- `prefers-reduced-motion: reduce` 下关闭位移与旋转动效。

布局仍处于 `big-screen-ui.md` 定义的 1920×1080 缩放根内；不要为页面切换器创建第二套缩放坐标系。
