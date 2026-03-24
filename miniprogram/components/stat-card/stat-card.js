// components/stat-card/stat-card.js
const i18n = require('../../utils/i18n');
const formatters = require('../../utils/formatters');

/**
 * Stat Card Component
 * Displays a single statistic with icon, label, and value
 * Supports various styles, colors, and interactive features
 */
Component({
  properties: {
    // Card title/label
    label: {
      type: String,
      value: ''
    },
    
    // Main statistic value
    value: {
      type: null, // Can be Number or String
      value: 0
    },
    
    // Icon name or emoji
    icon: {
      type: String,
      value: ''
    },
    
    // Icon color
    iconColor: {
      type: String,
      value: '#1989fa'
    },
    
    // Card color scheme: 'primary' | 'success' | 'warning' | 'danger' | 'info'
    color: {
      type: String,
      value: 'primary'
    },
    
    // Additional description text
    description: {
      type: String,
      value: ''
    },
    
    // Trend indicator: 'up' | 'down' | 'neutral' | ''
    trend: {
      type: String,
      value: ''
    },
    
    // Trend value/percentage
    trendValue: {
      type: String,
      value: ''
    },
    
    // Enable click action
    clickable: {
      type: Boolean,
      value: false
    },
    
    // Show loading state
    loading: {
      type: Boolean,
      value: false
    },
    
    // Card size: 'small' | 'medium' | 'large'
    size: {
      type: String,
      value: 'medium'
    },
    
    // Card layout: 'horizontal' | 'vertical'
    layout: {
      type: String,
      value: 'horizontal'
    },
    
    // Format type for value: 'number' | 'currency' | 'percentage' | 'duration'
    valueFormat: {
      type: String,
      value: 'number'
    },
    
    // Custom unit text (e.g., '人', 'items')
    unit: {
      type: String,
      value: ''
    }
  },

  data: {
    formattedValue: '',
    colorClass: '',
    t: {}
  },

  lifetimes: {
    attached() {
      this.loadTranslations();
      this.updateFormattedValue();
    }
  },

  observers: {
    'value, valueFormat': function(value, format) {
      this.updateFormattedValue();
    },
    
    'color': function(color) {
      this.setData({
        colorClass: `color-${color}`
      });
    }
  },

  methods: {
    /**
     * Load i18n translations
     */
    loadTranslations() {
      const t = {
        loading: i18n.t('common.loading'),
        noData: i18n.t('common.noData'),
        increase: i18n.t('common.increase'),
        decrease: i18n.t('common.decrease')
      };
      
      this.setData({ t });
    },

    /**
     * Format the value based on valueFormat property
     */
    updateFormattedValue() {
      const { value, valueFormat, unit } = this.properties;
      let formatted = '';

      if (value === null || value === undefined) {
        formatted = this.data.t.noData || '--';
      } else {
        switch (valueFormat) {
          case 'number':
            // Format number with thousand separators
            formatted = formatters.formatNumber(value);
            break;
            
          case 'currency':
            // Format as currency (assuming CNY)
            formatted = formatters.formatCurrency(value, 'CNY');
            break;
            
          case 'percentage':
            // Format as percentage
            formatted = `${value}%`;
            break;
            
          case 'duration':
            // Format as duration (assumes value in seconds)
            formatted = this.formatDuration(value);
            break;
            
          default:
            formatted = String(value);
        }
        
        // Append unit if provided
        if (unit) {
          formatted = `${formatted} ${unit}`;
        }
      }

      this.setData({ formattedValue: formatted });
    },

    /**
     * Format duration (seconds to human-readable)
     */
    formatDuration(seconds) {
      if (!seconds || seconds < 0) return '0s';
      
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      const parts = [];
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);
      if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
      
      return parts.join(' ');
    },

    /**
     * Handle card tap event
     */
    onCardTap() {
      if (this.properties.clickable && !this.properties.loading) {
        this.triggerEvent('tap', {
          label: this.properties.label,
          value: this.properties.value
        });
      }
    },

    /**
     * Get trend icon
     */
    getTrendIcon() {
      const { trend } = this.properties;
      if (trend === 'up') return '↑';
      if (trend === 'down') return '↓';
      if (trend === 'neutral') return '→';
      return '';
    },

    /**
     * Get trend class
     */
    getTrendClass() {
      const { trend } = this.properties;
      return `trend-${trend}`;
    }
  }
});
