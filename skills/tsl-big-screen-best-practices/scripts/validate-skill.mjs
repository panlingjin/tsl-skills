import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(root, path), "utf8");

function walk(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const next = join(path, entry.name);
    return entry.isDirectory() ? walk(next) : [next];
  });
}

const skill = read("SKILL.md");
const routedReferences = [...skill.matchAll(/`(references\/[^`]+\.md)`/g)].map((match) => match[1]);
assert(routedReferences.length >= 10, "SKILL.md must route domain work to references");
routedReferences.forEach((path) => assert(existsSync(join(root, path)), `missing routed reference: ${path}`));

const references = walk(join(root, "references")).filter((path) => path.endsWith(".md"));
references.forEach((path) => {
  const source = readFileSync(path, "utf8");
  const lineCount = source.split(/\r?\n/).length;
  if (lineCount > 100) {
    assert(
      /^## (目录|Contents)$/m.test(source),
      `${relative(root, path)} needs a 目录/Contents section`,
    );
  }
});

const templates = walk(join(root, "assets", "template"));
templates.filter((path) => path.endsWith(".js")).forEach((path) => {
  execFileSync(process.execPath, ["--check", path], { stdio: "pipe" });
});

const forbiddenFonts = /Alimama|HYQiHei|OPPOSans|\bDIN\b/i;
const reusableStyles = [
  read("assets/template/data-visualization/data-tokens.less"),
  read("assets/template/data-visualization/data-display.less"),
  read("assets/template/data-visualization/modal.less"),
].join("\n");
assert(!forbiddenFonts.test(reusableStyles), "reusable templates must not declare source-project fonts");

const scale = read("assets/template/layout/use-scale.js");
const scaleModuleUrl = `data:text/javascript;base64,${Buffer.from(
  scale.replace(
    'import { onBeforeUnmount, onMounted, shallowRef, unref } from "vue";',
    "const onBeforeUnmount=()=>{};const onMounted=()=>{};const shallowRef=(value)=>({value});const unref=(value)=>value?.value??value;",
  ),
).toString("base64")}`;
const { calculateCanvasScale } = await import(scaleModuleUrl);
assert.equal(calculateCanvasScale(1920, 1080), 1);
assert.equal(calculateCanvasScale(3840, 1080), 1);
assert.equal(calculateCanvasScale(960, 1080), 0.5);

const engine = read("assets/template/integrations/dt-engine.js");
assert(engine.includes(".finally(() =>"), "engine pending state must reset after rejection");
assert(engine.includes("removeClickListener?.()"), "engine listener must be removable");
assert(engine.includes("await current.dispose()"), "engine owner must await disposal");

const modalLifecycle = read("assets/template/modal/use-modal-lifecycle.js");
assert(modalLifecycle.includes("entry.markReplaced()"), "modal replacement must suppress stale focus restoration");
assert(modalLifecycle.includes("completeClose"), "modal close completion must be centralized");

const modal = read("assets/template/modal/BaseModal.vue");
assert(modal.includes("A titleless modal requires ariaLabel"), "titleless modal warning is missing");
assert(modal.includes("completeClose();"), "BaseModal must delegate focus completion");

const chinaMap = read("assets/template/data-visualization/china-map.js");
assert(chinaMap.includes("const DEFAULT_SAFE_INSET = 64"), "China map must reserve its shadow safe area");
assert(chinaMap.includes('layout.mode === "legacy"'), "China map must retain explicit legacy mode");
assert(chinaMap.includes("top: resolveDimension(layout.top, inset)"), "China map must use fit-box layout");

const vuePatterns = read("references/vue-patterns.md");
const projectSetup = read("references/project-setup.md");
assert(
  vuePatterns.includes("createWebHistory(process.env.BASE_URL)"),
  "Vue Router must use HTML5 history mode with the compiled base URL",
);
assert(!vuePatterns.includes("createWebHashHistory"), "hash routing must not become the default");
assert(projectSetup.includes('publicPath: "/"'), "history mode requires an absolute publicPath baseline");
assert(vuePatterns.includes("try_files $uri $uri/ /index.html;"), "history mode must document SPA fallback");

const pageSwitch = read("references/page-switch.md");
const sourceArchitecture = read("references/source-architecture.md");
assert(pageSwitch.includes("position: absolute"), "Page Switch must stay inside the scaled root");
assert(pageSwitch.includes("setTimeout"), "Page Switch auto-close must be one-shot");
assert(
  pageSwitch.includes("must not be copied, imported, or rendered"),
  "legacy switch-icon.png must be explicitly prohibited",
);
[
  "--page-switch-text-color",
  "--page-switch-muted-color",
  "--page-switch-active-color",
  "--page-switch-item-background",
  "--page-switch-active-background",
].forEach((token) => assert(pageSwitch.includes(token), `missing Page Switch theme token: ${token}`));
assert(
  !sourceArchitecture.includes("assets/img/switch/*.png"),
  "Page Switch assets must be copied explicitly so the legacy icon is excluded",
);

console.log(`validated ${routedReferences.length} routes, ${references.length} references, and ${templates.length} template files`);
