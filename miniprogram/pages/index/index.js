// pages/index/index.js
const typeService = require('../../services/typeService.js');

Page({
  data: {
    types: [],
    stats: {
      characterCount: 0,
      guanxiCount: 0,
      typeCount: 0
    }
  },

  onLoad: function () {
    console.log('Index page loaded');
    this.loadData();
  },

  onShow: function () {
    // Refresh data when page is shown
    this.loadData();
  },

  async loadData() {
    try {
      wx.showLoading({ title: '加载中...' });

      // Load relationship types
      const types = await typeService.getAllTypes();

      // Load statistics
      const storage = require('../../services/storage.js');
      const characters = await storage.getAll(storage.STORAGE_KEYS.CHARACTERS);
      const guanxi = await storage.getAll(storage.STORAGE_KEYS.GUANXI);

      this.setData({
        types: types.slice(0, 5), // Show top 5 types
        stats: {
          characterCount: characters.length,
          guanxiCount: guanxi.length,
          typeCount: types.length
        }
      });

      wx.hideLoading();
    } catch (err) {
      console.error('Failed to load data:', err);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // Navigate to character list
  goToCharacterList: function () {
    wx.navigateTo({
      url: '/pages/characters/list/list'
    });
  },

  // Navigate to create relationship
  goToCreateGuanxi: function () {
    wx.navigateTo({
      url: '/pages/guanxi/create/create'
    });
  }
});
