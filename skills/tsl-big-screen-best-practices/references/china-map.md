# Static China Map

Use this pattern only when the screen needs the static Ya'an-style national map surface. It renders the national base map and its depth treatment; it does not own business regions, points, routes, tooltips, rotation, drill-down, refresh, or interaction.

## Source Assets

Copy only the two files used by the Ya'an map component:

```text
skill assets/map/china/china.json
  -> project src/assets/map/china/china.json
skill assets/map/china/china-map-outline.js
  -> project src/assets/map/china/china-map-outline.js
```

`china.json` is the approximately `110 KB` province map. `china-map-outline.js` is the approximately `61 KB` national outline. Do not copy Ya'an's unused `china-map.js` or `china-out.js`; together they add about `913 KB` without participating in the rendered map.

These files are copied from an internal reference project without changing coordinates, geometry, encoding, or color data. This template does not assert that they are approved for public Internet publication. The consuming project must verify national-boundary and map-review requirements before public release.

The copied province map contains Taiwan, Hong Kong, Macao, and Hainan, but it has no separately named `南海诸岛` feature. Preserve the source byte-for-byte; do not silently add or redraw geography inside this template. A project that requires a reviewed South China Sea inset must replace the map through its own approved asset workflow.

## Three-Layer Contract

The source project uses a `2160p` design baseline. Normalize line and shadow geometry by `0.5` for the Skill's `1920 x 1080` canvas.

| Layer | Map | 1080p style | Order |
| --- | --- | --- | --- |
| Bottom outline | `china-map-outline` | transparent area, `4px #00FFFF` edge, `17px` downward offset, `42px` black shadow | `z: 0` |
| Main map | `china` | `rgba(29,49,64,.5)` area, `1px #B4EAFC` province edge | `z: 1` |
| Top outline | `china-map-outline` | transparent area, `4px #B4EAFC` edge, `-17px` upward offset, `42px` black shadow | `z: 2` |

Keep every layer at `zlevel: 0`. Use `z` for paint order so the static map remains on one Canvas instead of allocating one Canvas per layer.

Keep the Ya'an composition:

- outline center: `50% / 40%`
- main map center: `50% / 42%`
- layout size: `105%`
- aspect scale and zoom: `1`

## Static Behavior

The option must retain all of these constraints:

- `animation: false`
- `roam: false`
- `silent: true`
- labels hidden
- selection disabled
- emphasis disabled
- no Tooltip or VisualMap
- no scatter, effectScatter, lines, heatmap, custom, or business series
- no timers, DOM markers, event handlers, API calls, watchers, or rotation

`createChinaMapOption` accepts only layout and color overrides. It never accepts business data or an arbitrary ECharts option merge, because an unrestricted merge could add interaction, animation, extra series, or extra Canvas layers.

```js
createChinaMapOption({
  overrides: {
    layout: {
      outlineCenter: ["50%", "40%"],
      mapCenter: ["50%", "42%"],
      size: "105%",
    },
    colors: {
      area: "rgba(29, 49, 64, 0.5)",
      border: "#b4eafc",
      bottomOutline: "#00ffff",
      topOutline: "#b4eafc",
      shadow: "#000000",
    },
  },
});
```

## Registration And Lifecycle

Copy `china-map.js` to `src/utils/china-map.js`. Call `ensureChinaMapRegistered()` before assigning the option. The helper lazy-loads both assets, caches the in-flight registration Promise, registers each map name once, and clears a failed Promise so the caller can retry.

Use the shared lifecycle composable:

```js
const option = shallowRef(null);

onMounted(async () => {
  await ensureChinaMapRegistered();
  option.value = createChinaMapOption();
});

useECharts(mapRef, option, {
  initOptions: {
    renderer: "canvas",
    useDirtyRect: true,
    devicePixelRatio: Math.min(globalThis.devicePixelRatio || 1, 2),
  },
});
```

Render into `.china-map-canvas`. Its parent must provide a measurable height. The lifecycle helper waits for positive geometry, sets the static option once, resizes the existing instance on element changes, and disposes it on unmount.

## Acceptance

- Preserve the two source assets byte-for-byte.
- Render exactly one `geo` layer and two `map` series.
- Keep all three layers on `zlevel: 0` with stable `z` values `0/1/2`.
- Keep the map idle after first paint: no animation frame loop, interval, timeout, data refresh, or DOM-node growth.
- Confirm Taiwan, Hong Kong, Macao, Hainan, and every other geometry present in the source remain visible at `1920 x 1080`; do not claim that the source includes a separately named South China Sea inset.
