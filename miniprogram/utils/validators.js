// utils/validators.js - Input validation and sanitization

const i18n = require('./i18n.js');

/**
 * Validate email format
 */
function validateEmail(email) {
  if (!email) {
    return { valid: false, message: i18n.t('validation.required') };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: i18n.t('validation.invalidEmail') };
  }

  return { valid: true };
}

/**
 * Validate phone number (supports multiple formats)
 */
function validatePhone(phone, locale = null) {
  if (!phone) {
    return { valid: false, message: i18n.t('validation.required') };
  }

  locale = locale || i18n.getLocale();
  
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '');

  switch (locale) {
    case 'zh-CN':
      // Chinese mobile: 11 digits starting with 1
      if (!/^1\d{10}$/.test(cleaned)) {
        return { valid: false, message: i18n.t('validation.invalidPhone') };
      }
      break;
    
    case 'en-US':
      // US phone: 10 digits
      if (!/^\d{10}$/.test(cleaned)) {
        return { valid: false, message: i18n.t('validation.invalidPhone') };
      }
      break;
    
    case 'ja-JP':
      // Japanese phone: 10-11 digits
      if (!/^\d{10,11}$/.test(cleaned)) {
        return { valid: false, message: i18n.t('validation.invalidPhone') };
      }
      break;
    
    default:
      // Generic: 7-15 digits
      if (!/^\d{7,15}$/.test(cleaned)) {
        return { valid: false, message: i18n.t('validation.invalidPhone') };
      }
  }

  return { valid: true };
}

/**
 * Validate required field
 */
function validateRequired(value, fieldName = 'field') {
  if (value === null || value === undefined || value === '') {
    return { 
      valid: false, 
      message: i18n.t('validation.required')
    };
  }

  return { valid: true };
}

/**
 * Validate string length
 */
function validateLength(value, options = {}) {
  if (!value) return { valid: true }; // Use validateRequired separately

  const length = value.length;

  if (options.min && length < options.min) {
    return {
      valid: false,
      message: i18n.t('validation.minLength', { min: options.min })
    };
  }

  if (options.max && length > options.max) {
    return {
      valid: false,
      message: i18n.t('validation.maxLength', { max: options.max })
    };
  }

  return { valid: true };
}

/**
 * Validate date format (YYYY-MM-DD)
 */
function validateDate(dateStr) {
  if (!dateStr) {
    return { valid: false, message: i18n.t('validation.required') };
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!dateRegex.test(dateStr)) {
    return { valid: false, message: 'Invalid date format. Use YYYY-MM-DD' };
  }

  const date = new Date(dateStr);
  
  if (isNaN(date.getTime())) {
    return { valid: false, message: 'Invalid date' };
  }

  return { valid: true };
}

/**
 * Validate URL format
 */
function validateURL(url) {
  if (!url) {
    return { valid: false, message: i18n.t('validation.required') };
  }

  try {
    new URL(url);
    return { valid: true };
  } catch (error) {
    return { valid: false, message: 'Invalid URL format' };
  }
}

/**
 * Validate enum value
 */
function validateEnum(value, allowedValues) {
  if (!allowedValues.includes(value)) {
    return {
      valid: false,
      message: `Value must be one of: ${allowedValues.join(', ')}`
    };
  }

  return { valid: true };
}

/**
 * Sanitize string (remove HTML tags, trim)
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;

  // Remove HTML tags
  let cleaned = str.replace(/<[^>]*>/g, '');
  
  // Remove control characters
  cleaned = cleaned.replace(/[\x00-\x1F\x7F]/g, '');
  
  // Trim whitespace
  cleaned = cleaned.trim();

  return cleaned;
}

/**
 * Sanitize HTML (allow only safe tags)
 */
