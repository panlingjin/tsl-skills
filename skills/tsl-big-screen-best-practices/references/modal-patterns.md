# Modal 与弹层模式

Use this reference for Dialog, Confirm, Drawer, Media Viewer, and non-modal Callout/Popover overlays attached to a 3D scene. Classify an overlay by interaction semantics before choosing its size, backdrop, focus, and dismissal behavior. Do not treat everything that floats above the page as a Modal.

## 目录

- [类型选择](#type-selection)
- [视觉来源与标准化](#visual-source-and-normalization)
- [结构与职责](#structure-and-responsibilities)
- [层级与并发](#layers-and-concurrency)
- [挂载与缩放](#mounting-and-scaling)
- [关闭规则](#dismissal-rules)
- [焦点与键盘](#focus-and-keyboard)
- [尺寸与布局](#size-and-layout)
- [异步任务与清理](#async-work-and-cleanup)
- [非模态场景弹层](#non-modal-scene-overlays)
- [模板使用](#template-usage)
- [检查清单](#checklist)

## Type Selection

| Type | Use for | Backdrop dismissal | Default role | Typical size |
| --- | --- | --- | --- | --- |
| Dialog | General information, short forms, record details, detail tables | Enabled | `dialog` | `md` / `lg` |
| Confirm | Confirmation, warnings, irreversible actions | Disabled | `alertdialog` | `sm` |
| Drawer | Long details, control panels, continuous browsing | Enabled | `dialog` | 480px wide |
| Media Viewer | Video, images, surveillance feeds | Enabled | `dialog` | `xl` |
| Scene Callout / Popover | Point details, lightweight actions, spatially anchored information | No backdrop | Non-modal | Content-driven |

Toast is transient feedback, an LLM control panel is a persistent workspace, and a card is page content. Do not implement any of them with this modal structure.

## Visual Source And Normalization

The default visual language comes from real `ai-park-screen` overlay patterns. It is not a pixel-frequency analysis across multiple projects. AI Park uses a different canvas and many business-specific dimensions, so preserve only stable visual characteristics and normalize typography and geometry to the Skill's 1920x1080 canvas and 8px spacing system.

| AI Park source pattern | 1920x1080 baseline | Treatment |
| --- | --- | --- |
| Main surface `rgba(0,0,0,.4)` | `rgba(0,0,0,.4)` | Preserve the translucent black surface; keep the backdrop separate |
| 134-degree, 2px, `#65F2FC` gradient edge | Same angle and color | Draw a masked pseudo-element so the gradient stays in the 2px edge and the 8px radius remains available |
| Main modal `blur(32px)` | `blur(32px)` | Preserve readability over complex scenes |
| 60px header and 28px title | 48px header and 20px title | Normalize to 1080p and the 8px grid |
| Header `rgba(16,23,22,.4)` with cyan inset glow | Preserve with a 13px inset glow | Use as the main modal signature |
| 186x77px actions with 24px text | Minimum 120px width, 48px height, 16px text | Preserve the cyan edge and inner/outer glow |
| Scene overlay `rgba(15,31,47,.72)`, `#6C8097`, `blur(16px)` | Preserve colors and blur | Keep as the lighter Scene Callout preset |

Keep the Skill's `sm/md/lg/xl` sizes, 480px Drawer width, 32px canvas edge, and application layer scale. Do not copy AI Park fixed coordinates, incidental business dimensions, title background images, or customer data.

## Structure And Responsibilities

Use a consistent header, body, and footer anatomy:

- Put the title, contextual metadata, and close button in the header. Keep primary business actions out of it.
- Keep the close button aligned to the header's right safe area. Its position must not depend on whether the optional `header-extra` slot is rendered.
- Let the body own content scrolling. Long content must not push the whole modal beyond the canvas.
- Put confirm, cancel, and next-step actions in the footer. Do not render an empty footer or divider.
- Use a real `<button type="button">` for close controls, never a clickable `div`.

`BaseModal.vue` owns only Teleport, structure, ARIA, Transition, dismissal events, and slots. Feature Modal components own requests, form state, action behavior, media instances, and business copy. Do not import domain APIs or Pinia stores into the base shell.

## Layers And Concurrency

Use this application layer scale:

| Content | z-index |
| --- | ---: |
| LLM control layer | 1999 |
| Main modal | 2000 |
| Confirm | 2100 |
| Toast / urgent feedback reserve | 2200 |

Do not use arbitrary feature-level values such as `9999` or `99999` to solve stacking problems.

Allow at most one main modal and one Confirm:

- Opening a new main modal closes the previous main modal with reason `replaced`. Close an existing Confirm first.
- A Confirm may cover the main modal and is always the top keyboard interaction target.
- A new Confirm replaces the previous Confirm. Never build an unbounded confirmation stack.
- A non-modal Scene Callout does not enter the modal stack, but it must remain below the main modal and Confirm layers.

Keep feature-local modal state local by default. Promote it to Pinia only for cross-page orchestration, LLM commands, or unrelated modules that share control. Store serializable state, not DOM nodes, component instances, or media players.

## Mounting And Scaling

On a scaled 1920x1080 screen, Teleport to `#infraApp` by default so overlays share the page coordinate system and root scale. Do not default to `body`; doing so can detach size, pointer coordinates, and scene anchors from the design canvas.

- Make `#infraApp` the stable scaling root, or a positioned descendant of it.
- Use an absolutely positioned `.modal-layer` that fills the canvas instead of browser viewport units.
- Preserve a 32px canvas edge at maximum width and height.
- Override `teleport-to` only when the project mounting structure demonstrably uses another scaled overlay root.

## Dismissal Rules

Use only these close reasons:

```text
close-button | backdrop | escape | replaced | programmatic
```

- Enable backdrop dismissal for Dialog, Drawer, and Media. Disable it for Confirm.
- Let Escape close only the topmost layer and respect `closeOnEsc`.
- When `busy=true`, block Escape, backdrop dismissal, and the close button.
- When the parent directly changes `open` to `false`, report `programmatic`.
- Make dismissal idempotent. Repeated input must not duplicate requests, unlock scrolling twice, or destroy a resource twice.
- Use Confirm for irreversible actions and name the affected object and consequence. Avoid vague confirmation copy.

## Focus And Keyboard

When a modal opens:

1. Save the active trigger element.
2. Focus `[autofocus]`, then the first operable element, then the modal shell as a fallback.
3. Keep Tab and Shift+Tab inside the topmost modal.
4. Restore focus to the connected trigger after the leave transition finishes.

When a Confirm covers a main modal, focus moves to the Confirm. Closing it restores focus inside the main modal. A modal closed with `replaced` must suppress restoration through transition completion and component unmount; storing the reason only inside `BaseModal` is insufficient because the lifecycle composable also owns unmount cleanup. Use a reference-counted scroll lock so closing the Confirm does not unlock a page still covered by the main modal.

Use `aria-labelledby` when a visible title exists. A titleless modal must provide `ariaLabel`. Use `role="alertdialog"` for Confirm and `role="dialog"` for other modal variants, with `aria-modal="true"`.

## Size And Layout

Use these size presets:

| Size | Width | Use for |
| --- | ---: | --- |
| `sm` | 360px | Confirm, short notices, compact forms |
| `md` | 560px | General details and short forms |
| `lg` | 800px | Detail tables and multi-section forms |
| `xl` | 1200px | Media and complex details |

A Drawer defaults to 480px and enters from the left or right. Media defaults to `xl`. Every variant remains constrained by the 32px canvas edge.

- Use modal tokens for header height and padding instead of redefining them in feature code.
- Give the body `min-height: 0` and `overflow: auto` so it scrolls correctly inside Flex.
- Prefer `lg` for table details. Improve columns, tooltips, or horizontal scrolling before making the modal fullscreen.
- Media may remove normal body padding, but the player needs a stable ratio, loading state, and error state.
- A Drawer used for continuous browsing should restore list scroll and selection after closing.

## Async Work And Cleanup

Clean resources created while a modal is open when it closes, is replaced, the route changes, or the component unmounts:

- Abort unfinished requests with `AbortController` or an equivalent mechanism.
- Clear polling, timers, global listeners, ResizeObserver, and dynamic containers.
- Pause video and release media streams, HLS/WebRTC instances, and object URLs.
- Dispose temporary ECharts, Three.js controllers, and third-party component instances.
- `keepMounted` preserves DOM only. Drive business side effects from `open` and stop them while closed.

For dynamically created Feature Modals, retain the value returned by `createApp()`, call `app.unmount()`, and remove the temporary container after close. Prefer declarative templates and local state unless a cross-module invocation genuinely requires dynamic mounting.

## Non-Modal Scene Overlays

Scene Callout / Popover differs from Modal in these ways:

- Do not render a backdrop, lock scrolling, set `aria-modal`, or install a global focus trap.
- Anchor it to a 3D point or 2D coordinate and flip or contract it near canvas edges.
- Allow scene-background dismissal without blocking unrelated drag or zoom input.
- Upgrade to a Drawer or Dialog when content becomes complex, needs sustained keyboard interaction, or obscures too much of the scene.

The `.scene-callout` preset creates its angled title accent with CSS and does not depend on AI Park image assets. Keep its close control as a real button. Use an `aside`, `section`, or ordinary container without `aria-modal`.

## Template Usage

Use the exact Modal copy paths in `references/source-architecture.md`.

`modal.less` imports `data-tokens.less`, so keep them in the same target directory. Import `modal.less` once from the global style entry. Feature Modal components may style their content but must not redefine base layers and dimensions.

Do not implement the translucent surface and gradient border as two ordinary background layers. Because `@modal-surface` is partially transparent, a `border-box` gradient layer underneath it will bleed through the whole content area. Keep the surface as the shell background and isolate the gradient in the masked `::before` edge supplied by `modal.less`.

Public Vue contract:

```text
Props
open: Boolean
title: String
variant: dialog | confirm | drawer | media
size: sm | md | lg | xl
layer: main | confirm
placement: left | right
closable: Boolean
closeOnBackdrop: Boolean
closeOnEsc: Boolean
busy: Boolean
keepMounted: Boolean
teleportTo: String
ariaLabel: String

Emits
update:open
close({ reason })
after-enter
after-leave

Slots
title | header-extra | default | footer
```

Public CSS contract:

```text
.modal-layer--main | --confirm
.modal-backdrop
.modal-shell--dialog | --confirm | --drawer | --media
.modal-shell--sm | --md | --lg | --xl
.modal-shell--left | --right
.modal__header | __title | __extra | __close | __body | __footer
.modal-action
.modal-action--primary | .modal-action--secondary
.scene-callout
.scene-callout__header | .scene-callout__title
.scene-callout__close | .scene-callout__body
```

```vue
<BaseModal
  v-model:open="open"
  title="Space details"
  variant="dialog"
  size="md"
  layer="main"
  :busy="saving"
  teleport-to="#infraApp"
  @close="handleClose"
>
  <template #header-extra />
  <template #default />
  <template #footer />
</BaseModal>
```

```html
<aside class="scene-callout" aria-label="Point details">
  <header class="scene-callout__header">
    <h3 class="scene-callout__title">Point details</h3>
    <button class="scene-callout__close" type="button" aria-label="Close point details"></button>
  </header>
  <div class="scene-callout__body">...</div>
</aside>
```

## Checklist

- The type, size, and dismissal policy match the content semantics.
- At most one main modal and one Confirm are active; only the top layer handles Escape and Tab.
- A titleless modal has `ariaLabel`; Confirm uses `alertdialog`.
- Busy state blocks every user dismissal path and provides clear feedback.
- Focus enters, cycles, and restores correctly; the close control is a real button.
- The close button remains right-aligned with and without `header-extra`; keep a 12px gap when extra content exists.
- Teleported content remains inside the scaled 1080p canvas coordinate system.
- The scroll-lock reference count returns to zero after stacking, replacement, and unmount.
- Reduced-motion disables unnecessary translation and scaling.
- Main modals use the normalized AI Park surface; Scene Callout uses the lighter blue-gray surface.
- The cyan border gradient is visible only in the 2px edge and never tints the body surface.
- Requests, timers, media, listeners, observers, and dynamic mounts have cleanup paths.
