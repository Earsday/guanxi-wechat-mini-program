// locales/en-US.js - English translations

module.exports = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    confirm: 'Confirm',
    back: 'Back',
    loading: 'Loading...',
    loadFailed: 'Load failed',
    noData: 'No data',
    error: 'Error',
    success: 'Success',
    submit: 'Submit',
    reset: 'Reset',
    close: 'Close',
    more: 'More',
    less: 'Less',
    comingSoon: 'Coming soon'
  },

  locale: {
    zhCN: 'Simplified Chinese',
    zhTW: 'Traditional Chinese',
    enUS: 'English',
    jaJP: 'Japanese'
  },

  time: {
    justNow: 'Just now',
    minutesAgo: '{count} minutes ago',
    hoursAgo: '{count} hours ago',
    daysAgo: '{count} days ago',
    weeksAgo: '{count} weeks ago',
    monthsAgo: '{count} months ago',
    yearsAgo: '{count} years ago',
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow'
  },

  character: {
    title: 'Characters',
    name: 'Name',
    displayName: 'Display Name',
    gender: {
      label: 'Gender',
      male: 'Male',
      female: 'Female'
    },
    birthday: 'Birthday',
    age: 'Age',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    description: 'Description',
    tags: 'Tags',
    createCharacter: 'Create Character',
    editCharacter: 'Edit Character',
    deleteCharacter: 'Delete Character',
    searchCharacter: 'Search Character',
    noCharacters: 'No characters'
  },

  guanxi: {
    title: 'Relationships',
    type: 'Relationship Type',
    from: 'From',
    to: 'To',
    attributes: 'Attributes',
    createGuanxi: 'Create Relationship',
    editGuanxi: 'Edit Relationship',
    deleteGuanxi: 'Delete Relationship',
    noGuanxi: 'No relationships'
  },

  guanxiList: {
    title: 'Relationship List',
    filterByType: 'Filter by Type',
    allTypes: 'All Types',
    sortBy: 'Sort By',
    order: 'Order',
    createdAt: 'Created',
    updatedAt: 'Updated',
    ascending: 'Ascending',
    descending: 'Descending',
    totalCount: 'Total',
    relationships: 'relationships',
    active: 'Active',
    deduced: 'Deduced',
    emptyTip: 'Tap the button below to create a relationship'
  },

  graph: {
    title: 'Relationship Graph',
    centerCharacter: 'Center Character',
    selectCenter: 'Select Center',
    selectLayout: 'Select Layout',
    filters: 'Filters',
    maxDepth: 'Max Depth',
    excludeDeduced: 'Exclude Deduced Relationships',
    characters: 'Characters',
    relationships: 'Relationships',
    levels: 'Levels',
    loading: 'Generating graph...',
    exporting: 'Exporting graph...',
    analyzing: 'Analyzing graph...',
    exportSuccess: 'Graph exported successfully',
    exportFailed: 'Failed to export graph',
    saveToAlbum: 'Save to Album',
    analyze: 'Analyze',
    refresh: 'Refresh',
    export: 'Export',
    layoutForce: 'Force-Directed',
    layoutCircular: 'Circular',
    layoutHierarchical: 'Hierarchical',
    layoutRadial: 'Radial',
    graphAnalysis: 'Graph Analysis',
    totalCharacters: 'Total Characters',
    totalRelationships: 'Total Relationships',
    averageDegree: 'Average Degree',
    clusteringCoefficient: 'Clustering Coefficient',
    networkDensity: 'Network Density',
    nodeActions: 'Select Action',
    viewDetail: 'View Detail',
    setAsCenter: 'Set as Center',
    legend: {
      explicitRelation: 'Explicit Relation',
      deducedRelation: 'Deduced Relation'
    }
  },

  reminder: {
    title: 'Reminders',
    createReminder: 'Create Reminder',
    editReminder: 'Edit Reminder',
    deleteReminder: 'Delete Reminder',
    deleteConfirm: 'Are you sure you want to delete this reminder?',
    upcoming: 'Upcoming',
    pending: 'Pending',
    triggered: 'Triggered',
    dismissed: 'Dismissed',
    noReminders: 'No reminders',
    noRemindersTip: 'Tap the button below to create a reminder',
    filterStatus: 'Filter Status',
    allReminders: 'All Reminders',
    sortBy: 'Sort By',
    sortOrder: 'Sort Order',
    triggerTime: 'Trigger Time',
    createdAt: 'Created',
    earliest: 'Earliest First',
    latest: 'Latest First',
    dismiss: 'Dismiss',
    dismissSuccess: 'Reminder dismissed',
    dismissFailed: 'Failed to dismiss'
  },

  event: {
    title: 'Events',
    createEvent: 'Create Event',
    editEvent: 'Edit Event',
    deleteEvent: 'Delete Event',
    deleteConfirm: 'Are you sure you want to delete this event?',
    timeline: 'Timeline',
    noEvents: 'No events',
    noEventsTip: 'Tap the button below to create an event',
    filterType: 'Event Type',
    allEvents: 'All Events',
    birthdays: 'Birthdays',
    customEvents: 'Custom Events',
    sortOrder: 'Sort Order',
    newest: 'Newest First',
    oldest: 'Oldest First'
  },

  search: {
    title: 'Search',
    placeholder: 'Search by name, tags, etc.',
    recentSearches: 'Recent Searches',
    clearRecent: 'Clear',
    clearRecentConfirm: 'Clear search history?',
    noResults: 'No characters found',
    noResultsTip: 'Try other keywords',
    foundResults: 'Found {count} results',
    emptyState: 'Search Characters',
    emptyTip: 'Enter name, tags, or other keywords'
  },

  pages: {
    index: {
      title: 'Guanxi Network',
      subtitle: 'Making complex relationships clear',
      stats: {
        characters: 'Characters',
        relationships: 'Relationships',
        types: 'Relationship Types'
      },
      recentTypes: 'Recent Types',
      actions: {
        manageCharacters: 'Manage Characters',
        manageCharactersDesc: 'View and edit character information',
        createRelationship: 'Create Relationship',
        createRelationshipDesc: 'Establish new character relationships',
        viewGraph: 'View Graph',
        viewGraphDesc: 'Visualize relationship network'
      }
    },
    characterList: {
      searchPlaceholder: 'Search by name or notes',
      ageUnit: ' yrs old',
      addButton: 'Add Character',
      sort: {
        title: 'Sort',
        name: 'By Name',
        age: 'By Age',
        createTime: 'By Create Time',
        updateTime: 'By Update Time'
      },
      filter: {
        title: 'Filter',
        all: 'All',
        gender: 'Gender',
        group: 'Group'
      },
      empty: {
        title: 'No characters',
        hint: 'Tap the button below to add a character'
      }
    },
    characterDetail: {
      title: 'Character Detail',
      invalidParams: 'Invalid parameters',
      notFound: 'Character not found',
      contactInfo: 'Contact Information',
      phoneLabel: 'Phone: ',
      emailLabel: 'Email: ',
      wechatLabel: 'WeChat: ',
      relationships: 'Relationships',
      unknownType: 'Unknown Type',
      noRelationships: 'No relationships',
      noEvents: 'No events recorded',
      notes: 'Notes',
      confirmDeleteTitle: 'Confirm Delete',
      confirmDeleteContent: 'Are you sure you want to delete this character?',
      relationshipOverview: 'Relationship Overview',
      timeline: 'Timeline',
      stats: {
        relationships: 'Relationships',
        events: 'Events',
        daysSince: 'Days Known',
        days: 'days',
        lastContact: 'Last Contact',
        daysAgo: 'days ago'
      },
      tabs: {
        overview: 'Overview',
        relationships: 'Relationships',
        timeline: 'Timeline'
      },
      actions: {
        addRelationship: 'Add Relationship',
        viewGraph: 'View Graph',
        share: 'Share'
      }
    },
    guanxiCreate: {
      step1: 'Select Characters',
      step2: 'Select Type',
      step3: 'Fill Details',
      step1Desc: 'Choose the starting and target characters for the relationship',
      step2Desc: 'Select an appropriate relationship type',
      step3Desc: 'Fill in detailed attributes for the relationship',
      fromLabel: 'From Character',
      toLabel: 'To Character',
      typeLabel: 'Relationship Type',
      selected: 'Selected',
      selectCharacterPlaceholder: 'Tap to select a character',
      selectTypePlaceholder: 'Select Relationship Type',
      selectPlaceholder: 'Please Select',
      selectDatePlaceholder: 'Select Date',
      submitButton: 'Create Relationship',
      createSuccess: 'Created Successfully',
      createFailed: 'Creation Failed',
      swapped: 'Characters Swapped',
      cancelConfirm: 'Are you sure you want to cancel creating this relationship?',
      errors: {
        selectFrom: 'Please select starting character',
        selectTo: 'Please select target character',
        selectType: 'Please select relationship type',
        sameCharacter: 'Cannot select the same character'
      }
    }
  },

  settings: {
    title: 'Settings',
    general: 'General Settings',
    language: 'Language',
    languageChange: 'Language Changed',
    languageChangeDesc: 'The app will restart to apply the new language',
    dataManagement: 'Data Management',
    viewStatistics: 'View Statistics',
    exportData: 'Export Data',
    importData: 'Import Data',
    clearData: 'Clear All Data',
    dangerZone: 'Danger Zone',
    clearDataWarning: 'This operation will permanently delete all data and cannot be undone!',
    confirmClear: 'Are you sure you want to delete all data?',
    clearSuccess: 'Data cleared successfully',
    clearFailed: 'Failed to clear data',
    exportSuccess: 'Data exported successfully',
    exportFailed: 'Failed to export data',
    importSuccess: 'Data imported successfully',
    importFailed: 'Failed to import data',
    selectFile: 'Please select a file',
    about: 'About',
    version: 'Version',
    appDescription: 'Guanxi Network - Making complex relationships clear',
    copyright: '© 2024 Guanxi Network',
    statistics: {
      title: 'Data Statistics',
      totalCharacters: 'Total Characters',
      totalRelationships: 'Total Relationships',
      totalTypes: 'Relationship Types'
    }
  },

  validation: {
    required: 'This field is required',
    invalidEmail: 'Invalid email format',
    invalidPhone: 'Invalid phone format',
    maxLength: 'Cannot exceed {max} characters',
    minLength: 'Requires at least {min} characters'
  },

  messages: {
    saveSuccess: 'Saved successfully',
    saveFailed: 'Save failed',
    deleteSuccess: 'Deleted successfully',
    deleteFailed: 'Delete failed',
    confirmDelete: 'Confirm delete?',
    networkError: 'Network error, please try again'
  }
};
