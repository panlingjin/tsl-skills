<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

interface Props {
  name: string
  prefix?: string
  color?: string
  size?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  prefix: 'icon',
  color: 'currentColor',
  size: 16,
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
const iconStyle = computed<CSSProperties>(() => {
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size
  return {
    width: size,
    height: size,
    color: props.color,
  }
})
</script>

<template>
  <svg class="svg-icon" :style="iconStyle" aria-hidden="true">
    <use :href="symbolId" />
  </svg>
</template>

<style scoped>
.svg-icon {
  display: inline-block;
  overflow: hidden;
  vertical-align: -0.15em;
  fill: currentColor;
}
</style>
