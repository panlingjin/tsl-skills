---
title: 图标 (Icon)
impact: LOW
impactDescription: 使用错误 API 影响较小但可能导致显示异常
type: component
tags: [origami-vue, basic]
---

# 图标 (Icon)

**Impact: LOW** - 使用错误 API 影响较小但可能导致显示异常

## 何时使用

- 图标是信息图形化简要的表达式，是最强大的视觉提示
- 用于操作按钮、状态标识、导航菜单等场景的图标展示

## API 参考

### 图标组件 Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| rotate | 旋转角度 | `number` | `-` |
| spin | 旋转是否有动画 | `boolean` | `false` |
| style | 设置图标的样式，例如 fontSize 和 color | `CSSProperties` | `-` |

### 导入方式

图标组件不支持动态指定图标名称，需要单独从 `origami-vue/es/icon` 导入：

```ts
import { AddFill, DeleteFill, EditFill } from 'origami-vue/es/icon'
```

每个图标是一个独立的 Vue 组件，组件名采用 PascalCase 命名，在模板中直接使用导入的组件名作为标签：

```vue
<!-- 组件 AddFill 直接作为标签使用 -->
<AddFill />
```

## 使用示例

### 正确用法

```vue
<script setup lang="ts">
import { AddFill, DeleteFill, EditFill, LoadingColor } from 'origami-vue/es/icon'
</script>

<template>
  <!-- 基础用法 -->
  <AddFill />

  <!-- 设置大小和颜色 -->
  <DeleteFill :style="{ fontSize: '20px', color: '#f24949' }" />

  <!-- 旋转动画 -->
  <LoadingColor :spin="true" />

  <!-- 旋转指定角度 -->
  <EditFill :rotate="90" />

  <!-- 在按钮中使用 -->
  <OriButton primary>
    <template #icon>
      <AddFill />
    </template>
    新增
  </OriButton>
</template>
```

### 常见错误

```vue
<script setup lang="ts">
// 错误：从 origami-vue 主包导入图标
import { AddFill } from 'origami-vue'
// 应从 origami-vue/es/icon 导入

// 错误：使用 OriIcon 前缀
import { OriIconAddFill } from 'origami-vue/es/icon'
// 图标组件不加 Ori 前缀，直接使用导出名
</script>

<template>
  <!-- 错误：尝试动态指定图标名称 -->
  <component :is="iconName" />
  <!-- 图标组件不支持动态名称，需要预注册 -->

  <!-- 错误：使用 ori-icon 组件 + type 属性 -->
  <ori-icon type="add-fill" />
  <!-- origami-vue 没有统一的 ori-icon 组件，每个图标是独立组件 -->

  <!-- 错误：使用 kebab-case 的 ori-icon-xxx 标签 -->
  <ori-icon-add-fill />
  <!-- 应直接使用 PascalCase 组件标签：<AddFill /> -->
</template>
```

## 完整图标清单

### 方向/箭头（Directional）

| 组件名 | 说明 |
|--------|------|
| Down | 向下 |
| DownFill | 向下填充 |
| UpFill | 向上填充 |
| LeftFill | 向左填充 |
| RightFill | 向右填充 |
| LeftTriangle | 左三角 |
| RightTriangle | 右三角 |
| UpTriangle | 上三角 |
| DownTriangle | 下三角 |
| LeftDoubleArrow | 左双箭头 |
| LeftDoubleArrowFill | 左双箭头填充 |
| RightDoubleArrow | 右双箭头 |
| RightDoubleArrowFill | 右双箭头填充 |
| TowardsTheLeft | 向左 |
| TowardsTheRight | 向右 |
| Upward | 向上 |
| Return | 返回 |
| ForwardFill | 前进填充 |

### 操作/编辑（Action）

| 组件名 | 说明 |
|--------|------|
| AddFill | 添加填充 |
| AddFloor | 添加楼层 |
| AddSubset | 添加子集 |
| DeleteFill | 删除填充 |
| Delete | 删除 |
| EditFill | 编辑填充 |
| Edit | 编辑 |
| Copy | 复制 |
| CopyFill | 复制填充 |
| CopyStretch | 复制拉伸 |
| SaveFill | 保存填充 |
| Search | 搜索 |
| SearchFill | 搜索填充 |
| Upload | 上传 |
| UploadFill | 上传填充 |
| UploadFailed | 上传失败 |
| UploadFailedFill | 上传失败填充 |
| Download | 下载 |
| DownloadFill | 下载填充 |
| Export | 导出 |
| Move | 移动 |
| Drag | 拖拽 |
| Rotate | 旋转 |
| Zoom | 缩放 |
| Enlarge | 放大 |
| Narrow | 缩小 |
| Close | 关闭 |
| CloseTheActuator | 关闭执行器 |
| Open | 打开 |
| Preservation | 保存 |
| Erase | 擦除 |
| EraseFill | 擦除填充 |
| ClearFill | 清除填充 |
| FrameSelection | 框选 |
| PutAway | 收起 |
| PreviousStep | 上一步 |
| Reduce | 减少 |
| ReduceFill | 减少填充 |
| Increase | 增加 |
| Eliminate | 消除 |
| DirectExport | 直接导出 |
| ImportConfiguration | 导入配置 |

