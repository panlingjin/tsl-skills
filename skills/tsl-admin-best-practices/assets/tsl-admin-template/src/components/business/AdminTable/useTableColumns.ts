import { computed, ref, watch, type ComputedRef } from 'vue'
import type { TableColumn, TableFixed } from './types'

interface ColumnCache {
  key: string
  fixed?: TableFixed
  visible: boolean
}

function getColumnKey(column: TableColumn) {
  return column.key ?? column.dataIndex ?? column.prop ?? column.field ?? column.type ?? ''
}

function normalizeColumns(columns: TableColumn[]) {
  return columns.map((column) => ({
    ...column,
    dataIndex: column.dataIndex ?? column.prop ?? column.field,
    visible: column.visible !== false,
  }))
}

export function useTableColumns(
  source: () => TableColumn[],
  tableKey: ComputedRef<string | undefined>,
) {
  const columns = ref<TableColumn[]>([])
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

  function loadCache(nextColumns: TableColumn[]) {
    const key = storageKey()
    if (!key || typeof window === 'undefined') return nextColumns

    try {
      const cached = JSON.parse(localStorage.getItem(key) ?? '[]') as ColumnCache[]
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

    const value: ColumnCache[] = columns.value.map((column) => ({
      key: getColumnKey(column),
      fixed: column.fixed,
      visible: column.visible !== false,
    }))
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage may be unavailable in privacy mode; the table remains functional in memory.
    }
  }

  function reset() {
    columns.value = loadCache(normalizeColumns(source()))
  }

  function setAllVisible(visible: boolean) {
    columns.value = columns.value.map((column) =>
      column.dataIndex === 'operate' || column.type === 'checkbox'
        ? column
        : { ...column, visible },
    )
    saveCache()
  }

  function setVisible(target: TableColumn, visible: boolean) {
    columns.value = columns.value.map((column) =>
      getColumnKey(column) === getColumnKey(target) ? { ...column, visible } : column,
    )
    saveCache()
  }

  function setFixed(target: TableColumn, fixed?: TableFixed) {
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
