// nineHundred.js
Page({
  data: {
    currentIndex: 0, // 当前显示句子的索引
    totalSentences: 0, // 总句子数（用于进度显示）
    sentences: [], // 原始数据容器
    collected: new Set(), // 收藏状态集合（使用Set提升查询性能）
    currentSentence: {} // 当前显示的句子对象
  },

  // 生命周期函数--监听页面加载
  onLoad() {
    console.log('初始数据:', this.data.sentences.length, this.data.currentIndex)
    this.initData()
    this.loadCollections()
  },

  // 数据初始化方法
  initData() {
    try {
      const rawData = require('../../asset/aviationNineHundred')
      this.setData({
        sentences: rawData,
        totalSentences: rawData.length,
        currentSentence: this.processSentence(rawData[0])
      })
    } catch (e) {
      console.error('数据加载失败:', e)
      wx.showToast({
        title: '数据加载失败',
        icon: 'none'
      })
    }
  },

  // 数据处理方法（字段映射+格式处理）
  processSentence(raw) {
    return {
      id: raw.id,
      level: raw.等级, // 转换等级显示格式
      wordCount: raw.词数, // 添加单位说明
      sentence: raw.句子,
      translation: raw.译文
    }
  },

  // 加载收藏状态
  loadCollections() {
    const saved = wx.getStorageSync('collected') || []
    this.setData({
      collected: new Set(saved)
    })
  },

  // 翻页控制器
handlePageTurn(type) {

  console.log(type)

    const { currentIndex, sentences } = this.data
    let newIndex = currentIndex

    console.log('总数据量:', sentences.length, '当前索引:', currentIndex)


    if (type.currentTarget.dataset.type === "next") {
        newIndex = Math.min(currentIndex + 1, sentences.length - 1)
        console.log("测试newIndex是否变化"+newIndex)
    } else {
        newIndex = Math.max(currentIndex - 1, 0)
    }

    // 增加安全判断
    if (sentences[newIndex]) {
        this.setData({
            currentIndex: newIndex,
            currentSentence: this.processSentence(sentences[newIndex])
        })
    } else {
        wx.showToast({
            title: '已到达边界',
            icon: 'none'
        })
    }
    console.log('安全索引:', newIndex, '当前数据:', this.data.currentIndex)
},



  // 收藏/取消收藏
  toggleCollect() {
    const currentId = this.data.sentences[this.data.currentIndex].id
    const newCollected = new Set(this.data.collected)

    newCollected.has(currentId) ?
      newCollected.delete(currentId) :
      newCollected.add(currentId)

    this.setData({
      collected: newCollected,
      isCollected: newCollected.has(currentId) // 确保状态准确
    })
    wx.setStorageSync('collected', Array.from(newCollected))
    wx.showToast({
      title: newCollected.has(currentId) ? '已收藏' : '已取消',
      icon: 'none'
    })
  },

  // 重置功能
  handleReset() {
    this.setData({
      currentIndex: 0,
      collected: new Set(),
      currentSentence: this.processSentence(this.data.sentences[0])
    })
    wx.removeStorageSync('collected')
    wx.showToast({
      title: '已重置学习进度',
      icon: 'success'
    })
  },
  // //添加下一句切换方法（需在Page中补充）
  // nextSentence() {
  //   const newIndex = this.data.currentIndex + 1
  //   if (newIndex < this.data.sentences.length) {
  //     this.setData({
  //       currentIndex: newIndex,
  //       // 同步更新收藏状态
  //       isCollected: this.data.collected.has(
  //         this.data.sentences[newIndex].id
  //       )
  //     })
  //     // 触发界面更新
  //     this.updateProgress()
  //   } else {
  //     wx.showToast({ title: '已经是最后一句', icon: 'none' })
  //   }
  // }


})