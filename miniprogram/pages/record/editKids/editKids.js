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




  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    console.log(this.data.checkinTime)
    this.setData({
      id: options.id,
      profession:app.userInfo.profession
    })



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this

    this.getData().then(that.transTime())




  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {


  },

  //数据输入

  selectCheckInTime: function (e) { //选择签到时间
    this.setData({
      checkInTime: e.detail.value
    })
  },
  selectCheckInDate: function (e) { //选择签到日期
    let date = e.detail.value
    date = DATE.appleFormate(date)
    this.setData({
      checkInDay: date
    })
  },
  selectEndTime: function (e) { //选择结束时间
    this.setData({
      EndTime: e.detail.value
    })
  },

  selectEndDate: function (e) { //选择结束日期
    let EndDate = e.detail.value
    EndDate = DATE.appleFormate(EndDate)
    this.setData({
      EndDay: EndDate
    })
  },
  selectDutyTime: function (e) { //选择结束时间
    this.setData({
      dutyTime: e.detail.value
    })
  },
  selectFlightTime: function (e) { //选择结束时间
    this.setData({
      flightTime: e.detail.value
    })
  },
  inputFltLegs: function (ev) {
    let value = ev.detail.value;
    this.data.flightLegs = parseInt(value)

  },
  inputLandings: function (ev) {
    let value = ev.detail.value;
    this.data.landings = parseInt(value)

  },
  remarks: function (ev) {
    let value = ev.detail.value;
    this.data.remarks = value

  },



  //按钮区
  cancleCHG: function () {

    wx.redirectTo({
      url: '../../record/record',
    })
  },
  confirmCHG: function () {
    var that = this

   

      
      wx.showLoading({
        title: '更新中',
      }),
      db.collection('timeData').doc(that.data.id).update({
        data: {
          checkintime: DATE.timeToStamp(that.data.checkInDay, that.data.checkInTime),
          EndTime: DATE.timeToStamp(that.data.EndDay, that.data.EndTime),
          flightTime: DATE.timeToStamp('1970/01/01', that.data.flightTime),
          totalDutyTime: DATE.timeToStamp('1970/01/01', that.data.dutyTime),
          actureFlightLegs: that.data.flightLegs,
          actureLandings: that.data.landings,
          remarks: that.data.remarks

        }
      }).then((res) => {
        wx.hideLoading({
          complete: (res) => {
            wx.showToast({
              title: '成功',
            })

            wx.redirectTo({
              url: '../../record/record',
            })
          },
        })
        
      })


    

  },

  //功能函数
  transTime: function () {


    var that = this
    var transT = new Promise(function (resolve, reject) {


      setTimeout(function () {
        var checkInDay = that.data.checkinTime.substring(0, 9);
        var checkInTime = that.data.checkinTime.substring(10, 18);
        var EndDay = that.data.endTime.substring(0, 9);
        var EndTime = that.data.endTime.substring(10, 18);
        that.setData({
          checkInDay: checkInDay,
          checkInTime: checkInTime,
          EndDay: EndDay,
          EndTime: EndTime
        })


      }, 5000)

    })
    return transT

  },
  timeComb: function () {
    var that = this
    var combine = new Promise(function (resolve, reject) {


      setTimeout(function () {
        let checkIn = DATE.timeToStamp(that.data.checkInDay, that.data.checkInTime);
        let end = DATE.timeToStamp(that.data.EndDay, that.data.EndTime);
        that.setData({
          checkinTime1: checkIn,
          endTime1: end

        })

        resolve("success");
        reject("failed")



      }, 20)

    })
    return combine
  },
  getData: function () {
    var that = this
    var hasData = new Promise(function (resolve, reject) {


      setTimeout(function () {
        var id = that.data.id
        db.collection('timeData').doc(id).get().then((res) => {

          let checkintime = DATE.stamptoformatTime(res.data.checkintime - 28800000);
          let endTime = DATE.stamptoformatTime(res.data.EndTime - 28800000);
          let dutyTime = DATE.formatHour(res.data.totalDutyTime);
          let flightTime= DATE.formatHour(res.data.flightTime)
          console.log(res)
          that.setData({
            checkinTime: checkintime,
            endTime: endTime,
            flightTime: flightTime,
            dutyTime: dutyTime,
            flightLegs: res.data.actureFlightLegs,
            landings: res.data.actureLandings,
            remarks: res.data.remarks

          })
        })

        resolve("success");
        reject("failed")



      }, 1000)

    })
    return hasData
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