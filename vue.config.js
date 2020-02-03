module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  publicPath: './',
  configureWebpack: {
    externals: {
      "vue": "Vue",
      "vuex": "Vuex",
      "vue-router": "VueRouter",
      "axios": "axios"
    }
  }
}