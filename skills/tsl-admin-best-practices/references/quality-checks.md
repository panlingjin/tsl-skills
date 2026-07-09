# Quality Checks

Run these checks before handing off a Tacos-style admin project or page.

## Visual Acceptance

- Header height is 48px and the content region starts directly below it.
- Top header has no left collapse icon before the logo; logo area is 210px wide and the top menu starts immediately after it.
- Breadcrumb header includes the 20px sider collapse/expand control before the breadcrumb text.
- Sider is 224px expanded, 56px collapsed, and uses Tacos active/hover states.
- Left navigation is rendered with origami-vue `Menu`/`MenuItem`/`SubMenu`/`MenuItemGroup`, not a hand-written list.
- Small modules use the flat sider menu: blue module title, direct 36px icon rows, no group labels, no dividers, and `#E8EDFF` active background.
- Resource-heavy modules use the grouped sider menu: blue module title, gray group labels, 36px leaf rows, 16px icons, group dividers, and `#E8EDFF` active background.
- Breadcrumbs sit in a 48px white workspace header above the gray content canvas, not inside the content card.
- Breadcrumb ancestors are clickable only when `routeConfig` exists; the current item is never clickable and uses stronger text.
- Page background is `#F2F3F5`; ordinary content uses white panels with 4px radius and 20px padding.
- Text density matches the console: 14px base, 22px line height, 12px secondary metadata.
- Primary actions and active navigation use `#5E66F2`.
- Table search wraps cleanly and operation icons remain 32px square.
- List pages use the bundled Table wrapper with `tableSearch` and `tableOperate` slots, not raw `ori-table` unless the table is genuinely special.
- Table column settings, refresh animation, pagination total `共 N 项数据`, `-` empty values, tooltip overflow, and `tableKey` column persistence are present where appropriate.
- Drawers, detail pages, and footer action bars match the spacing and hierarchy in the references.
- `ori-input__inner` has no unintended `padding-bottom: 16px`; filter/search inputs and form controls align on the same baseline.
- Generic control icons use `origami-vue/es/icon` when available; business/menu/resource icons use the local SVG sprite.

## Engineering Acceptance

- Vite aliases, Less global token import, SVG icon plugin, Pinia, Router, and origami-vue are configured.
- Any additional component library has an explicit reason, is scoped to the needed feature, and does not replace origami-vue as the default admin component surface.
- Route views are not large monoliths; forms/search sections/drawers are split when they have their own responsibility.
- Component communication uses props down and emits up; `v-model:visible` is used for drawers/modals.
- Global styles live in `src/assets/styles`; component-specific styles stay scoped unless overriding library internals.
- No source-project `.env`, private proxy host, key, token, or business dataset is present.

## Suggested Commands

Run the target project's normal commands when available:

```bash
npm run lint
npm run build
```

For Skill validation, run:

```bash
python3 /Users/panlingjin/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/tsl-admin-best-practices
```
