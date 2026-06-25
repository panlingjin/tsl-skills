---
name: origami-vue
description: MUST be used when working with origami-vue component library. Provides accurate API references, usage patterns, and best practices for all 37 components. Load for any task involving OriButton, OriInput, OriTable, OriForm, OriModal, OriSelect, OriTree, or any other origami-vue component. Always use the correct API as documented in references — do NOT assume Ant Design Vue or Element Plus compatibility.
license: MIT
metadata:
  author: origami-vue
  version: "2.0.0"
---

# Origami-Vue Component Library Workflow

Use this skill as an instruction set. Follow the workflow in order unless the user explicitly asks for a different order.

## Core Principles

- **Use the correct API**: origami-vue has its own API design that differs from Ant Design Vue and Element Plus. Always check the reference before using any component.
- **Import from `origami-vue`**: All components are named exports from `origami-vue`. Use `import { Button as OriButton } from 'origami-vue'` (with `as` alias to add `Ori` prefix).
- **PascalCase with `Ori` prefix**: Component names use PascalCase with the `Ori` prefix (e.g., `OriButton`, `OriTable`).
- **kebab-case for props/events/slots**: Use kebab-case for attribute names (e.g., `active-color`, `show-arrow`, `default-active`).
- **v-model patterns vary**: Different components use different v-model prop names. Check each component's reference.

## 1) Confirm component selection and read core references (required)

Before implementing any feature with origami-vue components, read the core references to understand the correct API.

### 1.1 Must-read core references (required)

- Before using any origami-vue component, make sure to read and apply these core references:
  - `references/component-button.md`
  - `references/component-form.md`
  - `references/component-table.md`
  - `references/component-input.md`
- Keep these references in active working context for the entire task.

### 1.2 Key API differences from other libraries (required)

origami-vue is NOT compatible with Ant Design Vue or Element Plus APIs. Critical differences include:

| Component | Common Mistake | Correct API |
|-----------|---------------|-------------|
| Button | `type="primary"` | `primary` boolean prop |
| Button | `size="medium"` | No medium; use `large`/`small`/`tiny` |
| Button | `shape="circle"` not supported | `shape` supports `round` and `circle` |
| Table | `:data` | `:data-source` |
| Table | `:columns` (声明但未消费) | `OriTable.column` 子组件 |
| Table | `@change` 事件 | pagination 对象的 `onChange` 属性 |
| Table | `:scroll="{ y: 400 }"` | `height` 或 `max-height` 属性 |
| Table | `size="small"` | `size="mini"` (medium/small/mini) |
| Modal | `v-model="visible"` | `v-model:visible="visible"` |
| Form | `layout="inline"` | `:inline="true"` + `label-position` |
| Tree | `:treeData` | `:data` + `node-key` + `props` |
| Tooltip | `title="..."` | `content="..."` |
| Popconfirm | `okText`/`cancelText` | `confirmButtonText`/`cancelButtonText` |
| Menu | `defaultSelectedKeys` | `default-active` |
| Dropdown | `#dropdownMenu` | `#overlay` + `<OriDropdown.Menu>` wrapper |
| Modal | `.waring()` | `.warning()` |
| Switch | `v-model` | `v-model:checked` |
| Radio.Group | `v-model` | `v-model:value` |
| Empty | `description` only | `title` + `description` |
| Progress | `size="default"` | No default; use `small`/`huge` |
| Icon | `import { AddFill } from 'origami-vue'` | `import { AddFill } from 'origami-vue/es/icon'` |
| Icon | `<ori-icon type="add-fill" />` | `<AddFill />`（独立组件标签） |
| Icon | `import { OriIconAddFill }` | `import { AddFill }`（不加 Ori 前缀） |

## 2) Apply component usage rules (required)

### 2.1 Import convention

```typescript
// Correct: named imports with `as` alias from origami-vue
import { Button as OriButton, Input as OriInput, Table as OriTable } from 'origami-vue'

// Function-style components also use `as` alias
import { Toast as OriToast } from 'origami-vue'
import { Notification as OriNotification } from 'origami-vue'

// Icons: import from origami-vue/es/icon (no `as` alias needed, no Ori prefix)
import { AddFill, DeleteFill } from 'origami-vue/es/icon'

// Incorrect: assume package exports OriXxx directly
import { OriButton } from 'origami-vue'

// Incorrect: default import or wrong package
import OriButton from 'origami-vue'
import { Button } from 'origami-vue'
```

