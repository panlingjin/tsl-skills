# Mock 数据规范

本文档定义前端项目的 Mock 数据策略、Mock.js 使用规范等标准。

---

## Mock 数据策略

### Mock 数据的作用

**主要用途:**
- 前后端并行开发
- 接口数据模拟
- 异常情况测试
- 演示环境数据

### Mock 数据时机

**何时使用 Mock:**
- 后端接口未完成时
- 演示和测试环境
- 异常情况模拟
- 性能测试

**何时关闭 Mock:**
- 接口已完成时
- 生产环境
- 集成测试时

---

## Mock.js 使用规范

### 基本配置

**安装:**
```bash
yarn add -D mockjs
yarn add -D vite-plugin-mock
```

**配置文件:**
```javascript
// vite.config.js
import { viteMockServe } from 'vite-plugin-mock'

export default {
  plugins: [
    viteMockServe({
      mockPath: 'mock',
      enableDevelopment: true
    })
  ]
}
```

### Mock 文件组织

**目录结构:**
```
mock/
├── user.js       # 用户相关接口
├── product.js    # 产品相关接口
├── order.js      # 订单相关接口
└── index.js      # 统一入口
```

### 接口 Mock 示例

**基本结构:**
```javascript
// mock/user.js

export default [
  {
    url: '/api/user/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: [],
        message: 'success'
      }
    }
  }
]
```

---

## 数据模板规范

### 数据模板语法

**基本语法:**
- 属性名: 属性值(规则)
- `name|rule`: value

**常见规则:**
- `'name|min-max': value` - 重复次数范围
- `'name|count': value` - 重复次数固定
- `'name|min-max.dmin-dmax': value` - 浮点数范围

### 数据占位符

**常用占位符:**
- `@id`: 随机 ID
- `@name`: 随机姓名
- `@email`: 随机邮箱
- `@phone`: 随机手机号
- `@city`: 随机城市
- `@date`: 随机日期
- `@time`: 随机时间
- `@image`: 随机图片

### 数据生成示例

```javascript
Mock.mock({
  'id': '@id',
  'name': '@cname',
  'email': '@email',
  'phone': /^1[3-9]\d{9}$/,
  'age|18-60': 1,
  'avatar': '@image("100x100")',
  'createTime': '@datetime'
})
```

---

## Mock 数据管理

### 环境控制

**环境变量:**
```
VITE_ENABLE_MOCK=true  # 开启 Mock
VITE_ENABLE_MOCK=false # 关闭 Mock
```

**条件启用:**
```javascript
// 判断环境
if (import.meta.env.VITE_ENABLE_MOCK === 'true') {
  // 启用 Mock
}
```

### 数据一致性

**保持一致:**
- Mock 数据结构与真实接口一致
- 字段名、类型保持一致
- 分页、排序等参数一致

**数据约定:**
- Mock 与真实 API 使用相同字段名、数据类型和响应结构
- 使用 JavaScript 对象表达数据，不添加静态类型声明或类型断言语法

---

## Mock 数据最佳实践

### 数据真实化

**模拟真实场景:**
- 包含各种边界情况
- 包含异常数据
- 包含空值和默认值
- 数据量适中

### 数据多样化

**覆盖多种场景:**
- 正常数据
- 空数据
- 异常数据
- 边界数据

### 响应延迟

**模拟网络延迟:**
```javascript
response: () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: []
      })
    }, 300) // 延迟 300ms
  })
}
```

---

## Mock 数据检查清单

### 数据结构

- [ ] 字段名与真实接口一致
- [ ] 数据类型正确
- [ ] 包含必要字段
- [ ] 分页参数正确

### 数据质量

- [ ] 数据真实合理
- [ ] 包含边界情况
- [ ] 包含异常情况
- [ ] 数据量适中

### 使用场景

- [ ] 开发环境正确启用
- [ ] 生产环境正确禁用
- [ ] 演示环境数据完整
- [ ] 测试环境覆盖全面