### 状态/提示（Status）

| 组件名 | 说明 |
|--------|------|
| Correct | 正确 |
| SuccessFill | 成功填充 |
| SuccessCircle | 成功圆圈 |
| ErrorFill | 错误填充 |
| ErrorCircle | 错误圆圈 |
| WarningFill | 警告填充 |
| WarningCircle | 警告圆圈 |
| TipCircle | 提示圆圈 |
| QuestionMarkCircle | 问号圆圈 |
| QuestionMarkFill | 问号填充 |
| PromptFill | 提示填充 |
| ReminderFill | 揜醒填充 |
| FeedbackFill | 反馈填充 |
| Fault | 故障 |
| LoadingColor | 加载中（彩色） |
| EmptyColor | 空状态（彩色） |

### 数据/图表（Data）

| 组件名 | 说明 |
|--------|------|
| Dashboard | 仪表盘 |
| Histogram | 柱状图 |
| LineChart | 折线图 |
| PieChart | 饼图 |
| RadarChart | 雷达图 |
| RingDiagram | 环形图 |
| WaterPoloDiagram | 水球图 |
| RankingList | 排行榜 |
| Data | 数据 |
| DataBoard | 数据看板 |
| DataInsight | 数据洞察 |
| PeakValue | 峰值 |

### 导航/布局（Navigation）

| 组件名 | 说明 |
|--------|------|
| HomePage | 首页 |
| HomeFill | 首页填充 |
| Layout | 布局 |
| LayoutSiderClose | 侧边栏关闭 |
| LayoutSiderOpen | 侧边栏展开 |
| Overview | 概览 |
| OverviewFill | 概览填充 |
| Layer | 图层 |
| DirectoryTree | 目录树 |
| Menu | 菜单 |
| SignOut | 登出 |
| ExitFill | 退出填充 |
| GetInto | 进入 |

### 用户/人员（User）

| 组件名 | 说明 |
|--------|------|
| User | 用户 |
| UserFill | 用户填充 |
| UserGroup | 用户组 |
| InputUser | 输入用户 |
| Personnel | 人员 |
| PersonnelFill | 人员填充 |
| PersonnelSensor | 人员传感器 |
| AccessControl | 访问控制 |
| FaceRecognition | 人脸识别 |

### 文件/文档（File）

| 组件名 | 说明 |
|--------|------|
| File | 文件 |
| FileFill | 文件填充 |
| Folder | 文件夹 |
| FolderFill | 文件夹填充 |
| DocumentFill | 文档填充 |
| LogFill | 日志填充 |
| Journal | 日志 |
| Form | 表单 |

### 时间/日期（Time）

| 组件名 | 说明 |
|--------|------|
| Date | 日期 |
| DateFill | 日期填充 |
| Time | 时间 |
| TimeFill | 时间填充 |

### 安全/权限（Security）

| 组件名 | 说明 |
|--------|------|
| Lock | 锁定 |
| LockFill | 锁定填充 |
| Unlock | 解锁 |
| UnlockFill | 解锁填充 |
| Hide | 隐藏 |
| HideFill | 隐藏填充 |
| VisibleFill | 显示填充 |
| DoorLock | 门锁 |

### 其他常用（Other Common）

