// pages/characters/list/list.js
const characterService = require('../../../services/characterService.js');

Page({
  data: {
    characters: [],
    searchKeyword: ''
  },

  onLoad: function () {
    console.log('Character list page loaded');
    this.loadCharacters();
  },

  onShow: function () {
    // Refresh list when returning from detail page
    this.loadCharacters();
  },

  async loadCharacters() {
    try {
      wx.showLoading({ title: '加载中...' });

      const characters = await characterService.getAllCharacters();

      this.setData({
        characters: characters
      });

      wx.hideLoading();
    } catch (err) {
      console.error('Failed to load characters:', err);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // Search input handler
  onSearchInput: function (e) {
    this.setData({
      searchKeyword: e.detail.value
    });
    this.performSearch();
  },

  // Perform search
  async performSearch() {
    try {
      const characters = await characterService.searchCharacters(this.data.searchKeyword);
      this.setData({
        characters: characters
      });
    } catch (err) {
      console.error('Search failed:', err);
    }
  },

  // Navigate to character detail
  goToDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/characters/detail/detail?id=${id}`
    });
  },

  // Navigate to create character
  goToCreate: function () {
    wx.showToast({
      title: '添加人物功能待实现',
      icon: 'none'
    });
    // TODO: Navigate to create character page
  }
});
