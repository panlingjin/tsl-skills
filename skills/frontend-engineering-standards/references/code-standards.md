# 代码规范

## Vue SFC 编写规范

### 组件结构顺序

Vue 单文件组件(SFC)的标准顺序:

```vue
<script setup lang="ts">
// 1. 导入语句
import { ref, computed, onMounted } from 'vue'

// 2. Props 定义
interface Props {
  title: string
  count?: number
}
const props = withDefaults(defineProps<Props>(), {
  count: 0,
})

// 3. Emits 定义
interface Emits {
  (e: 'update', value: number): void
}
const emit = defineEmits<Emits>()

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
- Composition API + `<script setup lang="ts">`
- TypeScript 类型定义

**避免:**
- Options API(除非项目明确要求)
- 混用 Options API 和 Composition API

### 组件命名

**组件文件:** 使用 PascalCase: `UserProfile.vue`、`OrderList.vue`

### Props 规范

**使用 TypeScript 定义 Props:**
```typescript
interface Props {
  id: number
  title: string
  items?: Array<{ id: number; name: string }>
}
const props = withDefaults(defineProps<Props>(), {
  items: () => [],
})
```

### Emits 规范

**使用 TypeScript 定义 Emits:**
```typescript
interface Emits {
  (e: 'update', value: string): void
  (e: 'delete', id: number): void
}
const emit = defineEmits<Emits>()
```

## TypeScript 使用规范

### 类型定义

**优先使用 interface:**
```typescript
interface User {
  id: number
  name: string
  email: string
}

// type 用于联合类型、映射类型
type Status = 'active' | 'inactive' | 'pending'
```

**类型导入:**
```typescript
import type { User, Status } from '@/types'
```

### 泛型使用

**API 请求泛型:**
```typescript
interface ApiResponse<T> {
  data: T
  message: string
  code: number
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  return await axios.get<ApiResponse<T>>(url).then(res => res.data)
}
```

### 类型断言

**谨慎使用类型断言:**
```typescript
// 明确类型时使用
const input = event.target as HTMLInputElement

// 避免滥用 as
const data = response as any  // 失去类型检查
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
    '@vue/typescript/recommended',
    '@vue/prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  rules: {
    'vue/multi-word-component-names': 'error',
    'vue/no-v-html': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
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
  "typescript.tsdk": "node_modules/typescript/lib",
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