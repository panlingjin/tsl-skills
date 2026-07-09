import { createRouter, createWebHashHistory } from 'vue-router'
import AdminLayout from '@/components/layout'

const routes = [
  {
    path: '/',
    component: AdminLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '工作台' }
      }
    ]
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
