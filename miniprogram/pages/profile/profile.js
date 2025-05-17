// pages/profile/profile.js

const DATE = require('../../utils/util.js')
const app = getApp()




Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../img/profileS.png',
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '最好用的执勤期APP',
      path: '/page/user?id=123'
    }
  },
  onShareTimeline: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '最好用的执勤期APP',
      path: '/page/user?id=123'
    }
  },
  onLoad:function(){
  
  },
  
  onReady: function () {
   
   
    

  },
  onShow: function () {
   
  },







  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '大家都在用的值勤时间记录小程序',
      imageUrl: '../../img/shareimage1.png'
    }

  },
  onPullDownRefresh:function(){

  }
})