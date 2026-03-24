// components/empty-state/empty-state.js
Component({
  /**
   * Component properties
   */
  properties: {
    // Type of empty state: 'character', 'guanxi', 'search', 'filter', 'data', 'error'
    type: {
      type: String,
      value: 'data'
    },
    
    // Custom icon emoji or image path
    icon: {
      type: String,
      value: ''
    },
    
    // Custom title
    title: {
      type: String,
      value: ''
    },
    
    // Custom description
    description: {
      type: String,
      value: ''
    },
    
    // Action button text
    actionText: {
      type: String,
      value: ''
    },
    
    // Show action button
    showAction: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component initial data
   */
  data: {
    defaultStates: {
      character: {
        icon: '👤',
        title: '还没有人物',
        description: '开始添加您的第一个人物吧',
        actionText: '添加人物'
      },
      guanxi: {
        icon: '🔗',
        title: '还没有关系',
        description: '创建人物之间的关系记录',
        actionText: '创建关系'
      },
      search: {
        icon: '🔍',
        title: '没有找到结果',
        description: '试试其他关键词或筛选条件',
        actionText: ''
      },
      filter: {
        icon: '🎯',
        title: '没有符合条件的结果',
        description: '试试调整筛选条件',
        actionText: '重置筛选'
      },
      data: {
        icon: '📭',
        title: '暂无数据',
        description: '这里还没有任何内容',
        actionText: ''
      },
      error: {
        icon: '⚠️',
        title: '加载失败',
        description: '请稍后重试',
        actionText: '重新加载'
      }
    }
  },

  /**
   * Component methods
   */
  methods: {
    /**
     * Get display content based on type and custom props
     */
    getDisplayContent() {
      const defaultState = this.data.defaultStates[this.properties.type] || this.data.defaultStates.data;
      
      return {
        icon: this.properties.icon || defaultState.icon,
        title: this.properties.title || defaultState.title,
        description: this.properties.description || defaultState.description,
        actionText: this.properties.actionText || defaultState.actionText
      };
    },
    
    /**
     * Handle action button tap
     */
    onActionTap() {
      this.triggerEvent('action', { type: this.properties.type });
    }
  }
});
