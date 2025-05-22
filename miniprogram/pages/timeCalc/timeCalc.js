// miniprogram/pages/timeCalc/timeCalc.js
const DATE = require('../../utils/util.js')
const date=new Date()

// 若在开发者工具中无法预览广告，请切换开发者工具中的基础库版本
// 在页面中定义插屏广告
let interstitialAd = null
Page({

  /**
   * 页面的初始数据
   */

  data: {
    keyValue: [{
      name: 'CLR',
      value: 'clear',
      type: 'function-key'
    }, {
      name: '←',
      value: 'back',
      type: 'function-key'
    }, {
      name: ':',
      value: ':',
      type: 'operator-key'
    }, {
      name: '0',
      value: 0,
      type: 'number-key'
    }, {
      name: '7',
      value: 7,
      type: 'number-key'
    }, {
      name: '8',
      value: 8,
      type: 'number-key'
    }, {
      name: '9',
      value: 9,
      type: 'number-key'
    }, {
      name: '-',
      value: '-',
      type: 'operator-key'
    }, {
      name: '4',
      value: 4,
      type: 'number-key'
    }, {
      name: '5',
      value: 5,
      type: 'number-key'
    }, {
      name: '6',
      value: 6,
      type: 'number-key'
    }, {
      name: '+',
      value: '+',
      type: 'operator-key'
    }, {
      name: '1',
      value: 1,
      type: 'number-key'
    }, {
      name: '2',
      value: 2,
      type: 'number-key'
    }, {
      name: '3',
      value: 3,
      type: 'number-key'
    }, {
      name: '=',
      value: '=',
      type: 'equal-key'
    }],
    inputValue: [],
    inputDisplay: '', // 用于显示输入内容的字符串
    resultValue: [],
    scrolltop: 0,
    lastAdShowTime: 0 // 上次展示广告的时间戳，用于控制广告展示频率
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
    // 初始化插屏广告
    console.log('开始初始化插屏广告')
    if (wx.createInterstitialAd) {
      try {
        interstitialAd = wx.createInterstitialAd({
          adUnitId: 'adunit-ef79a9727360f28c'
        })
        console.log('插屏广告实例创建成功')

        interstitialAd.onLoad(() => {
          console.log('插屏广告加载成功')
        })

        interstitialAd.onError((err) => {
          console.error('插屏广告加载失败', err)
        })

        interstitialAd.onClose(() => {
          console.log('插屏广告关闭')
        })
      } catch (err) {
        console.error('创建插屏广告实例失败:', err)
      }
    } else {
      console.error('当前环境不支持插屏广告')
    }
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
    // 如果广告实例不存在，尝试重新初始化
    if (!interstitialAd && wx.createInterstitialAd) {
      try {
        console.log('onShow中尝试初始化广告')
        interstitialAd = wx.createInterstitialAd({
          adUnitId: 'adunit-ef79a9727360f28c'
        })

        interstitialAd.onLoad(() => {
          console.log('onShow中广告加载成功')
        })

        interstitialAd.onError((err) => {
          console.error('onShow中广告加载失败', err)
        })
      } catch (err) {
        console.error('onShow中创建广告实例失败:', err)
      }
    }
  },

  // 显示插屏广告
  showInterstitialAd() {
    // 检查距离上次展示广告是否已经过了足够时间（至少30秒）
    const now = Date.now()
    if (now - this.data.lastAdShowTime < 30000) {
      console.log('广告展示间隔时间不足:', (now - this.data.lastAdShowTime) / 1000, '秒')
      return
    }

    console.log('尝试展示广告')

    // 显示广告
    if (interstitialAd) {
      interstitialAd.show().then(() => {
        console.log('广告展示成功')
        // 更新上次展示广告的时间
        this.setData({
          lastAdShowTime: now
        })
      }).catch((err) => {
        console.error('插屏广告显示失败', err)
      })
    } else {
      console.error('广告实例不存在')
    }
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
      // 更新inputDisplay
      let displayStr = '';
      a.forEach(item => {
        displayStr += item;
      });

      this.setData({
        inputValue: a,
        inputDisplay: displayStr
      })
      return

    } else if (keyValue === 'clear') {
      this.setData({
        inputValue: [],
        inputDisplay: ''
      })
      return

    } else {
      inputValue.push(keyValue)

      // 更新inputDisplay
      let displayStr = '';
      inputValue.forEach(item => {
        displayStr += item;
      });

      this.setData({
        scrolltop: inputValue.length+10,
        inputValue: inputValue,
        inputDisplay: displayStr
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
      inputDisplay: '',
      resultValue:resultValue,
      scrolltopT:resultValue.length+10
    })

    // 计算结果后展示广告
    this.showInterstitialAd()

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