| 组件名 | 说明 |
|--------|------|
| Link | 链接 |
| StarFill | 星标填充 |
| Label | 标签 |
| LabelFill | 标签填充 |
| MoreHorizontal | 更多（水平） |
| MoreVertical | 更多（垂直） |
| Scanning | 扫描 |
| Decline | 下降 |
| Rise | 上升 |
| Play | 播放 |
| PlayFill | 播放填充 |
| PauseFill | 暂停填充 |
| SoundFill | 声音填充 |
| MuteFill | 静音填充 |
| Cloud | 云 |
| CloudFill | 云填充 |
| World | 世界 |
| Service | 服务 |
| Attribute | 属性 |
| Choice | 选择 |
| SingleChoice | 单选 |
| MultipleChoiceFill | 多选填充 |
| MultipleSelectionDefault | 多选默认 |
| RadioBoxChecked | 单选框选中 |
| Target | 目标 |
| Query | 查询 |
| Adjust | 调整 |
| SortList | 排序列表 |
| UpAndDownSelection | 上下选择 |
| StowGeneral | 收起通用 |
| BoxFill | 盒子填充 |
| Container | 容器 |
| Assembly | 装配 |
| Modular | 模块化 |
| Model | 模型 |
| Core | 核心 |
| Object | 对象 |
| ObjectAction | 对象操作 |
| Source | 来源 |
| Rule | 规则 |
| RuleFill | 规则填充 |
| RuleEngine | 规则引擎 |
| TriggerCondition | 触发条件 |
| TriggerTime | 触发时间 |
| Iot | IoT |
| Gateway | 网关 |
| GatewayHollow | 网关空心 |
| Robot | 机器人 |
| News | 新闻 |
| Market | 市场 |
| Meeting | 会议 |
| MessageFill | 消息填充 |
| SelectFill | 选择填充 |
| Other | 其他 |
| OtherFill | 其他填充 |
| First | 第一 |
| FirstFill | 第一填充 |
| TheLastOne | 最后一个 |
| LastFill | 最后填充 |
| BroadcastFill | 广播填充 |
| RadioBroadcast | 无线广播 |
| Picture | 图片 |
| PictureFill | 图片填充 |
| Video | 视频 |
| VideoCamera | 摄像头 |
| Camera | 相机 |
| Screen | 屏幕 |
| Spotlight | 聚光灯 |
| Lighting | 照明 |
| Temperature | 温度 |
| Humidity | 湿度 |
| Price | 价格 |
| Meter | 仪表 |
| Metering | 计量 |
| Dashboard | 仪表盘 |
| Table | 表格 |
| TableCards | 表格卡片 |
| Textarea | 文本域 |
| SmallLabel | 小标签 |
| Slash | 斜线 |
| Wall | 墙壁 |
| Floor | 楼层 |
| Room | 房间 |
| Door | 门 |
| Stairs | 楼梯 |
| Elevator | 电梯 |
| Chair | 椅子 |
| Desk | 桌子 |
| Briefcase | 公文包 |
| Whitewash | 粉刷 |
| Decorate | 装饰 |
| Plan | 计划 |
| PlanFill | 计划填充 |
| TemplateCopy | 模板复制 |
| TemplateCopyFill | 模板复制填充 |
| Group3 | 分组 |
| So | SO |

### IoT/设备类（IoT/Device）

| 组件名 | 说明 |
|--------|------|
| AirConditioner | 空调 |
| CoolingHost | 制冷主机 |
| CoolingTower | 冷却塔 |
| FreshAir | 新风 |
| FanActuator | 风机执行器 |
| FanTemperatureControl | 风机温控 |
| CurtainMotor | 窗帘电机 |
| WindowOpener | 开窗器 |
| WindowCurtains | 窗帘 |
| Window | 窗户 |
| DimmingActuator | 调光执行器 |
| RegulatingSwitch | 调节开关 |
| Regulator | 调节器 |
| Switch | 开关 |
| Socket | 插座 |
| FluorescentLamp | 荧光灯 |
| StreetLamp | 路灯 |
| LightSensor | 光传感器 |
| TemperatureSensor | 温度传感器 |
| HumiditySensor | 湿度传感器 |
| PressureSensor | 压力传感器 |
| PersonnelSensor | 人员传感器 |
| EnvironmentalSensor | 环境传感器 |
| SecuritySensor | 安全传感器 |
| FireSensor | 火灾传感器 |
| WaterImmersionSensor | 水浸传感器 |
| CombustibleGasSensor | 可燃气体传感器 |
| InfraredIntrusion | 红外入侵 |
| DoorMagnetism | 门磁 |
| WaterMeter | 水表 |
| WattHourMeter | 电表 |
| WaterPump | 水泵 |
| WaterValve | 水阀 |
| Controller | 控制器 |
| ControlPanel | 控制面板 |
| Equipment | 设备 |
| TheServer | 服务器 |
| Computer | 电脑 |
| Television | 电视 |
| Projector | 投影仪 |
| ConferenceScreen | 会议屏 |
| InkScreen | 墨水屏 |
| MobilePhone | 手机 |
| MobileFill | 手机填充 |
| AppletFill | 小程序填充 |
| Applet | 小程序 |
| BluetoothGateway | 蓝牙网关 |
| IndustrialGateway | 工业网关 |
| OffLine | 离线 |
| Electrician | 电工 |
| ElectricWell | 电气井 |
| ElectricalDigital | 电气数字 |
| EnergyConsumption | 能耗 |
| EnergyEfficiency | 能效 |
| PowerConsumptionAnalysis | 用电分析 |
| ComfortIndex | 舒适指数 |
| CarbonDioxide | 二氧化碳 |
| Pm2 | PM2.5 |
| Ammonia | 氨气 |
| HydrogenSulfide | 硫化氢 |
| WindSpeedStrong | 风速强 |
| WindSpeedWeak | 风速弱 |
| Sunshine | 阳光 |
| ThermalRadiation | 热辐射 |
| Suspend | 暂停 |
| ScenarioSwitch | 场景切换 |
| ManualDispatch | 手动调度 |
| Track | 轨迹 |
| Position | 位置 |
| PositionFill | 位置填充 |
| PlateInformation | 车牌信息 |
| Aisle | 通道 |
| HouseNumber | 门牌号 |
| ParkingLot | 停车场 |
| Park | 园区 |

