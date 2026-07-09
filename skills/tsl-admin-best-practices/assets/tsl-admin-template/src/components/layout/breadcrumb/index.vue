<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Breadcrumb as OriBreadcrumb } from 'origami-vue'
import { useUserStore } from '@/store/user'
import SvgIcon from '@/components/svg-icon'

const OriBreadcrumbItem = OriBreadcrumb.Item
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { breadcrumbs, toggle } = storeToRefs(userStore)
const overrideBreadcrumbs = ref(null)

const routeBreadcrumbs = computed(() => {
  const matched = route.matched.filter((record) => record.meta?.title)
  return matched.map((record, index) => ({
    title: record.meta.title,
    routeConfig: index === matched.length - 1 ? undefined : { path: record.path }
  }))
})

const breadcrumbList = computed(() => overrideBreadcrumbs.value || routeBreadcrumbs.value)

function goToParentPage(item, index) {
  if (!item?.routeConfig || index === breadcrumbList.value.length - 1) return
  router.push(item.routeConfig)
}

watch(breadcrumbs, (value) => {
  if (value) {
    overrideBreadcrumbs.value = value
    userStore.changeBreadcrumb(null)
  }
})

watch(
  () => route.fullPath,
  () => {
    overrideBreadcrumbs.value = null
  }
)
</script>

<template>
  <div class="tsl-layout-breadcrumb">
    <div class="layout-toggle__left" @click="userStore.setToggle(!toggle)">
      <SvgIcon :icon-class="toggle ? 'icon_fold' : 'icon_expand'" size="16" />
    </div>
    <OriBreadcrumb v-if="breadcrumbList.length">
      <OriBreadcrumbItem
        v-for="(node, index) in breadcrumbList"
        :key="`${node.title}-${index}`"
        :long-text="node.title?.length > 10"
        :class="{
          'is-current': index === breadcrumbList.length - 1,
          'is-clickable': !!node.routeConfig && index !== breadcrumbList.length - 1
        }"
        @click="goToParentPage(node, index)"
      >
        {{ node.title }}
      </OriBreadcrumbItem>
    </OriBreadcrumb>
  </div>
</template>

<style scoped lang="less">
.tsl-layout-breadcrumb {
  display: flex;
  flex: 0 0 48px;
  align-items: center;
  height: 48px;
  padding: 0 16px;
  overflow: hidden;
  background: #fff;
  border-bottom: 1px solid #e7e9ec;

  :deep(.ori-breadcrumb) {
    color: @font-color-regular;
    font-size: 14px;
    line-height: 22px;
  }

  :deep(.ori-breadcrumb a) {
    color: @font-color-regular;
    font-size: 14px;
    line-height: 22px;
    cursor: default;
  }

  :deep(.ori-breadcrumb-item.is-clickable a) {
    cursor: pointer;

    &:hover {
      color: #5e66f2;
    }
  }

  :deep(.ori-breadcrumb-item.is-current a) {
    color: @font-color-strong;
    font-weight: 500;
    cursor: default;
  }
}
</style>
