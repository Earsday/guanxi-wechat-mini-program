// pages/reminder/list/list.js - Reminder list page
const reminderService = require('../../../services/reminderService');
const characterService = require('../../../services/characterService');
const { t } = require('../../../utils/i18n');
const { formatTime } = require('../../../utils/formatters');

Page({
  data: {
    reminders: [],
    filteredReminders: [],
    characters: [],
    loading: true,
    filterStatus: 'all', // all, pending, triggered, dismissed
    filterStatusOptions: [],
    sortBy: 'triggerTime', // triggerTime, createdAt
    sortOrder: 'asc', // asc: earliest first, desc: latest first
    sortByOptions: [],
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
        title: t('reminder.title'),
        filterStatus: t('reminder.filterStatus'),
        allReminders: t('reminder.allReminders'),
        pending: t('reminder.pending'),
        triggered: t('reminder.triggered'),
        dismissed: t('reminder.dismissed'),
        sortBy: t('reminder.sortBy'),
        sortOrder: t('reminder.sortOrder'),
        triggerTime: t('reminder.triggerTime'),
        createdAt: t('reminder.createdAt'),
        earliest: t('reminder.earliest'),
        latest: t('reminder.latest'),
        noReminders: t('reminder.noReminders'),
        noRemindersTip: t('reminder.noRemindersTip'),
        create: t('common.add'),
        edit: t('common.edit'),
        delete: t('common.delete'),
        dismiss: t('reminder.dismiss'),
        loading: t('common.loading')
      },
      filterStatusOptions: [
        { label: t('reminder.allReminders'), value: 'all' },
        { label: t('reminder.pending'), value: 'pending' },
        { label: t('reminder.triggered'), value: 'triggered' },
        { label: t('reminder.dismissed'), value: 'dismissed' }
      ],
      sortByOptions: [
        { label: t('reminder.triggerTime'), value: 'triggerTime' },
        { label: t('reminder.createdAt'), value: 'createdAt' }
      ],
      sortOrderOptions: [
        { label: t('reminder.earliest'), value: 'asc' },
        { label: t('reminder.latest'), value: 'desc' }
      ]
    });
  },

  async loadData() {
    try {
      this.setData({ loading: true });

      // Load reminders and characters in parallel
      const [reminders, characters] = await Promise.all([
        reminderService.queryReminders(),
        characterService.queryCharacters()
      ]);

      // Enrich reminders with character names
      const enrichedReminders = reminders.map(reminder => {
        const character = characters.find(c => c.id === reminder.characterId);
        return {
          ...reminder,
          characterName: character ? character.nameFields?.displayName || character.nameFields?.familyName : t('common.unknown'),
          formattedTriggerTime: this.formatTriggerTime(reminder),
          statusLabel: this.getStatusLabel(reminder.status)
        };
      });

      this.setData({
        reminders: enrichedReminders,
        characters,
        loading: false
      });

      this.applyFilters();
    } catch (error) {
      console.error('Failed to load reminders:', error);
      wx.showToast({
        title: t('common.loadFailed'),
        icon: 'none'
      });
      this.setData({ loading: false });
    }
  },

  formatTriggerTime(reminder) {
    if (reminder.triggerTime) {
      return formatTime(new Date(reminder.triggerTime), 'YYYY-MM-DD HH:mm');
    }
    return t('common.unknown');
  },

  getStatusLabel(status) {
    const statusMap = {
      pending: t('reminder.pending'),
      triggered: t('reminder.triggered'),
      dismissed: t('reminder.dismissed')
    };
    return statusMap[status] || status;
  },

  toggleFilters() {
    this.setData({
      showFilters: !this.data.showFilters
    });
  },

  onFilterStatusChange(e) {
    this.setData({
      filterStatus: this.data.filterStatusOptions[e.detail.value].value
    });
    this.applyFilters();
  },

  onSortByChange(e) {
    this.setData({
      sortBy: this.data.sortByOptions[e.detail.value].value
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
    let filtered = [...this.data.reminders];

    // Filter by status
    if (this.data.filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === this.data.filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      const field = this.data.sortBy;
      const timeA = a[field] ? new Date(a[field]).getTime() : 0;
      const timeB = b[field] ? new Date(b[field]).getTime() : 0;
      return this.data.sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

    this.setData({ filteredReminders: filtered });
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReminderTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/reminder/detail/detail?id=${id}`
    });
  },

  onCreateReminder() {
    wx.navigateTo({
      url: '/pages/reminder/create/create'
    });
  },

  onEditReminder(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/reminder/edit/edit?id=${id}`
    });
  },

  async onDismissReminder(e) {
    const { id } = e.currentTarget.dataset;

    try {
      await reminderService.updateReminder(id, { status: 'dismissed' });
      wx.showToast({
        title: t('reminder.dismissSuccess'),
        icon: 'success'
      });
      this.loadData();
    } catch (error) {
      console.error('Failed to dismiss reminder:', error);
      wx.showToast({
        title: t('reminder.dismissFailed'),
        icon: 'none'
      });
    }
  },

  async onDeleteReminder(e) {
    const { id } = e.currentTarget.dataset;

    const res = await wx.showModal({
      title: t('common.confirm'),
      content: t('reminder.deleteConfirm')
    });

    if (!res.confirm) return;

    try {
      await reminderService.deleteReminder(id);
      wx.showToast({
        title: t('messages.deleteSuccess'),
        icon: 'success'
      });
      this.loadData();
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      wx.showToast({
        title: t('messages.deleteFailed'),
        icon: 'none'
      });
    }
  }
});
