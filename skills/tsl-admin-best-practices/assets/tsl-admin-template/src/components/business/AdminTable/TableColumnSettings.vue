<script setup lang="ts">
import { Checkbox as OriCheckbox, Dropdown as OriDropdown } from 'origami-vue'
import SvgIcon from '@/components/common/SvgIcon/SvgIcon.vue'
import type { TableColumn, TableFixed } from './types'

interface Props {
  allChecked: boolean
  indeterminate: boolean
  fixedColumns: TableColumn[]
  otherColumns: TableColumn[]
  getColumnKey: (column: TableColumn) => string
}

defineProps<Props>()

defineEmits<{
  toggleAll: [visible: boolean]
  updateVisible: [column: TableColumn, visible: boolean]
  updateFixed: [column: TableColumn, fixed?: TableFixed]
}>()
</script>

<template>
  <OriDropdown trigger="click" position="bottomRight">
    <button class="table-icon-button" type="button" aria-label="设置表格列">
      <SvgIcon name="settings" size="16" />
    </button>

    <template #overlay>
      <div class="column-settings">
        <div class="column-group">
          <div class="description">选择表格显示列</div>
          <div class="column-item">
            <OriCheckbox
              :model-value="allChecked"
              :indeterminate="indeterminate"
              @change="$emit('toggleAll', Boolean($event))"
            >
              全部
            </OriCheckbox>
          </div>
        </div>

        <div v-if="fixedColumns.length" class="column-group">
          <div
            v-for="column in fixedColumns"
            :key="getColumnKey(column)"
            class="column-item"
          >
            <OriCheckbox
              :model-value="column.visible !== false"
              @change="$emit('updateVisible', column, Boolean($event))"
            >
              {{ column.title ?? column.label }}
            </OriCheckbox>
            <button
              class="column-pin"
              type="button"
              :aria-label="`取消固定${column.title ?? column.label ?? ''}列`"
              @click="$emit('updateFixed', column)"
            >
              <SvgIcon name="unpin" size="16" />
            </button>
          </div>
        </div>

        <div v-if="otherColumns.length" class="column-group">
          <div
            v-for="column in otherColumns"
            :key="getColumnKey(column)"
            class="column-item"
          >
            <OriCheckbox
              :model-value="column.visible !== false"
              @change="$emit('updateVisible', column, Boolean($event))"
            >
              {{ column.title ?? column.label }}
            </OriCheckbox>
            <button
              class="column-pin"
              type="button"
              :aria-label="`固定${column.title ?? column.label ?? ''}列`"
              @click="$emit('updateFixed', column, 'left')"
            >
              <SvgIcon name="pin" size="16" />
            </button>
          </div>
        </div>
      </div>
    </template>
  </OriDropdown>
</template>

<style scoped lang="less">
.table-icon-button,
.column-pin {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.table-icon-button {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e6eb;
  border-radius: 2px;

  &:hover {
    background: #f2f3f5;
  }
}

.column-settings {
  min-width: 180px;
  max-height: 300px;
  overflow-y: auto;
}

.column-group {
  padding: 0 8px 8px;
  border-bottom: 1px solid #f2f3f5;

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
}

.description {
  color: #4e5969;
  font-size: 12px;
  line-height: 20px;
}

.column-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  padding: 6px 8px 8px 16px;
  border-radius: 2px;

  &:hover {
    background: #f7f8fa;
  }
}
</style>
