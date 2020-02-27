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


DATA:[]

  },

  
 
 
  

 onReady:function(){
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then((res) => { //使用DOC可以监听普通ID，但是唯一标识openId需要使用where
      // console.log(res);
      db.collection('userprofile').where({
        _openid: res.result.openid
      }).get().then((res) => {
        if(res.data.length){
          app.userInfo = Object.assign(app.userInfo, res.data[0]);
          this.setData({
            
            userID: app.userInfo._id,
            hasaccount:true
            
          })
        }
        
      })
    })

  },
  onReady:function(){
   
    this.initPAGE()
  },


  initPAGE:function(){

    db.collection('timeData').where(this.data.userID).get().then((res)=>{
      res.data.forEach(element => {
        
        
      let EndTime= this.stamptoformatTime(element.EndTime-28800000);
      let checkintime1= this.stamptoformatTime(element.checkintime-28800000);
      let totalDutyTime= DATE.formatHour(element.totalDutyTime);
       let overTime=element.overTime;
       let actureFlightLegs=element.actureFlightLegs;
       let actureLandings=element.actureLandings;
       let remarks=element.remarks;
       let Eid=element._id;
       let checkintime=element.checkintime;
       let a={checkintime,EndTime,checkintime1,overTime,totalDutyTime,actureFlightLegs,actureLandings,remarks,Eid}
        this.data.DATA.push(a)
      });
     }).then((res)=>{//刷新视图层
       let dataT=this.data.DATA.sort(this.compare('checkintime'))
          this.setData({
            DATA:dataT
          })
       console.log(this.data.DATA)
     })
  },
  stamptoformatTime:function(res){
    var date = new Date(res);
    let year = date.getFullYear().toString()
    let month = (date.getMonth() + 1).toString()
    let day = date.getDate().toString()
    let hour = date.getHours().toString()
    let minute = this.formatNumber(date.getMinutes());
    let second =  this.formatNumber(date.getSeconds());

  return year+'-'+month+'-'+ day + ' ' + hour+':'+ minute+':'+ second
    
  },
  stamptoformatDay:function(res){
    var date = new Date(res);
    let year = date.getFullYear().toString()
    let month = (date.getMonth() + 1).toString()
    let day = date.getDate().toString()
    

  return year+'-'+month+'-'+ day 
    
  },
  formatNumber:function(res)  {
    res= res.toString()
    return res[1] ? res : '0' + res
  },
  
//   bindDateChange:function(e){
    
//     var DATA=this.data.DATA
//     var c=[]
//    DATA.forEach(element=>{
     
//      let checkintime=this.stamptoformatDay(element.checkintime-28800000);
//      var value=e.detail.value
//      var aa =DATE.timeToStamp(checkintime,'00:00');
//      var bb=DATE.timeToStamp(value,'00:00');
//      console.log(aa,bb)
//  if(aa===bb){
//    c.push(element)
//    return

//   }else{
//     return
//   }
// })
//刷新视图层
  
  //    this.setData({
  //      DATA:c,
  //      currentday:e.detail.value
  //    })
  // console.log(this.data.DATA)




  // },




  deleteKid:function(e){
    console.log(e);
this.setData({
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
  onPullDownRefresh:function(){
   
      wx.stopPullDownRefresh({
        complete: (res) => {
          this.initPAGE();
        },
      })
    
      
      
   
  },

  addnewrecord:function(){
    
    var max_limit=20;
    var downloadTimes=this.data.downloadTimes//默认第一次加载了20条之后每增加一次加一
    db.collection('timeData').where(this.data.userID).skip(downloadTimes*max_limit).limit(max_limit).get().then((res)=>{
      res.data.forEach(element => {
        
        
      let EndTime= this.stamptoformatTime(element.EndTime-28800000);
      let checkintime1= this.stamptoformatTime(element.checkintime-28800000);
      let totalDutyTime= DATE.formatHour(element.totalDutyTime);
       let overTime=element.overTime;
       let actureFlightLegs=element.actureFlightLegs;
       let actureLandings=element.actureLandings;
       let remarks=element.remarks;
       let Eid=element._id;
       let checkintime=element.checkintime;
       let a={checkintime,EndTime,checkintime1,overTime,totalDutyTime,actureFlightLegs,actureLandings,remarks,Eid}
        this.data.DATA.push(a)
      });
     }).then((res)=>{//刷新视图层
      console.log(res)
       let dataT=this.data.DATA.sort(this.compare('checkintime'))
          this.setData({
            DATA:dataT,
            downloadTimes:downloadTimes+1
          })
       console.log(this.data.DATA)
     })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})