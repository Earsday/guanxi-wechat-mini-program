// pages/characters/detail/detail.js
const characterService = require('../../../services/characterService.js');
const guanxiService = require('../../../services/guanxiService.js');
const typeService = require('../../../services/typeService.js');
const eventService = require('../../../services/eventService.js');
const i18n = require('../../../utils/i18n.js');
const formatters = require('../../../utils/formatters.js');

Page({
  data: {
    characterId: '',
    character: null,
    relationships: [],
    events: [],
    stats: {
      relationshipCount: 0,
      eventCount: 0,
      daysSinceCreated: 0,
      lastContactDays: 0
    },
    t: {},
    currentLocale: '',
    loading: false,
    
    // Tab navigation
    activeTab: 'overview', // 'overview', 'relationships', 'timeline'
    
    // Relationship visualization
    relationshipsByType: [],
    relationshipsByCategory: []
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

  onLoad: function (options) {
    this.setI18nMessages();
    
    if (options.id) {
      this.setData({
        characterId: options.id
      });
      this.loadData();
    } else {
      wx.showToast({
        title: this.data.t.pages?.characterDetail?.invalidParams || '参数错误',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  onShow: function () {
    this.setI18nMessages();
  },

  onPullDownRefresh: function () {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadData() {
    try {
      this.setData({ loading: true });
      wx.showLoading({ title: this.data.t.common?.loading || '加载中...' });

      // Load character
      const character = await characterService.getCharacterById(this.data.characterId);

      if (!character) {
        wx.showToast({
          title: this.data.t.pages?.characterDetail?.notFound || '人物不存在',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
        return;
      }

      // Load relationships
      const relationships = await guanxiService.getGuanxiByCharacter(this.data.characterId);
      
      // Enrich relationships with character and type information
      const enrichedRelationships = await Promise.all(
        relationships.map(async (rel) => {
          try {
            const otherCharacterId = rel.fromCharacterId === this.data.characterId 
              ? rel.toCharacterId 
              : rel.fromCharacterId;
            const otherCharacter = await characterService.getCharacterById(otherCharacterId);
            const typeDefinition = await typeService.getTypeById(rel.typeId);
            
            return {
              ...rel,
              otherCharacter,
              typeName: typeDefinition?.name || this.data.t.pages?.characterDetail?.unknownType || '未知类型',
              typeCategory: typeDefinition?.category || 'other',
              direction: rel.fromCharacterId === this.data.characterId ? 'outgoing' : 'incoming'
            };
          } catch (err) {
            console.error('Error enriching relationship:', err);
            return rel;
          }
        })
      );

      // Group relationships by type and category
      const relationshipsByType = this.groupRelationshipsByType(enrichedRelationships);
      const relationshipsByCategory = this.groupRelationshipsByCategory(enrichedRelationships);

      // Load events/timeline
      const events = await this.loadEvents(this.data.characterId);

      // Calculate stats
      const stats = this.calculateStats(character, enrichedRelationships, events);

      this.setData({
        character,
        relationships: enrichedRelationships,
        relationshipsByType,
        relationshipsByCategory,
        events,
        stats,
        loading: false
      });

      wx.hideLoading();
    } catch (err) {
      console.error('Failed to load character:', err);
      this.setData({ loading: false });
      wx.hideLoading();
      wx.showToast({
        title: this.data.t.common?.loadFailed || '加载失败',
        icon: 'none'
      });
    }
  },

  async loadEvents(characterId) {
    try {
      // Load events related to this character
      const events = await eventService.getEventsByCharacter(characterId);
      
      // Format events for timeline component
      return events.map(event => ({
        id: event.id,
        time: event.time,
        title: event.title || event.type,
        description: event.description,
        type: this.getEventType(event),
        metadata: event.metadata
      }));
    } catch (err) {
      console.error('Failed to load events:', err);
      return [];
    }
  },

  getEventType(event) {
    // Map event types to timeline component types
    const typeMap = {
      'birthday': 'birthday',
      'meeting': 'meeting',
      'call': 'reminder',
      'message': 'reminder',
      'gift': 'milestone',
      'travel': 'milestone'
    };
    return typeMap[event.type] || 'event';
  },

  groupRelationshipsByType(relationships) {
    const grouped = {};
    
    relationships.forEach(rel => {
      const typeName = rel.typeName || 'Unknown';
      if (!grouped[typeName]) {
        grouped[typeName] = {
          typeName,
          count: 0,
          items: []
        };
      }
      grouped[typeName].count++;
      grouped[typeName].items.push(rel);
    });
    
    return Object.values(grouped).sort((a, b) => b.count - a.count);
  },

  groupRelationshipsByCategory(relationships) {
    const grouped = {};
    
    relationships.forEach(rel => {
      const category = rel.typeCategory || 'other';
      if (!grouped[category]) {
        grouped[category] = {
          category,
          categoryName: this.getCategoryName(category),
          count: 0,
          items: []
        };
      }
      grouped[category].count++;
      grouped[category].items.push(rel);
    });
    
    return Object.values(grouped).sort((a, b) => b.count - a.count);
  },

  getCategoryName(category) {
    const categoryMap = {
      'family_relative': '家庭亲属',
      'social_friend': '社交朋友',
      'work_colleague': '工作同事',
      'education_classmate': '教育同学',
      'location_neighbor': '邻里关系',
      'other': '其他'
    };
    return categoryMap[category] || category;
  },

  getCategoryIcon(category) {
    const iconMap = {
      'family_relative': '👨‍👩‍👧‍👦',
      'social_friend': '👥',
      'work_colleague': '💼',
      'education_classmate': '🎓',
      'location_neighbor': '🏘️',
      'other': '🔗'
    };
    return iconMap[category] || '🔗';
  },

  calculateStats(character, relationships, events) {
    const now = new Date();
    const createTime = new Date(character.createTime || now);
    const daysSinceCreated = Math.floor((now - createTime) / (1000 * 60 * 60 * 24));
    
    // Find most recent contact
    let lastContactDays = null;
    if (relationships.length > 0) {
      const lastContact = relationships.reduce((latest, rel) => {
        const relTime = new Date(rel.lastContactTime || rel.createTime || 0);
        return relTime > latest ? relTime : latest;
      }, new Date(0));
      
      if (lastContact.getTime() > 0) {
        lastContactDays = Math.floor((now - lastContact) / (1000 * 60 * 60 * 24));
      }
    }
    
    return {
      relationshipCount: relationships.length,
      eventCount: events.length,
      daysSinceCreated,
      lastContactDays
    };
  },

  // Tab navigation
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  // Navigate to relationship detail
  onRelationshipTap(e) {
    const relationshipId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/guanxi/detail/detail?id=${relationshipId}`
    });
  },

  // Navigate to other character
  onCharacterTap(e) {
    const characterId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/characters/detail/detail?id=${characterId}`
    });
  },

  // Add new relationship
  onAddRelationship() {
    wx.navigateTo({
      url: `/pages/guanxi/create/create?fromId=${this.data.characterId}`
    });
  },

  // View relationship graph
  onViewGraph() {
    wx.navigateTo({
      url: `/pages/graph/index/index?centerId=${this.data.characterId}`
    });
  },

  // Edit character
  onEdit: function () {
    wx.navigateTo({
      url: `/pages/characters/edit/edit?id=${this.data.characterId}`
    });
  },

  // Delete character
  onDelete: function () {
    wx.showModal({
      title: this.data.t.pages?.characterDetail?.confirmDeleteTitle || '确认删除',
      content: this.data.t.pages?.characterDetail?.confirmDeleteContent || '确定要删除这个人物吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await characterService.deleteCharacter(this.data.characterId);
            wx.showToast({
              title: this.data.t.messages?.deleteSuccess || '删除成功',
              icon: 'success'
            });
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          } catch (err) {
            console.error('Delete failed:', err);
            wx.showToast({
              title: this.data.t.messages?.deleteFailed || '删除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // Share character
  onShare() {
    return {
      title: `${this.data.character.name} - ${this.data.t.pages?.characterDetail?.title || '人物详情'}`,
      path: `/pages/characters/detail/detail?id=${this.data.characterId}`
    };
  }
});
