# 大屏验收

通用 lint、格式化、类型边界、安全、错误处理和测试行为以 `$frontend-engineering-standards` 为准。本文件只补充大屏验收项。

## 自动校验

在仓库根目录执行：

```bash
node skills/tsl-big-screen-best-practices/scripts/validate-skill.mjs
node skills/tsl-big-screen-best-practices/scripts/test-chart-options.mjs
node skills/tsl-big-screen-best-practices/scripts/test-asset-contract.mjs
node skills/tsl-big-screen-best-practices/scripts/test-integration-contracts.mjs
git diff --check
```

项目级测试使用 Vue CLI/Jest；普通 Vite 项目的 Vitest 默认不适用于本 Skill。PyYAML 可用时再执行 Skill Creator 的 `quick_validate.py`，Node 校验始终是无额外依赖的必选入口。

## 场景烟雾检查

1. 新建 Vue CLI 5/Webpack 大屏：保留 Babel、`vue.config.js`、`VUE_APP_*`、SVG loader、Jest 和 Yarn。
2. 只新增图表或卡片：只加载对应视觉 reference 与通用 Vue 规则，不加载 Router、Pinia、Mock、dt-engine 或项目搭建文档。
3. 维护旧 `hooks/store/assets/style` 项目：新增代码沿用该项目结构，不触发目录迁移。

## 人工视觉与交互检查

- 在 1920×1080、16:10 和 4:3 视口检查等比缩放、居中和留白。
- 检查两侧面板高度预算，不出现页面级或整列滚动。
- Header、场景、Page Switch、Modal 和 LLM 控件处于同一缩放坐标系。
- Modal 层级只采用 `modal-patterns.md` 的值。
- 键盘可到达所有交互入口，焦点清晰，禁用态不可触发。
- `prefers-reduced-motion` 下非必要动效关闭。
- 图表、dt-engine、轮询、WebSocket、MCP 注册和事件监听在卸载后全部释放。
