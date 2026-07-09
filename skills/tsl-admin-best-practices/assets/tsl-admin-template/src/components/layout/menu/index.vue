<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, Divider } from 'origami-vue'
import menu from './menu'
import SvgIcon from '@/components/svg-icon'
import { findKeyByPath } from '@/utils/tool'

defineProps({
  collapsed: Boolean
})

const MenuItem = Menu.menuItem
const SubMenu = Menu.subMenu
const MenuItemGroup = Menu.menuItemGroup

const route = useRoute()
const router = useRouter()
const menuList = ref(menu)
const defaultOpeneds = computed(() => menuList.value.filter((item) => item.isParent).map((item) => item.key))
const activeName = computed(() => findKeyByPath(menuList.value, route.path) || getFirstEnabledMenu(menuList.value)?.key || '')

function getFirstEnabledMenu(menus) {
  if (!menus?.length) return null

  for (const item of menus) {
    if (item.disabled) continue
    if (!item.isParent && item.path) return item
    const child = getFirstEnabledMenu(item.children)
    if (child) return child
  }

  return null
}

function navBarChange(item) {
  if (item.disabled || !item.path) return
  localStorage.removeItem('searchObj')
  router.push(item.path)
}
</script>

<template>
  <div :class="['tsl-layout-sider', { 'is-collapse': collapsed }]">
    <div class="menu-wrap">
      <Menu
        active-text-color="#5E66F2"
        :class="['menu-nav__ul', { 'menu-nav-collapse': collapsed }]"
        mode="vertical"
        :collapse="collapsed"
        :default-active="activeName"
        :default-openeds="defaultOpeneds"
      >
        <div v-for="menu in menuList" :key="menu.key">
          <MenuItem
            v-if="!menu.isParent"
            :index="menu.key"
            class="first-menu"
            :disabled="!!menu.disabled"
            @click="navBarChange(menu)"
          >
            <SvgIcon v-if="menu.icon" :icon-class="menu.icon" class="menu-icon mr-rt-8" size="16" />
            <span>{{ menu.name }}</span>
          </MenuItem>

          <SubMenu v-else-if="menu.group" :index="menu.key">
            <template #title>
              <SvgIcon v-if="collapsed && menu.icon" :icon-class="menu.icon" class="menu-icon mr-rt-8" size="16" />
              <span>{{ menu.name }}</span>
            </template>

            <MenuItemGroup v-for="group in menu.children" :key="group.key" :title="group.name || group.title">
              <template v-for="item in group.children" :key="item.key">
                <MenuItem
                  v-if="!item.isParent"
                  :index="item.key"
                  :disabled="!!item.disabled"
                  @click="navBarChange(item)"
                >
                  <SvgIcon v-if="item.icon" :icon-class="item.icon" class="menu-icon mr-rt-8" size="16" />
                  <span>{{ item.name }}</span>
                </MenuItem>

                <SubMenu v-else :index="item.key">
                  <template #title>
                    <span>{{ item.name }}</span>
                  </template>
                  <MenuItem
                    v-for="subMenu in item.children"
                    :key="subMenu.key"
                    :index="subMenu.key"
                    :disabled="!!subMenu.disabled"
                    @click="navBarChange(subMenu)"
                  >
                    {{ subMenu.name }}
                  </MenuItem>
                </SubMenu>
              </template>
              <Divider v-if="group.border" />
            </MenuItemGroup>
          </SubMenu>

          <SubMenu v-else :index="menu.key">
            <template #title>
              <SvgIcon v-if="collapsed && menu.icon" :icon-class="menu.icon" class="menu-icon mr-rt-8" size="16" />
              <span>{{ menu.name }}</span>
            </template>

            <template v-for="item in menu.children" :key="item.key">
              <MenuItem
                v-if="!item.isParent"
                :index="item.key"
                :disabled="!!item.disabled"
                @click="navBarChange(item)"
              >
                <SvgIcon v-if="item.icon" :icon-class="item.icon" class="menu-icon mr-rt-8" size="16" />
                <span>{{ item.name }}</span>
              </MenuItem>

              <SubMenu v-else :index="item.key">
                <template #title>
                  <span>{{ item.name }}</span>
                </template>
                <MenuItem
                  v-for="subMenu in item.children"
                  :key="subMenu.key"
                  :index="subMenu.key"
                  :disabled="!!subMenu.disabled"
                  @click="navBarChange(subMenu)"
                >
                  {{ subMenu.name }}
                </MenuItem>
              </SubMenu>
              <Divider v-if="item.border" />
            </template>
          </SubMenu>
        </div>
      </Menu>
    </div>
  </div>
