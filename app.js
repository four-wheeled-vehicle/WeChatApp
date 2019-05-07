//app.js
App({
  //首次调用小程序触发
  onLaunch:function(){
    
    var that=this;


    wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
      wx.getUserInfo,
      wx.requestPayment)

    wx.BaaS.init('caed511a2947db7640f2',{autoLogin:false})

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success:res=>{
        if (res.authSetting['scope.userInfo']){
          // 微信用户登录小程序
          wx.BaaS.auth.loginWithWechat().then(user => {
            that.globalData.userInfo=user;
            console.log(user);
          },err =>{
            // 登录失败
          })
        }else{
          // 未授权，跳转到授权页面
          wx.reLaunch({
            url: '/pages/authorize/authorize',
          })
        }
      }
    });
  },
  globalData:{
    userInfo:null,
    openid:null,
    emotionStr:""
  },
})