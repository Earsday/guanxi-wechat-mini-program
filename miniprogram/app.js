// app.js - Application entry point
const init = require('./data/init.js');

App({
  onLaunch: function () {
    console.log('=== 关系网 Mini Program Launching ===');

    // Initialize database and load pre-installed types
    init.initializeApp().then(() => {
      console.log('App initialization completed successfully');
    }).catch(err => {
      console.error('App initialization failed:', err);
      wx.showToast({
        title: '初始化失败',
        icon: 'none',
        duration: 2000
      });
    });
  },

  onShow: function () {
    console.log('App shown');
  },

  onHide: function () {
    console.log('App hidden');
  },

  globalData: {
    version: '0.1.0',
    userInfo: null
  }
});
