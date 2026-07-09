<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { Table as OriTable, Dropdown as OriDropdown, Checkbox as OriCheckbox } from 'origami-vue'
import SvgIcon from '@/components/svg-icon'
import { formatDate } from '@/utils/tool'

const props = defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  dataSource: {
    type: Array,
    default: () => []
  },
  pagination: Object,
  loading: Boolean,
  noRefresh: Boolean,
  noColsSetting: Boolean,
  tableKey: String,
  checkMethod: Function,
  checkRowKeys: {
    type: Array,
    default: () => []
  },
  selectList: Array,
  rowConfig: {
    type: Object,
    default: () => ({ keyField: 'id', isHover: true })
  },
  expandRowKeys: {
    type: Array,
    default: () => []
  },
  isTree: Boolean,
  treeConfig: {
    type: Object,
    default: () => ({
      rowField: 'id',
      parentField: 'parentId',
      transform: true
    })
  },
  treeNode: String,
  options: {
    type: Object,
    default: () => ({
      stripe: false,
      bordered: 'default',
      size: 'small',
      maxHeight: '',
      lazy: false,
      expandConfig: {},
      treeConfig: {}
    })
  }
})

const emit = defineEmits(['refresh', 'checkChange', 'filterChange'])

const customTable = ref(null)
const columnState = ref([])
const isClicked = ref(false)

const toggleableColumns = computed(() =>
  columnState.value.filter((column) => column.dataIndex !== 'operate' && column.type !== 'checkbox')
)

const fixedCols = computed(() =>
  toggleableColumns.value.filter((column) => column.fixed === 'left')
)

const otherCols = computed(() =>
  toggleableColumns.value.filter((column) => column.fixed !== 'left')
)

const currCols = computed(() => columnState.value.filter((column) => column.visible !== false))

const isCheckAll = computed({
  get() {
    return toggleableColumns.value.length > 0 && toggleableColumns.value.every((column) => column.visible !== false)
  },
  set(value) {
    checkAllChange(value)
  }
})

const checkIndeterminate = computed(() => {
  const visibleCount = toggleableColumns.value.filter((column) => column.visible !== false).length
  return visibleCount > 0 && visibleCount < toggleableColumns.value.length
})

const tablePagination = computed(() => {
  if (!props.pagination) return false
  return {
    showSizeChanger: true,
    showQuickJumper: true,
    ...props.pagination,
    onChange: async (page, pageSize) => {
      const safePage = page <= 0 ? 1 : page
      await props.pagination.onChange?.(safePage, pageSize)
      clearSelectionWhenMissing()
    },
    showTotal: (total) => ` 共 ${total} 项数据`
  }
})

function getColumnKey(column) {
  return column.dataIndex || column.prop || column.field || column.type
}

function normalizeColumns(columns) {
  return columns.map((column) => ({
    ...column,
    dataIndex: column.dataIndex || column.prop || column.field,
    visible: column.visible !== false
  }))
}

function cacheKey() {
  return props.tableKey ? `tacos-table-columns:${props.tableKey}` : ''
}

function loadColumnCache(columns) {
  const key = cacheKey()
  if (!key) return columns

  try {
    const cached = JSON.parse(localStorage.getItem(key) || '[]')
    if (!Array.isArray(cached) || !cached.length) return columns
    return columns.map((column) => {
      const hit = cached.find((item) => item.key === getColumnKey(column))
      return hit ? { ...column, fixed: hit.fixed, visible: hit.visible } : column
    })
  } catch {
    return columns
  }
}

function setColCache() {
  const key = cacheKey()
  if (!key) return
  const cacheValue = columnState.value.map((column) => ({
    key: getColumnKey(column),
    fixed: column.fixed,
    visible: column.visible
  }))
  localStorage.setItem(key, JSON.stringify(cacheValue))
}

function initTable() {
  columnState.value = loadColumnCache(normalizeColumns(props.columns))
}

function checkAllChange(value) {
  columnState.value = columnState.value.map((column) => {
    if (column.dataIndex === 'operate' || column.type === 'checkbox') return column
    return { ...column, visible: value }
  })
  setColCache()
}

function setColumnVisible(target, value) {
  columnState.value = columnState.value.map((column) =>
    getColumnKey(column) === getColumnKey(target) ? { ...column, visible: value } : column
  )
  setColCache()
}

function setColumnFixed(target, fixed) {
  columnState.value = columnState.value.map((column) =>
    getColumnKey(column) === getColumnKey(target) ? { ...column, fixed } : column
  )
  setColCache()
}

