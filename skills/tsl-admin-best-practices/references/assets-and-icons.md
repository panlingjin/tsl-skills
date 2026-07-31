# 资源与图标

## 本地 SVG

- 文件存放在 `src/icons/`。
- 文件名使用 kebab-case，不添加重复的 `icon_` 前缀，例如 `menu-workbench.svg`。
- `vite-plugin-svg-icons` 使用 `symbolId: 'icon-[name]'`。
- 使用 `SvgIcon` 渲染：

```vue
<SvgIcon name="settings" size="16" />
```

`SvgIcon` 内部生成 `#icon-settings`，支持 `currentColor` 和显式 `color`。

## Origami 图标

通用控件图标优先从 `origami-vue/es/icon` 具名导入：

```ts
import { QuestionMarkCircle, Search as OriIconSearch } from 'origami-vue/es/icon'
```

- 搜索、关闭、帮助、增删改等通用 UI 语义优先使用 Origami 图标。
- 产品、菜单、资源类型和业务状态使用本地 SVG。
- 同一语义在同一组件内只使用一套图标系统。

## 图片资源

- 模板只保留与具体客户无关的占位资源。
- 替换 Logo 或登录插图时保持原布局尺寸与信息密度。
- 不复制客户截图、地图、内部图表或运维数据。

## 安全与隐私

不得复制：

- `.env`、内部 IP、私有代理目标、令牌、API 密钥、地图密钥、JWT 或凭据。
- 真实用户、组织、设备、告警、工单或监控数据。
- 会暴露内部产品模块的完整私有路由表。
