# 项目设置

本文件只记录 TSL 模板对通用工程标准的落地方式。未提及的工程规则直接服从 `frontend-engineering-standards`。

## 技术基线

- Vue 3、纯 JavaScript、Composition API、`<script setup>`。
- Vite 4、Less、Pinia、Vue Router 4、origami-vue。
- Yarn 是唯一包管理器；不生成 npm 或 pnpm 命令与锁文件。
- 使用 `vite-plugin-importer` 加载 Origami Vue 组件样式。
- 使用 `vite-plugin-svg-icons` 注册本地业务图标。

## 目标项目目录

```text
src/
  components/
    common/
      BaseBox/
        BaseBox.vue
    business/
      AdminTable/
        AdminTable.vue
        TableColumnSettings.vue
        useTableColumns.js
  icons/
  layouts/
    AdminLayout/
  router/
    index.js
    routes.js
    guards.js
  stores/
    index.js
    modules/
  assets/
    styles/
      reset.less
      variables.less
  utils/
  views/
```

- 路由视图负责数据编排、API 调用与页面组合。
- 页面私有组件放在 `views/<Feature>/components/`。
- 跨页面组件按 `common` 和 `business` 分层。
- 布局放在 `layouts/`，状态放在 `stores/`，全局样式放在 `assets/styles/`。

## 组件模板范围

`assets/tsl-admin-template/` 只包含：

```text
src/
  components/
    common/
      BaseBox/
      DetailBox/
      LinkButton/
      SvgIcon/
    business/
      AdminTable/
  icons/
    back.svg
    pin.svg
    refresh.svg
    settings.svg
    unpin.svg
  assets/
    styles/
      components/
        admin-table.less
      variables.less
  utils/
    tools.js
```

它是可复制的组件资产包，不负责创建应用入口、路由、Store、布局、页面或工程配置。目标项目的这些内容按 `frontend-engineering-standards` 自行建立。

## Vite

- `@` 指向 `src`。
- Less `additionalData` 全局导入 `@/assets/styles/variables.less`。
- SVG 目录使用 `src/icons`，`symbolId` 固定为 `icon-[name]`。
- 普通独立应用使用 `base: '/'`。
- 仅当 `VITE_WUJIE_BUILD=true` 时使用 `base: './'`。
- 开发代理和部署主机必须由目标项目自行配置，不复制任何内部 IP。
- Vite 配置文件使用 `vite.config.js`，路径提示使用 `jsconfig.json`；不创建 TypeScript 配置文件。

## 应用入口

- 入口按 `createApp → Pinia → Router → mount` 安装。
- Origami Vue 组件在使用处按需导入，不在入口全局注册整套组件。
- 根视图使用 Origami Vue `ConfigProvider` 提供中文 locale。
- Pinia 应用实例由 `createAppStore()` 创建，测试和多应用挂载时不复用全局单例。

## Wujie

仅当目标项目确实作为 Wujie 子应用运行时：

- 根据 `window.__POWERED_BY_WUJIE__` 设置 `data-wujie="true"`。
- 暴露 `__WUJIE_MOUNT` 与 `__WUJIE_UNMOUNT`。
- 卸载时清理 Vue 应用实例和项目创建的副作用。

不要让 Wujie 配置改变独立应用的默认部署路径。