### 建筑/空间类（Building/Space）

| 组件名 | 说明 |
|--------|------|
| Bathroom | 浴室 |
| Closestool | 马桶 |
| SquattingToilet | 蹲便器 |
| Urinal | 小便池 |
| Kitchen | 厨房 |
| KitchenAndToilet | 厨卫 |
| Bodybuilding | 健身 |
| Lounge | 休息室 |
| LoungeTeaRoom | 茶室 |
| LoungeModelLibrary | 模型库 |
| StorageRoom | 储藏室 |
| Office | 办公室 |
| Reception | 前台 |
| ExhibitionHall | 展厅 |
| VideoRoom | 视频室 |
| OutdoorRestArea | 户外休息区 |
| HomeFurnishing | 家居 |
| SoftOutfit | 软装 |
| AnElectricAppliance | 电器 |
| WaterSupplyAndDrainage | 给排水 |

### 排版/对齐类（Alignment）

| 组件名 | 说明 |
|--------|------|
| AlignBottom | 底部对齐 |
| AlignHorizontalCenter | 水平居中 |
| AlignLeft | 左对齐 |
| AlignTop | 顶部对齐 |
| AlignVerticalCenter | 垂直居中 |
| RightAlign | 右对齐 |
| HorizontalAlignmentDistribution | 水平分布 |
| VerticallyAlignedDistribution | 垂直分布 |
| LeftAndRightStretching | 左右拉伸 |
| StretchUpAndDown | 上下拉伸 |
| SymmetricalStretching | 对称拉伸 |
| UnidirectionalTension | 单向拉伸 |
| CopyStretch | 复制拉伸 |
| InsertFloor | 插入楼层 |

### 表单输入类（Form Input）

| 组件名 | 说明 |
|--------|------|
| InputDel | 输入删除 |
| InputError | 输入错误 |
| InputSuccess | 输入成功 |
| InputUser | 输入用户 |

### 其他（Other）

| 组件名 | 说明 |
|--------|------|
| Index | 索引 |
| DetailedInformation | 详细信息 |
| EssentialInformation | 基本信息 |
| Distinguish | 区分 |
| HumanComputerInteraction | 人机交互 |
| DigitalEntertainment | 数字娱乐 |
| PaymentServices | 支付服务 |
| MyService | 我的服务 |
| DataInsight | 数据洞察 |
| SpatialFiltering | 空间过滤 |
| SpaceModel | 空间模型 |
| SpaceTemplate | 空间模板 |
| NaturalCurve | 自然曲线 |
| ToWorkInAnOffice | 办公 |
| Deliver | 交付 |
| WrittenWords | 文字 |

## 与其他组件库的差异

| 差异点 | origami-vue | ant-design-vue | element-plus |
| --- | --- | --- | --- |
| 导入方式 | `origami-vue/es/icon` 独立包 | `@ant-design/icons-vue` | `@element-plus/icons-vue` |
| 使用方式 | 独立组件标签 `<AddFill />` | `<component :is="XxxOutlined" />` | `<el-icon><Xxx /></el-icon>` |
| 动态图标 | 不支持动态名称 | 支持组件动态引用 | 支持组件动态引用 |
| 旋转 | `rotate` prop | `style="transform: rotate()"` | `style="transform: rotate()"` |
| 旋转动画 | `spin` prop | `spin` prop | 不支持 |
