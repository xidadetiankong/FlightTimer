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
  choosePROF: function () {
    wx.navigateTo({
      url: '../professionSelect/professionSelect',
    })
  },


  confirmCHG: function () {
    this.updateSignature();
    this.updateNickName();
    this.updateProfession()

  },
  updateAvatar: function () {

    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];
        that.setData({
          avatarUrl: tempFilePaths
        })

        wx.cloud.callFunction({
          name:'imgCheck',
          data:{
            event:tempFilePaths
          }
          
          
        }).then((res)=>{
          console.log('dayin',res)
        })
        that.uploadAvatar()

      }
    })

  },

  uploadAvatar: function () {

    wx.showLoading({
      title: '上传中',
    })
    let cloudPath = "userAvatar/" + app.userInfo._openid + Date.now() + '.jpg';
    db.collection('userprofile').doc(app.userInfo._id).get().then((res)=>{

console.log(res)

let oldfile=res.data.avatarUrl
if(oldfile===this.data.avatarUrl){
  

}else if(oldfile!=this.data.avatarUrl){
  wx.cloud.deleteFile({
    fileList: [oldfile]
  }).then(res => {


    wx.cloud.uploadFile({
      cloudPath,
      filePath: this.data.avatarUrl, // 文件路径
    }).then(res => {


      

      let fileID=res.fileID

      if(fileID){
        db.collection('userprofile').doc(app.userInfo._id).update({
          data:{
            avatarUrl:fileID
          }
        }).then((res)=>{
          wx.hideLoading({})
          wx.showToast({
            title: '更新成功',
          })
          app.userInfo.avatarUrl=fileID;



        })
      }


      // get resource ID
      console.log(res.fileID)
    }).catch(error => {

      wx.showToast({
        title: '上传失败请稍后再试',
      })

      // handle error
    })

    // handle success
    console.log(res)
  }).catch(error => {
    // handle error
  })




}


      
    })

    

  },


  inputnickName: function (ev) {
    let value = ev.detail.value;
    this.setData({
      nickName: value
    })
  },
  updateNickName: function () {


    var that=this
    if (!(/^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(this.data.nickName))) { //终于把正则理清楚了注意正则中加号的使用


      wx.showToast({
        title: '昵称需填写十位内汉字字母数字或组合',
        icon: 'none'
      })
    } else {


      wx.cloud.callFunction({
        name:'msgCheck',
        data:{
          text:that.data.nickName
        }
      }).then((res)=>{
        console.log('测试结果',res.result)
      })

      wx.showLoading({
        title: '上传中',
      })
      db.collection('userprofile').doc(app.userInfo._id).update({
        data: {
          nickName: that.data.nickName
        }
      }).then((res) => {
        wx.hideLoading({});
        wx.showToast({
          title: '更新成功',
        })
        app.userInfo.nickName = that.data.nickName
        wx.switchTab({
          url: '../profile/profile',
        })
      })







    }

  },

  inputsignature: function (ev) {
    let value = ev.detail.value

    this.setData({
      signature: value
    })
  },

  updateSignature: function () {
    wx.showLoading({
      title: '上传中',
    })
    db.collection('userprofile').doc(app.userInfo._id).update({
      data: {
        signature: this.data.signature
      }
    }).then((res) => {
      wx.hideLoading({});
      wx.showToast({
        title: '更新成功',
      })
      app.userInfo.signature = this.data.signature
    })
  },

  updateProfession: function () { //正则留着用吧
    if (!(/^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(this.data.nickName))) { //终于把正则理清楚了


      wx.showToast({
        title: '职业需填十位内汉字字母数字或组合',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '上传中',
      })
      db.collection('userprofile').doc(app.userInfo._id).update({
        data: {
          work: this.data.profession
        }
      }).then((res) => {
        wx.hideLoading({});
        wx.showToast({
          title: '更新成功',
        })
        app.userInfo.profession = this.data.profession
      }).then((res) => {
        wx.switchTab({
          url: '../profile/profile',
        })
      })
    }

  }

})