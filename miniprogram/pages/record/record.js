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


DATA:[]

  },

  bindDateChange:function(e){
    console.log(e)
    this.setData({
      currentday:e.detail.value
    })
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
   
    db.collection('timeData').where(this.data.userID).get().then((res)=>{
     res.data.forEach(element => {
       
       
     let EndTime= this.stamptoformatTime(element.EndTime-28800000);
     let checkintime= this.stamptoformatTime(element.checkintime-28800000);
     let totalDutyTime= DATE.formatHour(element.totalDutyTime);
      let overTime=element.overTime;
      let actureFlightLegs=element.actureFlightLegs;
      let actureLandings=element.actureLandings;
      let remarks=element.remarks
      let a={EndTime,checkintime,overTime,totalDutyTime,actureFlightLegs,actureLandings,remarks}
       this.data.DATA.push(a)
     });
    }).then((res)=>{//刷新视图层
      this.setData({
        DATA:this.data.DATA
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
  formatNumber:function(res)  {
    res= res.toString()
    return res[1] ? res : '0' + res
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})