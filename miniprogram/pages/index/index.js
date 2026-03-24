// pages/index/index.js
const typeService = require('../../services/typeService.js');
const i18n = require('../../utils/i18n.js');
const formatters = require('../../utils/formatters.js');

Page({
  data: {
    types: [],
    stats: {
      characterCount: 0,
      guanxiCount: 0,
      typeCount: 0
    },
    t: {},
    currentLocale: '',
    loading: false
  },

  onLoad: function () {
    console.log('Index page loaded');
    this.setI18nMessages();
    this.loadData();
  },

  onShow: function () {
    // Refresh data and check for locale changes
    this.setI18nMessages();
    this.loadData();
  },

  onPullDownRefresh: function () {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  setI18nMessages() {
    const locale = i18n.getLocale();
    if (this.data.currentLocale !== locale) {
      this.setData({
        t: i18n.getMessages(),
        currentLocale: locale
      });
      
      // Set navigation bar title dynamically for i18n support
      wx.setNavigationBarTitle({
        title: i18n.t('pages.index.title') || '人际关系图谱'
      });
    }
  },

  async loadData() {
    try {
      this.setData({ loading: true });

      // Load relationship types
      const types = await typeService.getAllTypes();

      // Load statistics
      const storage = require('../../services/storage.js');
      const characters = await storage.getAll(storage.STORAGE_KEYS.CHARACTERS);
      const guanxi = await storage.getAll(storage.STORAGE_KEYS.GUANXI);

      // Format types with localized names and add icons
      const categoryIcons = {
        family_relative: '👨‍👩‍👧‍👦',
        social_friend: '👥',
        work_colleague: '💼',
        education_classmate: '🎓',
        location_neighbor: '🏘️'
      };

      const formattedTypes = types.slice(0, 5).map(type => ({
        ...type,
        displayName: i18n.t(`guanxiType.${type.id}.name`) || type.name,
        icon: categoryIcons[type.category] || '📌',
        category: i18n.t(`guanxi.categories.${type.category}`) || type.category
      }));

      this.setData({
        types: formattedTypes,
        stats: {
          characterCount: characters.length,
          guanxiCount: guanxi.length,
          typeCount: types.length
        },
        loading: false
      });
    } catch (err) {
      console.error('Failed to load data:', err);
      this.setData({ loading: false });
      wx.showToast({
        title: this.data.t.messages?.loadFailed || '加载失败',
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

  // Navigate to character edit (add new character)
  goToCharacterEdit: function () {
    wx.navigateTo({
      url: '/pages/characters/edit/edit'
    });
  },

  // Navigate to create relationship
  goToCreateGuanxi: function () {
    wx.navigateTo({
      url: '/pages/guanxi/create/create'
    });
  },

  // Navigate to guanxi list
  goToGuanxiList: function () {
    wx.navigateTo({
      url: '/pages/guanxi/list/list'
    });
  },

  // Navigate to graph
  goToGraph: function () {
    wx.switchTab({
      url: '/pages/graph/index/index'
    });
  },

  // Navigate to search
  goToSearch: function () {
    wx.navigateTo({
      url: '/pages/characters/search/search'
    });
  },

  // Navigate to type list (placeholder)
  goToTypeList: function () {
    wx.showToast({
      title: this.data.t.messages?.comingSoon || '功能开发中',
      icon: 'none'
    });
  }
});
