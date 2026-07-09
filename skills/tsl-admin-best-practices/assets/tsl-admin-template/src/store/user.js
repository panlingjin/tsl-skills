import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    toggle: true,
    navBarKey: 'navbar-dashboard',
    breadcrumbs: null,
    userInfo: {
      userName: '管理员'
    }
  }),
  actions: {
    setToggle(value) {
      this.toggle = value
    },
    setNavBarKey(value) {
      this.navBarKey = value
    },
    changeBreadcrumb(value) {
      this.breadcrumbs = value
    }
  }
})
