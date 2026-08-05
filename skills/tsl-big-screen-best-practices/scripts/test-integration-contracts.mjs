import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const asModuleUrl = (source) =>
  `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`

const requestSource = (
  await readFile(join(root, 'assets/template/integrations/request.js'), 'utf8')
).replace(
  "import axios from 'axios'",
  'const axios={create:()=>({interceptors:{response:{use:()=>{}}}})}',
)
const { normalizeRequestError, normalizeResponse } = await import(asModuleUrl(requestSource))

assert.deepEqual(normalizeResponse({ data: { code: 0, data: { value: 1 } } }), { value: 1 })
assert.deepEqual(normalizeResponse({ data: { value: 1 } }), { value: 1 })
assert.throws(
  () => normalizeResponse({ status: 200, data: { code: 500, message: 'failed' } }),
  (error) => error instanceof Error && error.message === 'failed' && error.code === 500,
)
const networkError = normalizeRequestError({
  message: 'fallback',
  response: { status: 503, data: { message: 'unavailable' } },
})
assert(networkError instanceof Error)
assert.equal(networkError.message, 'unavailable')
assert.equal(networkError.status, 503)

const pageSwitchSource = await readFile(
  join(root, 'assets/template/page-switch/pageSwitch.js'),
  'utf8',
)
const { normalizeSceneIndex } = await import(asModuleUrl(pageSwitchSource))
assert.equal(normalizeSceneIndex('2'), 2)
for (const invalid of [-1, 1.5, 'bad']) assert.throws(() => normalizeSceneIndex(invalid))

const calls = []
globalThis.__calls = calls
const frontControlSource = (
  await readFile(join(root, 'assets/template/llm/frontControl.js'), 'utf8')
)
  .replace(
    "import { createEngineActions } from './engineActions'",
    "const createEngineActions=()=>({resetScene:async()=>calls.push('reset')})",
  )
  .replace(
    "import { normalizeSceneIndex, switchScene } from './pageSwitch'",
    "const normalizeSceneIndex=(value)=>{const n=Number(value);if(!Number.isInteger(n)||n<0)throw new TypeError('invalid scene');return n};const switchScene=async(_meta,n)=>calls.push(['scene',n])",
  )
const { frontControl } = await import(asModuleUrl(`const calls=globalThis.__calls;${frontControlSource}`))

await frontControl(
  { type: 'refresh' },
  { meta: {}, refreshData: async () => calls.push('data') },
)
await frontControl({ type: 'switchScene', params: { sceneIndex: '3' } }, { meta: {} })
await frontControl(
  { type: 'navigate', params: { path: '/dashboard' } },
  { router: { push: async (path) => calls.push(['route', path]) } },
)
assert.deepEqual(calls, ['reset', 'data', ['scene', 3], ['route', '/dashboard']])
await assert.rejects(() => frontControl({ type: 'switchScene', params: { sceneIndex: -1 } }, { meta: {} }))
await assert.rejects(() => frontControl({ type: 'navigate', params: { path: 'https://example.com' } }, {}))
await assert.rejects(() => frontControl({ type: 'unknown' }, {}))

console.log('request, scene-index, and front-control contract checks passed')
