# 标题与装饰

## 目录

- [标题层级](#标题层级)
- [选择规则](#选择规则)
- [文字与辅助信息](#文字与辅助信息meta)
- [标记结构](#标记结构)
- [资源与设计变量](#资源与设计变量token)
- [克制与布局安全](#克制与布局安全)
- [可访问性与动效](#可访问性与动效)

标题装饰用于建立层级，不用于填满空白。优先保证标题文字、操作和数据上下文可读，再选择装饰形式。

## 标题层级

| 层级 | 适用位置 | 推荐形式 |
| --- | --- | --- |
| 页面标题 | Header | 页面主题与状态，不使用卡片装饰 |
| Panel 标题 | 左右主面板 | Cap 或设计指定背景 |
| Content Card 标题 | 图表、列表、KPI 组 | Rail 或普通标题 |
| Subsection 标题 | 卡片内部小节 | Marker / Line |
| Floating 标题 | 场景浮动卡片 | Bracket |
| Item 标签 | KPI、状态、排行项 | 默认纯文字 |

同一卡片只使用一种主要标题形式：`cap`、`rail` 或 `bracket`。

## 选择规则

- Cap：用于完整 Panel 表面，强调主业务区域。
- Rail：用于开放、横向的内容卡片；只与 `.data-card--rail-panel` 配合。
- Marker / Line：用于卡片内部小节，不升级为 Panel 标题。
- Bracket：用于场景浮动信息或轻量覆盖层。
- Orbit：只包围具有真实语义的图标，不作为纯背景噪声。
- Divider / Corner：只用于辅助分组，不与全部其他装饰叠加。

Rail 不与完整圆角边框、彩色 Panel 填充或 Backdrop blur 组合。Panel 强、Content Card 中、Subsection 轻、重复 Item 纯文字。

## 文字与辅助信息（Meta）

- 使用与文档层级相符的 `h1/h2/h3`，不要通过 class 伪造语义层级。
- 标题单行显示；必须截断时提供完整上下文、`title` 或可访问 Tooltip。
- 标题位置由 CSS token 控制，不写项目专属绝对坐标。
- 不让 SVG 或背景图决定标题 padding、文字宽度或卡片高度。
- 未明确要求时不复制第三方字体或来源项目字体。

中文界面同时提供英文标题时：

- 英文作为右侧 `.data-card__meta.data-card__meta--en`，不创建第二标题行。
- 只使用业务或来源数据提供的英文，不自行猜译。
- 默认 `14px / 20px`、字重 `400`、大写和 `.06em` 字距。
- 产品名等需要保留大小写时添加 `.data-card__meta--preserve-case`。
- 空间不足时先缩小或截断重复英文 Meta，再处理主标题。

## 标记结构

面板帽标题（Panel Cap）：

```html
<header class="data-card__header data-card__header--cap">
  <h2 class="data-card__title">标题</h2>
</header>
```

开放 Rail 与内部小节：

```html
<section class="data-card data-card--rail-panel">
  <header class="data-card__header data-card__header--rail">
    <h3 class="data-card__title">标题</h3>
  </header>
  <div class="data-section-title data-section-title--marker">小节标题</div>
</section>
```

语义 Orbit：

```html
<span class="data-icon-orbit" aria-hidden="true">
  <svg class="data-icon-orbit__icon"><use href="#icon-status" /></svg>
</span>
```

装饰资源不包含文字。语义标题必须保留在 HTML 中，确保截断、本地化和辅助技术正常工作。没有标题、Meta 或操作时不渲染空 Header。

## 资源与设计变量（Token）

```text
assets/img/decorations/*
  -> src/assets/images/decorations/
assets/template/data-visualization/data-tokens.less
  -> src/assets/styles/data-tokens.less
assets/template/data-visualization/data-display.less
  -> src/assets/styles/data-display.less
```

装饰资源包括：

```text
card-title-cap.svg
card-title-rail.png
section-title-marker.png
floating-title-bracket.svg
icon-orbit.svg
```

`data-display.less` 的 `../images/decorations/` 相对路径依赖上述目标目录。Token 只定义字号、行高、字重、间距、图标几何和 Meta 限制，不定义 font-family。

## 克制与布局安全

- 不在同一卡片叠加标题背景、发光边框、双角标、带端点分隔线和动画 Orbit。
- 不添加数据中不存在的装饰性英文、序号或状态词。
- 横向装饰线位于标题行盒的上方或下方，不穿过字形。
- Rail 只使用共享 `card-title-rail.png`，不增加重复底色、背景或下划线。
- Rail 标题使用 `14px` Header 内边距，不再嵌套无意义图标占位或内容容器。
- 雅安或沙盘来源页面默认使用固定 Rail 资源，不在运行时改色；新配色需要新的已批准图片。
- AI Park Marker 只用于内部小节，不提升为 Panel 标题，也不与 Rail、Cap 组合。
- 标题高度必须计入 `big-screen-ui.md` 的侧栏预算。
- 在 `420px`、`480px`、`520px` 侧栏宽度下，先保留标题和 Meta，再缩短装饰线。

## 可访问性与动效

- 纯装饰资源和 Orbit 包装设置 `aria-hidden="true"`。
- 颜色状态同时提供文字或图标。
- 必要操作保留在正常 DOM 流中，并有可见键盘焦点。
- 装饰层设置合理的 pointer-events，不覆盖点击目标。
- `prefers-reduced-motion` 下 Orbit 保持静止。
- 三维场景亮度变化时仍保持标题对比度。
