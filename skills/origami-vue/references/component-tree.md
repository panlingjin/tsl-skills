---
title: 树形控件 Tree
impact: MEDIUM
impactDescription: 使用错误 API 会导致组件功能异常
type: component
tags: [origami-vue, data-display]
---

# 树形控件 Tree

**Impact: MEDIUM** - 使用错误 API 会导致组件功能异常，如数据属性名、node-key 缺失、props 配置错误等会导致树无法正确渲染或方法调用失败。

## 何时使用

- 用清晰的层级结构展示信息，可展开或折叠
- 需要展示文件夹、组织架构、分类目录等层级数据
- 需要勾选、拖拽、搜索等交互功能

## API 参考

### Tree Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 展示数据 | `array` | - |
| empty-text | 内容为空的时候展示的文本 | `string` | - |
| node-key | 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 | `string` | - |
| props | 配置选项，详见 Props props | `object` | - |
| render-after-expand | 是否在第一次展开某个树节点后才渲染其子节点 | `boolean` | `true` |
| load | 加载子树数据的方法，仅当 lazy 属性为 true 时生效 | `function(node, resolve)` | - |
| render-content | 树节点的内容区的渲染 Function | `Function(h, { node, data, store })` | - |
| highlight-current | 是否高亮当前选中节点 | `boolean` | `false` |
| default-expand-all | 是否默认展开所有节点 | `boolean` | `false` |
| expand-on-click-node | 是否在点击节点的时候展开或者收缩节点 | `boolean` | `true` |
| auto-expand-parent | 展开子节点的时候是否自动展开父节点 | `boolean` | `true` |
| default-expanded-keys | 默认展开的节点的 key 的数组 | `array` | - |
| show-checkbox | 节点是否可被选择 | `boolean` | `false` |
| check-strictly | 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法 | `boolean` | `false` |
| default-checked-keys | 默认勾选的节点的 key 的数组 | `array` | - |
| current-node-key | 当前选中的节点 | `string \| number` | - |
| filter-node-method | 对树节点进行筛选时执行的方法，返回 false 则隐藏节点 | `Function(value, data, node)` | - |
| accordion | 是否每次只打开一个同级树节点展开 | `boolean` | `false` |
| indent | 相邻级节点间的水平缩进，单位为像素 | `number` | `16` |
| lazy | 是否懒加载子节点，需与 load 方法结合使用 | `boolean` | `false` |
| showFilter | 是否展示搜索框 | `boolean` | `false` |
| draggable | 是否开启拖拽节点功能 | `boolean` | `false` |
| allow-drag | 判断节点能否被拖拽 | `Function(node)` | - |
| allow-drop | 拖拽时判定目标节点能否成为拖动目标位置 | `Function(draggingNode, dropNode, type)` | - |

### Props 配置项

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 指定节点标签为节点对象的某个属性值 | `string \| function(data, node)` | - |
| children | 指定子树为节点对象的某个属性值 | `string` | - |
| disabled | 指定节点选择框是否禁用为节点对象的某个属性值 | `string \| function(data, node)` | - |
| isLeaf | 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效 | `string \| function(data, node)` | - |
| class | 自定义节点类名 | `string \| function(data, node)` | - |

### Tree Methods

| 方法 | 描述 | 参数 |
| --- | --- | --- |
| filter | 过滤所有树节点，过滤后的节点将被隐藏 | 接收一个参数并指定为 filter-node-method 属性的第一个参数 |
| updateKeyChildren | 为节点设置新数据，只有当设置 node-key 属性的时候才可用 | `(key, data)` |
| getCheckedNodes | 返回当前选中节点的数组 | `(leafOnly, includeHalfChecked)` |
| setCheckedNodes | 设置目前勾选的节点，使用此方法必须提前设置 node-key 属性 | 要选中的节点构成的数组 |
| getCheckedKeys | 返回当前选中节点 key 的数组 | `(leafOnly)` |
| setCheckedKeys | 设置目前选中的节点 | `(keys, leafOnly)` |
| getCurrentKey | 返回当前被选中节点的 key | - |
| getCurrentNode | 返回当前被选中节点的数据 | - |
| setCurrentKey | 通过 key 设置某个节点的当前选中状态 | `(key, shouldAutoExpandParent=true)` |
| setCurrentNode | 设置节点为选中状态 | `(node, shouldAutoExpandParent=true)` |
| getNode | 根据 data 或者 key 拿到 Tree 组件中的 node | `(data)` |
| remove | 删除 Tree 中的一个节点 | `(data)` |
| append | 为 Tree 中的一个节点追加一个子节点 | `(data, parentNode)` |
| insertBefore | 在 Tree 中给定节点前插入一个节点 | `(data, refNode)` |
| insertAfter | 在 Tree 中给定节点后插入一个节点 | `(data, refNode)` |