function refresh() {
  emit('refresh')
  isClicked.value = true
  window.setTimeout(() => {
    isClicked.value = false
  }, 500)
}

function getCellValue(row, column) {
  const value = row[column.dataIndex]
  if (column.type === 'time') return formatDate(value)
  if (column.type === 'version') return value ? `V${value}` : '-'
  if (column.type === 'address') return row.location?.address || '-'
  if (value === null || value === undefined || value === '') return '-'
  return `${value}${column.unit || ''}`
}

function tableMethods(name) {
  return customTable.value?.methods?.(name)?.()
}

function clearSelectEvent() {
  tableMethods('clearCheckboxRow')
}

function emitSelectedRows(checked) {
  const records = tableMethods('getCheckboxRecords') || []
  emit('checkChange', records, checked)
}

async function clearSelectionWhenMissing() {
  if (!props.selectList?.length) return
  await nextTick()
  const key = props.rowConfig.keyField || 'id'
  const hasSelectedRow = props.selectList.some((item) =>
    props.dataSource.some((row) => row[key] === item[key])
  )
  if (!hasSelectedRow) clearSelectEvent()
}

function handleFilterChange(value) {
  emit('filterChange', value)
}

onMounted(initTable)

watch(
  () => props.columns,
  () => initTable(),
  { deep: true }
)

watch(
  () => props.dataSource,
  (value) => {
    if (!props.pagination) return
    if (props.pagination.current > 1 && value.length === 0) {
      props.pagination.onChange?.(props.pagination.current - 1, props.pagination.pageSize)
    }
  }
)

defineExpose({
  clearSelectEvent,
  initTable
})
</script>

<template>
  <div class="custom-table-wrap">
    <div class="tabel-header-box flex-js-as">
      <div class="table-search" :style="noRefresh && noColsSetting ? { marginBottom: '16px' } : {}">
        <slot name="tableSearch" />
      </div>
      <div class="table-operate flex-c-c">
        <slot name="tableOperate" />
        <OriDropdown v-if="!noColsSetting" trigger="click">
          <div class="oprate-icon-box">
            <SvgIcon icon-class="icon_settings" size="16" />
          </div>

          <template #overlay>
            <div class="clos-setting">
              <div class="base-filter-item">
                <div class="desc">选择表格显示列</div>
                <div class="check-col">
                  <OriCheckbox
                    v-model="isCheckAll"
                    :indeterminate="checkIndeterminate"
                    label="全部"
                  />
                </div>
              </div>

              <div v-if="fixedCols.length" class="base-filter-item">
                <div v-for="fixedCol in fixedCols" :key="getColumnKey(fixedCol)" class="check-col">
                  <OriCheckbox
                    :model-value="fixedCol.visible !== false"
                    :label="fixedCol.title || fixedCol.label"
                    @change="(value) => setColumnVisible(fixedCol, value)"
                  />
                  <SvgIcon icon-class="icon_no_top" size="16" @click="setColumnFixed(fixedCol)" />
                </div>
              </div>

              <div v-if="otherCols.length" class="base-filter-item">
                <div v-for="otherCol in otherCols" :key="getColumnKey(otherCol)" class="check-col">
                  <OriCheckbox
                    :model-value="otherCol.visible !== false"
                    :label="otherCol.title || otherCol.label"
                    @change="(value) => setColumnVisible(otherCol, value)"
                  />
                  <SvgIcon icon-class="icon_top" size="16" @click="setColumnFixed(otherCol, 'left')" />
                </div>
              </div>
            </div>
          </template>
        </OriDropdown>
        <div v-if="!noRefresh" class="oprate-icon-box mr-lt-8" @click="refresh">
          <SvgIcon icon-class="icon_refresh" size="16" :class="{ refreshAnimation: isClicked }" />
        </div>
      </div>
    </div>

    <slot />

    <OriTable
      ref="customTable"
      :data-source="dataSource"
      :loading="loading"
      :size="options.size"
      :max-height="options.maxHeight"
      :stripe="options.stripe"
      :bordered="options.bordered"
      :lazy="options.lazy"
      :pagination="tablePagination"
      show-header-overflow="tooltip"
      :checkbox-config="{ checkMethod, checkRowKeys, reserve: true }"
      :row-config="rowConfig"
      :expand-config="{ ...options.expandConfig, expandRowKeys }"
      :tree-config="isTree ? { ...treeConfig, ...options.treeConfig } : null"
      :column-config="{ resizable: true }"
      @checkbox-all="({ checked }) => emitSelectedRows(checked)"
      @checkbox-change="({ checked }) => emitSelectedRows(checked)"
      @filter-change="handleFilterChange"
    >
      <template v-for="column in currCols" :key="getColumnKey(column)">
        <OriTable.column
          v-if="column.type === 'checkbox'"
          type="checkbox"
          :width="column.minWidth || column.width || 65"
          fixed="left"
        />

        <OriTable.column
          v-else-if="column.type === 'index'"
          :title="column.title || column.label || '序号'"
          :width="column.minWidth || column.width || 80"
          :align="column.align || 'left'"
          show-overflow="tooltip"
          :fixed="column.fixed"
          :tree-node="column.dataIndex === treeNode"
        >
          <template #default="{ rowIndex }">
            <span>{{ rowIndex + 1 }}</span>
          </template>
        </OriTable.column>

        <OriTable.column
          v-else-if="column.slot"
          :data-index="column.dataIndex"
          :title="column.title || column.label"
          :align="column.align"
          :min-width="column.minWidth"
          :width="column.width"
          :show-overflow="column.slotOverflow === false ? undefined : 'tooltip'"
          :fixed="column.dataIndex === 'operate' ? 'right' : column.fixed"
          :type="column.expandSlot ? 'expand' : undefined"
          :tree-node="column.dataIndex === treeNode"
        >
          <template #default="{ row, column: tableColumn, rowIndex }">
            <slot :name="column.slot" :row="row" :column="tableColumn" :row-index="rowIndex" />
          </template>
          <template v-if="column.expandSlot" #content="{ row, column: tableColumn, rowIndex }">
            <slot :name="column.expandSlot" :row="row" :column="tableColumn" :row-index="rowIndex" />
          </template>
        </OriTable.column>

        <OriTable.column
          v-else
          :data-index="column.dataIndex"
          :title="column.title || column.label"
          :align="column.align"
          :min-width="column.type === 'time' ? 170 : column.minWidth"
          :width="column.width"
          show-overflow="tooltip"
          :fixed="column.fixed"
          :type="column.expandSlot ? 'expand' : undefined"
          :tree-node="column.dataIndex === treeNode"
        >
          <template #default="{ row }">
            <span>{{ getCellValue(row, column) }}</span>
          </template>
          <template v-if="column.expandSlot" #content="{ row, column: tableColumn, rowIndex }">
            <slot :name="column.expandSlot" :row="row" :column="tableColumn" :row-index="rowIndex" />
          </template>
        </OriTable.column>
      </template>
    </OriTable>
  </div>
