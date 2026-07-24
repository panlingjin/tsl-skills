---
title: 上传 Upload
impact: MEDIUM
impactDescription: 使用错误 API 会导致组件功能异常
type: component
tags: [origami-vue, form]
---

# 上传 Upload

**Impact: MEDIUM** - 使用错误 API 会导致组件功能异常，如 action 配置错误、fileList 绑定方式不正确、事件回调参数误用等会导致上传功能无法正常工作。

## 何时使用

- 需要上传文件到服务器
- 需要展示上传进度和文件列表
- 需要图片预览、拖拽上传等场景

## API 参考

### Upload Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| accept | 接受上传的文件类型，详见 [input accept Attribute](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input/file) | `string` | - |
| action | 上传的地址 | `string \| (file) => Promise` | - |
| beforeUpload | 上传图片前触发 | `(file: File) => Promise<boolean \| File>` | - |
| data | 上传请求附加的数据 | `Record<string, string \| Blob> \| ((fileItem: FileItem) => Record<string, string \| Blob>)` | - |
| directory | 是否支持文件夹上传（需要浏览器支持） | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| headers | 上传请求附加的头信息 | `Record<string, string>` | - |
| fileList(v-model) | 文件列表 | `FileItem[]` | - |
| listType | 图片列表类型 | `'text' \| 'picture' \| 'picture-card'` | `'text'` |
| maxCount | 限制上传数量。当为 1 时，始终用最新上传的文件代替当前文件 | `number` | - |
| multiple | 是否支持多文件上传 | `boolean` | `false` |
| name | 上传的文件名 | `string \| ((fileItem: FileItem) => string)` | - |

### Upload Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 上传的图片状态发生改变时触发 | `fileList: FileItem[], fileItem: FileItem` |
| progress | 上传中的图片进度改变时触发 | `fileList: FileItem[], event: ProgressEvent` |
| success | 上传成功时触发 | `fileItem: FileItem` |
| error | 上传失败时触发 | `fileItem: FileItem` |

## 使用示例

### 正确用法

```vue
<!-- 基本上传 -->
<ori-upload action="/api/upload" v-model:fileList="fileList">
  <ori-button>点击上传</ori-button>
</ori-upload>

<!-- action 支持函数返回 Promise -->
<ori-upload :action="customUpload" v-model:fileList="fileList">
  <ori-button>点击上传</ori-button>
</ori-upload>
<script setup>
const customUpload = (file) => {
  return new Promise((resolve) => {
    // 自定义上传逻辑
    resolve({ url: 'https://example.com/file.png' })
  })
}
</script>

<!-- 图片列表模式 -->
<ori-upload
  action="/api/upload"
  v-model:fileList="fileList"
  listType="picture"
  accept="image/*"
>
  <ori-button>点击上传</ori-button>
</ori-upload>

<!-- 照片墙模式 -->
<ori-upload
  action="/api/upload"
  v-model:fileList="fileList"
  listType="picture-card"
  accept="image/*"
>
  <ori-button>点击上传</ori-button>
</ori-upload>

<!-- 限制上传数量 -->
<ori-upload
  action="/api/upload"
  v-model:fileList="fileList"
  :maxCount="3"
  multiple
>
  <ori-button>点击上传</ori-button>
</ori-upload>

<!-- 上传前校验 -->
<ori-upload
  action="/api/upload"
  v-model:fileList="fileList"
  :beforeUpload="beforeUpload"
>
  <ori-button>点击上传</ori-button>
</ori-upload>
<script setup>
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isImage) return false
  if (!isLt2M) return false
  return true
}
</script>

<!-- 监听上传事件 -->
<ori-upload
  action="/api/upload"
  v-model:fileList="fileList"
  @success="handleSuccess"
  @error="handleError"
  @progress="handleProgress"
>
  <ori-button>点击上传</ori-button>
</ori-upload>
```

### 常见错误

```vue
<!-- ❌ 错误：fileList 使用 :fileList 单向绑定而非 v-model -->
<ori-upload action="/api/upload" :fileList="fileList">
  <ori-button>点击上传</ori-button>
</ori-upload>

<!-- ✅ 正确：使用 v-model:fileList 双向绑定 -->
<ori-upload action="/api/upload" v-model:fileList="fileList">
  <ori-button>点击上传</ori-button>
</ori-upload>

<!-- ❌ 错误：listType 使用不存在的值 -->
<ori-upload action="/api/upload" v-model:fileList="fileList" listType="image">
  <!-- listType 只支持 text/picture/picture-card -->
</ori-upload>

<!-- ✅ 正确：使用合法的 listType -->
<ori-upload action="/api/upload" v-model:fileList="fileList" listType="picture-card">
</ori-upload>

<!-- ❌ 错误：beforeUpload 不返回值 -->
<ori-upload action="/api/upload" :beforeUpload="beforeUpload">
</ori-upload>
<script setup>
const beforeUpload = (file) => {
  if (file.size > 1024 * 1024) {
    // 缺少 return false
  }
}
</script>

<!-- ✅ 正确：beforeUpload 返回 boolean 或 Promise -->
<ori-upload action="/api/upload" :beforeUpload="beforeUpload">
</ori-upload>
<script setup>
const beforeUpload = (file) => {
  if (file.size > 1024 * 1024) {
    return false
  }
  return true
}
</script>

<!-- ❌ 错误：事件回调参数误用 -->
<ori-upload @success="(response, file) => {}">
  <!-- success 事件只返回 fileItem，不返回 response -->
</ori-upload>

<!-- ✅ 正确：success 事件参数为 fileItem -->
<ori-upload @success="(fileItem) => {}">
</ori-upload>
```

## 与其他组件库的差异

| 差异点 | origami-vue | Ant Design Vue | Element Plus |
| --- | --- | --- | --- |
| 上传地址 | `action` 支持 string 或函数返回 Promise | `action` 仅支持 string，自定义用 `customRequest` | `action` 仅支持 string |
| 文件列表绑定 | `fileList` (v-model) | `fileList` (v-model:fileList) | `fileList` (v-model:file-list) |
| 列表类型 | `listType`: text/picture/picture-card | `listType`: text/picture/picture-card | `list-type`: text/picture/picture-card |
| 上传前校验 | `beforeUpload` 返回 `Promise<boolean \| File>` | `beforeUpload` 返回 `boolean \| Promise` | `beforeUpload` 返回 `boolean \| Promise` |
| 成功事件 | `success(fileItem)` | `change` / 自定义 `customRequest` | `on-success(response, file, fileList)` |
| 失败事件 | `error(fileItem)` | `change` 中判断 | `on-error(error, file, fileList)` |
| 进度事件 | `progress(fileList, event)` | 无独立进度事件 | `on-progress(event, file, fileList)` |
| 数量限制 | `maxCount` | `maxCount` | `limit` |
