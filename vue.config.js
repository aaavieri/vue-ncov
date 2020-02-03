const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']

module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  productionSourceMap: false,
  publicPath: './',
  configureWebpack: {
    externals: {
      "vue": "Vue",
      "vuex": "Vuex",
      "vue-router": "VueRouter",
      "axios": "axios",
      "echarts": "echarts",
      'element-ui': 'Element'
    },
    plugins: process.env.NODE_ENV === 'production' ? [new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8
    })] : []
  }
}