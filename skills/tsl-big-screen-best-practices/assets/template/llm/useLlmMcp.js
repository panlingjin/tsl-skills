import { onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { createFrontControlTool } from '@/services/mcp'

export function useLlmMcp({ registerTools, context }) {
  const ready = shallowRef(false)
  const error = shallowRef(null)
  let unregister = null
  let active = false

  async function dispose() {
    active = false
    ready.value = false
    const cleanup = unregister
    unregister = null
    await cleanup?.()
  }

  onMounted(async () => {
    active = true
    try {
      const cleanup = await registerTools([createFrontControlTool(context)])
      if (!active) {
        await cleanup?.()
        return
      }
      unregister = cleanup
      ready.value = true
    } catch (cause) {
      if (active) error.value = cause instanceof Error ? cause : new Error(String(cause))
    }
  })

  onBeforeUnmount(dispose)

  return { ready, error, dispose }
}
