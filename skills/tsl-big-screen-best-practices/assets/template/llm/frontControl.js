import { createEngineActions } from './engineActions'
import { normalizeSceneIndex, switchScene } from './pageSwitch'

const INTERNAL_PATH = /^\/(?!\/)[A-Za-z0-9/_-]*$/

function requireFunction(value, message) {
  if (typeof value !== 'function') throw new Error(message)
  return value
}

export async function frontControl(payload, context = {}) {
  if (!payload || typeof payload !== 'object') {
    throw new TypeError('frontControl payload must be an object')
  }

  const { type, params = {} } = payload
  const { meta, router, refreshData, onUnhandled } = context

  switch (type) {
    case 'refresh': {
      await createEngineActions(meta).resetScene()
      await requireFunction(refreshData, 'refreshData is required for refresh')()
      return { ok: true }
    }
    case 'switchScene': {
      const sceneIndex = normalizeSceneIndex(params.sceneIndex)
      await switchScene(meta, sceneIndex)
      return { ok: true, sceneIndex }
    }
    case 'navigate': {
      const path = params.path
      if (typeof path !== 'string' || !INTERNAL_PATH.test(path)) {
        throw new TypeError('path must be an internal application path')
      }
      await requireFunction(router?.push, 'router is required for navigate').call(router, path)
      return { ok: true, path }
    }
    default:
      return requireFunction(onUnhandled, `Unhandled front-control action: ${String(type)}`)(
        payload,
        context,
      )
  }
}
