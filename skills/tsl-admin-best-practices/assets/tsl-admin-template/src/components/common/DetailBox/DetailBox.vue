<script setup>
import { useSlots } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '@/components/common/SvgIcon/SvgIcon.vue'

defineProps({
  backPath: {
    type: [String, Object],
    default: undefined,
  },
  title: {
    type: String,
    default: '',
  },
  transparentHeader: {
    type: Boolean,
    default: false,
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
})

const slots = useSlots()
const router = useRouter()
</script>

<template>
  <div class="detail-content">
    <div v-if="showHeader" :class="['top-info', { 'transparent-header': transparentHeader }]">
      <SvgIcon
        v-if="backPath"
        name="back"
        class="mr-rt-8 back-page"
        size="20"
        @click="router.push(backPath)"
      />
      <div class="detail-title">{{ title }}</div>
      <slot name="left" />
      <div class="right-operate">
        <slot name="right" />
      </div>
    </div>
    <div
      :class="[
        'detail-box',
        { 'transparent-header': transparentHeader },
        { 'has-footer': slots.footer },
      ]"
    >
      <slot />
    </div>
    <div v-if="slots.footer" class="footer-info">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped lang="less">
.detail-content {
  position: relative;
  height: 100%;
  padding-right: 18px;
  animation: show-block 0.5s ease-out;

  .top-info {
    position: relative;
    display: flex;
    align-items: center;
    padding: 16px 20px 0;
    line-height: 32px;
    background: #fff;
    border-radius: 4px 4px 0 0;

    &.transparent-header {
      height: auto;
      margin-bottom: 16px;
      padding: 0;
      background: transparent;
      border-bottom: none;
      line-height: 1.5;
    }
  }

  .detail-title {
    font-weight: 500;
    font-size: 16px;
  }

  .back-page {
    margin-right: 8px;
    font-size: 20px;
    cursor: pointer;
  }

  .right-operate {
    position: absolute;
    right: 16px;
  }

  .detail-box {
    min-height: calc(100% - 48px);
    padding: 16px 20px;
    background: #fff;
    border-radius: 0 0 4px 4px;

    &.transparent-header {
      min-height: calc(100% - 40px);
      padding: 0;
    }

    &.has-footer {
      padding-bottom: 56px;
    }
  }
}

.footer-info {
  position: absolute;
  right: 20px;
  bottom: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  width: calc(100% - 40px);
  height: 64px;
  padding-left: 20px;
  background: #fff;
  box-shadow:
    0 16px 48px 8px rgba(29, 33, 41, 0.08),
    0 -1px 0 0 #e5e6eb;
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
