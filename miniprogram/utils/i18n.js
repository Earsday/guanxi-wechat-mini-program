// utils/i18n.js - Internationalization framework

const DEFAULT_LOCALE = 'zh-CN';
const SUPPORTED_LOCALES = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR'];

let currentLocale = DEFAULT_LOCALE;
let translations = {};

/**
 * Initialize i18n system
 */
function init(locale = null) {
  // Get locale from storage or system
  if (!locale) {
    try {
      const stored = wx.getStorageSync('app_locale');
      locale = stored || getSystemLocale();
    } catch (error) {
      locale = getSystemLocale();
    }
  }

  setLocale(locale);
  loadTranslations(locale);
}

/**
 * Get system locale
 */
function getSystemLocale() {
  try {
    const systemInfo = wx.getSystemInfoSync();
    const language = systemInfo.language || 'zh_CN';
    
    // Convert system format to our format
    const normalized = language.replace('_', '-');
    
    // Check if supported
    if (SUPPORTED_LOCALES.includes(normalized)) {
      return normalized;
    }
    
    // Try language code only
    const langCode = normalized.split('-')[0];
    const matched = SUPPORTED_LOCALES.find(l => l.startsWith(langCode));
    
    return matched || DEFAULT_LOCALE;
  } catch (error) {
    return DEFAULT_LOCALE;
  }
}

/**
 * Set current locale
 */
function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) {
    console.warn(`Unsupported locale: ${locale}, falling back to ${DEFAULT_LOCALE}`);
    locale = DEFAULT_LOCALE;
  }

  currentLocale = locale;

  // Save to storage
  try {
    wx.setStorageSync('app_locale', locale);
  } catch (error) {
    console.error('Failed to save locale:', error);
  }

  // Load translations
  loadTranslations(locale);

  // Emit locale change event
  const eventBus = require('./eventBus.js');
  eventBus.emit('locale:changed', locale);
}

/**
 * Get current locale
 */
function getLocale() {
  return currentLocale;
}

/**
 * Load translations for locale
 */
function loadTranslations(locale) {
  try {
    // Dynamic require based on locale
    switch (locale) {
      case 'zh-CN':
        translations = require('../locales/zh-CN.js');
        break;
      case 'zh-TW':
        translations = require('../locales/zh-TW.js');
        break;
      case 'en-US':
        translations = require('../locales/en-US.js');
        break;
      case 'ja-JP':
        translations = require('../locales/ja-JP.js');
        break;
      case 'ko-KR':
        translations = require('../locales/ko-KR.js');
        break;
      default:
        translations = require('../locales/zh-CN.js');
    }
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
    // Fallback to Chinese
    try {
      translations = require('../locales/zh-CN.js');
    } catch (fallbackError) {
      console.error('Failed to load fallback translations:', fallbackError);
      translations = {};
    }
  }
}

/**
 * Translate a key
 * @param {string} key - Translation key (e.g., 'common.save')
 * @param {object} params - Parameters for interpolation
 * @returns {string} - Translated string
 */
function t(key, params = {}) {
  if (!key) return '';

  // Get translation by key path
  const translation = getNestedValue(translations, key);

  if (!translation) {
    console.warn(`Missing translation for key: ${key}`);
    return key; // Return key itself if translation not found
  }

  // Interpolate parameters
  return interpolate(translation, params);
}

/**
 * Get nested value from object by dot-separated path
 */
function getNestedValue(obj, path) {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return null;
    }
  }

  return current;
}

/**
 * Interpolate parameters into translation string
 * Supports {param} syntax
 */
function interpolate(template, params) {
  if (typeof template !== 'string') {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params.hasOwnProperty(key) ? params[key] : match;
  });
}

/**
 * Translate with pluralization
 * @param {string} key - Base translation key
 * @param {number} count - Count for pluralization
 * @param {object} params - Additional parameters
 */
function tn(key, count, params = {}) {
  // Simple pluralization logic
  const pluralKey = count === 1 ? `${key}.one` : `${key}.other`;
  const translation = t(pluralKey, { ...params, count });

  // Fallback to base key if plural form not found
  if (translation === pluralKey) {
    return t(key, { ...params, count });
  }

  return translation;
}

/**
 * Check if locale is RTL (Right-to-Left)
 */
function isRTL() {
  // None of our supported locales are RTL, but include for completeness
  const rtlLocales = ['ar', 'he', 'fa', 'ur'];
  const langCode = currentLocale.split('-')[0];
  return rtlLocales.includes(langCode);
}

/**
 * Get all supported locales
 */
function getSupportedLocales() {
  return SUPPORTED_LOCALES.map(locale => ({
    code: locale,
    name: getLocaleName(locale),
    nativeName: getLocaleNativeName(locale)
  }));
}

/**
 * Get locale name in current language
 */
function getLocaleName(locale) {
  const names = {
    'zh-CN': t('locale.zhCN') || '简体中文',
    'zh-TW': t('locale.zhTW') || '繁體中文',
    'en-US': t('locale.enUS') || 'English',
    'ja-JP': t('locale.jaJP') || '日本語',
    'ko-KR': t('locale.koKR') || '한국어'
  };
  return names[locale] || locale;
}

/**
 * Get locale name in its native language
 */
function getLocaleNativeName(locale) {
  const nativeNames = {
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'en-US': 'English',
    'ja-JP': '日本語',
    'ko-KR': '한국어'
  };
  return nativeNames[locale] || locale;
}

/**
 * Format number according to locale
 */
function formatNumber(number, options = {}) {
  if (typeof number !== 'number') {
    return number;
  }

  // Simplified number formatting
  const decimals = options.decimals !== undefined ? options.decimals : 0;
  
  if (currentLocale === 'en-US') {
    // Use comma as thousands separator
    return number.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    // Use Chinese/Japanese conventions
    return number.toFixed(decimals);
  }
}

/**
 * Format currency according to locale
 */
function formatCurrency(amount, currency = 'CNY') {
  const symbols = {
    'CNY': '¥',
    'USD': '$',
    'EUR': '€',
    'JPY': '¥',
    'GBP': '£'
  };

  const symbol = symbols[currency] || currency;
  const formatted = formatNumber(amount, { decimals: 2 });

  if (currentLocale === 'zh-CN' || currentLocale === 'zh-TW' || currentLocale === 'ja-JP' || currentLocale === 'ko-KR') {
    return `${symbol}${formatted}`;
  } else {
    return `${symbol}${formatted}`;
  }
}

module.exports = {
  init,
  setLocale,
  getLocale,
  t,
  tn,
  isRTL,
  getSupportedLocales,
  formatNumber,
  formatCurrency,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE
};
