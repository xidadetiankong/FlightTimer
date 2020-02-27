// pages/summary/summary.js
const DATE = require('../../utils/util.js')
const date=new Date()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    predresttime:0,
DATA:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.cloud.callFunction({
      name: 'count',
      data: {}
    }).then((res)=>{
      console.log(res)
      let dataT=res.result.data.sort(DATE.compare('checkintime'))
          this.setData({
            DATA:dataT
          })
    })
  },
 
  findthespa:function(){//计算四十八小时休息期返回预测的下一个48开始时间同时判断航后10小时休息是否满足
    var DATA=this.data.DATA;
    var lastwork=DATA[0];
    
    var lastcheckout=lastwork.EndTime;
    
    var sishiba=172800000;
    var yaosisi=518400000;
    var calcuStart=0;//推算开始时刻
    var predresttime=0;//预计休息开始时刻
   
    var day=DATE.dayNow(date);
    var time=DATE.timeNow(date)
   
    var presentTime=DATE.timeToStamp(day,time)
    console.log(presentTime)
    if((presentTime-lastcheckout)<sishiba){
      var timeInlimit=[presentTime]
      DATA.forEach(element => {
        let lastyaosisi=presentTime-yaosisi;//检索最近144小时内所有签到截止时间放入timeinlimit
        if(element.checkintime>lastyaosisi){
          timeInlimit.push(element.EndTime);
          timeInlimit.push(element.checkintime);
          
        }
      });
      console.log(timeInlimit)
      var resttimelist=[]
      var num=/[0-9]/
      if(timeInlimit[timeInlimit.length].checkintime-lastyaosisi>sishiba){//判断最久一次签到时间到144的休息间隔是否满足sishiba
        calcuStart=timeInlimit[timeInlimit.length].checkintime;
          predresttime=calcuStart-sihsiba+yaosisi
          return
      }else{
        for(let i=0;i<timeInlimit.length;i=i+2){
        let rest =timeInlimit[i]-timeInlimit[i+1];
        if(rest>=sishiba&&num.test(rest)){//判断是否有大于48小时的休息期
          calcuStart=timeInlimit[i];
          predresttime=calcuStart-sihsiba+yaosisi//基于此次大于48小时休息期的签到时间前推48后再后推144得出下次休息时间开始
          this.setData(
           { predresttime:predresttime}
          )
            console.log(predresttime)
        }else{
          wx.showToast({
            title: '最近一次任务前144小时内未满足48小时休息',
            icon:'none'
          })
        }
        
        // if(num.test(rest)){resttimelist.push(rest)}//将有效的数字加入数组中
        
      }}
      

      
      
    }else if((presentTime-lastcheckout)<36000000){
      wx.showToast({
        title: '最少10小时休息未满足要求哦',
        icon:'none'
      })
    }else if((presentTime-lastcheckout)>=sishiba){//存在有大于等于四十八的休息期
      predresttime=presentTime-sishiba+yaosisi//算出下次休息时间的开始
      this.setData({
        predresttime:predresttime
      })

    }
    console.log(this.data.predresttime)

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