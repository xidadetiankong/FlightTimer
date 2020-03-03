const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
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
}
const compare=(property) =>{//比值降序函数
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value2 - value1;
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
  
 

return year+'-'+month
}
const dayNow=res=>{
  var date = new Date(res);
  let year = date.getFullYear().toString()
  let month = (date.getMonth() + 1).toString()
  let day = date.getDate().toString()
 

return year+'-'+month+'-'+ day 
}
const timeNow=res=>{
  var date = new Date(res);
  
  let hour = date.getHours().toString()
  let minute = formatNumber(date.getMinutes());
  let second = formatNumber(date.getSeconds());

return  hour+':'+ minute+':'+ second
}
const stamptoformatTime=(res)=>{
  var date = new Date(res);
  let year = date.getFullYear().toString()
  let month = (date.getMonth() + 1).toString()
  let day = date.getDate().toString()
  let hour = date.getHours().toString()
  let minute = formatNumber(date.getMinutes());
  let second =  formatNumber(date.getSeconds());

return year+'-'+month+'-'+ day + ' ' + hour+':'+ minute+':'+ second
  
}

const arrySum=res=>{
var sumValue=0
  res.forEach(element=>{
sumValue=sumValue+element
  })

  return sumValue
}


module.exports = {
  arrySum:arrySum,
  stamptoformatTime:stamptoformatTime,
  formatHour:formatHour,
  timeToStamp:timeToStamp,
  timeDifferent:timeDifferent,
  formatTime: formatTime,
  compare:compare,
  yearNow:yearNow,
  monthNow:monthNow,
  dayNow:dayNow,
  timeNow:timeNow
}
