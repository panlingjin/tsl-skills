---
title: 下拉菜单 Dropdown
impact: MEDIUM
impactDescription: 使用错误 API 会导致组件功能异常
type: component
tags: [origami-vue, navigation]
---

# 下拉菜单 Dropdown

**Impact: MEDIUM** - 使用错误 API 会导致组件功能异常，如插槽名误用、position 属性值错误、受控模式与触发方式冲突等会导致下拉菜单无法正常展示或交互。

## 何时使用

- 当页面上的操作命令过多时，用此组件可以收纳操作元素
- 点击或移入触点，会出现一个下拉菜单，可在列表中进行选择并执行相应的命令
- 用于收罗一组命令操作
- Select 用于选择，而 Dropdown 是命令集合

## API 参考

### 子组件访问

Dropdown 的子组件通过 `OriDropdown` 的点号属性访问，无需单独导入：

| 子组件 | 访问方式 | 全局注册名 |
| --- | --- | --- |
| Menu | `OriDropdown.Menu` | `ori-dropdown-menu` |
| MenuItem | `OriDropdown.MenuItem` | `ori-dropdown-item` |
| SubMenu | `OriDropdown.SubMenu` | `ori-dropdown-submenu` |
| MenuGroup | `OriDropdown.MenuGroup` | `ori-dropdown-menu-group` |

> **注意**：在 SFC 模板中使用全局注册名（如 `<OriDropdown.Menu>`）时保持 kebab-case 不变；在 `<script setup>` 中使用点号访问方式（如 `OriDropdown.Menu`）。

### Dropdown Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible(v-model) | 受控模式，通过 visible 控制下拉菜单的显示隐藏 | `boolean` | - |
| trigger | 菜单展开触发方式 | `'hover' \| 'click' \| 'contextmenu'` | `'hover'` |
| position | 菜单展开位置 | `'topLeft' \| 'topCenter' \| 'topRight' \| 'bottomLeft' \| 'bottomCenter' \| 'bottomRight'` | - |
| customClass | 自定义下拉列表的类名 | `string` | - |

### Dropdown Slots

| 名称 | 说明 |
| --- | --- |
| — (默认) | 触发菜单展开的容器 |
| overlay | 菜单内容 |

### Dropdown Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| select | 选中菜单项 | `(name: string): void` |

### 子组件

| 组件名 | 说明 | 访问方式 |
| --- | --- | --- |
| DropdownMenu | 下拉菜单容器，包裹菜单项 | `OriDropdown.Menu` |
| DropdownItem | 菜单项 | `OriDropdown.MenuItem` |
| DropdownSubmenu | 次级菜单 | `OriDropdown.SubMenu` |
| DropdownMenuGroup | 菜单分组 | `OriDropdown.MenuGroup` |

> **注意**：Dropdown 的子组件通过 `OriDropdown` 的点号属性访问（如 `OriDropdown.Menu`、`OriDropdown.MenuItem`），而非独立导入。

### DropdownItem Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 菜单项标识 | `string` | - |
| disabled | 菜单项是否禁用 | `boolean` | `false` |

### DropdownItem Slots

| 名称 | 说明 |
| --- | --- |
| — (默认) | 菜单项内容 |
| icon | 图标 |

### DropdownSubmenu Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 次级菜单内容 | `string` | - |

### DropdownMenuGroup Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 分组名 | `string` | - |

## 使用示例

### 正确用法

