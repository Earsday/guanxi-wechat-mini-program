// pages/setting/index/index.js
const i18n = require('../../../utils/i18n.js');
const storage = require('../../../services/storage.js');

Page({
  data: {
    currentLocale: '',
    localeOptions: [
      { value: 'zh-CN', label: '简体中文' },
      { value: 'zh-TW', label: '繁体中文' },
      { value: 'en-US', label: 'English' },
      { value: 'ja-JP', label: '日本語' }
    ],
    version: '1.0.0',
    t: {}
  },

  onLoad() {
    this.setI18nMessages();
    this.loadSettings();
  },

  onShow() {
    this.setI18nMessages();
  },

  setI18nMessages() {
    const locale = i18n.getLocale();
    if (this.data.currentLocale !== locale) {
      this.setData({
        t: i18n.getMessages(),
        currentLocale: locale
      });
    }
  },

  loadSettings() {
    const locale = i18n.getLocale();
    this.setData({
      currentLocale: locale
    });
  },

  // Language selection
  onLanguageChange(e) {
    const newLocale = this.data.localeOptions[e.detail.value].value;
    
    wx.showModal({
      title: this.data.t.settings?.changeLanguageTitle || '切换语言',
      content: this.data.t.settings?.changeLanguageConfirm || '切换语言后需要重新加载页面',
      success: (res) => {
        if (res.confirm) {
          // Save locale
          i18n.setLocale(newLocale);
          wx.setStorageSync('app_locale', newLocale);
          
          // Refresh messages
          this.setData({
            currentLocale: newLocale,
            t: i18n.getMessages()
          });

          wx.showToast({
            title: this.data.t.settings?.languageChanged || '语言已切换',
            icon: 'success',
            duration: 1500
          });

          // Refresh page after a short delay
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index'
            });
          }, 1500);
        }
      }
    });
  },

  // Export data
  async onExportData() {
    try {
      wx.showLoading({ title: this.data.t.settings?.exporting || '导出中...' });

      const exportData = await storage.exportData();
      const jsonStr = JSON.stringify(exportData, null, 2);

      // Save to temp file
      const fs = wx.getFileSystemManager();
      const fileName = `guanxi_backup_${Date.now()}.json`;
      const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;

      fs.writeFileSync(filePath, jsonStr, 'utf8');

      wx.hideLoading();

      wx.showModal({
        title: this.data.t.settings?.exportSuccess || '导出成功',
        content: this.data.t.settings?.exportSuccessMsg || `数据已导出到: ${fileName}`,
        showCancel: false
      });
    } catch (err) {
      console.error('Export failed:', err);
      wx.hideLoading();
      wx.showToast({
        title: this.data.t.settings?.exportFailed || '导出失败',
        icon: 'none'
      });
    }
  },

  // Import data
  onImportData() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: async (res) => {
        try {
          wx.showLoading({ title: this.data.t.settings?.importing || '导入中...' });

          const filePath = res.tempFiles[0].path;
          const fs = wx.getFileSystemManager();
          const content = fs.readFileSync(filePath, 'utf8');
          const importData = JSON.parse(content);

          await storage.importData(importData);

          wx.hideLoading();

          wx.showModal({
            title: this.data.t.settings?.importSuccess || '导入成功',
            content: this.data.t.settings?.importSuccessMsg || '数据已成功导入，页面将重新加载',
            showCancel: false,
            success: () => {
              wx.reLaunch({
                url: '/pages/index/index'
              });
            }
          });
        } catch (err) {
          console.error('Import failed:', err);
          wx.hideLoading();
          wx.showToast({
            title: this.data.t.settings?.importFailed || '导入失败',
            icon: 'none'
          });
        }
      }
    });
  },

  // Clear all data
  onClearData() {
    wx.showModal({
      title: this.data.t.settings?.clearDataTitle || '清空数据',
      content: this.data.t.settings?.clearDataWarning || '此操作将删除所有数据，且无法恢复。确定要继续吗？',
      confirmText: this.data.t.common?.confirm || '确认',
      confirmColor: '#ff4d4f',
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({ title: this.data.t.common?.deleting || '删除中...' });

            await storage.clearAllData();

            wx.hideLoading();

            wx.showToast({
              title: this.data.t.settings?.clearSuccess || '已清空',
              icon: 'success',
              duration: 1500
            });

            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/index/index'
              });
            }, 1500);
          } catch (err) {
            console.error('Clear data failed:', err);
            wx.hideLoading();
            wx.showToast({
              title: this.data.t.settings?.clearFailed || '清空失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // View statistics
  async onViewStats() {
    try {
      const stats = await storage.getStatistics();
      
      const msg = `
${this.data.t.settings?.totalCharacters || '人物总数'}: ${stats.characters || 0}
${this.data.t.settings?.totalRelationships || '关系总数'}: ${stats.relationships || 0}
${this.data.t.settings?.totalTypes || '关系类型'}: ${stats.types || 0}
${this.data.t.settings?.totalEvents || '事件总数'}: ${stats.events || 0}
${this.data.t.settings?.totalReminders || '提醒总数'}: ${stats.reminders || 0}
      `.trim();

      wx.showModal({
        title: this.data.t.settings?.statistics || '数据统计',
        content: msg,
        showCancel: false
      });
    } catch (err) {
      console.error('Get statistics failed:', err);
      wx.showToast({
        title: this.data.t.common?.loadFailed || '加载失败',
        icon: 'none'
      });
    }
  },

  // About
  onAbout() {
    const msg = `
${this.data.t.settings?.appName || '关系网小程序'}
${this.data.t.settings?.versionLabel || '版本'}: ${this.data.version}
${this.data.t.settings?.description || '让复杂的人际关系变得清晰'}
    `.trim();

    wx.showModal({
      title: this.data.t.settings?.about || '关于',
      content: msg,
      showCancel: false
    });
  }
});
