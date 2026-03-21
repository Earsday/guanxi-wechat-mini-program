// data/init.js - Database initialization and data seeding

const storage = require('../services/storage.js');
const { PRE_INSTALLED_TYPES } = require('../models/guanxiTypes.js');

/**
 * Initialize application on first launch
 */
async function initializeApp() {
  console.log('Starting app initialization...');

  try {
    // Check if already initialized
    const isInitialized = await storage.get(storage.STORAGE_KEYS.APP_INITIALIZED);

    if (isInitialized) {
      console.log('App already initialized, skipping setup');
      return;
    }

    console.log('First launch detected, initializing data...');

    // Initialize collections with empty arrays
    await storage.set(storage.STORAGE_KEYS.CHARACTERS, []);
    await storage.set(storage.STORAGE_KEYS.GUANXI, []);

    // Load pre-installed relationship types
    await loadPreInstalledTypes();

    // Mark as initialized
    await storage.set(storage.STORAGE_KEYS.APP_INITIALIZED, {
      version: '0.1.0',
      initializedAt: new Date().toISOString()
    });

    console.log('App initialization completed');
  } catch (err) {
    console.error('Initialization error:', err);
    throw err;
  }
}

/**
 * Load 5 pre-installed relationship types into storage
 */
async function loadPreInstalledTypes() {
  console.log('Loading pre-installed relationship types...');

  // Add metadata to each type
  const typesWithMetadata = PRE_INSTALLED_TYPES.map(type => ({
    ...type,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));

  await storage.set(storage.STORAGE_KEYS.GUANXI_TYPES, typesWithMetadata);

  console.log(`Loaded ${typesWithMetadata.length} pre-installed types:`,
    typesWithMetadata.map(t => t.name).join(', '));
}

/**
 * Reset application (for debugging)
 */
async function resetApp() {
  console.warn('Resetting application data...');
  await storage.clear();
  await initializeApp();
  console.log('App reset completed');
}

module.exports = {
  initializeApp,
  loadPreInstalledTypes,
  resetApp
};
