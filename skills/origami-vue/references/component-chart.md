---
title: 图表 (Chart)
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, data-display]
---

# 图表 (Chart)

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 需要可视化展示数据时，如折线图、柱状图、饼图、散点图等
- 基于 ECharts 封装，支持 `options` + `data` 双输入模式

## API 参考

### Chart Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 图表 id | `string` | `''` |
| width | 图表宽度，默认单位 px | `string` | `'50%'` |
| height | 图表高度，默认单位 px | `string` | `'240px'` |
| style | 图表额外样式 | `object` | `-` |
| title | 图表标题 | `string` | `''` |
| options | 图表配置项（ECharts 配置项 + 扩展参数） | `object` | `-` |
| data | 图表数据 | `array \| object` | `-` |

### Options 扩展参数（ECharts Options 之外）

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fontFamily | 图表字体 | `string` | `-` |
| xAxis.unit | x 坐标轴单位 | `string` | `-` |
| yAxis.unit | y 坐标轴单位 | `string` | `-` |
| legend.hide | 是否隐藏图例，默认图例大于1时显示，需定义 series 的 name 值 | `boolean` | `false` |
| legend.position | 图例位置 | `'top' \| 'bottom'` | `'bottom'` |
| tooltip.unit | tooltip 提示统一单位 | `string` | `-` |
| tooltip.titleBefore | tooltip 提示标题 name 前置内容 | `string` | `-` |
| tooltip.titleAfter | tooltip 提示标题 name 后置内容 | `string` | `-` |
| title.center | 标题是否居中显示，环状图中间展示文字时设置 | `boolean` | `false` |
| title.unit | 标题内容单位，标题内容跟单位大小不一致时设置 | `string` | `false` |

### Series 扩展参数（ECharts Series 之外）

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| line.dataKey | data 为对象时的 key 值，如果 data 为二维数组，将按顺序加载数据 | `string` | `-` |
| line.unit | tooltip 提示单位 | `string` | `-` |
| line.areaStyle.show | 是否显示 areaStyle | `boolean` | `false` |
| line.areaStyle.areaColor | 面积颜色不采用线条颜色时设置 | `string` | `-` |
| line.markArea.type | markArea 区间类型 | `'yAxis' \| 'xAxis'` | `'xAxis'` |
| line.markArea.color | markArea 区间颜色不采用线条颜色时设置 | `string` | `-` |
| pie.hideLable | 饼图是否隐藏 label 及 labelLine | `boolean` | `false` |
| scatter.bubble | 是否是气泡图 | `boolean` | `false` |
| scatter.itemStyle.colorOpacity | 气泡图背景透明度 | `string` | `'0.25'` |
| scatter.itemStyle.hideBorder | 气泡图是否隐藏边框 | `boolean` | `false` |
| gauge.gaugeType | 内置仪表盘类型 | `'half' \| 'centerCircle'` | `-` |

### Chart Slots

| 插槽名 | 说明 |
| --- | --- |
| titleRight | 图表标题右侧插槽内容 |

## 使用示例

### 正确用法

```vue
<!-- 折线图 -->
<ori-chart
  id="line-chart"
  title="趋势图"
  width="100%"
  height="300px"
  :options="lineOptions"
  :data="lineData"
/>

<script setup lang="ts">
const lineOptions = {
  xAxis: { type: 'category', unit: '月' },
  yAxis: { type: 'value', unit: '万元' },
  tooltip: { unit: '万元' },
  legend: { position: 'bottom' },
  series: [
    { type: 'line', name: '销售额', dataKey: 'sales' },
    { type: 'line', name: '利润', dataKey: 'profit' },
  ],
}

const lineData = [
  { name: '1月', sales: 120, profit: 30 },
  { name: '2月', sales: 200, profit: 50 },
  { name: '3月', sales: 150, profit: 40 },
]
</script>

<!-- 面积图 -->
<ori-chart
  :options="{
    series: [{
      type: 'line',
      name: '访问量',
      areaStyle: { show: true },
    }],
  }"
  :data="areaData"
/>

<!-- 饼图 + 标题居中 -->
<ori-chart
  title="占比分布"
  :options="{
    title: { center: true },
    series: [{ type: 'pie', name: '分类' }],
  }"
  :data="pieData"
/>

<!-- 仪表盘 -->
<ori-chart
  :options="{
    series: [{ type: 'gauge', gaugeType: 'half' }],
  }"
  :data="gaugeData"
/>

<!-- 标题右侧插槽 -->
<ori-chart title="数据概览" :options="chartOptions" :data="chartData">
  <template #titleRight>
    <ori-button size="small">导出</ori-button>
  </template>
</ori-chart>
```

### 常见错误

```vue
<!-- 错误：只传 options 不传 data -->
<ori-chart :options="chartOptions" />
<!-- options + data 双输入模式，data 是必需的数据源 -->

<!-- 错误：直接在 options.series.data 中写数据 -->
<ori-chart :options="{ series: [{ type: 'line', data: [1, 2, 3] }] }" />
<!-- 应使用 data prop 传入数据，通过 dataKey 映射 -->

<!-- 错误：legend.position 使用了 left/right -->
<ori-chart :options="{ legend: { position: 'left' } }" />
<!-- position 仅支持 top/bottom -->

<!-- 错误：width/height 传数字 -->
<ori-chart :width="300" :height="240" />
<!-- width/height 类型为 string，应传 width="300px" height="240px" -->
```

## 与其他组件库的差异

| 差异点 | origami-vue | ant-design-vue | element-plus |
| --- | --- | --- | --- |
| 底层引擎 | ECharts | 不内置图表 | 不内置图表 |
| 数据输入 | `options` + `data` 双输入 | - | - |
| 扩展参数 | 支持 unit、legend.position 等扩展 | - | - |
| 标题插槽 | `titleRight` 插槽 | - | - |
| 仪表盘类型 | `gaugeType` 内置 half/centerCircle | - | - |
