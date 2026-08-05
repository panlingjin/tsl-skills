const path = require('node:path')

const resolve = (target) => path.resolve(__dirname, target)
const proxyTarget = process.env.VUE_APP_API_PROXY_TARGET

module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH || '/',
  productionSourceMap: false,
  chainWebpack(config) {
    config.resolve.alias.set('@', resolve('src'))

    config.module.rule('svg').exclude.add(resolve('src/assets/icons'))
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId(filePath) {
          const relativePath = path
            .relative(resolve('src/assets/icons/svg'), filePath)
            .replace(/\\/g, '/')
            .replace(/\.svg$/, '')
          return `icon-${relativePath.replace(/\//g, '-')}`
        },
      })
  },
  devServer: {
    ...(proxyTarget
      ? {
          proxy: {
            '/api': {
              target: proxyTarget,
              changeOrigin: true,
            },
          },
        }
      : {}),
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
}