</template>

<style scoped lang="less">
.custom-table-wrap {
  .tabel-header-box {
    .table-search {
      display: flex;
      flex: 1;
      flex-wrap: wrap;

      :deep(.ori-input .ori-input__inner) {
        padding-bottom: 0;
      }
    }

    .table-operate {
      flex-wrap: nowrap;
      margin-bottom: 16px;

      .oprate-icon-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: 1px solid #e5e6eb;
        border-radius: 2px;
        cursor: pointer;

        &:hover {
          background: #f2f3f5;
        }
      }

      :deep(.ori-button) {
        margin-right: 8px;
        white-space: nowrap;
      }
    }
  }

  :deep(.vxe-table--render-default .vxe-body--expanded-column) {
    border-top: 1px solid #e8eaec;
  }

  :deep(.vxe-resizable) {
    bottom: 12px;
    width: 1px;
    height: 50%;
    background-color: #e5e6eb;
  }
}

.clos-setting {
  min-width: 180px;
  max-height: 300px;
  overflow-y: overlay;

  &::-webkit-scrollbar-thumb {
    background: transparent;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background: #c9cdd4;
    }
  }

  .base-filter-item {
    padding: 0 8px 8px;
    border-bottom: 1px solid #f2f3f5;

    &:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }
  }

  .desc {
    color: #4e5969;
    font-size: 12px;
    line-height: 20px;
  }

  .check-col {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 4px;
    padding: 6px 8px 8px 16px;
    border-radius: 2px;

    &:hover {
      background: #f7f8fa;
    }

    :deep(.ori-checkbox .el-checkbox) {
      height: 22px;
    }

    .svg-icon {
      cursor: pointer;
    }
  }
}

.refreshAnimation {
  animation: rotate 0.5s linear;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
