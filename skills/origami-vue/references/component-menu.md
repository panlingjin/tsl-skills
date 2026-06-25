---
title: 导航菜单 Menu
impact: MEDIUM
impactDescription: 使用错误 API 会导致组件功能异常
type: component
tags: [origami-vue, navigation]
---

# 导航菜单 Menu

**Impact: MEDIUM** - 使用错误 API 会导致组件功能异常，如 index 属性缺失、default-active 配置错误、mode 与 collapse 搭配不当等会导致菜单无法正常高亮或展开。

## 何时使用

- 一般分为顶部导航和侧边导航，顶部导航提供全局性的类目和功能
- 侧边导航提供多级结构来收纳和排列网站架构
- 需要水平或垂直的导航菜单
- 需要折叠、分组、图标等高级导航功能

## API 参考

### Menu Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| mode | 菜单展示模式 | `'horizontal' \| 'vertical'` | `'vertical'` |
| ellipsis | 是否省略多余的子项（仅在横向模式生效） | `boolean` | `true` |
| collapse | 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用） | `boolean` | `false` |
| background-color | 菜单的背景色（仅支持 hex 格式） | `string` | `'#ffffff'` |
| text-color | 菜单的文字颜色（仅支持 hex 格式） | `string` | `'#303133'` |
| active-text-color | 当前激活菜单的文字颜色（仅支持 hex 格式） | `string` | `'#409EFF'` |
| default-active | 默认激活菜单的 index | `string` | - |
| default-openeds | 默认打开的 sub-menu 的 index 的数组 | `Array` | - |
| unique-opened | 是否只保持一个子菜单的展开 | `boolean` | - |
| menu-trigger | 子菜单打开的触发方式，只在 mode 为 horizontal 时有效 | `'hover' \| 'click'` | `'hover'` |
| collapse-transition | 是否开启折叠动画 | `boolean` | `true` |
| hoverSpread | vertical 时 menu 是否 hover 展开 | `boolean` | `true` |

### Menu Methods

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| open | 展开指定的 sub-menu | `index: 需要打开的 sub-menu 的 index` |
| close | 收起指定的 sub-menu | `index: 需要收起的 sub-menu 的 index` |

### Menu Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| select | 菜单激活回调 | `index: 选中菜单项的 index, indexPath: 选中菜单项的 index path, item: 选中菜单项` |
| open | sub-menu 展开的回调 | `index: 打开的 sub-menu 的 index, indexPath: 打开的 sub-menu 的 index path` |
| close | sub-menu 收起的回调 | `index: 收起的 sub-menu 的 index, indexPath: 收起的 sub-menu 的 index path` |

### SubMenu Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| index | 唯一标志 | `string` | - |
| popper-class | 为 popper 添加类名 | `string` | - |
| show-timeout | 展开 sub-menu 的延时 | `number` | `300` |
| hide-timeout | 收起 sub-menu 的延时 | `number` | `300` |
| disabled | 是否禁用 | `boolean` | `false` |
| popper-offset | 弹出窗口偏移 | `number` | `8` |

### MenuItem Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| index | 唯一标志 | `string \| null` | `null` |
| disabled | 是否禁用 | `boolean` | `false` |

### MenuItem Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 菜单点击时的回调函数 | `el-menu-item 实例` |

### MenuItemGroup Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 组标题 | `string` | - |

### MenuItemGroup Slots

| 插槽名 | 说明 | 子标签 |
| --- | --- | --- |
| — (默认) | 默认插槽内容 | MenuItem |

## 子组件访问

Menu 的子组件通过小驼峰属性访问：
- `OriMenu.menuItem` — 菜单项
- `OriMenu.subMenu` — 子菜单
- `OriMenu.menuItemGroup` — 菜单项分组

注意：源码中不存在 MenuDivider 子组件。

```vue
<OriMenu default-active="1">
  <OriMenu.menuItem index="1">首页</OriMenu.menuItem>
  <OriMenu.subMenu index="sub1" title="设置">
    <OriMenu.menuItem index="2">个人设置</OriMenu.menuItem>
  </OriMenu.subMenu>
</OriMenu>
```

## 使用示例

### 正确用法

