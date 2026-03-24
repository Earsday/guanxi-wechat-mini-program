// pages/characters/edit/edit.js - Character create/edit page
const characterService = require('../../../services/characterService');
const i18n = require('../../../utils/i18n');
const validators = require('../../../utils/validators');

Page({
  data: {
    mode: 'create', // 'create' or 'edit'
    characterId: null,
    
    // Form data
    formData: {
      name: '',
      alias: '',
      gender: '',
      birthday: null,
      avatarUrl: '',
      contacts: {
        phone: '',
        email: '',
        im: {
          wechat: '',
          qq: ''
        }
      },
      tags: '',
      group: '',
      notes: ''
    },
    
    // UI state
    genderOptions: [],
    hasChanges: false,
    isSubmitting: false,
    
    // i18n messages
    t: {}
  },

  onLoad(options) {
    this.setI18nMessages();
    
    // Check mode and load data if editing
    if (options.id) {
      this.setData({
        mode: 'edit',
        characterId: options.id
      });
      this.loadCharacter(options.id);
    } else {
      this.setData({ mode: 'create' });
    }
    
    // Set page title
    wx.setNavigationBarTitle({
      title: options.id ? this.data.t.editTitle : this.data.t.createTitle
    });
  },

  setI18nMessages() {
    const t = {
      createTitle: i18n.t('pages.characterEdit.createTitle'),
      editTitle: i18n.t('pages.characterEdit.editTitle'),
      basicInfo: i18n.t('pages.characterEdit.basicInfo'),
      nameLabel: i18n.t('pages.characterEdit.nameLabel'),
      namePlaceholder: i18n.t('pages.characterEdit.namePlaceholder'),
      nameRequired: i18n.t('pages.characterEdit.nameRequired'),
      aliasLabel: i18n.t('pages.characterEdit.aliasLabel'),
      aliasPlaceholder: i18n.t('pages.characterEdit.aliasPlaceholder'),
      genderLabel: i18n.t('pages.characterEdit.genderLabel'),
      genderRequired: i18n.t('pages.characterEdit.genderRequired'),
      birthdayLabel: i18n.t('pages.characterEdit.birthdayLabel'),
      birthdayPlaceholder: i18n.t('pages.characterEdit.birthdayPlaceholder'),
      contactInfo: i18n.t('pages.characterEdit.contactInfo'),
      phoneLabel: i18n.t('pages.characterEdit.phoneLabel'),
      phonePlaceholder: i18n.t('pages.characterEdit.phonePlaceholder'),
      emailLabel: i18n.t('pages.characterEdit.emailLabel'),
      emailPlaceholder: i18n.t('pages.characterEdit.emailPlaceholder'),
      wechatLabel: i18n.t('pages.characterEdit.wechatLabel'),
      wechatPlaceholder: i18n.t('pages.characterEdit.wechatPlaceholder'),
      qqLabel: i18n.t('pages.characterEdit.qqLabel'),
      qqPlaceholder: i18n.t('pages.characterEdit.qqPlaceholder'),
      additionalInfo: i18n.t('pages.characterEdit.additionalInfo'),
      tagsLabel: i18n.t('pages.characterEdit.tagsLabel'),
      tagsPlaceholder: i18n.t('pages.characterEdit.tagsPlaceholder'),
      groupLabel: i18n.t('pages.characterEdit.groupLabel'),
      groupPlaceholder: i18n.t('pages.characterEdit.groupPlaceholder'),
      notesLabel: i18n.t('pages.characterEdit.notesLabel'),
      notesPlaceholder: i18n.t('pages.characterEdit.notesPlaceholder'),
      avatarLabel: i18n.t('pages.characterEdit.avatarLabel'),
      uploadAvatar: i18n.t('pages.characterEdit.uploadAvatar'),
      changeAvatar: i18n.t('pages.characterEdit.changeAvatar'),
      submitButton: i18n.t('pages.characterEdit.submitButton'),
      cancelButton: i18n.t('pages.characterEdit.cancelButton'),
      saveSuccess: i18n.t('pages.characterEdit.saveSuccess'),
      saveFailed: i18n.t('pages.characterEdit.saveFailed'),
      invalidPhone: i18n.t('pages.characterEdit.invalidPhone'),
      invalidEmail: i18n.t('pages.characterEdit.invalidEmail'),
      confirmCancelTitle: i18n.t('pages.characterEdit.confirmCancelTitle'),
      confirmCancelContent: i18n.t('pages.characterEdit.confirmCancelContent'),
      male: i18n.t('character.gender.male'),
      female: i18n.t('character.gender.female'),
      unknown: i18n.t('character.gender.unknown')
    };

    const genderOptions = [
      { label: t.male, value: 'male' },
      { label: t.female, value: 'female' },
      { label: t.unknown, value: 'unknown' }
    ];

    this.setData({ t, genderOptions });
  },

  async loadCharacter(id) {
    try {
      const character = await characterService.getCharacterById(id);
      
      if (!character) {
        wx.showToast({
          title: i18n.t('pages.characterDetail.notFound'),
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
        return;
      }

      // Populate form with character data
      const formData = {
        name: character.nameFields?.fullName || character.name || '',
        alias: character.nameFields?.alias || '',
        gender: character.immutableAttributes?.gender || '',
        birthday: character.birthday?.gregorian || null,
        avatarUrl: character.avatarUrl || '',
        contacts: {
          phone: character.contacts?.phone || '',
          email: character.contacts?.email || '',
          im: {
            wechat: character.contacts?.im?.wechat || '',
            qq: character.contacts?.im?.qq || ''
          }
        },
        tags: Array.isArray(character.tags) ? character.tags.join(', ') : '',
        group: character.group || '',
        notes: character.notes || ''
      };

      this.setData({ formData });
    } catch (error) {
      console.error('Failed to load character:', error);
      wx.showToast({
        title: this.data.t.saveFailed,
        icon: 'none'
      });
    }
  },

  // Form field handlers
  onNameInput(e) {
    this.setData({
      'formData.name': e.detail.value,
      hasChanges: true
    });
  },

  onAliasInput(e) {
    this.setData({
      'formData.alias': e.detail.value,
      hasChanges: true
    });
  },

  onGenderChange(e) {
    this.setData({
      'formData.gender': e.detail.value,
      hasChanges: true
    });
  },

  onBirthdayChange(e) {
    this.setData({
      'formData.birthday': e.detail.value,
      hasChanges: true
    });
  },

  onPhoneInput(e) {
    this.setData({
      'formData.contacts.phone': e.detail.value,
      hasChanges: true
    });
  },

  onEmailInput(e) {
    this.setData({
      'formData.contacts.email': e.detail.value,
      hasChanges: true
    });
  },

  onWechatInput(e) {
    this.setData({
      'formData.contacts.im.wechat': e.detail.value,
      hasChanges: true
    });
  },

  onQQInput(e) {
    this.setData({
      'formData.contacts.im.qq': e.detail.value,
      hasChanges: true
    });
  },

  onTagsInput(e) {
    this.setData({
      'formData.tags': e.detail.value,
      hasChanges: true
    });
  },

  onGroupInput(e) {
    this.setData({
      'formData.group': e.detail.value,
      hasChanges: true
    });
  },

  onNotesInput(e) {
    this.setData({
      'formData.notes': e.detail.value,
      hasChanges: true
    });
  },

  // Avatar upload
  onChooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          'formData.avatarUrl': tempFilePath,
          hasChanges: true
        });
      }
    });
  },

  // Validation
  validateForm() {
    const { formData, t } = this.data;
    
    // Required: name
    if (!formData.name || formData.name.trim() === '') {
      wx.showToast({
        title: t.nameRequired,
        icon: 'none'
      });
      return false;
    }

    // Required: gender
    if (!formData.gender) {
      wx.showToast({
        title: t.genderRequired,
        icon: 'none'
      });
      return false;
    }

    // Validate phone if provided
    if (formData.contacts.phone && !validators.isValidPhone(formData.contacts.phone)) {
      wx.showToast({
        title: t.invalidPhone,
        icon: 'none'
      });
      return false;
    }

    // Validate email if provided
    if (formData.contacts.email && !validators.isValidEmail(formData.contacts.email)) {
      wx.showToast({
        title: t.invalidEmail,
        icon: 'none'
      });
      return false;
    }

    return true;
  },

  // Submit form
  async onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    if (this.data.isSubmitting) {
      return;
    }

    this.setData({ isSubmitting: true });

    try {
      const { formData, mode, characterId } = this.data;
      
      // Parse tags
      const tags = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      // Prepare character data
      const characterData = {
        name: formData.name.trim(),
        nameFields: {
          fullName: formData.name.trim(),
          alias: formData.alias.trim() || undefined
        },
        immutableAttributes: {
          gender: formData.gender
        },
        birthday: formData.birthday ? {
          gregorian: formData.birthday,
          type: 'gregorian'
        } : undefined,
        avatarUrl: formData.avatarUrl || undefined,
        contacts: {
          phone: formData.contacts.phone.trim() || undefined,
          email: formData.contacts.email.trim() || undefined,
          im: {
            wechat: formData.contacts.im.wechat.trim() || undefined,
            qq: formData.contacts.im.qq.trim() || undefined
          }
        },
        tags: tags.length > 0 ? tags : undefined,
        group: formData.group.trim() || undefined,
        notes: formData.notes.trim() || undefined
      };

      if (mode === 'create') {
        await characterService.createCharacter(characterData);
      } else {
        await characterService.updateCharacter(characterId, characterData);
      }

      wx.showToast({
        title: this.data.t.saveSuccess,
        icon: 'success'
      });

      this.setData({ hasChanges: false });

      // Navigate back after a short delay
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);

    } catch (error) {
      console.error('Failed to save character:', error);
      wx.showToast({
        title: this.data.t.saveFailed,
        icon: 'none'
      });
    } finally {
      this.setData({ isSubmitting: false });
    }
  },

  // Cancel
  onCancel() {
    if (this.data.hasChanges) {
      wx.showModal({
        title: this.data.t.confirmCancelTitle,
        content: this.data.t.confirmCancelContent,
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack();
          }
        }
      });
    } else {
      wx.navigateBack();
    }
  }
});
