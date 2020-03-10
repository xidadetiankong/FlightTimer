// pages/editUserInfo/editUserInfo.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickName: '',
    signature: '',
    profession: ''
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

    this.setData({
      avatarUrl: app.userInfo.avatarUrl,
      nickName: app.userInfo.nickName,
      signature: app.userInfo.signature,
      profession: app.userInfo.profession
    })
    console.log(app.userInfo)
  },
  

})