```vue
<!-- 水平菜单 -->
<OriMenu mode="horizontal" default-active="1">
  <OriMenu.menuItem index="1">首页</OriMenu.menuItem>
  <OriMenu.menuItem index="2">关于</OriMenu.menuItem>
  <OriMenu.menuItem index="3">联系</OriMenu.menuItem>
</OriMenu>

<!-- 垂直菜单 -->
<OriMenu default-active="1" mode="vertical">
  <OriMenu.menuItem index="1">首页</OriMenu.menuItem>
  <OriMenu.subMenu index="2">
    <template #title>设置</template>
    <OriMenu.menuItem index="2-1">个人设置</OriMenu.menuItem>
    <OriMenu.menuItem index="2-2">系统设置</OriMenu.menuItem>
  </OriMenu.subMenu>
</OriMenu>

<!-- 折叠菜单 -->
<OriMenu default-active="1" :collapse="isCollapsed">
  <OriMenu.menuItem index="1">
    <template #title>首页</template>
  </OriMenu.menuItem>
  <OriMenu.subMenu index="2">
    <template #title>设置</template>
    <OriMenu.menuItem index="2-1">个人设置</OriMenu.menuItem>
  </OriMenu.subMenu>
</OriMenu>

<!-- 手风琴模式（只保持一个子菜单展开） -->
<OriMenu default-active="1" unique-opened>
  <OriMenu.subMenu index="1">
    <template #title>分组一</template>
    <OriMenu.menuItem index="1-1">选项一</OriMenu.menuItem>
  </OriMenu.subMenu>
  <OriMenu.subMenu index="2">
    <template #title>分组二</template>
    <OriMenu.menuItem index="2-1">选项二</OriMenu.menuItem>
  </OriMenu.subMenu>
</OriMenu>

<!-- 自定义主题色 -->
<OriMenu
  default-active="1"
  background-color="#1d2129"
  text-color="#f7f8fa"
  active-text-color="#5e66f2"
>
  <OriMenu.menuItem index="1">首页</OriMenu.menuItem>
  <OriMenu.menuItem index="2">关于</OriMenu.menuItem>
</OriMenu>

<!-- 分组菜单 -->
<OriMenu default-active="1">
  <OriMenu.menuItemGroup title="基础功能">
    <OriMenu.menuItem index="1">首页</OriMenu.menuItem>
    <OriMenu.menuItem index="2">仪表盘</OriMenu.menuItem>
  </OriMenu.menuItemGroup>
  <OriMenu.menuItemGroup title="系统管理">
    <OriMenu.menuItem index="3">用户管理</OriMenu.menuItem>
  </OriMenu.menuItemGroup>
</OriMenu>

<!-- 监听选中事件 -->
<OriMenu default-active="1" @select="handleSelect">
  <OriMenu.menuItem index="1">首页</OriMenu.menuItem>
  <OriMenu.menuItem index="2">关于</OriMenu.menuItem>
</OriMenu>
<script setup>
const handleSelect = (index, indexPath, item) => {
  console.log('选中:', index)
}
</script>
```

### 常见错误

```vue
<!-- ❌ 错误：使用 selectedKeys 而非 default-active -->
<OriMenu :selectedKeys="['1']">
  <OriMenu.menuItem index="1">首页</OriMenu.menuItem>
</OriMenu>

<!-- ✅ 正确：使用 default-active -->
<OriMenu default-active="1">
  <OriMenu.menuItem index="1">首页</OriMenu.menuItem>
</OriMenu>

<!-- ❌ 错误：MenuItem 使用 key 而非 index -->
<OriMenu default-active="1">
  <OriMenu.menuItem key="1">首页</OriMenu.menuItem>
</OriMenu>

<!-- ✅ 正确：MenuItem 使用 index -->
<OriMenu default-active="1">
  <OriMenu.menuItem index="1">首页</OriMenu.menuItem>
</OriMenu>

<!-- ❌ 错误：SubMenu 缺少 index -->
<OriMenu>
  <OriMenu.subMenu>
    <!-- 缺少 index 属性，会导致菜单无法正确展开/收起 -->
    <template #title>设置</template>
    <OriMenu.menuItem index="1">选项</OriMenu.menuItem>
  </OriMenu.subMenu>
</OriMenu>

<!-- ✅ 正确：SubMenu 必须设置 index -->
<OriMenu>
  <OriMenu.subMenu index="settings">
    <template #title>设置</template>
    <OriMenu.menuItem index="1">选项</OriMenu.menuItem>
  </OriMenu.subMenu>
</OriMenu>

<!-- ❌ 错误：collapse 在 horizontal 模式下使用 -->
<OriMenu mode="horizontal" :collapse="true">
  <!-- collapse 仅在 vertical 模式下可用 -->
</OriMenu>

<!-- ✅ 正确：collapse 仅在 vertical 模式下使用 -->
<OriMenu mode="vertical" :collapse="true">
</OriMenu>

<!-- ❌ 错误：background-color 使用非 hex 格式 -->
<OriMenu background-color="rgb(255,255,255)">
  <!-- 仅支持 hex 格式 -->
</OriMenu>

<!-- ✅ 正确：使用 hex 格式 -->
<OriMenu background-color="#ffffff">
</OriMenu>
```

## 与其他组件库的差异

| 差异点 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| 默认激活项 | `default-active` | `selectedKeys` | `default-active` |
| 菜单项标识 | `index` | `key` | `index` |
| 手风琴模式 | `unique-opened` | `openKeys` 手动控制 | `unique-opened` |
| 主题色 | `background-color`/`text-color`/`active-text-color` | `theme` (light/dark) | `background-color`/`text-color`/`active-text-color` |
| 折叠 | `collapse` | `inlineCollapsed` | `collapse` |
| hover 展开 | `hoverSpread` | 无 | 无 |
| 省略子项 | `ellipsis` | `overflowedIndicator` | `ellipsis` |
| 子菜单触发 | `menu-trigger` (hover/click) | 无 | 无 |
| 子菜单组件 | `SubMenu` | `SubMenu` | `SubMenu` |
| 菜单分组 | `MenuItemGroup` | `ItemGroup` | `MenuItemGroup` |
| 选中事件 | `select(index, indexPath, item)` | `select({ key, keyPath, item })` | `select(index, indexPath, item, route)` |
