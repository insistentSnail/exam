module.exports = {
  plugins: {
    "autoprefixer": {
      // "browsers": ['Android >= 4.0', 'iOS >= 7'],
      overrideBrowserslist: [
        "Android 4.1",
        "iOS 7.1",
        "Chrome > 31",
        "ff > 31",
        "ie >= 8"
      ]
    },
    "postcss-pxtorem": {
      "rootValue": 37.5, // 设计稿尺寸/37.5
      "propList": ["*"]
    }
  }
}
