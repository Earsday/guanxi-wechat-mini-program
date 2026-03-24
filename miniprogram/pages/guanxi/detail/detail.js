// pages/guanxi/detail/detail.js - Guanxi relationship detail page
const guanxiService = require('../../../services/guanxiService');
const characterService = require('../../../services/characterService');
const typeService = require('../../../services/typeService');
const i18n = require('../../../utils/i18n');
const { formatDate } = require('../../../utils/util');

Page({
  data: {
    guanxiId: '',
    guanxi: null,
    fromCharacter: null,
    toCharacter: null,
    typeDefinition: null,
    loading: true,
    error: null,
    i18n: {},
    
    // Confirmation modal
    showDeleteModal: false,
  },

  onLoad(options) {
    if (!options.id) {
      this.setData({
        error: 'invalidParams',
        loading: false
      });
      return;
    }

    this.setData({ guanxiId: options.id });
    this.setI18nMessages();
    this.loadData();
  },

  onShow() {
    // Refresh data when returning to this page
    if (this.data.guanxiId && !this.data.loading) {
      this.loadData();
    }
  },

  /**
   * Set i18n messages
   */
  setI18nMessages() {
    this.setData({
      i18n: {
        title: i18n.t('pages.guanxiDetail.title'),
        basicInfo: i18n.t('pages.guanxiDetail.basicInfo'),
        fromLabel: i18n.t('pages.guanxiDetail.fromLabel'),
        toLabel: i18n.t('pages.guanxiDetail.toLabel'),
        typeLabel: i18n.t('pages.guanxiDetail.typeLabel'),
        createdAt: i18n.t('pages.guanxiDetail.createdAt'),
        updatedAt: i18n.t('pages.guanxiDetail.updatedAt'),
        periods: i18n.t('pages.guanxiDetail.periods'),
        currentPeriod: i18n.t('pages.guanxiDetail.currentPeriod'),
        historicalPeriods: i18n.t('pages.guanxiDetail.historicalPeriods'),
        startTime: i18n.t('pages.guanxiDetail.startTime'),
        endTime: i18n.t('pages.guanxiDetail.endTime'),
        status: i18n.t('pages.guanxiDetail.status'),
        active: i18n.t('pages.guanxiDetail.active'),
        inactive: i18n.t('pages.guanxiDetail.inactive'),
        attributes: i18n.t('pages.guanxiDetail.attributes'),
        noAttributes: i18n.t('pages.guanxiDetail.noAttributes'),
        notes: i18n.t('pages.guanxiDetail.notes'),
        noNotes: i18n.t('pages.guanxiDetail.noNotes'),
        editButton: i18n.t('pages.guanxiDetail.editButton'),
        deleteButton: i18n.t('pages.guanxiDetail.deleteButton'),
        addPeriodButton: i18n.t('pages.guanxiDetail.addPeriodButton'),
        endPeriodButton: i18n.t('pages.guanxiDetail.endPeriodButton'),
      }
    });
  },

  /**
   * Load guanxi data and related information
   */
  async loadData() {
    this.setData({ loading: true, error: null });

    try {
      // Load guanxi data
      const guanxi = await guanxiService.getGuanxi(this.data.guanxiId, {
        includeCharacterNames: false
      });

      if (!guanxi) {
        this.setData({
          error: 'notFound',
          loading: false
        });
        wx.showToast({
          title: i18n.t('pages.guanxiDetail.notFound'),
          icon: 'none'
        });
        return;
      }

      // Load related character information
      const [fromCharacter, toCharacter, typeDefinition] = await Promise.all([
        characterService.getCharacterById(guanxi.fromCharacterId),
        characterService.getCharacterById(guanxi.toCharacterId),
        typeService.getTypeById(guanxi.typeId)
      ]);

      // Process periods - separate current and historical
      const currentPeriod = guanxi.periods.find(p => !p.endTime);
      const historicalPeriods = guanxi.periods.filter(p => p.endTime);

      // Format dates for display
      const formattedGuanxi = {
        ...guanxi,
        createdAtFormatted: formatDate(new Date(guanxi.createdAt)),
        updatedAtFormatted: formatDate(new Date(guanxi.updatedAt)),
      };

      this.setData({
        guanxi: formattedGuanxi,
        fromCharacter,
        toCharacter,
        typeDefinition,
        currentPeriod,
        historicalPeriods,
        loading: false
      });

    } catch (error) {
      console.error('Failed to load guanxi data:', error);
      this.setData({
        error: 'loadFailed',
        loading: false
      });
      wx.showToast({
        title: i18n.t('pages.guanxiDetail.loadFailed'),
        icon: 'none'
      });
    }
  },

  /**
   * Navigate to edit page
   */
  onEdit() {
    wx.navigateTo({
      url: `/pages/guanxi/edit/edit?id=${this.data.guanxiId}`
    });
  },

  /**
   * Show delete confirmation modal
   */
  onDelete() {
    this.setData({ showDeleteModal: true });
  },

  /**
   * Cancel delete operation
   */
  onCancelDelete() {
    this.setData({ showDeleteModal: false });
  },

  /**
   * Confirm and execute delete
   */
  async onConfirmDelete() {
    this.setData({ showDeleteModal: false });

    try {
      wx.showLoading({
        title: i18n.t('common.deleting'),
        mask: true
      });

      await guanxiService.deleteGuanxi(this.data.guanxiId);

      wx.hideLoading();
      wx.showToast({
        title: i18n.t('pages.guanxiDetail.deleteSuccess'),
        icon: 'success'
      });

      // Navigate back after successful deletion
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);

    } catch (error) {
      console.error('Failed to delete guanxi:', error);
      wx.hideLoading();
      wx.showToast({
        title: i18n.t('pages.guanxiDetail.deleteFailed'),
        icon: 'none'
      });
    }
  },

  /**
   * Add new period
   */
  onAddPeriod() {
    // Navigate to period add page (will be created in future)
    wx.navigateTo({
      url: `/pages/guanxi/period/add?guanxiId=${this.data.guanxiId}`
    });
  },

  /**
   * End current period
   */
  onEndPeriod() {
    // Navigate to period end page (will be created in future)
    wx.navigateTo({
      url: `/pages/guanxi/period/end?guanxiId=${this.data.guanxiId}`
    });
  },

  /**
   * Navigate to character detail
   */
  onViewCharacter(e) {
    const { characterId } = e.currentTarget.dataset;
    if (characterId) {
      wx.navigateTo({
        url: `/pages/characters/detail/detail?id=${characterId}`
      });
    }
  },

  /**
   * Format period date for display
   */
  formatPeriodDate(date) {
    return date ? formatDate(new Date(date)) : i18n.t('common.present');
  },

  /**
   * Get field label from type definition
   */
  getFieldLabel(fieldKey) {
    if (!this.data.typeDefinition) return fieldKey;
    
    const field = this.data.typeDefinition.fields.find(f => f.key === fieldKey);
    return field ? field.label : fieldKey;
  },

  /**
   * Get field display value
   */
  getFieldDisplayValue(fieldKey, value) {
    if (!this.data.typeDefinition || !value) return value;
    
    const field = this.data.typeDefinition.fields.find(f => f.key === fieldKey);
    if (!field) return value;

    // For select/multiSelect fields, return option label
    if ((field.type === 'select' || field.type === 'multiSelect') && field.options) {
      if (Array.isArray(value)) {
        return value.map(v => {
          const option = field.options.find(opt => opt.value === v);
          return option ? option.label : v;
        }).join(', ');
      } else {
        const option = field.options.find(opt => opt.value === value);
        return option ? option.label : value;
      }
    }

    // For date fields, format the date
    if (field.type === 'date' || field.type === 'datetime') {
      return formatDate(new Date(value));
    }

    return value;
  }
});
