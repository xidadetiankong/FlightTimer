const formatTime = date => {
  
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


const timeToStamp=(day ,time)=> {
  var timeStampLoc = new Date((day + ' ' + time)).valueOf() + 28800000;
  return timeStampLoc
}

const timeDifferent= (timeStart, timeEnd)=> { //计算时间差
  const start = new Date(timeStart).valueOf();
  var end = new Date(timeEnd).valueOf();

  var timeStpDiff = end - start;

  var time = this.formatTime(timeStpDiff);

  if (timeStpDiff <= 0) { //判断时间输入
    time = '0:00'
    return time
  } else {
    return time
  }
}

const formatHour= (res)=> {
  if(isNaN(res)==true){
    var time='00:00'
  }else{
    var hours = Math.floor(res / (3600 * 1000));
    var restMilSec = res % (3600 * 1000);
    var minutes = Math.floor(restMilSec / (60 * 1000));
    var time = hours + ':' + minutes;
    if (hours>=10&&minutes < 10) {
      var time = hours + ':' +'0'+ minutes ;
    }else if(hours>=10&&minutes>=10){
      var time = hours + ':' + minutes ;
    }else if(hours<10&&minutes<10){
      var time = '0'+hours + ':' + '0'+minutes ;
    } else if(hours<10&&minutes>=10) {
      var time = '0'+hours + ':' + minutes;
    }

  }
  
  return time
}
const compare=(property) =>{//比值降序函数,看返回值如果value2-value1大于零则在arrSort（）函数下对比结果值b排序靠前
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value2 - value1;
  }

}
const compare1=(property) =>{//比值降序函数,看返回值如果value2-value1大于零则在arrSort（）函数下对比结果值b排序靠前
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }

}
const yearNow=res=>{
  var date = new Date(res);
  let year = date.getFullYear().toString()
 
 

return year
}
const monthNow=res=>{
  var date = new Date(res);
  let year = date.getFullYear().toString()
  let month = (date.getMonth() + 1).toString()
  
 

return year+'/'+month
}
const dayNow=res=>{
  var date = new Date(res);
  let year = date.getFullYear().toString()
  let month = (date.getMonth() + 1).toString()
  let day = date.getDate().toString()
 

return year+'/'+month+'/'+ day 
}
const timeNow=res=>{
  var date = new Date(res);
  
  let hour = date.getHours().toString()
  let minute = formatNumber(date.getMinutes());
  let second = formatNumber(date.getSeconds());

return  hour+':'+ minute+':'+ second
}
const stamptoformatTime=(res)=>{

  if(isNaN(res)==true){
    return '1970'+'/'+'01'+'/'+ '01' + ' ' + '00'+':'+ '00'+':'+ '00'
  }else{
    var date = new Date(res);
    let year = date.getFullYear().toString()
    let month = (date.getMonth() + 1).toString()
    let day = date.getDate().toString()
    let hour = date.getHours().toString()
    let minute = formatNumber(date.getMinutes());
    let second =  formatNumber(date.getSeconds());

    return year+'/'+month+'/'+ day + ' ' + hour+':'+ minute+':'+ second
  }
  


  
}

const arrySum=res=>{
var sumValue=0
  res.forEach(element=>{
sumValue=sumValue+element
  })

  return sumValue
}

const appleFormate=res=>{
  res= res.replace(/\-/g, '/');
  return res
}

const collectitem=res=> {
 
  var restotaldutytime = 0;
  var restotalFlightlegs = 0;
  var restotalLandings = 0;
  var restotalFlightTimes=0;
  for (let i = 0; i < res.length; i++) { //运算历史总值勤时间
    
    
    
    

    if(isNaN(res[i].actureLandings)){
      restotalLandings = restotalLandings

    }else{
      restotalLandings = restotalLandings + res[i].actureLandings;
    }


    if(isNaN(res[i].actureFlightLegs)){
      restotalFlightlegs = restotalFlightlegs

    }else{
      restotalFlightlegs = restotalFlightlegs + res[i].actureFlightLegs;
    }

    if(isNaN(res[i].totalDutyTime)){
      restotaldutytime = restotaldutytime

    }else{
      restotaldutytime = restotaldutytime + res[i].totalDutyTime;
    }

    if(isNaN(res[i].flightTime)){
      restotalFlightTimes=restotalFlightTimes

    }else{
      restotalFlightTimes=restotalFlightTimes+res[i].flightTime
    }
    
  }
  restotalFlightTimes= formatHour(restotalFlightTimes)
  restotaldutytime =formatHour(restotaldutytime)
  

  return {
    restotaldutytime,
    restotalFlightlegs,
    restotalLandings,
    restotalFlightTimes
  }
}

// 新增计算总休息时间的函数
const calculateTotalRestTime = (pauseTime) => {
  let totalRestTime = 0;
  for (let i = 0; i < pauseTime.length; i++) {
    totalRestTime = totalRestTime + pauseTime[i];
  }
  return totalRestTime;
}

// 新增计算实际执勤时间的函数
const calculateTotalDutyTime = (checkInTime, endTime, totalRestTime) => {
  if (endTime < checkInTime) {
    return null; // 表示截止时间早于签到时间
  } else {
    return endTime - checkInTime - totalRestTime;
  }
}

// 新增计算值勤截止时间的函数
const calculateDutyEndTime = (checkInTime, maxDutyTime, totalRestTime) => {
  let dutyEndTimeStamp = checkInTime + maxDutyTime + totalRestTime - 28800000;
  return new Date(dutyEndTimeStamp);
}

// 新增计算剩余值勤时间的函数
const calculateDutyTimeRemain = (maxDutyTime, totalDutyTime) => {
  return maxDutyTime - totalDutyTime;
}

module.exports = {
  arrySum:arrySum,
  stamptoformatTime:stamptoformatTime,
  formatHour:formatHour,
  timeToStamp:timeToStamp,
  timeDifferent:timeDifferent,
  formatTime: formatTime,
  compare:compare,
  compare1:compare1,
  yearNow:yearNow,
  monthNow:monthNow,
  dayNow:dayNow,
  timeNow:timeNow,
  appleFormate:appleFormate,
  collectitem:collectitem,
  calculateTotalRestTime: calculateTotalRestTime,
  calculateTotalDutyTime: calculateTotalDutyTime,
  calculateDutyEndTime: calculateDutyEndTime,
  calculateDutyTimeRemain: calculateDutyTimeRemain
}
