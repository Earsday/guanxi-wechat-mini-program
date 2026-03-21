// services/characterService.js - Character/people management

const storage = require('./storage.js');
const util = require('../utils/util.js');

/**
 * Get all characters
 */
async function getAllCharacters() {
  return await storage.getAll(storage.STORAGE_KEYS.CHARACTERS);
}

/**
 * Get character by ID
 */
async function getCharacterById(id) {
  const characters = await getAllCharacters();
  return characters.find(char => char.id === id);
}

/**
 * Create new character
 */
async function createCharacter(characterData) {
  // Calculate derived attributes
  const enrichedData = enrichCharacterData(characterData);

  return await storage.add(storage.STORAGE_KEYS.CHARACTERS, enrichedData);
}

/**
 * Update character
 */
async function updateCharacter(id, updates) {
  const enrichedUpdates = enrichCharacterData(updates);
  return await storage.update(storage.STORAGE_KEYS.CHARACTERS, id, enrichedUpdates);
}

/**
 * Delete character
 */
async function deleteCharacter(id) {
  // TODO: Check if character has relationships before deleting
  // For now, just delete
  return await storage.deleteItem(storage.STORAGE_KEYS.CHARACTERS, id);
}

/**
 * Search characters by keyword
 */
async function searchCharacters(keyword) {
  const characters = await getAllCharacters();

  if (!keyword || keyword.trim() === '') {
    return characters;
  }

  const lowerKeyword = keyword.toLowerCase();

  return characters.filter(char => {
    return (
      char.name.toLowerCase().includes(lowerKeyword) ||
      (char.nickname && char.nickname.toLowerCase().includes(lowerKeyword)) ||
      (char.notes && char.notes.toLowerCase().includes(lowerKeyword))
    );
  });
}

/**
 * Enrich character data with derived attributes
 */
function enrichCharacterData(data) {
  const enriched = { ...data };

  // Calculate age from birthdate
  if (data.birthdate) {
    enriched.age = util.calculateAge(data.birthdate);
  }

  // Calculate zodiac signs
  if (data.birthdate) {
    enriched.chineseZodiac = util.getChineseZodiac(data.birthdate);
    enriched.westernZodiac = util.getWesternZodiac(data.birthdate);
  }

  return enriched;
}

module.exports = {
  getAllCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  searchCharacters
};
