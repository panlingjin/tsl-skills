# Assets And Icons

Use this reference before copying assets or adding icons.

## SVG Icons

- Store SVGs in `src/assets/icons/svg`.
- Register with `vite-plugin-svg-icons` and `symbolId: 'icon-[dir]-[name]'`.
- Render through the bundled `SvgIcon` component:

```vue
<SvgIcon icon-class="icon_settings" size="16" />
```

- Use the source naming style: `icon_menu_*` for menu icons, `icon_*` for actions/status.
- Prefer single-color SVGs that can follow `currentColor` or an explicit color prop.

## Origami Icon Components

- Use `origami-vue/es/icon` for built-in UI glyphs that already exist in origami-vue, especially search, add, upload, download, more, delete, close, edit, prompt/help, direction arrows, and status symbols.
- Import named icons directly from `origami-vue/es/icon`; alias when the semantic role is clearer or when avoiding local name conflicts:

```vue
<script setup>
import { Search as OriIconSearch, Increase, MoreHorizontal, QuestionMarkCircle } from 'origami-vue/es/icon'
</script>
```

- Render these icons as normal Vue components and size/color them with class styles or inline font-size, matching the source console:

```vue
<OriIconSearch class="search-icon" />
<QuestionMarkCircle class="header-icon" />
```

- Prefer local `SvgIcon` for product/menu/business icons from `src/assets/icons/svg`, such as `icon_menu_workbench`, `icon_monitor`, and resource-category icons.
- Do not mix both systems for the same semantic icon in one component. If an icon is a generic control and exists in `origami-vue/es/icon`, prefer the origami icon; if it is a product or resource symbol, use `SvgIcon`.

## Bitmap Assets

- Keep only product-generic images in reusable templates: logo placeholders, empty states, 401/404 illustrations, upload placeholders, and safe icons.
- Do not copy customer-specific screenshots, maps, internal diagrams, or source-project operational data.
- For a new product, replace logo and login imagery while preserving dimensions, density, and placement.

## Security And Privacy

Never copy these from the source console into the Skill or a new project:

- `.env` files or deployment notes containing hosts.
- Internal IP addresses, private proxy targets, tokens, API keys, AMap keys, JWTs, or credentials.
- Real user, organization, device, alarm, order, or monitoring data.
- Business-only route lists that disclose internal product modules unless the user asks to build the same product.

## Template Contract

The bundled `assets/tsl-admin-template/` is a starting point. Copy it into a target project, then:

1. Replace package name and product name.
2. Add project-specific routes and API modules.
3. Replace placeholder icons/logo assets.
4. Add `.env` files in the target project only.
5. Review `quality-checks.md` before delivery.
