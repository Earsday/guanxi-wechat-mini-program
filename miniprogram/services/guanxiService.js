// services/guanxiService.js - Relationship management

const { db, OBJECT_STORES } = require('./indexedDB.js');

/**
 * Get all relationships for a character
 */
async function getGuanxiByCharacter(characterId) {
  const outgoing = await db.query(OBJECT_STORES.GUANXI, { fromCharacterId: characterId });
  const incoming = await db.query(OBJECT_STORES.GUANXI, { toCharacterId: characterId });
  
  return [...outgoing, ...incoming];
}

/**
 * Create new relationship
 */
async function createGuanxi(guanxiData) {
  const userId = guanxiData.userId || 1;

  // Validate required fields
  if (!guanxiData.fromCharacterId || !guanxiData.toCharacterId || !guanxiData.typeId) {
    throw new Error('fromCharacterId, toCharacterId, and typeId are required');
  }

  // Check if relationship already exists
  const exists = await relationshipExists(
    guanxiData.fromCharacterId,
    guanxiData.toCharacterId,
    guanxiData.typeId
  );

  if (exists) {
    throw new Error('Relationship already exists between these characters');
  }

  const newGuanxi = {
    userId,
    fromCharacterId: guanxiData.fromCharacterId,
    toCharacterId: guanxiData.toCharacterId,
    typeId: guanxiData.typeId,
    
    // Periods (for multi-period relationships)
    periods: guanxiData.periods || [],
    
    // Type-specific attributes
    attributes: guanxiData.attributes || {},
    
    // Contact tracking
    lastContactTime: guanxiData.lastContactTime || null,
    contactFrequency: guanxiData.contactFrequency || null,
    
    // Relationship deduction
    isDeduced: guanxiData.isDeduced || false,
    deductionChain: guanxiData.deductionChain || [],
    deductionConfidence: guanxiData.deductionConfidence || null,
    
    // Notes and tags
    note: guanxiData.note || '',
    tags: guanxiData.tags || [],
    
    // Privacy
    isPrivate: guanxiData.isPrivate || false,
    
    // Cloud sync
    cloudSynced: false,
    cloudId: guanxiData.cloudId || '',
    lastSyncAt: 0
  };

  const created = await db.add(OBJECT_STORES.GUANXI, newGuanxi);

  // Update character statistics
  await updateCharacterStats(guanxiData.fromCharacterId);
  await updateCharacterStats(guanxiData.toCharacterId);

  // Emit event for relationship creation (for deduction system)
  const eventBus = require('../utils/eventBus.js');
  eventBus.emit('guanxi:created', created);

  return created;
}

/**
 * Update relationship
 */
async function updateGuanxi(id, updates) {
  const existing = await db.getById(OBJECT_STORES.GUANXI, id);
  
  if (!existing) {
    throw new Error(`Guanxi with id ${id} not found`);
  }

  const updated = {
    ...existing,
    ...updates,
    updatedAt: Date.now()
  };

  await db.update(OBJECT_STORES.GUANXI, id, updated);

  // Emit event for relationship update
  const eventBus = require('../utils/eventBus.js');
  eventBus.emit('guanxi:updated', updated);

  return updated;
}

/**
 * Delete relationship
 */
async function deleteGuanxi(id) {
  const guanxi = await db.getById(OBJECT_STORES.GUANXI, id);
  
  if (!guanxi) {
    throw new Error(`Guanxi with id ${id} not found`);
  }

  await db.delete(OBJECT_STORES.GUANXI, id);

  // Update character statistics
  await updateCharacterStats(guanxi.fromCharacterId);
  await updateCharacterStats(guanxi.toCharacterId);

  // Emit event for relationship deletion
  const eventBus = require('../utils/eventBus.js');
  eventBus.emit('guanxi:deleted', guanxi);
}

/**
 * Add a period to relationship (for multi-period support)
 */
async function addPeriod(guanxiId, periodData) {
  const guanxi = await db.getById(OBJECT_STORES.GUANXI, guanxiId);
  
  if (!guanxi) {
    throw new Error(`Guanxi with id ${guanxiId} not found`);
  }

  const period = {
    id: Date.now(), // Simple timestamp-based ID for periods
    startTime: periodData.startTime,
    endTime: periodData.endTime || null,
    attributes: periodData.attributes || {},
    note: periodData.note || ''
  };

  const updatedPeriods = [...(guanxi.periods || []), period];
  
  await db.update(OBJECT_STORES.GUANXI, guanxiId, {
    ...guanxi,
    periods: updatedPeriods,
    updatedAt: Date.now()
  });

  return period;
}

/**
 * End current period of relationship
 */
async function endPeriod(guanxiId, endTime, note = '') {
  const guanxi = await db.getById(OBJECT_STORES.GUANXI, guanxiId);
  
  if (!guanxi) {
    throw new Error(`Guanxi with id ${guanxiId} not found`);
  }

  // Find the active period (no endTime)
  const periods = guanxi.periods || [];
  const activePeriodIndex = periods.findIndex(p => !p.endTime);

  if (activePeriodIndex === -1) {
    throw new Error('No active period found to end');
  }

  periods[activePeriodIndex].endTime = endTime;
  periods[activePeriodIndex].note = note;

  await db.update(OBJECT_STORES.GUANXI, guanxiId, {
    ...guanxi,
    periods,
    updatedAt: Date.now()
  });
}