### 2.2 Sub-component access

Some components have sub-components accessed via dot notation:

```vue
<OriButton.ButtonGroup>
  <OriButton primary>按钮1</OriButton>
  <OriButton primary>按钮2</OriButton>
</OriButton.ButtonGroup>

<OriMenu>
  <OriMenu.menuItem index="1">Item</OriMenu.menuItem>
  <OriMenu.menuItem index="2">Item 2</OriMenu.menuItem>
</OriMenu>

<OriRadio.RadioGroup v-model:value="value">
  <OriRadio value="a">A</OriRadio>
</OriRadio.RadioGroup>

<OriCheckbox.checkboxGroup v-model="value">
  <OriCheckbox label="a">A</OriCheckbox>
</OriCheckbox.checkboxGroup>

<OriCheckbox.checkboxGroup v-model="value">
  <OriCheckbox.checkboxButton label="a">A</OriCheckbox.checkboxButton>
  <OriCheckbox.checkboxButton label="b">B</OriCheckbox.checkboxButton>
</OriCheckbox.checkboxGroup>

<OriBreadcrumb>
  <OriBreadcrumb.Item>Home</OriBreadcrumb.Item>
</OriBreadcrumb>

<OriSelect>
  <OriSelect.SelectOption value="1">Option 1</OriSelect.SelectOption>
</OriSelect>

<OriTabs v-model="activeTab">
  <OriTabs.tabPane label="Tab 1" name="1">Content</OriTabs.tabPane>
</OriTabs>

<OriCollapse v-model="activeKeys">
  <OriCollapse.CollapseItem header="Panel 1" key="1">Content</OriCollapse.CollapseItem>
</OriCollapse>

<OriForm :model="formData" :rules="rules">
  <OriForm.item label="用户名" prop="username">
    <OriInput v-model="formData.username" />
  </OriForm.item>
</OriForm>

<!-- Table 只支持 OriTable.column 子组件方式定义列（columns prop 不可用） -->
<OriTable :data-source="data" size="mini" bordered="inner">
  <OriTable.column data-index="name" title="名称" />
  <OriTable.column data-index="age" title="年龄" />
</OriTable>

<!-- Table 带分页（分页事件通过 pagination 对象的 onChange 传入） -->
<OriTable :data-source="data" :pagination="pagination" size="mini" bordered="inner">
  <OriTable.column data-index="name" title="名称" />
</OriTable>
```

### 2.3 Attribute order

Component attributes should follow this order:
1. Basic props: `id`, `name`, `v-model`, `:visible`
2. Data props: `:dataSource`, `:options`, `:data`
3. Display props: `size`, `type`, `primary`, `danger`, `disabled`
4. Event props: `@click`, `@change`, `@update:visible`
5. Style props: `class`, `style`
6. Slots: `#default`, `#prefix`

### 2.4 Size system

Each component has its own size values. Do NOT assume a uniform size system:

| Component | Size values |
|-----------|-------------|
| Button | `large` / `small` / `tiny` |
| Input | `default` / `large` / `small` |
| Table | `medium` / `small` / `mini` |
| Modal | `default` / `large` / `small` |
| Switch | `default` / `small` |
| Empty | `mini` / `small` / `default` / `large` |
| Progress | `small` / `huge` |
| Spin | `small` / `default` / `large` |
| Form | `large` / `default` / `small` |
| Radio.RadioGroup | `large` / `default` / `small` |
| Select | `large` / `small` |

## 3) Load component references on demand

Do not load all references at once. Load only the references for components needed in the current task.

### 3.1 Basic components

- Button -> [component-button](references/component-button.md)
- Icon -> [component-icon](references/component-icon.md)
- Divider -> [component-divider](references/component-divider.md)

### 3.2 Form components

