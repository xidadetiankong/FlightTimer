// nineHundred.js
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
    originalIndex: 0 // 在原始数组中的索引（用于仅看收藏模式）
  },

  // 生命周期函数--监听页面加载
  onLoad() {
    console.log('初始数据:', this.data.sentences.length, this.data.currentIndex)
    this.initData()
    this.loadCollections()
    this.loadLastPosition() // 加载上次的位置
  },

  // 页面显示时
  onShow() {
    this.checkIsCollected() // 新增
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