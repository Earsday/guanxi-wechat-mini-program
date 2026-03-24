// services/storage.js - Storage service using IndexedDB adapter
// 更新以使用 IndexedDB 而不是简单的 wx.storage

const { db, OBJECT_STORES } = require('./indexedDB.js');

/**
 * 存储服务 - 基于 IndexedDB 适配层
 * 参考: documents/技术详细设计-1-数据库详细设计.md
 */

// 向后兼容的存储键（用于旧代码迁移）
const STORAGE_KEYS = {
  GUANXI_TYPES: OBJECT_STORES.GUANXI_TYPES,
  CHARACTERS: OBJECT_STORES.CHARACTERS,
  GUANXI: OBJECT_STORES.GUANXI,
  REMINDERS: OBJECT_STORES.REMINDERS,
  EVENTS: OBJECT_STORES.EVENTS,
  USERS: OBJECT_STORES.USERS,
  CHARACTER_TEMPORAL_ATTRIBUTES: OBJECT_STORES.CHARACTER_TEMPORAL_ATTRIBUTES,
  GRAPH_SNAPSHOTS: OBJECT_STORES.GRAPH_SNAPSHOTS,
  APP_INITIALIZED: 'app_initialized'
};

/**
 * 初始化存储
 */
async function init() {
  return await db.init();
}

/**
 * 获取单个项
 */
async function get(storeNameOrKey) {
  // 特殊处理：非对象存储的简单键值
  if (storeNameOrKey === STORAGE_KEYS.APP_INITIALIZED) {
    return await db._getStorageItem(storeNameOrKey);
  }
  
  // 对象存储查询
  return await db.getAll(storeNameOrKey);
}

/**
 * 设置数据
 */
async function set(storeNameOrKey, data) {
  // 特殊处理：非对象存储的简单键值
  if (storeNameOrKey === STORAGE_KEYS.APP_INITIALIZED) {
    return await db._setStorageItem(storeNameOrKey, data);
  }
  
  // 对象存储设置（直接替换整个集合 - 谨慎使用）
  const storeKey = db._getStoreKey(storeNameOrKey);
  return await db._setStorageItem(storeKey, data);
}

/**
 * 删除数据
 */
async function remove(key) {
  return new Promise((resolve, reject) => {
    wx.removeStorage({
      key: key,
      success: () => resolve(),
      fail: reject
    });
  });
}

/**
 * 清空所有存储
 */
async function clear() {
  return await db.clearAll();
}

/**
 * 获取对象存储中的所有项
 */
async function getAll(storeName) {
  return await db.getAll(storeName);
}

/**
 * 添加项到对象存储
 */
async function add(storeName, item) {
  return await db.add(storeName, item);
}

/**
 * 批量添加
 */
async function bulkAdd(storeName, items) {
  return await db.bulkAdd(storeName, items);
}

/**
 * 更新对象存储中的项
 */
async function update(storeName, id, updates) {
  return await db.update(storeName, id, updates);
}

/**
 * 删除对象存储中的项
 */
async function deleteItem(storeName, id) {
  return await db.delete(storeName, id);
}

/**
 * 查询对象存储
 * @param {string} storeName - 对象存储名称
 * @param {object} conditions - 查询条件
 * @param {object} options - 查询选项 {sort, skip, limit}
 */
async function query(storeName, conditions = {}, options = {}) {
  return await db.query(storeName, conditions, options);
}

/**
 * 条件查找（向后兼容旧代码）
 */
async function find(storeName, conditions) {
  return await query(storeName, conditions);
}

/**
 * 统计记录数
 */
async function count(storeName, conditions = {}) {
  return await db.count(storeName, conditions);
}

/**
 * 根据 ID 获取单个记录
 */
async function getById(storeName, id) {
  return await db.get(storeName, id);
}

/**
 * 生成唯一ID
 */
function generateId(prefix = '') {
  return db.generateId(prefix);
}

/**
 * 导出数据库（用于备份）
 */
async function exportDatabase() {
  return await db.exportDatabase();
}

/**
 * 导入数据库（用于恢复）
 */
async function importDatabase(data) {
  return await db.importDatabase(data);
}

/**
 * 清空特定对象存储
 */
async function clearStore(storeName) {
  return await db.clear(storeName);
}

// 导出API
module.exports = {
  // 配置
  STORAGE_KEYS,
  OBJECT_STORES,
  
  // 初始化
  init,
  
  // 基础操作（向后兼容）
  get,
  set,
  remove,
  clear,
  
  // IndexedDB 风格操作
  getAll,
  add,
  bulkAdd,
  update,
  deleteItem,
  query,
  find,
  count,
  getById,
  clearStore,
  
  // 工具
  generateId,
  
  // 导入导出
  exportDatabase,
  importDatabase
};
