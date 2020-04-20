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
  title:'时间计算器',
  
  url:'../../img/clock.png',
  pageUrl:'../../pages/timeCalc/timeCalc',
  id:1
  },{
    name:'',
  title:'敬请期待',
  
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