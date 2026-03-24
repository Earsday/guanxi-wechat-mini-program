// components/dynamic-form/dynamic-form.js
// Dynamic form component that renders fields based on type definition

const typeService = require('../../services/typeService.js');
const i18n = require('../../utils/i18n.js');

Component({
  /**
   * Component properties
   */
  properties: {
    // Relationship type ID to load field definitions
    typeId: {
      type: String,
      value: '',
      observer: function(newVal) {
        if (newVal) {
          this.loadTypeFields(newVal);
        }
      }
    },

    // Initial form values
    value: {
      type: Object,
      value: {},
      observer: function(newVal) {
        if (newVal && Object.keys(newVal).length > 0) {
          this.setData({ formData: { ...newVal } });
        }
      }
    },

    // Read-only mode
    readonly: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component data
   */
  data: {
    fields: [],
    formData: {},
    errors: {},
    t: {},
    currentLocale: '',
    loading: false
  },

  /**
   * Component lifecycle
   */
  lifetimes: {
    attached() {
      this.setI18nMessages();
    }
  },

  /**
   * Component methods
   */
  methods: {
    /**
     * Load i18n messages
     */
    setI18nMessages() {
      const locale = i18n.getLocale();
      const messages = i18n.getMessages();
      this.setData({
        t: messages,
        currentLocale: locale
      });
    },

    /**
     * Load field definitions from type
     */
    async loadTypeFields(typeId) {
      try {
        this.setData({ loading: true });

        const typeDefinition = await typeService.getTypeById(typeId);
        
        if (typeDefinition && typeDefinition.fields) {
          // Sort fields by displayOrder
          const sortedFields = typeDefinition.fields.sort((a, b) => {
            return (a.displayOrder || 999) - (b.displayOrder || 999);
          });

          this.setData({ fields: sortedFields });

          // Initialize form data with default values if no initial value provided
          if (Object.keys(this.data.formData).length === 0) {
            this.initFormData(sortedFields);
          }
        }

        this.setData({ loading: false });
      } catch (error) {
        console.error('Failed to load type fields:', error);
        this.setData({ loading: false });
        wx.showToast({
          title: this.data.t.messages?.loadFailed || 'Failed to load',
          icon: 'none'
        });
      }
    },

    /**
     * Initialize form with default values
     */
    initFormData(fields) {
      const formData = {};
      fields.forEach(field => {
        if (field.defaultValue !== undefined && field.defaultValue !== null) {
          formData[field.name] = field.defaultValue;
        } else {
          // Set empty default based on field type
          switch (field.type) {
            case 'string':
            case 'text':
              formData[field.name] = '';
              break;
            case 'number':
              formData[field.name] = null;
              break;
            case 'boolean':
              formData[field.name] = false;
              break;
            case 'select':
              formData[field.name] = '';
              break;
            case 'multiSelect':
              formData[field.name] = [];
              break;
            case 'date':
            case 'datetime':
              formData[field.name] = '';
              break;
            default:
              formData[field.name] = null;
          }
        }
      });
      this.setData({ formData });
    },

    /**
     * Handle input field change
     */
    onInputChange(e) {
      const { field } = e.currentTarget.dataset;
      const value = e.detail.value;
      this.updateFieldValue(field, value);
    },

    /**
     * Handle number input change
     */
    onNumberChange(e) {
      const { field } = e.currentTarget.dataset;
      const value = e.detail.value ? Number(e.detail.value) : null;
      this.updateFieldValue(field, value);
    },

    /**
     * Handle switch/boolean change
     */
    onSwitchChange(e) {
      const { field } = e.currentTarget.dataset;
      const value = e.detail.value;
      this.updateFieldValue(field, value);
    },

    /**
     * Handle select/picker change
     */
    onPickerChange(e) {
      const { field } = e.currentTarget.dataset;
      const fieldDef = this.data.fields.find(f => f.name === field);
      if (fieldDef && fieldDef.options) {
        const selectedOption = fieldDef.options[e.detail.value];
        this.updateFieldValue(field, selectedOption?.value || '');
      }
    },

    /**
     * Handle multi-select checkbox change
     */
    onCheckboxChange(e) {
      const { field } = e.currentTarget.dataset;
      const values = e.detail.value;
      this.updateFieldValue(field, values);
    },

    /**
     * Handle date picker change
     */
    onDateChange(e) {
      const { field } = e.currentTarget.dataset;
      const value = e.detail.value;
      this.updateFieldValue(field, value);
    },

    /**
     * Update field value and validate
     */
    updateFieldValue(fieldName, value) {
      const formData = { ...this.data.formData };
      formData[fieldName] = value;
      
      this.setData({ formData });

      // Clear error for this field
      const errors = { ...this.data.errors };
      delete errors[fieldName];
      this.setData({ errors });

      // Trigger change event
      this.triggerEvent('change', {
        field: fieldName,
        value: value,
        formData: formData
      });
    },

    /**
     * Get translated field label
     */
    getFieldLabel(field) {
      const locale = this.data.currentLocale;
      const typeId = this.properties.typeId;
      
      // Try to get from i18n
      const i18nKey = `guanxiType.${typeId}.fields.${field.name}.label`;
      const i18nLabel = i18n.t(i18nKey);
      
      if (i18nLabel && i18nLabel !== i18nKey) {
        return i18nLabel;
      }
      
      // Fallback to field.label
      return field.label || field.name;
    },

    /**
     * Get translated option label
     */
    getOptionLabel(field, option) {
      const locale = this.data.currentLocale;
      const typeId = this.properties.typeId;
      
      // Try to get from i18n
      const i18nKey = `guanxiType.${typeId}.fields.${field.name}.options.${option.value}`;
      const i18nLabel = i18n.t(i18nKey);
      
      if (i18nLabel && i18nLabel !== i18nKey) {
        return i18nLabel;
      }
      
      // Fallback to option.label
      return option.label || option.value;
    },

    /**
     * Get selected index for picker
     */
    getSelectedIndex(field) {
      const value = this.data.formData[field.name];
      if (!field.options) return 0;
      
      const index = field.options.findIndex(opt => opt.value === value);
      return index >= 0 ? index : 0;
    },

    /**
     * Get display value for readonly select
     */
    getSelectDisplayValue(field) {
      const value = this.data.formData[field.name];
      if (!field.options || !value) return '';
      
      const option = field.options.find(opt => opt.value === value);
      return option ? this.getOptionLabel(field, option) : value;
    },

    /**
     * Validate all fields
     */
    validate() {
      const errors = {};
      let isValid = true;

      this.data.fields.forEach(field => {
        const value = this.data.formData[field.name];
        const validation = field.validation || {};

        // Required validation
        if (validation.required) {
          if (value === null || value === undefined || value === '' || 
              (Array.isArray(value) && value.length === 0)) {
            errors[field.name] = this.data.t.validation?.required || 'This field is required';
            isValid = false;
          }
        }

        // Min/Max validation for numbers
        if (field.type === 'number' && value !== null && value !== undefined) {
          if (validation.min !== undefined && value < validation.min) {
            errors[field.name] = `${this.data.t.validation?.minValue || 'Minimum value'}: ${validation.min}`;
            isValid = false;
          }
          if (validation.max !== undefined && value > validation.max) {
            errors[field.name] = `${this.data.t.validation?.maxValue || 'Maximum value'}: ${validation.max}`;
            isValid = false;
          }
        }

        // Pattern validation for strings
        if ((field.type === 'string' || field.type === 'text') && value && validation.pattern) {
          const regex = new RegExp(validation.pattern);
          if (!regex.test(value)) {
            errors[field.name] = validation.message || this.data.t.validation?.invalidFormat || 'Invalid format';
            isValid = false;
          }
        }

        // Min/Max length validation
        if ((field.type === 'string' || field.type === 'text') && value) {
          if (validation.minLength && value.length < validation.minLength) {
            errors[field.name] = `${this.data.t.validation?.minLength || 'Minimum length'}: ${validation.minLength}`;
            isValid = false;
          }
          if (validation.maxLength && value.length > validation.maxLength) {
            errors[field.name] = `${this.data.t.validation?.maxLength || 'Maximum length'}: ${validation.maxLength}`;
            isValid = false;
          }
        }
      });

      this.setData({ errors });
      return { isValid, errors };
    },

    /**
     * Get form data
     */
    getFormData() {
      return { ...this.data.formData };
    },

    /**
     * Reset form
     */
    reset() {
      this.initFormData(this.data.fields);
      this.setData({ errors: {} });
    },

    /**
     * Set form data
     */
    setFormData(data) {
      this.setData({ formData: { ...data } });
    }
  }
});