- Input (with Search, Textarea) -> [component-input](references/component-input.md)
- Select (with SelectOption, SelectOptionGroup) -> [component-select](references/component-select.md)
- Cascader -> [component-cascader](references/component-cascader.md)
- Radio (with RadioGroup, RadioButton) -> [component-radio](references/component-radio.md)
- Checkbox (with checkboxGroup, checkboxButton) -> [component-checkbox](references/component-checkbox.md)
- Switch -> [component-switch](references/component-switch.md)
- DatePicker (with rangePicker) -> [component-date-picker](references/component-date-picker.md)
- TimePicker (with rangePicker) -> [component-time-picker](references/component-time-picker.md)
- Form (with FormItem) -> [component-form](references/component-form.md)
- Upload -> [component-upload](references/component-upload.md)

### 3.3 Data display

- Table (with column) -> [component-table](references/component-table.md)
- Tree -> [component-tree](references/component-tree.md)
- TreeSelect -> [component-tree-select](references/component-tree-select.md)
- Tag (with CheckableTag) -> [component-tag](references/component-tag.md)
- Pagination -> [component-pagination](references/component-pagination.md)
- Empty -> [component-empty](references/component-empty.md)
- Collapse (with CollapseItem) -> [component-collapse](references/component-collapse.md)
- Chart -> [component-chart](references/component-chart.md)

### 3.4 Navigation components

- Row, Col (独立导出，无 OriGrid 父组件) -> [component-grid](references/component-grid.md)
- Layout (Header, Content, Footer, Sider) -> [component-layout](references/component-layout.md)
- Menu (with menuItem, subMenu, menuItemGroup) -> [component-menu](references/component-menu.md)
- Dropdown (with Menu, MenuItem, SubMenu, MenuGroup) -> [component-dropdown](references/component-dropdown.md)
- Breadcrumb (with BreadcrumbItem, BreadcrumbSeparator) -> [component-breadcrumb](references/component-breadcrumb.md)
- Tabs (with tabPane) -> [component-tabs](references/component-tabs.md)

### 3.5 Feedback components

- Tooltip -> [component-tooltip](references/component-tooltip.md)
- Toast -> [component-toast](references/component-toast.md)
- Alert -> [component-alert](references/component-alert.md)
- Notification -> [component-notification](references/component-notification.md)
- Spin -> [component-spin](references/component-spin.md)
- Progress -> [component-progress](references/component-progress.md)
- Result -> [component-result](references/component-result.md)

### 3.6 Modal components

- Modal -> [component-modal](references/component-modal.md)
- Popconfirm -> [component-popconfirm](references/component-popconfirm.md)
- Drawer -> [component-drawer](references/component-drawer.md)

## 4) Apply common patterns

### 4.1 Form pattern

```vue
<OriForm ref="formRef" :model="formData" :rules="formRules">
  <OriForm.item label="用户名" prop="username">
    <OriInput v-model="formData.username" placeholder="请输入" />
  </OriForm.item>
  <OriForm.item>
    <OriButton primary @click="handleSubmit">提交</OriButton>
  </OriForm.item>
</OriForm>
```

### 4.2 Table pattern

```vue
<OriTable :data-source="tableData" :pagination="pagination" size="mini" bordered="inner">
  <OriTable.column type="seq" title="序号" width="60" />
  <OriTable.column data-index="name" title="名称" />
  <OriTable.column data-index="age" title="年龄" sortable />
</OriTable>
```

```typescript
const pagination = {
  current: currentPage.value,
  pageSize: pageSize.value,
  total: total.value,
  onChange: (page: number, size: number) => {
    currentPage.value = page
    pageSize.value = size
    fetchData()
  },
}
```

### 4.3 Modal pattern

```vue
<OriModal v-model:visible="visible" title="标题" @ok="handleOk" @cancel="handleCancel">
  内容
</OriModal>
```

### 4.4 Drawer pattern

```vue
<OriDrawer v-model:visible="visible" title="标题" @ok="handleOk" @close="handleClose">
  内容
</OriDrawer>
```

## 5) Final self-check before finishing

- All component APIs match the reference documentation exactly.
- No Ant Design Vue or Element Plus API assumptions were used.
- Component names use PascalCase with `Ori` prefix.
- Props and events use kebab-case.
- Size values match each component's actual size options.
- v-model bindings use the correct prop name for each component.
- Sub-components are accessed via dot notation (e.g., `OriMenu.menuItem`).
- All must-read references were read and applied.

**Note**: For complete and always-active component rules, see `origami-component-rules.md` and `origami-best-practices.md` in the project rules. The SKILL.md provides a quick-reference workflow for on-demand loading, while the rules files are always in context.
