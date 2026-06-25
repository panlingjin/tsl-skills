# Quality Checks

## Formatting And Naming

Use `.editorconfig`:

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
insert_final_newline = false
trim_trailing_whitespace = false
```

Use ls-lint rules:

```yaml
ls:
  src/**:
    .js: kebab-case | PascalCase | point.case
    .ts: kebab-case | PascalCase | point.case
    .tsx: kebab-case | PascalCase | point.case
    .vue: kebab-case | PascalCase | point.case
    .less: kebab-case | point.case
    .spec.js: kebab-case | point.case

  types:
    .d.ts: kebab-case
```

## Commitlint

Use conventional commit types:

- `feat`
- `fix`
- `refactor`
- `style`
- `chore`
- `test`
- `perf`
- `docs`

## Required Vue CLI Config Checks

Before implementing feature UI, confirm these base files and package entries exist:

- `babel.config.js` exists and uses `tsl-cli-helper/preset`.
- `package.json.eslintConfig.extends` includes `tsl-standard`.
- `.eslintignore` exists and includes `iconfont.js` and `public/*`.
- `.editorconfig` exists.
- `.ls-lint.yml` exists.
- `jest.config.js` exists.
- `devDependencies` include `@vue/cli-plugin-babel`, `@vue/cli-service`, `eslint-config-tsl-standard`, `svg-sprite-loader`, and `tsl-cli-helper`.
- `vue.config.js` excludes `src/assets/icons` from the default SVG rule and loads those SVGs with `svg-sprite-loader` using a custom `symbolId(filePath)` that preserves nested folders.
- `vue.config.js` has one `module.exports` that combines dev server, style resources, and SVG sprite config.

When the project uses dt-engine, also confirm `.env` includes:

```env
VUE_APP_TACOS_LOAD_MODE = unity-exe
VUE_APP_DTENGINE_WS = ws://127.0.0.1:8181
```

When the project uses LLM/MCP, also confirm `.env` includes:

```env
VUE_APP_MCP_SERVER_NAME = bigscreen
```

## Tests

Use Vue CLI Jest defaults unless the project already has another runner.

Focus tests on:

- Axios response normalization
- MockJS endpoint envelopes
- Pinia store actions
- Page Switch composable behavior
- `frontControl` action dispatch
- pure chart option builders

Do not snapshot huge visual components unless the project already uses snapshot tests.

## Manual QA

Before delivery:

- Start the dev server when feasible.
- Confirm the root screen mounts to `#infraApp`.
- Confirm the screen is not blank.
- Confirm resize scaling works.
- Confirm API calls go through `src/utils/axios.js`.
- Confirm `.env` contains `VUE_APP_MOCK = true` and mock registration is controlled only by `process.env.VUE_APP_MOCK === "true"`.
- Confirm mock data is reached through Axios and MockJS interception.
- Confirm no component imports mock records directly.
- Confirm Page Switch only appears when enabled.
- Confirm Page Switch uses the bottom-center switch style: `120px x 8px` collapsed handle, `1920px x 99px` base, `120px x 104px` items, and `160px x 140px` active item.
- Confirm Page Switch assets exist when used: `swiper-item-icon.svg`, `switch-base.png`, `switch-icon.png`, and `switch-item-bg.png`.
- Confirm Page Switch default text/icon color is `#f2f3f5`, active/hover text/icon color is `#e5c569`, and `swiper-item-icon.svg` follows `currentColor`.
- Confirm `src/components/svg-icon/SvgIcon.vue` and `src/components/svg-icon/index.js` exist when any SVG icon is used.
- Confirm `src/components/svg-icon/index.js` imports all icons with `require.context("@/assets/icons/svg", true, /\.svg$/)` and globally registers `SvgIcon`.
- Confirm `src/plugin/index.js` installs the svg-icon plugin before components render.
- Confirm `SvgIcon.vue` supports `prefix`, so weather icons can use `prefix="weather" icon-class="qing"`.
- Confirm Page Switch is mounted inside the same scaled big-screen root as the rest of the UI.
- Confirm dt-engine code is included only when required.
- When dt-engine is used, confirm the home/scene view renders `three-container` and actually calls `await init()`.
- When dt-engine is used, confirm `#three-container` fills the page or full scene area with `position: absolute`, `inset: 0`, `width: 100%`, and `height: 100%`.
- Confirm Header, left dashboard, right dashboard, Page Switch, modals, and LLM/MCP controls overlay the 3D scene instead of shrinking or pushing the scene container.
- Confirm the center of the screen remains available for the 3D model and center overlays do not resize `#three-container`.
- Confirm MCP/LLM code is included only when required.
- Confirm MCP server creation uses `new mcpServer(process.env.VUE_APP_MCP_SERVER_NAME || "bigscreen")`.
- Confirm generated code does not hard-code `green-computing-body`.
- Confirm LLM quick question buttons are fixed at the bottom-right interaction area, use icon-only `56px` groups, and throttle clicks.
- Confirm LLM quick-question icons exist when used: `icon-refresh.svg`, `icon-question-1.svg`, and `icon-question-2.svg`.
- Confirm weather icons are copied when Header/weather UI is included.

## Security Review

Search before delivery:

```bash
rg -n "token|secret|appSecret|Authorization|jwt|http://|https://|ws://|wss://" .
```

Private hosts, tokens, secrets, app credentials, JWTs, and customer-specific model ids must not be committed. Replace them with environment variables or placeholders.

## Skill-Specific Acceptance

For projects generated from this skill:

- Only `zod@3.23.8` and `@tslfe/dt-engine@4.3.1-1` are forced exact versions.
- HTTP uses the shared Axios instance in `src/utils/axios.js`.
- Vue CLI Babel and ESLint config are present before running or building.
- dt-engine local development env uses `unity-exe` and `ws://127.0.0.1:8181`.
- LLM uses `@tslfe/ai-sdk` + MCP tools when requested.
- MCP handlers delegate to `frontControl`.
- Timers, event listeners, charts, WebSockets, dynamic modals, POI, and effects are cleaned up.
