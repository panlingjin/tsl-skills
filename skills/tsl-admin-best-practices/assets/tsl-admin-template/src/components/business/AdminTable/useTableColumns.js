import { computed, ref, watch } from 'vue'

/**
 * 返回列的稳定标识。
 * @param {Record<string, unknown>} column
 * @returns {string}
 */
function getColumnKey(column) {
  return column.key ?? column.dataIndex ?? column.prop ?? column.field ?? column.type ?? ''
}

function normalizeColumns(columns) {
  return columns.map((column) => ({
    ...column,
    dataIndex: column.dataIndex ?? column.prop ?? column.field,
    visible: column.visible !== false,
  }))
}

/**
 * 管理表格列的显示、固定和本地缓存状态。
 * @param {() => Array<Record<string, unknown>>} source
 * @param {import('vue').ComputedRef<string | undefined>} tableKey
 */
export function useTableColumns(source, tableKey) {
  const columns = ref([])
  const configurableColumns = computed(() =>
    columns.value.filter(
      (column) => column.dataIndex !== 'operate' && column.type !== 'checkbox',
    ),
  )
  const fixedColumns = computed(() =>
    configurableColumns.value.filter((column) => column.fixed === 'left'),
  )
  const otherColumns = computed(() =>
    configurableColumns.value.filter((column) => column.fixed !== 'left'),
  )
  const visibleColumns = computed(() =>
    columns.value.filter((column) => column.visible !== false),
  )
  const allChecked = computed(
    () =>
      configurableColumns.value.length > 0 &&
      configurableColumns.value.every((column) => column.visible !== false),
  )
  const indeterminate = computed(() => {
    const visibleCount = configurableColumns.value.filter(
      (column) => column.visible !== false,
    ).length
    return visibleCount > 0 && visibleCount < configurableColumns.value.length
  })

  function storageKey() {
    return tableKey.value ? `tsl-admin:table-columns:${tableKey.value}` : ''
  }

  function loadCache(nextColumns) {
    const key = storageKey()
    if (!key || typeof window === 'undefined') return nextColumns

    try {
      const cached = JSON.parse(localStorage.getItem(key) ?? '[]')
      if (!Array.isArray(cached)) return nextColumns

      return nextColumns.map((column) => {
        const hit = cached.find((item) => item.key === getColumnKey(column))
        return hit ? { ...column, fixed: hit.fixed, visible: hit.visible } : column
      })
    } catch {
      return nextColumns
    }
  }

  function saveCache() {
    const key = storageKey()
    if (!key || typeof window === 'undefined') return

    const value = columns.value.map((column) => ({
      key: getColumnKey(column),
      fixed: column.fixed,
      visible: column.visible !== false,
    }))
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // 隐私模式可能禁用 Storage；此时仅保留内存状态。
    }
  }

  function reset() {
    columns.value = loadCache(normalizeColumns(source()))
  }

  function setAllVisible(visible) {
    columns.value = columns.value.map((column) =>
      column.dataIndex === 'operate' || column.type === 'checkbox'
        ? column
        : { ...column, visible },
    )
    saveCache()
  }

  function setVisible(target, visible) {
    columns.value = columns.value.map((column) =>
      getColumnKey(column) === getColumnKey(target) ? { ...column, visible } : column,
    )
    saveCache()
  }

  function setFixed(target, fixed) {
    columns.value = columns.value.map((column) =>
      getColumnKey(column) === getColumnKey(target) ? { ...column, fixed } : column,
    )
    saveCache()
  }

  watch([source, tableKey], reset, { deep: true, immediate: true })

  return {
    allChecked,
    fixedColumns,
    getColumnKey,
    indeterminate,
    otherColumns,
    reset,
    setAllVisible,
    setFixed,
    setVisible,
    visibleColumns,
  }
}
