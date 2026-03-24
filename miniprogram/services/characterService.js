// services/characterService.js - Character/people management

const { db, OBJECT_STORES } = require('./indexedDB.js');
const util = require('../utils/util.js');

/**
 * Get all characters for current user
 */
async function getAllCharacters(userId = 1) {
  return await db.query(OBJECT_STORES.CHARACTERS, { userId });
}

/**
 * Get character by ID
 */
async function getCharacterById(id, options = {}) {
  const character = await db.getById(OBJECT_STORES.CHARACTERS, id);
  
  if (!character) {
    return null;
  }

  // Optionally include temporal attributes
  if (options.includeTemporalAttributes) {
    character.temporalAttributes = await queryTemporalAttributes(id);
  }

  // Optionally include relationships
  if (options.includeRelationships) {
    const guanxiService = require('./guanxiService.js');
    character.relationships = await guanxiService.getGuanxiByCharacter(id);
  }

  return character;
}

/**
 * Create new character
 */
async function createCharacter(characterData) {
  const userId = characterData.userId || 1;

  // Validate required fields
  if (!characterData.name && !characterData.displayName) {
    throw new Error('Character must have either name or displayName');
  }

  // Initialize complete data structure
  const newCharacter = {
    userId,
    name: characterData.name || '',
    alias: characterData.alias || [],
    gender: characterData.gender || 'prefer_not_to_say',
    
    // International name fields
    nameFields: characterData.nameFields || {
      lastName: '',
      firstName: '',
      firstNameWestern: '',
      middleNameWestern: '',
      lastNameWestern: '',
      lastNameJapanese: '',
      firstNameJapanese: ''
    },
    displayName: characterData.displayName || characterData.name || '',
    culturalContext: characterData.culturalContext || 'zh-CN',
    
    // Birthday (support both solar and lunar)
    birthday: characterData.birthday || {
      solar: '',
      lunar: '',
      primary: 'solar'
    },
    
    // Contacts
    contacts: {
      phones: characterData.contacts?.phones || [],
      emails: characterData.contacts?.emails || [],
      addresses: characterData.contacts?.addresses || [],
      im: characterData.contacts?.im || {
        wechatId: '',
        qq: '',
        douyin: '',
        tiktok: '',
        whatsapp: '',
        telegram: '',
        line: '',
        kakao: ''
      }
    },
    
    avatar: characterData.avatar || '',
    description: characterData.description || '',
    tags: characterData.tags || [],
    
    // Immutable attributes
    immutableAttributes: characterData.immutableAttributes || {
      birthPlace: '',
      birthNationality: '',
      ethnicity: '',
      zodiacSign: '',
      chineseZodiac: '',
      bloodType: ''
    },
    
    // Fictional character
    isFictional: characterData.isFictional || false,
    source: characterData.source || '',
    
    // System fields
    isUser: characterData.isUser || false,
    importFrom: characterData.importFrom || 'manual',
    
    // Statistics
    stats: {
      guanxiCount: 0,
      activeGuanxiCount: 0
    },
    
    // Cloud sync (optional)
    cloudSynced: false,
    cloudId: characterData.cloudId || '',
    lastSyncAt: 0
  };

  // Calculate derived attributes
  enrichCharacterData(newCharacter);

  // Validate constraints
  validateCharacter(newCharacter);

  return await db.add(OBJECT_STORES.CHARACTERS, newCharacter);
}

/**
 * Update character
 */
async function updateCharacter(id, updates) {
  const existing = await db.getById(OBJECT_STORES.CHARACTERS, id);
  
  if (!existing) {
    throw new Error(`Character with id ${id} not found`);
  }

  // Merge updates
  const updated = {
    ...existing,
    ...updates,
    updatedAt: Date.now()
  };

  // Recalculate derived attributes
  enrichCharacterData(updated);

  // Validate
  validateCharacter(updated);

  await db.update(OBJECT_STORES.CHARACTERS, id, updated);
  return updated;
}

/**
 * Delete character
 */
async function deleteCharacter(id, options = {}) {
  // Check if character has relationships
  const guanxiService = require('./guanxiService.js');
  const relationships = await guanxiService.getGuanxiByCharacter(id);
  
  if (relationships.length > 0 && !options.force) {
    throw new Error('Character has existing relationships. Set force:true to delete anyway.');
  }

  // Delete all relationships if force
  if (options.force) {
    for (const guanxi of relationships) {
      await guanxiService.deleteGuanxi(guanxi.id);
    }
  }

  // Delete temporal attributes
  const temporalAttrs = await queryTemporalAttributes(id);
  for (const attr of temporalAttrs) {
    await db.delete(OBJECT_STORES.CHARACTER_TEMPORAL_ATTRIBUTES, attr.id);
  }

  // Delete character
  await db.delete(OBJECT_STORES.CHARACTERS, id);
}

/**
 * Query characters with filters, sorting, and pagination
 */
async function queryCharacters(filter = {}, sort = { field: 'name', order: 'asc' }, pagination = {}) {
  const userId = filter.userId || 1;
  const conditions = { userId, ...filter };
  
  const options = {
    sort: sort.field ? [[sort.field, sort.order]] : undefined,
    skip: pagination.offset || 0,
    limit: pagination.limit || 100
  };

  return await db.query(OBJECT_STORES.CHARACTERS, conditions, options);
}

/**
 * Search characters by keyword
 */
