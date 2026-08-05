import { onBeforeUnmount } from 'vue'

export function useAutoCloseTimer(onTimeout, delay = 5000) {
  let timer = null

  function stop() {
    if (timer !== null) window.clearTimeout(timer)
    timer = null
  }

  function restart() {
    stop()
    timer = window.setTimeout(() => {
      timer = null
      onTimeout()
    }, delay)
  }

  onBeforeUnmount(stop)

  return { restart, stop }
}
