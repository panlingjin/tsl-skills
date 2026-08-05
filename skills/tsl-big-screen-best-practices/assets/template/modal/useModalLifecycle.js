import { nextTick, onBeforeUnmount, shallowRef, unref, watch } from 'vue'

const modalStack = []
let modalId = 0
let scrollLockCount = 0
let previousBodyOverflow = ''

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  "input:not([disabled]):not([type='hidden'])",
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(',')

function lockScroll() {
  if (typeof document === 'undefined') return

  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  scrollLockCount += 1
}

function unlockScroll() {
  if (typeof document === 'undefined' || scrollLockCount === 0) return

  scrollLockCount -= 1
  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow
    previousBodyOverflow = ''
  }
}

function removeFromStack(id) {
  const index = modalStack.findIndex((entry) => entry.id === id)
  if (index >= 0) modalStack.splice(index, 1)
}

function closeAndRemove(entry) {
  entry.markReplaced()
  removeFromStack(entry.id)
  entry.requestClose('replaced')
}

function registerModal(entry) {
  if (entry.layer === 'main') {
    [...modalStack]
      .reverse()
      .filter((item) => item.layer === 'confirm')
      .forEach(closeAndRemove)
  }

  const currentLayerEntry = [...modalStack]
    .reverse()
    .find((item) => item.layer === entry.layer)
  if (currentLayerEntry) {
    entry.setRestoreTarget(currentLayerEntry.getRestoreTarget())
    closeAndRemove(currentLayerEntry)
  }

  modalStack.push(entry)
}

function isTopmost(id) {
  return modalStack[modalStack.length - 1]?.id === id
}

function getFocusableElements(panel) {
  return [...panel.querySelectorAll(FOCUSABLE_SELECTOR)].filter((element) => {
    const style = window.getComputedStyle(element)
    return style.visibility !== 'hidden' && style.display !== 'none'
  })
}

export function useModalLifecycle({
  open,
  layer,
  busy,
  closeOnEsc,
  panelRef,
  requestClose,
}) {
  const id = ++modalId
  const previousFocus = shallowRef(null)
  let active = false
  let restoreAllowed = true
  let closeCompleted = false

  const focusInitialElement = async () => {
    await nextTick()
    const panel = unref(panelRef)
    if (!panel || !active) return

    const target = panel.querySelector('[autofocus]')
      ?? getFocusableElements(panel)[0]
      ?? panel
    target.focus({ preventScroll: true })
  }

  const restoreFocus = () => {
    const target = previousFocus.value
    previousFocus.value = null
    if (target?.isConnected && typeof target.focus === 'function') {
      target.focus({ preventScroll: true })
    }
  }

  const handleKeydown = (event) => {
    if (!isTopmost(id)) return

    if (event.key === 'Escape') {
      if (!unref(busy) && unref(closeOnEsc)) {
        event.preventDefault()
        requestClose('escape')
      }
      return
    }

    if (event.key !== 'Tab') return
    const panel = unref(panelRef)
    if (!panel) return

    const focusable = getFocusableElements(panel)
    if (focusable.length === 0) {
      event.preventDefault()
      panel.focus({ preventScroll: true })
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const current = document.activeElement

    if (event.shiftKey && (current === first || !panel.contains(current))) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && (current === last || !panel.contains(current))) {
      event.preventDefault()
      first.focus()
    }
  }

  const activate = () => {
    if (active || typeof document === 'undefined') return
    active = true
    restoreAllowed = true
    closeCompleted = false
    previousFocus.value = document.activeElement
    registerModal({
      id,
      layer: unref(layer),
      requestClose,
      markReplaced: () => { restoreAllowed = false; },
      getRestoreTarget: () => previousFocus.value,
      setRestoreTarget: (target) => { previousFocus.value = target; },
    })
    lockScroll()
    document.addEventListener('keydown', handleKeydown)
  }

  const deactivate = () => {
    if (!active) return

    active = false
    removeFromStack(id)
    unlockScroll()
    document.removeEventListener('keydown', handleKeydown)
  }

  const completeClose = () => {
    if (closeCompleted) return
    closeCompleted = true
    if (restoreAllowed) restoreFocus()
    else previousFocus.value = null
  }

  watch(
    () => unref(open),
    (isOpen) => {
      if (isOpen) activate()
      else deactivate()
    },
    { immediate: true, flush: 'post' },
  )

  onBeforeUnmount(() => {
    deactivate()
    completeClose()
  })

  return {
    focusInitialElement,
    completeClose,
  }
}
