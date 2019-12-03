module.exports = {
  publicPath: './',
  devServer: {
    proxy: {
      '/': {
        target: 'http://doreen.wicp.net:18060',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/': '/'
        }
      },
    }
  }
}