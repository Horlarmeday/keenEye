module.exports = {
  transpileDependencies: true,
  chainWebpack: config => {
    config.module
        .rule('vue')
        .use('vue-loader')
        .tap(options => {
          options.compiler = require('vue-template-babel-compiler')
          return options
        })
  },
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BACKEND_URL,
        changeOrigin: true,
        secure: false
      }
    }
  }
};
