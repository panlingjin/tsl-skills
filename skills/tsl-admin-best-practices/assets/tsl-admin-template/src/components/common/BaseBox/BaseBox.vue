<script setup lang="ts">
interface Props {
  hasRightPadding?: boolean
}

withDefaults(defineProps<Props>(), {
  hasRightPadding: false,
})
</script>

<template>
  <div :class="['base-box-wrap', { 'has-right-padding': hasRightPadding }]">
    <div class="base-box">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="less">
.base-box-wrap {
  height: 100%;
  overflow-y: auto;
  animation: show-block 0.5s ease-out;

  &.has-right-padding {
    padding-right: 18px;
  }
}

.base-box {
  min-height: 100%;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
}

@keyframes show-block {
  from {
    transform: translateX(32px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
