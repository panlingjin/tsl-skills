<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    default: 'icon',
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  size: {
    type: [String, Number],
    default: 16,
  },
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
const iconStyle = computed(() => {
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
