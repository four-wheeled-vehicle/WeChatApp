
let Charts = require('./../../utils/wxcharts.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    happy:0,
    soso:0,
    sad:0,
    unSelect:0,
    dateDay:'',
    txt:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    let date = new Date(year, now.getMonth(), 1).toUTCString();
    
    that.setData({
      dateDay: date,
      year: year,
      month: month+1
    }, function(){
      this.getMonthEmotion(year,month);
    })
  },


  getMonthEmotion: function (year, month){
    var that = this;
    //获取当月第一天Date对象
    let date = that.data.dateDay;
    //实例化查询对象
    console.log(date);
    let now = year ? new Date(year, month) : new Date();
    let setmonth = month || now.getMonth();//没有+1方便后面计算当月总天数
    let nextMonth = (setmonth + 1) > 11 ? 1 : (setmonth + 1);
    console.log(new Date(year, nextMonth, 1));
    let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
    console.log("天数为:" + dayNums);
    var happyday=0;
    var sosoday=0;
    var sadday=0; 
    var unSelect=0;
    let query = new wx.BaaS.Query();
    let Product = new wx.BaaS.TableObject("emotion");
    //设置查询条件
    query.compare('begin_date', '=', date);
    query.compare('created_by', '=', parseInt(app.globalData.userInfo.id));
    Product.setQuery(query).find().then(res =>{
      if (res.data.meta.total_count == 1){
        console.log(res.data.objects[0].emotion);
        let data = res.data.objects[0].emotion;
        for (let i = 0; i < parseInt(dayNums);i++){
          console.log(data[i]);
          if(data[i]==1){
            happyday++;
          } else if (data[i] == 2){
            sosoday++;
          } else if (data[i] == 3){
            sadday++;
          } else if (data[i] == 0){
            unSelect++;
          }
        }
        that.setData({
          happy: happyday,
          soso: sosoday,
          sad: sadday,
          unSelect: unSelect
        },function(){
          this.canvas();
          if (unSelect / dayNums >= 0.9) {
            that.setData({
              txt: '这个月没怎么记录心情哦。'
            })
          } else if (sadday > sosoday && sadday >  happyday) {
            that.setData({
              txt: '嘿，最近的日子…是不是有点难过…原谅我不能递给你一杯热可可，不能带你去吃好吃的炸鸡，但我还是想说…请相信这世界的美好和温暖，请相信未来的希望，请好好的生活下去。'
            })
          } else if (sosoday >= sadday && sosoday >= happyday){
            that.setData({
              txt: '平淡的生活也是一种幸福啊，不过也要记得在生活中给自己一些小惊喜，去吃个大餐吧，去野游吧，或者干脆找个周末睡个懒觉，要开心呐^_^。'
            })      
          } else if (happyday >= sadday && happyday >= sadday){
            that.setData({
              txt: '真开心你度过了一段不错的日子，你一定是个阳光乐观的小可爱，带着你的乐观走下去吧，愿你的生活永远阳光普照^_^，加油哦'
            })   
          }
        })
      } else{
        unSelect = dayNums;
        that.setData({
          unSelect: unSelect,
          happy: 0,
          soso: 0,
          sad: 0,
          txt: '这个月没怎么记录心情哦。'
        },function(){
          that.canvas();
        })
      }
    })
  },
  canvas:function(){
    var that=this;
    new Charts({
      canvasId: 'canvas1',
      type: 'pie',
      series: [
        { name: '开心', data: that.data.happy, color: '#EF92AE' },
        { name: '难过', data: that.data.sad, color: '#B3E6F9' },
        { name: '一般', data: that.data.soso, color: '#F9ECBA' },
        { name: '未选择', data: that.data.unSelect, color: '#DCDCDC' }
      ],
      width: 320,
      height: 280,
      dataLabel: true,
    })
  },

  lastMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    let date = new Date(year, month, 1).toUTCString();
    this.setData({
      year: year,
      month: (month + 1),
      dateDay: date,
    }, function () {
      this.getMonthEmotion(year, month);
    })
    //重新获取心情数据
  },

  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    let date = new Date(year, month, 1).toUTCString();
    this.setData({
      year: year,
      month: (month + 1),
      dateDay: date,
    }, function () {
      this.getMonthEmotion(year, month);
    })
    //重新获取心情数据

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})