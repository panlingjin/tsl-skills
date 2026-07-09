export default [
  {
    key: 'navbar-workbench',
    name: '工作台',
    icon: 'icon_menu_workbench',
    isParent: true,
    children: [
      { key: 'menu-my-workbench', name: '我的工作台', path: '/dashboard', icon: 'icon_workbench' },
      { key: 'menu-my-todo', name: '我的待办', path: '/workbench/todo', icon: 'icon_todo' },
      { key: 'menu-my-done', name: '我的已办', path: '/workbench/done', icon: 'icon_done' },
      { key: 'menu-create-ticket', name: '发起工单', path: '/workbench/tickets/create', icon: 'icon_ticket' }
    ]
  }
]

export const groupedMonitorMenuExample = [
  {
    key: 'navbar-monitor',
    name: '算力监控',
    icon: 'icon_monitor',
    isParent: true,
    group: true,
    children: [
      {
        key: 'compute-facilities',
        name: '计算设施',
        border: true,
        children: [
          { key: 'compute-card', name: '算力卡', path: '/monitor/computing/card', icon: 'icon_compute_card' },
          {
            key: 'physical-machine',
            name: '物理机',
            path: '/monitor/physical-machine',
            icon: 'icon_physical_machine'
          }
        ]
      },
      {
        key: 'storage-facilities',
        name: '存储设施',
        border: true,
        children: [
          { key: 'primary-storage', name: '主存储', path: '/monitor/primary-storage', icon: 'icon_storage' },
          { key: 'cloud-disk', name: '云盘', path: '/monitor/cloud-disk', icon: 'icon_storage' }
        ]
      },
      {
        key: 'cloud-resources',
        name: '云资源',
        border: true,
        children: [{ key: 'cloud-host', name: '云主机', path: '/monitor/cloud-host', icon: 'icon_cloud_host' }]
      },
      {
        key: 'middleware-resources',
        name: '中间件资源',
        border: true,
        children: [{ key: 'image-server', name: '镜像服务器', path: '/monitor/image-server', icon: 'icon_storage' }]
      },
      {
        key: 'network-resources',
        name: '网络资源',
        border: true,
        children: [
          { key: 'l2-network', name: '二层网络资源', path: '/monitor/l2-network', icon: 'icon_network_layer' },
          { key: 'l3-network', name: '三层网络资源', path: '/monitor/l3-network', icon: 'icon_globe' },
          { key: 'network-device', name: '网络设备', path: '/monitor/network-device', icon: 'icon_globe' }
        ]
      },
      {
        key: 'container-resources',
        name: '容器资源',
        border: true,
        children: [
          { key: 'container-group', name: '容器组', path: '/monitor/container-group', icon: 'icon_container' },
          { key: 'container-host', name: '容器主机', path: '/monitor/container-host', icon: 'icon_container_host' }
        ]
      },
      {
        key: 'compute-center',
        name: '算力中心',
        children: [{ key: 'compute-room', name: '算力机房', path: '/monitor/compute-room', icon: 'icon_building' }]
      }
    ]
  }
]
