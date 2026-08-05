import * as echarts from 'echarts'

const CHINA_MAP_NAME = 'china'
const CHINA_OUTLINE_MAP_NAME = 'china-map-outline'

const DEFAULT_SAFE_INSET = 64

const LEGACY_LAYOUT = Object.freeze({
  outlineCenter: ['50%', '40%'],
  mapCenter: ['50%', '42%'],
  size: '105%',
})

const DEFAULT_COLORS = Object.freeze({
  area: 'rgba(29, 49, 64, 0.5)',
  border: '#b4eafc',
  bottomOutline: '#00ffff',
  topOutline: '#b4eafc',
  shadow: '#000000',
})

let registrationPromise = null

function resolveModule(module) {
  return module?.default || module
}

function resolveCenter(value, fallback) {
  return Array.isArray(value) && value.length === 2 ? [...value] : [...fallback]
}

function resolveString(value, fallback) {
  return typeof value === 'string' && value ? value : fallback
}

function resolveDimension(value, fallback) {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) return value
  if (typeof value === 'string' && value.trim()) return value
  return fallback
}

function hasLegacyLayout(layout) {
  return layout.mode === 'legacy'
    || Object.prototype.hasOwnProperty.call(layout, 'outlineCenter')
    || Object.prototype.hasOwnProperty.call(layout, 'mapCenter')
    || Object.prototype.hasOwnProperty.call(layout, 'size')
}

function resolveLayouts(layout) {
  if (hasLegacyLayout(layout)) {
    const layoutSize = resolveString(layout.size, LEGACY_LAYOUT.size)
    return {
      outline: {
        layoutCenter: resolveCenter(layout.outlineCenter, LEGACY_LAYOUT.outlineCenter),
        layoutSize,
      },
      map: {
        layoutCenter: resolveCenter(layout.mapCenter, LEGACY_LAYOUT.mapCenter),
        layoutSize,
      },
    }
  }

  const inset = resolveDimension(layout.inset, DEFAULT_SAFE_INSET)
  const fit = {
    top: resolveDimension(layout.top, inset),
    right: resolveDimension(layout.right, inset),
    bottom: resolveDimension(layout.bottom, inset),
    left: resolveDimension(layout.left, inset),
  }
  return { outline: fit, map: fit }
}

function createBaseMap({ map, layout, z }) {
  return {
    map,
    aspectScale: 1,
    roam: false,
    silent: true,
    zoom: 1,
    ...layout,
    selectedMode: false,
    z,
    zlevel: 0,
    label: { show: false },
    select: { disabled: true },
    emphasis: {
      disabled: true,
      label: { show: false },
    },
  }
}

export function ensureChinaMapRegistered() {
  if (echarts.getMap(CHINA_MAP_NAME) && echarts.getMap(CHINA_OUTLINE_MAP_NAME)) {
    return Promise.resolve()
  }

  if (!registrationPromise) {
    registrationPromise = Promise.all([
      import('@/assets/map/china/china.json'),
      import('@/assets/map/china/china-map-outline.js'),
    ])
      .then(([chinaModule, outlineModule]) => {
        if (!echarts.getMap(CHINA_MAP_NAME)) {
          echarts.registerMap(CHINA_MAP_NAME, resolveModule(chinaModule))
        }
        if (!echarts.getMap(CHINA_OUTLINE_MAP_NAME)) {
          echarts.registerMap(CHINA_OUTLINE_MAP_NAME, resolveModule(outlineModule))
        }
      })
      .catch((error) => {
        registrationPromise = null
        throw error
      })
  }

  return registrationPromise
}

export function createChinaMapOption({ overrides = {} } = {}) {
  const layout = overrides?.layout || {}
  const colors = overrides?.colors || {}
  const resolvedLayouts = resolveLayouts(layout)
  const areaColor = resolveString(colors.area, DEFAULT_COLORS.area)
  const borderColor = resolveString(colors.border, DEFAULT_COLORS.border)
  const bottomOutlineColor = resolveString(colors.bottomOutline, DEFAULT_COLORS.bottomOutline)
  const topOutlineColor = resolveString(colors.topOutline, DEFAULT_COLORS.topOutline)
  const shadowColor = resolveString(colors.shadow, DEFAULT_COLORS.shadow)

  return {
    animation: false,
    geo: {
      ...createBaseMap({
        map: CHINA_OUTLINE_MAP_NAME,
        layout: resolvedLayouts.outline,
        z: 0,
      }),
      id: 'china-outline-shadow-bottom',
      itemStyle: {
        areaColor: 'transparent',
        borderColor: bottomOutlineColor,
        borderWidth: 4,
        shadowColor,
        shadowOffsetX: 0,
        shadowOffsetY: 17,
        shadowBlur: 42,
      },
    },
    series: [
      {
        ...createBaseMap({
          map: CHINA_MAP_NAME,
          layout: resolvedLayouts.map,
          z: 1,
        }),
        id: 'china-base-map',
        name: 'China map',
        type: 'map',
        data: [],
        itemStyle: {
          areaColor,
          borderColor,
          borderWidth: 1,
        },
      },
      {
        ...createBaseMap({
          map: CHINA_OUTLINE_MAP_NAME,
          layout: resolvedLayouts.outline,
          z: 2,
        }),
        id: 'china-outline-shadow-top',
        name: 'China outline',
        type: 'map',
        data: [],
        itemStyle: {
          areaColor: 'transparent',
          borderColor: topOutlineColor,
          borderWidth: 4,
          shadowColor,
          shadowOffsetX: 0,
          shadowOffsetY: -17,
          shadowBlur: 42,
        },
      },
    ],
  }
}
