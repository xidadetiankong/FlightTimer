// pages/summary/summary.js

const DATE = require('../../utils/util.js')
const date = new Date()
const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chartTitle: '月度时间汇总',
    predresttime: 0, //下一个48的开始时间
    DATA: [],
    tenhourrest: true, //上一个任务结束到现在是否满足10小时
    foureighthourrest: true,
    nextciclestart: '', //为满足下一个四十八时显示下一个144的开始时间,默认不显示
    totaldutytime: 0, //总值勤时间
    totalFlightlegs: 0,
    totalLandings: 0,

    
    YEARtotaldutytime: 0,//年度数据合集
    YEARtotalFlightlegs: 0,
    YEARtotalLandings: 0,


    totaldutytimeof12:0,//月度合集
      totalFlightlegsof12:0,
      totalLandings12:0,


    twelveMonth:['1月份','2月份','3月份','4月份','5月份','6月份','7月份','7月份','8月份','10月份','11月份','12月份'],

    yearnow: parseInt(DATE.yearNow(date)),

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
    var that=this
    wx.cloud.callFunction({ //只能在此功能中嵌入函数防止不同步的问题
      name: 'count',
      data: {}
    }).then((res) => {
      console.log(res)
      let dataT = res.result.data.sort(DATE.compare('checkintime'))
      this.setData({
        DATA: dataT
      })
      this.findthespa()
      this.findjack()     
    })

    
  },

  findthespa: function () { //计算四十八小时休息期返回预测的下一个48开始时间同时判断航后10小时休息是否满足
    var DATA = this.data.DATA;
    var lastwork = DATA[0];

    var lastcheckout = lastwork.EndTime - 28800000;

    var sishiba = 172800000;
    var yaosisi = 518400000;
    var calcuStart = 0; //推算开始时刻
    var predresttime = 0; //预计休息开始时刻
    var day = DATE.dayNow(date);
    var time = DATE.timeNow(date)
    var presentTime = DATE.timeToStamp(day, time)
    var lastyaosisi = DATE.timeToStamp(day, time) - yaosisi




    console.log('开始今日休息期判断', presentTime, lastcheckout, lastyaosisi)
    if ((presentTime - lastcheckout) < sishiba) {
      var timeInlimit = [presentTime]
      DATA.forEach(element => {
        ; //检索最近144小时内所有签到截止时间放入timeinlimit
        if ((element.EndTime - 28800000) > lastyaosisi) {
          timeInlimit.push(element.EndTime - 28800000);


        };
        if ((element.checkintime - 28800000) > lastyaosisi) {

          timeInlimit.push(element.checkintime - 28800000);

        }
      });
      console.log('最后一次执勤到现在休息时间小于48小时', timeInlimit)

      var num = /[0-9]/
      var unitslength = timeInlimit.length //&&((unitslength%2)=1)
      var quyu = unitslength % 2

      if ((quyu === 1)) { //如果集合的元素个数为奇数说明最久的时间为签到时间
        console.log('判断最久一个时间节点是签到时间', unitslength, quyu, timeInlimit[unitslength - 1])
        if ((timeInlimit[unitslength - 1] - lastyaosisi) >= sishiba) { //
          calcuStart = timeInlimit[unitslength - 1];
          predresttime = calcuStart - sishiba + yaosisi
          console.log('此签到时间至前推144小时间隔大于48，计算下一个48开始时间返回')
          this.setData({
            predresttime: predresttime
          })
          return
        } else if ((timeInlimit[unitslength - 1] - lastyaosisi) < sishiba) {
          console.log('此签到时间至前推144小时间隔小于48')
          var NUMgr48 = 0;
          for (let i = 0; i < timeInlimit.length - 1; i = i + 2) {
            console.log('遍历所有144内的休息时间')
            let rest = timeInlimit[i] - timeInlimit[i + 1];
            if (rest >= sishiba && num.test(rest)) { //判断是否有大于48小时的休息期
              console.log('有大于48小时的休息期，计算下一个48开始时间，返回')
              calcuStart = timeInlimit[i];
              predresttime = calcuStart - sishiba + yaosisi //基于此次大于48小时休息期的签到时间前推48后再后推144得出下次休息时间开始
              this.setData({
                predresttime: predresttime
              })
              console.log('dd', DATE.stamptoformatTime(predresttime))
              return
            } else if (rest < sishiba) {
              NUMgr48 = NUMgr48 + 1;
              console.log('没有大于48小时的休息期，继续')
              wx.showToast({
                title: '继续',
                icon: 'none'
              })
              console.log('循环内遍历判断，当遍历次数等于所需计算休息期个数时，计算此次48结束时间，返回', NUMgr48, timeInlimit.length - 1)
              if (NUMgr48 === ((timeInlimit.length - 1) / 2)) {
                wx.showToast({
                  title: '过去144小时48小时休息未满足',
                  icon: 'none'
                })


                this.setData({
                  predresttime: '休息吧上次执勤结束到现在还没有48小时',
                  foureighthourrest: false,
                  nextciclestart: lastcheckout + sishiba
                })
                return
              }


              // if(num.test(rest)){resttimelist.push(rest)}//将有效的数字加入数组中

            }
          }
        }
      } else if (quyu === 0) {
        console.log('判断最久一个时间节点是截止时间', unitslength, quyu, timeInlimit[unitslength - 1])

        var NUMgr48 = 0;
        for (let i = 0; i < timeInlimit.length - 1; i = i + 2) {
          console.log('遍历所有144内的休息时间')
          let rest = timeInlimit[i] - timeInlimit[i + 1];
          if (rest >= sishiba && num.test(rest)) { //判断是否有大于48小时的休息期
            console.log('有大于48小时的休息期，计算下一个48开始时间，返回')
            calcuStart = timeInlimit[i];
            predresttime = calcuStart - sishiba + yaosisi //基于此次大于48小时休息期的签到时间前推48后再后推144得出下次休息时间开始
            this.setData({
              predresttime: predresttime
            })
            console.log('dd', DATE.stamptoformatTime(predresttime))
            return
          } else if (rest < sishiba) {
            NUMgr48 = NUMgr48 + 1;
            console.log('没有大于48小时的休息期，继续')
            wx.showToast({
              title: '继续',
              icon: 'none'
            })
            console.log('循环内遍历判断，当遍历次数等于所需计算休息期个数时，计算此次48结束时间，返回', NUMgr48, timeInlimit.length - 1)
            if (NUMgr48 === ((timeInlimit.length - 1) / 2)) {
              wx.showToast({
                title: '过去144小时48小时休息未满足',
                icon: 'none'
              })


              this.setData({
                predresttime: '休息吧上次执勤结束到现在还没有48小时',
                foureighthourrest: false,
                nextciclestart: lastcheckout + sishiba
              })
              return
            }


            // if(num.test(rest)){resttimelist.push(rest)}//将有效的数字加入数组中

          }
        }

      }







    } else if ((presentTime - lastcheckout) >= sishiba) {
      console.log('最后一次执勤到现在休息时间大于48小时，算出下次48休息的开始', )
      //存在有大于等于四十八的休息期
      predresttime = presentTime - sishiba + yaosisi //算出下次休息时间的开始
      this.setData({
        predresttime: predresttime
      })

    };

    if ((presentTime - lastcheckout) < 36000000) {
      wx.showToast({
        title: '最少10小时休息未满足要求哦',
        icon: 'none'
      })
      this.setData({
        tenhourrest: false
      })

    }
    console.log('ff', this.data.predresttime)

  },
  findjack: function () {
    var DATA = this.data.DATA;
   
    var yearnow = this.data.yearnow;
    var yearstart = DATE.timeToStamp(yearnow + '-01-01', '00:00') - 28800000;
    var yearend = DATE.timeToStamp(yearnow + '-12-31', '23:59') + 60000 - 28800000;
    var month31=[1,3,5,7,8,10,12];
    var month30=[4,6,9,11]
   
    var runnian=yearnow%4
    var valueofselectyear = [];
    var month31select=[];
    var month30select=[];
    var month02select=[];

    DATA.forEach(element => {
      if ((element.checkintime - 28800000) > yearstart && (element.checkintime - 28800000) < yearend) {
        valueofselectyear.push(element)
      }
    })


    month31.forEach(element=>{//取出月份为31天数据
      let i =[]
      let monthstart=DATE.timeToStamp(yearnow + '-'+element+'-01', '00:00') - 28800000;
      let monthend= DATE.timeToStamp(yearnow + '-'+element+'-31', '23:59') + 60000 - 28800000;
      valueofselectyear.forEach(element => {
        if ((element.checkintime - 28800000) > monthstart && (element.checkintime - 28800000) < monthend) {
          i.push(element)
        }
      })

      month31select.push(i)

    })
    month30.forEach(element=>{//30天月份数据
      let i =[]
      let monthstart=DATE.timeToStamp(yearnow + '-'+element+'-01', '00:00') - 28800000;
      let monthend= DATE.timeToStamp(yearnow + '-'+element+'-30', '23:59') + 60000 - 28800000;
      valueofselectyear.forEach(element => {
        if ((element.checkintime - 28800000) > monthstart && (element.checkintime - 28800000) < monthend) {
          i.push(element)
        }
      })
      month30select.push(i)
    })
    if(runnian===0){//二月份数据
      let monthstart=DATE.timeToStamp(yearnow + '-02-01', '00:00') - 28800000;
      let monthend= DATE.timeToStamp(yearnow + '-02-29', '23:59') + 60000 - 28800000;
      valueofselectyear.forEach(element => {
        if ((element.checkintime - 28800000) > monthstart && (element.checkintime - 28800000) < monthend) {
          month02select.push(element)
        }
      })
    }else if(runnian!=0){
      let monthstart=DATE.timeToStamp(yearnow + '-02-01', '00:00') - 28800000;
      let monthend= DATE.timeToStamp(yearnow + '-02-28', '23:59') + 60000 - 28800000;
      valueofselectyear.forEach(element => {
        if ((element.checkintime - 28800000) > monthstart && (element.checkintime - 28800000) < monthend) {
          month02select.push(element)
        }
      })
    }



    console.log(valueofselectyear  , month31select,
      month30select,
      month02select);
      month31select.splice(1,0,month02select)
     
      month31select.splice(3,0,month30select[0])
    
      month31select.splice(5,0,month30select[1])
      month31select.splice(8,0,month30select[2])
      month31select.splice(10,0,month30select[3])//数据集合
      var totaldutytimeof12 =[]
       var totalFlightlegsof12=[]
      var totalLandings12=[]

      console.log(month31select)
      month31select.forEach(element=>{
        totaldutytimeof12.push(this.collectitem(element).restotaldutytime);
        totalFlightlegsof12.push(this.collectitem(element).restotalFlightlegs);
        totalLandings12.push(this.collectitem(element).restotalLandings)


      })

      
console.log(totaldutytimeof12,totalFlightlegsof12,totalLandings12)
    console.log(yearnow, DATE.stamptoformatTime(yearstart), DATE.stamptoformatTime(yearend))
    console.log(this.collectitem(DATA).restotalFlightlegs)




    this.setData({
      totaldutytimeof12:totaldutytimeof12,
      totalFlightlegsof12:totalFlightlegsof12,
      totalLandings12:totalLandings12,

      YEARtotaldutytime: this.collectitem(valueofselectyear).restotaldutytime,//年度数据合集
      YEARtotalFlightlegs: this.collectitem(valueofselectyear).restotalFlightlegs,
      YEARtotalLandings: this.collectitem(valueofselectyear).restotalLandings,
      totaldutytime: this.collectitem(DATA).restotaldutytime,//历史数据合集
      totalFlightlegs: this.collectitem(DATA).restotalFlightlegs,
      totalLandings: this.collectitem(DATA).restotalLandings
    })

  },

  collectitem: function (res) {

    var restotaldutytime=0;
    var restotalFlightlegs=0;
    var restotalLandings=0;
    for (let i = 0; i < res.length; i++) { //运算历史总值勤时间
      restotaldutytime = restotaldutytime + res[i].totalDutyTime;
      restotalFlightlegs = restotalFlightlegs + res[i].actureFlightLegs;
      restotalLandings = restotalLandings + res[i].actureFlightLegs;
    }
    return {restotaldutytime,restotalFlightlegs,restotalLandings}
  },

  lastyear: function () {

  
    this.findjack()
    this.setData({
      yearnow :this.data.yearnow - 1
    })

  },
  nextyear: function () {
    
    this.findjack()
    this.setData({
      yearnow :this.data.yearnow + 1
    })
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