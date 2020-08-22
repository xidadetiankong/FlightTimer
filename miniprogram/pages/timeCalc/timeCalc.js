// miniprogram/pages/timeCalc/timeCalc.js
const DATE = require('../../utils/util.js')
const date=new Date()
Page({

  /**
   * 页面的初始数据
   */

  data: {
    keyValue: [{
      name: 'CLR',
      value: 'clear'
    }, {
      name: '←',
      value: 'back'
    }, {
      name: ':',
      value: ':'
    }, {
      name: '0',
      value: 0
    }, {
      name: '7',
      value: 7
    }, {
      name: '8',
      value: 8
    }, {
      name: '9',
      value: 9
    }, {
      name: '-',
      value: '-'
    }, {
      name: '4',
      value: 4
    }, {
      name: '5',
      value: 5
    }, {
      name: '6',
      value: 6
    }, {
      name: '+',
      value: '+'
    }, {
      name: '1',
      value: 1
    }, {
      name: '2',
      value: 2
    }, {
      name: '3',
      value: 3
    }, {
      name: '=',
      value: '='
    }],
    inputValue: [],
    resultValue: [],
    scrolltop:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
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
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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


  tapKey: function (e) {
    var that=this
    var inputValue = this.data.inputValue;
    var firstLetter = inputValue[0];
    var keyValue = e.currentTarget.id;
    if (isNaN(firstLetter) == true && isNaN(keyValue) == true) {
      wx.showToast({
        icon: "none",
        title: '请先输入有效数字',
      })
    } else if (keyValue === '=') {
      
      that.showResult()
      
    return  

    } else if (keyValue === 'back') {
      let a=this.data.inputValue
      
      a.pop()
      this.setData({
        inputValue:a
      })
      return

    } else if (keyValue === 'clear') {
      this.setData({
        inputValue: []
      })
      return

    } else {
      inputValue.push(keyValue)
       this.setData({
        scrolltop:inputValue.length+10,
        inputValue: inputValue
      })
    }

    console.log(e.currentTarget.id, firstLetter)
  },


  showResult: function () {
    var inputValue=this.data.inputValue
    var resultPool=[]//这个数组是用来计算结果的
   var resultPool1=[]//这个数组是用来显示算式的
    var fuctionTemp=''//它是临时存储输入字符的
    var finalResult=0
    
    
    for(let a =0;a<inputValue.length;a++){
      
      
      if(inputValue[a]===':'){//如果是冒号我们就加冒号
        
        fuctionTemp=fuctionTemp+':'
        
      }else if(isNaN(inputValue[a])==true){//如果是运算符我们就把前面的数组转化成时间戳存到数组中并加个运算符
        let fuctionTempToStamp=this.timeTransToStamp(fuctionTemp)
        resultPool1.push(fuctionTemp)
        resultPool.push(fuctionTempToStamp)
        fuctionTemp='' 
        resultPool.push(inputValue[a])
        resultPool1.push(inputValue[a])
      }else if(isNaN(inputValue[a])==false){//如果是数字就继续加数字知道出现运算符
        
        fuctionTemp=fuctionTemp+inputValue[a]
      }

    }
    let fuctionTempToStamp=this.timeTransToStamp(fuctionTemp)//循环结束后将最后组合起来的数字转换成时间戳加入数组
    resultPool1.push(fuctionTemp) 
    resultPool.push(fuctionTempToStamp)
    
    fuctionTemp='' 
    var finalResultStamp=0
    console.log(resultPool)
    for(let a=0;a<resultPool.length;a=a+2){
      
        
        
      if(resultPool[a+1]==='+'&&a!=0){
        finalResultStamp=finalResultStamp+resultPool[a+2]
      }else if(resultPool[a+1]==='-'&&a!=0){
        finalResultStamp=finalResultStamp-resultPool[a+2]
      }else if(resultPool[a+1]==='+'){
          finalResultStamp=resultPool[0]+resultPool[a+2]
        }else if(resultPool[a+1]==='-'){
          finalResultStamp=resultPool[0]-resultPool[a+2]
        }else if(resultPool.length==1){

          finalResultStamp=resultPool[0]
        }
        
    }
   
    finalResult=DATE.formatHour(finalResultStamp)
    var zuhe=''
    resultPool1.forEach(element => {
      zuhe=zuhe+element
    });
    let functionIp=zuhe+'='+finalResult
    var resultValue=this.data.resultValue
    
    console.log(finalResultStamp,finalResult,functionIp)
    if(isNaN(finalResultStamp)){
      wx.showToast({
        icon:'none',
        title: '请输入有效时间格式hh:mm',
      })
      return
    }
    resultValue.push(functionIp)

    this.setData({
      inputValue:[],
      resultValue:resultValue,
      scrolltopT:resultValue.length+10
    })

  },



  timeTransToStamp:function(result){
   let mPos=result.indexOf(':')
   let a=result.substring(0,mPos)
   let b=result.substring(mPos+1,result.length)
   let c=parseInt(a)*3600000+parseInt(b)*60000
   return c
  },

  onShareAppMessage: function () {

  }
})