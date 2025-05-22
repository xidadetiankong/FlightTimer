// pages/records/records.js
Page({
  data: {
    records: [],
    startDate: '',
    endDate: '',
    filteredRecords: [],
    hasRecords: false,
    maxDateRange: 90, // 最大日期范围为90天
    showSummary: false, // 是否显示汇总数据
    totalSegments: 0,
    totalFlightTime: '00:00',
    totalDutyTime: '00:00',
    averageSegments: '0.0',
    recent144HoursDuty: '00:00'
  },

  onLoad: function (options) {
    this.loadRecords();
  },
  
  onShow: function() {
    this.loadRecords();
  },
  
  loadRecords: function() {
    // 从本地存储获取记录
    let records = wx.getStorageSync('dutyRecords') || [];
    
    // 按日期降序排序
    records.sort((a, b) => b.timestamp - a.timestamp);
    
    this.setData({
      records: records,
      hasRecords: records.length > 0
    });
    
    // 设置默认的日期范围为最近90天
    const today = new Date();
    const endDate = this.formatDate(today);
    
    // 计算90天前的日期
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(today.getDate() - 90);
    const startDate = this.formatDate(ninetyDaysAgo);
    
    this.setData({
      startDate: startDate,
      endDate: endDate
    });
    
    // 根据默认日期范围过滤记录
    this.filterRecords();
  },
  
  // 日期格式化为YYYY/MM/DD
  formatDate: function(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}/${month}/${day}`;
  },
  
  // 计算两个日期之间的天数差
  daysBetween: function(startDate, endDate) {
    const start = new Date(startDate.replace(/\//g, '-'));
    const end = new Date(endDate.replace(/\//g, '-'));
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },
  
  selectStartDate: function(e) {
    const newStartDate = e.detail.value;
    const currentEndDate = this.data.endDate;
    
    // 检查日期区间是否超过90天
    if (currentEndDate && this.daysBetween(newStartDate, currentEndDate) > this.data.maxDateRange) {
      wx.showToast({
        title: `日期区间不能超过${this.data.maxDateRange}天`,
        icon: 'none'
      });
      return;
    }
    
    this.setData({
      startDate: newStartDate
    });
    this.filterRecords();
  },
  
  selectEndDate: function(e) {
    const currentStartDate = this.data.startDate;
    const newEndDate = e.detail.value;
    
    // 检查日期区间是否超过90天
    if (currentStartDate && this.daysBetween(currentStartDate, newEndDate) > this.data.maxDateRange) {
      wx.showToast({
        title: `日期区间不能超过${this.data.maxDateRange}天`,
        icon: 'none'
      });
      return;
    }
    
    this.setData({
      endDate: newEndDate
    });
    this.filterRecords();
  },
  
  filterRecords: function() {
    const { records, startDate, endDate } = this.data;
    
    if (!startDate || !endDate) {
      this.setData({
        filteredRecords: records
      });
      return;
    }
    
    // 日期格式转换为时间戳进行比较
    const startTimestamp = new Date(startDate.replace(/\//g, '-')).getTime();
    const endTimestamp = new Date(endDate.replace(/\//g, '-') + ' 23:59:59').getTime(); // 设置为当天结束时间
    
    // 过滤记录
    const filteredRecords = records.filter(record => {
      const recordDate = new Date(record.date.replace(/\//g, '-')).getTime();
      return recordDate >= startTimestamp && recordDate <= endTimestamp;
    });
    
    this.setData({
      filteredRecords: filteredRecords
    });
    
    // 计算汇总数据
    this.calculateSummary(filteredRecords);
  },
  
  // 计算汇总数据
  calculateSummary: function(records) {
    if (!records || records.length === 0) {
      this.setData({
        totalSegments: 0,
        totalFlightTime: '00:00',
        totalDutyTime: '00:00',
        recent144HoursDuty: '00:00'
      });
      return;
    }
    
    // 计算总段数
    const totalSegments = records.reduce((sum, record) => {
      return sum + (parseInt(record.segments) || 0);
    }, 0);
    
    // 计算总飞行时间和总值勤时间
    let totalFlightMinutes = 0;
    let totalDutyMinutes = 0;
    
    // 计算近144小时的值勤时间
    const now = new Date().getTime();
    const hours144 = 144 * 60 * 60 * 1000; // 144小时的毫秒数
    const timeThreshold = now - hours144;
    
    let recent144HoursDutyMinutes = 0;
    
    records.forEach(record => {
      // 处理飞行时间格式 "HH:MM"
      if (record.flightTime) {
        const [hours, minutes] = record.flightTime.split(':').map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
          totalFlightMinutes += hours * 60 + (minutes || 0);
        }
      }
      
      // 处理值勤时间格式 "HH:MM"
      if (record.dutyTime) {
        const [hours, minutes] = record.dutyTime.split(':').map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
          const dutyMinutes = hours * 60 + (minutes || 0);
          totalDutyMinutes += dutyMinutes;
          
          // 判断是否在近144小时内
          const recordTimestamp = record.timestamp || 0;
          if (recordTimestamp >= timeThreshold) {
            recent144HoursDutyMinutes += dutyMinutes;
          }
        }
      }
      
      // 确保每条记录都有flightNumber属性
      if (!record.flightNumber) {
        record.flightNumber = '';
      }
    });
    
    // 转换回HH:MM格式
    const totalFlightHours = Math.floor(totalFlightMinutes / 60);
    const totalFlightMins = totalFlightMinutes % 60;
    const totalFlightTime = `${String(totalFlightHours).padStart(2, '0')}:${String(totalFlightMins).padStart(2, '0')}`;
    
    const totalDutyHours = Math.floor(totalDutyMinutes / 60);
    const totalDutyMins = totalDutyMinutes % 60;
    const totalDutyTime = `${String(totalDutyHours).padStart(2, '0')}:${String(totalDutyMins).padStart(2, '0')}`;
    
    const recent144Hours = Math.floor(recent144HoursDutyMinutes / 60);
    const recent144Mins = recent144HoursDutyMinutes % 60;
    const recent144HoursDuty = `${String(recent144Hours).padStart(2, '0')}:${String(recent144Mins).padStart(2, '0')}`;
    
    this.setData({
      totalSegments,
      totalFlightTime,
      totalDutyTime,
      recent144HoursDuty
    });
  },
  
  // 切换汇总数据显示状态
  toggleSummary: function() {
    this.setData({
      showSummary: !this.data.showSummary
    });
  },
  
  exportToExcel: function() {
    // 获取当前筛选后的记录
    const { filteredRecords, startDate, endDate, totalSegments, totalFlightTime, totalDutyTime, recent144HoursDuty } = this.data;
    
    if (filteredRecords.length === 0) {
      wx.showToast({
        title: '没有可导出的记录',
        icon: 'none'
      });
      return;
    }
    
    // 生成纯文本格式的内容
    let textContent = `飞行员值勤记录 (${startDate} 至 ${endDate})\n\n`;
    textContent += `日期\t段数\t飞行时间\t值勤时间\t航班号\t备注\n`;
    
    // 添加记录数据
    filteredRecords.forEach(record => {
      textContent += `${record.date}\t${record.segments}\t${record.flightTime}\t${record.dutyTime}\t${record.flightNumber || '-'}\t${record.remarks || '-'}\n`;
    });
    
    // 添加统计数据
    textContent += `\n汇总统计：\n`;
    textContent += `总段数: ${totalSegments}\n`;
    textContent += `总飞行时间: ${totalFlightTime}\n`;
    textContent += `总值勤时间: ${totalDutyTime}\n`;
    textContent += `近144小时值勤时间: ${recent144HoursDuty}\n`;
    
    // 生成文件名
    const fileName = `飞行记录_${startDate.replace(/\//g, '')}_${endDate.replace(/\//g, '')}.txt`;
    
    // 使用微信的文件系统API保存文件
    const fs = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
    
    try {
      // 写入文件
      fs.writeFileSync(filePath, textContent, 'utf8');
      
      // 先检查是否支持wx.shareFileMessage API
      if (wx.canIUse('shareFileMessage')) {
        // 弹出提示框，让用户选择打开方式
        wx.showActionSheet({
          itemList: ['在微信中预览', '使用其他应用打开'],
          success: (res) => {
            if (res.tapIndex === 0) {
              // 在微信中预览
              wx.openDocument({
                filePath: filePath,
                fileType: 'txt',
                success: function(res) {
                  console.log('打开文档成功');
                },
                fail: function(res) {
                  console.error('打开文档失败', res);
                  wx.showToast({
                    title: '预览失败',
                    icon: 'none'
                  });
                }
              });
            } else if (res.tapIndex === 1) {
              // 使用其他应用打开
              wx.shareFileMessage({
                filePath: filePath,
                success: function(res) {
                  console.log('文件分享成功');
                },
                fail: function(res) {
                  console.error('文件分享失败', res);
                  wx.showModal({
                    title: '提示',
                    content: '文件分享失败，请稍后重试',
                    showCancel: false
                  });
                }
              });
            }
          },
          fail: function(res) {
            // 如果操作失败，默认打开预览
            wx.openDocument({
              filePath: filePath,
              fileType: 'txt',
              success: function(res) {
                console.log('打开文档成功');
              },
              fail: function(res) {
                console.error('打开文档失败', res);
                wx.showModal({
                  title: '提示',
                  content: '小程序环境无法直接输出Excel文件，但数据已保存在本地。您可以通过其他APP导出功能将数据导出。',
                  confirmText: '确定',
                  confirmColor: '#3a7cff',
                  showCancel: false
                });
              }
            });
          }
        });
      } else {
        // 如果不支持分享API，直接预览
        wx.openDocument({
          filePath: filePath,
          fileType: 'txt',
          success: function(res) {
            console.log('打开文档成功');
            // 提示用户可以通过系统分享功能分享文件
            wx.showModal({
              title: '提示',
              content: '文件已打开。如需使用其他应用打开，请在预览界面点击右上角分享按钮。',
              confirmText: '知道了',
              confirmColor: '#3a7cff',
              showCancel: false
            });
          },
          fail: function(res) {
            console.error('打开文档失败', res);
            wx.showModal({
              title: '提示',
              content: '小程序环境无法直接输出Excel文件，但数据已保存在本地。您可以通过其他APP导出功能将数据导出。',
              confirmText: '确定',
              confirmColor: '#3a7cff',
              showCancel: false
            });
          }
        });
      }
    } catch (error) {
      console.error('文件写入失败', error);
      wx.showModal({
        title: '导出失败',
        content: '文件写入失败，请稍后重试',
        showCancel: false
      });
    }
  },
  
  deleteRecord: function(e) {
    const index = e.currentTarget.dataset.index;
    const recordIndex = this.data.records.findIndex(
      r => r.timestamp === this.data.filteredRecords[index].timestamp
    );
    
    wx.showModal({
      title: '删除确认',
      content: '确定要删除这条记录吗？',
      success: res => {
        if (res.confirm) {
          // 删除记录
          let records = this.data.records;
          records.splice(recordIndex, 1);
          
          // 更新本地存储
          wx.setStorageSync('dutyRecords', records);
          
          // 更新页面显示
          this.loadRecords();
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  }
}) 