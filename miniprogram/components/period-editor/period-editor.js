// components/period-editor/period-editor.js
const i18n = require('../../utils/i18n');
const { formatDate } = require('../../utils/util');

/**
 * Period Editor Component
 * 
 * Manages time periods for relationships (guanxi).
 * Supports multiple periods, adding/editing/deleting periods, and open-ended periods.
 * 
 * Properties:
 * - periods: Array - List of period objects
 * - mode: String - 'single' (only one period) or 'multiple' (multiple periods)
 * - readonly: Boolean - Display-only mode
 * 
 * Events:
 * - change: Triggered when periods are modified
 * 
 * Public Methods:
 * - getPeriods(): Returns current periods array
 * - validate(): Validates all periods
 * - addPeriod(): Adds a new period
 * - reset(): Resets to initial state
 */
Component({
  properties: {
    // Array of period objects: { startTime, endTime, status, note }
    periods: {
      type: Array,
      value: [],
      observer: function(newVal) {
        if (newVal && newVal.length > 0) {
          this.setData({ 
            periodsList: JSON.parse(JSON.stringify(newVal)),
            hasInitialPeriods: true
          });
        }
      }
    },

    // Mode: 'single' (only one period) or 'multiple' (multiple periods)
    mode: {
      type: String,
      value: 'single'
    },

    // Readonly mode
    readonly: {
      type: Boolean,
      value: false
    }
  },

  data: {
    periodsList: [],
    hasInitialPeriods: false,
    editingIndex: -1, // Index of period being edited (-1 = none)
    t: {},
    currentLocale: ''
  },

  lifetimes: {
    attached() {
      this.loadTranslations();
      
      // Initialize with one empty period if none provided
      if (this.data.periodsList.length === 0 && !this.data.readonly) {
        this.addPeriod();
      }
    }
  },

  methods: {
    /**
     * Load i18n translations
     */
    loadTranslations() {
      const currentLocale = i18n.getLocale();
      const t = {
        startTime: i18n.t('common.startTime'),
        endTime: i18n.t('common.endTime'),
        ongoing: i18n.t('common.ongoing'),
        note: i18n.t('common.note'),
        notePlaceholder: i18n.t('common.notePlaceholder'),
        add: i18n.t('common.add'),
        edit: i18n.t('common.edit'),
        delete: i18n.t('common.delete'),
        save: i18n.t('common.save'),
        cancel: i18n.t('common.cancel'),
        addPeriod: i18n.t('guanxi.addPeriod') || 'Add Period',
        editPeriod: i18n.t('guanxi.editPeriod') || 'Edit Period',
        deletePeriod: i18n.t('guanxi.deletePeriod') || 'Delete Period',
        confirmDelete: i18n.t('guanxi.confirmDeletePeriod') || 'Delete this period?',
        periodRequired: i18n.t('validation.periodRequired') || 'At least one period is required',
        startTimeRequired: i18n.t('validation.startTimeRequired') || 'Start time is required',
        endTimeBeforeStart: i18n.t('validation.endTimeBeforeStart') || 'End time must be after start time',
        status: {
          active: i18n.t('guanxi.status.active') || 'Active',
          ended: i18n.t('guanxi.status.ended') || 'Ended',
          paused: i18n.t('guanxi.status.paused') || 'Paused'
        }
      };

      this.setData({ t, currentLocale });
    },

    /**
     * Start time date picker change
     */
    onStartDateChange(e) {
      const { index } = e.currentTarget.dataset;
      const startTime = e.detail.value;
      
      const periodsList = [...this.data.periodsList];
      periodsList[index].startTime = startTime;
      
      // Auto-update status based on dates
      this.updatePeriodStatus(periodsList[index]);
      
      this.setData({ periodsList });
      this.triggerChange();
    },

    /**
     * End time date picker change
     */
    onEndDateChange(e) {
      const { index } = e.currentTarget.dataset;
      const endTime = e.detail.value;
      
      const periodsList = [...this.data.periodsList];
      periodsList[index].endTime = endTime;
      periodsList[index].isOngoing = false;
      
      // Auto-update status
      this.updatePeriodStatus(periodsList[index]);
      
      this.setData({ periodsList });
      this.triggerChange();
    },

    /**
     * Toggle "ongoing" checkbox
     */
    onOngoingChange(e) {
      const { index } = e.currentTarget.dataset;
      const isOngoing = e.detail.value;
      
      const periodsList = [...this.data.periodsList];
      periodsList[index].isOngoing = isOngoing;
      
      if (isOngoing) {
        periodsList[index].endTime = null;
        periodsList[index].status = 'active';
      } else {
        // Set end time to today if previously ongoing
        periodsList[index].endTime = formatDate(new Date(), 'YYYY-MM-DD');
        this.updatePeriodStatus(periodsList[index]);
      }
      
      this.setData({ periodsList });
      this.triggerChange();
    },

    /**
     * Note input change
     */
    onNoteInput(e) {
      const { index } = e.currentTarget.dataset;
      const note = e.detail.value;
      
      const periodsList = [...this.data.periodsList];
      periodsList[index].note = note;
      
      this.setData({ periodsList });
      this.triggerChange();
    },

    /**
     * Add new period
     */
    addPeriod() {
      if (this.data.mode === 'single' && this.data.periodsList.length >= 1) {
        wx.showToast({
          title: this.data.t.periodRequired || 'Only one period allowed',
          icon: 'none'
        });
        return;
      }

      const newPeriod = {
        startTime: formatDate(new Date(), 'YYYY-MM-DD'),
        endTime: null,
        status: 'active',
        note: '',
        isOngoing: true,
        createdAt: Date.now()
      };

      const periodsList = [...this.data.periodsList, newPeriod];
      this.setData({ periodsList });
      this.triggerChange();
    },

    /**
     * Delete period
     */
    deletePeriod(e) {
      const { index } = e.currentTarget.dataset;
      
      // Prevent deleting the last period
      if (this.data.periodsList.length <= 1) {
        wx.showToast({
          title: this.data.t.periodRequired,
          icon: 'none'
        });
        return;
      }

      wx.showModal({
        title: this.data.t.deletePeriod,
        content: this.data.t.confirmDelete,
        success: (res) => {
          if (res.confirm) {
            const periodsList = this.data.periodsList.filter((_, i) => i !== index);
            this.setData({ periodsList });
            this.triggerChange();
          }
        }
      });
    },

    /**
     * Update period status based on dates
     */
    updatePeriodStatus(period) {
      if (!period.endTime || period.isOngoing) {
        period.status = 'active';
      } else {
        const endDate = new Date(period.endTime);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        period.status = endDate < today ? 'ended' : 'active';
      }
    },

    /**
     * Trigger change event
     */
    triggerChange() {
      this.triggerEvent('change', { 
        periods: this.getPeriods() 
      });
    },

    /**
     * Validate all periods
     * @returns {Object} { isValid: boolean, errors: array }
     */
    validate() {
      const errors = [];
      const periodsList = this.data.periodsList;

      // At least one period required
      if (periodsList.length === 0) {
        errors.push(this.data.t.periodRequired);
        return { isValid: false, errors };
      }

      // Validate each period
      periodsList.forEach((period, index) => {
        // Start time required
        if (!period.startTime) {
          errors.push(`${this.data.t.startTimeRequired} (Period ${index + 1})`);
        }

        // End time must be after start time
        if (period.startTime && period.endTime && !period.isOngoing) {
          const startDate = new Date(period.startTime);
          const endDate = new Date(period.endTime);
          
          if (endDate < startDate) {
            errors.push(`${this.data.t.endTimeBeforeStart} (Period ${index + 1})`);
          }
        }
      });

      return {
        isValid: errors.length === 0,
        errors
      };
    },

    /**
     * Get periods array (public method)
     * @returns {Array} Array of period objects
     */
    getPeriods() {
      return this.data.periodsList.map(period => ({
        startTime: period.startTime,
        endTime: period.isOngoing ? null : period.endTime,
        status: period.status,
        note: period.note || '',
        createdAt: period.createdAt || Date.now()
      }));
    },

    /**
     * Reset to initial state
     */
    reset() {
      if (this.data.hasInitialPeriods) {
        this.setData({
          periodsList: JSON.parse(JSON.stringify(this.properties.periods))
        });
      } else {
        this.setData({ periodsList: [] });
        if (!this.data.readonly) {
          this.addPeriod();
        }
      }
    },

    /**
     * Get formatted date display
     */
    getDateDisplay(dateStr) {
      if (!dateStr) return '';
      return formatDate(new Date(dateStr), 'YYYY-MM-DD');
    },

    /**
     * Get status badge class
     */
    getStatusClass(status) {
      const statusMap = {
        'active': 'status-active',
        'ended': 'status-ended',
        'paused': 'status-paused'
      };
      return statusMap[status] || 'status-active';
    }
  }
});
