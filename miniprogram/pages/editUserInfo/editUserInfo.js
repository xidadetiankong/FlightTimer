// pages/editUserInfo/editUserInfo.js
const app=getApp()
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:'',
    nickName:'',
    signature:'',
    profession:''
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
      avatarUrl:app.userInfo.avatarUrl,
    nickName:app.userInfo.nickName,
    signature:app.userInfo.signature,
    profession:app.userInfo.profession
    })
    console.log(app.userInfo)
  },



  confirmCHG:function(){
    this.updateSignature();
    this.updateProfession();
    this.updateNickName()
  },
  inputnickName:function(ev){
let value=ev.detail.value;
this.setData({
  nickName:value
})
  },
  updateNickName:function(){
    if(!(/^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(this.data.nickName))){//终于把正则理清楚了注意正则中加号的使用
      

      wx.showToast({
        title: '昵称需填写十位内汉字字母数字或组合',
        icon:'none'
      })
    }else{
      wx.showLoading({
        title: '上传中',
      })
      db.collection('userprofile').doc(app.userInfo._id).update({
        data:{
          nickName:this.data.nickName
        }
      }).then((res)=>{
        wx.hideLoading({});
        wx.showToast({
          title: '更新成功',
        })
        app.userInfo.nickName=this.data.nickName
      }) 
    }
    
  },
  
  inputsignature:function(ev){
    let value=ev.detail.value
    
    this.setData({
      signature:value
    })
      },

  updateSignature:function(){
    wx.showLoading({
      title: '上传中',
    })
    db.collection('userprofile').doc(app.userInfo._id).update({
      data:{
        signature:this.data.signature
      }
    }).then((res)=>{
      wx.hideLoading({});
      wx.showToast({
        title: '更新成功',
      })
      app.userInfo.signature=this.data.signature
    })
  },
  inputprofession:function(ev){
    
   let value=ev.detail.value
   
    this.setData({
      profession:value
    })
  },
  updateProfession:function(){
    if(!(/^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(this.data.nickName))){//终于把正则理清楚了
      

      wx.showToast({
        title: '职业需填十位内汉字字母数字或组合',
        icon:'none'
      })
    }else{wx.showLoading({
      title: '上传中',
    })
    db.collection('userprofile').doc(app.userInfo._id).update({
      data:{
        profession:this.data.profession
      }
    }).then((res)=>{
      wx.hideLoading({});
      wx.showToast({
        title: '更新成功',
      })
      app.userInfo.profession=this.data.profession
    }).then((res)=>{
      wx.switchTab({
        url: '../profile/profile',
      })
    })
  }
    
  }
 
})