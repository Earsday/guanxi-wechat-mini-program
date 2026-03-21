// pages/characters/detail/detail.js
const characterService = require('../../../services/characterService.js');
const guanxiService = require('../../../services/guanxiService.js');

Page({
  data: {
    characterId: '',
    character: null,
    relationships: []
  },

  onLoad: function (options) {
    if (options.id) {
      this.setData({
        characterId: options.id
      });
      this.loadData();
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  async loadData() {
    try {
      wx.showLoading({ title: '加载中...' });

      // Load character
      const character = await characterService.getCharacterById(this.data.characterId);

      if (!character) {
        wx.showToast({
          title: '人物不存在',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
        return;
      }

      // Load relationships
      const relationships = await guanxiService.getGuanxiByCharacter(this.data.characterId);

      this.setData({
        character: character,
        relationships: relationships
      });

      wx.hideLoading();
    } catch (err) {
      console.error('Failed to load character:', err);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // Edit character
  onEdit: function () {
    wx.showToast({
      title: '编辑功能待实现',
      icon: 'none'
    });
  },

  // Delete character
  onDelete: function () {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个人物吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await characterService.deleteCharacter(this.data.characterId);
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          } catch (err) {
            console.error('Delete failed:', err);
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  }
});
