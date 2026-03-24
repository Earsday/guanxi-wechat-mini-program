// utils/formatters.js - Data formatting utilities with i18n support

const i18n = require('./i18n.js');

/**
 * Format person name according to cultural context
 */
function formatPersonName(character, format = 'display') {
  if (!character) return '';

  const culturalContext = character.culturalContext || 'zh-CN';

  if (format === 'display') {
    // Use displayName if available
    if (character.displayName) {
      return character.displayName;
    }

    // Generate from nameFields
    if (character.nameFields) {
      return generateDisplayName(character.nameFields, culturalContext);
    }

    // Fallback to name field
    return character.name || '';
  }

  if (format === 'formal') {
    return formatFormalName(character, culturalContext);
  }

  if (format === 'full') {
    return formatFullName(character, culturalContext);
  }

  return character.name || '';
}

/**
 * Generate display name from nameFields
 */
function generateDisplayName(nameFields, culturalContext) {
  switch (culturalContext) {
    case 'zh-CN':
      return `${nameFields.lastName || ''}${nameFields.firstName || ''}`.trim();
    
    case 'ja-JP':
      return `${nameFields.lastNameJapanese || ''} ${nameFields.firstNameJapanese || ''}`.trim();
    
    case 'en-US':
    default:
      const parts = [
        nameFields.firstNameWestern,
        nameFields.middleNameWestern,
        nameFields.lastNameWestern
      ].filter(p => p);
      return parts.join(' ');
  }
}

/**
 * Format formal name (with honorifics)
 */
function formatFormalName(character, culturalContext) {
  const baseName = formatPersonName(character, 'display');

  switch (culturalContext) {
    case 'zh-CN':
      return character.gender === 'male' ? `${baseName}先生` : `${baseName}女士`;
    
    case 'ja-JP':
      return `${baseName}さん`;
    
    case 'en-US':
    default:
      return character.gender === 'male' ? `Mr. ${baseName}` : `Ms. ${baseName}`;
  }
}

/**
 * Format full name (all components)
 */
function formatFullName(character, culturalContext) {
  if (!character.nameFields) {
    return character.name || '';
  }

  const fields = character.nameFields;

  switch (culturalContext) {
    case 'zh-CN':
      return `${fields.lastName || ''}${fields.firstName || ''}`;
    
    case 'ja-JP':
      return `${fields.lastNameJapanese || ''} ${fields.firstNameJapanese || ''}`.trim();
    
    case 'en-US':
    default:
      return [
        fields.firstNameWestern,
        fields.middleNameWestern,
        fields.lastNameWestern
      ].filter(p => p).join(' ');
  }
}

/**
 * Format date according to locale
 */
function formatDate(date, format = 'short') {
  if (!date) return '';

  const locale = i18n.getLocale();
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return date.toString();
  }

  switch (format) {
    case 'short':
      return formatShortDate(dateObj, locale);
    
    case 'long':
      return formatLongDate(dateObj, locale);
    
    case 'full':
      return formatFullDate(dateObj, locale);
    
    case 'relative':
      return formatRelativeDate(dateObj, locale);
    
    default:
      return formatShortDate(dateObj, locale);
  }
}

/**
 * Format short date (2026-03-23)
 */
function formatShortDate(date, locale) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  switch (locale) {
    case 'en-US':
      return `${month}/${day}/${year}`;
    
    case 'ja-JP':
      return `${year}年${parseInt(month)}月${parseInt(day)}日`;
    
    case 'zh-CN':
    default:
      return `${year}-${month}-${day}`;
  }
}

/**
 * Format long date (2026年3月23日)
 */
function formatLongDate(date, locale) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  switch (locale) {
    case 'en-US':
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
      return `${monthNames[date.getMonth()]} ${day}, ${year}`;
    
    case 'ja-JP':
      return `${year}年${month}月${day}日`;
    
    case 'zh-CN':
    default:
      return `${year}年${month}月${day}日`;
  }
}

/**
 * Format full date with day of week
 */
function formatFullDate(date, locale) {
  const longDate = formatLongDate(date, locale);
  const dayOfWeek = formatDayOfWeek(date, locale);

  switch (locale) {
    case 'en-US':
      return `${dayOfWeek}, ${longDate}`;
    
    case 'ja-JP':
    case 'zh-CN':
    default:
      return `${longDate} ${dayOfWeek}`;
  }
}

