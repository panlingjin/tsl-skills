# 静态中国地图

本文件只适用于雅安风格的静态全国底图。数据驱动地图、热力图、迁徙线或区域下钻应按业务重新设计 option。

## 来源资源

只复制实际使用的两个文件：

```text
assets/map/china/china.json
  -> src/assets/map/china/china.json
assets/map/china/china-map-outline.js
  -> src/assets/map/china/china-map-outline.js
```

不要复制未参与渲染的旧 `china-map.js` 或 `china-out.js`。上述资源来自内部参考项目，复制时不得改变坐标、几何、编码或颜色数据。它们不代表已获得公开互联网发布许可；对外发布前必须由项目方核对地图审核和国界展示要求。

## 三层结构

地图必须包含一层 `geo` 和两层 `map` series：

| 层 | 地图名 | 样式 | 层级 |
| --- | --- | --- | --- |
| 底部轮廓 | `china-map-outline` | 透明区域、`4px #00FFFF` 边线、向下 `17px`、`42px` 黑色阴影 | `z: 0` |
| 主地图 | `china` | 半透明深色区域、`1px #B4EAFC` 边线 | `z: 1` |
| 顶部轮廓 | `china-map-outline` | 透明区域、`4px #B4EAFC` 边线、向上 `17px`、`42px` 黑色阴影 | `z: 2` |

三层统一使用 `zlevel: 0`，避免创建额外 Canvas。

## 布局规则

默认采用安全内边距适配：

```js
overrides: {
  layout: {
    mode: 'fit',
    inset: 64,
  },
}
```

- 三层使用相同的 `top/right/bottom/left`。
- 默认每侧至少保留 `64px`，为上下阴影留出空间。
- 默认不设置 `layoutCenter` 和 `layoutSize`。
- 只有维护旧页面时才使用显式 `mode: 'legacy'`。
- 地图父容器必须提供可测量的宽高。

## 静态行为

- 首次渲染后保持静止，不启动动画帧、定时器或数据刷新。
- 禁止缩放、漫游、选中和高亮交互。
- 不显示标签、Tooltip、视觉映射或业务数据点。
- 不因窗口缩放重复注册地图或创建新的 ECharts 实例。
- 保留源文件中存在的全部几何，不宣称源数据包含独立命名的南海诸岛插图。

## 注册与生命周期

```text
assets/template/data-visualization/chinaMap.js
  -> src/utils/chinaMap.js
assets/template/data-visualization/useECharts.js
  -> src/composables/useECharts.js
```

在设置 option 前调用 `ensureChinaMapRegistered()`。该函数会懒加载两个资源、缓存正在进行的注册 Promise、避免重复注册，并在失败后清空 Promise 以允许重试。

使用 `createChinaMapOption()` 生成静态三层 option；使用 `useECharts()` 等待正尺寸、处理 resize，并在卸载时释放实例。

## 验收

- 两个来源资源的哈希和字节保持不变。
- 恰好渲染一个 `geo` 和两个 `map` series。
- 三层均为 `zlevel: 0`，`z` 稳定为 `0/1/2`。
- 默认模式下三层内边距一致，并省略 `layoutCenter/layoutSize`。
- 除非同步减小阴影几何，否则每侧至少保留 `64px`。
- 首次绘制后无动画循环、Interval、Timeout、数据刷新或 DOM 节点增长。
- 在 1920×1080、16:10 和 4:3 容器比例下检查台湾、香港、澳门、海南及源文件中的其他几何均可见。
