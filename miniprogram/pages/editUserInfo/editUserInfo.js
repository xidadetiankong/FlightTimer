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
      profession: app.userInfo.profession,
      openId: app.userInfo._openid
    })
    console.log(app.userInfo)
  },
  closeAccount: function () {
    var that = this
    wx.showModal({
      content: '账户注销后所有数据都将会删除，确认要继续么(┬＿┬)？',
      confirmColor: '#FFAABB',
      success(res) {
        if (res.confirm) {
          db.collection('timeData').where({
            _openid: that.data.openId
          }).remove({
            success: function (res) {
              db.collection('userprofile').where({
                _openid: that.data.openId
              }).remove({

                success: function (res) {
                  let userInfo = {}
                  app.userInfo = Object.assign(app.userInfo, userInfo)
                 
                  wx.reLaunch({
                    url: '../echo/echo',
                  })
                }
              })
              console.log(res.data)
            }
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }

    })
  },


})