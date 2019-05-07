//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.redirectTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;

    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("进入验证页面");
          wx.BaaS.auth.getCurrentUser().then(user => {
            this.globalData.userInfo = user;
            console.log(user);
          }).catch(err => {
            // HError  
            if (err.code === 404) {
              console.log('用户未登录')
            }
          })
        }
      }
    })
  },
  //获取用户权限，弹出框
  getUserInfo:function (e){
    if (e.detail.userInfo) {
      this.setData({
        hasUserInfo:true
      });
      // 微信用户登录小程序
      wx.BaaS.auth.loginWithWechat().then(user => {
        console.log("微信授权登录")
        app.globalData.userInfo=user;
        console.log(app.globalData.userInfo);
      }, err => {

      })
      wx.redirectTo({
        url: '../index/index',
      })
    }
    else {
      wx.navigateTo({
        url: '../authorize/authorize'
      })
    }
  },
})