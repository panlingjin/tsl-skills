import type { VNodeChild } from 'vue'

export type TableRow = Record<string, unknown>
export type TableAlign = 'left' | 'center' | 'right'
export type TableFixed = 'left' | 'right'
export type TableSize = 'medium' | 'small' | 'mini'
export type TableBordered = 'default' | 'full' | 'outer' | 'inner' | 'none' | true

export interface TableColumn {
  key?: string
  dataIndex?: string
  prop?: string
  field?: string
  title?: string
  label?: string
  type?: 'checkbox' | 'index' | 'time' | 'version' | 'address' | 'expand'
  align?: TableAlign
  fixed?: TableFixed
  width?: string | number
  minWidth?: string | number
  visible?: boolean
  slot?: string
  expandSlot?: string
  slotOverflow?: boolean
  unit?: string
  sortable?: boolean
  sortBy?: string
  filters?: unknown[]
  filterMethod?: (params: unknown) => boolean
}

export interface TablePagination {
  current: number
  pageSize: number
  total: number
  disabled?: boolean
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  pageSizeOptions?: string[]
  size?: string
  showTotal?: (total: number, range: [number, number]) => VNodeChild
  onChange?: (page: number, pageSize: number) => void | Promise<void>
  onShowSizeChange?: (current: number, pageSize: number) => void
}

export interface TableOptions {
  stripe?: boolean
  bordered?: TableBordered
  size?: TableSize
  maxHeight?: string | number
  expandConfig?: {
    iconOpen?: string
    iconClose?: string
  }
}

export interface TableInstance {
  methods?: (name: string) => (() => unknown) | undefined
}
