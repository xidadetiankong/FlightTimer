// pages/record/record.js
const DATE = require('../../utils/util.js')
const date=new Date()
const db=wx.cloud.database()
const app= getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

currentday:DATE.formatTime(date).substring(0,10),
userID:'',
hasaccount:false,
hidDelview:true,
downloadTimes:1,

temporaryID:0,


DATA:[],
profession:''

  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '最好用的R6执勤期记录APP',
      path: '/page/user?id=123'
    }
  },
  onShareTimeline: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '最好用的R6执勤期记录APP',
      path: '/page/user?id=123'
    }
  },
 onLoad:function(){
   // 在页面中定义插屏广告
let interstitialAd = null

// 在页面onLoad回调事件中创建插屏广告实例
if (wx.createInterstitialAd) {
  interstitialAd = wx.createInterstitialAd({
    adUnitId: 'adunit-ef79a9727360f28c'
  })
  interstitialAd.onLoad(() => {})
  interstitialAd.onError((err) => {})
  interstitialAd.onClose(() => {})
}

// 在适合的场景显示插屏广告
if (interstitialAd) {
  interstitialAd.show().catch((err) => {
    console.error(err)
  })
}
 },
 
  

  onReady:function(){
    this.setData({
      profession:app.userInfo.profession
    })
   
    
  },
  onHide:function(){
    this.setData({
      DATA:[]
    })
  },
  onShow:function(){

    this.initPAGE()
  },


  initPAGE:function(){


    var that = this
    wx.cloud.callFunction({ //只能在此功能中嵌入函数防止不同步的问题
      name: 'count',
      data: {}
    }).then((res) => {
      console.log(res)
      res.result.data.forEach(element => {
        
        
        let EndTime= DATE.stamptoformatTime(element.EndTime-28800000);
        let checkintime1= DATE.stamptoformatTime(element.checkintime-28800000);
        let totalDutyTime= DATE.formatHour(element.totalDutyTime);
         let overTime=element.overTime;
         let actureFlightLegs=element.actureFlightLegs;
         let actureLandings=element.actureLandings;
         let remarks=element.remarks;
         let Eid=element._id;
         let checkintime=element.checkintime;
         let flightTime=DATE.formatHour(element.flightTime);
         let isFlightDuty=element.isFlightDuty;
         let nightFlight=element.nightFlight;
        
          let a={checkintime,EndTime,checkintime1,overTime,totalDutyTime,actureFlightLegs,actureLandings,remarks,Eid,flightTime,isFlightDuty,nightFlight}
          this.data.DATA.push(a)
          
        })
      
      
    }).then((res)=>{//刷新视图层
      let dataT=this.data.DATA.sort(this.compare('checkintime'))
         this.setData({
           DATA:dataT
         })
      console.log(this.data.DATA)
    })

    
  },
  // stamptoformatTime:function(res){
  //   var date = new Date(res);
  //   let year = date.getFullYear().toString()
  //   let month = (date.getMonth() + 1).toString()
  //   let day = date.getDate().toString()
  //   let hour = date.getHours().toString()
  //   let minute = this.formatNumber(date.getMinutes());
  //   let second =  this.formatNumber(date.getSeconds());

  // return year+'/'+month+'/'+ day + ' ' + hour+':'+ minute+':'+ second
    
  // },
  // stamptoformatDay:function(res){
  //   var date = new Date(res);
  //   let year = date.getFullYear().toString()
  //   let month = (date.getMonth() + 1).toString()
  //   let day = date.getDate().toString()
    

  // return year+'/'+month+'/'+ day 
    
  // },
  // formatNumber:function(res)  {
  //   res= res.toString()
  //   return res[1] ? res : '0' + res
  // },

  editKid:function(e){
    console.log(e.currentTarget.id);
    let id = e.currentTarget.id
    
    wx.navigateTo({
      url: '../record/editKids/editKids?id='+id,//同时将参数传入下一层
    })

  },





  deleteKid:function(e){
    
this.setData({//下载过程中将记录id赋值给view对象并通过事件引入逻辑层
  hidDelview:false,
  temporaryID:e.currentTarget.id
})

  },
  cancleDEL:function(){
    
    this.setData({
      hidDelview:true,
      temporaryID:0
    })
  },
  confirmDEL:function(){
    wx.showLoading({
      title: '删除中',
    })
    db.collection('timeData').doc(this.data.temporaryID).remove().then((res)=>{ 
      wx.hideLoading({});
      wx.showToast({
        title: '删除成功',
      });  
      this.setData({
        hidDelview:true,
        temporaryID:0,
        DATA:[]
      })

    }).then((res)=>{
      this.initPAGE()
    })

  },


  // res.result.items.sort(that.compare("id"));
  compare: function (property) {//比值降序函数
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value2 - value1;
    }
 
  },
 

  // addnewrecord:function(){//scroll view 中一定要设置style 中 height 否则真机scrolltobottom不能正常触发
    
  //   var max_limit=20;
  //   var downloadTimes=this.data.downloadTimes//默认第一次加载了20条之后每增加一次加一
  //   db.collection('timeData').where(this.data.userID).skip(downloadTimes*max_limit).limit(max_limit).get().then((res)=>{
  //     res.data.forEach(element => {
        
        
  //     let EndTime= this.stamptoformatTime(element.EndTime-28800000);
  //     let checkintime1= this.stamptoformatTime(element.checkintime-28800000);
  //     let totalDutyTime= DATE.formatHour(element.totalDutyTime);
  //      let overTime=element.overTime;
  //      let actureFlightLegs=element.actureFlightLegs;
  //      let actureLandings=element.actureLandings;
  //      let remarks=element.remarks;
  //      let Eid=element._id;
  //      let checkintime=element.checkintime;
  //      let a={checkintime,EndTime,checkintime1,overTime,totalDutyTime,actureFlightLegs,actureLandings,remarks,Eid,flightTime}
  //       this.data.DATA.push(a)
  //     });
  //    }).then((res)=>{//刷新视图层
  //     console.log(res)
  //      let dataT=this.data.DATA.sort(this.compare('checkintime'))
  //         this.setData({
  //           DATA:dataT,
  //           downloadTimes:downloadTimes+1
  //         })
  //      console.log(this.data.DATA)
  //    })
  // },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})