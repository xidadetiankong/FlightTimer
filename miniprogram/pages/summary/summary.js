// pages/summary/summary.js
const DATE = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
 
  findthespa:function(){
    var DATA=this.data.DATA;
    var lastwork=DATA[0];
    var penultwork=DATA[1];
    var lastcheckout=penultwork.EndTime;
    var lastcheckin=lastwork.checkintime;
    var sishiba=172800000;
    var yaosisi=518400000;
    if((lastcheckin-lastcheckout)<sishiba){
      var timeInlimit=[]
      DATA.forEach(element => {
        let lastyaosisi=lastcheckin-yaosisi;
        if(element.checkintime>lastyaosisi){
          timeInlimit.push(element.EndTime);
          timeInlimit.push(element.checkintime);
          
        }
      });
      
    }

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