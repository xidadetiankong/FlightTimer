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
    profession: '',
    chartTitle: '月度时间汇总',
    predresttime: 0, //下一个48的开始时间
    DATA: [],
    tenhourrest: true, //上一个任务结束到现在是否满足10小时
    foureighthourrest: true,
    nextciclestart: '', //为满足下一个四十八时显示下一个144的开始时间,默认不显示
    totaldutytime: 0, //总值勤时间
    totalFlightlegs: 0,
    totalLandings: 0,


    YEARtotaldutytime: 0, //年度数据合集
    YEARtotalFlightlegs: 0,
    YEARtotalLandings: 0,


    totaldutytimeof12: 0, //月度合集
    totalFlightlegsof12: 0,
    totalLandings12: 0,


    twelveMonth: ['1月份', '2月份', '3月份', '4月份', '5月份', '6月份', '7月份', '8月份', '9月份', '10月份', '11月份', '12月份'],

    yearnow: parseInt(DATE.yearNow(date)),

    correction10REST: 0,
    showDetail: true,

    oneWork: 1,
    twoWork: 1,
    threeWork: 1,
    fourWork: 1,
    fiveWork: 1,
    sixWork: 1,
    sevenWork: 1,
    totalWorkDay: 0
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
    // 在页面中定义插屏广告
    let interstitialAd = null

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-ef79a9727360f28c'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }

    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
    this.setData({
      profession: app.userInfo.profession
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var currentTime = DATE.formatTime(date)
    var that = this
    wx.cloud.callFunction({ //只能在此功能中嵌入函数防止不同步的问题
      name: 'count',
      data: {}
    }).then((res) => {
      console.log(res)
      var iniData = []
      var unDutyData = []
      var totalData = []
      res.result.data.forEach(element => {
        totalData.push(element)
        if (element.isFlightDuty == true || element.isFlightDuty == null) {
          iniData.push(element)
        } else if (element.isFlightDuty == false) {
          unDutyData.push(element)
        }

      });
      console.log('总执勤期', totalData)
      console.log('飞行执勤期', iniData)
      console.log('地面执勤期', unDutyData)
      let TTData = totalData.sort(DATE.compare('checkintime'))
      let dataT = iniData.sort(DATE.compare('checkintime'))
      let dataD = unDutyData.sort(DATE.compare('checkintime'))
      this.setData({
        TTData: TTData,
        DATA: dataT,
        unDutyDATA: dataD
      })
      this.findthespa()
      this.findjack()
      this.setData({
        currentTime: currentTime,
        predresttime: DATE.stamptoformatTime(that.data.predresttime),
        nextciclestart: DATE.stamptoformatTime(that.data.nextciclestart)
      })
    })


  },
  onShow: function () {
    this.findthespa()
    this.findjack()
    this.setData({
      predresttime: DATE.stamptoformatTime(that.data.predresttime),
      nextciclestart: DATE.stamptoformatTime(that.data.nextciclestart)
    })
  },

  findthespa: function () { //计算四十八小时休息期返回预测的下一个48开始时间同时判断航后10小时休息是否满足
    var that = this
    var DATA = this.data.DATA;
    var TTData = this.data.TTData
    var lastwork = DATA[0];
    var lastGroundWork = this.data.unDutyDATA[0];
    var lastGroundCheckout = 0
    var lastcheckout = lastwork.EndTime - 28800000;

    var sishiba = 172800000;
    var yaosisi = 518400000;
    var calcuStart = 0; //推算开始时刻
    var predresttime = 0; //预计休息开始时刻
    var day = DATE.dayNow(date);
    var time = DATE.timeNow(date)
    var presentTime = DATE.timeToStamp(day, time)
    var lastyaosisi = DATE.timeToStamp(day, time) - yaosisi - 28800000

    
    var thirtyDays = 2592000000*3//应该是60天乘以三就对了
   
    var todaysStamp = DATE.timeToStamp(day, '24:00')
    var latestThisryDays = todaysStamp - thirtyDays
    var nightLandingTime = 0
    console.log("走过路过不要错过",todaysStamp)
    TTData.forEach(element => {
     
        if(( element.checkintime>=latestThisryDays ||element.EndTime>=latestThisryDays)&& element.nightFlight == true){
          nightLandingTime += 1
          
        }
        
     
    })
    
    this.setData({
      nightLandingTimes:nightLandingTime
    })
  
    if (lastGroundWork == null) {
      lastGroundCheckout = 0
    } else if (lastGroundWork != null) {
      lastGroundCheckout = lastGroundWork.EndTime - 28800000;
    }
   

    console.log('地面签出', lastGroundCheckout)
   

   

    if (lastGroundCheckout - lastcheckout <= 0) {
      let currentREST = DATE.formatHour(presentTime - lastcheckout - 28800000);
      that.setData({
        currentREST: currentREST
      })
    } else {
      let currentREST = DATE.formatHour(presentTime - lastGroundCheckout - 28800000);
      that.setData({
        currentREST: currentREST
      })
    }

    let profession = this.data.profession

    if (profession === 'others') {
      return
    }

    console.log('航后休息', (presentTime - lastcheckout - 28800000), (36000000 + this.data.correction10REST))
    if ((((presentTime - lastcheckout - 28800000) - (36000000 + this.data.correction10REST)) < 0) || (((presentTime - lastGroundCheckout - 28800000) - (36000000 + this.data.correction10REST)) < 0)) {
      wx.showToast({
        title: '最小航前休息未满足要求哦',
        icon: 'none'
      })

      this.setData({

        tenhourrest: false
      })

    } else if ((((presentTime - lastcheckout - 28800000) - (36000000 + this.data.correction10REST)) >= 0) || (((presentTime - lastGroundCheckout - 28800000) - (36000000 + this.data.correction10REST)) >= 0)) {
      this.setData({

        tenhourrest: true
      })
    }


    console.log('开始今日休息期判断')
    if (lastGroundCheckout - lastcheckout <= 0) {

      if ((presentTime - lastcheckout - 28800000) < sishiba) {
        var timeInlimit = [presentTime]
        var timeInlimit1 = [presentTime]

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


        const timeOnWork = []
        timeInlimit.forEach(element => {
          timeOnWork.push(element)
        });

        timeOnWork.shift()

        timeOnWork.sort()


        console.log("laiyifa", timeOnWork, timeOnWork)





        TTData.forEach(element => {
          ; //检索最近144小时内所有签到截止时间放入timeinlimit
          if ((element.EndTime - 28800000) > lastyaosisi) {
            timeInlimit1.push(element.EndTime - 28800000);


          };
          if ((element.checkintime - 28800000) > lastyaosisi) {

            timeInlimit1.push(element.checkintime - 28800000);

          }
        });

        var num = /[0-9]/
        var unitslength = timeInlimit1.length //&&((unitslength%2)=1)
        var quyu = unitslength % 2
        console.log("shaqingkaung", unitslength, quyu)
        if ((quyu === 1)) { //如果集合的元素个数为奇数说明最久的时间为签到时间
          console.log('判断最久一个时间节点是签到时间', unitslength, quyu, timeInlimit1[unitslength - 1])
          if ((timeInlimit1[unitslength - 1] - lastyaosisi) >= sishiba) { //
            calcuStart = timeInlimit1[unitslength - 1];
            predresttime = calcuStart - sishiba + yaosisi

            that.contWorkDays(timeOnWork, (calcuStart - sishiba))

            console.log('此签到时间至前推144小时间隔大于48，计算下一个48开始时间返回')
            this.setData({
              predresttime: predresttime
            })
            return
          } else if ((timeInlimit1[unitslength - 1] - lastyaosisi) < sishiba) {
            console.log('此签到时间至前推144小时间隔小于48')
            var NUMgr48 = 0;
            for (let i = 2; i < timeInlimit1.length; i = i + 2) {
              console.log('遍历所有144内的休息时间')
              let rest = timeInlimit1[i] - timeInlimit1[i + 1];
              if (rest >= sishiba && num.test(rest)) { //判断是否有大于48小时的休息期
                console.log('有大于48小时的休息期，计算下一个48开始时间，返回')
                calcuStart = timeInlimit1[i];
                predresttime = calcuStart - sishiba + yaosisi //基于此次大于48小时休息期的签到时间前推48后再后推144得出下次休息时间开始
                that.contWorkDays(timeOnWork, (calcuStart - sishiba))
                this.setData({
                  predresttime: predresttime
                })
                console.log('dd', DATE.stamptoformatTime(predresttime))
                return
              } else if (rest < sishiba) {
                NUMgr48 = NUMgr48 + 1;
                console.log('没有大于48小时的休息期，继续')

                console.log('循环内遍历判断，当遍历次数等于所需计算休息期个数时，计算此次48结束时间，返回', NUMgr48, timeInlimit1.length - 3)
                if (NUMgr48 === ((timeInlimit1.length - 3) / 2)) {
                  let checktime = DATE.dayNow(lastcheckout)
                  let checktime1 = DATE.timeToStamp(checktime, "23:59")
                  let startcalcu = checktime1 - yaosisi
                  console.log('daodishenme1ingkuang', checktime, checktime1, DATE.stamptoformatTime(lastcheckout), DATE.stamptoformatTime(startcalcu))
                  that.contWorkDays(timeOnWork, startcalcu)

                  this.setData({
                    predresttime: '请合理安排工作，如果当前时间为签到时间的您的48小时休息期将不满足。',
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
          console.log('判断最久一个时间节点是截止时间', unitslength, quyu, timeInlimit1[unitslength - 1])

          var NUMgr48 = 0;
          for (let i = 2; i < timeInlimit1.length; i = i + 2) {
            console.log('遍历所有144内的休息时间')
            let rest = timeInlimit1[i] - timeInlimit1[i + 1];
            if (rest >= sishiba && num.test(rest)) { //判断是否有大于48小时的休息期
              console.log('有大于48小时的休息期，计算下一个48开始时间，返回')
              calcuStart = timeInlimit1[i];
              that.contWorkDays(timeOnWork, (calcuStart - sishiba))
              predresttime = calcuStart - sishiba + yaosisi //基于此次大于48小时休息期的签到时间前推48后再后推144得出下次休息时间开始
              this.setData({
                predresttime: predresttime
              })
              console.log('dd', DATE.stamptoformatTime(predresttime))
              return
            } else if (rest < sishiba) {
              NUMgr48 = NUMgr48 + 1;
              console.log('没有大于48小时的休息期，继续')

              console.log('循环内遍历判断，当遍历次数等于所需计算休息期个数时，计算此次48结束时间，返回', NUMgr48, timeInlimit1.length - 1)
              if (NUMgr48 === ((timeInlimit1.length - 2) / 2)) {
                let checktime = DATE.dayNow(lastcheckout)
                let checktime1 = DATE.timeToStamp(checktime, "23:59")
                let startcalcu = checktime1 - yaosisi


                that.contWorkDays(timeOnWork, startcalcu)

                this.setData({
                  predresttime: '请合理安排工作，如果当前时间为签到时间的您的48小时休息期将不满足。',
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
        predresttime = presentTime - sishiba + yaosisi - 28800000 //算出下次休息时间的开始

        this.setData({
          predresttime: predresttime
        })
        return

      };
    } else if (lastGroundCheckout - lastcheckout > 0) {
      if ((presentTime - lastGroundCheckout - 28800000) < sishiba) {
        var timeInlimit = [presentTime]
        var timeInlimit1 = [presentTime]

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
        let timeOnWork = []
        timeInlimit.forEach(element => {
          timeOnWork.push(element)
        });

        timeOnWork.shift()

        timeOnWork.sort()


        console.log("laiyifa", timeOnWork, timeOnWork)


        TTData.forEach(element => {
          ; //检索最近144小时内所有签到截止时间放入timeinlimit
          if ((element.EndTime - 28800000) > lastyaosisi) {
            timeInlimit1.push(element.EndTime - 28800000);


          };
          if ((element.checkintime - 28800000) > lastyaosisi) {

            timeInlimit1.push(element.checkintime - 28800000);

          }
        });

        var num = /[0-9]/
        var unitslength = timeInlimit1.length //&&((unitslength%2)=1)
        var quyu = unitslength % 2
        console.log("shaqingkaung", unitslength, quyu)
        if ((quyu === 1)) { //如果集合的元素个数为奇数说明最久的时间为签到时间
          console.log('判断最久一个时间节点是签到时间', unitslength, quyu, timeInlimit1[unitslength - 1])
          if ((timeInlimit1[unitslength - 1] - lastyaosisi) >= sishiba) { //
            calcuStart = timeInlimit1[unitslength - 1];
            predresttime = calcuStart - sishiba + yaosisi
            console.log('此签到时间至前推144小时间隔大于48，计算下一个48开始时间返回')
            that.contWorkDays(timeOnWork, (calcuStart - sishiba))
            this.setData({
              predresttime: predresttime
            })
            return
          } else if ((timeInlimit1[unitslength - 1] - lastyaosisi) < sishiba) {
            console.log('此签到时间至前推144小时间隔小于48')
            var NUMgr48 = 0;
            for (let i = 2; i < timeInlimit1.length; i = i + 2) {
              console.log('遍历所有144内的休息时间')
              let rest = timeInlimit1[i] - timeInlimit1[i + 1];
              if (rest >= sishiba && num.test(rest)) { //判断是否有大于48小时的休息期
                console.log('有大于48小时的休息期，计算下一个48开始时间，返回')
                calcuStart = timeInlimit1[i];
                predresttime = calcuStart - sishiba + yaosisi //基于此次大于48小时休息期的签到时间前推48后再后推144得出下次休息时间开始
                that.contWorkDays(timeOnWork, (calcuStart - sishiba))
                this.setData({
                  predresttime: predresttime
                })
                console.log('dd', DATE.stamptoformatTime(predresttime))
                return
              } else if (rest < sishiba) {
                NUMgr48 = NUMgr48 + 1;
                console.log('没有大于48小时的休息期，继续')

                console.log('循环内遍历判断，当遍历次数等于所需计算休息期个数时，计算此次48结束时间，返回', NUMgr48, timeInlimit1.length - 3)
                if (NUMgr48 === ((timeInlimit1.length - 3) / 2)) {


                  let checktime = DATE.dayNow(lastGroundCheckout)
                  let checktime1 = DATE.timeToStamp(checktime, "23:59")
                  let startcalcu = checktime1 - yaosisi




                  that.contWorkDays(timeOnWork, startcalcu)

                  this.setData({
                    predresttime: '请合理安排工作，如果当前时间为签到时间的您的48小时休息期将不满足。',
                    foureighthourrest: false,
                    nextciclestart: lastGroundCheckout + sishiba
                  })
                  return
                }


                // if(num.test(rest)){resttimelist.push(rest)}//将有效的数字加入数组中

              }
            }
          }
        } else if (quyu === 0) {
          console.log('判断最久一个时间节点是截止时间', unitslength, quyu, timeInlimit1[unitslength - 1])

          var NUMgr48 = 0;
          for (let i = 2; i < timeInlimit1.length; i = i + 2) {
            console.log('遍历所有144内的休息时间')
            let rest = timeInlimit1[i] - timeInlimit1[i + 1];
            if (rest >= sishiba && num.test(rest)) { //判断是否有大于48小时的休息期
              console.log('有大于48小时的休息期，计算下一个48开始时间，返回')
              calcuStart = timeInlimit1[i];
              predresttime = calcuStart - sishiba + yaosisi //基于此次大于48小时休息期的签到时间前推48后再后推144得出下次休息时间开始
              that.contWorkDays(timeOnWork, (calcuStart - sishiba))
              this.setData({
                predresttime: predresttime
              })
              console.log('dd', DATE.stamptoformatTime(predresttime))
              return
            } else if (rest < sishiba) {
              NUMgr48 = NUMgr48 + 1;
              console.log('没有大于48小时的休息期，继续')

              console.log('循环内遍历判断，当遍历次数等于所需计算休息期个数时，计算此次48结束时间，返回', NUMgr48, timeInlimit1.length - 1)
              if (NUMgr48 === ((timeInlimit1.length - 2) / 2)) {
                let checktime = DATE.dayNow(lastGroundCheckout)
                let checktime1 = DATE.timeToStamp(checktime, "23:59")
                let startcalcu = checktime1 - yaosisi




                that.contWorkDays(timeOnWork, startcalcu)



                this.setData({
                  predresttime: '请合理安排工作，如果当前时间为签到时间的您的48小时休息期将不满足。',
                  foureighthourrest: false,
                  nextciclestart: lastGroundCheckout + sishiba
                })
                return
              }


              // if(num.test(rest)){resttimelist.push(rest)}//将有效的数字加入数组中

            }
          }

        }








      } else if ((presentTime - lastGroundCheckout) >= sishiba) {
        console.log('最后一次执勤到现在休息时间大于48小时，算出下次48休息的开始', )
        //存在有大于等于四十八的休息期
        predresttime = presentTime - sishiba + yaosisi - 28800000 //算出下次休息时间的开始

        this.setData({
          predresttime: predresttime
        })
        return

      };

    }



    console.log('ff', this.data.predresttime)

  },






  findjack: function () {
    var DATA = this.data.DATA;
    var day = DATE.dayNow(date); //包含年月日
    var sevenDay = 604800000

    var sevenDayStart = DATE.timeToStamp(day, '23:59') + 60000 - 28800000 - sevenDay;
    var sevenDayEnd = DATE.timeToStamp(day, '23:59') + 60000 - 28800000;
    var sevenDaywork = [];
    var sixtyHour = 216000000


    var ATTsevenDaywork = [];
    var seventyHour = 252000000

    var yearnow = this.data.yearnow;
    var yearstart = DATE.timeToStamp(yearnow + '/01/01', '00:00') - 28800000;
    var yearend = DATE.timeToStamp(yearnow + '/12/31', '23:59') + 60000 - 28800000;
    var month31 = [1, 3, 5, 7, 8, 10, 12];
    var month30 = [4, 6, 9, 11]

    var runnian = yearnow % 4
    var valueofselectyear = [];
    var month31select = [];
    var month30select = [];
    var month02select = [];


    DATA.forEach(element => { //七天工作时间由于单独提取出去来了执勤时间放入数组所以需要单独进行数组求和
      if ((element.EndTime - 28800000) > sevenDayStart && (element.checkintime - 28800000) < sevenDayStart) {
        ATTsevenDaywork.push((element.EndTime - 28800000) - sevenDayStart)
      } else if ((element.EndTime - 28800000) < sevenDayEnd && (element.checkintime - 28800000) > sevenDayStart) {
        ATTsevenDaywork.push(element.totalDutyTime)
      } else if ((element.EndTime - 28800000) > sevenDayEnd && (element.checkintime - 28800000) < sevenDayEnd) {
        ATTsevenDaywork.push(sevenDayEnd - (element.checkintime - 28800000))
      }

      if (DATE.arrySum(ATTsevenDaywork) > seventyHour) {
        this.setData({
          ATTsevenDaywork: DATE.formatHour(DATE.arrySum(ATTsevenDaywork)),
          ATTsevenDayworkOvr: false
        })
        return
      } else if (DATE.arrySum(ATTsevenDaywork) <= seventyHour) {
        this.setData({
          ATTsevenDaywork: DATE.formatHour(DATE.arrySum(ATTsevenDaywork)),
          ATTsevenDayworkOvr: true
        })
        return
      }

    })

    DATA.forEach(element => { //七天工作时间由于单独提取出去来了执勤时间放入数组所以需要单独进行数组求和
      if ((element.EndTime - 28800000) > sevenDayStart && (element.checkintime - 28800000) < sevenDayStart) {
        sevenDaywork.push((element.EndTime - 28800000) - sevenDayStart)
      } else if ((element.EndTime - 28800000) < sevenDayEnd && (element.checkintime - 28800000) > sevenDayStart) {
        sevenDaywork.push(element.totalDutyTime)
      } else if ((element.EndTime - 28800000) > sevenDayEnd && (element.checkintime - 28800000) < sevenDayEnd) {
        sevenDaywork.push(sevenDayEnd - (element.checkintime - 28800000))
      }

      if (DATE.arrySum(sevenDaywork) > sixtyHour) {
        this.setData({
          sevenDaywork: DATE.formatHour(DATE.arrySum(sevenDaywork)),
          sevenDayworkOvr: false
        })
        return
      } else if (DATE.arrySum(sevenDaywork) <= sixtyHour) {
        this.setData({
          sevenDaywork: DATE.formatHour(DATE.arrySum(sevenDaywork)),
          sevenDayworkOvr: true
        })
        return
      }

    })
    console.log('七天工作时间', this.data.sevenDaywork)

    DATA.forEach(element => { //取出年度数据
      if ((element.checkintime - 28800000) > yearstart && (element.checkintime - 28800000) < yearend) {
        valueofselectyear.push(element)
      }
    })


    month31.forEach(element => { //取出月份为31天数据
      let i = []
      let monthstart = DATE.timeToStamp(yearnow + '/' + element + '/01', '00:00') - 28800000;
      let monthend = DATE.timeToStamp(yearnow + '/' + element + '/31', '23:59') + 60000 - 28800000;
      valueofselectyear.forEach(element => {
        if ((element.checkintime - 28800000) > monthstart && (element.checkintime - 28800000) < monthend) {
          i.push(element)
        }
      })

      month31select.push(i)

    })
    month30.forEach(element => { //30天月份数据
      let i = []
      let monthstart = DATE.timeToStamp(yearnow + '/' + element + '/01', '00:00') - 28800000;
      let monthend = DATE.timeToStamp(yearnow + '/' + element + '/30', '23:59') + 60000 - 28800000;
      valueofselectyear.forEach(element => {
        if ((element.checkintime - 28800000) > monthstart && (element.checkintime - 28800000) < monthend) {
          i.push(element)
        }
      })
      month30select.push(i)
    })
    if (runnian === 0) { //二月份数据
      let monthstart = DATE.timeToStamp(yearnow + '/02/01', '00:00') - 28800000;
      let monthend = DATE.timeToStamp(yearnow + '/02/29', '23:59') + 60000 - 28800000;
      valueofselectyear.forEach(element => {
        if ((element.checkintime - 28800000) > monthstart && (element.checkintime - 28800000) < monthend) {
          month02select.push(element)
        }
      })
    } else if (runnian != 0) {
      let monthstart = DATE.timeToStamp(yearnow + '/02/01', '00:00') - 28800000;
      let monthend = DATE.timeToStamp(yearnow + '/02/28', '23:59') + 60000 - 28800000;
      valueofselectyear.forEach(element => {
        if ((element.checkintime - 28800000) > monthstart && (element.checkintime - 28800000) < monthend) {
          month02select.push(element)
        }
      })
    }



    console.log(valueofselectyear, month31select,
      month30select,
      month02select);
    month31select.splice(1, 0, month02select)

    month31select.splice(3, 0, month30select[0])

    month31select.splice(5, 0, month30select[1])
    month31select.splice(8, 0, month30select[2])
    month31select.splice(10, 0, month30select[3]) //数据集合
    var totaldutytimeof12 = []
    var totalFlightlegsof12 = []
    var totalLandings12 = []
    var totalflightTimes12 = []

    console.log(month31select)
    month31select.forEach(element => {
      totaldutytimeof12.push(this.collectitem(element).restotaldutytime);
      totalFlightlegsof12.push(this.collectitem(element).restotalFlightlegs);
      totalLandings12.push(this.collectitem(element).restotalLandings);
      totalflightTimes12.push(this.collectitem(element).restotalFlightTimes)


    })


    console.log(totaldutytimeof12, totalFlightlegsof12, totalLandings12, totalflightTimes12)
    console.log(yearnow, DATE.stamptoformatTime(yearstart), DATE.stamptoformatTime(yearend))
    console.log(this.collectitem(DATA).restotalFlightlegs)




    this.setData({


      totaldutytimeof12: totaldutytimeof12,
      totalFlightlegsof12: totalFlightlegsof12,
      totalLandings12: totalLandings12,
      totalflightTimes12: totalflightTimes12,
      selectyear: yearnow,

      YEARtotaldutytime: this.collectitem(valueofselectyear).restotaldutytime, //年度数据合集
      YEARtotalFlightTimes: this.collectitem(valueofselectyear).restotalFlightTimes,
      YEARtotalFlightlegs: this.collectitem(valueofselectyear).restotalFlightlegs,
      YEARtotalLandings: this.collectitem(valueofselectyear).restotalLandings,
      totaldutytime: this.collectitem(DATA).restotaldutytime, //历史数据合集
      totalFlightTimes: this.collectitem(DATA).restotalFlightTimes,
      totalFlightlegs: this.collectitem(DATA).restotalFlightlegs,
      totalLandings: this.collectitem(DATA).restotalLandings
    })

  },

  collectitem: function (res) {

    var restotaldutytime = 0;
    var restotalFlightlegs = 0;
    var restotalLandings = 0;
    var restotalFlightTimes = 0;
    for (let i = 0; i < res.length; i++) { //运算历史总值勤时间





      if (isNaN(res[i].actureLandings)) {
        restotalLandings = restotalLandings

      } else {
        restotalLandings = restotalLandings + res[i].actureLandings;
      }


      if (isNaN(res[i].actureFlightLegs)) {
        restotalFlightlegs = restotalFlightlegs

      } else {
        restotalFlightlegs = restotalFlightlegs + res[i].actureFlightLegs;
      }

      if (isNaN(res[i].totalDutyTime)) {
        restotaldutytime = restotaldutytime

      } else {
        restotaldutytime = restotaldutytime + res[i].totalDutyTime;
      }

      if (isNaN(res[i].flightTime)) {
        restotalFlightTimes = restotalFlightTimes

      } else {
        restotalFlightTimes = restotalFlightTimes + res[i].flightTime
      }

    }
    restotalFlightTimes = DATE.formatHour(restotalFlightTimes)
    restotaldutytime = DATE.formatHour(restotaldutytime)


    return {
      restotaldutytime,
      restotalFlightlegs,
      restotalLandings,
      restotalFlightTimes
    }
  },


  lastyear: function () {


    this.findjack()
    this.setData({
      yearnow: this.data.yearnow - 1
    })

  },
  nextyear: function () {

    this.findjack()
    this.setData({
      yearnow: this.data.yearnow + 1
    })
  },
  restcorrec: function (ev) {
    let value = ev.detail.value;
    this.data.correction10REST = parseInt(value) * 3600000
    this.findthespa()
    this.findjack()
    this.setData({
      predresttime: DATE.stamptoformatTime(this.data.predresttime),
      nextciclestart: DATE.stamptoformatTime(this.data.nextciclestart)
    })

  },
  showDetai: function () {
    this.setData({
      showDetail: false
    })
  },

  returnTT: function () {
    this.setData({
      showDetail: true
    })
  },
  contWorkDays: function (alltime, checkTime) {
    var sishiba = 172800000
    let fourtyEightHoursRest = this.data.foureighthourrest
    if (fourtyEightHoursRest) {
      var loop = alltime.length
      for (var i = 0; i < loop; i++) {

        //如果找到要被删除的数字所在的数组下标
        if (alltime[i] <= checkTime) {
          alltime.splice(i, 1)


          //从i位置开始删除1个数字

          i = i - 1; //改变循环变量
          loop = alltime.length; //改变循环次数
          console.log('来了没？', '我是i', i, checkTime, alltime, DATE.stamptoformatTime(checkTime))
        }
      }



    }
    console.log('zhene', alltime)
    var day = 24 * 3600 * 1000
    var firstday = DATE.dayNow(checkTime)

    var firstdayStamp = DATE.timeToStamp(firstday, '00:00') - 28800000
    var firstdayStamp1 = DATE.stamptoformatTime(firstdayStamp)

    var day1 = firstdayStamp + day
    var day2 = firstdayStamp + day * 2
    var day3 = firstdayStamp + day * 3
    var day4 = firstdayStamp + day * 4
    var day5 = firstdayStamp + day * 5
    var day6 = firstdayStamp + day * 6
    var day7 = firstdayStamp + day * 7


    var oneWork = 1
    var twoWork = 1
    var threeWork = 1
    var fourWork = 1
    var fiveWork = 1
    var sixWork = 1
    var sevenWork = 1
    var totalWorkDay = 0

    alltime.forEach(element => {
      var time1 = DATE.stamptoformatTime(element)
      console.log(DATE.stamptoformatTime(firstdayStamp), time1)
      if ((element) >= firstdayStamp && (element) < day1) {
        oneWork = 2

      } else if ((element) >= day1 && (element) < day2) {
        twoWork = 2

      } else if ((element) >= day2 && (element) < day3) {
        threeWork = 2

      } else if ((element) >= day3 && (element) < day4) {
        fourWork = 2

      } else if ((element) >= day4 && (element) < day5) {

        fiveWork = 2

      } else if ((element) >= day5 && (element) < day6) {

        sixWork = 2

      } else if ((element) >= day6 && (element) < day7) {

        sevenWork = 2

      }

      totalWorkDay = oneWork + twoWork + threeWork + fourWork + fiveWork + sixWork - 6
      console.log("kaokaoako", firstday, firstdayStamp, firstdayStamp1, totalWorkDay, DATE.stamptoformatTime(day5))
      if (totalWorkDay > 4 && ((oneWork + twoWork + threeWork + fourWork) >= 8)) {
        fiveWork = 3
      }
      if (totalWorkDay > 4 && ((oneWork + twoWork + threeWork + fourWork + fiveWork) >= 9)) {
        sixWork = 3
      }
      if (totalWorkDay > 4 && ((oneWork + twoWork + threeWork + fourWork + fiveWork + sixWork) >= 10)) {
        sixWork = 3
      }

    });

    this.setData({
      oneWork: oneWork,
      twoWork: twoWork,
      threeWork: threeWork,
      fourWork: fourWork,
      fiveWork: fiveWork,
      sixWork: sixWork,
      totalWorkDay: totalWorkDay
    })
  },
  nightLandingTimes: function (alltime, timenow) {
    
   
    
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