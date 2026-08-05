import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const frontendRoot = join(root, '..', 'frontend-engineering-standards')
const read = (path) => readFileSync(join(root, path), 'utf8')

function walk(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const next = join(path, entry.name)
    return entry.isDirectory() ? walk(next) : [next]
  })
}

const skill = read('SKILL.md')
const routedReferences = [...skill.matchAll(/`(references\/[^`]+\.md)`/g)].map(
  (match) => match[1],
)
assert(routedReferences.length >= 10, 'SKILL.md must route domain work by task')
routedReferences.forEach((path) => {
  assert(existsSync(join(root, path)), `missing routed reference: ${path}`)
})

assert(
  skill.includes('frontend-engineering-standards'),
  'big-screen skill must declare the frontend engineering baseline',
)
for (const marker of ['Vue CLI 5', 'Webpack', 'Jest', 'VUE_APP_', 'Yarn', 'svg-sprite-loader']) {
  assert(skill.includes(marker), `big-screen exception matrix must preserve ${marker}`)
}
assert(skill.includes('按任务加载'), 'big-screen references must be loaded by task')
assert(
  skill.includes('不要因为修改一个卡片就加载项目搭建'),
  'small visual tasks must not load unrelated engineering references',
)

const frontendSkill = readFileSync(join(frontendRoot, 'SKILL.md'), 'utf8')
const frontendBuild = readFileSync(
  join(frontendRoot, 'references', 'build-environment.md'),
  'utf8',
)
const frontendVite = readFileSync(join(frontendRoot, 'references', 'vite-config.md'), 'utf8')
const frontendTesting = readFileSync(
  join(frontendRoot, 'references', 'testing-standards.md'),
  'utf8',
)
assert(
  frontendSkill.includes('构建工具及大屏专属规则以专项技能为准'),
  'frontend baseline must delegate big-screen build rules',
)
assert(frontendVite.includes('只适用于明确采用 Vite'), 'Vite guidance must be opt-in')
assert(frontendTesting.includes('Jest'), 'common testing guidance must document the Jest exception')
assert(frontendSkill.includes('新项目默认 Yarn Classic 1.x'), 'frontend baseline must default to Yarn 1')
assert(frontendBuild.includes('新建的 Yarn Classic 项目'), 'common CI example must use Yarn 1')
assert(!frontendSkill.includes('新项目默认 Yarn 4'), 'frontend baseline must not default to Yarn 4')
assert(!skill.includes('新项目使用 Yarn 4'), 'big-screen skill must not default to Yarn 4')

const projectSetup = read('references/project-setup.md')
assert(!projectSetup.includes('nodeLinker: node-modules'), 'big-screen setup must not generate Yarn 4 linker config')
assert(
  projectSetup.includes('旧项目采用 `hooks/`、`store/` 或 `src/assets/style/`'),
  'legacy projects must not be forced through a directory migration',
)

const references = walk(join(root, 'references')).filter((path) => path.endsWith('.md'))
const untranslatedSentence = /^(?:#{1,6}\s+|[-*]\s+|\d+\.\s+)?(?:Use|Keep|Do not|When|The|Copy|Choose|Prefer|Avoid|Allow|Render|Preserve|Confirm|Clean|Put|Let|Make|Before|Only|This|These)\b/i
references.forEach((path) => {
  const prose = readFileSync(path, 'utf8').replace(/```[\s\S]*?```/g, '')
  const untranslatedLine = prose
    .split(/\r?\n/)
    .find((line) => !/[\u4e00-\u9fff]/.test(line) && untranslatedSentence.test(line))
  assert(
    !untranslatedLine,
    `${relative(root, path)} contains an untranslated English instruction`,
  )
  assert(
    !/^#{1,6}\s+[A-Za-z][A-Za-z /&-]*$/m.test(prose),
    `${relative(root, path)} contains a fully English heading`,
  )
})
const templates = walk(join(root, 'assets', 'template'))
const templateText = templates
  .filter((path) => /\.(js|vue|less)$/.test(path))
  .map((path) => readFileSync(path, 'utf8'))
  .join('\n')

templates.filter((path) => path.endsWith('.js')).forEach((path) => {
  const source = readFileSync(path, 'utf8')
  execFileSync(process.execPath, ['--check', path], { stdio: 'pipe' })
  assert(!/;\s*$/m.test(source), `${relative(root, path)} must use the no-semicolon template style`)
  assert(!/from\s+"/.test(source), `${relative(root, path)} must use single-quoted imports`)
})

for (const oldPath of [
  'assets/template/layout/use-scale.js',
  'assets/template/integrations/dt-engine.js',
  'assets/template/data-visualization/use-echarts.js',
  'assets/template/data-visualization/chart-options.js',
  'assets/template/data-visualization/chart-theme.js',
  'assets/template/data-visualization/china-map.js',
  'assets/template/modal/use-modal-lifecycle.js',
]) {
  assert(!existsSync(join(root, oldPath)), `obsolete template path remains: ${oldPath}`)
}

const vueConfig = read('assets/template/project/vue.config.js')
assert(vueConfig.includes('module.exports'), 'Vue CLI config must remain CommonJS')
assert(!vueConfig.includes('export default'), 'Vue CLI config must not use ESM export syntax')

for (const forbidden of [
  /origami-vue/i,
  /babel-plugin-import/i,
  /transition\s*:\s*all/i,
  /outline\s*:\s*none/i,
  /from\s+['"]vite['"]/i,
  /vite\.config/i,
  /\.(?:ts|tsx)\b/i,
  /withDefaults\s*\(/,
  /@\/hooks\//,
  /@\/store\//,
  /@\/assets\/style\//,
]) {
  assert(!forbidden.test(templateText), `new-project templates contain forbidden pattern ${forbidden}`)
}

const reusableStyles = [
  read('assets/template/data-visualization/data-tokens.less'),
  read('assets/template/data-visualization/data-display.less'),
  read('assets/template/data-visualization/modal.less'),
].join('\n')
assert(!/Alimama|HYQiHei|OPPOSans|\bDIN\b/i.test(reusableStyles), 'templates declare source-project fonts')

const documentedTemplatePaths = [...references, join(root, 'SKILL.md')]
  .flatMap((path) => [...readFileSync(path, 'utf8').matchAll(/`?(assets\/template\/[A-Za-z0-9_./-]+)`?/g)])
  .map((match) => match[1].replace(/[.,;:]$/, ''))
for (const path of new Set(documentedTemplatePaths)) {
  assert(existsSync(join(root, path)), `documented template path does not exist: ${path}`)
}

for (const resourcePath of [
  'assets/icons/svg',
  'assets/img/switch/switch-base.png',
  'assets/img/switch/switch-item-bg.png',
  'assets/img/decorations',
  'assets/map/china/china.json',
  'assets/map/china/china-map-outline.js',
]) {
  assert(existsSync(join(root, resourcePath)), `documented resource path does not exist: ${resourcePath}`)
}

const scale = read('assets/template/layout/useScale.js')
const scaleModuleUrl = `data:text/javascript;base64,${Buffer.from(
  scale.replace(
    /import \{[^}]+\} from ['"]vue['"]/,
    'const onBeforeUnmount=()=>{};const onMounted=()=>{};const shallowRef=(value)=>({value});const unref=(value)=>value?.value??value',
  ),
).toString('base64')}`
const { calculateCanvasScale } = await import(scaleModuleUrl)
assert.equal(calculateCanvasScale(1920, 1080), 1)
assert.equal(calculateCanvasScale(3840, 1080), 1)
assert.equal(calculateCanvasScale(960, 1080), 0.5)

const engine = read('assets/template/integrations/dtEngine.js')
assert(engine.includes('.finally(() =>'), 'engine pending state must reset after rejection')
assert(engine.includes('removeClickListener?.()'), 'engine listener must be removable')
assert(engine.includes('await current.dispose()'), 'engine owner must await disposal')

const modalLifecycle = read('assets/template/modal/useModalLifecycle.js')
assert(modalLifecycle.includes('entry.markReplaced()'), 'modal replacement must suppress stale focus restoration')
assert(modalLifecycle.includes('completeClose'), 'modal close completion must be centralized')

const modal = read('assets/template/modal/BaseModal.vue')
assert(modal.includes("@/composables/useModalLifecycle"), 'BaseModal import must use the canonical composables path')
assert(modal.includes('A titleless modal requires ariaLabel'), 'titleless modal warning is missing')

const chinaMap = read('assets/template/data-visualization/chinaMap.js')
assert(chinaMap.includes('const DEFAULT_SAFE_INSET = 64'), 'China map must reserve its shadow safe area')
assert(chinaMap.includes("layout.mode === 'legacy'"), 'China map must retain explicit legacy mode')

const request = read('assets/template/integrations/request.js')
assert(!/Toast|Modal|origami-vue/.test(request), 'request adapter must not depend on UI feedback')
assert(request.includes('Promise.reject(normalizeRequestError(error))'), 'request failures must reject Error')

const frontControl = read('assets/template/llm/frontControl.js')
assert(frontControl.includes('frontControl(payload, context = {})'), 'frontControl must accept explicit context')
assert(!frontControl.includes('window.location.reload'), 'frontControl must not force a page reload')
assert(!frontControl.includes("@/router"), 'frontControl must not import a global router')
assert(frontControl.includes("from './engineActions'"), 'frontControl engine service import is stale')
assert(frontControl.includes("from './pageSwitch'"), 'frontControl page-switch import is stale')

const mcp = read('assets/template/llm/mcp.js')
for (const literal of ['refresh', 'switchScene', 'navigate']) {
  assert(mcp.includes(`z.literal('${literal}')`), `MCP schema must use z.literal for ${literal}`)
}
assert(mcp.includes('z.coerce.number().int().nonnegative()'), 'scene index must be validated')

console.log(
  `validated ${routedReferences.length} routes, ${references.length} references, and ${templates.length} template files`,
)
