# 代码规范

## Vue SFC 编写规范

### 组件结构顺序

Vue 单文件组件(SFC)的标准顺序:

```vue
<script setup>
// 1. 导入语句
import { ref, computed, onMounted, watch } from 'vue'

// 2. Props 定义与运行时校验
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
})

// 3. Emits 定义
const emit = defineEmits(['update'])

// 4. 响应式状态
const loading = ref(false)

// 5. 计算属性
const displayTitle = computed(() => `${props.title} (${props.count})`)

// 6. 方法函数
const handleClick = () => {
  emit('update', props.count + 1)
}

// 7. 生命周期钩子
onMounted(() => {
  // 初始化逻辑
})

// 8. 监听器
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

### 组件命名

**组件文件:** 使用 PascalCase: `UserProfile.vue`、`OrderList.vue`

### Props 规范

**使用运行时声明定义 Props:**
```javascript
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
})
```

### Emits 规范

**显式声明 Emits:**
```javascript
const emit = defineEmits(['update', 'delete'])
```

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

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'vue/multi-word-component-names': 'error',
    'vue/no-v-html': 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
}
```

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
- 避免过长的组件(超过 200 行考虑拆分)
- 避免深层嵌套(超过 3 层)

### 使用有意义的命名
- 变量名应清晰表达用途
- 避免使用缩写(除非是公认的)
- 避免使用数字序号

### 遵循单一职责原则
- 一个函数只做一件事
- 避免多职责混杂

### 优先使用组合式函数
- 提取复用逻辑到 composable
- 在多个组件中复用逻辑
