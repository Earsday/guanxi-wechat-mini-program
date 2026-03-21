// services/typeService.js - Relationship type management

const storage = require('./storage.js');

// Cache for types with 5-minute expiry
let typeCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get all relationship types (with cache)
 */
async function getAllTypes() {
  const now = Date.now();

  // Return cached data if still valid
  if (typeCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
    console.log('Returning cached types');
    return typeCache;
  }

  // Load from storage
  const types = await storage.getAll(storage.STORAGE_KEYS.GUANXI_TYPES);

  // Filter active types and sort by priority
  const activeTypes = types
    .filter(type => type.isActive)
    .sort((a, b) => b.priority - a.priority);

  // Update cache
  typeCache = activeTypes;
  cacheTimestamp = now;

  return activeTypes;
}

/**
 * Get type by ID
 */
async function getTypeById(typeId) {
  const types = await getAllTypes();
  return types.find(type => type.id === typeId);
}

/**
 * Get types by category
 */
async function getTypesByCategory(category) {
  const types = await getAllTypes();
  return types.filter(type => type.category === category);
}

/**
 * Invalidate cache (call after type modifications)
 */
function invalidateCache() {
  typeCache = null;
  cacheTimestamp = null;
  console.log('Type cache invalidated');
}

/**
 * Generate form data structure from type definition
 */
function generateFormData(typeDefinition) {
  const formData = {};

  if (!typeDefinition || !typeDefinition.formFields) {
    return formData;
  }

  // Initialize with default values
  typeDefinition.formFields.forEach(field => {
    if (field.defaultValue !== undefined) {
      formData[field.key] = field.defaultValue;
    } else if (field.type === 'boolean') {
      formData[field.key] = false;
    } else {
      formData[field.key] = '';
    }
  });

  return formData;
}

/**
 * Validate form data against type definition
 */
function validateFormData(typeDefinition, formData) {
  const errors = [];

  if (!typeDefinition || !typeDefinition.formFields) {
    return { valid: true, errors: [] };
  }

  typeDefinition.formFields.forEach(field => {
    const value = formData[field.key];

    // Check required fields
    if (field.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field: field.key,
        message: `${field.label}是必填项`
      });
    }

    // Validate select options
    if (field.type === 'select' && value && field.options) {
      const validOptions = field.options.map(opt => opt.value);
      if (!validOptions.includes(value)) {
        errors.push({
          field: field.key,
          message: `${field.label}的值无效`
        });
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  getAllTypes,
  getTypeById,
  getTypesByCategory,
  invalidateCache,
  generateFormData,
  validateFormData
};
