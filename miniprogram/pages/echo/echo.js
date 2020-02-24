//index.js
const DATE = require('../../utils/util.js')
const app = getApp()
const db = wx.cloud.database({
  env: 'mydatabase-rwjnb'
}) //need designate an envirment id
const date = new Date()

Page({
  data: {
    //初始参数
    date: DATE.formatTime(date).substring(0, 10), //签到日期
    time: DATE.formatTime(date).substring(11, 16), //签到时间
    teamSize: ['非扩编机组', '扩编机组'],
    selectedTeam: '非扩编机组', //已选机组编制
    CheckOutTime: null, //中途退场时间
    CheckInTime2: DATE.formatTime(date).substring(11, 16), //中途进场时间
    EndDate: DATE.formatTime(date).substring(0, 10), //关车日期
    EndTime: DATE.formatTime(date).substring(11, 16), //关车时间
    show_result: true, //是否隐藏结果弹出组件
    //非扩编机组
    flightSegment: '4', //飞行段数
    //扩编机组
    rstFaciliyLevel: '3', //休息设施等级
    crewNumbers: '3', //机组人数

    //结果参数
    maxFlightTime: '',
    maxDutyTime: '',
    dutyEndTime: '',
    dutyTimeRemain: '',
    totalDutyTime: '',
    pauseTime: [],
    totalRestTime: 0, //total rest time in millisecond
    totalRestTimeInhours: '00:00'

  },
  upload:function(){
    wx.cloud.callFunction({//用户鉴权确认是否已经注册
      name: 'login',
      data: {}
    }).then((res) => { //使用DOC可以监听普通ID，但是唯一标识openId需要使用where
      // console.log(res);
      db.collection('userprofile').where({
        _openid: res.result.openid
      }).get().then((res) => {
        if(res.data.length){
          wx.showToast({
            title: '欢迎朋友',
          })
        }else{
          wx.switchTab({
            url: '../profile/profile',
          })
        }
        
      })
    })
  },

  onLoad() {
    // var time = this.data.time;
    // var DaTe=this.data.date;
    // var fullTime=DaTe+' '+time;
    // console.log(fullTime)
    // console.log((new Date('1970-01-01 08:01')).valueOf()) //直接计算是不会讲时差计算到其中的，加8之后得出正确的值，应该是默认为本地时间也就是计算机从网络上同步的时间
    // console.log(new Date((('1970-01-01') + ' ' + time)).valueOf())

    // console.log(DATE.formatTime(date).substring(0, 16))
    // console.log(Date.parse(new Date(this.data.EndDate)))
    // console.log((new Date(this.data.EndDate)).valueOf())
    // console.log(new Date(this.data.time).getTime())
  },


  refreshBTN: function () {
    
    this.setData({
      date: DATE.formatTime(date).substring(0, 10), //签到日期
    time: DATE.formatTime(date).substring(11, 16), //签到时间
    teamSize: ['非扩编机组', '扩编机组'],
    selectedTeam: '非扩编机组', //已选机组编制
    CheckOutTime: null, //中途退场时间
    CheckInTime2: DATE.formatTime(date).substring(11, 16), //中途进场时间
    EndDate: DATE.formatTime(date).substring(0, 10), //关车日期
    EndTime: DATE.formatTime(date).substring(11, 16), //关车时间
    show_result: true, //是否隐藏结果弹出组件
    //非扩编机组
    flightSegment: '4', //飞行段数
    //扩编机组
    rstFaciliyLevel: '3', //休息设施等级
    crewNumbers: '3', //机组人数

    //结果参数
    maxFlightTime: '',
    maxDutyTime: '',
    dutyEndTime: '',
    dutyTimeRemain: '',
    totalDutyTime: '',
    pauseTime: [],
    totalRestTime: 0, //total rest time in millisecond
    totalRestTimeInhours: '00:00'

    })
  },
  //tips
//   checkinTips:function(){
// wx.showToast({
//   title: '请在右侧选择时间',
//   icon: 'none',  
//   duration: 2000
// })
//   },
//   choseTeamTips:function(){
//     wx.showToast({
//       title: '请在右侧选择编制',
//       icon: 'none',  
//       duration: 2000
//     })
//       },
//       quickTRTips:function(){
//         wx.showToast({
//           title: '填入计算剩余执勤期。',
//           icon: 'none',  
//           duration: 6000
//         })
//           },
  //
  selectCheckInTime: function (e) { //选择签到时间
    this.setData({
      time: e.detail.value
    })
  },
  selectCheckInDate: function (e) { //选择签到日期
    this.setData({
      date: e.detail.value
    })
  },
  selectTeam: function (e) { //选择机组编制
    var teamSize = this.data.teamSize;
    this.setData({
      selectedTeam: teamSize[e.detail.value]
    })
    console.log(this.data.selectedTeam)
  },
  //


  selectCheckOutTime: function (e) { //中途退场时间
    this.setData({
      CheckOutTime: e.detail.value
    })
  },
  selectCheckInTime2: function (e) { //中途进场时间

    this.setData({
      CheckInTime2: e.detail.value
    })
    console.log(this.data.CheckInTime2)
  },

  //
  selectEndTime: function (e) { //选择结束时间
    this.setData({
      EndTime: e.detail.value
    })
  },

  selectEndDate: function (e) { //选择结束日期
    this.setData({
      EndDate: e.detail.value
    })
  },

  //选择其它数据

  //unAugment chose segment num

  choseSegment: function (e) {
    if (this.data.selectedTeam === '非扩编机组') {
      this.setData({
        flightSegment: e.detail.value
      })
    }

    console.log(this.data.flightSegment)
  },
  //chosePilotNumbers
  chosePilotNumbers: function (e) {
    if (this.data.selectedTeam === '扩编机组') {
      this.setData({
        crewNumbers: e.detail.value
      })
    }
    console.log(this.data.crewNumbers)
  },
  //chose rest facility level
  choseRestFacility: function (e) {
    if (this.data.selectedTeam === '扩编机组') {
      this.setData({
        rstFaciliyLevel: e.detail.value
      })
    }
    console.log(this.data.rstFaciliyLevel)
  },
  addRestTime: function () {
    var CheckOutTime = this.timeTomilliSec(this.data.CheckOutTime);
    var CheckInTime2 = this.timeTomilliSec(this.data.CheckInTime2);
    var wholeDaymilSec = 24 * 3600 * 1000;
    // var resttime=''
    var pauseTime = this.data.pauseTime;
    var timediff = CheckInTime2 - CheckOutTime;
    if (timediff <= 0) {
      timediff = (wholeDaymilSec - CheckOutTime) + CheckInTime2;
      //  resttime=this.formatHour(timediff);
      this.data.pauseTime.push(timediff);
    } else {
      // resttime=this.formatHour(timediff);
      this.data.pauseTime.push(timediff);
    }
    var totalRestTime = 0;
    for (let i = 0; i < this.data.pauseTime.length; i++) {
      totalRestTime = totalRestTime + pauseTime[i]
    }

    console.log(timediff, this.data.pauseTime, totalRestTime)

    this.setData({
      totalRestTime: totalRestTime,
      totalRestTimeInhours: this.formatHour(totalRestTime)
    })

  },

  resultBTN: function () { //显示计算结果组件
    var totalDutyTime = this.total_dutytime();
    var maxFlightTime = this.maxFlightTime();
    var maxDutyTime = this.maxDutyTime();
    var dutyTimeRemain = this.dutyTimeRemain();
    var dutyEndTime = this.dutyEndTime();
    

    if(this.timeTomilliSec (totalDutyTime)>this.timeTomilliSec (maxDutyTime)){
      wx.showToast({
        title: '超时了呦',
        icon:'none'
      })

    }

    this.setData({
      dutyEndTime: dutyEndTime,
      dutyTimeRemain: dutyTimeRemain,
      maxDutyTime: maxDutyTime,
      maxFlightTime: maxFlightTime,
      totalDutyTime: totalDutyTime,
      show_result: false
    })
  },
  tipsBTN:function(){
    wx.showToast({
      title: '点击添加按钮使退场休息时间参与到计算中，可多次添加。修改点击重置',
      icon:'none',
      duration:4000
    })
  },
  cancleUpload: function () { //隐藏计算结果组件
    this.setData({
      show_result: true,
      
    })
  },



  //功能性函数区
  timeDifferent: function (timeStart, timeEnd) { //计算时间差
    var start = new Date(timeStart).valueOf();
    var end = new Date(timeEnd).valueOf();

    var timeStpDiff = end - start;

    var time = this.formatHour(timeStpDiff);

    if (timeStpDiff <= 0) { //判断时间输入
      time = '0:00'
      return time
    } else {
      return time
    }
  },
  timeTomilliSec: function (res) {
    var time = new Date((('1970-01-01') + ' ' + res)).valueOf() + 28800000;
    return time
  },
  formatHour: function (res) {
    var hours = Math.floor(res / (3600 * 1000));
    var restMilSec = res % (3600 * 1000);
    var minutes = Math.floor(restMilSec / (60 * 1000));
    var time = hours + ':' + minutes;
    if (minutes < 10) {
      var time = hours + ':' + '0'+minutes ;
    } else {
      var time = hours + ':' + minutes;
    }
    return time
  },

  total_dutytime: function () { //计算实际执勤时间供调用
    var date = this.data.date;
    var time = this.data.time;
    var EndDate = this.data.EndDate;
    var EndTime = this.data.EndTime;

    var startTime = date + ' ' + time;
    var finalTime = EndDate + ' ' + EndTime;
    var totalDutyTime = this.timeDifferent(startTime, finalTime)
    return totalDutyTime
  },

  maxFlightTime: function () { //根据机组编制分为两组两个条件，条件一根据签到时间输出结果，条件二根据机组人数输出结果
    var checkintime = new Date((('1970-01-01') + ' ' + this.data.time)).valueOf();
    var am5 = new Date((('1970-01-01') + ' ' + '05:00')).valueOf()
    var pm8 = new Date((('1970-01-01') + ' ' + '20:00')).valueOf()
    var am00 = new Date((('1970-01-01') + ' ' + '24:00')).valueOf()
    var maxFlightTime = this.data.maxFlightTime;
    var crewNumbers = this.data.crewNumbers;
    if (this.data.selectedTeam === '非扩编机组') {
      if ((checkintime >= am5) && (checkintime < pm8)) {
        maxFlightTime = '9:00'
      } else if (checkintime < am5 || checkintime >= pm8) {
        maxFlightTime = '8:00'
      }

      return maxFlightTime
    } else if (this.data.selectedTeam === '扩编机组') {
      if (crewNumbers === '3') {
        maxFlightTime = '13:00'

      } else if (crewNumbers === '4') {
        maxFlightTime = '17:00'
      }

      return maxFlightTime

    }

    console.log(new Date((('1970-01-01') + ' ' + time)).valueOf())

  },
  //计算最大值勤期
  maxDutyTime: function () {
    var checkintime = new Date((('1970-01-01') + ' ' + this.data.time)).valueOf();
    var am5 = new Date((('1970-01-01') + ' ' + '05:00')).valueOf()
    var pm8 = new Date((('1970-01-01') + ' ' + '20:00')).valueOf()
    var am00 = new Date((('1970-01-01') + ' ' + '24:00')).valueOf()
    var maxFlightTime = this.data.maxFlightTime;
    var crewNumbers = this.data.crewNumbers;
    var flightSegment = this.data.flightSegment;
    var maxDutyTime = this.data.maxDutyTime;
    var rstFaciliyLevel = this.data.rstFaciliyLevel
    if (this.data.selectedTeam === '非扩编机组') {
      if (checkintime < am5) {
        switch (flightSegment) {
          case '4':
            maxDutyTime = '12:00'
            break;
          case '5':
            maxDutyTime = '11:00'
            break;
          case '6':
            maxDutyTime = '10:00'
            break;
          case '7':
            maxDutyTime = '9:00'
            break;

        }

      } else if ((checkintime >= am5) && (checkintime < pm8)) {
        switch (flightSegment) {
          case '4':
            maxDutyTime = '14:00'
            break;
          case '5':
            maxDutyTime = '13:00'
            break;
          case '6':
            maxDutyTime = '12:00'
            break;
          case '7':
            maxDutyTime = '11:00'
            break;

        }
      } else if (checkintime >= pm8) {
        switch (flightSegment) {
          case '4':
            maxDutyTime = '13:00'
            break;
          case '5':
            maxDutyTime = '12:00'
            break;
          case '6':
            maxDutyTime = '11:00'
            break;
          case '7':
            maxDutyTime = '10:00'
            break;

        }
      }

      return maxDutyTime


    } else if (this.data.selectedTeam === '扩编机组') {

      if (crewNumbers === '3') {
        switch (rstFaciliyLevel) {
          case '1':
            maxDutyTime = '18:00'
            break;
          case '2':
            maxDutyTime = '17:00'
            break;
          case '3':
            maxDutyTime = '16:00'
            break;
        }

      } else if (crewNumbers === '4') {
        switch (rstFaciliyLevel) {
          case '1':
            maxDutyTime = '20:00'
            break;
          case '2':
            maxDutyTime = '19:00'
            break;
          case '3':
            maxDutyTime = '18:00'
            break;
        }
      }

      return maxDutyTime

    }
  },
  dutyTimeRemain: function () {

    var maxDutyTime = this.timeTomilliSec(this.maxDutyTime());
    var time = this.timeTomilliSec(this.data.time);
    var CheckOutTime = this.timeTomilliSec(this.data.CheckOutTime);
    var timepassed = CheckOutTime-time;
    var dutyTimeRemain;
    if (timepassed < 0) {
      var dutyTimeRemain =maxDutyTime- ((24*3600*1000 - time) + CheckOutTime)
    } else if (timepassed >= 0) {
      dutyTimeRemain = maxDutyTime - timepassed;
    } ;
    if(dutyTimeRemain<0){
      wx.showToast({
        title: '超时了哟',
        icon:'none'
      })
    }


    console.log('有没有到这呀', maxDutyTime, time,CheckOutTime)
    return this.formatHour(dutyTimeRemain)

  },
  dutyEndTime: function () {
    var checkintime = this.data.time;
    var maxDutyTime = this.maxDutyTime();
    var totalRestTime=this.data.totalRestTime;

    var dutyEndTimemillices = this.timeTomilliSec(checkintime) + this.timeTomilliSec(maxDutyTime)+totalRestTime;
    var dutyEndTime = '';
    if (dutyEndTimemillices > this.timeTomilliSec('24:00')) {
      dutyEndTime = '明天' + this.formatHour(dutyEndTimemillices - this.timeTomilliSec('24:00'))
    } else if (dutyEndTimemillices < this.timeTomilliSec('24:00')) {
      dutyEndTime = this.formatHour(dutyEndTimemillices)
    }
    return dutyEndTime
  },



})