const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data:{
    //该天是否已经记录了事情，默认为0表示没有记录
    exists:0,
    //记录的事情内容
    content:"",
    //今天的日期对象
    today:new Date(),
    //要修改时应获取其ID
    tableId:0
  },
  //获取文本框中输入的数据
  getInfo:function(e){
    this.setData({
      content:e.detail.value
    });
  },
  //获取今天的日期对象
  getDateToday:function(){
    var date=new Date();
    var dates = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toUTCString();
    this.setData({
      today:dates
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options){
    var that=this;
    //获取今天的日期对象
    this.getDateToday();
    
    //从数据库中是否能获得今天的日志记录
    let tableName="record";
    //实例化查询条件
    let query=new wx.BaaS.Query();

    //设置查询条件
    query.compare('event_date','=',this.data.today);
    query.compare('created_by','=',parseInt(app.globalData.userInfo.id));

    //确认今天是否已经记录
    let Product = new wx.BaaS.TableObject(tableName);
    Product.setQuery(query).find().then(res=>{
      console.log(res.data.meta.total_count);
     that.setData({
        exists:res.data.meta.total_count
      });

      //如果今天有记录
      if (that.data.exists==1){
        //显示在其中
        this.setData({
          content:res.data.objects[0].event,
          tableId:res.data.objects[0].id
        });
      }
      
    },err=>{
      console.log(err);
    });
  },
  /**
   * 跳转日历页
   */
  bindViewTap:function(){
    wx.navigateTo({
      url: '../calendar/calendar'
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady:function(){

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(){
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide:function(){
    var that=this;
    //判断输入的不为空
    if (this.data.content.trim()!=""&&this.data.content.trim()!=null){
      let tableName='record';

      //判断之前是否有数据，以确定是否为增加或修改
      //如果之前有数据，执行修改操作
      if (this.data.exists==1){
        let MyTableObject = new wx.BaaS.TableObject(tableName);
        let product = MyTableObject.getWithoutData(this.data.tableId);

        product.set('event',this.data.content);

        product.update().then(res=>{
          console.log("success");
        },err=>{
          console.log("error");
        })
      }
      //如果原来没有数据，则新添加一条数据
      else{
        let MyTableObject = new wx.BaaS.TableObject(tableName);
        //创造数据
        let product=MyTableObject.create();
        let data={
          'event':that.data.content,
          'event_date':that.data.today
        }
        product.set(data).save().then(res=>{
          console.log("success");
        },err=>{
          console.log(err);
        });
      }
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function(){

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