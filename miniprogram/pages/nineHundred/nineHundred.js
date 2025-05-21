// nineHundred.js
// 若在开发者工具中无法预览广告，请切换开发者工具中的基础库版本
// 在页面中定义插屏广告
let interstitialAd = null
Page({
  data: {
    currentIndex: 0, // 当前显示句子的索引
    totalSentences: 0, // 总句子数（用于进度显示）
    sentences: [], // 原始数据容器
    collected: new Set(), // 收藏状态集合（使用Set提升查询性能）
    currentSentence: {}, // 当前显示的句子对象
    jumpToIndex: '0', // 跳转输入框的值，默认为0
    showOnlyFavorites: false, // 是否只显示收藏的句子
    filteredSentences: [], // 过滤后的句子列表（用于仅看收藏功能）
    originalIndex: 0, // 在原始数组中的索引（用于仅看收藏模式）
    clickCount: 0, // 屏幕点击计数器，用于控制广告展示频率
    lastAdShowTime: 0 // 上次展示广告的时间戳，用于控制广告展示频率
  },

  // 生命周期函数--监听页面加载
  onLoad() {
    console.log('初始数据:', this.data.sentences.length, this.data.currentIndex)
    this.initData()
    this.loadCollections()
    this.loadLastPosition() // 加载上次的位置

    // 初始化视频插屏广告
    console.log('开始初始化插屏广告')
    if (wx.createInterstitialAd) {
      try {
        interstitialAd = wx.createInterstitialAd({
          adUnitId: 'adunit-6a0ba2f58015b1d0'
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

  // 页面显示时
  onShow() {
    this.checkIsCollected() // 新增

    // 如果广告实例不存在，尝试重新初始化
    if (!interstitialAd && wx.createInterstitialAd) {
      try {
        console.log('onShow中尝试初始化广告')
        interstitialAd = wx.createInterstitialAd({
          adUnitId: 'adunit-6a0ba2f58015b1d0'
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

  // 显示视频插屏广告
  showInterstitialAd() {
    // 检查是否需要展示广告 - 每20次点击展示一次
    if (this.data.clickCount % 20 !== 0 || this.data.clickCount === 0) {
      console.log('点击次数不满足展示条件:', this.data.clickCount)
      return
    }

    // 检查距离上次展示广告是否已经过了足够时间（至少30秒）
    const now = Date.now()
    if (now - this.data.lastAdShowTime < 30000) {
      console.log('广告展示间隔时间不足:', (now - this.data.lastAdShowTime) / 1000, '秒')
      return
    }

    console.log('尝试展示广告，点击次数:', this.data.clickCount)

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

  // 增加按钮点击计数并检查是否需要显示广告
  increaseClickCountAndCheckAd() {
    // 增加点击计数
    const newClickCount = this.data.clickCount + 1

    this.setData({
      clickCount: newClickCount
    })

    console.log('按钮点击计数:', newClickCount)

    // 检查是否需要显示广告
    this.showInterstitialAd()

    // 在控制台输出当前点击计数和上次广告展示时间
    console.log('当前点击计数:', newClickCount,
                '上次广告时间:', new Date(this.data.lastAdShowTime).toLocaleTimeString(),
                '时间差:', Date.now() - this.data.lastAdShowTime)
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 空函数，仅用于阻止事件冒泡
    return false
  },


  // 数据初始化方法
  initData() {
    try {
      const rawData = require('../../asset/aviationNineHundred')
      this.setData({
        sentences: rawData,
        totalSentences: rawData.length,
        filteredSentences: rawData, // 初始化过滤后的句子列表
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

  // 加载上次的位置
  loadLastPosition() {
    try {
      const lastPosition = wx.getStorageSync('lastPosition') || 0
      if (lastPosition > 0 && lastPosition < this.data.sentences.length) {
        this.setData({
          currentIndex: lastPosition,
          currentSentence: this.processSentence(this.data.sentences[lastPosition])
        })
        console.log('已加载上次位置:', lastPosition)
      }
    } catch (e) {
      console.error('加载上次位置失败:', e)
    }
  },

  // 保存当前位置
  saveCurrentPosition() {
    try {
      // 保存当前在原始数组中的位置
      const positionToSave = this.data.showOnlyFavorites ?
        this.data.originalIndex : this.data.currentIndex

      wx.setStorageSync('lastPosition', positionToSave)
      console.log('已保存当前位置:', positionToSave)
    } catch (e) {
      console.error('保存当前位置失败:', e)
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
    console.log(this.data.isCollected)

    const { currentIndex, showOnlyFavorites } = this.data
    // 根据当前模式选择使用的数据源
    const dataSource = showOnlyFavorites ? this.data.filteredSentences : this.data.sentences
    let newIndex = currentIndex

    console.log('总数据量:', dataSource.length, '当前索引:', currentIndex)

    if (type.currentTarget.dataset.type === "next") {
      newIndex = Math.min(currentIndex + 1, dataSource.length - 1)
    } else {
      newIndex = Math.max(currentIndex - 1, 0)
    }

    // 增加安全判断
    if (dataSource[newIndex]) {
      // 如果是收藏模式，记录在原始数组中的位置
      let originalIndex = newIndex
      if (showOnlyFavorites && dataSource[newIndex]) {
        originalIndex = this.data.sentences.findIndex(item => item.id === dataSource[newIndex].id)
      }

      this.setData({
        currentIndex: newIndex,
        currentSentence: this.processSentence(dataSource[newIndex]),
        originalIndex: originalIndex
      })

      // 保存当前位置
      this.saveCurrentPosition()

      // 增加点击计数并检查是否需要显示广告
      this.increaseClickCountAndCheckAd()
    } else {
      wx.showToast({
        title: '已到达边界',
        icon: 'none'
      })
    }

    this.checkIsCollected()
    console.log('安全索引:', newIndex, '当前数据:', this.data.currentIndex)
  },

  // 验证跳转输入
  validateJumpInput(e) {
    // 获取输入值
    let value = e.detail.value

    // 如果输入为空，设置为0
    if (value === '') {
      return {
        value: '0'
      }
    }

    // 确保输入是有效的正整数
    const numValue = parseInt(value)
    if (isNaN(numValue) || numValue < 0) {
      return {
        value: '0'
      }
    }

    return {
      value: numValue.toString()
    }
  },

  // 跳转到指定序号的句子
  handleJumpTo() {
    const { jumpToIndex, sentences, showOnlyFavorites } = this.data

    // 如果输入为空或0，默认跳转到第一句
    let targetId = 1

    if (jumpToIndex) {
      targetId = parseInt(jumpToIndex)

      // 再次验证，确保是有效数字
      if (isNaN(targetId) || targetId <= 0) {
        targetId = 1
      }
    }

    // 在原始数据中查找对应ID的句子
    const targetIndex = sentences.findIndex(item => item.id === targetId)

    if (targetIndex === -1) {
      wx.showToast({
        title: '未找到该序号',
        icon: 'none'
      })
      return
    }

    // 如果是仅看收藏模式，需要检查目标句子是否在收藏列表中
    if (showOnlyFavorites) {
      const isCollected = this.data.collected.has(targetId)

      if (!isCollected) {
        wx.showToast({
          title: '该句子未收藏',
          icon: 'none'
        })
        return
      }

      // 在过滤后的列表中查找位置
      const filteredIndex = this.data.filteredSentences.findIndex(item => item.id === targetId)

      if (filteredIndex !== -1) {
        this.setData({
          currentIndex: filteredIndex,
          currentSentence: this.processSentence(this.data.filteredSentences[filteredIndex]),
          originalIndex: targetIndex,
          jumpToIndex: '' // 清空输入框
        })
      }
    } else {
      // 普通模式直接跳转
      this.setData({
        currentIndex: targetIndex,
        currentSentence: this.processSentence(sentences[targetIndex]),
        jumpToIndex: '' // 清空输入框
      })
    }

    this.checkIsCollected()
    this.saveCurrentPosition()
  },

  // 切换仅看收藏模式
  toggleShowOnlyFavorites() {
    const { showOnlyFavorites, sentences, collected } = this.data

    if (!showOnlyFavorites) {
      // 切换到仅看收藏模式
      if (collected.size === 0) {
        wx.showToast({
          title: '暂无收藏内容',
          icon: 'none'
        })
        return
      }

      // 过滤出已收藏的句子
      const filteredSentences = sentences.filter(item => collected.has(item.id))

      // 找到当前句子在过滤后列表中的位置
      const currentId = sentences[this.data.currentIndex].id
      const newIndex = collected.has(currentId) ?
        filteredSentences.findIndex(item => item.id === currentId) : 0

      this.setData({
        showOnlyFavorites: true,
        filteredSentences: filteredSentences,
        currentIndex: newIndex >= 0 ? newIndex : 0,
        currentSentence: this.processSentence(filteredSentences[newIndex >= 0 ? newIndex : 0]),
        originalIndex: this.data.currentIndex // 保存原始位置
      })

      wx.showToast({
        title: '已切换到收藏模式',
        icon: 'none'
      })
    } else {
      // 切换回普通模式
      // 找到当前收藏句子在原始列表中的位置
      const currentId = this.data.filteredSentences[this.data.currentIndex].id
      const originalIndex = sentences.findIndex(item => item.id === currentId)

      this.setData({
        showOnlyFavorites: false,
        currentIndex: originalIndex >= 0 ? originalIndex : this.data.originalIndex,
        currentSentence: this.processSentence(sentences[originalIndex >= 0 ? originalIndex : this.data.originalIndex])
      })

      wx.showToast({
        title: '已切换到普通模式',
        icon: 'none'
      })
    }

    this.checkIsCollected()
  },
//检测句子是否被收藏并更新收藏状态
checkIsCollected(){
  // 同步最新存储数据（关键修正点）
  const storageCollected = new Set(wx.getStorageSync('collected') || [])
  // 获取当前句子的正确方式（防止数组越界）
  const { sentences, filteredSentences, currentIndex, showOnlyFavorites } = this.data

  // 根据当前模式选择正确的数据源
  const dataSource = showOnlyFavorites ? filteredSentences : sentences
  const currentId = dataSource[currentIndex]?.id || ''

  this.setData({
    isCollected: storageCollected.has(currentId),
    collected: storageCollected // 同步组件数据与存储
  })
},


  // 收藏/取消收藏
  toggleCollect() {
    const { showOnlyFavorites, sentences, filteredSentences, currentIndex } = this.data

    // 根据当前模式获取正确的句子ID
    const currentId = showOnlyFavorites ?
      filteredSentences[currentIndex].id :
      sentences[currentIndex].id

    const newCollected = new Set(this.data.collected)
    const wasCollected = newCollected.has(currentId)

    // 切换收藏状态
    if (wasCollected) {
      newCollected.delete(currentId)
    } else {
      newCollected.add(currentId)
    }

    // 如果是在仅看收藏模式下取消收藏
    if (showOnlyFavorites && wasCollected) {
      // 更新过滤后的列表
      const newFilteredSentences = filteredSentences.filter(item => item.id !== currentId)

      // 计算新的索引位置
      let newIndex = currentIndex
      if (newFilteredSentences.length === 0) {
        // 如果没有收藏项了，切换回普通模式
        this.setData({
          collected: newCollected,
          isCollected: false,
          showOnlyFavorites: false,
          currentIndex: this.data.originalIndex,
          currentSentence: this.processSentence(sentences[this.data.originalIndex])
        })

        wx.setStorageSync('collected', Array.from(newCollected))
        wx.showToast({
          title: '已取消收藏，返回普通模式',
          icon: 'none'
        })
        return
      } else if (newIndex >= newFilteredSentences.length) {
        // 如果当前索引超出了新列表长度，调整为最后一项
        newIndex = newFilteredSentences.length - 1
      }

      this.setData({
        collected: newCollected,
        isCollected: false,
        filteredSentences: newFilteredSentences,
        currentIndex: newIndex,
        currentSentence: this.processSentence(newFilteredSentences[newIndex])
      })
    } else {
      // 普通模式或在收藏模式下添加收藏
      this.setData({
        collected: newCollected,
        isCollected: !wasCollected
      })
    }

    // 保存收藏状态
    wx.setStorageSync('collected', Array.from(newCollected))
    wx.showToast({
      title: wasCollected ? '已取消' : '已收藏',
      icon: 'none'
    })

    // 保存当前位置
    this.saveCurrentPosition()
  },

  // 重置功能
  handleReset() {
    this.setData({
      currentIndex: 0,
      collected: new Set(),
      showOnlyFavorites: false, // 切换回普通模式
      filteredSentences: this.data.sentences, // 重置过滤列表
      currentSentence: this.processSentence(this.data.sentences[0]),
      jumpToIndex: '', // 清空跳转输入框
      isCollected: false
    })

    // 清除存储
    wx.removeStorageSync('collected')
    wx.removeStorageSync('lastPosition')

    wx.showToast({
      title: '已重置学习进度',
      icon: 'success'
    })
  },

  // 进度条点击事件
  handleProgressBarTap(e) {
    // 获取进度条元素信息
    const query = wx.createSelectorQuery()
    query.select('.progress-track').boundingClientRect()

    query.exec(res => {
      if (!res || !res[0]) return

      const progressBar = res[0]
      const progressBarLeft = progressBar.left
      const progressBarWidth = progressBar.width

      // 获取点击位置（tap事件中使用e.detail而不是e.touches）
      const touchX = e.detail.x || e.changedTouches[0].clientX

      // 计算点击位置相对于进度条的位置
      const offsetX = touchX - progressBarLeft

      // 确保位置在进度条范围内
      const clampedOffsetX = Math.max(0, Math.min(offsetX, progressBarWidth))

      // 计算对应的百分比
      const percentage = clampedOffsetX / progressBarWidth

      // 计算对应的句子索引
      const dataSource = this.data.showOnlyFavorites ?
        this.data.filteredSentences : this.data.sentences

      const newIndex = Math.floor(percentage * dataSource.length)

      // 更新当前句子
      this.jumpToSentenceByIndex(newIndex)

      // 保存当前位置
      this.saveCurrentPosition()
    })
  },

  // 进度条拖动开始事件
  handleProgressBarDragStart(e) {
    // 记录拖动开始时的触摸位置
    this.startX = e.touches[0].clientX
    this.isDragging = true
  },

  // 进度条拖动事件
  handleProgressBarDrag(e) {
    if (!this.isDragging) return

    // 获取进度条元素
    const query = wx.createSelectorQuery()
    query.select('.progress-track').boundingClientRect()

    query.exec(res => {
      if (!res || !res[0]) return

      const progressBar = res[0]
      const progressBarLeft = progressBar.left
      const progressBarWidth = progressBar.width

      // 计算当前触摸位置相对于进度条的位置
      const touchX = e.touches[0].clientX
      const offsetX = touchX - progressBarLeft

      // 确保位置在进度条范围内
      const clampedOffsetX = Math.max(0, Math.min(offsetX, progressBarWidth))

      // 计算对应的百分比
      const percentage = clampedOffsetX / progressBarWidth

      // 计算对应的句子索引
      const dataSource = this.data.showOnlyFavorites ?
        this.data.filteredSentences : this.data.sentences

      const newIndex = Math.floor(percentage * dataSource.length)

      // 如果索引变化，更新当前句子
      if (newIndex !== this.data.currentIndex) {
        this.jumpToSentenceByIndex(newIndex)
      }
    })
  },

  // 进度条拖动结束事件
  handleProgressBarDragEnd() {
    this.isDragging = false
    // 保存当前位置
    this.saveCurrentPosition()
  },

  // 跳转到指定索引的句子
  jumpToSentenceByIndex(index) {
    const dataSource = this.data.showOnlyFavorites ?
      this.data.filteredSentences : this.data.sentences

    // 确保索引在有效范围内
    const validIndex = Math.max(0, Math.min(index, dataSource.length - 1))

    // 如果是收藏模式，记录在原始数组中的位置
    let originalIndex = validIndex
    if (this.data.showOnlyFavorites && dataSource[validIndex]) {
      originalIndex = this.data.sentences.findIndex(item => item.id === dataSource[validIndex].id)
    }

    this.setData({
      currentIndex: validIndex,
      currentSentence: this.processSentence(dataSource[validIndex]),
      originalIndex: originalIndex
    })

    this.checkIsCollected()
  },
})