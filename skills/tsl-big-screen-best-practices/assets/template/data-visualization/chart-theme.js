export const DATA_PALETTE = Object.freeze([
  "#45D8FD",
  "#78D2D6",
  "#6AA2D4",
  "#84CDB0",
  "#D8B283",
  "#E78181",
  "#A38ECE",
]);

export const CHART_TOKENS = Object.freeze({
  textPrimary: "#F2F3F5",
  textSecondary: "#E5E6EB",
  textMuted: "#C9CDD4",
  axis: "rgba(143, 181, 197, 0.3)",
  gridLine: "rgba(143, 181, 197, 0.1)",
  tooltipBackground: "rgba(0, 8, 16, 0.88)",
  tooltipBorder: "rgba(143, 181, 197, 0.3)",
  active: "#E5C569",
});

export function createChartGrid(overrides = {}) {
  return {
    top: 40,
    right: 16,
    bottom: 8,
    left: 8,
    containLabel: true,
    ...overrides,
  };
}

export function createChartTooltip(trigger = "axis", overrides = {}) {
  return {
    trigger,
    backgroundColor: CHART_TOKENS.tooltipBackground,
    borderColor: CHART_TOKENS.tooltipBorder,
    borderWidth: 1,
    padding: 10,
    textStyle: {
      color: CHART_TOKENS.textPrimary,
      fontSize: 12,
    },
    ...overrides,
  };
}

export function createChartLegend(show = true, overrides = {}) {
  return {
    show,
    top: 0,
    right: 0,
    itemWidth: 16,
    itemHeight: 4,
    itemGap: 16,
    textStyle: {
      color: CHART_TOKENS.textSecondary,
      fontSize: 12,
    },
    ...overrides,
  };
}

export function createCategoryAxis(data = [], overrides = {}) {
  return {
    type: "category",
    data: Array.isArray(data) ? data : [],
    axisTick: { show: false },
    axisLine: { lineStyle: { color: CHART_TOKENS.axis } },
    axisLabel: {
      color: CHART_TOKENS.textMuted,
      fontSize: 12,
      hideOverlap: true,
    },
    splitLine: { show: false },
    ...overrides,
  };
}

export function createValueAxis(unit = "", overrides = {}) {
  return {
    type: "value",
    name: unit,
    nameTextStyle: {
      color: CHART_TOKENS.textMuted,
      fontSize: 12,
      padding: [0, 0, 0, 4],
    },
    axisTick: { show: false },
    axisLine: { show: false },
    axisLabel: {
      color: CHART_TOKENS.textMuted,
      fontSize: 12,
    },
    splitLine: {
      show: true,
      lineStyle: { color: CHART_TOKENS.gridLine },
    },
    ...overrides,
  };
}

export function createAreaGradient(color) {
  return {
    type: "linear",
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: `${color}4D` },
      { offset: 1, color: `${color}08` },
    ],
  };
}
