var util = require('../../utils/util.js');
var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
var flag_hd = true; 
const app = getApp()
Page({
  data:{
    tips:'今天心情怎么样丫',
    iconColor1:'#B4B4B4',
    iconColor2:'#B4B4B4',
    iconColor3:'#B4B4B4',
    ani:null,
    choseData:"0",
    total_count:0,
    Month:0,
    //获取天数
    Day:0,
    emotion:"",
    //本月的心情数据是否存在，1表示存在，0表示不存在
    exists:0,
    //心情数据的ID，用于修改
    emotionId:0,
    //本月的第一天对象
    date:new Date()
  }, 
  onShow: function () {
    flag_hd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
  // 触摸开始事件
  touchStart:function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸结束事件
  touchEnd: function (e) {
    var touchMove = e.changedTouches[0].pageX;
    // 向左滑动   
    if (touchMove - touchDot <= -40 && time < 10 && flag_hd == true) {
      flag_hd = false;
      //执行切换页面的方法
      console.log("向右滑动");
      wx.navigateTo({
        url: '../calendar/calendar'
      })
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
  bindViewTap:function(){
    wx.navigateTo({
      url: '../calendar/calendar'
    })
  },
  bindThingTap: function () {
    wx.navigateTo({
      url: '../things/things'
    })
  },
  bindchartsTap: function () {
    wx.navigateTo({
      url: '../charts/charts'
    })
  },
  changeicon1:function(){
    var that = this
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    });
    animation.opacity(0.2).scale(1.1).step()
    animation.opacity(1).scale(1).step()
    this.setData({
      ani1: animation.export(),
      iconColor1:'#DC4C40',
      iconColor2:'#B4B4B4',
      iconColor3:'#B4B4B4',
      tips:'主人今天很开心呢~',
      choseData:"1"
    })
  },
  changeicon2: function (){
    var that = this
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay:0
    });
    animation.opacity(0.2).scale(1.1).step()
    animation.opacity(1).scale(1).step()
    this.setData({
      ani2: animation.export(),
      iconColor1:'#B4B4B4',
      iconColor2:'#87D454',
      iconColor3:'#B4B4B4',
      tips:'出去散散步吧！',
      choseData:"2"
    })
  },
  changeicon3: function () {
    var that=this
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    }); 
    animation.opacity(0.2).scale(1.1).step()
    animation.opacity(1).scale(1).step()
    that.setData({
      ani3: animation.export(),
      iconColor1: '#B4B4B4',
      iconColor2: '#B4B4B4',
      iconColor3: '#607FB5',
      tips:'别~难~过~啦~',
      choseData:"3"
    })
  },

  //获取修改后的本月的心情信息
  getEmotion:function(total_data,strs){
    var str="";
    var curDate = new Date();
    // 获取当前月份 
    var curMonth = curDate.getMonth();
    // 生成实际的月份: 由于curMonth会比实际月份小1, 故需加1
    curDate.setMonth(curMonth + 1);
    // 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 
    curDate.setDate(0);
    var days=curDate.getDate();    
    //如果之前本月在数据库中没有数据，则产生一条新数据
    if (total_data==0){
    for(var i=1;i<=days;i++){
      if(i==parseInt(this.data.Day)){
        str += this.data.choseData;
      }else{
        str+="0"
      }
    }
    }
    //如果本月之前在数据库中有数据，则修改数据后再上传
    else{
      str = strs.substring(0, this.data.Day - 1) + this.data.choseData + strs.substring(this.data.Day,strs.length);
    }
    return str;
  },
  onLoad:function (options){
    
    var that=this
    var M=new Date().getMonth()+1; 
    var D=new Date().getDate()
    this.setData({
      M: M, 
      D: D,
      Month:M,
      Day:D
    });

  },

  /**
 * 生命周期函数--监听页面隐藏
 * 当离开该页面时，将心情信息保存到数据库中
 */
  onHide:function(){

  },
  bindViewTap:function(){
    var that = this;

    //实例化查询对象
    let query = new wx.BaaS.Query();

    //获取本月第一天Date对象
    let dates = new Date();
    dates.setDate(1);
    let date = new Date(dates.getFullYear(), dates.getMonth(), dates.getDate()).toUTCString();

    //设置查询条件
    query.compare('created_by', '=', parseInt(app.globalData.userInfo.id));
    query.compare('begin_date', '=', date);

    //确认本月的心情数据是否在数据库中
    let Product = new wx.BaaS.TableObject("emotion");
    Product.setQuery(query).find().then(res => {
      //查看本月是否已经有数据，有为1，没有为0
      let total_count = res.data.meta.total_count;
      //如果有数据的话，先把本月的心情数据获取，再修改再传上去
      let str = "";
      let strid = 0;
      if (total_count == 1) {
        //获取心情数据
        str = res.data.objects[0].emotion;
        //获取数据行id，更新用
        strid = res.data.objects[0].id;
        console.log(strid);
        //将心情数据存储在全局心情对象中
        app.globalData.emotionStr = str;
      }

      //获取心情数据
      this.setData({
        emotion: this.getEmotion(res.data.meta.total_count, str)
      });

      //如果原数据库中没有数据，则加入数据进入
      if (total_count == 0) {
        let data = {
          begin_date: date,
          emotion: that.data.emotion
        }
        //将心情数据存储在全局心情对象中
        app.globalData.emotionStr = this.data.emotion;

        let table = Product.create();
        table.set(data).save().then(res => {
          console.log("success");
        }, err => {
          console.log("error");
        });
      }

      //如果有数据，修改数据再传上去
      else {
        //防止用户再次离开页面却没有修改时将数据清零
        if (that.data.choseData != "0") {
          //将心情数据存储在全局心情对象中
          app.globalData.emotionStr = that.data.emotion;
          console.log(strid);
          //通过ID获取原数据在哪一行
          let table = Product.getWithoutData(strid);
          //设置修改后的数据
          table.set('emotion', that.data.emotion);
          //将修改后的数据传上去
          table.update().then(res => {
            console.log("success");
          }, err => {
            console.log(err);
          });
        }
      }
    });
    console.log(app.globalData.emotionStr);

    wx.navigateTo({
      url:'../calendar/calendar',
    })
  }
})