import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const themeSource = await readFile(join(root, "assets/template/data-visualization/chart-theme.js"), "utf8");
const themeUrl = `data:text/javascript;base64,${Buffer.from(themeSource).toString("base64")}`;
const optionSource = (await readFile(join(root, "assets/template/data-visualization/chart-options.js"), "utf8"))
  .replace('from "./chart-theme.js"', `from "${themeUrl}"`);
const optionUrl = `data:text/javascript;base64,${Buffer.from(optionSource).toString("base64")}`;
const {
  createComparisonOption,
  createCompositionOption,
  createGaugeOption,
  createTrendOption,
  mergeChartOption,
} = await import(optionUrl);

const trend = createTrendOption({ categories: ["Mon"], series: [{ name: "Load", data: [3] }], unit: "kW" });
assert.equal(trend.tooltip.valueFormatter(3), "3kW");
assert.equal(trend.tooltip.valueFormatter(null), "--");

const comparison = createComparisonOption({ categories: ["A"], series: [{ name: "Count", data: [0] }], unit: "台" });
assert.equal(comparison.tooltip.valueFormatter(0), "0台");
assert.equal(comparison.series[0].data[0], 0);

const composition = createCompositionOption({
  data: [
    { name: "valid", value: 10 },
    { name: "zero", value: 0 },
    { name: "negative", value: -2 },
    { name: "invalid", value: null },
  ],
  unit: "类",
  overrides: { title: { triggerEvent: true, left: "10%" } },
});
assert.deepEqual(composition.series[0].data.map((item) => item.value), [10, 0]);
assert.match(composition.title.text, /10/);
assert.equal(composition.title.triggerEvent, false);
assert.deepEqual(composition.title.left, composition.series[0].center[0]);
assert.equal(composition.title.textStyle.rich.value.fontSize, 22);

const geometryOverride = createCompositionOption({
  data: [{ name: "valid", value: 1 }],
  overrides: { series: [{ center: ["1%", "1%"] }] },
});
assert.deepEqual(geometryOverride.series[0].center, ["36%", "50%"]);

const longCenter = createCompositionOption({ data: [{ name: "x", value: 1 }], centerValue: "123456789" });
assert.equal(longCenter.title.textStyle.rich.value.fontSize, 18);

const gauge = createGaugeOption({ value: 150, min: 0, max: 100, unit: "%" });
assert.equal(gauge.series[0].data[0].value, 100);
assert.equal(gauge.series[0].detail.formatter(), "100%");

const base = { nested: { keep: true, value: 1 }, list: [1, 2] };
const override = { nested: { value: 2 }, list: [3] };
const merged = mergeChartOption(base, override);
assert.deepEqual(merged, { nested: { keep: true, value: 2 }, list: [3] });
assert.deepEqual(base, { nested: { keep: true, value: 1 }, list: [1, 2] });

console.log("chart option regression checks passed");
