// pages/characters/list/list.js
const characterService = require('../../../services/characterService.js');
const i18n = require('../../../utils/i18n.js');
const formatters = require('../../../utils/formatters.js');

Page({
  data: {
    characters: [],
    searchKeyword: '',
    t: {},
    currentLocale: '',
    loading: false,
    
    // Sorting
    sortBy: 'name', // 'name', 'age', 'createTime', 'updateTime'
    sortOrder: 'asc', // 'asc', 'desc'
    showSortMenu: false,
    sortOptions: [],
    
    // Alphabet index
    alphabetIndexList: [],
    groupedCharacters: {},
    showAlphabetIndex: true,
    
    // Filter
    showFilterMenu: false,
    selectedGender: 'all', // 'all', 'male', 'female'
    selectedGroup: 'all',
    groups: []
  },

  setI18nMessages() {
    const locale = i18n.getLocale();
    if (this.data.currentLocale !== locale) {
      const t = i18n.getMessages();
      
      // Build sort options with i18n
      const sortOptions = [
        { value: 'name', label: t.pages?.characterList?.sort?.name || '按姓名' },
        { value: 'age', label: t.pages?.characterList?.sort?.age || '按年龄' },
        { value: 'createTime', label: t.pages?.characterList?.sort?.createTime || '按创建时间' },
        { value: 'updateTime', label: t.pages?.characterList?.sort?.updateTime || '按更新时间' }
      ];
      
      this.setData({
        t,
        currentLocale: locale,
        sortOptions
      });
    }
  },

  onLoad: function () {
    console.log('Character list page loaded');
    this.setI18nMessages();
    this.loadCharacters();
  },

  onShow: function () {
    // Refresh list when returning from detail page and check for locale changes
    this.setI18nMessages();
    this.loadCharacters();
  },

  onPullDownRefresh: function () {
    this.loadCharacters().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadCharacters() {
    try {
      this.setData({ loading: true });
      wx.showLoading({ title: this.data.t.common?.loading || '加载中...' });

      let characters = await characterService.getAllCharacters();
      
      // Apply filters
      characters = this.applyFilters(characters);
      
      // Apply sorting
      characters = this.sortCharacters(characters);
      
      // Extract unique groups for filter
      const groupsSet = new Set();
      characters.forEach(char => {
        if (char.group) groupsSet.add(char.group);
      });
      const groups = Array.from(groupsSet).map(g => ({ value: g, label: g }));

      // Group by first letter for alphabet index
      const { groupedCharacters, alphabetIndexList } = this.groupCharactersByLetter(characters);

      this.setData({
        characters,
        groupedCharacters,
        alphabetIndexList,
        groups,
        loading: false
      });

      wx.hideLoading();
    } catch (err) {
      console.error('Failed to load characters:', err);
      this.setData({ loading: false });
      wx.hideLoading();
      wx.showToast({
        title: this.data.t.common?.loadFailed || '加载失败',
        icon: 'none'
      });
    }
  },

  applyFilters(characters) {
    let filtered = [...characters];
    
    // Gender filter
    if (this.data.selectedGender !== 'all') {
      filtered = filtered.filter(char => char.gender === this.data.selectedGender);
    }
    
    // Group filter
    if (this.data.selectedGroup !== 'all') {
      filtered = filtered.filter(char => char.group === this.data.selectedGroup);
    }
    
    // Search keyword
    if (this.data.searchKeyword) {
      const keyword = this.data.searchKeyword.toLowerCase();
      filtered = filtered.filter(char => {
        const name = (char.name || '').toLowerCase();
        const alias = (char.alias || '').toLowerCase();
        const pinyin = this.getPinyin(char.name).toLowerCase();
        return name.includes(keyword) || alias.includes(keyword) || pinyin.includes(keyword);
      });
    }
    
    return filtered;
  },

  sortCharacters(characters) {
    const { sortBy, sortOrder } = this.data;
    const sorted = [...characters];
    
    sorted.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name || '';
          bVal = b.name || '';
          break;
        case 'age':
          aVal = a.age || 0;
          bVal = b.age || 0;
          break;
        case 'createTime':
          aVal = new Date(a.createTime || 0).getTime();
          bVal = new Date(b.createTime || 0).getTime();
          break;
        case 'updateTime':
          aVal = new Date(a.updateTime || 0).getTime();
          bVal = new Date(b.updateTime || 0).getTime();
          break;
        default:
          return 0;
      }
      
      if (typeof aVal === 'string') {
        const result = aVal.localeCompare(bVal, 'zh-CN');
        return sortOrder === 'asc' ? result : -result;
      } else {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
    });
    
    return sorted;
  },

  groupCharactersByLetter(characters) {
    const grouped = {};
    const indexSet = new Set();
    
    characters.forEach(char => {
      const firstLetter = this.getFirstLetter(char.name);
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(char);
      indexSet.add(firstLetter);
    });
    
    // Sort index list
    const alphabetIndexList = Array.from(indexSet).sort((a, b) => {
      // Numbers and special characters first, then letters
      if (a === '#') return -1;
      if (b === '#') return 1;
      return a.localeCompare(b);
    });
    
    return { groupedCharacters: grouped, alphabetIndexList };
  },

  getFirstLetter(name) {
    if (!name) return '#';
    
    const firstChar = name.charAt(0);
    const pinyin = this.getPinyin(name);
    const firstPinyinChar = pinyin.charAt(0).toUpperCase();
    
    // Check if it's a letter A-Z
    if (/^[A-Z]$/i.test(firstPinyinChar)) {
      return firstPinyinChar;
    }
    
    return '#';
  },

  getPinyin(name) {
    // Simple pinyin conversion (for demo purposes)
    // In production, use a proper pinyin library
    const pinyinMap = {
      '阿': 'A', '啊': 'A', '艾': 'A', '安': 'A',
      '白': 'B', '包': 'B', '北': 'B', '本': 'B',
      '曹': 'C', '陈': 'C', '程': 'C', '崔': 'C',
      '戴': 'D', '邓': 'D', '丁': 'D', '董': 'D', '杜': 'D',
      '范': 'F', '方': 'F', '费': 'F', '冯': 'F', '傅': 'F',
      '高': 'G', '葛': 'G', '龚': 'G', '顾': 'G', '郭': 'G',
      '韩': 'H', '何': 'H', '贺': 'H', '侯': 'H', '胡': 'H', '黄': 'H',
      '姬': 'J', '贾': 'J', '江': 'J', '蒋': 'J', '金': 'J',
      '孔': 'K', '康': 'K',
      '赖': 'L', '郎': 'L', '雷': 'L', '黎': 'L', '李': 'L', '梁': 'L', '廖': 'L', '林': 'L', '刘': 'L', '龙': 'L', '卢': 'L', '陆': 'L', '路': 'L', '吕': 'L', '罗': 'L',
      '马': 'M', '毛': 'M', '梅': 'M', '孟': 'M', '米': 'M', '苗': 'M', '缪': 'M', '莫': 'M',
      '倪': 'N', '聂': 'N', '宁': 'N',
      '欧': 'O',
      '潘': 'P', '彭': 'P', '皮': 'P',
      '齐': 'Q', '钱': 'Q', '秦': 'Q', '邱': 'Q', '曲': 'Q',
      '任': 'R', '阮': 'R',
      '沙': 'S', '邵': 'S', '沈': 'S', '盛': 'S', '施': 'S', '石': 'S', '史': 'S', '宋': 'S', '苏': 'S', '孙': 'S',
      '谭': 'T', '汤': 'T', '唐': 'T', '陶': 'T', '田': 'T', '童': 'T', '涂': 'T',
      '万': 'W', '汪': 'W', '王': 'W', '韦': 'W', '魏': 'W', '温': 'W', '文': 'W', '翁': 'W', '吴': 'W', '伍': 'W', '武': 'W',
      '夏': 'X', '向': 'X', '肖': 'X', '谢': 'X', '熊': 'X', '徐': 'X', '许': 'X', '薛': 'X',
      '严': 'Y', '颜': 'Y', '杨': 'Y', '叶': 'Y', '易': 'Y', '殷': 'Y', '尹': 'Y', '尤': 'Y', '于': 'Y', '余': 'Y', '俞': 'Y', '袁': 'Y', '岳': 'Y', '云': 'Y',
      '曾': 'Z', '翟': 'Z', '詹': 'Z', '张': 'Z', '章': 'Z', '赵': 'Z', '郑': 'Z', '钟': 'Z', '周': 'Z', '朱': 'Z', '邹': 'Z', '祝': 'Z', '卓': 'Z'
    };
    
    if (!name) return '';
    const firstChar = name.charAt(0);
    return pinyinMap[firstChar] || firstChar;
  },

  // Search input handler
  onSearchInput: function (e) {
    this.setData({
      searchKeyword: e.detail.value
    });
    this.loadCharacters();
  },

  onClearSearch() {
    this.setData({
      searchKeyword: ''
    });
    this.loadCharacters();
  },

  // Sort menu
  toggleSortMenu() {
    this.setData({
      showSortMenu: !this.data.showSortMenu,
      showFilterMenu: false
    });
  },

  onSortChange(e) {
    const sortBy = e.currentTarget.dataset.value;
    const sortOrder = this.data.sortBy === sortBy && this.data.sortOrder === 'asc' ? 'desc' : 'asc';
    
    this.setData({
      sortBy,
      sortOrder,
      showSortMenu: false
    });
    
    this.loadCharacters();
  },

  // Filter menu
  toggleFilterMenu() {
    this.setData({
      showFilterMenu: !this.data.showFilterMenu,
      showSortMenu: false
    });
  },

  onGenderFilterChange(e) {
    this.setData({
      selectedGender: e.currentTarget.dataset.value
    });
    this.loadCharacters();
  },

  onGroupFilterChange(e) {
    this.setData({
      selectedGroup: e.detail.value
    });
    this.loadCharacters();
  },

  onResetFilter() {
    this.setData({
      selectedGender: 'all',
      selectedGroup: 'all',
      showFilterMenu: false
    });
    this.loadCharacters();
  },

  // Alphabet index
  onAlphabetSelect(e) {
    const { index } = e.detail;
    // Scroll to the section with this letter
    // WeChat mini program doesn't support scrollIntoView by id easily
    // So we'll use a workaround with scroll-into-view
    this.setData({
      scrollToLetter: index
    });
    
    // Reset after a short delay
    setTimeout(() => {
      this.setData({
        scrollToLetter: ''
      });
    }, 100);
  },

  // Navigate to character detail
  goToDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/characters/detail/detail?id=${id}`
    });
  },

  // Navigate to edit character
  goToEdit: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/characters/edit/edit?id=${id}`
    });
  },

  // Navigate to create character
  goToCreate: function () {
    wx.navigateTo({
      url: '/pages/characters/edit/edit'
    });
  }
});
