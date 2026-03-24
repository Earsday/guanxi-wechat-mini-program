// components/character-picker/character-picker.js
const characterService = require('../../services/characterService.js');
const i18n = require('../../utils/i18n.js');
const formatters = require('../../utils/formatters.js');

Component({
  properties: {
    // 选择模式: 'single' 单选, 'multiple' 多选
    mode: {
      type: String,
      value: 'single'
    },
    // 已选中的值 (单选: String, 多选: Array)
    value: {
      type: null,
      value: null,
      observer: function(newVal) {
        this.updateSelectedCharacters(newVal);
      }
    },
    // 排除的人物ID列表
    excludeIds: {
      type: Array,
      value: []
    },
    // 是否显示
    visible: {
      type: Boolean,
      value: false
    }
  },

  data: {
    characters: [],
    filteredCharacters: [],
    selectedIds: [],
    searchKeyword: '',
    loading: false,
    t: {}
  },

  lifetimes: {
    attached() {
      this.setI18nMessages();
      this.loadCharacters();
    }
  },

  methods: {
    setI18nMessages() {
      this.setData({
        t: i18n.getMessages()
      });
    },

    async loadCharacters() {
      this.setData({ loading: true });
      
      try {
        const result = await characterService.queryCharacters({}, { field: 'name', order: 'asc' });
        
        // 过滤掉排除的人物
        const characters = result.data.filter(char => 
          !this.properties.excludeIds.includes(char.id)
        );
        
        this.setData({
          characters,
          filteredCharacters: characters,
          loading: false
        });
      } catch (error) {
        console.error('Failed to load characters:', error);
        this.setData({ loading: false });
        wx.showToast({
          title: this.data.t.common?.loadFailed || '加载失败',
          icon: 'none'
        });
      }
    },

    updateSelectedCharacters(value) {
      let selectedIds = [];
      
      if (this.properties.mode === 'single') {
        selectedIds = value ? [value] : [];
      } else {
        selectedIds = Array.isArray(value) ? value : [];
      }
      
      this.setData({ selectedIds });
    },

    onSearch(e) {
      const keyword = e.detail.value.trim().toLowerCase();
      this.setData({ searchKeyword: keyword });
      
      if (!keyword) {
        this.setData({ filteredCharacters: this.data.characters });
        return;
      }
      
      const filtered = this.data.characters.filter(char => {
        const name = formatters.formatName(char.nameFields).toLowerCase();
        const displayName = (char.nameFields?.displayName || '').toLowerCase();
        return name.includes(keyword) || displayName.includes(keyword);
      });
      
      this.setData({ filteredCharacters: filtered });
    },

    onCharacterTap(e) {
      const { id } = e.currentTarget.dataset;
      
      if (this.properties.mode === 'single') {
        // 单选模式
        this.triggerEvent('change', { value: id });
        this.triggerEvent('close');
      } else {
        // 多选模式
        const selectedIds = [...this.data.selectedIds];
        const index = selectedIds.indexOf(id);
        
        if (index > -1) {
          selectedIds.splice(index, 1);
        } else {
          selectedIds.push(id);
        }
        
        this.setData({ selectedIds });
      }
    },

    onConfirm() {
      if (this.properties.mode === 'multiple') {
        this.triggerEvent('change', { value: this.data.selectedIds });
      }
      this.triggerEvent('close');
    },

    onCancel() {
      this.triggerEvent('close');
    },

    onMaskTap() {
      this.triggerEvent('close');
    },

    // 判断人物是否已选中
    isSelected(characterId) {
      return this.data.selectedIds.includes(characterId);
    },

    // 格式化人物显示名称
    formatCharacterName(character) {
      return formatters.formatName(character.nameFields);
    },

    // 格式化人物年龄
    formatCharacterAge(character) {
      if (!character.birthday?.date) return '';
      const age = formatters.calculateAge(character.birthday.date);
      return age ? `${age}${this.data.t.pages?.characterList?.ageUnit || '岁'}` : '';
    }
  }
});
