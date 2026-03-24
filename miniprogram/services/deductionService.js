// services/deductionService.js - Relationship deduction and inference

const { db, OBJECT_STORES } = require('./indexedDB.js');
const guanxiService = require('./guanxiService.js');
const typeService = require('./typeService.js');
const characterService = require('./characterService.js');

/**
 * Deduce possible relationships from existing relationships
 */
async function deduceRelations(sourceGuanxiId, depth = 2) {
  const sourceGuanxi = await db.getById(OBJECT_STORES.GUANXI, sourceGuanxiId);
  
  if (!sourceGuanxi) {
    throw new Error(`Source guanxi with id ${sourceGuanxiId} not found`);
  }

  const deductions = [];
  const visited = new Set();

  // Start BFS from the source relationship
  const queue = [{
    fromCharId: sourceGuanxi.fromCharacterId,
    toCharId: sourceGuanxi.toCharacterId,
    chain: [sourceGuanxi],
    currentDepth: 1
  }];

  while (queue.length > 0 && deductions.length < 100) { // Limit deductions
    const current = queue.shift();

    if (current.currentDepth > depth) continue;

    const key = `${current.fromCharId}-${current.toCharId}`;
    if (visited.has(key)) continue;
    visited.add(key);

    // Get all relationships from the toCharId
    const nextRelationships = await guanxiService.getGuanxiByCharacter(current.toCharId);

    for (const nextRel of nextRelationships) {
      const nextCharId = nextRel.fromCharacterId === current.toCharId
        ? nextRel.toCharacterId
        : nextRel.fromCharacterId;

      // Don't deduce back to starting point (unless it's a useful loop)
      if (nextCharId === current.fromCharId && current.currentDepth === 1) {
        continue;
      }

      // Try to deduce relationship
      const deduction = await tryDeduceRelationship(
        current.fromCharId,
        nextCharId,
        [...current.chain, nextRel]
      );

      if (deduction) {
        deductions.push(deduction);
      }

      // Add to queue for further exploration
      if (current.currentDepth < depth) {
        queue.push({
          fromCharId: current.fromCharId,
          toCharId: nextCharId,
          chain: [...current.chain, nextRel],
          currentDepth: current.currentDepth + 1
        });
      }
    }
  }

  return deductions;
}

/**
 * Try to deduce a relationship from a chain
 */
async function tryDeduceRelationship(fromCharId, toCharId, chain) {
  // Check if relationship already exists
  const existing = await guanxiService.getGuanxiByCharacter(fromCharId);
  const alreadyExists = existing.some(rel =>
    (rel.fromCharacterId === fromCharId && rel.toCharacterId === toCharId) ||
    (rel.fromCharacterId === toCharId && rel.toCharacterId === fromCharId)
  );

  if (alreadyExists) {
    return null; // Already have this relationship
  }

  // Get types for chain
  const typesInChain = [];
  for (const rel of chain) {
    const type = await typeService.getTypeById(rel.typeId);
    if (type) {
      typesInChain.push(type);
    }
  }

  // Try to find a deduction rule
  const deducedType = await findDeductionRule(typesInChain);

  if (!deducedType) {
    return null; // No rule found
  }

  // Calculate confidence based on chain length and rule quality
  const confidence = calculateConfidence(chain.length, deducedType.ruleQuality || 0.8);

  return {
    fromCharacterId: fromCharId,
    toCharacterId: toCharId,
    deducedTypeId: deducedType._id,
    deducedTypeName: deducedType.name,
    deductionChain: chain.map(rel => ({
      guanxiId: rel.id,
      fromCharacterId: rel.fromCharacterId,
      toCharacterId: rel.toCharacterId,
      typeId: rel.typeId
    })),
    confidence,
    explanation: generateExplanation(chain, typesInChain, deducedType)
  };
}

/**
 * Find deduction rule for type chain
 */
async function findDeductionRule(typeChain) {
  // Simplified rule matching - in production, this would use a rule engine
  
  if (typeChain.length === 2) {
    const [type1, type2] = typeChain;

    // Family relationship rules
    if (type1.category === 'family' && type2.category === 'family') {
      // Parent's parent = Grandparent
      if (type1.name.includes('父') && type2.name.includes('父')) {
        return await findTypeByName('亲属关系'); // Simplification
      }
      
      // Sibling's child = Niece/Nephew
      if (type1.name.includes('兄') || type1.name.includes('姐')) {
        if (type2.name.includes('子') || type2.name.includes('女')) {
          return await findTypeByName('亲属关系');
        }
      }
    }

    // Friend of friend = Potential friend
    if (type1.category === 'social' && type2.category === 'social') {
      return await findTypeByName('好友关系');
    }

    // Colleague of colleague = Potential colleague (indirect)
    if (type1.category === 'work' && type2.category === 'work') {
      if (type1.name === '同事关系' && type2.name === '同事关系') {
        return {
          _id: 'work_colleague',
          name: '同事关系',
          category: 'work',
          ruleQuality: 0.6 // Lower confidence for indirect colleagues
        };
      }
    }
  }

  return null; // No rule found
}

/**
 * Find type by name (helper)
 */