</template>

<style scoped lang="less">
.menu-wrap {
  height: calc(100% - 8px);
  padding-right: 8px;
  overflow-y: overlay;

  &::-webkit-scrollbar-thumb {
    background: transparent;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background: #c9cdd4;
    }
  }
}

.menu-nav__ul {
  margin: 0 4px;

  &.menu-nav-collapse {
    margin: 0;
  }

  .menu-icon {
    width: 16px;
    min-width: 16px;
    height: 16px;
  }
}

:deep(.ori-menu .el-menu),
:deep(.ori-menu .el-menu--collapse.el-menu) {
  padding: 0 !important;
  border-right: none;
  background-color: transparent;
}

:deep(.ori-menu .el-menu--collapse) {
  width: 32px;
}

:deep(.ori-menu .el-menu .el-sub-menu) {
  margin-bottom: 4px;
}

:deep(.ori-menu .el-menu .el-sub-menu > .el-sub-menu__title) {
  height: 36px;
  padding-left: 16px !important;
  color: #5e66f2;
  font-size: 14px;
  line-height: 36px;
  border-radius: 4px;
}

:deep(.ori-menu .el-menu .el-sub-menu > .el-sub-menu__title:hover) {
  background-color: transparent;
}

:deep(.ori-menu .el-sub-menu .el-sub-menu__icon-arrow) {
  right: 8px;
  margin-top: -8px;
  font-size: 16px;
}

:deep(.ori-menu .el-menu .el-menu-item) {
  height: 36px;
  margin-bottom: 4px !important;
  color: @font-color-regular;
  font-size: 14px;
  line-height: 36px;
  border-radius: 4px;
}

:deep(.ori-menu .el-menu .el-menu-item.first-menu) {
  padding-left: 16px !important;
}

:deep(.ori-menu .el-menu .el-menu-item:not(.first-menu)) {
  padding-left: 20px !important;
}

:deep(.ori-menu .el-menu .el-menu-item:hover) {
  color: @font-color-regular;
  background-color: #f2f3f5;
}

:deep(.ori-menu .el-menu .el-menu-item.is-active) {
  color: #5e66f2;
  background-color: #e8edff;
}

:deep(.ori-menu .el-menu .el-menu-item.is-active span) {
  color: #5e66f2;
}

:deep(.ori-menu .el-menu-item-group__title) {
  height: 22px;
  margin: 10px 0 4px 16px;
  padding: 0 !important;
  color: #86909c;
  font-size: 14px;
  line-height: 22px;
}

:deep(.ori-divider.ori-divider-horizontal) {
  width: calc(100% - 32px);
  min-width: calc(100% - 32px);
  margin: 6px 16px 12px;
  border-color: #e5e6eb;
}

:deep(.ori-menu .el-menu--collapse .el-sub-menu),
:deep(.ori-menu .el-menu--collapse .el-menu-item) {
  margin-bottom: 8px !important;
  padding: 8px !important;
}

:deep(.ori-menu .el-menu-item.is-disabled) {
  color: #c9cdd4;
  opacity: 1;
  cursor: not-allowed;
}

:deep(.ori-menu .el-menu-item.is-disabled:hover) {
  background-color: transparent;
}
</style>
