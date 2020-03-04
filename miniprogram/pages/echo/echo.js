//index.js
const DATE = require('../../utils/util.js')
const app = getApp()
const db = wx.cloud.database({
  env: 'mydatabase-rwjnb'
}) //need designate an envirment id
const date = new Date()

Page({
  data: {
    //乘务参数
    seatRange: ['20~50', '51~100', '101~150', '151~200', '201~250', '251~300', '301~350', '351~400', '401~450', '451~500', '501~550', '551~600', '601~750', '751~800', '800~850'],
    selecedSeats:'20~50',
    attNum: '0',

    //初始参数
    date: DATE.formatTime(date).substring(0, 10), //签到日期
    time: DATE.formatTime(date).substring(11, 16), //签到时间
    teamSize: ['非扩编机组', '扩编机组'],
    selectedTeam: '非扩编机组', //已选机组编制
    CheckOutDate: DATE.formatTime(date).substring(0, 10), //中途退场日期
    CheckInDate2: DATE.formatTime(date).substring(0, 10), //中途进场日期
    CheckOutTime: DATE.formatTime(date).substring(11, 16), //中途退场时间
    CheckInTime2: DATE.formatTime(date).substring(11, 16), //中途进场时间
    EndDate: DATE.formatTime(date).substring(0, 10), //关车日期
    EndTime: DATE.formatTime(date).substring(11, 16), //关车时间
    show_result: true, //是否隐藏结果弹出组件
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
    //下面这一堆不用重置

    profession: '',

    pilotHidde: false,
    attendentHidde: true,
    security:true,
    others:true


  },
  
  onShow: function () {

    this.refreshBTN()
            this.setData({
              show_result: true
            })
    
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then((res) => { //使用DOC可以监听普通ID，但是唯一标识openId需要使用where
      // console.log(res);
      db.collection('userprofile').where({
        _openid: res.result.openid
      }).get().then((res) => {
        if (res.data.length) {
          app.userInfo = Object.assign(app.userInfo, res.data[0]);
          this.setData({
            hasAccount: true,
            profession: app.userInfo.profession,

            userID: app.userInfo._id,

          })
          if(app.userInfo.profession==='pilot'){
            this.setData({
              pilotHidde: false,
              attendentHidde: true,
              security:true,
              others:true
              
            })
          }else if(app.userInfo.profession==='attendant'){
            this.setData({
              pilotHidde:true ,
              attendentHidde:false ,
              security:true,
              others:true
            })

          }else if(app.userInfo.profession==='security'){
            this.setData({
              pilotHidde:true ,
              attendentHidde:true ,
              security:false,
              others:true
            })
          }else if(app.userInfo.profession==='others'){
            this.setData({
              pilotHidde:true ,
              attendentHidde:true ,
              security:true,
              others:false
            })
          }

        }

      })
    })
  },
  onReady: function () {
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then((res) => { //使用DOC可以监听普通ID，但是唯一标识openId需要使用where
      // console.log(res);
      db.collection('userprofile').where({
        _openid: res.result.openid
      }).get().then((res) => {
        if (res.data.length) {
          app.userInfo = Object.assign(app.userInfo, res.data[0]);
          this.setData({
            hasAccount: true,
            profession: app.userInfo.profession,

            userID: app.userInfo._id,

          })
        }

      })
    })


  },
  uploadBTN: function () {
    var totalDutyTime = this.total_dutytime()
    var checkintime = DATE.timeToStamp(this.data.date, this.data.time);
    var EndTime = DATE.timeToStamp(this.data.EndDate, this.data.EndTime)
    if (totalDutyTime > 0) {
      wx.cloud.callFunction({ //用户鉴权确认是否已经注册
        name: 'login',
        data: {}
      }).then((res) => { //使用DOC可以监听普通ID，但是唯一标识openId需要使用where
        // console.log(res);
        db.collection('userprofile').where({
          _openid: res.result.openid
        }).get().then((res) => {
          if (res.data.length) {

            db.collection('timeData').add({
              data: {
                userid: this.data.userID,

              }
            }).then((res) => {
              wx.showLoading({
                title: '上传中',
              })
              db.collection('timeData').doc(res._id).update({

                data: {
                  remarks: this.data.remarks,
                  checkintime: checkintime,
                  EndTime: EndTime,
                  totalDutyTime: this.data.totalDutyTime,
                  overTime: this.data.overTime,
                  actureFlightLegs: this.data.actureFlightLegs,
                  actureLandings: this.data.actureLandings,
                }
              }).then((res) => {
                wx.hideLoading({})
                wx.showToast({
                  title: '成功添加记录',
                })
                this.refreshBTN()
                this.setData({
                  show_result: true,
                })
                console.log(res)
              })
            })

          } else {
            
            wx.switchTab({
              url: '../profile/profile',
            })
          }

        })
      })
    } else {
      wx.showToast({
        title: '请输入有效的截止时间',
        icon: 'none'
      })
    }

  },
  gotoredg:function(){
    wx.switchTab({
      url: '../profile/profile',
    })
  },
  //collection      timeData




  refreshBTN: function () {

    this.setData({
      //乘务参数
    seatRange: ['20~50', '51~100', '101~150', '151~200', '201~250', '251~300', '301~350', '351~400', '401~450', '451~500', '501~550', '551~600', '601~750', '751~800', '800~850'],
    selecedSeats: '151~200',
    attNum: '0',

    //初始参数
      date: DATE.formatTime(date).substring(0, 10), //签到日期
      time: DATE.formatTime(date).substring(11, 16), //签到时间
      teamSize: ['非扩编机组', '扩编机组'],
      selectedTeam: '非扩编机组', //已选机组编制
      CheckOutDate: DATE.formatTime(date).substring(0, 10), //中途退场日期
      CheckInDate2: DATE.formatTime(date).substring(0, 10), //中途进场日期
      CheckOutTime: DATE.formatTime(date).substring(11, 16), //中途退场时间
      CheckInTime2: DATE.formatTime(date).substring(11, 16), //中途进场时间
      EndDate: DATE.formatTime(date).substring(0, 10), //关车日期
      EndTime: DATE.formatTime(date).substring(11, 16), //关车时间
      show_result: true, //是否隐藏结果弹出组件
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
      totalRestTimeInhours: '00:00'


    })
  },

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
  //中途离场

  selectCheckOutDate: function (e) { //中途退场日期
    this.setData({
      CheckOutDate: e.detail.value
    })
  },
  selectCheckInDate2: function (e) { //中途进场时间

    this.setData({
      CheckInDate2: e.detail.value
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
          takerest: true
        })
      } else {
        wx.showToast({
          title: '未输入有效时间',
          icon: 'none'
        })
        return
      }
    }

    var totalRestTime = 0;
    for (let i = 0; i < this.data.pauseTime.length; i++) {
      totalRestTime = totalRestTime + pauseTime[i]
    }
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
    //显示计算结果组件改进后需要区分展示数据和上传数据
   
   
     
        let totalDutyTime = this.total_dutytime();
        let maxFlightTime = this.maxFlightTime();
        let maxDutyTime = this.maxDutyTime();
        let dutyTimeRemain = this.dutyTimeRemain();
        let dutyEndTime = this.dutyEndTime();



        this.setData({
          dutyEndTime: dutyEndTime,
          dutyTimeRemain: dutyTimeRemain,
          dutyTimeRemainForShow: DATE.formatHour(dutyTimeRemain),
          maxDutyTime: maxDutyTime,
          maxFlightTime: maxFlightTime,
          totalDutyTime: totalDutyTime,
          totalDutyTimeForShow: DATE.formatHour(totalDutyTime),
          show_result: false // control element hidde
        })

     

  },
  cancleUpload: function () { //隐藏计算结果组件
    this.setData({
      show_result: true,
      overTime: false

    })
  },
  tipsBTN: function () {

    
    wx.showToast({
      title: '点击添加按钮使休息时间参与到计算中，可多次添加。修改点击重置',
      icon: 'none',
      duration: 4000
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
    if (EndTime < checkintime) {
      wx.showToast({
        title: '截止时间需晚于签到时间',
        icon: 'none'
      })
      return
    } else if (EndTime >= checkintime) {
      var totalDutyTime = EndTime - checkintime - this.data.totalRestTime
    };

    if (totalDutyTime > DATE.timeToStamp('1970-01-01', this.maxDutyTime())) {
      wx.showToast({
        title: '超时了呦',
      });
      this.setData({
        overTime: true
      })
    }

    console.log(totalDutyTime)
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
  dutyTimeRemain: function () { //optimized 返回值为timestamp

    var maxDutyTime = DATE.timeToStamp('1970-01-01', this.maxDutyTime());
    var checkintime = DATE.timeToStamp(this.data.date, this.data.time);
    var CheckOutTime = DATE.timeToStamp(this.data.CheckOutDate, this.data.CheckOutTime);
    var timepassed = CheckOutTime - checkintime;
    var totalDutyTime = this.total_dutytime();
    var resttime = this.data.totalRestTime;
    var dutyTimeRemain;
    if (timepassed < 0) {
      wx.showToast({
        title: '短停时间错误',

      })
      return
    } else if (timepassed == 0 && totalDutyTime == 0) {
      wx.showToast({
        title: '能量还未消耗，开始快乐的工作吧！',
        icon: 'none'
      })
    };

    dutyTimeRemain = maxDutyTime - totalDutyTime;
    if (dutyTimeRemain < 0) {
      wx.showToast({
        title: '超时了哟',
        icon: 'none'
      });
      this.setData({
        overTime: true
      })
      return 0
    }


    console.log('有没有到这呀', maxDutyTime, timepassed, totalDutyTime)
    return dutyTimeRemain

  },
  dutyEndTime: function () { //optimized return  a timeStamp
    var maxDutyTime = DATE.timeToStamp('1970-01-01', this.maxDutyTime());
    var checkintime = DATE.timeToStamp(this.data.date, this.data.time);

    var totalRestTime = this.data.totalRestTime;


    var dutyEndTime = checkintime + maxDutyTime + totalRestTime - 28800000,
      dutyEndTime = new Date(dutyEndTime)
    dutyEndTime = DATE.formatTime(dutyEndTime)


    return dutyEndTime
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
  attDutyEndTime: function () { //optimized return  a timeStamp
    var maxDutyTime = DATE.timeToStamp('1970-01-01', this.AttMaxduty());
    var checkintime = DATE.timeToStamp(this.data.date, this.data.time);

    var totalRestTime = this.data.totalRestTime;


    var dutyEndTime = checkintime + maxDutyTime + totalRestTime - 28800000,
      dutyEndTime = new Date(dutyEndTime)
    dutyEndTime = DATE.formatTime(dutyEndTime)


    return dutyEndTime
  },
  attDutyTimeRemain: function () { //optimized 返回值为timestamp

    var maxDutyTime = DATE.timeToStamp('1970-01-01', this.AttMaxduty());
    var checkintime = DATE.timeToStamp(this.data.date, this.data.time);
    var CheckOutTime = DATE.timeToStamp(this.data.CheckOutDate, this.data.CheckOutTime);
    var timepassed = CheckOutTime - checkintime;
    var totalDutyTime = this.total_dutytime();
    var resttime = this.data.totalRestTime;
    var dutyTimeRemain;
    if (timepassed < 0) {
      wx.showToast({
        title: '短停时间错误',

      })
      return
    } else if (timepassed == 0 && totalDutyTime == 0) {
      wx.showToast({
        title: '能量还未消耗，开始快乐的工作吧！',
        icon: 'none'
      })
    };

    dutyTimeRemain = maxDutyTime - totalDutyTime;
    if (dutyTimeRemain < 0) {
      wx.showToast({
        title: '超时了哟',
        icon: 'none'
      });
      this.setData({
        overTime: true
      })
      return 0
    }


    console.log('有没有到这呀', maxDutyTime, timepassed, totalDutyTime)
    return dutyTimeRemain

  },
  attresultBTN: function () { //显示计算结果组件改进后需要区分展示数据和上传数据
    
    let totalDutyTime1 = this.total_dutytime();
    let maxDutyTime1 = this.AttMaxduty();
    let dutyTimeRemain1 = this.attDutyTimeRemain();
    let dutyEndTime1 = this.attDutyEndTime();
    let mincrew=this.minimumCrew()



    this.setData({
      mincrew:mincrew,
      dutyEndTime: dutyEndTime1,
      dutyTimeRemain: dutyTimeRemain1,
      dutyTimeRemainForShow: DATE.formatHour(dutyTimeRemain1),
      maxDutyTime: maxDutyTime1,
      totalDutyTime: totalDutyTime1,
      totalDutyTimeForShow: DATE.formatHour(totalDutyTime1),
      show_result: false // control element hidde
    })
  },
  attUploadBTN: function () {
    var totalDutyTime = this.total_dutytime()
    var checkintime = DATE.timeToStamp(this.data.date, this.data.time);
    var EndTime = DATE.timeToStamp(this.data.EndDate, this.data.EndTime)
    if (totalDutyTime > 0) {
      wx.cloud.callFunction({ //用户鉴权确认是否已经注册
        name: 'login',
        data: {}
      }).then((res) => { //使用DOC可以监听普通ID，但是唯一标识openId需要使用where
        // console.log(res);
        db.collection('userprofile').where({
          _openid: res.result.openid
        }).get().then((res) => {
          if (res.data.length) {

            db.collection('timeData').add({
              data: {
                userid: this.data.userID,

              }
            }).then((res) => {
              wx.showLoading({
                title: '上传中',
              })
              db.collection('timeData').doc(res._id).update({

                data: {
                  remarks: this.data.remarks,
                  checkintime: checkintime,
                  EndTime: EndTime,
                  totalDutyTime: this.data.totalDutyTime,
                  overTime: this.data.overTime,
                  actureFlightLegs: this.data.actureFlightLegs,
                }
              }).then((res) => {
                wx.hideLoading({})
                wx.showToast({
                  title: '成功添加记录',
                })
                this.refreshBTN()
                this.setData({
                  show_result: true,
                })
                console.log(res)
              })
            })

          } else {
            wx.switchTab({
              url: '../profile/profile',
            })
          }

        })
      })
    } else {
      wx.showToast({
        title: '请输入有效的截止时间',
        icon: 'none'
      })
    }

  },


  //安全员
  seTotal_dutytime: function () { //计算实际执勤时间供调用返回值为timestamp Optimized
    var checkintime = DATE.timeToStamp(this.data.date, this.data.time);
    var EndTime = DATE.timeToStamp(this.data.EndDate, this.data.EndTime);
    if (EndTime < checkintime) {
      wx.showToast({
        title: '截止时间需晚于签到时间',
        icon: 'none'
      })
      return
    } else if (EndTime >= checkintime) {
      var totalDutyTime = EndTime - checkintime - this.data.totalRestTime
    };

    console.log(totalDutyTime)
    return totalDutyTime

  },
  secResultBTN:function(){
    let totalDutyTime = this.seTotal_dutytime();
        
    
        this.setData({
          totalDutyTime: totalDutyTime,
          totalDutyTimeForShow: DATE.formatHour(totalDutyTime),
          show_result: false // control element hidde
        })
  },
  seUploadBTN: function () {
    var totalDutyTime = this.total_dutytime()
    var checkintime = DATE.timeToStamp(this.data.date, this.data.time);
    var EndTime = DATE.timeToStamp(this.data.EndDate, this.data.EndTime)
    if (totalDutyTime > 0) {
      wx.cloud.callFunction({ //用户鉴权确认是否已经注册
        name: 'login',
        data: {}
      }).then((res) => { //使用DOC可以监听普通ID，但是唯一标识openId需要使用where
        // console.log(res);
        db.collection('userprofile').where({
          _openid: res.result.openid
        }).get().then((res) => {
          if (res.data.length) {

            db.collection('timeData').add({
              data: {
                userid: this.data.userID,

              }
            }).then((res) => {
              wx.showLoading({
                title: '上传中',
              })
              db.collection('timeData').doc(res._id).update({

                data: {
                  remarks: this.data.remarks,
                  checkintime: checkintime,
                  EndTime: EndTime,
                  totalDutyTime: this.data.totalDutyTime,
                  actureFlightLegs: this.data.actureFlightLegs,
                }
              }).then((res) => {
                wx.hideLoading({})
                wx.showToast({
                  title: '成功添加记录',
                })
                this.refreshBTN()
                this.setData({
                  show_result: true,
                })
                console.log(res)
              })
            })

          } else {
            wx.switchTab({
              url: '../profile/profile',
            })
          }

        })
      })
    } else {
      wx.showToast({
        title: '请输入有效的截止时间',
        icon: 'none'
      })
    }

  },
  otherUploadBTN: function () {
    var totalDutyTime = this.total_dutytime()
    var checkintime = DATE.timeToStamp(this.data.date, this.data.time);
    var EndTime = DATE.timeToStamp(this.data.EndDate, this.data.EndTime)
    if (totalDutyTime > 0) {
      wx.cloud.callFunction({ //用户鉴权确认是否已经注册
        name: 'login',
        data: {}
      }).then((res) => { //使用DOC可以监听普通ID，但是唯一标识openId需要使用where
        // console.log(res);
        db.collection('userprofile').where({
          _openid: res.result.openid
        }).get().then((res) => {
          if (res.data.length) {

            db.collection('timeData').add({
              data: {
                userid: this.data.userID,

              }
            }).then((res) => {
              wx.showLoading({
                title: '上传中',
              })
              db.collection('timeData').doc(res._id).update({

                data: {
                  remarks: this.data.remarks,
                  checkintime: checkintime,
                  EndTime: EndTime,
                  totalDutyTime: this.data.totalDutyTime,
                }
              }).then((res) => {
                wx.hideLoading({})
                wx.showToast({
                  title: '成功添加记录',
                })
                this.refreshBTN()
                this.setData({
                  show_result: true,
                })
                console.log(res)
              })
            })

          } else {
            wx.switchTab({
              url: '../profile/profile',
            })
          }

        })
      })
    } else {
      wx.showToast({
        title: '请输入有效的截止时间',
        icon: 'none'
      })
    }

  },

})