// pages/profile/profile.js

const DATE = require('../../utils/util.js')
const app = getApp()
const db = wx.cloud.database({
  env: 'mydatabase-rwjnb'
})



Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../img/profileS.png',
    hasCount: false,
    disabled:true,
    hasProfession:false,
    signature:'',
    links:0

  },
  onLoad:function(){
    this.showlinks()
    
    
  },
  
  onReady: function () {
   
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then((res) => { //使用DOC可以监听普通ID，但是唯一标识openId需要使用where
       console.log(res);
      db.collection('userprofile').where({
        _openid: res.result.openid
      }).get().then((res) => {
        if(res.data.length){
          app.userInfo = Object.assign(app.userInfo, res.data[0]);
          app.profession=Object.assign(app.userInfo, res.data[0].profession);
          
          this.setData({
            avatarUrl: app.userInfo.avatarUrl,
            nickName: app.userInfo.nickName,
            hasCount: true,
            hasProfession:true,
            signature:app.userInfo.signature
          })
        }else{
          this.setData({
            disabled:false
          })
        }
        
      })
    })
    

  },
  onShow: function () {
    this.showlinks()
    this.setData({
      signature:app.userInfo.signature,
      avatarUrl: app.userInfo.avatarUrl,
      nickName: app.userInfo.nickName,
      hasProfession:app.hasProfession,
    })
  },

  showlinks:function(){
    wx.cloud.callFunction({
      name: 'count',
      data: {}
    }).then((res)=>{
      this.data.links=res.result.data.length
      this.setData({
        links:res.result.data.length
      })
    })
  },
  cancleRgd:function(){
    wx.switchTab({
      url: '../echo/echo',
    })
  },
  tapAbutton:function(){
    wx.navigateTo({
      url: '../professionSelect/professionSelect',
    })
  },

  bindGetUserInfo: function (e) {//首次登录
    console.log(e)
    let userInfo = e.detail.userInfo;
    
    if (!this.data.hasCount && userInfo) { //判断当前环境是否已经注册，是否获得用户授权
      db.collection('userprofile').add({ //上传新建账户数据
        data: {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          profession:app.profession,
          signature: '',
          links: '',
          work:'',
          time: new Date(),
        }
      }).then((res) => {
        db.collection('userprofile').doc(res._id).get().then(((res) => { //将用户数据根据_id调取出来并且赋值给全局对象userInfo
          //  console.log(res.data)
          app.userInfo = Object.assign(app.userInfo, res.data);
          this.setData({
            avatarUrl: app.userInfo.avatarUrl,
            nickName: app.userInfo.nickName,
            signature: app.userInfo.signature,
            hasCount: true
          })
        })).then((res)=>{
          
          wx.switchTab({
            url: '../echo/echo',
          })
        })


      })
    }
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