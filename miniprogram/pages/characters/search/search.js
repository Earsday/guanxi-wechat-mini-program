// pages/characters/search/search.js
const characterService = require('../../../services/characterService.js');
const i18n = require('../../../utils/i18n.js');
const { formatPersonName } = require('../../../utils/formatters.js');

Page({
  data: {
    searchKeyword: '',
    searchResults: [],
    recentSearches: [],
    isSearching: false,
    hasSearched: false,
    t: {},
    currentLocale: ''
  },

  onLoad() {
    this.setI18nMessages();
    this.loadRecentSearches();
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

  // Load recent searches from storage
  loadRecentSearches() {
    try {
      const recentSearches = wx.getStorageSync('recent_searches') || [];
      this.setData({
        recentSearches: recentSearches.slice(0, 10) // Keep only 10 recent searches
      });
    } catch (err) {
      console.error('Failed to load recent searches:', err);
    }
  },

  // Save search keyword to recent searches
  saveRecentSearch(keyword) {
    if (!keyword || keyword.trim().length === 0) return;
    
    try {
      let recentSearches = wx.getStorageSync('recent_searches') || [];
      
      // Remove duplicate if exists
      recentSearches = recentSearches.filter(item => item !== keyword);
      
      // Add to beginning
      recentSearches.unshift(keyword);
      
      // Keep only 10 recent searches
      recentSearches = recentSearches.slice(0, 10);
      
      wx.setStorageSync('recent_searches', recentSearches);
      
      this.setData({
        recentSearches
      });
    } catch (err) {
      console.error('Failed to save recent search:', err);
    }
  },

  // Clear recent searches
  clearRecentSearches() {
    wx.showModal({
      title: this.data.t.common?.confirm || '确认',
      content: this.data.t.search?.clearRecentConfirm || '确定要清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync('recent_searches');
            this.setData({
              recentSearches: []
            });
            wx.showToast({
              title: this.data.t.common?.success || '成功',
              icon: 'success'
            });
          } catch (err) {
            console.error('Failed to clear recent searches:', err);
          }
        }
      }
    });
  },

  // Search input handler
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({
      searchKeyword: keyword
    });
    
    // Auto search when user types
    if (keyword.trim().length > 0) {
      this.performSearch(keyword);
    } else {
      this.setData({
        searchResults: [],
        hasSearched: false
      });
    }
  },

  // Clear search input
  onSearchClear() {
    this.setData({
      searchKeyword: '',
      searchResults: [],
      hasSearched: false
    });
  },

  // Perform search
  async performSearch(keyword) {
    if (!keyword || keyword.trim().length === 0) return;

    this.setData({
      isSearching: true,
      hasSearched: true
    });

    try {
      const results = await characterService.searchCharacters(keyword);
      
      // Format names for display
      const formattedResults = results.map(char => ({
        ...char,
        formattedName: formatPersonName(char, 'display', this.data.currentLocale)
      }));

      this.setData({
        searchResults: formattedResults,
        isSearching: false
      });

      // Save to recent searches
      this.saveRecentSearch(keyword.trim());
    } catch (err) {
      console.error('Search failed:', err);
      this.setData({
        isSearching: false
      });
      wx.showToast({
        title: this.data.t.common?.error || '搜索失败',
        icon: 'none'
      });
    }
  },

  // Search button click
  onSearchTap() {
    if (this.data.searchKeyword.trim().length > 0) {
      this.performSearch(this.data.searchKeyword);
    }
  },

  // Recent search item click
  onRecentSearchTap(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({
      searchKeyword: keyword
    });
    this.performSearch(keyword);
  },

  // Navigate to character detail
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/characters/detail/detail?id=${id}`
    });
  },

  // Navigate to character edit
  goToEdit(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/characters/edit/edit?id=${id}`
    });
  }
});
