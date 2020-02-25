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
ind:[1,2,34,4,5],
currentday:DATE.formatTime(date).substring(0,10),
userID:'',
checkindate:'2020-02-25 10:20',
checkoutdate:'2020-02-25  10:20',
dutytime:'10:22',
flightlegs:0,
landings:0



  },

  bindDateChange:function(e){
    console.log(e)
    this.setData({
      currentday:e.detail.value
    })
  },
  onShow: function () {
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
            
          })
        }
        
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})