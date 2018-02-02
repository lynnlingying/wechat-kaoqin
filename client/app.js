//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
  //监听小程序初始化
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    }
})