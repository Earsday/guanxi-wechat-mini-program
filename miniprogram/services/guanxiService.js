// services/guanxiService.js - Relationship management

const storage = require('./storage.js');
const eventBus = require('../utils/eventBus.js');

/**
 * Get all relationships
 */
async function getAllGuanxi() {
  return await storage.getAll(storage.STORAGE_KEYS.GUANXI);
}

/**
 * Get relationships for a character
 */
async function getGuanxiByCharacter(characterId) {
  const allGuanxi = await getAllGuanxi();

  return allGuanxi.filter(guanxi => {
    return guanxi.fromCharacterId === characterId || guanxi.toCharacterId === characterId;
  });
}

/**
 * Create new relationship
 */
async function createGuanxi(guanxiData) {
  // Emit before_create event
  eventBus.emit('before_create', guanxiData);

  // Validate required fields
  if (!guanxiData.fromCharacterId || !guanxiData.toCharacterId) {
    throw new Error('fromCharacterId and toCharacterId are required');
  }

  if (!guanxiData.typeId) {
    throw new Error('typeId is required');
  }

  // Ensure direction is set
  if (!guanxiData.direction) {
    guanxiData.direction = 'forward';
  }

  // Add relationship
  const guanxi = await storage.add(storage.STORAGE_KEYS.GUANXI, guanxiData);

  // Emit after_create event
  eventBus.emit('after_create', guanxi);

  return guanxi;
}

/**
 * Update relationship
 */
async function updateGuanxi(id, updates) {
  const guanxi = await storage.update(storage.STORAGE_KEYS.GUANXI, id, updates);

  eventBus.emit('after_update', guanxi);

  return guanxi;
}

/**
 * Delete relationship
 */
async function deleteGuanxi(id) {
  const result = await storage.deleteItem(storage.STORAGE_KEYS.GUANXI, id);

  eventBus.emit('after_delete', { id });

  return result;
}

/**
 * Add period to relationship
 */
async function addPeriod(guanxiId, periodData) {
  const allGuanxi = await getAllGuanxi();
  const guanxi = allGuanxi.find(g => g.id === guanxiId);

  if (!guanxi) {
    throw new Error(`Guanxi with id ${guanxiId} not found`);
  }

  if (!guanxi.periods) {
    guanxi.periods = [];
  }

  const period = {
    id: storage.generateId(),
    ...periodData,
    createdAt: new Date().toISOString()
  };

  guanxi.periods.push(period);
  guanxi.updatedAt = new Date().toISOString();

  await storage.set(storage.STORAGE_KEYS.GUANXI, allGuanxi);

  return period;
}

/**
 * Check if relationship exists between two characters
 */
async function relationshipExists(fromCharacterId, toCharacterId, typeId) {
  const allGuanxi = await getAllGuanxi();

  return allGuanxi.some(guanxi => {
    return (
      guanxi.fromCharacterId === fromCharacterId &&
      guanxi.toCharacterId === toCharacterId &&
      guanxi.typeId === typeId
    );
  });
}

module.exports = {
  getAllGuanxi,
  getGuanxiByCharacter,
  createGuanxi,
  updateGuanxi,
  deleteGuanxi,
  addPeriod,
  relationshipExists
};
