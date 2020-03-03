// miniprogram/pages/professionSelect/professionSelect.js
const DATE = require('../../utils/util.js')
const app = getApp()
const db = wx.cloud.database({
  env: 'mydatabase-rwjnb'
}) //need designate an envirment id
const date = new Date()
Page({

  data: {
    userID:'',
    profession:'',
    hasAccount:false,
    hasProfession:false
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
            hasAccount:true
            
          })
        }
        
      })
    })
  },
  onReady: function () {
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
            hasAccount:true
            
          })
        }
        
      })
    })


  },

pilot:function(e){
  console.log(e)
  if(this.data.hasAccount){
    wx.showLoading({
      title: '更新职业中',
    })
    db.collection('userprofile').doc(app.userInfo._id).update({
      data:{
        profession:e.currentTarget.id
      }
    }).then((res)=>{
      wx.hideLoading({});
      wx.showToast({
        title: '更新成功',
      })
      app.profession=e.currentTarget.id;
      wx.switchTab({
        url: '../echo/echo',
      })
    })
  }else{
    app.profession=e.currentTarget.id;
    app.hasProfession=true
    wx.switchTab({
      url: '../profile/profile',
    })
  }
},
attendant:function(e){

  if(this.data.hasAccount){
    wx.showLoading({
      title: '更新职业中',
    })
    db.collection('userprofile').doc(app.userInfo._id).update({
      data:{
        profession:e.currentTarget.id
      }
    }).then((res)=>{
      wx.hideLoading({});
      wx.showToast({
        title: '更新成功',
      })
      app.profession=e.currentTarget.id;
      wx.switchTab({
        url: '../echo/echo',
      })
    })
  }else{
    app.profession=e.currentTarget.id;
    app.hasProfession=true
    wx.switchTab({
      url: '../profile/profile',
    })
  }


},
security:function(e){

  if(this.data.hasAccount){
    wx.showLoading({
      title: '更新职业中',
    })
    db.collection('userprofile').doc(app.userInfo._id).update({
      data:{
        profession:e.currentTarget.id
      }
    }).then((res)=>{
      wx.hideLoading({});
      wx.showToast({
        title: '更新成功',
      })
      app.profession=e.currentTarget.id;
      wx.switchTab({
        url: '../echo/echo',
      })
    })
  }else{
    app.profession=e.currentTarget.id;
    app.hasProfession=true
    wx.switchTab({
      url: '../profile/profile',
    })
  }


},
others:function(e){

  if(this.data.hasAccount){
    wx.showLoading({
      title: '更新职业中',
    })
    db.collection('userprofile').doc(app.userInfo._id).update({
      data:{
        profession:e.currentTarget.id
      }
    }).then((res)=>{
      wx.hideLoading({});
      wx.showToast({
        title: '更新成功',
      })
      app.profession=e.currentTarget.id;
      wx.switchTab({
        url: '../echo/echo',
      })
    })
  }else{
    app.profession=e.currentTarget.id;
    app.hasProfession=true
    wx.switchTab({
      url: '../profile/profile',
    })
  }


},

  
})