<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { Table as OriTable } from 'origami-vue'
import SvgIcon from '@/components/common/SvgIcon/SvgIcon.vue'
import { formatDate } from '@/utils/tools.js'
import TableColumnSettings from './TableColumnSettings.vue'
import { useTableColumns } from './useTableColumns.js'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  dataSource: {
    type: Array,
    default: () => [],
  },
  pagination: {
    type: Object,
    default: undefined,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hideRefresh: {
    type: Boolean,
    default: false,
  },
  hideColumnSettings: {
    type: Boolean,
    default: false,
  },
  tableKey: {
    type: String,
    default: undefined,
  },
  checkMethod: {
    type: Function,
    default: undefined,
  },
  selectedRows: {
    type: Array,
    default: () => [],
  },
  rowConfig: {
    type: Object,
    default: () => ({ keyField: 'id', isHover: true }),
  },
  isTree: {
    type: Boolean,
    default: false,
  },
  treeConfig: {
    type: Object,
    default: () => ({ rowField: 'id', parentField: 'parentId', transform: true }),
  },
  treeNode: {
    type: String,
    default: undefined,
  },
  options: {
    type: Object,
    default: () => ({ stripe: false, bordered: 'inner', size: 'mini' }),
  },
})

const emit = defineEmits(['refresh', 'checkChange'])

const table = ref(null)
const refreshing = ref(false)
const tableKey = computed(() => props.tableKey)
const {
  allChecked,
  fixedColumns,
  getColumnKey,
  indeterminate,
  otherColumns,
  reset: resetColumns,
  setAllVisible,
  setFixed,
  setVisible,
  visibleColumns,
} = useTableColumns(() => props.columns, tableKey)

const tablePagination = computed(() => {
  if (!props.pagination) return false

  return {
    showSizeChanger: true,
    showQuickJumper: true,
    ...props.pagination,
    async onChange(page, pageSize) {
      await props.pagination?.onChange?.(Math.max(page, 1), pageSize)
      await clearSelectionWhenMissing()
    },
    showTotal: props.pagination.showTotal ?? ((total) => `共 ${total} 条数据`),
  }
})

function refresh() {
  emit('refresh')
  refreshing.value = true
  window.setTimeout(() => {
    refreshing.value = false
  }, 500)
}

function getCellValue(row, column) {
  const value = column.dataIndex ? row[column.dataIndex] : undefined
  if (column.type === 'time') return formatDate(value)
  if (column.type === 'version') return value ? `V${String(value)}` : '-'
  if (column.type === 'address') {
    const location = row.location
    if (location && typeof location === 'object' && 'address' in location) {
      return String(location.address || '-')
    }
    return '-'
  }
  if (value === null || value === undefined || value === '') return '-'
  return `${String(value)}${column.unit ?? ''}`
}

function invokeTableMethod(name) {
  return table.value?.methods?.(name)?.()
}

function clearSelection() {
  invokeTableMethod('clearCheckboxRow')
}

function emitSelectedRows(checked) {
  emit('checkChange', invokeTableMethod('getCheckboxRecords') ?? [], checked)
}

async function clearSelectionWhenMissing() {
  if (!props.selectedRows.length) return
  await nextTick()

  const key = props.rowConfig.keyField ?? 'id'
  const hasSelectedRow = props.selectedRows.some((selected) =>
    props.dataSource.some((row) => row[key] === selected[key]),
  )
  if (!hasSelectedRow) clearSelection()
}

watch(
  () => props.dataSource,
  (rows) => {
    if (!props.pagination || rows.length > 0 || props.pagination.current <= 1) return
    props.pagination.onChange?.(
      props.pagination.current - 1,
      props.pagination.pageSize,
    )
  },
)

defineExpose({
  clearSelection,
  resetColumns,
})
</script>

<template>
  <div class="admin-table">
    <div class="table-header">
      <div class="table-search">
        <slot name="tableSearch" />
      </div>
      <div class="table-actions">
        <slot name="tableOperate" />
        <TableColumnSettings
          v-if="!hideColumnSettings"
          :all-checked="allChecked"
          :indeterminate="indeterminate"
          :fixed-columns="fixedColumns"
          :other-columns="otherColumns"
          :get-column-key="getColumnKey"
          @toggle-all="setAllVisible"
          @update-visible="setVisible"
          @update-fixed="setFixed"
        />
        <button
          v-if="!hideRefresh"
          class="table-icon-button refresh-button"
          type="button"
          aria-label="刷新表格"
          @click="refresh"
        >
          <SvgIcon name="refresh" size="16" :class="{ 'is-refreshing': refreshing }" />
        </button>
      </div>
    </div>

    <slot />

    <OriTable
      ref="table"
      :data-source="dataSource"
      :loading="loading"
      :size="options.size"
      :max-height="options.maxHeight"
      :stripe="options.stripe"
      :bordered="options.bordered"
      :pagination="tablePagination"
      :checkbox-config="{ checkMethod }"
      :row-config="rowConfig"
      :expand-config="options.expandConfig"
      :tree-config="isTree ? treeConfig : undefined"
      @checkbox-all="emitSelectedRows($event.checked)"
      @checkbox-change="emitSelectedRows($event.checked)"
    >
      <template v-for="column in visibleColumns" :key="getColumnKey(column)">
        <OriTable.column
          v-if="column.type === 'checkbox'"
          type="checkbox"
          :width="column.minWidth ?? column.width ?? 56"
          fixed="left"
        />

        <OriTable.column
          v-else-if="column.type === 'index'"
          type="seq"
          :title="column.title ?? column.label ?? '序号'"
          :width="column.minWidth ?? column.width ?? 72"
          :align="column.align"
          :fixed="column.fixed"
        />

        <OriTable.column
          v-else
          :data-index="column.dataIndex"
          :title="column.title ?? column.label"
          :align="column.align"
          :min-width="column.type === 'time' ? 170 : column.minWidth"
          :width="column.width"
          :fixed="column.dataIndex === 'operate' ? 'right' : column.fixed"
          :type="column.type === 'expand' || column.expandSlot ? 'expand' : undefined"
          :tree-node="column.dataIndex === treeNode"
          :sortable="column.sortable"
          :sort-by="column.sortBy"
          :filters="column.filters"
          :filter-method="column.filterMethod"
          :show-overflow="column.slotOverflow === false ? undefined : 'tooltip'"
          show-header-overflow="tooltip"
        >
          <template #default="{ row, column: tableColumn, rowIndex }">
            <slot
              v-if="column.slot"
              :name="column.slot"
              :row="row"
              :column="tableColumn"
              :row-index="rowIndex"
            />
            <span v-else>{{ getCellValue(row, column) }}</span>
          </template>
          <template v-if="column.expandSlot" #content="{ row, rowIndex }">
            <slot :name="column.expandSlot" :row="row" :row-index="rowIndex" />
          </template>
        </OriTable.column>
      </template>
    </OriTable>
  </div>
</template>

<style scoped lang="less" src="@/assets/styles/components/admin-table.less"></style>
