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
    links:0,
    DataOfTotal:[]

  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '最好用的R6执勤期记录APP',
      path: '/page/user?id=123'
    }
  },
  onShareTimeline: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '最好用的R6执勤期记录APP',
      path: '/page/user?id=123'
    }
  },
  onLoad:function(){
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then((res) => { //使用DOC可以监听普通ID，但是唯一标识openId需要使用where
       console.log(res);
      db.collection('userprofile').where({
        _openid: res.result.openid
        
      }).get().then((res) => {

        console.log(res)
        this.showlinks()
        
        if(res.data.length){
          app.userInfo = Object.assign(app.userInfo, res.data[0]);
          app.profession=Object.assign(app.userInfo, res.data[0].profession);
          
          this.setData({
            links:res.data[0].links,
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
  
  onReady: function () {
   
   
    

  },
  onShow: function () {
   
    this.setData({
      signature:app.userInfo.signature,
      avatarUrl: app.userInfo.avatarUrl,
      nickName: app.userInfo.nickName,
      hasProfession:app.hasProfession,
    })
  },
  setTheLevel:function(){
   
    var links=this.data.links
    var level=''
    if(links<5){level='1 '}
    else if(links>=5&&links<10){level='2' }
    else if(links>=10&&links<20){level='3' }
    else if(links>=20&&links<40){level='4' }
    else if(links>=40&&links<80){level='5' }
    else if(links>=80&&links<160){level='6' }
    else if(links>=160&&links<320){level='7 ' }
    else if(links>=320&&links<640){level='8' }
    else if(links>=640&&links<960){level='9' }
    else if(links>=960&&links<1325){level='10' }
    else if(links>=1325&&links<2055){level='11' }
    else if(links>=2055&&links<2785){level='12' }
    else if(links>=2785&&links<4000){level='13' }
    else if(links>=4000&&links<6000){level='14' }
    else if(links>=6000&&links<9000){level='15' }
    else if(links>=9000&&links<13000){level='16' }
    else if(links>=13000&&links<17000){level='17' }
    else if(links>=17000&&links<23000){level='18' }
    else if(links>=23000&&links<30000){level='19' }
    else if(links>=30000&&links<38000){level='20' }
    else if(links>=38000&&links<47000){level='21' }
    else if(links>=47000&&links<57000){level='22' }
    else if(links>=57000&&links<68000){level='23' }
    else if(links>=68000&&links<80000){level='24' }
    else if(links>=80000&&links<93000){level='25' }
    else if(links>=107000&&links<122000){level='26' }
    else if(links>=122000&&links<138000){level='27' }
    else if(links>=138000&&links<155000){level='28' }
    else if(links>=155000&&links<173000){level='29' }
    else if(links>=173000&&links<192000){level='30' }
    else if(links>=192000&&links<233000){level='31' }
    else if(links>=233000&&links<255000){level='32' }
    else if(links>=255000){level='' }


   console.log(links,'wahaha',level)
    this.setData({
      level:level
    })
  },
  showDemo:function(){
    wx.navigateTo({
      url: '../profile/demoPage/demoPage',
    })
  },

  showlinks:function(){
    
    wx.cloud.callFunction({
      name: 'count',
      data: {}
    }).then((res)=>{
      
     var links=DATE.collectitem(res.result.data).restotaldutytime
      links=links.substring(0,links.indexOf(':'))
      console.log(links)
      this.setTheLevel()

      db.collection('userprofile').where({
        _openid:app.userInfo._openid
        
      }).update({
        data:{
          links:links
        }
      }).then((res)=>{
        console.log(res)
        this.setData({
          linsks:links
        })
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