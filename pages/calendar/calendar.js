const app = getApp();
Page({
  data:{
    year:0,
    month:0,
    date:['日', '一', '二', '三', '四', '五', '六'],
    dateArr:[],
    isToday:0,
    isTodayWeek:false,
    todayIndex:0,
    //存储当月心情的心情字符串
    emotionStr:"",
    //存储当天记录的事情
    thingsText: "没有记录东西哦",
    showView: false,
    dateday:''
  },
  /***
   * 获取某年某月的第一天对象，
   */
  getMonthEmotion:function(year,month){
    var that=this;
    //获取当月第一天Date对象
    let date = that.data.dateday;
    //实例化查询对象
    console.log(date);
    let query = new wx.BaaS.Query();
    let Product = new wx.BaaS.TableObject("emotion");
    //设置查询条件
    query.compare('begin_date', '=', date);
    query.compare('created_by', '=', parseInt(app.globalData.userInfo.id));

    Product.setQuery(query).find().then(res =>{
      if(res.data.meta.total_count==1){
          that.setData({
            emotionStr:res.data.objects[0].emotion,
          }, function(){
              this.dateInit(year, month);
          });
        console.log(this.data.emotionStr);  
      }
      else{
        //获取当月的总天数
        var emotion="";
        let now = year ? new Date(year,month) : new Date();
        let setmonth = month || now.getMonth();//没有+1方便后面计算当月总天数
        console.log(setmonth);
        let nextMonth = (setmonth + 1) > 11 ? 1 : (setmonth + 1);
        let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
        console.log("天数为:"+dayNums);
        for(var i=0;i<parseInt(dayNums);i++){
          emotion+="0";
        }
        
        that.setData({
          emotionStr:emotion,
        }, function(){
          this.dateInit(year, month);
        }); 
      }
    });
  }, 


  onLoad:function(){
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let date = new Date(year, now.getMonth(), 1).toUTCString();

        //获取当月的心情字符串
        //this.getMonthEmotion();
        this.setData({
          dateday: date
        },function(){
          this.getMonthEmotion();
        });

        this.dateInit();
        this.setData({
          year: year,
          month: month,
          isToday: '' + year + month + now.getDate()
        });
  },
  dateInit:function(setYear,setMonth){

    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = [];//需要遍历的日历数组数据
    let arrLen = 0;//dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth();//没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay();//目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate();                //获取目标月有多少天
    let obj = {};
    let num = 0;
    let white = false;
    let emotion = 0;
    let todayData = '';
    //因为是从0开始的，天数往后延一天
    console.log(this.data.emotionStr);

    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {      
      if (i >= startWeek) {
        emotion = parseInt(this.data.emotionStr[i - startWeek]);
        console.log(emotion);
        num = i - startWeek + 1;
        todayData = new Date(year,month,num).toUTCString();
        obj = {
          isToday:'' + year + (month + 1) + num,
          dateNum: num,
          weight: 5,
          white: true,
          //添加心情字符串
          emotionstr:emotion,
          todayData: todayData
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr:dateArr
    })

    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;

    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },

  lastMonth: function(){
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    let date = new Date(year, month, 1).toUTCString();
    this.setData({
      year:year,
      month:(month + 1),
      dateday: date,
      showView:false
    },function(){
      this.getMonthEmotion(year, month);
    })
    //重新获取心情数据
  },

  nextMonth: function (){
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    let date = new Date(year, month, 1).toUTCString();
    this.setData({
      year: year,
      month: (month + 1),
      dateday:date,
      showView:false
    },function(){
      this.getMonthEmotion(year, month);
    })
    //重新获取心情数据

  },

  onChangeShowState:function(event){
    var that = this;
    console.log(event.currentTarget.dataset.day);
    let query = new wx.BaaS.Query();
    let Product = new wx.BaaS.TableObject("record");
    //设置查询条件
    query.compare('event_date', '=', event.currentTarget.dataset.day);
    query.compare('created_by', '=', parseInt(app.globalData.userInfo.id));
    Product.setQuery(query).find().then(res => {
      if (res.data.meta.total_count == 1){
        that.setData({
          thingsText: res.data.objects[0].event,
          showView: true
        })
      }else{
        that.setData({
          thingsText: '没有记录东西哦。',
          showView: true
        })
      }
    })


  }
})