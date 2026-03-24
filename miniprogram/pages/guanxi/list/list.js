// pages/guanxi/list/list.js
const guanxiService = require('../../../services/guanxiService.js');
const characterService = require('../../../services/characterService.js');
const typeService = require('../../../services/typeService.js');
const i18n = require('../../../utils/i18n.js');
const { formatPersonName, formatDate } = require('../../../utils/formatters.js');

Page({
  data: {
    guanxiList: [],
    filteredList: [],
    characterMap: {},
    typeMap: {},
    filterType: 'all', // all, family, friend, colleague, classmate, neighbor
    sortBy: 'createdAt', // createdAt, updatedAt
    sortOrder: 'desc', // asc, desc
    showFilter: false,
    isLoading: false,
    t: {},
    currentLocale: ''
  },

  onLoad() {
    this.setI18nMessages();
    this.loadData();
  },

  onShow() {
    this.setI18nMessages();
    this.loadData();
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

  async loadData() {
    this.setData({ isLoading: true });

    try {
      wx.showLoading({ title: this.data.t.common?.loading || '加载中...' });

      // Load all data in parallel
      const [guanxiList, characters, types] = await Promise.all([
        guanxiService.getAllGuanxi(),
        characterService.getAllCharacters(),
        typeService.getAllTypes()
      ]);

      // Create character and type maps
      const characterMap = {};
      characters.forEach(char => {
        characterMap[char._id] = char;
      });

      const typeMap = {};
      types.forEach(type => {
        typeMap[type.id] = type;
      });

      // Enrich guanxi with character and type info
      const enrichedList = guanxiList.map(g => ({
        ...g,
        fromCharacter: characterMap[g.fromCharacterId],
        toCharacter: characterMap[g.toCharacterId],
        typeInfo: typeMap[g.typeId],
        formattedFromName: formatPersonName(characterMap[g.fromCharacterId], 'display', this.data.currentLocale),
        formattedToName: formatPersonName(characterMap[g.toCharacterId], 'display', this.data.currentLocale),
        formattedCreatedAt: formatDate(new Date(g.createdAt), 'short', this.data.currentLocale)
      }));

      this.setData({
        guanxiList: enrichedList,
        characterMap,
        typeMap,
        isLoading: false
      });

      this.applyFilters();
      wx.hideLoading();
    } catch (err) {
      console.error('Failed to load guanxi list:', err);
      this.setData({ isLoading: false });
      wx.hideLoading();
      wx.showToast({
        title: this.data.t.common?.loadFailed || '加载失败',
        icon: 'none'
      });
    }
  },

  // Apply filters and sorting
  applyFilters() {
    let filtered = [...this.data.guanxiList];

    // Filter by type
    if (this.data.filterType !== 'all') {
      filtered = filtered.filter(g => {
        const typeId = g.typeId || '';
        return typeId.startsWith(this.data.filterType);
      });
    }

    // Sort
    filtered.sort((a, b) => {
      const field = this.data.sortBy;
      const order = this.data.sortOrder;
      
      let valueA = a[field];
      let valueB = b[field];

      // Convert to comparable values
      if (field === 'createdAt' || field === 'updatedAt') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      if (order === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    this.setData({
      filteredList: filtered
    });
  },

  // Toggle filter panel
  toggleFilter() {
    this.setData({
      showFilter: !this.data.showFilter
    });
  },

  // Change filter type
  onFilterTypeChange(e) {
    this.setData({
      filterType: e.detail.value
    });
    this.applyFilters();
  },

  // Change sort field
  onSortByChange(e) {
    this.setData({
      sortBy: e.detail.value
    });
    this.applyFilters();
  },

  // Change sort order
  onSortOrderChange(e) {
    this.setData({
      sortOrder: e.detail.value
    });
    this.applyFilters();
  },

  // Navigate to guanxi detail
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/guanxi/detail/detail?id=${id}`
    });
  },

  // Navigate to character detail
  goToCharacterDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/characters/detail/detail?id=${id}`
    });
  },

  // Navigate to create guanxi
  goToCreate() {
    wx.navigateTo({
      url: '/pages/guanxi/create/create'
    });
  },

  // Refresh list
  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
