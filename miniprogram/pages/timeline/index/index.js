// pages/timeline/index/index.js - Timeline page for events
const eventService = require('../../../services/eventService');
const characterService = require('../../../services/characterService');
const { t } = require('../../../utils/i18n');
const { formatTime } = require('../../../utils/formatters');

Page({
  data: {
    events: [],
    filteredEvents: [],
    characters: [],
    loading: true,
    filterType: 'all', // all, birthday, custom
    filterTypeOptions: [],
    sortOrder: 'desc', // desc: newest first, asc: oldest first
    sortOrderOptions: [],
    showFilters: false,
    i18n: {}
  },

  onLoad() {
    this.setI18nMessages();
    this.loadData();
  },

  setI18nMessages() {
    this.setData({
      i18n: {
        title: t('event.title'),
        filterType: t('event.filterType'),
        allEvents: t('event.allEvents'),
        birthdays: t('event.birthdays'),
        customEvents: t('event.customEvents'),
        sortOrder: t('event.sortOrder'),
        newest: t('event.newest'),
        oldest: t('event.oldest'),
        noEvents: t('event.noEvents'),
        noEventsTip: t('event.noEventsTip'),
        create: t('common.add'),
        edit: t('common.edit'),
        delete: t('common.delete'),
        loading: t('common.loading')
      },
      filterTypeOptions: [
        { label: t('event.allEvents'), value: 'all' },
        { label: t('event.birthdays'), value: 'birthday' },
        { label: t('event.customEvents'), value: 'custom' }
      ],
      sortOrderOptions: [
        { label: t('event.newest'), value: 'desc' },
        { label: t('event.oldest'), value: 'asc' }
      ]
    });
  },

  async loadData() {
    try {
      this.setData({ loading: true });

      // Load events and characters in parallel
      const [events, characters] = await Promise.all([
        eventService.queryEvents(),
        characterService.queryCharacters()
      ]);

      // Enrich events with character names
      const enrichedEvents = events.map(event => {
        const character = characters.find(c => c.id === event.characterId);
        return {
          ...event,
          characterName: character ? character.nameFields?.displayName || character.nameFields?.familyName : t('common.unknown'),
          formattedTime: this.formatEventTime(event)
        };
      });

      this.setData({
        events: enrichedEvents,
        characters,
        loading: false
      });

      this.applyFilters();
    } catch (error) {
      console.error('Failed to load timeline data:', error);
      wx.showToast({
        title: t('common.loadFailed'),
        icon: 'none'
      });
      this.setData({ loading: false });
    }
  },

  formatEventTime(event) {
    if (event.eventDate) {
      return formatTime(new Date(event.eventDate), 'YYYY-MM-DD');
    }
    return t('common.unknown');
  },

  toggleFilters() {
    this.setData({
      showFilters: !this.data.showFilters
    });
  },

  onFilterTypeChange(e) {
    this.setData({
      filterType: this.data.filterTypeOptions[e.detail.value].value
    });
    this.applyFilters();
  },

  onSortOrderChange(e) {
    this.setData({
      sortOrder: this.data.sortOrderOptions[e.detail.value].value
    });
    this.applyFilters();
  },

  applyFilters() {
    let filtered = [...this.data.events];

    // Filter by type
    if (this.data.filterType === 'birthday') {
      filtered = filtered.filter(e => e.type === 'birthday');
    } else if (this.data.filterType === 'custom') {
      filtered = filtered.filter(e => e.type === 'custom');
    }

    // Sort by time
    filtered.sort((a, b) => {
      const timeA = a.eventDate ? new Date(a.eventDate).getTime() : 0;
      const timeB = b.eventDate ? new Date(b.eventDate).getTime() : 0;
      return this.data.sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    this.setData({ filteredEvents: filtered });
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onEventTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/events/detail/detail?id=${id}`
    });
  },

  onCreateEvent() {
    wx.navigateTo({
      url: '/pages/events/create/create'
    });
  },

  onEditEvent(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/events/edit/edit?id=${id}`
    });
  },

  async onDeleteEvent(e) {
    const { id } = e.currentTarget.dataset;
    
    const res = await wx.showModal({
      title: t('common.confirm'),
      content: t('event.deleteConfirm')
    });

    if (!res.confirm) return;

    try {
      await eventService.deleteEvent(id);
      wx.showToast({
        title: t('messages.deleteSuccess'),
        icon: 'success'
      });
      this.loadData();
    } catch (error) {
      console.error('Failed to delete event:', error);
      wx.showToast({
        title: t('messages.deleteFailed'),
        icon: 'none'
      });
    }
  }
});
