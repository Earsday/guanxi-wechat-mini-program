// components/type-selector/type-selector.js
const typeService = require('../../services/typeService');
const i18n = require('../../utils/i18n');

/**
 * Type Selector Component
 * Displays relationship types organized by category with search and selection
 */
Component({
  /**
   * Component properties
   */
  properties: {
    // Selected type ID
    selectedTypeId: {
      type: String,
      value: ''
    },
    
    // Filter by category (optional)
    category: {
      type: String,
      value: '' // empty = all categories
    },
    
    // Display mode: 'list' or 'grid'
    mode: {
      type: String,
      value: 'list'
    },
    
    // Show search box
    showSearch: {
      type: Boolean,
      value: true
    },
    
    // Show category tabs
    showCategoryTabs: {
      type: Boolean,
      value: true
    },
    
    // Readonly mode (no selection)
    readonly: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component data
   */
  data: {
    types: [],
    filteredTypes: [],
    categories: [],
    activeCategory: 'all',
    searchKeyword: '',
    loading: false,
    t: {},
    currentLocale: ''
  },

  /**
   * Component lifecycle - attached
   */
  attached() {
    this.loadTranslations();
    this.loadTypes();
  },

  /**
   * Component methods
   */
  methods: {
    /**
     * Load i18n translations
     */
    loadTranslations() {
      const currentLocale = i18n.getLocale();
      const t = {
        title: i18n.t('common.selectType'),
        search: i18n.t('common.search'),
        searchPlaceholder: i18n.t('common.searchTypePlaceholder'),
        all: i18n.t('common.all'),
        family: i18n.t('guanxi.categories.family'),
        social: i18n.t('guanxi.categories.social'),
        work: i18n.t('guanxi.categories.work'),
        education: i18n.t('guanxi.categories.education'),
        location: i18n.t('guanxi.categories.location'),
        other: i18n.t('guanxi.categories.other'),
        noResults: i18n.t('common.noResults'),
        loading: i18n.t('common.loading')
      };
      
      this.setData({ 
        t,
        currentLocale
      });
    },

    /**
     * Load all relationship types
     */
    async loadTypes() {
      this.setData({ loading: true });
      
      try {
        const allTypes = await typeService.getAllTypes();
        
        // Filter by category if specified
        let types = allTypes;
        if (this.data.category) {
          types = allTypes.filter(type => type.category === this.data.category);
        }
        
        // Extract unique categories
        const categoriesSet = new Set(types.map(type => type.category));
        const categories = Array.from(categoriesSet).map(cat => ({
          id: cat,
          name: this.getCategoryName(cat)
        }));
        
        this.setData({
          types,
          filteredTypes: types,
          categories,
          activeCategory: this.data.category || 'all',
          loading: false
        });
      } catch (error) {
        console.error('Failed to load types:', error);
        wx.showToast({
          title: i18n.t('messages.loadFailed'),
          icon: 'none'
        });
        this.setData({ loading: false });
      }
    },

    /**
     * Get category display name
     */
    getCategoryName(category) {
      const categoryMap = {
        family: this.data.t.family,
        social: this.data.t.social,
        work: this.data.t.work,
        education: this.data.t.education,
        location: this.data.t.location,
        other: this.data.t.other
      };
      return categoryMap[category] || category;
    },

    /**
     * Handle category tab change
     */
    onCategoryChange(e) {
      const category = e.currentTarget.dataset.category;
      this.setData({ activeCategory: category });
      this.filterTypes();
    },

    /**
     * Handle search input
     */
    onSearchInput(e) {
      const keyword = e.detail.value.trim().toLowerCase();
      this.setData({ searchKeyword: keyword });
      this.filterTypes();
    },

    /**
     * Filter types based on category and search keyword
     */
    filterTypes() {
      const { types, activeCategory, searchKeyword, currentLocale } = this.data;
      
      let filtered = types;
      
      // Filter by category
      if (activeCategory !== 'all') {
        filtered = filtered.filter(type => type.category === activeCategory);
      }
      
      // Filter by search keyword
      if (searchKeyword) {
        filtered = filtered.filter(type => {
          const name = this.getTypeName(type).toLowerCase();
          const description = this.getTypeDescription(type).toLowerCase();
          return name.includes(searchKeyword) || description.includes(searchKeyword);
        });
      }
      
      this.setData({ filteredTypes: filtered });
    },

    /**
     * Get type name based on current locale
     */
    getTypeName(type) {
      const locale = this.data.currentLocale;
      if (type.nameI18nKey) {
        return i18n.t(type.nameI18nKey);
      }
      if (locale === 'en-US' && type.nameEn) {
        return type.nameEn;
      }
      return type.name;
    },

    /**
     * Get type description based on current locale
     */
    getTypeDescription(type) {
      const locale = this.data.currentLocale;
      if (type.descriptionI18nKey) {
        return i18n.t(type.descriptionI18nKey);
      }
      if (locale === 'en-US' && type.descriptionEn) {
        return type.descriptionEn;
      }
      return type.description || '';
    },

    /**
     * Handle type selection
     */
    onTypeSelect(e) {
      if (this.data.readonly) return;
      
      const typeId = e.currentTarget.dataset.id;
      const type = this.data.types.find(t => t._id === typeId);
      
      if (!type) return;
      
      this.setData({ selectedTypeId: typeId });
      
      // Trigger change event
      this.triggerEvent('change', {
        typeId: typeId,
        type: type
      });
    },

    /**
     * Clear search
     */
    onClearSearch() {
      this.setData({ searchKeyword: '' });
      this.filterTypes();
    },

    /**
     * Get selected type (public method)
     */
    getSelectedType() {
      const { selectedTypeId, types } = this.data;
      return types.find(t => t._id === selectedTypeId) || null;
    },

    /**
     * Set selected type (public method)
     */
    setSelectedType(typeId) {
      this.setData({ selectedTypeId: typeId });
    },

    /**
     * Refresh types (public method)
     */
    refresh() {
      this.loadTypes();
    }
  },

  /**
   * Component observers
   */
  observers: {
    'selectedTypeId': function(newVal) {
      // Can add additional logic when selection changes
    },
    
    'category': function(newVal) {
      // Reload types when category filter changes
      if (newVal !== this.data.activeCategory) {
        this.loadTypes();
      }
    }
  }
});
