import {
  CHART_TOKENS,
  DATA_PALETTE,
  createAreaGradient,
  createCategoryAxis,
  createChartGrid,
  createChartLegend,
  createChartTooltip,
  createValueAxis,
} from "./chart-theme.js";

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function cloneValue(value) {
  if (Array.isArray(value)) return value.map(cloneValue);
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneValue(item)]));
  }
  return value;
}

export function mergeChartOption(base, overrides = {}) {
  const result = cloneValue(base);
  if (!isPlainObject(overrides)) return result;

  Object.entries(overrides).forEach(([key, value]) => {
    if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = mergeChartOption(result[key], value);
      return;
    }
    result[key] = cloneValue(value);
  });

  return result;
}

function normalizeSeries(series) {
  if (!Array.isArray(series)) return [];
  return series.map((item) => {
    const entry = isPlainObject(item) ? item : {};
    return {
      name: entry.name || "",
      data: Array.isArray(entry.data) ? entry.data : [],
      color: entry.color,
    };
  });
}

function resolveColor(item, index) {
  return item.color || DATA_PALETTE[index % DATA_PALETTE.length];
}

function toFiniteNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function normalizePair(value, fallback) {
  return Array.isArray(value) && value.length === 2
    ? cloneValue(value)
    : cloneValue(fallback);
}

function formatTooltipValue(value, unit) {
  const numeric = toFiniteNumber(value);
  return numeric === null ? "--" : `${numeric}${unit}`;
}

function resolveCenterValueFontSize(value) {
  const length = String(value ?? "").length;
  if (length <= 4) return 22;
  if (length <= 7) return 20;
  return 18;
}

export function createTrendOption({
  categories = [],
  series = [],
  unit = "",
  smooth = true,
  area = true,
  overrides = {},
} = {}) {
  const normalized = normalizeSeries(series);
  const option = {
    color: normalized.map(resolveColor),
    tooltip: createChartTooltip("axis", {
      valueFormatter: (value) => formatTooltipValue(value, unit),
    }),
    legend: createChartLegend(normalized.length > 1),
    grid: createChartGrid(),
    xAxis: createCategoryAxis(categories, { boundaryGap: false }),
    yAxis: createValueAxis(unit),
    series: normalized.map((item, index) => {
      const color = resolveColor(item, index);
      return {
        name: item.name,
        type: "line",
        data: item.data,
        smooth,
        showSymbol: item.data.length <= 12,
        symbol: "circle",
        symbolSize: 6,
        connectNulls: false,
        lineStyle: { color, width: 2 },
        itemStyle: { color, borderColor: color, borderWidth: 1 },
        areaStyle: area ? { color: createAreaGradient(color) } : undefined,
        emphasis: { focus: "series" },
      };
    }),
  };

  return mergeChartOption(option, overrides);
}

export function createComparisonOption({
  categories = [],
  series = [],
  unit = "",
  direction = "vertical",
  stacked = false,
  showValue = false,
  overrides = {},
} = {}) {
  const normalized = normalizeSeries(series);
  const horizontal = direction === "horizontal";
  const categoryAxis = createCategoryAxis(categories, horizontal ? {
    axisLabel: {
      color: CHART_TOKENS.textMuted,
      fontSize: 12,
      width: 96,
      overflow: "truncate",
    },
  } : {});
  const valueAxis = createValueAxis(unit);
  const option = {
    color: normalized.map(resolveColor),
    tooltip: createChartTooltip("axis", {
      axisPointer: { type: "shadow" },
      valueFormatter: (value) => formatTooltipValue(value, unit),
    }),
    legend: createChartLegend(normalized.length > 1),
    grid: createChartGrid(horizontal ? { right: showValue ? 48 : 16 } : {}),
    xAxis: horizontal ? valueAxis : categoryAxis,
    yAxis: horizontal ? categoryAxis : valueAxis,
    series: normalized.map((item, index) => {
      const color = resolveColor(item, index);
      return {
        name: item.name,
        type: "bar",
        data: item.data,
        stack: stacked ? "total" : undefined,
        barMaxWidth: horizontal ? 12 : 18,
        itemStyle: {
          color,
          borderRadius: horizontal ? [0, 2, 2, 0] : [2, 2, 0, 0],
        },
        label: {
          show: showValue,
          position: horizontal ? "right" : "top",
          color: CHART_TOKENS.textSecondary,
          fontSize: 12,
        },
        emphasis: { focus: "series" },
      };
    }),
  };

  return mergeChartOption(option, overrides);
}