### Tree Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| node-click | 当节点被点击的时候触发 | `(data, node, event)` |
| check-change | 当复选框被点击的时候触发 | `(data, checked, indeterminate)` |
| check | 点击节点复选框之后触发 | `(data, { checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys })` |
| current-change | 当前选中节点变化时触发 | `(data, node)` |
| node-expand | 节点被展开时触发 | `(data, node, component)` |
| node-collapse | 节点被关闭时触发 | `(data, node, component)` |
| node-drag-start | 节点开始拖拽时触发 | `(node, event)` |
| node-drag-enter | 拖拽进入其他节点时触发 | `(draggingNode, enterNode, event)` |
| node-drag-leave | 拖拽离开某个节点时触发 | `(draggingNode, leaveNode, event)` |
| node-drag-over | 在拖拽节点时触发 | `(draggingNode, overNode, event)` |
| node-drag-end | 拖拽结束时触发 | `(draggingNode, endNode, position, event)` |
| node-drop | 拖拽成功完成时触发 | `(draggingNode, dropNode, position, event)` |

### Tree Slots

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| — (默认) | 自定义树节点的内容 | `{ node, data }` |

## 使用示例

### 正确用法

```vue
<!-- 基本使用 -->
<ori-tree :data="treeData" :props="defaultProps" />

<!-- 可选择的树 -->
<ori-tree :data="treeData" :props="defaultProps" show-checkbox node-key="id" />

<!-- 默认展开所有节点 -->
<ori-tree :data="treeData" :props="defaultProps" default-expand-all />

<!-- 可搜索的树 -->
<ori-tree :data="treeData" :props="defaultProps" showFilter :filter-node-method="filterNode" />

<!-- 可拖拽的树 -->
<ori-tree :data="treeData" :props="defaultProps" draggable :allow-drop="allowDrop" />

<!-- 自定义节点内容 -->
<ori-tree :data="treeData" :props="defaultProps">
  <template #default="{ node, data }">
    <span class="text-xs text-tsl-gray-9">{{ data.label }}</span>
  </template>
</ori-tree>

<!-- 懒加载 -->
<ori-tree :props="defaultProps" :load="loadNode" lazy />

<!-- 获取选中节点 -->
<script setup>
import { ref } from 'vue'

const treeRef = ref()
const getChecked = () => {
  const nodes = treeRef.value.getCheckedNodes()
  const keys = treeRef.value.getCheckedKeys()
}
</script>
```

### 常见错误

```vue
<!-- ❌ 错误：使用 :treeData 而非 :data -->
<ori-tree :treeData="treeData" />

<!-- ✅ 正确：使用 :data -->
<ori-tree :data="treeData" />

<!-- ❌ 错误：使用方法时未设置 node-key -->
<ori-tree :data="treeData" show-checkbox ref="treeRef" />
<script setup>
// 调用 setCheckedKeys 等方法需要 node-key
treeRef.value.setCheckedKeys([1, 2])
</script>

<!-- ✅ 正确：使用方法前设置 node-key -->
<ori-tree :data="treeData" show-checkbox node-key="id" ref="treeRef" />

<!-- ❌ 错误：props 配置中使用错误字段名 -->
<ori-tree :data="treeData" :props="{ title: 'name', child: 'children' }" />

<!-- ✅ 正确：props 配置使用正确的字段名 -->
<ori-tree :data="treeData" :props="{ label: 'name', children: 'children' }" />

<!-- ❌ 错误：手风琴模式使用 accordion 属性名错误 -->
<ori-tree :data="treeData" accordion />

<!-- ✅ 正确：accordion 是正确的属性名 -->
<ori-tree :data="treeData" :props="defaultProps" accordion />
```

## 与其他组件库的差异

| 差异点 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| 数据属性 | `:data` | `:treeData` | `:data` |
| 唯一标识 | `node-key` | `fieldNames.key` | `node-key` |
| 字段映射 | `props` 配置对象 | `fieldNames` | `props` 配置对象 |
| 显示复选框 | `show-checkbox` | `checkable` | `show-checkbox` |
| 默认展开全部 | `default-expand-all` | `defaultExpandAll` | `default-expand-all` |
| 拖拽 | `draggable` | 无原生支持 | `draggable` |
| 搜索框 | `showFilter` | `searchValue` + `filterTreeNode` | 无原生搜索框 |
| 方法调用 | `filter`/`getCheckedNodes`/`setCheckedKeys` 等 | 无丰富方法 | 类似方法集 |
| 节点插槽 | 默认插槽 `{ node, data }` | `title` 插槽 | 默认插槽 `{ node, data }` |
