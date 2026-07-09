---
name: tsl-admin-best-practices
description: Build, scaffold, review, or refactor Vue 3 management-console projects that must match the TSL/Tacos computing operations admin style with origami-vue as the default and preferred component library. Use when Codex needs to recreate the tacos-fe-computing-operations-management layout, navigation, density, colors, Less utilities, component usage, tables, drawers, details, list pages, icons, or admin page patterns for a new or existing project.
---

# TSL Admin Best Practices

Create Vue 3 admin projects that visually and structurally match the Tacos computing operations console. Prefer the bundled template for new projects and the references for existing-project changes.

## Workflow

1. Read `references/project-setup.md` first for the stack, Vite setup, app shell, and dependency baseline.
2. Read `references/layout-and-navigation.md` before building the app frame, header, menus, content area, or micro-frontend shell.
3. Read `references/style-system.md` before writing global Less, tokens, utility classes, component overrides, or page-level spacing.
4. Read `references/component-patterns.md` before implementing BaseBox, Table, DetailBox, status chips, link actions, search areas, drawers, modals, or common operations.
5. Read `references/page-patterns.md` before creating list, tree-table, detail, config, login, or error pages.
6. Read `references/assets-and-icons.md` before copying template assets, adding SVG icons, using image assets, or deriving a new project from the source console.
7. Finish with `references/quality-checks.md`.

## Template

For greenfield work, copy `assets/tsl-admin-template/` into the target project, then adapt names, routes, APIs, and product content. The template is intentionally脱敏: it keeps the admin shell, theme, layout, reusable components, and icon mechanics, but excludes source-project `.env` files, internal proxy hosts, tokens, hard-coded credentials, and business datasets.

## Defaults

- Use Vue 3, Vite 4, JavaScript, Less, Pinia, Vue Router 4, origami-vue, and `vite-plugin-svg-icons`.
- Keep source-project styling density: 14px base text, 22px line height, 4px default radius, neutral gray surfaces, Tacos purple-blue primary actions.
- Prefer Composition API and `<script setup>` for new code. Preserve Options API only when maintaining copied legacy components or matching an existing local file.
- Use `origami-vue` as the default and preferred component library. Add another UI component library only when the user explicitly requires it, the target project already depends on it, or origami-vue cannot reasonably satisfy a specific interaction; keep such usage local and documented.
- Do not copy private URLs, environment files, authentication secrets, customer data, or source-project business logic.
