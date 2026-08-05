export function normalizeSceneIndex(value) {
  const sceneIndex = Number(value)
  if (!Number.isInteger(sceneIndex) || sceneIndex < 0) {
    throw new TypeError('sceneIndex must be a non-negative integer')
  }
  return sceneIndex
}

function requireUnity(meta) {
  if (typeof meta?.unity?.invoke !== 'function') {
    throw new Error('dt-engine Unity plugin is not initialized')
  }
  return meta.unity
}

export function fetchProjectList(meta) {
  return requireUnity(meta).invoke('GetProjectConfigs')
}

export async function switchScene(meta, value) {
  const sceneIndex = normalizeSceneIndex(value)
  await requireUnity(meta).invoke('SwitchProject', { SceneIndex: sceneIndex })
  return sceneIndex
}
