function requireMeta(meta) {
  if (typeof meta?.unity?.invoke !== 'function') {
    throw new Error('dt-engine Unity plugin is not initialized')
  }
  return meta
}

export function createEngineActions(meta) {
  const engine = requireMeta(meta)

  return {
    resetScene() {
      return engine.unity.invoke('ResetScene')
    },

    changeScene(name, options = {}) {
      if (!name) throw new Error('scene name is required')
      return engine.unity.invoke('ChangeState', {
        Name: name,
        IsNeedMergeBuilding: Boolean(options.mergeBuilding),
      })
    },
  }
}
