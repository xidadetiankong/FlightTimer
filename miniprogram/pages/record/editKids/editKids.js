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

    //   let checkintime = DATE.stamptoformatTime(res.data.checkintime);
    //   let endTime = DATE.stamptoformatTime(res.data.EndTime)
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

  cancleCHG:function(){
    wx.redirectTo({
      url: '../../record/record',
    })
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