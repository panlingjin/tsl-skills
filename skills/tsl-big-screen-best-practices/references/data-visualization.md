# 数据可视化

## 目录

- [从业务问题出发](#从业务问题出发)
- [展示选择矩阵](#展示选择矩阵)
- [选择与降级规则](#选择与降级规则)
- [通用数据状态](#通用数据状态)
- [图表模板](#图表模板)
- [图表约定](#图表约定)
- [组合图与环图](#组合图与环图)
- [仪表盘](#仪表盘gauge)
- [表格列表与时间线](#表格列表与时间线)
- [静态中国地图](#静态中国地图)
- [Vue 使用方式](#vue-使用方式)
- [可访问性与验收](#可访问性与验收)

## 从业务问题出发

先明确用户需要回答的问题，再选择展示形式，不要只根据字段类型选图。

实现前确认：

- 比较、趋势、构成、分布、排序还是状态？
- 用户需要看到精确值、相对变化还是异常？
- 数据更新时间、单位、有效范围和空值语义是什么？
- 展示是被动轮播，还是允许筛选、下钻和操作？

数字、短列表或一句话能更快回答时，不使用图表。

## 展示选择矩阵

| 问题 | 推荐展示 | 避免 |
| --- | --- | --- |
| 单个核心值 | KPI / Counter | 单数据点折线图 |
| 随时间变化 | 折线图、面积图 | 无时间顺序的饼图 |
| 分类比较 | 柱状图、条形图 | 类别过多的环图 |
| 少量部分占整体 | 环图 | 总和无意义的数据 |
| 排名 | 横向条形图、排行列表 | 难比较角度的饼图 |
| 当前进度或阈值 | Gauge、进度条 | 缺少上下限的仪表盘 |
| 多字段精确记录 | 表格 | 标签拥挤的图表 |
| 有顺序的事件 | 时间线 | 普通无序列表 |
| 空间位置 | 地图、场景 POI | 没有空间语义的数据 |

## 选择与降级规则

- KPI 组保留 `2–6` 个主值，次要值移入紧凑列表。
- 环图默认不超过 `6` 类；更多类别合并为“其他”或改用条形图。
- 折线图的序列数和采样点必须保证标签与趋势可读。
- 数据过密时先聚合、采样或分页，不靠缩小字号解决。
- 图表在窄卡片中无法读懂时，降级为排行、列表或 KPI。
- 单位在标题、轴或 Tooltip 中只表达一次，避免重复。
- `0` 是有效数据；只有缺失、非法或不可用数据显示 `--`。

## 通用数据状态

每个数据区域必须区分：

- Loading：保留稳定高度，避免布局跳动。
- Empty：说明当前条件下无数据，不伪造默认值。
- Error：提供可理解的错误状态和适当重试入口。
- Stale：保留最后有效值，同时明确数据已过期。
- Ready：显示数据时间、单位或必要上下文。

请求错误由业务层决定如何展示，ECharts option builder 不请求 API、不弹 Toast、不修改 Store。

## 图表模板

```text
assets/template/data-visualization/chartTheme.js
  -> src/utils/chartTheme.js
assets/template/data-visualization/chartOptions.js
  -> src/utils/chartOptions.js
assets/template/data-visualization/useECharts.js
  -> src/composables/useECharts.js
assets/template/data-visualization/data-tokens.less
  -> src/assets/styles/data-tokens.less
assets/template/data-visualization/data-display.less
  -> src/assets/styles/data-display.less
```

- `chartTheme.js` 保存颜色、Grid、Tooltip、Legend 和轴的稳定默认值。
- `chartOptions.js` 将已归一化数据转换为 option，并允许受控 overrides。
- `useECharts.js` 负责正尺寸初始化、更新、ResizeObserver、窗口 resize 和释放。
- 业务组件负责 DOM ref、状态展示、单位、阈值和交互。

模板只提供趋势、比较、构成和 Gauge 等稳定构建器。雷达图、热力图、混合柱线图和业务地图应在功能模块中按实际量纲与语义实现。

## 图表约定

### 颜色

- 优先沿用维护项目主题。
- 默认蓝青色系列用于普通数据，金色只用于选中或明确强调状态。
- 同一语义在同一屏幕保持同色。
- 不让相邻系列仅依靠相近色相区分；必要时增加线型、图标或文字。

### 坐标轴与网格（Grid）

- 轴标签不得与单位、Legend 或卡片边缘重叠。
- 横向长标签优先使用条形图；需要旋转时保持可读角度。
- Grid 必须为 Tooltip、轴名和最末标签留出空间。
- 不显示没有解释价值的密集网格线和刻度线。

### 提示框与图例（Tooltip / Legend）

- Tooltip 显示系列名、格式化值和单位，并正确处理 `0` 与空值。
- ECharts 完整控制图表与 Legend 时使用 `legendMode: 'echarts'`。
- 需要独立数值或百分比列时使用 `legendMode: 'external'`，不得同时渲染两套 Legend。
- Legend 过多时改用分页、滚动或列表，不把文字压缩到不可读。

### 动效

- 首次加载使用克制的入场动效，实时更新避免每次从零播放。
- 高频数据更新优先关闭动画或降低更新频率。
- `prefers-reduced-motion` 下关闭非必要图表动画。

## 组合图与环图

- 环图数据只接受有限非负数，过滤负数和非法值，保留 `0`。
- 中心总值由有效数据计算，显示值过长时降低字号。
- 中心标题与 series 使用相同 center，不能被 overrides 分离。
- 外部 Legend 模式默认把圆心放在容器中央。
- 总和无意义或类别差异难比较时改用条形图。

## 仪表盘（Gauge）

- 明确 `min`、`max`、单位和阈值含义。
- 显示值限制在有效范围内，但业务层仍应识别越界来源。
- 阈值颜色按比例递增排序，并配合文字说明。
- 只有一个值且无需阈值语义时优先使用 KPI。

## 表格、列表与时间线

- 表格 Header 固定，Body 作为局部滚动区；不让整个侧栏滚动。
- 数字右对齐，文本左对齐，状态列保持短且稳定。
- 行数超过高度预算时分页、轮播或限制条目，并展示当前页或总数。
- 被动滚动必须可暂停，Hover、Focus 或 reduced-motion 时停止。
- 时间线只用于存在真实顺序或时间关系的数据。

## 静态中国地图

雅安风格静态全国底图读取 `china-map.md` 并使用 `chinaMap.js`。该模板不接收业务数据，不得用于热力、迁徙、区域统计或地图下钻。

## Vue 使用方式

```vue
<script setup>
import { computed, shallowRef } from 'vue'
import { createCompositionOption } from '@/utils/chartOptions'
import { useECharts } from '@/composables/useECharts'

const props = defineProps({
  data: { type: Array, default: () => [] },
})

const chartRef = shallowRef(null)
const option = computed(() =>
  createCompositionOption({
    data: props.data,
    legendMode: 'external',
  }),
)

useECharts(chartRef, option)
</script>
```

组件隐藏、Tab 切换、Drawer 动画或异步加载时，必须等待容器有正尺寸再初始化。每个组件只拥有一个 ECharts 实例，并在卸载时释放。

## 可访问性与验收

- 图表旁提供标题、单位和必要的文字摘要。
- 颜色编码同时使用 Legend、标签、图标或文字表达。
- Tooltip 不能承载唯一的必要信息。
- Canvas 内容需要可访问替代时提供简短摘要或数据表。
- 检查 Loading、Empty、Error、Stale、全零、超长标签和极端值。
- 检查 1920×1080、16:10、4:3 以及侧栏实际宽度下的标签和 Tooltip。
- 验证更新和卸载后没有重复 Canvas、ResizeObserver 或事件监听器。
