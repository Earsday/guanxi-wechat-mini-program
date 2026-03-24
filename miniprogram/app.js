// app.js - Application entry point

const { db } = require('./services/indexedDB.js');
const initData = require('./data/init.js');
const i18n = require('./utils/i18n.js');

App({
  /**
   * Application launch
   */
  onLaunch: function () {
    console.log('Application launching...');

    // Initialize i18n system
    i18n.init();
    console.log('i18n initialized with locale:', i18n.getLocale());

    // Initialize database
    this.initializeDatabase()
      .then(() => {
        console.log('Database initialized successfully');
        this.globalData.dbReady = true;

        // Emit ready event
        const eventBus = require('./utils/eventBus.js');
        eventBus.emit('app:ready');
      })
      .catch(error => {
        console.error('Failed to initialize database:', error);
        
        wx.showModal({
          title: i18n.t('common.error'),
          content: 'Failed to initialize app. Please restart.',
          showCancel: false
        });
      });

    // Check for updates (WeChat Mini Program feature)
    this.checkForUpdates();
  },

  /**
   * Initialize database
   */
  async initializeDatabase() {
    try {
      // Initialize IndexedDB adapter
      await db.init();
      console.log('IndexedDB initialized');

      // Check if app has been initialized before
      const isInitialized = wx.getStorageSync('app_initialized');

      if (!isInitialized) {
        console.log('First launch - initializing app data...');
        
        // Run initialization
        await initData.initializeApp();
        
        // Mark as initialized
        wx.setStorageSync('app_initialized', true);
        wx.setStorageSync('app_version', this.globalData.version);
        
        console.log('App data initialized');
      } else {
        console.log('App already initialized');
        
        // Check for version updates
        const storedVersion = wx.getStorageSync('app_version');
        if (storedVersion !== this.globalData.version) {
          console.log(`Version update: ${storedVersion} -> ${this.globalData.version}`);
          // Handle migration if needed
          wx.setStorageSync('app_version', this.globalData.version);
        }
      }

      return true;
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  },

  /**
   * Check for WeChat Mini Program updates
   */
  checkForUpdates() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();

      updateManager.onCheckForUpdate(res => {
        if (res.hasUpdate) {
          console.log('New version available');
        }
      });

      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: res => {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        });
      });

      updateManager.onUpdateFailed(() => {
        console.error('Update failed');
      });
    }
  },

  /**
   * Application show (foreground)
   */
  onShow: function () {
    console.log('Application shown');
    
    // Check for pending reminders
    if (this.globalData.dbReady) {
      this.checkReminders();
    }
  },

  /**
   * Application hide (background)
   */
  onHide: function () {
    console.log('Application hidden');
  },

  /**
   * Application error handler
   */
  onError: function (error) {
    console.error('Application error:', error);
    
    // Log error for debugging
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: error.toString(),
      stack: error.stack
    };

    // Save to local storage for debugging
    try {
      let errors = wx.getStorageSync('app_errors') || [];
      errors.push(errorLog);
      
      // Keep only last 10 errors
      if (errors.length > 10) {
        errors = errors.slice(-10);
      }
      
      wx.setStorageSync('app_errors', errors);
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  },

  /**
   * Check for pending reminders
   */
  async checkReminders() {
    try {
      const reminderService = require('./services/reminderService.js');
      const pending = await reminderService.getPendingReminders(5);

      if (pending.length > 0) {
        console.log(`Found ${pending.length} pending reminders`);
        
        // Show notification for first reminder
        const reminder = pending[0];
        wx.showToast({
          title: reminder.title,
          icon: 'none',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Failed to check reminders:', error);
    }
  },

  /**
   * Global data
   */
  globalData: {
    version: '1.0.0',
    dbReady: false,
    userInfo: null,
    currentUser: null
  }
});
