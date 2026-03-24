// pages/guanxi/create/create.js
const guanxiService = require('../../../services/guanxiService.js');
const typeService = require('../../../services/typeService.js');
const characterService = require('../../../services/characterService.js');
const i18n = require('../../../utils/i18n.js');

Page({
  data: {
    // Step navigation
    currentStep: 1,
    totalSteps: 3,
    stepTitles: [],
    
    // Character selection
    fromCharacter: null,
    toCharacter: null,
    showFromPicker: false,
    showToPicker: false,
    
    // Type selection
    selectedTypeId: null,
    selectedType: null,
    
    // Dynamic form data
    formData: {},
    
    // Validation
    errors: {},
    
    // UI state
    isSubmitting: false,
    
    // i18n
    t: {},
    currentLocale: ''
  },

  onLoad(options) {
    this.setI18nMessages();
    this.initStepTitles();
    
    // Check if pre-selected character is passed
    if (options.characterId) {
      this.loadCharacter(options.characterId, 'from');
    }
    if (options.fromId) {
      this.loadCharacter(options.fromId, 'from');
    }
    if (options.toId) {
      this.loadCharacter(options.toId, 'to');
    }
  },

  onShow() {
    this.setI18nMessages();
  },

  setI18nMessages() {
    const locale = i18n.getLocale();
    if (this.data.currentLocale !== locale) {
      this.setData({
        t: i18n.getMessages(),
        currentLocale: locale
      });
      this.initStepTitles();
    }
  },

  initStepTitles() {
    const t = this.data.t;
    this.setData({
      stepTitles: [
        t.pages?.guanxiCreate?.step1 || '选择人物',
        t.pages?.guanxiCreate?.step2 || '选择关系类型',
        t.pages?.guanxiCreate?.step3 || '填写详细信息'
      ]
    });
  },

  async loadCharacter(characterId, type) {
    try {
      const character = await characterService.getCharacterById(characterId);
      if (type === 'from') {
        this.setData({ fromCharacter: character });
      } else {
        this.setData({ toCharacter: character });
      }
    } catch (err) {
      console.error('Load character failed:', err);
    }
  },

  // Step navigation
  onNextStep() {
    if (!this.validateCurrentStep()) {
      return;
    }

    if (this.data.currentStep < this.data.totalSteps) {
      this.setData({
        currentStep: this.data.currentStep + 1
      });
    }
  },

  onPrevStep() {
    if (this.data.currentStep > 1) {
      this.setData({
        currentStep: this.data.currentStep - 1
      });
    }
  },

  validateCurrentStep() {
    const { currentStep, fromCharacter, toCharacter, selectedTypeId } = this.data;
    const t = this.data.t;

    if (currentStep === 1) {
      if (!fromCharacter) {
        wx.showToast({
          title: t.pages?.guanxiCreate?.errors?.selectFrom || '请选择起始人物',
          icon: 'none'
        });
        return false;
      }
      if (!toCharacter) {
        wx.showToast({
          title: t.pages?.guanxiCreate?.errors?.selectTo || '请选择目标人物',
          icon: 'none'
        });
        return false;
      }
      if (fromCharacter.id === toCharacter.id) {
        wx.showToast({
          title: t.pages?.guanxiCreate?.errors?.sameCharacter || '不能选择相同的人物',
          icon: 'none'
        });
        return false;
      }
    }

    if (currentStep === 2) {
      if (!selectedTypeId) {
        wx.showToast({
          title: t.pages?.guanxiCreate?.errors?.selectType || '请选择关系类型',
          icon: 'none'
        });
        return false;
      }
    }

    return true;
  },

  // Character selection
  onSelectFromCharacter() {
    this.setData({ showFromPicker: true });
  },

  onSelectToCharacter() {
    this.setData({ showToPicker: true });
  },

  onFromCharacterSelect(e) {
    const character = e.detail;
    this.setData({
      fromCharacter: character,
      showFromPicker: false
    });
  },

  onToCharacterSelect(e) {
    const character = e.detail;
    this.setData({
      toCharacter: character,
      showToPicker: false
    });
  },

  onFromPickerClose() {
    this.setData({ showFromPicker: false });
  },

  onToPickerClose() {
    this.setData({ showToPicker: false });
  },

  onSwapCharacters() {
    const { fromCharacter, toCharacter } = this.data;
    if (fromCharacter && toCharacter) {
      this.setData({
        fromCharacter: toCharacter,
        toCharacter: fromCharacter
      });
      wx.showToast({
        title: this.data.t.pages?.guanxiCreate?.swapped || '已交换人物',
        icon: 'success',
        duration: 1000
      });
    }
  },

  onClearFromCharacter() {
    this.setData({ fromCharacter: null });
  },

  onClearToCharacter() {
    this.setData({ toCharacter: null });
  },

  // Type selection
  async onTypeSelect(e) {
    const typeId = e.detail.typeId;
    try {
      const type = await typeService.getTypeById(typeId);
      this.setData({
        selectedTypeId: typeId,
        selectedType: type,
        formData: {}
      });
    } catch (err) {
      console.error('Load type failed:', err);
    }
  },

  // Form data
  onFormChange(e) {
    this.setData({
      formData: e.detail.value
    });
  },

  // Submit
  async onSubmit() {
    if (!this.validateCurrentStep()) {
      return;
    }

    // Validate form if on step 3
    if (this.data.currentStep === 3) {
      const dynamicForm = this.selectComponent('#dynamicForm');
      if (dynamicForm) {
        const validation = dynamicForm.validate();
        if (!validation.valid) {
          wx.showToast({
            title: validation.errors[0] || this.data.t.validation?.invalidForm || '表单验证失败',
            icon: 'none'
          });
          return;
        }
      }
    }

    this.setData({ isSubmitting: true });

    try {
      wx.showLoading({
        title: this.data.t.common?.loading || '提交中...',
        mask: true
      });

      await guanxiService.createGuanxi({
        fromCharacterId: this.data.fromCharacter.id,
        toCharacterId: this.data.toCharacter.id,
        typeId: this.data.selectedTypeId,
        attributes: this.data.formData,
        createTime: new Date().toISOString()
      });

      wx.hideLoading();
      wx.showToast({
        title: this.data.t.pages?.guanxiCreate?.createSuccess || '创建成功',
        icon: 'success',
        duration: 2000
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (err) {
      console.error('Create guanxi failed:', err);
      wx.hideLoading();
      wx.showToast({
        title: this.data.t.pages?.guanxiCreate?.createFailed || '创建失败',
        icon: 'none'
      });
      this.setData({ isSubmitting: false });
    }
  },

  onCancel() {
    if (this.data.currentStep === 1 && !this.data.fromCharacter && !this.data.toCharacter) {
      wx.navigateBack();
      return;
    }

    wx.showModal({
      title: this.data.t.common?.confirm || '确认',
      content: this.data.t.pages?.guanxiCreate?.cancelConfirm || '确定要取消创建关系吗?',
      confirmText: this.data.t.common?.confirm || '确定',
      cancelText: this.data.t.common?.cancel || '取消',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack();
        }
      }
    });
  }
});