/**
 * Format day of week
 */
function formatDayOfWeek(date, locale) {
  const day = date.getDay();

  switch (locale) {
    case 'en-US':
      const enDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return enDays[day];
    
    case 'ja-JP':
      const jaDays = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
      return jaDays[day];
    
    case 'zh-CN':
    default:
      const zhDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      return zhDays[day];
  }
}

/**
 * Format relative date (3 days ago, tomorrow, etc.)
 */
function formatRelativeDate(date, locale) {
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) {
    return i18n.t('time.justNow');
  }

  if (diffMinutes < 60) {
    return i18n.t('time.minutesAgo', { count: diffMinutes });
  }

  if (diffHours < 24) {
    return i18n.t('time.hoursAgo', { count: diffHours });
  }

  if (diffDays === 0) {
    return i18n.t('time.today');
  }

  if (diffDays === 1) {
    return i18n.t('time.yesterday');
  }

  if (diffDays < 7) {
    return i18n.t('time.daysAgo', { count: diffDays });
  }

  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return i18n.t('time.weeksAgo', { count: weeks });
  }

  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return i18n.t('time.monthsAgo', { count: months });
  }

  const years = Math.floor(diffDays / 365);
  return i18n.t('time.yearsAgo', { count: years });
}

/**
 * Format time (HH:MM)
 */
function formatTime(date, format = '24h') {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');

  if (format === '12h') {
    const displayHours = hours % 12 || 12;
    const period = hours < 12 ? 'AM' : 'PM';
    return `${displayHours}:${minutes} ${period}`;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

/**
 * Format datetime
 */
function formatDateTime(date, dateFormat = 'short', timeFormat = '24h') {
  if (!date) return '';

  const formattedDate = formatDate(date, dateFormat);
  const formattedTime = formatTime(date, timeFormat);

  return `${formattedDate} ${formattedTime}`;
}

/**
 * Format phone number according to locale
 */
function formatPhoneNumber(phone, locale = null) {
  if (!phone) return '';

  locale = locale || i18n.getLocale();
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  switch (locale) {
    case 'zh-CN':
      // Format Chinese phone: +86 138 1234 5678
      if (digits.length === 11) {
        return `${digits.substr(0, 3)} ${digits.substr(3, 4)} ${digits.substr(7)}`;
      }
      return phone;
    
    case 'en-US':
      // Format US phone: (123) 456-7890
      if (digits.length === 10) {
        return `(${digits.substr(0, 3)}) ${digits.substr(3, 3)}-${digits.substr(6)}`;
      }
      return phone;
    
    case 'ja-JP':
      // Format Japanese phone: 03-1234-5678
      if (digits.length === 10) {
        return `${digits.substr(0, 2)}-${digits.substr(2, 4)}-${digits.substr(6)}`;
      }
      return phone;
    
    default:
      return phone;
  }
}

/**
 * Format address according to locale
 */
function formatAddress(address, locale = null) {
  if (!address || typeof address !== 'object') return '';

  locale = locale || i18n.getLocale();

  switch (locale) {
    case 'zh-CN':
      // Chinese format: 国家 省 市 详细地址
      return [
        address.country,
        address.province,
        address.city,
        address.address
      ].filter(p => p).join(' ');
    
    case 'en-US':
      // US format: Address, City, Province, Country Postal
      return [
        address.address,
        [address.city, address.province].filter(p => p).join(', '),
        [address.country, address.postalCode].filter(p => p).join(' ')
      ].filter(p => p).join(', ');
    
    case 'ja-JP':
      // Japanese format: 〒Postal 国家 省 市 詳細住所
      return [
        address.postalCode ? `〒${address.postalCode}` : '',
        address.country,
        address.province,
        address.city,
        address.address
      ].filter(p => p).join(' ');
    
    default:
      return address.address || '';
  }
}

/**
 * Truncate text with ellipsis
 */
function truncate(text, maxLength, suffix = '...') {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
}

module.exports = {
  formatPersonName,
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeDate,
  formatPhoneNumber,
  formatAddress,
  truncate,
  formatFileSize
};
