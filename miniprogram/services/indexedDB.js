// services/indexedDB.js - IndexedDB wrapper for WeChat Mini Program
// 微信小程序使用 wx.cloud.database() 或者封装 wx.storage 模拟 IndexedDB 行为

/**
 * IndexedDB 配置
 * 参考: documents/技术详细设计-1-数据库详细设计.md
 */
const DB_NAME = 'guanxi_db';
const DB_VERSION = 1;

// 对象存储（Object Stores）定义
const OBJECT_STORES = {
  USERS: 'users',
  CHARACTERS: 'characters',
  CHARACTER_TEMPORAL_ATTRIBUTES: 'character_temporal_attributes',
  GUANXI_TYPES: 'guanxi_types',
  GUANXI: 'guanxi',
  REMINDERS: 'reminders',
  EVENTS: 'events',
  GRAPH_SNAPSHOTS: 'graph_snapshots'
};

// 索引定义
const INDEXES = {
  characters: [
    { name: 'userId', keyPath: 'userId', options: { unique: false } },
    { name: 'culturalContext', keyPath: 'culturalContext', options: { unique: false } },
    { name: 'isVirtual', keyPath: 'isVirtual', options: { unique: false } },
    { name: 'createdAt', keyPath: 'createdAt', options: { unique: false } }
  ],
  guanxi: [
    { name: 'fromCharacterId', keyPath: 'fromCharacterId', options: { unique: false } },
    { name: 'toCharacterId', keyPath: 'toCharacterId', options: { unique: false } },
    { name: 'typeId', keyPath: 'typeId', options: { unique: false } },
    { name: 'userId', keyPath: 'userId', options: { unique: false } }
  ],
  guanxi_types: [
    { name: 'category', keyPath: 'category', options: { unique: false } },
    { name: 'priority', keyPath: 'priority', options: { unique: false } },
    { name: 'isActive', keyPath: 'isActive', options: { unique: false } }
  ],
  reminders: [
    { name: 'characterId', keyPath: 'characterId', options: { unique: false } },
    { name: 'triggerDate', keyPath: 'triggerDate', options: { unique: false } },
    { name: 'status', keyPath: 'status', options: { unique: false } }
  ]
};

/**
 * 微信小程序 IndexedDB 适配层
 * 由于微信小程序不直接支持 IndexedDB，这里使用 wx.storage 模拟
 * 在实际生产环境中，可以考虑使用云开发的数据库或第三方 IndexedDB polyfill
 */
class IndexedDBAdapter {
  constructor() {
    this.initialized = false;
    this.storagePrefix = 'idb_';
  }

  /**
   * 初始化数据库
   */
  async init() {
    if (this.initialized) return;

    console.log('[IndexedDB] Initializing database...');

    try {
      // 检查是否已初始化
      const dbInfo = await this._getStorageItem('__db_info__');
      
      if (!dbInfo || dbInfo.version < DB_VERSION) {
        // 首次初始化或版本升级
        await this._initializeStores();
        await this._setStorageItem('__db_info__', {
          name: DB_NAME,
          version: DB_VERSION,
          initializedAt: new Date().toISOString()
        });
        console.log('[IndexedDB] Database initialized successfully');
      } else {
        console.log('[IndexedDB] Database already initialized');
      }

      this.initialized = true;
    } catch (err) {
      console.error('[IndexedDB] Initialization failed:', err);
      throw err;
    }
  }

  /**
   * 初始化所有对象存储
   */
  async _initializeStores() {
    for (const storeName of Object.values(OBJECT_STORES)) {
      const storeKey = this._getStoreKey(storeName);
      const existing = await this._getStorageItem(storeKey);
      
      if (!existing) {
        await this._setStorageItem(storeKey, []);
        console.log(`[IndexedDB] Created store: ${storeName}`);
      }
    }
  }

  /**
   * 获取存储键名
   */
  _getStoreKey(storeName) {
    return `${this.storagePrefix}${storeName}`;
  }

  /**
   * 从 wx.storage 读取数据
   */
  async _getStorageItem(key) {
    return new Promise((resolve) => {
      wx.getStorage({
        key: key,
        success: (res) => resolve(res.data),
        fail: () => resolve(null)
      });
    });
  }

