<script setup lang="ts">
interface Props {
  statusClass?: string
  text?: string
  changeBackground?: boolean
}

withDefaults(defineProps<Props>(), {
  statusClass: 'default',
  text: '-',
  changeBackground: true,
})
</script>

<template>
  <span :class="['table-status', statusClass, { 'no-bg': !changeBackground }]">
    {{ text }}
  </span>
</template>

<style scoped lang="less">
.table-status {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  font-size: 12px;
  line-height: 20px;
  border-radius: 11px;

  &.online,
  &.success {
    color: #00b42a;
    background: #e8fff8;
  }

  &.offline,
  &.disabled {
    color: #86909c;
    background: #f2f3f5;
  }

  &.warning,
  &.processing {
    color: #ff7d00;
    background: #fff7e8;
  }

  &.error,
  &.fail {
    color: #f24949;
    background: #ffece8;
  }

  &.primary {
    color: #5e66f2;
    background: #e8edff;
  }

  &.no-bg {
    padding: 0;
    background: transparent;
  }
}
</style>
