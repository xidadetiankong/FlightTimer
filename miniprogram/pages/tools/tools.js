// pages/tools/tools.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
toolsIcon:[
  {name:'caculator',
  title:'计算器',
  url:'../../img/calculatorSimUS.png',
  pageUrl:'../../pages/calclator/calculator',
  id:0

  },{
    name:'',
  title:'开发中',
  url:'../../img/willcom.png',
  id:1
  }
]
  },
  iconTap:function(e){
    var toolsIcon=this.data.toolsIcon
    var index=e.currentTarget.id
    
    var url=toolsIcon[index].pageUrl
    console.log(url)
    wx.navigateTo({
      url: url ,
    })
  }

})