```vue
<!-- 基本使用 -->
<OriDropdown>
  <ori-button>下拉菜单</ori-button>
  <template #overlay>
    <OriDropdown.Menu>
      <OriDropdown.MenuItem name="edit">编辑</OriDropdown.MenuItem>
      <OriDropdown.MenuItem name="delete">删除</OriDropdown.MenuItem>
    </OriDropdown.Menu>
  </template>
</OriDropdown>

<!-- 点击触发 -->
<OriDropdown trigger="click">
  <ori-button>点击触发</ori-button>
  <template #overlay>
    <OriDropdown.Menu>
      <OriDropdown.MenuItem name="action1">操作一</OriDropdown.MenuItem>
      <OriDropdown.MenuItem name="action2">操作二</OriDropdown.MenuItem>
    </OriDropdown.Menu>
  </template>
</OriDropdown>

<!-- 右键触发 -->
<OriDropdown trigger="contextmenu">
  <div>右键点击此区域</div>
  <template #overlay>
    <OriDropdown.Menu>
      <OriDropdown.MenuItem name="copy">复制</OriDropdown.MenuItem>
      <OriDropdown.MenuItem name="paste">粘贴</OriDropdown.MenuItem>
    </OriDropdown.Menu>
  </template>
</OriDropdown>

<!-- 多级菜单 -->
<OriDropdown>
  <ori-button>多级菜单</ori-button>
  <template #overlay>
    <OriDropdown.Menu>
      <OriDropdown.MenuItem name="edit">编辑</OriDropdown.MenuItem>
      <OriDropdown.SubMenu title="更多操作">
        <OriDropdown.MenuItem name="copy">复制</OriDropdown.MenuItem>
        <OriDropdown.MenuItem name="move">移动</OriDropdown.MenuItem>
      </OriDropdown.SubMenu>
    </OriDropdown.Menu>
  </template>
</OriDropdown>

<!-- 分组菜单 -->
<OriDropdown>
  <ori-button>分组菜单</ori-button>
  <template #overlay>
    <OriDropdown.Menu>
      <OriDropdown.MenuGroup label="编辑操作">
        <OriDropdown.MenuItem name="edit">编辑</OriDropdown.MenuItem>
        <OriDropdown.MenuItem name="delete">删除</OriDropdown.MenuItem>
      </OriDropdown.MenuGroup>
      <OriDropdown.MenuGroup label="其他操作">
        <OriDropdown.MenuItem name="copy">复制</OriDropdown.MenuItem>
      </OriDropdown.MenuGroup>
    </OriDropdown.Menu>
  </template>
</OriDropdown>

<!-- 带图标的菜单项 -->
<OriDropdown>
  <ori-button>带图标</ori-button>
  <template #overlay>
    <OriDropdown.Menu>
      <OriDropdown.MenuItem name="edit">
        <template #icon><EditIcon /></template>
        编辑
      </OriDropdown.MenuItem>
    </OriDropdown.Menu>
  </template>
</OriDropdown>

<!-- 指定弹出位置 -->
<OriDropdown position="topLeft">
  <ori-button>向上弹出</ori-button>
  <template #overlay>
    <OriDropdown.Menu>
      <OriDropdown.MenuItem name="action">操作</OriDropdown.MenuItem>
    </OriDropdown.Menu>
  </template>
</OriDropdown>

<!-- 受控模式 -->
<OriDropdown v-model:visible="dropdownVisible">
  <ori-button>受控模式</ori-button>
  <template #overlay>
    <OriDropdown.Menu>
      <OriDropdown.MenuItem name="action" @click="dropdownVisible = false">操作</OriDropdown.MenuItem>
    </OriDropdown.Menu>
  </template>
</OriDropdown>

<!-- 监听选中事件 -->
<OriDropdown @select="handleSelect">
  <ori-button>选择操作</ori-button>
  <template #overlay>
    <OriDropdown.Menu>
      <OriDropdown.MenuItem name="edit">编辑</OriDropdown.MenuItem>
      <OriDropdown.MenuItem name="delete">删除</OriDropdown.MenuItem>
    </OriDropdown.Menu>
  </template>
</OriDropdown>
<script setup>
const handleSelect = (name) => {
  console.log('选中:', name)
}
</script>
```

### 常见错误

```vue
<!-- ❌ 错误：使用 #dropdownMenu 插槽名 -->
<OriDropdown>
  <ori-button>菜单</ori-button>
  <template #dropdownMenu>
    <OriDropdown.MenuItem name="edit">编辑</OriDropdown.MenuItem>
  </template>
</OriDropdown>

<!-- ✅ 正确：使用 #overlay 插槽名 -->
<OriDropdown>
  <ori-button>菜单</ori-button>
  <template #overlay>
    <OriDropdown.Menu>
      <OriDropdown.MenuItem name="edit">编辑</OriDropdown.MenuItem>
    </OriDropdown.Menu>
  </template>
</OriDropdown>

<!-- ❌ 错误：使用 placement 属性指定弹出位置 -->
<OriDropdown placement="bottomLeft">
  <!-- placement 属性不存在 -->
</OriDropdown>

<!-- ✅ 正确：使用 position 属性 -->
<OriDropdown position="bottomLeft">
</OriDropdown>

<!-- ❌ 错误：受控模式下 trigger 设为 click 同时用 click 事件控制 visible -->
<OriDropdown v-model:visible="visible" trigger="click">
  <!-- 会引发状态混乱 -->
</OriDropdown>

<!-- ✅ 正确：受控模式下避免 trigger 为 click，或使用 hover/contextmenu -->
<OriDropdown v-model:visible="visible" trigger="hover">
</OriDropdown>

<!-- ❌ 错误：DropdownItem 不传 name -->
<OriDropdown @select="handleSelect">
  <template #overlay>
    <OriDropdown.Menu>
      <OriDropdown.MenuItem>编辑</OriDropdown.MenuItem>
      <!-- select 事件无法获取标识 -->
    </OriDropdown.Menu>
  </template>
</OriDropdown>

<!-- ✅ 正确：DropdownItem 必须传 name -->
<OriDropdown @select="handleSelect">
  <template #overlay>
    <OriDropdown.Menu>
      <OriDropdown.MenuItem name="edit">编辑</OriDropdown.MenuItem>
    </OriDropdown.Menu>
  </template>
</OriDropdown>
```

## 与其他组件库的差异

| 差异点 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| 菜单内容插槽 | `#overlay` | `#overlay` | `#dropdown` |
| 弹出位置属性 | `position` | `placement` | `placement` |
| 弹出位置值 | topLeft/topCenter/topRight/bottomLeft/bottomCenter/bottomRight | bottomLeft/bottomCenter/bottomRight/topLeft/topCenter/topRight 等 | top/top-start/bottom/bottom-start 等 |
| 触发方式 | `trigger`: hover/click/contextmenu | `trigger`: hover/click/contextMenu | `trigger`: hover/click |
| 菜单项组件 | `Dropdown.MenuItem` | `Menu.Item` | `DropdownItem` |
| 子菜单组件 | `Dropdown.SubMenu` | `SubMenu` | 无原生支持 |
| 分组组件 | `Dropdown.MenuGroup` | `Menu.ItemGroup` | 无原生支持 |
| 选中事件 | `select(name)` | `click` 事件 | `command` 事件 |
| 菜单项标识 | `name` | `key` | `command` |
| 受控模式 | `v-model:visible` | `open` / `v-model:open` | 无原生受控 |