function sanitizeHTML(html) {
  if (typeof html !== 'string') return html;

  // For WeChat mini-program, we typically don't allow HTML
  // Remove all tags
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Escape special characters for SQL-like queries
 */
function escapeSQLLike(str) {
  if (typeof str !== 'string') return str;

  return str
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');
}

/**
 * Validate character data
 */
function validateCharacter(data) {
  const errors = [];

  // Name or displayName required
  if (!data.name && !data.displayName) {
    errors.push({
      field: 'name',
      message: 'Name or display name is required'
    });
  }

  // Name length
  if (data.name) {
    const lengthCheck = validateLength(data.name, { max: 50 });
    if (!lengthCheck.valid) {
      errors.push({ field: 'name', message: lengthCheck.message });
    }
  }

  // Gender validation
  if (data.gender) {
    const validGenders = ['male', 'female', 'other', 'non_binary', 'prefer_not_to_say'];
    const genderCheck = validateEnum(data.gender, validGenders);
    if (!genderCheck.valid) {
      errors.push({ field: 'gender', message: genderCheck.message });
    }
  }

  // Birthday validation
  if (data.birthday?.solar) {
    const dateCheck = validateDate(data.birthday.solar);
    if (!dateCheck.valid) {
      errors.push({ field: 'birthday', message: dateCheck.message });
    }
  }

  // Phone validation
  if (data.contacts?.phones) {
    data.contacts.phones.forEach((phone, index) => {
      if (phone.number) {
        const phoneCheck = validatePhone(phone.number);
        if (!phoneCheck.valid) {
          errors.push({
            field: `contacts.phones[${index}]`,
            message: phoneCheck.message
          });
        }
      }
    });
  }

  // Email validation
  if (data.contacts?.emails) {
    data.contacts.emails.forEach((email, index) => {
      if (email.address) {
        const emailCheck = validateEmail(email.address);
        if (!emailCheck.valid) {
          errors.push({
            field: `contacts.emails[${index}]`,
            message: emailCheck.message
          });
        }
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate relationship data
 */
function validateGuanxi(data) {
  const errors = [];

  // Required fields
  if (!data.fromCharacterId) {
    errors.push({
      field: 'fromCharacterId',
      message: i18n.t('validation.required')
    });
  }

  if (!data.toCharacterId) {
    errors.push({
      field: 'toCharacterId',
      message: i18n.t('validation.required')
    });
  }

  if (!data.typeId) {
    errors.push({
      field: 'typeId',
      message: i18n.t('validation.required')
    });
  }

  // Validate periods if present
  if (data.periods && Array.isArray(data.periods)) {
    data.periods.forEach((period, index) => {
      if (period.startTime) {
        const startCheck = validateDate(period.startTime);
        if (!startCheck.valid) {
          errors.push({
            field: `periods[${index}].startTime`,
            message: startCheck.message
          });
        }
      }

      if (period.endTime) {
        const endCheck = validateDate(period.endTime);
        if (!endCheck.valid) {
          errors.push({
            field: `periods[${index}].endTime`,
            message: endCheck.message
          });
        }

        // End time should be after start time
        if (period.startTime && period.endTime <= period.startTime) {
          errors.push({
            field: `periods[${index}].endTime`,
            message: 'End time must be after start time'
          });
        }
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate form data against field definition
 */
function validateFormField(value, fieldDef) {
  const errors = [];

  // Required check
  if (fieldDef.required) {
    const requiredCheck = validateRequired(value);
    if (!requiredCheck.valid) {
      errors.push(requiredCheck.message);
    }
  }

  // Skip other validations if empty and not required
  if (!value && !fieldDef.required) {
    return { valid: true, errors: [] };
  }

  // Type-specific validation
  switch (fieldDef.type) {
    case 'string':
    case 'text':
      if (fieldDef.validation) {
        const lengthCheck = validateLength(value, {
          min: fieldDef.validation.min,
          max: fieldDef.validation.max
        });
        if (!lengthCheck.valid) {
          errors.push(lengthCheck.message);
        }
      }
      break;

    case 'email':
      const emailCheck = validateEmail(value);
      if (!emailCheck.valid) {
        errors.push(emailCheck.message);
      }
      break;

    case 'phone':
      const phoneCheck = validatePhone(value);
      if (!phoneCheck.valid) {
        errors.push(phoneCheck.message);
      }
      break;

    case 'date':
      const dateCheck = validateDate(value);
      if (!dateCheck.valid) {
        errors.push(dateCheck.message);
      }
      break;

    case 'select':
      if (fieldDef.options) {
        const validValues = fieldDef.options.map(opt => opt.value);
        const enumCheck = validateEnum(value, validValues);
        if (!enumCheck.valid) {
          errors.push(enumCheck.message);
        }
      }
      break;

    case 'multiSelect':
      if (Array.isArray(value) && fieldDef.options) {
        const validValues = fieldDef.options.map(opt => opt.value);
        value.forEach(v => {
          if (!validValues.includes(v)) {
            errors.push(`Invalid value: ${v}`);
          }
        });
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Batch validate object against schema
 */
function validate(data, schema) {
  const errors = {};

  Object.keys(schema).forEach(key => {
    const fieldDef = schema[key];
    const value = data[key];
    const result = validateFormField(value, fieldDef);

    if (!result.valid) {
      errors[key] = result.errors;
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

module.exports = {
  validateEmail,
  validatePhone,
  validateRequired,
  validateLength,
  validateDate,
  validateURL,
  validateEnum,
  sanitizeString,
  sanitizeHTML,
  escapeSQLLike,
  validateCharacter,
  validateGuanxi,
  validateFormField,
  validate
};
