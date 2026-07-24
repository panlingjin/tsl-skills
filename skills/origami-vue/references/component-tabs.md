---
title: 选项卡 Tabs
impact: MEDIUM
impactDescription: 使用错误 API 会导致组件功能异常
type: component
tags: [origami-vue, navigation]
---

# 选项卡 Tabs

**Impact: MEDIUM** - 使用错误 API 会导致组件功能异常，如 TabPane 的 name/label 属性误用、type 值不正确、before-leave 返回值错误等会导致选项卡无法正常切换或显示。

## 何时使用

- 分隔内容上有关联但属于不同类别的数据集合
- 需要在同一区域切换不同内容面板
- 需要卡片风格、边框卡片风格等不同视觉样式

## API 参考

### Tabs Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model-value / v-model | 绑定值，选中选项卡的 name | `string \| number` | - |
| type | 风格类型 | `'card' \| 'border-card'` | - |
| border | 是否带边框 | `boolean` | `false` |
| closable | 标签是否可关闭 | `boolean` | `false` |
| tab-position | 选项卡所在位置 | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` |
| stretch | 标签的宽度是否自撑开 | `boolean` | `false` |
| before-leave | 切换标签之前的钩子函数，若返回 false 或者返回被 reject 的 Promise，则阻止切换 | `Function(activeName, oldActiveName)` | - |

### Tabs Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| tab-click | tab 被选中时触发 | `(pane: TabsPaneContext, ev: Event)` |
| tab-change | activeName 改变时触发 | `(name: TabPanelName)` |
| tab-remove | 移除 tab 被点击时触发 | `(name: TabPanelName)` |
| tab-add | 添加 tab 被点击时触发 | - |
| edit | 添加或删除 tab 被点击时触发 | `(paneName: TabPanelName \| undefined, action: 'remove' \| 'add')` |

### TabPane Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 选项卡标题 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| name | 与选项卡绑定值 value 对应的标识符，表示选项卡别名 | `string \| number` | - |
| closable | 标签是否可关闭 | `boolean` | `false` |
| lazy | 标签是否延迟渲染 | `boolean` | `false` |

### TabPane Slots

| 插槽名 | 说明 |
| --- | --- |
| — (默认) | Tab-pane 的内容 |
| label | Tab-pane 的标题内容 |

## 子组件访问

Tabs 的子组件通过小驼峰属性访问：
- `OriTabs.tabPane` — 选项卡面板

```vue
<OriTabs v-model="activeTab">
  <OriTabs.tabPane label="用户管理" name="user">内容</OriTabs.tabPane>
</OriTabs>
```

## 使用示例

### 正确用法

```vue
<!-- 基本使用 -->
<OriTabs v-model="activeTab">
  <OriTabs.tabPane> label="用户管理" name="user">用户管理内容</OriTabs.tabPane>
  <OriTabs.tabPane> label="角色管理" name="role">角色管理内容</OriTabs.tabPane>
  <OriTabs.tabPane> label="权限设置" name="permission">权限设置内容</OriTabs.tabPane>
</OriTabs>

<!-- 卡片风格 -->
<OriTabs v-model="activeTab" type="card">
  <OriTabs.tabPane> label="用户管理" name="user">用户管理内容</OriTabs.tabPane>
  <OriTabs.tabPane> label="角色管理" name="role">角色管理内容</OriTabs.tabPane>
</OriTabs>

<!-- 边框卡片风格 -->
<OriTabs v-model="activeTab" type="border-card">
  <OriTabs.tabPane> label="用户管理" name="user">用户管理内容</OriTabs.tabPane>
  <OriTabs.tabPane> label="角色管理" name="role">角色管理内容</OriTabs.tabPane>
</OriTabs>

<!-- 带边框 -->
<OriTabs v-model="activeTab" border>
  <OriTabs.tabPane> label="用户管理" name="user">用户管理内容</OriTabs.tabPane>
</OriTabs>

<!-- 标签宽度自撑开 -->
<OriTabs v-model="activeTab" stretch>
  <OriTabs.tabPane> label="用户管理" name="user">用户管理内容</OriTabs.tabPane>
  <OriTabs.tabPane> label="角色管理" name="role">角色管理内容</OriTabs.tabPane>
</OriTabs>

<!-- 标签位置 -->
<OriTabs v-model="activeTab" tab-position="left">
  <OriTabs.tabPane> label="用户管理" name="user">用户管理内容</OriTabs.tabPane>
  <OriTabs.tabPane> label="角色管理" name="role">角色管理内容</OriTabs.tabPane>
</OriTabs>

<!-- 可关闭 + 可添加 -->
<OriTabs v-model="activeTab" closable @tab-remove="handleRemove" @tab-add="handleAdd" @edit="handleEdit">
  <OriTabs.tabPane> v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name">
    {{ tab.content }}
  </OriTabs.tabPane>
</OriTabs>