export function createCompositionOption({
  data = [],
  unit = "",
  centerLabel = "Total",
  centerValue,
  legendMode = "echarts",
  center,
  radius = ["56%", "76%"],
  overrides = {},
} = {}) {
  const actualLegendMode = legendMode === "external" ? "external" : "echarts";
  const actualCenter = normalizePair(
    center,
    actualLegendMode === "external" ? ["50%", "50%"] : ["36%", "50%"],
  );
  const actualRadius = normalizePair(radius, ["56%", "76%"]);
  const normalized = Array.isArray(data)
    ? data.map((item, index) => {
        const entry = isPlainObject(item) ? item : {};
        const numericValue = toFiniteNumber(entry.value);
        return {
          name: entry.name || "",
          value: numericValue,
          itemStyle: { color: entry.color || DATA_PALETTE[index % DATA_PALETTE.length] },
        };
      }).filter((item) => item.value !== null && item.value >= 0)
    : [];
  const computedTotal = normalized.length
    ? normalized.reduce((sum, item) => sum + item.value, 0)
    : "--";
  const displayValue = centerValue ?? computedTotal;
  const displayUnit = displayValue === "--" ? "" : unit;
  const centerValueFontSize = resolveCenterValueFontSize(displayValue);
  const option = {
    tooltip: createChartTooltip("item", { valueFormatter: (value) => `${value}${unit}` }),
    legend: createChartLegend(actualLegendMode === "echarts" && normalized.length > 0, {
      orient: "vertical",
      top: "center",
      right: 0,
      itemWidth: 8,
      itemHeight: 8,
    }),
    title: {
      triggerEvent: false,
      left: actualCenter[0],
      top: actualCenter[1],
      padding: 0,
      textAlign: "center",
      textVerticalAlign: "middle",
      text: `{value|${displayValue}}{unit|${displayUnit}}\n{label|${centerLabel}}`,
      textStyle: {
        rich: {
          value: {
            color: CHART_TOKENS.textPrimary,
            fontSize: centerValueFontSize,
            fontWeight: 600,
            lineHeight: 28,
          },
          unit: {
            color: CHART_TOKENS.textMuted,
            fontSize: 12,
            lineHeight: 28,
            padding: [4, 0, 0, 3],
          },
          label: {
            color: CHART_TOKENS.textSecondary,
            fontSize: 12,
            fontWeight: 400,
            lineHeight: 18,
          },
        },
      },
    },
    series: [
      {
        type: "pie",
        radius: actualRadius,
        center: actualCenter,
        avoidLabelOverlap: true,
        minAngle: 2,
        label: { show: false },
        labelLine: { show: false },
        emphasis: { scaleSize: 4 },
        data: normalized,
      },
    ],
  };

  const merged = mergeChartOption(option, overrides);

  // Geometry has a single source of truth. Keep center text and donut aligned
  // even when feature overrides replace nested title or series properties.
  const alignTitle = (title) => ({
    ...(isPlainObject(title) ? title : {}),
    triggerEvent: false,
    left: actualCenter[0],
    top: actualCenter[1],
    padding: 0,
    textAlign: "center",
    textVerticalAlign: "middle",
  });
  if (Array.isArray(merged.title)) {
    merged.title = merged.title.length
      ? merged.title.map((item, index) => (index === 0 ? alignTitle(item) : item))
      : merged.title;
  } else if (isPlainObject(merged.title)) {
    merged.title = alignTitle(merged.title);
  }
  if (Array.isArray(merged.series) && isPlainObject(merged.series[0])) {
    merged.series[0].center = cloneValue(actualCenter);
    merged.series[0].radius = cloneValue(actualRadius);
  }
  if (Array.isArray(merged.legend)) {
    merged.legend = merged.legend.map((item) => ({
      ...(isPlainObject(item) ? item : {}),
      show: actualLegendMode === "echarts" && normalized.length > 0,
    }));
  } else {
    merged.legend = {
      ...(isPlainObject(merged.legend) ? merged.legend : {}),
      show: actualLegendMode === "echarts" && normalized.length > 0,
    };
  }

  return merged;
}

export function createGaugeOption({
  value,
  min = 0,
  max = 100,
  unit = "%",
  name = "",
  thresholds = [
    { ratio: 0.6, color: "#45D8FD" },
    { ratio: 0.85, color: "#D8B283" },
    { ratio: 1, color: "#E78181" },
  ],
  overrides = {},
} = {}) {
  const parsedMin = toFiniteNumber(min);
  const parsedMax = toFiniteNumber(max);
  const parsedValue = toFiniteNumber(value);
  const numericMin = parsedMin ?? 0;
  const numericMax = parsedMax !== null && parsedMax > numericMin
    ? parsedMax
    : numericMin + 100;
  const numericValue = parsedValue ?? numericMin;
  const safeValue = Math.min(numericMax, Math.max(numericMin, numericValue));
  const displayValue = parsedValue === null ? "--" : safeValue;
  const axisColors = (Array.isArray(thresholds) ? thresholds : [])
    .map((item) => {
      const entry = isPlainObject(item) ? item : {};
      return [toFiniteNumber(entry.ratio), entry.color];
    })
    .filter(([ratio, color]) => ratio !== null && color)
    .map(([ratio, color]) => [Math.min(1, Math.max(0, ratio)), color])
    .sort((a, b) => a[0] - b[0]);
  if (!axisColors.length || axisColors[axisColors.length - 1][0] < 1) {
    axisColors.push([1, DATA_PALETTE[0]]);
  }
  const option = {
    series: [
      {
        type: "gauge",
        min: numericMin,
        max: numericMax,
        startAngle: 210,
        endAngle: -30,
        radius: "88%",
        center: ["50%", "56%"],
        progress: { show: true, width: 12, roundCap: true },
        itemStyle: { color: DATA_PALETTE[0] },
        axisLine: { lineStyle: { width: 12, color: axisColors } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: { show: false },
        anchor: { show: false },
        title: {
          offsetCenter: [0, "38%"],
          color: CHART_TOKENS.textSecondary,
          fontSize: 12,
        },
        detail: {
          offsetCenter: [0, "4%"],
          color: CHART_TOKENS.textPrimary,
          fontSize: 28,
          fontWeight: 600,
          formatter: () => (displayValue === "--" ? "--" : `${displayValue}${unit}`),
        },
        data: [{ value: safeValue, name }],
      },
    ],
  };

  return mergeChartOption(option, overrides);
}
