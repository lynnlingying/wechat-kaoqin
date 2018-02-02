//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data: {
        
    },
    toIndex:function(){
      wx.navigateTo({ url: '../index/index' })
    },
    testCgi: function () {
        util.showBusy('请求中...')
        var that = this
        qcloud.request({
            url: `${config.service.host}/weapp/demo`,
            login: false,
            success (result) {
                util.showSuccess('请求成功完成')
                that.setData({
                    requestResult: JSON.stringify(result.data)
                })
            },
            fail (error) {
                util.showModel('请求失败', error);
                console.log('request fail', error);
            }
        })
    },

    copyCode: function (e) {
        var codeId = e.target.dataset.codeId
        wx.setClipboardData({
            data: code[codeId - 1],
            success: function () {
                util.showSuccess('复制成功')
            }
        })
    },
    submitUser:function(e){
      console.log(e)
      qcloud.request({
        url: `${config.service.registerUser}`,
        data: e.detail.value,
        method:'post',
        login:false,
        success:function(data){
          util.showSuccess('添加用户成功')
        },
        fail(err){
          console.log(err)
          util.showModel('请求失败',err.msg);
        }
      })
    }
})

var code = [
`router.get('/demo', controllers.demo)`,
`module.exports = ctx => {
    ctx.state.data = {
        msg: 'Hello World'
    }
}`
]