async function searchCharacters(keyword, limit = 50) {
  const characters = await getAllCharacters();

  if (!keyword || keyword.trim() === '') {
    return characters.slice(0, limit);
  }

  const lowerKeyword = keyword.toLowerCase();

  const results = characters.filter(char => {
    return (
      char.name.toLowerCase().includes(lowerKeyword) ||
      char.displayName.toLowerCase().includes(lowerKeyword) ||
      (char.alias && char.alias.some(a => a.toLowerCase().includes(lowerKeyword))) ||
      (char.description && char.description.toLowerCase().includes(lowerKeyword)) ||
      (char.tags && char.tags.some(t => t.toLowerCase().includes(lowerKeyword)))
    );
  });

  return results.slice(0, limit);
}

/**
 * Import from WeChat contacts
 */
async function importFromWechat(friends) {
  const imported = [];
  
  for (const friend of friends) {
    try {
      const character = await createCharacter({
        name: friend.nickName || friend.userName,
        avatar: friend.avatarUrl,
        contacts: {
          im: {
            wechatId: friend.userName
          }
        },
        importFrom: 'wechat',
        tags: ['微信好友']
      });
      imported.push(character);
    } catch (error) {
      console.error('Failed to import friend:', friend, error);
    }
  }
  
  return imported;
}

/**
 * Add temporal attribute to character
 */
async function addTemporalAttribute(characterId, attribute) {
  const userId = attribute.userId || 1;
  
  // Validate attribute type
  const validTypes = ['nationality', 'residence', 'occupation', 'politicalParty', 'religion'];
  if (!validTypes.includes(attribute.attributeType)) {
    throw new Error(`Invalid attribute type: ${attribute.attributeType}`);
  }

  // If no end time, mark previous attributes of same type as inactive
  if (!attribute.endTime) {
    const existing = await queryTemporalAttributes(characterId, attribute.attributeType);
    for (const attr of existing) {
      if (attr.isActive) {
        await db.update(OBJECT_STORES.CHARACTER_TEMPORAL_ATTRIBUTES, attr.id, {
          ...attr,
          endTime: attribute.startTime,
          isActive: false
        });
      }
    }
  }

  const newAttribute = {
    userId,
    characterId,
    attributeType: attribute.attributeType,
    value: attribute.value,
    startTime: attribute.startTime,
    endTime: attribute.endTime || null,
    isActive: !attribute.endTime,
    note: attribute.note || ''
  };

  return await db.add(OBJECT_STORES.CHARACTER_TEMPORAL_ATTRIBUTES, newAttribute);
}

/**
 * Query temporal attributes
 */
async function queryTemporalAttributes(characterId, attributeType = null, timePoint = null) {
  const conditions = { characterId };
  
  if (attributeType) {
    conditions.attributeType = attributeType;
  }

  let results = await db.query(OBJECT_STORES.CHARACTER_TEMPORAL_ATTRIBUTES, conditions);

  // Filter by time point if specified
  if (timePoint) {
    results = results.filter(attr => {
      const start = new Date(attr.startTime).getTime();
      const end = attr.endTime ? new Date(attr.endTime).getTime() : Date.now();
      const point = new Date(timePoint).getTime();
      return point >= start && point <= end;
    });
  }

  return results;
}

/**
 * Enrich character data with derived attributes
 */
function enrichCharacterData(character) {
  // Generate display name if not set
  if (!character.displayName && character.nameFields) {
    if (character.culturalContext === 'zh-CN') {
      character.displayName = `${character.nameFields.lastName}${character.nameFields.firstName}`;
    } else if (character.culturalContext === 'ja-JP') {
      character.displayName = `${character.nameFields.lastNameJapanese} ${character.nameFields.firstNameJapanese}`;
    } else {
      character.displayName = `${character.nameFields.firstNameWestern} ${character.nameFields.lastNameWestern}`.trim();
    }
  }

  // Fallback to name if displayName still empty
  if (!character.displayName) {
    character.displayName = character.name;
  }

  // Calculate zodiac signs from birthday
  if (character.birthday?.solar) {
    try {
      character.immutableAttributes = character.immutableAttributes || {};
      character.immutableAttributes.westernZodiac = util.getWesternZodiac(character.birthday.solar);
      character.immutableAttributes.chineseZodiac = util.getChineseZodiac(character.birthday.solar);
    } catch (error) {
      console.warn('Failed to calculate zodiac signs:', error);
    }
  }
}

/**
 * Validate character data
 */
function validateCharacter(character) {
  // Name validation
  if (!character.name && !character.displayName) {
    throw new Error('Character must have either name or displayName');
  }

  // Contacts validation
  if (character.contacts?.phones && character.contacts.phones.length > 3) {
    throw new Error('Maximum 3 phone numbers allowed');
  }

  if (character.contacts?.emails && character.contacts.emails.length > 2) {
    throw new Error('Maximum 2 email addresses allowed');
  }

  if (character.contacts?.addresses && character.contacts.addresses.length > 2) {
    throw new Error('Maximum 2 addresses allowed');
  }

  // Gender validation
  const validGenders = ['male', 'female', 'other', 'non_binary', 'prefer_not_to_say'];
  if (character.gender && !validGenders.includes(character.gender)) {
    throw new Error(`Invalid gender: ${character.gender}`);
  }
}

module.exports = {
  getAllCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  queryCharacters,
  searchCharacters,
  importFromWechat,
  addTemporalAttribute,
  queryTemporalAttributes
};
