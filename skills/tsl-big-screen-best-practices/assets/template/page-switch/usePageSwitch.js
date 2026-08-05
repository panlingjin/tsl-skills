import { shallowRef } from 'vue'
import { useAutoCloseTimer } from './useAutoCloseTimer'

export function usePageSwitch({ onSelect, autoCloseDelay = 5000 }) {
  const open = shallowRef(false)
  const busy = shallowRef(false)
  const { restart, stop } = useAutoCloseTimer(() => {
    open.value = false
  }, autoCloseDelay)

  function setOpen(value) {
    open.value = Boolean(value)
    if (open.value) restart()
    else stop()
  }

  async function select(sceneIndex) {
    if (busy.value) return
    busy.value = true
    try {
      await onSelect(sceneIndex)
      setOpen(false)
    } finally {
      busy.value = false
    }
  }

  return { open, busy, setOpen, select, restartAutoClose: restart }
}