<!-- 切换前拦截 -->
<OriTabs v-model="activeTab" :before-leave="beforeLeave">
  <OriTabs.tabPane> label="用户管理" name="user">用户管理内容</OriTabs.tabPane>
  <OriTabs.tabPane> label="角色管理" name="role">角色管理内容</OriTabs.tabPane>
</OriTabs>
<script setup>
const beforeLeave = (activeName, oldActiveName) => {
  // 返回 false 或 reject 的 Promise 阻止切换
  if (hasUnsavedChanges.value) {
    return false
  }
  return true
}
</script>

<!-- 自定义标签内容 -->
<OriTabs v-model="activeTab">
  <OriTabs.tabPane> name="user">
    <template #label>
      <span class="flex items-center gap-1">
        <UserIcon class="w-3.5 h-3.5" />
        用户管理
      </span>
    </template>
    用户管理内容
  </OriTabs.tabPane>
</OriTabs>

<!-- 延迟渲染 -->
<OriTabs v-model="activeTab">
  <OriTabs.tabPane> label="用户管理" name="user" lazy>
    <!-- 仅在首次激活时渲染 -->
    <HeavyComponent />
  </OriTabs.tabPane>
</OriTabs>

<!-- 监听事件 -->
<OriTabs v-model="activeTab" @tab-click="handleTabClick" @tab-change="handleTabChange">
  <OriTabs.tabPane> label="用户管理" name="user">内容</OriTabs.tabPane>
</OriTabs>
```

### 常见错误

```vue
<!-- ❌ 错误：TabPane 使用 key 而非 name -->
<OriTabs v-model="activeTab">
  <OriTabs.tabPane> label="用户管理" key="user">内容</OriTabs.tabPane>
</OriTabs>

<!-- ✅ 正确：TabPane 使用 name -->
<OriTabs v-model="activeTab">
  <OriTabs.tabPane> label="用户管理" name="user">内容</OriTabs.tabPane>
</OriTabs>

<!-- ❌ 错误：TabPane 使用 tab 而非 label -->
<OriTabs v-model="activeTab">
  <OriTabs.tabPane> tab="用户管理" name="user">内容</OriTabs.tabPane>
</OriTabs>

<!-- ✅ 正确：TabPane 使用 label -->
<OriTabs v-model="activeTab">
  <OriTabs.tabPane> label="用户管理" name="user">内容</OriTabs.tabPane>
</OriTabs>

<!-- ❌ 错误：type 使用不存在的值 -->
<OriTabs v-model="activeTab" type="line">
  <!-- type 只支持 card/border-card -->
</OriTabs>

<!-- ✅ 正确：使用合法的 type 值 -->
<OriTabs v-model="activeTab" type="card">
</OriTabs>

<!-- ❌ 错误：before-leave 返回非布尔值 -->
<OriTabs v-model="activeTab" :before-leave="() => 'no'">
  <!-- 应返回 boolean 或 Promise -->
</OriTabs>

<!-- ✅ 正确：before-leave 返回 boolean 或 Promise -->
<OriTabs v-model="activeTab" :before-leave="beforeLeave">
</OriTabs>
<script setup>
const beforeLeave = () => false
</script>

<!-- ❌ 错误：v-model 与 TabPane name 不匹配 -->
<OriTabs v-model="activeTab">
  <OriTabs.tabPane> label="用户" name="user">内容</OriTabs.tabPane>
</OriTabs>
<script setup>
const activeTab = ref('users') // 与 name="user" 不匹配，无法正确选中
</script>

<!-- ✅ 正确：v-model 值与 TabPane name 匹配 -->
<OriTabs v-model="activeTab">
  <OriTabs.tabPane> label="用户" name="user">内容</OriTabs.tabPane>
</OriTabs>
<script setup>
const activeTab = ref('user')
</script>
```

## 与其他组件库的差异

| 差异点 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| 风格类型 | `type`: card/border-card | `type`: line/card/card-grid | `type`: card/border-card |
| 边框 | `border` 属性 | 无 | 无 |
| 标签宽度自撑 | `stretch` | 无 | `stretch` |
| 切换前拦截 | `before-leave(activeName, oldActiveName)` | 无 | `before-leave(activeName, oldActiveName)` |
| TabPane 标识 | `name` | `key` | `name` |
| TabPane 标题 | `label` | `tab` | `label` |
| TabPane 标题插槽 | `#label` | `tab` 插槽 | `#label` |
| 标签位置 | `tab-position`: top/right/bottom/left | `tabPosition`: top/right/bottom/left | `tab-position`: top/right/bottom/left |
| 可关闭 | `closable` | `closable` / `editable` | `closable` |
| 延迟渲染 | `lazy` | `forceRender` / `destroyInactiveTabPane` | `lazy` |
| 添加事件 | `tab-add` | `add` 事件 (Editable) | `tab-add` |
| 编辑事件 | `edit(paneName, action)` | `edit(key, action)` | `tab-remove(name)` |
