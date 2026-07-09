<script setup>
defineProps({
  hasRtPadding: Boolean
})
</script>

<template>
  <div :class="['base-box-wrap block__animation', { 'cont-padding-right': hasRtPadding }]">
    <div class="base-box pd-20 min-height-base">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="less">
.base-box-wrap {
  height: 100%;
  overflow-y: overlay;
}

.min-height-base {
  min-height: 100%;
}
</style>
