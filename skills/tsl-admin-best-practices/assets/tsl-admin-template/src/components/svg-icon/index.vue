<script setup>
import { computed } from 'vue'

const props = defineProps({
  iconClass: {
    type: String,
    required: true
  },
  className: String,
  color: String,
  size: {
    type: [String, Number],
    default: 16
  }
})

const iconName = computed(() => `#icon-${props.iconClass}`)
const svgClass = computed(() => (props.className ? `svg-icon ${props.className}` : 'svg-icon'))
const iconStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  color: props.color || 'currentColor'
}))
</script>

<template>
  <svg :class="svgClass" :style="iconStyle" aria-hidden="true">
    <use :href="iconName" />
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
