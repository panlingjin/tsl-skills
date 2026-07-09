<script setup>
import { ConfigProvider } from 'origami-vue'
import zhCN from 'origami-vue/es/locale/lang/zh-cn'
</script>

<template>
  <ConfigProvider :locale="zhCN">
    <RouterView />
  </ConfigProvider>
</template>
