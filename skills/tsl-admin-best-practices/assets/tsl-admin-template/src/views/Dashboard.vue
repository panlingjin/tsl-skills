<script setup>
import BaseBox from '@/components/base-box'
</script>

<template>
  <BaseBox>
    <div class="dashboard-title">工作台</div>
    <div class="dashboard-panel">在这里替换为目标项目的概览、列表或配置内容。</div>
  </BaseBox>
</template>

<style scoped lang="less">
.dashboard-title {
  margin-bottom: 16px;
  color: @font-color-strong;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}

.dashboard-panel {
  padding: 24px;
  color: @font-color-regular;
  background: @tsl-background-color;
  border-radius: 4px;
}
</style>
