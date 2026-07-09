<script setup>
import { storeToRefs } from 'pinia'
import { Button as OriButton } from 'origami-vue'
import { QuestionMarkCircle } from 'origami-vue/es/icon'
import { useUserStore } from '@/store/user'
import SvgIcon from '@/components/svg-icon'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
</script>

<template>
  <div class="tsl-layout-header">
    <div class="header-left flex-ac">
      <div class="logo-wrap">
        <div class="logo-mark">T</div>
        <span class="toggle-title">算力运维管理平台</span>
      </div>
      <div class="parent-menu-box flex-ac">
        <div class="menu-item active">工作台</div>
        <div class="menu-item">系统管理</div>
      </div>
    </div>
    <div class="header-right flex-ac">
      <OriButton type="outline">
        <template #icon>
          <SvgIcon icon-class="icon_monitor" size="16" />
        </template>
        监控大屏
      </OriButton>
      <QuestionMarkCircle class="mr-lt-16 header-icon" />
      <div class="user-avatar-box mr-lt-16">{{ userInfo.userName.slice(0, 1) }}</div>
      <span class="username mr-lt-8">{{ userInfo.userName }}</span>
    </div>
  </div>
</template>

<style scoped lang="less">
.logo-wrap {
  position: relative;
  display: flex;
  flex: 0 0 210px;
  align-items: center;
  width: 210px;
  height: 24px;
  padding-right: 8px;
  cursor: pointer;
}

.logo-mark {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  color: #fff;
  font-weight: 600;
  line-height: 24px;
  text-align: center;
  background: #5e66f2;
  border-radius: 4px;
}

.toggle-title {
  min-width: 140px;
  font-weight: 500;
  line-height: 22px;
  white-space: nowrap;
}

.parent-menu-box {
  font-size: 14px;
  line-height: 20px;
}

.menu-item {
  width: 72px;
  margin-right: 16px;
  padding: 6px 0;
  text-align: center;
  cursor: pointer;

  &:hover,
  &.active {
    color: #5e66f2;
  }

  &.active {
    background: rgba(242, 243, 245, 0.97);
  }
}

.header-icon {
  color: #4e5969;
  font-size: 20px;
  cursor: pointer;
}

.user-avatar-box {
  width: 32px;
  height: 32px;
  color: #fff;
  font-weight: 500;
  line-height: 32px;
  text-align: center;
  background: #afb0c7;
  border-radius: 50%;
}

.username {
  color: @font-color-regular;
}
</style>
