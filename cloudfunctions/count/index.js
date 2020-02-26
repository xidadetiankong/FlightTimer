// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'mydatabase-rwjnb'
})
const db = cloud.database({env: 'mydatabase-rwjnb'})
const MAX_LIMIT = 1000
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid=wxContext.OPENID
  // 先取出集合记录总数
  const countResult = await db.collection('timeData').where({
    _openid:openid
  }).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 1000)
  
  
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('timeData') 
    .where({
      _openid:openid
    })
      .skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}