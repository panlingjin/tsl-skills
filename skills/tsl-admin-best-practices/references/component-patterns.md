# 组件范式

## 直接导入

组件目录不放置 `index.js` 或 `index.ts`。调用方直接指向真实文件：

```js
import DetailBox from '@/components/common/DetailBox/DetailBox.vue'
```

这样可以避免没有实际封装价值的二次导出，也能让依赖关系保持明确。

## BaseBox

- 常规列表页和配置页使用 `BaseBox`。
- 外层占满高度并负责滚动，内层使用 `20px` 内边距、白色背景和 `4px` 圆角。
- 需要为右侧滚动条预留空间时使用 `hasRightPadding`。

## AdminTable

TSL 表格封装必须基于 Origami Vue `Table`，并遵守其真实 API：

- 数据使用 `data-source`。
- 表格尺寸只使用 `medium | small | mini`，后台默认 `mini`。
- 分页变化通过 `pagination.onChange`，不监听 Table `change`。
- 列只能通过 `<OriTable.column>` 渲染，不能把列配置直接传给 Origami Table 的 `columns` prop。
- 序号列映射为 `type="seq"`，选择列映射为 `type="checkbox"`。
- 仅传递 Origami 文档支持的 `checkbox-config`、`row-config`、`expand-config` 和 `tree-config`。

封装内部接收 `columns` 配置，再逐项生成 `<OriTable.column>`：

```js
const columns = [
  { type: 'checkbox' },
  { type: 'index', title: '序号', width: 72 },
  { title: '名称', dataIndex: 'name', minWidth: 160 },
  { title: '状态', dataIndex: 'status', slot: 'status', minWidth: 120 },
  { title: '创建时间', dataIndex: 'createdAt', type: 'time' },
  { title: '操作', dataIndex: 'operate', slot: 'operate', width: 160, fixed: 'right' },
]
```

职责拆分：

- `AdminTable.vue`：表格渲染、分页、选择事件和刷新。
- `TableColumnSettings.vue`：列显示与固定交互。
- `useTableColumns.js`：列归一化、计算状态和本地缓存。

行为约定：

- 搜索区使用 `tableSearch` 插槽，操作区使用 `tableOperate` 插槽。
- 操作图标按钮为 `32px`，边框 `#e5e6eb`，圆角 `2px`。
- `tableKey` 存在时持久化列显示与左侧固定状态。
- 空值显示 `-`，时间列默认最小宽度 `170px`，长文本使用 tooltip。
- 页码最小为 `1`；删除后当前页为空且页码大于 `1` 时请求上一页。
- 公开 `clearSelection()` 与 `resetColumns()`，避免父组件访问内部实例。
- 发出 `refresh` 和 `checkChange(records, checked)`。

## DetailBox

- 顶部白色页头包含标题、可选返回图标和右侧操作区。
- 页头内边距 `16px 20px 0`；正文内边距 `16px 20px`。
- 底部操作栏高 `64px`，固定在详情容器底部并带顶部阴影。
- 使用 `transparentHeader` 适配已有视觉框架的嵌入页面。
- `backPath` 使用运行时类型校验，允许字符串或 Vue Router 接受的路由位置对象。

## 组件契约

- 使用运行时 props 声明输入类型、必填项和默认值。
- 使用数组或对象形式的 `defineEmits`，事件名表达业务结果。
- 复杂公共参数、返回值或回调使用 JSDoc 说明，不引入 TypeScript 语法。
- 不修改 props；父组件持有数据，子组件通过事件请求变更。
- 组件超过约 200 行或同时负责状态、渲染和弹层时评估拆分。
- Origami Vue 子组件按文档提供的点号 API 使用，例如 `OriMenu.menuItem` 和 `OriBreadcrumb.Item`。