/**
 * Query relationships with filters
 */
async function queryGuanxi(filter = {}, pagination = {}) {
  const userId = filter.userId || 1;
  const conditions = { userId, ...filter };
  
  const options = {
    skip: pagination.offset || 0,
    limit: pagination.limit || 100
  };

  return await db.query(OBJECT_STORES.GUANXI, conditions, options);
}

/**
 * Get relationship by ID with options
 */
async function getGuanxi(id, options = {}) {
  const guanxi = await db.getById(OBJECT_STORES.GUANXI, id);
  
  if (!guanxi) {
    return null;
  }

  // Optionally include character details
  if (options.includeCharacters) {
    const characterService = require('./characterService.js');
    guanxi.fromCharacter = await characterService.getCharacterById(guanxi.fromCharacterId);
    guanxi.toCharacter = await characterService.getCharacterById(guanxi.toCharacterId);
  }

  // Optionally include type details
  if (options.includeType) {
    const typeService = require('./typeService.js');
    guanxi.type = await typeService.getTypeById(guanxi.typeId);
  }

  return guanxi;
}

/**
 * Find relationship path between two characters (BFS algorithm)
 */
async function findPath(fromCharacterId, toCharacterId, maxDepth = 6) {
  if (fromCharacterId === toCharacterId) {
    return {
      found: true,
      path: [fromCharacterId],
      relationships: [],
      depth: 0
    };
  }

  const visited = new Set();
  const queue = [{ characterId: fromCharacterId, path: [fromCharacterId], relationships: [] }];
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (current.path.length - 1 >= maxDepth) {
      continue;
    }

    if (visited.has(current.characterId)) {
      continue;
    }
    
    visited.add(current.characterId);

    // Get all relationships from current character
    const relationships = await getGuanxiByCharacter(current.characterId);

    for (const rel of relationships) {
      const nextCharacterId = rel.fromCharacterId === current.characterId 
        ? rel.toCharacterId 
        : rel.fromCharacterId;

      if (nextCharacterId === toCharacterId) {
        return {
          found: true,
          path: [...current.path, nextCharacterId],
          relationships: [...current.relationships, rel],
          depth: current.path.length
        };
      }

      if (!visited.has(nextCharacterId)) {
        queue.push({
          characterId: nextCharacterId,
          path: [...current.path, nextCharacterId],
          relationships: [...current.relationships, rel]
        });
      }
    }
  }

  return {
    found: false,
    path: [],
    relationships: [],
    depth: -1
  };
}

/**
 * Update contact time for relationship
 */
async function updateContactTime(guanxiId, contactTime, note = '') {
  const guanxi = await db.getById(OBJECT_STORES.GUANXI, guanxiId);
  
  if (!guanxi) {
    throw new Error(`Guanxi with id ${guanxiId} not found`);
  }

  await db.update(OBJECT_STORES.GUANXI, guanxiId, {
    ...guanxi,
    lastContactTime: contactTime,
    updatedAt: Date.now()
  });

  // Create event in timeline
  const eventService = require('./eventService.js');
  await eventService.createEvent({
    userId: guanxi.userId,
    characterId: null,
    guanxiId: guanxiId,
    eventType: 'contact',
    eventTime: contactTime,
    title: '联系记录',
    description: note,
    metadata: {
      fromCharacterId: guanxi.fromCharacterId,
      toCharacterId: guanxi.toCharacterId
    }
  });
}

/**
 * Check if relationship exists
 */
async function relationshipExists(fromCharacterId, toCharacterId, typeId) {
  const results = await db.query(OBJECT_STORES.GUANXI, {
    fromCharacterId,
    toCharacterId,
    typeId
  });

  return results.length > 0;
}

/**
 * Update character relationship statistics
 */
async function updateCharacterStats(characterId) {
  const relationships = await getGuanxiByCharacter(characterId);
  
  // Count active relationships (those with at least one active period or no periods)
  const activeCount = relationships.filter(rel => {
    if (!rel.periods || rel.periods.length === 0) {
      return true; // No periods means always active
    }
    return rel.periods.some(p => !p.endTime);
  }).length;

  const characterService = require('./characterService.js');
  const character = await characterService.getCharacterById(characterId);
  
  if (character) {
    await characterService.updateCharacter(characterId, {
      stats: {
        guanxiCount: relationships.length,
        activeGuanxiCount: activeCount
      }
    });
  }
}

module.exports = {
  getGuanxiByCharacter,
  createGuanxi,
  updateGuanxi,
  deleteGuanxi,
  addPeriod,
  endPeriod,
  queryGuanxi,
  getGuanxi,
  findPath,
  updateContactTime,
  relationshipExists
};
