// components/timeline/timeline.js
const i18n = require('../../utils/i18n');
const formatters = require('../../utils/formatters');

/**
 * Timeline Component
 * Displays a chronological list of events with visual timeline styling
 * Supports different event types and customizable rendering
 */
Component({
  properties: {
    // Array of timeline items
    items: {
      type: Array,
      value: [],
      observer: 'onItemsChange'
    },
    
    // Display mode: 'vertical' | 'horizontal'
    mode: {
      type: String,
      value: 'vertical'
    },
    
    // Show time labels on timeline
    showTime: {
      type: Boolean,
      value: true
    },
    
    // Show icons for different event types
    showIcons: {
      type: Boolean,
      value: true
    },
    
    // Highlight current/active items
    highlightCurrent: {
      type: Boolean,
      value: false
    },
    
    // Enable click on timeline items
    clickable: {
      type: Boolean,
      value: true
    }
  },

  data: {
    processedItems: [],
    currentDate: null,
    t: {}
  },

  lifetimes: {
    attached() {
      this.loadTranslations();
      this.setData({
        currentDate: new Date()
      });
    }
  },

  methods: {
    /**
     * Load i18n translations
     */
    loadTranslations() {
      const t = {
        today: i18n.t('time.today'),
        yesterday: i18n.t('time.yesterday'),
        tomorrow: i18n.t('time.tomorrow'),
        daysAgo: i18n.t('time.daysAgo'),
        daysLater: i18n.t('time.daysLater'),
        weeksAgo: i18n.t('time.weeksAgo'),
        monthsAgo: i18n.t('time.monthsAgo'),
        yearsAgo: i18n.t('time.yearsAgo'),
        now: i18n.t('time.now'),
        present: i18n.t('time.present'),
        past: i18n.t('time.past'),
        future: i18n.t('time.future')
      };
      
      this.setData({ t });
    },

    /**
     * Process items when they change
     */
    onItemsChange(newItems) {
      if (!newItems || newItems.length === 0) {
        this.setData({ processedItems: [] });
        return;
      }

      const processed = newItems.map((item, index) => {
        return {
          ...item,
          _index: index,
          _displayDate: this.formatDate(item.date),
          _relativeTime: this.getRelativeTime(item.date),
          _icon: this.getIconForType(item.type),
          _isCurrent: this.isCurrentItem(item),
          _isPast: this.isPastItem(item),
          _isFuture: this.isFutureItem(item)
        };
      });

      // Sort by date (newest first by default)
      processed.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });

      this.setData({ processedItems: processed });
    },

    /**
     * Format date for display
     */
    formatDate(dateStr) {
      if (!dateStr) return '';
      
      try {
        const date = new Date(dateStr);
        return formatters.formatDate(date, 'YYYY-MM-DD');
      } catch (e) {
        return dateStr;
      }
    },

    /**
     * Get relative time description
     */
    getRelativeTime(dateStr) {
      if (!dateStr) return '';
      
      const t = this.data.t;
      const date = new Date(dateStr);
      const now = this.data.currentDate;
      const diffMs = date - now;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      // Today
      if (diffDays === 0) {
        return t.today || 'Today';
      }
      
      // Yesterday
      if (diffDays === -1) {
        return t.yesterday || 'Yesterday';
      }
      
      // Tomorrow
      if (diffDays === 1) {
        return t.tomorrow || 'Tomorrow';
      }
      
      // Past
      if (diffDays < 0) {
        const absDays = Math.abs(diffDays);
        if (absDays < 7) {
          return `${absDays} ${t.daysAgo || 'days ago'}`;
        } else if (absDays < 30) {
          const weeks = Math.floor(absDays / 7);
          return `${weeks} ${t.weeksAgo || 'weeks ago'}`;
        } else if (absDays < 365) {
          const months = Math.floor(absDays / 30);
          return `${months} ${t.monthsAgo || 'months ago'}`;
        } else {
          const years = Math.floor(absDays / 365);
          return `${years} ${t.yearsAgo || 'years ago'}`;
        }
      }
      
      // Future
      if (diffDays > 0) {
        return `${diffDays} ${t.daysLater || 'days later'}`;
      }

      return '';
    },

    /**
     * Get icon class for event type
     */
    getIconForType(type) {
      const iconMap = {
        birthday: 'icon-birthday',
        anniversary: 'icon-anniversary',
        meeting: 'icon-meeting',
        event: 'icon-event',
        reminder: 'icon-reminder',
        relationship_start: 'icon-relationship-start',
        relationship_end: 'icon-relationship-end',
        note: 'icon-note',
        default: 'icon-circle'
      };
      
      return iconMap[type] || iconMap.default;
    },

    /**
     * Check if item is current (today)
     */
    isCurrentItem(item) {
      if (!this.data.highlightCurrent || !item.date) return false;
      
      const itemDate = new Date(item.date);
      const now = this.data.currentDate;
      
      return itemDate.toDateString() === now.toDateString();
    },

    /**
     * Check if item is in the past
     */
    isPastItem(item) {
      if (!item.date) return false;
      
      const itemDate = new Date(item.date);
      const now = this.data.currentDate;
      
      return itemDate < now && !this.isCurrentItem(item);
    },

    /**
     * Check if item is in the future
     */
    isFutureItem(item) {
      if (!item.date) return false;
      
      const itemDate = new Date(item.date);
      const now = this.data.currentDate;
      
      return itemDate > now && !this.isCurrentItem(item);
    },

    /**
     * Handle item tap event
     */
    onItemTap(e) {
      if (!this.data.clickable) return;
      
      const { index } = e.currentTarget.dataset;
      const item = this.data.processedItems[index];
      
      this.triggerEvent('itemtap', {
        item: item,
        index: index,
        originalIndex: item._index
      });
    },

    /**
     * Handle item long press
     */
    onItemLongPress(e) {
      const { index } = e.currentTarget.dataset;
      const item = this.data.processedItems[index];
      
      this.triggerEvent('itemlongpress', {
        item: item,
        index: index,
        originalIndex: item._index
      });
    },

    /**
     * Scroll to specific date
     */
    scrollToDate(dateStr) {
      const items = this.data.processedItems;
      const targetIndex = items.findIndex(item => {
        const itemDate = new Date(item.date);
        const targetDate = new Date(dateStr);
        return itemDate.toDateString() === targetDate.toDateString();
      });
      
      if (targetIndex >= 0) {
        this.scrollToItem(targetIndex);
      }
    },

    /**
     * Scroll to specific item index
     */
    scrollToItem(index) {
      // Create a scroll-into-view command
      this.createSelectorQuery()
        .select(`.timeline-item-${index}`)
        .boundingClientRect(rect => {
          if (rect) {
            wx.pageScrollTo({
              scrollTop: rect.top,
              duration: 300
            });
          }
        })
        .exec();
    },

    /**
     * Refresh timeline (update current date)
     */
    refresh() {
      this.setData({
        currentDate: new Date()
      });
      this.onItemsChange(this.properties.items);
    },

    /**
     * Get items within a date range
     */
    getItemsInRange(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return this.data.processedItems.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end;
      });
    }
  }
});
