// miniprogram/pages/record/editKids/editKids.js
const DATE = require('../../../utils/util.js')
const date = new Date()
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 'd77a8c995e96a671001005e64062ded1',
    checkinTime: '2020/4/15 16:14:00',
    checkInDay: '',
    checkInTime: '',
    endTime: '2020/4/15 22:14:00',

    flightTime: '03:00',

    dutyTime: '06:00',

    flightLegs: 0,

    landings: 0,

    remark: 'test',



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

console.log(DATE.appleFormate('2012-02-01'))
    console.log(this.data.checkinTime)
    this.setData({
      id: options.id
    })



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    
    // var id = this.data.id
    // db.collection('timeData').doc(id).get().then((res) => {

    //   let checkintime = DATE.stamptoformatTime(res.data.checkintime-28800000);
    //   let endTime = DATE.stamptoformatTime(res.data.EndTime-28800000)
    //   let dutyTime = DATE.formatHour(res.data.totalDutyTime)
    //   console.log(res)
    //   this.setData({
    //     checkinTime: checkintime,
    //     endTime: endTime,
    //     flightTime: res.data.flightTime,
    //     dutyTime: dutyTime,
    //     flightLegs: res.data.actureFlightLegs,
    //     landings: res.data.actureLandings,
    //     remark: res.data.remarks

    //   })
    // })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var checkInDay = this.data.checkinTime.substring(0, 8);
    var checkInTime = this.data.checkinTime.substring(10, 18);
    var EndDay = this.data.endTime.substring(0, 8);
    var EndTime = this.data.endTime.substring(10, 18);
    this.setData({
      checkInDay: checkInDay,
      checkInTime: checkInTime,
      EndDay: EndDay,
      EndTime: EndTime
    })

  },
  selectCheckInTime: function (e) { //选择签到时间
    this.setData({
      checkInTime: e.detail.value
    })
  },
  selectCheckInDate: function (e) { //选择签到日期
    let date=e.detail.value
    date=DATE.appleFormate(date)
    this.setData({
      checkInDay:date
    })
  },
  selectEndTime: function (e) { //选择结束时间
    this.setData({
      EndTime: e.detail.value
    })
  },

  selectEndDate: function (e) { //选择结束日期
    let EndDate=e.detail.value
    EndDate=DATE.appleFormate(EndDate)
    this.setData({
      EndDay: EndDate
    })
  },

  cancleCHG:function(){
    
    wx.redirectTo({
      url: '../../record/record',
    })
  },


  timeComb:function(){
    var that=this
    var combine=new Promise(function(resolve,reject){
      

      setTimeout(function(){
        let checkIn=DATE.timeToStamp(that.data.checkInDay,that.data.checkInTime);
        let end=DATE.timeToStamp(that.data.EndDay,that.data.EndTime);
        that.setData({
          checkinTime:checkIn,
          endTime:end

        })

        resolve("success");
        reject("failed")
        
        

      },1000)

    })
    return combine
  },
  confirmCHG:function(){
    this.timeComb().then(console.log('success'))
    // db.collection('timeData').doc(id).update({
    //   data:{

    //   }
    // })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})