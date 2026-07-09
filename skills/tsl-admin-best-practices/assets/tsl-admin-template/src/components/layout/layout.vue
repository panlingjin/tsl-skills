<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/user'
import THeader from './header/index.vue'
import TMenu from './menu/index.vue'
import TContent from './content/index.vue'
import TBreadcrumb from './breadcrumb/index.vue'
import './layout.less'

const userStore = useUserStore()
const { toggle } = storeToRefs(userStore)
</script>

<template>
  <div class="tsl-layout">
    <THeader />
    <div class="tsl-layout-main">
      <TMenu :collapsed="!toggle" />
      <div class="tsl-layout-workspace">
        <TBreadcrumb />
        <TContent>
          <RouterView />
        </TContent>
      </div>
    </div>
  </div>
</template>