  /**
   * 写入 wx.storage
   */
  async _setStorageItem(key, data) {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key: key,
        data: data,
        success: resolve,
        fail: reject
      });
    });
  }

  /**
   * 生成唯一ID
   */
  generateId(prefix = '') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}${timestamp}_${random}`;
  }

  /**
   * 添加记录
   */
  async add(storeName, record) {
    await this.init();

    const storeKey = this._getStoreKey(storeName);
    const store = await this._getStorageItem(storeKey) || [];

    // 生成 ID（如果没有）
    if (!record._id && !record.id) {
      record._id = this.generateId();
    }

    // 添加时间戳
    record.createdAt = record.createdAt || new Date().toISOString();
    record.updatedAt = new Date().toISOString();

    store.push(record);
    await this._setStorageItem(storeKey, store);

    return record;
  }

  /**
   * 批量添加记录
   */
  async bulkAdd(storeName, records) {
    await this.init();

    const storeKey = this._getStoreKey(storeName);
    const store = await this._getStorageItem(storeKey) || [];

    const processedRecords = records.map(record => {
      if (!record._id && !record.id) {
        record._id = this.generateId();
      }
      record.createdAt = record.createdAt || new Date().toISOString();
      record.updatedAt = new Date().toISOString();
      return record;
    });

    store.push(...processedRecords);
    await this._setStorageItem(storeKey, store);

    return processedRecords;
  }

  /**
   * 更新记录
   */
  async update(storeName, id, updates) {
    await this.init();

    const storeKey = this._getStoreKey(storeName);
    const store = await this._getStorageItem(storeKey) || [];

    const index = store.findIndex(item => item._id === id || item.id === id);
    if (index === -1) {
      throw new Error(`Record with id ${id} not found in ${storeName}`);
    }

    store[index] = {
      ...store[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this._setStorageItem(storeKey, store);
    return store[index];
  }

  /**
   * 删除记录
   */
  async delete(storeName, id) {
    await this.init();

    const storeKey = this._getStoreKey(storeName);
    const store = await this._getStorageItem(storeKey) || [];

    const filteredStore = store.filter(item => item._id !== id && item.id !== id);
    
    if (filteredStore.length === store.length) {
      throw new Error(`Record with id ${id} not found in ${storeName}`);
    }

    await this._setStorageItem(storeKey, filteredStore);
    return true;
  }

  /**
   * 查询单个记录
   */
  async get(storeName, id) {
    await this.init();

    const storeKey = this._getStoreKey(storeName);
    const store = await this._getStorageItem(storeKey) || [];

    return store.find(item => item._id === id || item.id === id) || null;
  }

  /**
   * 查询所有记录
   */
  async getAll(storeName) {
    await this.init();

    const storeKey = this._getStoreKey(storeName);
    return await this._getStorageItem(storeKey) || [];
  }

  /**
   * 条件查询
   */
  async query(storeName, conditions = {}, options = {}) {
    await this.init();

    let results = await this.getAll(storeName);

    // 应用筛选条件
    if (Object.keys(conditions).length > 0) {
      results = results.filter(item => {
        return Object.keys(conditions).every(key => {
          const conditionValue = conditions[key];
          const itemValue = item[key];

          // 支持简单的操作符
          if (typeof conditionValue === 'object' && conditionValue !== null) {
            if (conditionValue.$eq !== undefined) return itemValue === conditionValue.$eq;
            if (conditionValue.$ne !== undefined) return itemValue !== conditionValue.$ne;
            if (conditionValue.$gt !== undefined) return itemValue > conditionValue.$gt;
            if (conditionValue.$gte !== undefined) return itemValue >= conditionValue.$gte;
            if (conditionValue.$lt !== undefined) return itemValue < conditionValue.$lt;
            if (conditionValue.$lte !== undefined) return itemValue <= conditionValue.$lte;
            if (conditionValue.$in !== undefined) return conditionValue.$in.includes(itemValue);
            if (conditionValue.$nin !== undefined) return !conditionValue.$nin.includes(itemValue);
          }

          return itemValue === conditionValue;
        });
      });
    }

    // 应用排序
    if (options.sort) {
      const sortKeys = Object.keys(options.sort);
      results.sort((a, b) => {
        for (const key of sortKeys) {
          const order = options.sort[key]; // 1 for asc, -1 for desc
          if (a[key] < b[key]) return -1 * order;
          if (a[key] > b[key]) return 1 * order;
        }
        return 0;
      });
    }

    // 应用分页
    if (options.skip || options.limit) {
      const skip = options.skip || 0;
      const limit = options.limit || results.length;
      results = results.slice(skip, skip + limit);
    }

    return results;
  }

  /**
   * 统计记录数
   */
  async count(storeName, conditions = {}) {
    const results = await this.query(storeName, conditions);
    return results.length;
  }

  /**
   * 清空对象存储
   */
  async clear(storeName) {
    await this.init();

    const storeKey = this._getStoreKey(storeName);
    await this._setStorageItem(storeKey, []);
    console.log(`[IndexedDB] Cleared store: ${storeName}`);
  }

  /**
   * 清空整个数据库
   */
  async clearAll() {
    await this.init();

    for (const storeName of Object.values(OBJECT_STORES)) {
      await this.clear(storeName);
    }

    await this._setStorageItem('__db_info__', null);
    this.initialized = false;
    console.log('[IndexedDB] Database cleared');
  }

  /**
   * 导出数据库（用于备份）
   */
  async exportDatabase() {
    await this.init();

    const exportData = {
      version: DB_VERSION,
      exportedAt: new Date().toISOString(),
      stores: {}
    };

    for (const storeName of Object.values(OBJECT_STORES)) {
      exportData.stores[storeName] = await this.getAll(storeName);
    }

    return exportData;
  }

  /**
   * 导入数据库（用于恢复）
   */
  async importDatabase(importData) {
    await this.init();

    if (!importData || !importData.stores) {
      throw new Error('Invalid import data format');
    }

    for (const storeName of Object.keys(importData.stores)) {
      if (OBJECT_STORES[storeName.toUpperCase()]) {
        const storeKey = this._getStoreKey(storeName);
        await this._setStorageItem(storeKey, importData.stores[storeName]);
        console.log(`[IndexedDB] Imported store: ${storeName}`);
      }
    }

    console.log('[IndexedDB] Database imported successfully');
  }
}

// 创建单例实例
const db = new IndexedDBAdapter();

module.exports = {
  db,
  OBJECT_STORES,
  DB_NAME,
  DB_VERSION
};
