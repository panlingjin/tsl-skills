---
title: 折叠面板 (Collapse)
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, data-display]
---

# 折叠面板 (Collapse)

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 对复杂区域进行分组和隐藏，保持页面的整洁
- 手风琴模式是一种特殊的折叠面板，只允许单个内容区域展开

## API 参考

### Collapse Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| activeKey (v-model) | 当前展开的面板的 key | `(string \| number)[]` | `-` |
| defaultActiveKey | 默认展开的面板的 key（非受控模式） | `(string \| number)[]` | `[]` |
| accordion | 是否开启手风琴模式 | `boolean` | `false` |
| expandIconPosition | 展开图标显示的位置 | `'left' \| 'right'` | `'left'` |
| bordered | 是否显示边框 | `boolean` | `false` |

### CollapseItem Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 面板的 id，对应 activeKey 中的值 | `string` | `''` |
| header | 面板的标题，可使用插槽 | `string \| slot` | `''` |
| disabled | 是否禁用 | `boolean` | `false` |
| showExpandIcon | 是否显示展开图标 | `string` | `'true'` |
| customOperate | 右上角辅助区域内容 | `slot` | `-` |
| expandIcon | 自定义展开图标 | `slot` | `-` |
| expandIconOpen | 自定义展开图标-展开状态，默认收起图标旋转180deg | `slot` | `-` |

### Collapse Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 面板状态改变时回调 | `(activeKeys, e) => void` |

## 子组件访问

Collapse 的子组件通过大驼峰属性访问：
- `OriCollapse.CollapseItem` — 折叠面板项

```vue
<OriCollapse v-model="activeKeys">
  <OriCollapse.CollapseItem header="面板1" key="1">内容</OriCollapse.CollapseItem>
</OriCollapse>
```

## 使用示例

### 正确用法

```vue
<!-- 基础用法 -->
<OriCollapse v-model:activeKey="activeKeys">
  <OriCollapse.CollapseItem key="1" header="面板一">
    内容区域一
  </OriCollapse.CollapseItem>
  <OriCollapse.CollapseItem key="2" header="面板二">
    内容区域二
  </OriCollapse.CollapseItem>
</OriCollapse>

<!-- 手风琴模式 -->
<OriCollapse v-model:activeKey="activeKey" accordion>
  <OriCollapse.CollapseItem key="1" header="面板一">内容一</OriCollapse.CollapseItem>
  <OriCollapse.CollapseItem key="2" header="面板二">内容二</OriCollapse.CollapseItem>
</OriCollapse>

<!-- 带边框 -->
<OriCollapse v-model:activeKey="activeKeys" bordered>
  <OriCollapse.CollapseItem key="1" header="面板一">内容一</OriCollapse.CollapseItem>
</OriCollapse>

<!-- 自定义展开图标 -->
<OriCollapse v-model:activeKey="activeKeys">
  <OriCollapse.CollapseItem key="1" header="面板一">
    <template #expandIcon>
      <ArrowRight />
    </template>
    <template #expandIconOpen>
      <ArrowDown />
    </template>
    内容一
  </OriCollapse.CollapseItem>
</OriCollapse>

<!-- 右上角辅助区域 -->
<OriCollapse v-model:activeKey="activeKeys">
  <OriCollapse.CollapseItem key="1" header="面板一">
    <template #customOperate>
      <span class="text-xs text-tsl-gray-5">辅助信息</span>
    </template>
    内容一
  </OriCollapse.CollapseItem>
</OriCollapse>

<!-- 禁用某项 -->
<OriCollapse v-model:activeKey="activeKeys">
  <OriCollapse.CollapseItem key="1" header="面板一" disabled>
    内容一
  </OriCollapse.CollapseItem>
</OriCollapse>
```

### 常见错误

```vue
<!-- 错误：activeKey 绑定了字符串而非数组 -->
<OriCollapse v-model:activeKey="'1'">
  <!-- activeKey 类型为 (string|number)[]，应绑定数组 -->
</OriCollapse>

<!-- 错误：手风琴模式下 activeKey 仍用数组 -->
<OriCollapse v-model:activeKey="['1']" accordion>
  <!-- 手风琴模式建议绑定单个值或注意只会有一个展开 -->
</OriCollapse>

<!-- 错误：collapse-item 未设置 key -->
<OriCollapse v-model:activeKey="activeKeys">
  <OriCollapse.CollapseItem header="面板一">
    <!-- 缺少 key，无法与 activeKey 对应 -->
  </OriCollapse.CollapseItem>
</OriCollapse>
```

## 与其他组件库的差异

| 差异点 | origami-vue | ant-design-vue | element-plus |
| --- | --- | --- | --- |
| v-model 绑定 | `v-model:activeKey` | `v-model:activeKey` | `v-model` |
| 边框控制 | `bordered` prop | `bordered` prop | 不支持（默认有边框） |
| 自定义展开图标 | `expandIcon` / `expandIconOpen` 插槽 | `expandIcon` 插槽 | 不支持 |
| 右上角辅助区域 | `customOperate` 插槽 | `extra` 插槽 | 不支持 |
| 隐藏展开图标 | `showExpandIcon` | `showArrow` | 不支持 |
