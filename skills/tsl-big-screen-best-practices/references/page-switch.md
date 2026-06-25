# Page Switch

## Purpose

Use Page Switch when a screen can switch between multiple engine projects or scenes exposed by dt-engine.

Only render it when a business flag or URL query explicitly enables it, usually `uni=true`.

## Files

Place the feature under:

```text
src/components/page-switch/
  index.vue
  usePageSwitch.js
  useTimer.js
```

Copy common assets from this skill before implementing the component:

```text
assets/icons/svg/swiper-item-icon.svg  -> src/assets/icons/svg/swiper-item-icon.svg
assets/img/switch/switch-base.png      -> src/assets/img/switch/switch-base.png
assets/img/switch/switch-icon.png      -> src/assets/img/switch/switch-icon.png
assets/img/switch/switch-item-bg.png   -> src/assets/img/switch/switch-item-bg.png
```

## Engine Contract

Use dt-engine Unity commands:

- `GetProjectConfigs` returns project list and current project.
- `SwitchProject` switches to a project by `SceneIndex`.

Expected normalized state:

```js
const list = ref([]);
const currentProjectKey = ref(0);
```

`list` items should contain at least `Name` and `SceneIndex`.

## Composable

Implement `usePageSwitch.js`:

```js
import { ref, onMounted } from "vue";
import { loadEngine } from "@/utils/dt-engine";

export function usePageSwitch() {
  const list = ref([]);
  const currentProjectKey = ref(0);

  const switchProject = async (key) => {
    const { meta } = await loadEngine();
    await meta.unity.invoke("SwitchProject", { SceneIndex: key });
    currentProjectKey.value = key;
  };

  const getProjectList = async () => {
    const { meta } = await loadEngine();
    const result = await meta.unity.invoke("GetProjectConfigs");
    list.value = result?.All || [];
    currentProjectKey.value = result?.Current?.SceneIndex || 0;
  };

  onMounted(getProjectList);

  return { list, currentProjectKey, switchProject, getProjectList };
}
```

## Auto Close Timer

Implement `useTimer.js`:

```js
import { ref, onUnmounted } from "vue";

export function useTimer() {
  const timer = ref(null);

  const stop = () => {
    if (!timer.value) return;
    clearInterval(timer.value);
    timer.value = null;
  };

  const start = (callback, delay) => {
    stop();
    timer.value = setInterval(callback, delay);
  };

  onUnmounted(stop);

  return { start, stop };
}
```

Default close delay: `20 * 1000`.

## UI Behavior

`index.vue` should:

- render a small bottom handle when collapsed
- expand a base panel on handle click
- display one project item per engine project
- highlight the current `SceneIndex`
- call `switchProject(item.SceneIndex)` on click
- auto-collapse after 20 seconds

Keep dimensions stable and tuned to the design canvas. Avoid changing item dimensions except for intentional active-state enlargement.

Render Page Switch inside the same scaled big-screen root as the rest of the UI. The `1920px` base assumes the `#infraApp`/screen root is scaled from the design canvas; do not mount Page Switch outside the scaled root or it will overflow on smaller viewports.

## Default Style

Use the `infra-shapan` bottom switch shape as the default style:

- root fixed at the bottom center: `position: fixed; bottom: 0; left: 50%; transform: translateX(-50%)`
- collapsed handle is a centered `120px x 8px` rounded line, `bottom: 10px`, color `#c9cdd4`
- expanded base is `1920px x 99px`; use `src/assets/img/switch/switch-base.png` when a matching asset is available
- collapsed/expanded switch visuals may use `src/assets/img/switch/switch-icon.png` when the design calls for a decorative handle/icon
- project list floats above the base at `bottom: 114px`
- project items use `120px x 104px`, `16px` gap, `16px` radius, translucent gradient background, `2px` translucent border, and `backdrop-filter: blur(20px)`
- project item icon uses `<svg-icon icon-class="swiper-item-icon" :size="40" />`
- default project item text and icon color is `#f2f3f5`
- active project item grows to `160px x 140px`, uses gold border `rgba(242, 208, 108, 1)`, gold radial highlight, and gold text/icon color `#e5c569`
- item content is vertical icon + text, `18px` semibold, `10px` gap; the SVG icon must use `currentColor`
- collapsed/expanded transitions use fade and slide-down; transition duration `0.5s`

Default Less:

```less
.page-switch {
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: 30;
  transform: translateX(-50%);
}

.switch-line {
  position: absolute;
  bottom: 10px;
  left: 50%;
  width: 120px;
  height: 8px;
  background: #c9cdd4;
  border-radius: 10px;
  transform: translateX(-50%);
  cursor: pointer;
  transition: transform 0.3s;
}

.switch-line:hover {
  transform: translateX(-50%) scale(1.1);
}

.switch-base {
  position: relative;
  width: 1920px;
  height: 99px;
  perspective: 1000px;
}

.switch-base img {
  display: block;
  width: 100%;
  height: 100%;
}

.switch-container {
  position: absolute;
  bottom: 114px;
  left: 0;
  display: flex;
  gap: 16px;
  align-items: end;
  justify-content: center;
  width: 100%;
}

.project-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 104px;
  background:
    linear-gradient(
      134deg,
      rgba(232, 239, 255, 0.29) 0%,
      rgba(0, 0, 0, 0.8) 32%,
      rgba(49, 55, 54, 0.8) 67%,
      rgba(201, 197, 180, 1) 100%
    ),
    linear-gradient(180deg, rgba(59, 101, 120, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%),
    url("@/assets/img/switch/switch-item-bg.png");
  border: 2px solid rgba(216, 220, 223, 0.5);
  border-radius: 16px;
  box-shadow: inset -9px -6px 20px 0 rgba(0, 0, 0, 0.16);
  cursor: pointer;
  backdrop-filter: blur(20px);
  transition: all 0.3s;
}

.project-item.active {
  width: 160px;
  height: 140px;
  background:
    linear-gradient(180deg, rgba(153, 125, 86, 0.4) 0%, rgba(3, 15, 23, 1) 100%),
    radial-gradient(90% 50% at 51% 0%, rgba(255, 242, 165, 0.8) 0%, rgba(244, 202, 77, 0) 100%),
    url("@/assets/img/switch/switch-item-bg.png");
  border-color: rgba(242, 208, 108, 1);
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  color: #f2f3f5;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 2px;
  transform: scale(1);
  transition: all 0.3s;
}

.item-content .svg-icon {
  color: currentColor;
}

.project-item:hover .item-content,
.project-item.active .item-content,
.item-content.item-active,
.item-content:hover {
  color: #e5c569;
}

.project-item.active .item-content,
.item-content.item-active {
  transform: scale(1.3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.5s;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(40px);
  opacity: 0;
}
```

`switch-base.png`, `switch-icon.png`, `switch-item-bg.png`, and `swiper-item-icon.svg` are bundled with this skill. Copy them into the generated project; do not replace the switch with generic square buttons. Keep `swiper-item-icon.svg` as a `currentColor` icon so it follows the text color in default, hover, and active states.

## Route Integration

In a route view:

```js
import { getPageParams } from "@/utils";

const params = getPageParams();
const switchShow = params?.uni === "true";
```

Render:

```vue
<PageSwitch v-if="switchShow" />
```
