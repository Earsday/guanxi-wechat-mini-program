// pages/guanxi/create/create.js
const characterService = require('../../../services/characterService.js');
const typeService = require('../../../services/typeService.js');
const guanxiService = require('../../../services/guanxiService.js');

Page({
  data: {
    characters: [],
    types: [],
    selectedFromId: '',
    selectedToId: '',
    selectedTypeId: '',
    selectedType: null,
    formData: {}
  },

  onLoad: function () {
    console.log('Create guanxi page loaded');
    this.loadInitialData();
  },

  async loadInitialData() {
    try {
      wx.showLoading({ title: '加载中...' });

      // Load characters and types
      const characters = await characterService.getAllCharacters();
      const types = await typeService.getAllTypes();

      this.setData({
        characters: characters,
        types: types
      });

      wx.hideLoading();
    } catch (err) {
      console.error('Failed to load data:', err);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // From character selection
  onFromCharacterChange: function (e) {
    this.setData({
      selectedFromId: this.data.characters[e.detail.value].id
    });
  },

  // To character selection
  onToCharacterChange: function (e) {
    this.setData({
      selectedToId: this.data.characters[e.detail.value].id
    });
  },

  // Type selection
  onTypeChange: async function (e) {
    const typeId = this.data.types[e.detail.value].id;
    const type = await typeService.getTypeById(typeId);

    // Generate form data structure
    const formData = typeService.generateFormData(type);

    this.setData({
      selectedTypeId: typeId,
      selectedType: type,
      formData: formData
    });
  },

  // Form input handler
  onFormInput: function (e) {
    const key = e.currentTarget.dataset.key;
    const value = e.detail.value;

    this.setData({
      [`formData.${key}`]: value
    });
  },

  // Submit form
  onSubmit: async function () {
    const { selectedFromId, selectedToId, selectedTypeId, selectedType, formData } = this.data;

    // Validate selections
    if (!selectedFromId || !selectedToId || !selectedTypeId) {
      wx.showToast({
        title: '请完整填写信息',
        icon: 'none'
      });
      return;
    }

    if (selectedFromId === selectedToId) {
      wx.showToast({
        title: '不能选择同一个人',
        icon: 'none'
      });
      return;
    }

    // Validate form data
    const validation = typeService.validateFormData(selectedType, formData);
    if (!validation.valid) {
      wx.showToast({
        title: validation.errors[0].message,
        icon: 'none'
      });
      return;
    }

    try {
      wx.showLoading({ title: '创建中...' });

      // Create relationship
      await guanxiService.createGuanxi({
        fromCharacterId: selectedFromId,
        toCharacterId: selectedToId,
        typeId: selectedTypeId,
        direction: 'forward',
        attributes: formData
      });

      wx.hideLoading();
      wx.showToast({
        title: '创建成功',
        icon: 'success'
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (err) {
      console.error('Failed to create guanxi:', err);
      wx.hideLoading();
      wx.showToast({
        title: '创建失败',
        icon: 'none'
      });
    }
  }
});
