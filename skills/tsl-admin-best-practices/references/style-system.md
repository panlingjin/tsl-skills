# 样式系统

## 核心令牌

```less
@font-color-strong: #1d2129;
@font-color-regular: #4e5969;
@font-color-sub: #86909c;
@tsl-blue: #5e66f2;
@tsl-background-color: #f7f8fa;
@tsl-border-color: #f1f4f8;
@layout-sider-default-width: 224px;
@layout-header-default-height: 48px;
```

- 页面背景：`#F2F3F5`。
- 白色表面：`#fff`。
- 常规边框：`#e5e6eb`。
- 悬停填充：`#f2f3f5`。
- 禁用色：`#c9cdd4`。
- 主色：`#5E66F2`。
- 成功、警告、危险分别使用低饱和背景配合 `#00b42a`、`#ff7d00`、`#f24949`。

## 排版与间距

- 系统 UI 字体栈包含 `PingFang SC`、`Microsoft YaHei` 等中文回退字体。
- 基础文字 `14px / 22px`。
- 次要信息 `12px / 20px`。
- 区块标题 `16px / 500`。
- 主要间距使用 `8px`、`12px`、`16px`、`20px`、`24px`。
- 默认圆角 `4px`，紧凑图标按钮可使用 `2px`。

## Less 边界

- 全局令牌和 Less mixin 放在 `src/assets/styles/variables.less`，不在令牌文件中堆积组件类名。
- Reset 放在 `src/assets/styles/reset.less`。
- 组件专属样式使用 `<style scoped lang="less">`。
- 需要单独维护的共享组件样式放在 `src/assets/styles/components/`，文件名使用 kebab-case。
- 不把页面私有选择器加入全局样式。

## Origami 样式覆盖

- 只在 TSL 信息密度确实需要时使用 `:deep()`。
- 覆盖范围必须由当前组件根类限定。
- 不依赖未记录的 DOM 层级来实现业务功能。
- 控件对齐问题优先通过容器布局解决，再考虑覆盖组件内部样式。

## 动效

页面进入动效保持轻量：约 `0.3s` 至 `0.5s`，由轻微位移和透明度过渡组成。遵循系统的减少动态效果偏好，不使用营销式大幅动画。
