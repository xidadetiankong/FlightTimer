//index.js
const DATE = require('../../utils/util.js')
const app = getApp()
const date = new Date()
const formattedDate = DATE.formatTime(date).substring(0, 10)
const formattedTime = DATE.formatTime(date).substring(11, 16)

Page({
  data: {
    //乘务参数
    seatRange: ['20~50', '51~100', '101~150', '151~200', '201~250', '251~300', '301~350', '351~400', '401~450', '451~500', '501~550', '551~600', '601~750', '751~800', '800~850'],
    selecedSeats: '20~50',
    attNum: '0',

    //初始参数
    date: formattedDate, //签到日期
    time: formattedTime, //签到时间
    teamSize: ['非扩编机组', '扩编机组'],
    selectedTeam: '非扩编机组', //已选机组编制
    CheckOutDate: formattedDate, //中途退场日期
    CheckInDate2: formattedDate, //中途进场日期
    CheckOutTime: formattedTime, //中途退场时间
    CheckInTime2: formattedTime, //中途进场时间
    EndDate: formattedDate, //关车日期
    EndTime: formattedTime, //关车时间
    show_result: true, //是否隐藏结果弹出组件
    show_profess: true,
    hideRestTimeModal: true, // 隐藏宾休悬浮窗
    hasAccount: false,
    isFlightDuty:true,
    //非扩编机组
    flightSegment: '4', //飞行段数
    //扩编机组
    rstFaciliyLevel: '3', //休息设施等级
    crewNumbers: '3', //机组人数
    actureFlightLegs: 0,
    actureLandings: 0,
    userID: '',
    remarks: '',

    //结果参数
    dutyTimeRemainForShow: '',
    totalDutyTimeForShow: '',
    overTime: false,
    maxFlightTime: '',
    maxDutyTime: '',
    dutyEndTime: '',
    dutyTimeRemain: '',
    totalDutyTime: '',
    pauseTime: [],
    totalRestTime: 0, //total rest time in millisecond
    totalRestTimeInhours: '00:00',
    flightTime: '00:00',
    //下面这一堆不用重置

    profession: '',

    pilotHidde: false,
    attendentHidde: true,
    security: true,
    others: true,
    //夜航判定
    nightFlight:false
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
  onLoad: function () {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })

    
  },

  onShow: function () {

    
    this.setData({
      show_result: true
    })

   
  },
  onReady: function () {
   
  },
 
  gotoredg: function () {
    wx.switchTab({
      url: '../profile/profile',
    })
  },
  //collection      timeData




  refreshBTN: function () {
    const currentDate = new Date();
    const formattedDate = DATE.formatTime(currentDate).substring(0, 10);
    const formattedTime = DATE.formatTime(currentDate).substring(11, 16);
    
    this.setData({
      //乘务参数
      seatRange: ['20~50', '51~100', '101~150', '151~200', '201~250', '251~300', '301~350', '351~400', '401~450', '451~500', '501~550', '551~600', '601~750', '751~800', '800~850'],
      selecedSeats: '151~200',
      attNum: '0',

      //初始参数
      date: formattedDate, //签到日期
      time: formattedTime, //签到时间
      teamSize: ['非扩编机组', '扩编机组'],
      selectedTeam: '非扩编机组', //已选机组编制
      CheckOutDate: formattedDate, //中途退场日期
      CheckInDate2: formattedDate, //中途进场日期
      CheckOutTime: formattedTime, //中途退场时间
      CheckInTime2: formattedTime, //中途进场时间
      EndDate: formattedDate, //关车日期
      EndTime: formattedTime, //关车时间
      show_result: true, //是否隐藏结果弹出组件
      show_profess: true,
      hideRestTimeModal: true, // 重置时隐藏宾休悬浮窗
      isFlightDuty:true,
      //非扩编机组
      flightSegment: '4', //飞行段数
      //扩编机组
      rstFaciliyLevel: '3', //休息设施等级
      crewNumbers: '3', //机组人数
      actureFlightLegs: 0,
      actureLandings: 0,
      remarks: '',


      //结果参数
      dutyTimeRemainForShow: '',
      totalDutyTimeForShow: '',
      overTime: false,
      maxFlightTime: '',
      maxDutyTime: '',
      dutyEndTime: '',
      dutyTimeRemain: '',
      totalDutyTime: '',
      pauseTime: [],
      totalRestTime: 0, //total rest time in millisecond
      totalRestTimeInhours: '00:00',
      flightTime: '00:00',
    })
  },
  pfToPilot: function () {
    this.setData({
      profession: 'pilot',
      pilotHidde: false,
      attendentHidde: true,
      security: true,
      others: true,
      show_profess: true
    })

  },
  pfToAttdent: function () {
    this.setData({
      profession: 'attendant',
      pilotHidde: true,
      attendentHidde: false,
      security: true,
      others: true,
      show_profess: true
    })

  },
  pfToSecurity: function () {
    this.setData({
      profession: 'security',
      pilotHidde: true,
      attendentHidde: true,
      security: false,
      others: true,
      show_profess: true
    })

  },
  pfToOthers: function () {
    this.setData({
      profession: 'others',
      show_profess: true,
      pilotHidde: true,
      attendentHidde: true,
      security: true,
      others: false
    })

  },

  selectCheckInTime: function (e) { //选择签到时间
    this.setData({
      time: e.detail.value
    })
  },
  selectCheckInDate: function (e) { //选择签到日期
    let date = e.detail.value
    date = DATE.appleFormate(date)
    this.setData({
      date: date
    })
  },
  selectTeam: function (e) { //选择机组编制
    var teamSize = this.data.teamSize;
    this.setData({
      selectedTeam: teamSize[e.detail.value]
    })
    console.log(this.data.selectedTeam)
  },
  //中途离场

  selectCheckOutDate: function (e) { //中途退场日期
    let CheckOutDate = e.detail.value;
    CheckOutDate = DATE.appleFormate(CheckOutDate)
    this.setData({
      CheckOutDate: CheckOutDate
    })
  },
  selectCheckInDate2: function (e) { //中途进场时间
    let CheckInDate2 = e.detail.value;
    CheckInDate2 = DATE.appleFormate(CheckInDate2)
    this.setData({
      CheckInDate2: CheckInDate2
    })
  },
  selectCheckOutTime: function (e) { //中途退场时间
    this.setData({
      CheckOutTime: e.detail.value
    })
  },
  selectCheckInTime2: function (e) { //中途进场时间

    this.setData({
      CheckInTime2: e.detail.value
    })
  },


  //
  selectEndTime: function (e) { //选择结束时间
    this.setData({
      EndTime: e.detail.value
    })
  },

  selectEndDate: function (e) { //选择结束日期
    let EndDate = e.detail.value
    EndDate = DATE.appleFormate(EndDate)
    this.setData({
      EndDate: EndDate
    })
  },

  selectFlightTime: function (e) { //选择飞行时间

    let a = e.detail.value
    let flightTimeForUp = DATE.timeToStamp('1970/01/01', a);
    this.setData({
      flightTime: e.detail.value,
      flightTimeForUp: flightTimeForUp
    })
  },

  //选择其它数据确认是飞行执勤期
  switchChange:function(e){
    this.setData({
      isFlightDuty:e.detail.value
    })
  },
  //确认是否是夜航
  switchChangeNight:function(e){
    this.setData({
      nightFlight:e.detail.value
    })
  },
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
  //add flightlegs and landings//actureFlightLegs:0, actureLandings:0,


  inputFltLegs: function (ev) {
    let value = ev.detail.value;
    this.data.actureFlightLegs = parseInt(value)

  },
  inputLandings: function (ev) {
    let value = ev.detail.value;
    this.data.actureLandings = parseInt(value)

  },
  remarks: function (ev) {
    let value = ev.detail.value;
    this.data.remarks = value

  },
  addRestTime: function () { //optimized
    var checkintime = DATE.timeToStamp(this.data.date, this.data.time);
    var CheckOutTime = DATE.timeToStamp(this.data.CheckOutDate, this.data.CheckOutTime);
    var CheckInTime2 = DATE.timeToStamp(this.data.CheckInDate2, this.data.CheckInTime2);
    var pauseTime = this.data.pauseTime; //中间休息时间组成的数组
    var timediff = CheckInTime2 - CheckOutTime; //number

    if (checkintime > CheckOutTime) {
      wx.showToast({
        title: '短停关车（退场）时间需晚于签到时间',
        icon: 'none'
      })
      return
    } else {
      if (timediff < 0) {
        wx.showToast({
          title: '中途进场时间需晚于中途退场时间',
          icon: 'none'
        })
        return
      } else if (timediff > 0) {
        this.data.pauseTime.push(timediff)
        wx.showToast({
          title: '添加成功',
        })
        this.setData({
          takerest: true,
          hideRestTimeModal: true // 添加成功后隐藏悬浮窗
        })
      } else {
        wx.showToast({
          title: '未输入有效时间',
          icon: 'none'
        })
        return
      }
    }

    // 使用util中的计算总休息时间函数
    var totalRestTime = DATE.calculateTotalRestTime(pauseTime);
    
    this.setData({
      totalRestTime: totalRestTime,
      totalRestTimeInhours: DATE.formatHour(totalRestTime)
    })
  },

  timeToFormate: function (res) {
    res = new Date(res)
    res = DATE.formatTime(res)
    return
  },

  resultBTN: function () {
    let totalDutyTime = this.total_dutytime();
    if (totalDutyTime === null) return;
    
    let maxFlightTime = this.maxFlightTime();
    let maxDutyTime = this.maxDutyTime();
    let dutyTimeRemain = this.dutyTimeRemain();
    if (dutyTimeRemain === null) return;
    
    let dutyEndTime = this.dutyEndTime();

    this.setData({
      dutyEndTime: dutyEndTime,
      dutyTimeRemain: dutyTimeRemain,
      dutyTimeRemainForShow: DATE.formatHour(dutyTimeRemain),
      maxDutyTime: maxDutyTime,
      maxFlightTime: maxFlightTime,
      totalDutyTime: totalDutyTime,
      totalDutyTimeForShow: DATE.formatHour(totalDutyTime),
      show_result: false
    });
  },

  cancleUpload: function () { //隐藏计算结果组件
    this.setData({
      show_result: true,
      overTime: false

    })
  },
  tipsBTN: function () {

    this.setData({
      show_profess: false
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


  total_dutytime: function () { //计算实际执勤时间供调用返回值为timestamp Optimized
    var checkintime = DATE.timeToStamp(this.data.date, this.data.time);
    var EndTime = DATE.timeToStamp(this.data.EndDate, this.data.EndTime);
    
    // 使用util中的计算总值勤时间函数
    var totalDutyTime = DATE.calculateTotalDutyTime(checkintime, EndTime, this.data.totalRestTime);
    
    if (totalDutyTime === null) {
      wx.showToast({
        title: '截止时间需晚于签到时间',
        icon: 'none'
      })
      return null;
    }

    // 检查是否超时
    if (totalDutyTime > DATE.timeToStamp('1970/01/01', this.maxDutyTime())) {
      wx.showToast({
        title: '超时了呦',
      });
      this.setData({
        overTime: true
      })
    }

    return totalDutyTime;
  },

  maxFlightTime: function () { //根据机组编制分为两组两个条件，条件一根据签到时间输出结果，条件二根据机组人数输出结果
    var checkintime = new Date((('1970/01/01') + ' ' + this.data.time)).valueOf();
    var am5 = new Date((('1970/01/01') + ' ' + '05:00')).valueOf()
    var pm8 = new Date((('1970/01/01') + ' ' + '20:00')).valueOf()
    var am00 = new Date((('1970/01/01') + ' ' + '24:00')).valueOf()
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

    console.log(new Date((('1970/01/01') + ' ' + time)).valueOf())

  },
  //计算最大值勤期
  maxDutyTime: function () {
    var checkintime = new Date((('1970/01/01') + ' ' + this.data.time)).valueOf();
    var am5 = new Date((('1970/01/01') + ' ' + '05:00')).valueOf()
    var am12 = new Date((('1970/01/01') + ' ' + '12:00')).valueOf()
    var pm12 = new Date((('1970/01/01') + ' ' + '24:00')).valueOf()

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

      } else if ((checkintime >= am5) && (checkintime < am12)) {
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
      } else if (checkintime >= am12) {
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
    var maxDutyTime = DATE.timeToStamp('1970/01/01', this.maxDutyTime());
    var checkintime = DATE.timeToStamp(this.data.date, this.data.time);
    var CheckOutTime = DATE.timeToStamp(this.data.CheckOutDate, this.data.CheckOutTime);
    var timepassed = CheckOutTime - checkintime;
    var totalDutyTime = this.total_dutytime();
    
    if (totalDutyTime === null) {
      return null;
    }
    
    if (timepassed < 0) {
      wx.showToast({
        title: '短停时间错误',
      })
      return null;
    } else if (timepassed == 0 && totalDutyTime == 0) {
      wx.showToast({
        title: '能量还未消耗，开始快乐的工作吧！',
        icon: 'none'
      })
    }

    // 使用util中的计算剩余值勤时间函数
    var dutyTimeRemain = DATE.calculateDutyTimeRemain(maxDutyTime, totalDutyTime);
    
    if (dutyTimeRemain < 0) {
      wx.showToast({
        title: '超时了哟',
        icon: 'none'
      });
      this.setData({
        overTime: true
      })
      return 0;
    }

    return dutyTimeRemain;
  },
  
  dutyEndTime: function () {
    var maxDutyTime = DATE.timeToStamp('1970/01/01', this.maxDutyTime());
    var checkintime = DATE.timeToStamp(this.data.date, this.data.time);
    var totalRestTime = this.data.totalRestTime;

    // 使用util中的计算值勤截止时间函数
    var dutyEndTimeDate = DATE.calculateDutyEndTime(checkintime, maxDutyTime, totalRestTime);
    var dutyEndTime = DATE.formatTime(dutyEndTimeDate);

    return dutyEndTime;
  },

  onShareAppMessage: function (res) {

    return {
      title: '大家都在用的值勤时间记录小程序',
      imageUrl: '../../img/shareimage1.png'
    }

  },




  //乘务员数据计算
  selectSeatRange: function (e) {

    var seatRange = this.data.seatRange

    this.setData({
      selecedSeats: seatRange[e.detail.value]
    })
    console.log(this.data.selecedSeats)

  },
  //计算最低配置人数输出数字
  minimumCrew: function () {
    var selecedSeats = this.data.selecedSeats
    switch (selecedSeats) {
      case '20~50':
        return 1
      case '51~100':
        return 2
      case '101~150':
        return 3
      case '151~200':
        return 4
      case '201~250':
        return 5
      case '251~300':
        return 6
      case '351~400':
        return 7
      case '401~450':
        return 8
      case '451~500':
        return 9
      case '501~550':
        return 10
      case '551~600':
        return 11
      case '601~750':
        return 12
      case '751~800':
        return 13
      case '800~850':
        return 14
    }
  },
  choseAttNum(e) {
    this.setData({
      attNum: e.detail.value
    })

  },

  AttMaxduty: function () { //返回字串格式最大执勤时间
    var attNum = this.data.attNum
    switch (attNum) {
      case '0':
        return '14:00'
      case '1':
        return '16:00'
      case '2':
        return '18:00'
      case '3':
        return '20:00'
    }

  },
  attDutyEndTime: function () {
    var maxDutyTime = DATE.timeToStamp('1970/01/01', this.AttMaxduty());
    var checkintime = DATE.timeToStamp(this.data.date, this.data.time);
    var totalRestTime = this.data.totalRestTime;

    // 使用util中的计算值勤截止时间函数
    var dutyEndTimeDate = DATE.calculateDutyEndTime(checkintime, maxDutyTime, totalRestTime);
    var dutyEndTime = DATE.formatTime(dutyEndTimeDate);

    return dutyEndTime;
  },
  
  attDutyTimeRemain: function () {
    var maxDutyTime = DATE.timeToStamp('1970/01/01', this.AttMaxduty());
    var checkintime = DATE.timeToStamp(this.data.date, this.data.time);
    var CheckOutTime = DATE.timeToStamp(this.data.CheckOutDate, this.data.CheckOutTime);
    var timepassed = CheckOutTime - checkintime;
    var totalDutyTime = this.total_dutytime();
    
    if (totalDutyTime === null) {
      return null;
    }
    
    if (timepassed < 0) {
      wx.showToast({
        title: '短停时间错误',
      })
      return null;
    } else if (timepassed == 0 && totalDutyTime == 0) {
      wx.showToast({
        title: '能量还未消耗，开始快乐的工作吧！',
        icon: 'none'
      })
    }

    // 使用util中的计算剩余值勤时间函数
    var dutyTimeRemain = DATE.calculateDutyTimeRemain(maxDutyTime, totalDutyTime);
    
    if (dutyTimeRemain < 0) {
      wx.showToast({
        title: '超时了哟',
        icon: 'none'
      });
      this.setData({
        overTime: true
      })
      return 0;
    }

    return dutyTimeRemain;
  },
  attresultBTN: function () {
    let totalDutyTime = this.total_dutytime();
    if (totalDutyTime === null) return;
    
    let maxDutyTime = this.AttMaxduty();
    let dutyTimeRemain = this.attDutyTimeRemain();
    if (dutyTimeRemain === null) return;
    
    let dutyEndTime = this.attDutyEndTime();
    let mincrew = this.minimumCrew();

    this.setData({
      mincrew: mincrew,
      dutyEndTime: dutyEndTime,
      dutyTimeRemain: dutyTimeRemain,
      dutyTimeRemainForShow: DATE.formatHour(dutyTimeRemain),
      maxDutyTime: maxDutyTime,
      totalDutyTime: totalDutyTime,
      totalDutyTimeForShow: DATE.formatHour(totalDutyTime),
      show_result: false
    });
  },



  //安全员
  seTotal_dutytime: function () {
    var checkintime = DATE.timeToStamp(this.data.date, this.data.time);
    var EndTime = DATE.timeToStamp(this.data.EndDate, this.data.EndTime);
    
    // 使用util中的计算总值勤时间函数
    var totalDutyTime = DATE.calculateTotalDutyTime(checkintime, EndTime, this.data.totalRestTime);
    
    if (totalDutyTime === null) {
      wx.showToast({
        title: '截止时间需晚于签到时间',
        icon: 'none'
      })
      return null;
    }

    return totalDutyTime;
  },
  secResultBTN: function () {
    let totalDutyTime = this.seTotal_dutytime();
    if (totalDutyTime === null) return;

    this.setData({
      totalDutyTime: totalDutyTime,
      totalDutyTimeForShow: DATE.formatHour(totalDutyTime),
      show_result: false
    });
  },

  // 显示宾休悬浮窗
  showRestTimeModal: function() {
    this.setData({
      hideRestTimeModal: false
    });
  },

  // 隐藏宾休悬浮窗
  hideRestTimeModal: function() {
    this.setData({
      hideRestTimeModal: true
    });
  },

})