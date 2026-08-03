# 代码规范

## Vue SFC 编写规范

### 组件结构顺序

Vue 单文件组件(SFC)的标准顺序:

```vue
<script setup>
// 1. 导入语句
import { ref, computed, onMounted, watch } from 'vue'

// 2. 组件接口
const props = defineProps({ title: String, count: Number })
const emit = defineEmits(['update'])

// 3. 响应式状态
const loading = ref(false)

// 4. 计算属性
const displayTitle = computed(() => `${props.title} (${props.count})`)

// 5. 方法函数
const handleClick = () => {
  emit('update', props.count + 1)
}

// 6. 生命周期钩子
onMounted(() => {
  // 初始化逻辑
})

// 7. 监听器
watch(() => props.count, (newVal) => {
  console.log('Count changed:', newVal)
})
</script>

<template>
  <div class="my-component">
    <h2>{{ displayTitle }}</h2>
    <button @click="handleClick">Update</button>
  </div>
</template>

<style scoped>
.my-component {
  padding: 20px;
}
</style>
```

### Composition API 使用规范

**必须使用:**
- Composition API + `<script setup>`
- JavaScript 与 ES Modules

**避免:**
- Options API(除非项目明确要求)
- 混用 Options API 和 Composition API

### 组件接口基线

- 使用 JavaScript 运行时声明定义 Props；必填值显式设置 `required`，对象和数组的默认值使用工厂函数。
- 显式声明组件可能触发的 Emits，不直接修改 Props，保持父组件向子组件传递数据、子组件向外通知事件的单向数据流。
- 使用 Slots 提供必要的内容或结构扩展点，不通过 Slots 隐藏组件必须的数据依赖。
- 直接父子通信优先使用 Props 和 Emits；深层上下文使用 `Symbol` 作为 provide/inject key；跨模块业务状态使用 Pinia。
- 保持接口最小、语义稳定。需要判断是否抽离组件或逻辑时，再读取 `component-encapsulation.md`。

## JavaScript 使用规范

### 数据结构与模块

**使用普通对象表达数据:**
```javascript
const user = {
  id: 1,
  name: 'Ada',
  email: 'ada@example.com',
}
```

**使用 ES Modules:**
```javascript
import { formatUser } from '@/utils/formatUser'
export { formatUser }
```

### 参数与返回值说明

**复杂公共函数使用 JSDoc:**
```javascript
/**
 * @param {string} url
 * @returns {Promise<{ data: unknown, message: string, code: number }>}
 */
async function fetchData(url) {
  return axios.get(url).then(response => response.data)
}
```

### 运行时校验

**在外部数据边界进行校验:**
```javascript
if (!response || !Array.isArray(response.data)) {
  throw new TypeError('Invalid response data')
}
```

## 代码格式化配置

### ESLint 配置

- 先沿用项目现有 ESLint 主版本和配置格式，不在普通任务中迁移配置系统。
- 新项目使用当前 ESLint Flat Config，并启用 Vue 官方推荐规则。
- 将 `vue/multi-word-component-names`、未处理 Promise、未使用变量和生产调试代码纳入检查。
- 使用与当前 ESLint 版本兼容的 Prettier 集成，避免同时启用相互冲突的格式规则。

### Prettier 配置

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "vueIndentScriptAndStyle": false,
  "htmlWhitespaceSensitivity": "ignore"
}
```

### VSCode 配置

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "volar.completion.preferredTagNameCase": "kebab",
  "volar.completion.preferredAttrNameCase": "kebab"
}
```

## 代码质量要求

### 保持代码简洁
- 函数职责单一
- 组件包含多个独立职责时按组件抽离与封装规范判断边界
- 使用提前返回降低不必要的嵌套

### 使用有意义的命名
- 变量名应清晰表达用途
- 避免使用缩写(除非是公认的)
- 避免使用数字序号

### 优先使用组合式函数
- 提取复用逻辑到 composable
- 在多个组件中复用逻辑
