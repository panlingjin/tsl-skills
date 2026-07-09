# Project Setup

Use this reference before scaffolding or changing a Tacos-style Vue admin project.

## Stack

- Build the default template with Vue 3, Vite 4, JavaScript, Less, Pinia, Vue Router 4, origami-vue, `vite-plugin-svg-icons`, and `vite-plugin-style-import`.
- Keep JavaScript + Less as the default when reproducing the source console. Do not migrate to TypeScript unless the user explicitly asks.
- Use Composition API and `<script setup>` for new files. Accept Options API only when adapting legacy copied components.
- Register the origami-vue locale provider at the root when localization is required.
- Import global styles in this order: runtime config if any, reset/theme Less, component libraries, virtual SVG registration, plugins.

## Vite

- Use `base: './'` so the same build can run standalone or as a micro-frontend child.
- Set `@` to `src`.
- Configure Less `modifyVars.hack` to import `src/assets/styles/var.less` by reference.
- Register SVG icons from `src/assets/icons/svg` with `symbolId: 'icon-[dir]-[name]'`.
- Configure origami-vue style loading by default. Add resolver/config for another component library only when the target project explicitly needs that library.
- Keep dev proxies and deployment hosts project-local. Never copy source-project internal IPs into a new project.

## App Shell

- Mount with `createApp(App)`, then install Pinia, Router, i18n if required, and selected origami-vue components.
- Wrap the root view in origami-vue `ConfigProvider`.
- Prefer project-local SVG icons through `vite-plugin-svg-icons`. Use another icon package only when it is already part of the target project's chosen UI dependency.
- Support `window.__POWERED_BY_WUJIE__` only when the target project actually runs as a Wujie child. In that case set a body marker such as `data-wujie="true"` and expose mount/unmount lifecycle hooks.

## Source Structure

Use this shape for new projects:

```text
src/
  assets/styles/var.less
  assets/styles/reset.less
  assets/icons/svg/
  components/layout/
  components/base-box/
  components/table/
  components/detail-box/
  components/svg-icon/
  components/link-button/
  router/
  store/
  utils/
  views/
```

Keep route-level views thin. Put reusable admin patterns in `components/`, feature-local sections in `views/<feature>/components/`, and API-specific behavior in composables or services.
