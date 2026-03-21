// services/storage.js - wx.storage wrapper for data persistence

const STORAGE_KEYS = {
  GUANXI_TYPES: 'guanxi_types',
  CHARACTERS: 'characters',
  GUANXI: 'guanxi',
  APP_INITIALIZED: 'app_initialized'
};

/**
 * Get data from storage
 */
function get(key) {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: key,
      success: res => resolve(res.data),
      fail: err => {
        if (err.errMsg.includes('data not found')) {
          resolve(null);
        } else {
          reject(err);
        }
      }
    });
  });
}

/**
 * Set data to storage
 */
function set(key, data) {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key: key,
      data: data,
      success: () => resolve(),
      fail: reject
    });
  });
}

/**
 * Remove data from storage
 */
function remove(key) {
  return new Promise((resolve, reject) => {
    wx.removeStorage({
      key: key,
      success: () => resolve(),
      fail: reject
    });
  });
}

/**
 * Clear all storage
 */
function clear() {
  return new Promise((resolve, reject) => {
    wx.clearStorage({
      success: () => resolve(),
      fail: reject
    });
  });
}

/**
 * Get all items from a collection (array stored in storage)
 */
async function getAll(collectionKey) {
  const data = await get(collectionKey);
  return data || [];
}

/**
 * Add item to collection
 */
async function add(collectionKey, item) {
  const collection = await getAll(collectionKey);

  // Generate ID if not present
  if (!item.id) {
    item.id = generateId();
  }

  item.createdAt = new Date().toISOString();
  item.updatedAt = new Date().toISOString();

  collection.push(item);
  await set(collectionKey, collection);

  return item;
}

/**
 * Update item in collection
 */
async function update(collectionKey, id, updates) {
  const collection = await getAll(collectionKey);
  const index = collection.findIndex(item => item.id === id);

  if (index === -1) {
    throw new Error(`Item with id ${id} not found in ${collectionKey}`);
  }

  collection[index] = {
    ...collection[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  await set(collectionKey, collection);
  return collection[index];
}

/**
 * Delete item from collection
 */
async function deleteItem(collectionKey, id) {
  const collection = await getAll(collectionKey);
  const filtered = collection.filter(item => item.id !== id);

  if (filtered.length === collection.length) {
    throw new Error(`Item with id ${id} not found in ${collectionKey}`);
  }

  await set(collectionKey, filtered);
  return true;
}

/**
 * Find items in collection by query
 */
async function find(collectionKey, query) {
  const collection = await getAll(collectionKey);

  if (!query || Object.keys(query).length === 0) {
    return collection;
  }

  return collection.filter(item => {
    return Object.keys(query).every(key => {
      return item[key] === query[key];
    });
  });
}

/**
 * Generate unique ID
 */
function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = {
  STORAGE_KEYS,
  get,
  set,
  remove,
  clear,
  getAll,
  add,
  update,
  deleteItem,
  find,
  generateId
};
