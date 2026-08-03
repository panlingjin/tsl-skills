# 布局与导航

## 应用外壳

- `html`、`body` 和 `#app` 高度均为 `100%`。
- 顶部页头高 `48px`。
- 侧栏展开宽 `224px`，折叠宽 `56px`。
- 工作区面包屑栏高 `48px`。
- 内容背景为 `#F2F3F5`，内边距为 `20px 2px 20px 20px`。
- 普通内容放入白色 `BaseBox`，内边距 `20px`，圆角 `4px`。

## 顶部页头

- Logo/产品名区域宽 `210px`，Logo 高 `24px`。
- 一级模块项宽 `72px`，激活色为 `#5E66F2`，激活背景为 `rgba(242, 243, 245, 0.97)`。
- 折叠侧栏的按钮属于工作区面包屑栏，不放在 Logo 前。
- 右侧使用描边按钮、帮助图标、头像和用户名；控件间距保持 `16px` 左右。

## 侧栏

- 使用 Origami Vue `Menu`、`OriMenu.menuItem` 和 `OriMenu.subMenu`，不要用普通 `div`/`ul` 重写交互。
- 配置 `mode="vertical"`、`collapse`、`default-active` 和 `default-openeds`。
- 通过递归 `AdminMenuItem` 渲染层级，避免在侧栏组件里堆叠多组重复分支。
- 菜单项使用统一数据契约：

```js
const menuItem = {
  key: 'alarm-center',
  label: '告警中心',
  path: '/alarm-center',
  activePath: '/alarm-center',
  icon: 'alarm',
  disabled: false,
  children: [],
}
```

- 激活文字为 `#5E66F2`，激活背景为 `#E8EDFF`，悬停背景为 `#F2F3F5`。
- 菜单行高 `36px`，纵向间距 `4px`，图标 `16px`。
- 激活项根据当前路由路径和 `activePath` 推导，不在组件中保存重复路由状态。

## 面包屑

- 面包屑位于灰色内容画布上方的白色工作区栏，不放入内容卡片。
- 左侧放置 `20px` 的折叠按钮，内部图标 `16px`，右边距 `11px`。
- 使用 `OriBreadcrumb` 与 `OriBreadcrumb.Item`。
- 默认从 `route.matched` 中带字符串 `meta.title` 的记录生成。
- 当前项不可点击；只有带 `path` 的祖先项允许导航。
- 超过 10 个字符的条目启用 `long-text`。

页面确实需要动态层级时，可通过用户 Store 一次性覆盖：

```ts
userStore.changeBreadcrumb([
  { key: 'alarm-center', label: '告警中心' },
  { key: 'alarm-rules', label: '告警规则', path: '/alarm-center/alarm-rules' },
  { key: 'detail', label: '规则详情' },
])
```

布局消费覆盖值后立即清空 Store 中的临时值，切换路由时清除当前覆盖，避免面包屑泄漏。
