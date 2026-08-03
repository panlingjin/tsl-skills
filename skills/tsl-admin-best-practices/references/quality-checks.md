# 质量检查

## 工程检查

以下规则来自 `frontend-engineering-standards`，本技能不得覆盖：

- 源码使用纯 JavaScript，Vue SFC 使用 `<script setup>`，不存在 `.ts`、`.tsx` 或 TypeScript 类型语法。
- 组件目录和文件使用 PascalCase。
- 组件目录没有只做二次导出的 `index.js` 或 `index.ts`。
- 使用 `stores/`、`layouts/`、`src/assets/styles/`、`src/icons/` 和 `vite.config.js`。
- 只使用 Yarn；不存在 npm/pnpm 命令或额外锁文件。
- 路由视图按需加载，Pinia setup store 返回全部需要使用的响应式状态。
- 组件契约有运行时校验，复杂公共参数有 JSDoc，复杂组件已拆分。

将组件集成到目标项目后执行：

```bash
yarn lint
yarn test
yarn build
```

不得因“模板只是示例”而跳过适用的 lint、测试和构建检查。

## Origami Vue 检查

- Table 使用 `data-source`。
- 列由 `<OriTable.column>` 渲染，没有向 Origami Table 传 `columns`。
- 分页通过 `pagination.onChange`。
- Table size 为 `medium | small | mini`。
- Button 的主按钮使用布尔 `primary`，不使用 `type="primary"`。
- Menu、Breadcrumb、Dropdown 和 Checkbox 的子组件访问方式符合 Origami 文档。

## 视觉检查

- 页头 `48px`，侧栏 `224px / 56px`，面包屑栏 `48px`。
- 折叠按钮位于面包屑文字之前，而不是 Logo 之前。
- 页面背景 `#F2F3F5`，白色内容表面为 `20px` 内边距和 `4px` 圆角。
- 基础文字 `14px / 22px`，主色为 `#5E66F2`。
- 表格搜索区允许换行，操作图标为 `32px`。
- 空值、长文本、列设置、刷新状态和分页边界均有正确表现。

## 安全检查

- 不包含源项目 `.env`、内部主机、私有代理、密钥或令牌。
- 示例数据不包含真实用户、设备、告警、工单或监控记录。
- localStorage key 不包含用户身份或敏感业务数据。

## 技能包验证

修改技能本身后，使用 `skill-creator` 提供的 `quick_validate.py` 校验 `skills/tsl-admin-best-practices`，并检查所有引用路径都存在。