async function findTypeByName(name) {
  const allTypes = await typeService.getAllTypes();
  return allTypes.find(t => t.name === name);
}

/**
 * Calculate confidence score
 */
function calculateConfidence(chainLength, ruleQuality) {
  // Confidence decreases with chain length
  const lengthFactor = Math.max(0.3, 1 - (chainLength - 2) * 0.2);
  return Math.round(lengthFactor * ruleQuality * 100);
}

/**
 * Generate human-readable explanation
 */
function generateExplanation(chain, typeChain, deducedType) {
  const steps = typeChain.map(t => t.name).join(' → ');
  return `通过关系链 ${steps} 推导出 ${deducedType.name}`;
}

/**
 * Validate a deduction
 */
async function validateDeduction(deduction) {
  // Verify all characters exist
  const fromChar = await characterService.getCharacterById(deduction.fromCharacterId);
  const toChar = await characterService.getCharacterById(deduction.toCharacterId);

  if (!fromChar || !toChar) {
    return {
      valid: false,
      reason: 'One or more characters not found'
    };
  }

  // Verify chain is still valid
  for (const link of deduction.deductionChain) {
    const rel = await db.getById(OBJECT_STORES.GUANXI, link.guanxiId);
    if (!rel) {
      return {
        valid: false,
        reason: 'Deduction chain broken - relationship no longer exists'
      };
    }
  }

  // Check if relationship now exists
  const existing = await guanxiService.getGuanxiByCharacter(deduction.fromCharacterId);
  const alreadyExists = existing.some(rel =>
    (rel.fromCharacterId === deduction.fromCharacterId && 
     rel.toCharacterId === deduction.toCharacterId) ||
    (rel.fromCharacterId === deduction.toCharacterId && 
     rel.toCharacterId === deduction.fromCharacterId)
  );

  if (alreadyExists) {
    return {
      valid: false,
      reason: 'Relationship already exists'
    };
  }

  return {
    valid: true,
    confidence: deduction.confidence
  };
}

/**
 * Apply a deduction (create the relationship)
 */
async function applyDeduction(deduction, userConfirmed = false) {
  // Validate first
  const validation = await validateDeduction(deduction);
  
  if (!validation.valid) {
    throw new Error(`Invalid deduction: ${validation.reason}`);
  }

  // Create the relationship
  const newGuanxi = await guanxiService.createGuanxi({
    fromCharacterId: deduction.fromCharacterId,
    toCharacterId: deduction.toCharacterId,
    typeId: deduction.deducedTypeId,
    isDeduced: true,
    deductionChain: deduction.deductionChain,
    deductionConfidence: deduction.confidence,
    attributes: {},
    note: userConfirmed 
      ? `用户确认的推导关系：${deduction.explanation}`
      : `自动推导的关系：${deduction.explanation}`
  });

  return newGuanxi;
}

/**
 * Get all deductions for a character
 */
async function getDeductionsForCharacter(characterId, minConfidence = 50) {
  const relationships = await guanxiService.getGuanxiByCharacter(characterId);
  const allDeductions = [];

  for (const rel of relationships) {
    const deductions = await deduceRelations(rel.id, 2);
    allDeductions.push(...deductions);
  }

  // Filter by confidence and remove duplicates
  const uniqueDeductions = new Map();
  
  allDeductions.forEach(deduction => {
    if (deduction.confidence >= minConfidence) {
      const key = `${deduction.fromCharacterId}-${deduction.toCharacterId}-${deduction.deducedTypeId}`;
      
      // Keep the one with highest confidence
      if (!uniqueDeductions.has(key) || 
          uniqueDeductions.get(key).confidence < deduction.confidence) {
        uniqueDeductions.set(key, deduction);
      }
    }
  });

  return Array.from(uniqueDeductions.values());
}

/**
 * Batch deduce relationships for entire network
 */
async function deduceNetworkRelationships(userId = 1, minConfidence = 60) {
  const allGuanxi = await db.query(OBJECT_STORES.GUANXI, { userId });
  const allDeductions = [];

  console.log(`Starting network deduction for ${allGuanxi.length} relationships...`);

  for (const guanxi of allGuanxi) {
    try {
      const deductions = await deduceRelations(guanxi.id, 2);
      allDeductions.push(...deductions);
    } catch (error) {
      console.error(`Failed to deduce from guanxi ${guanxi.id}:`, error);
    }
  }

  // Remove duplicates and filter by confidence
  const uniqueDeductions = new Map();
  
  allDeductions.forEach(deduction => {
    if (deduction.confidence >= minConfidence) {
      const key = `${deduction.fromCharacterId}-${deduction.toCharacterId}-${deduction.deducedTypeId}`;
      
      if (!uniqueDeductions.has(key) || 
          uniqueDeductions.get(key).confidence < deduction.confidence) {
        uniqueDeductions.set(key, deduction);
      }
    }
  });

  console.log(`Found ${uniqueDeductions.size} unique deductions with confidence >= ${minConfidence}%`);

  return Array.from(uniqueDeductions.values());
}

module.exports = {
  deduceRelations,
  validateDeduction,
  applyDeduction,
  getDeductionsForCharacter,
  deduceNetworkRelationships
};
