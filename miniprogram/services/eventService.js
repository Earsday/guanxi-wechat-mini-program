// services/eventService.js - Event timeline management

const { db, OBJECT_STORES } = require('./indexedDB.js');
const characterService = require('./characterService.js');
const guanxiService = require('./guanxiService.js');

/**
 * Create a new event
 */
async function createEvent(eventData) {
  const userId = eventData.userId || 1;

  const newEvent = {
    userId,
    characterId: eventData.characterId || null,
    guanxiId: eventData.guanxiId || null,
    
    // Event details
    eventType: eventData.eventType, // birthday/anniversary/meeting/contact/milestone/custom
    eventTime: eventData.eventTime, // ISO 8601 datetime
    title: eventData.title,
    description: eventData.description || '',
    location: eventData.location || '',
    
    // Participants
    participants: eventData.participants || [], // Array of character IDs
    
    // Metadata
    tags: eventData.tags || [],
    attachments: eventData.attachments || [],
    metadata: eventData.metadata || {},
    
    // Importance
    importance: eventData.importance || 'normal', // low/normal/high
    
    // Privacy
    isPrivate: eventData.isPrivate || false
  };

  const created = await db.add(OBJECT_STORES.EVENTS, newEvent);

  // Emit event for potential integrations
  const eventBus = require('../utils/eventBus.js');
  eventBus.emit('event:created', created);

  return created;
}

/**
 * Update event
 */
async function updateEvent(id, updates) {
  const existing = await db.getById(OBJECT_STORES.EVENTS, id);
  
  if (!existing) {
    throw new Error(`Event with id ${id} not found`);
  }

  const updated = {
    ...existing,
    ...updates,
    updatedAt: Date.now()
  };

  await db.update(OBJECT_STORES.EVENTS, id, updated);

  // Emit event
  const eventBus = require('../utils/eventBus.js');
  eventBus.emit('event:updated', updated);

  return updated;
}

/**
 * Delete event
 */
async function deleteEvent(id) {
  const event = await db.getById(OBJECT_STORES.EVENTS, id);
  
  if (!event) {
    throw new Error(`Event with id ${id} not found`);
  }

  await db.delete(OBJECT_STORES.EVENTS, id);

  // Emit event
  const eventBus = require('../utils/eventBus.js');
  eventBus.emit('event:deleted', event);
}

/**
 * Get timeline for a character
 */
async function getTimeline(characterId, guanxiId = null, timeRange = {}) {
  const conditions = { characterId };
  
  if (guanxiId) {
    conditions.guanxiId = guanxiId;
  }

  let events = await db.query(OBJECT_STORES.EVENTS, conditions);

  // Filter by time range if specified
  if (timeRange.start || timeRange.end) {
    events = events.filter(event => {
      const eventTime = new Date(event.eventTime).getTime();
      
      if (timeRange.start && eventTime < new Date(timeRange.start).getTime()) {
        return false;
      }
      
      if (timeRange.end && eventTime > new Date(timeRange.end).getTime()) {
        return false;
      }
      
      return true;
    });
  }

  // Sort by time (most recent first)
  events.sort((a, b) => new Date(b.eventTime) - new Date(a.eventTime));

  // Enrich with character and relationship info
  for (const event of events) {
    if (event.characterId) {
      event.character = await characterService.getCharacterById(event.characterId);
    }
    
    if (event.guanxiId) {
      event.guanxi = await guanxiService.getGuanxi(event.guanxiId);
    }

    // Get participant details
    if (event.participants && event.participants.length > 0) {
      event.participantDetails = [];
      for (const participantId of event.participants) {
        const participant = await characterService.getCharacterById(participantId);
        if (participant) {
          event.participantDetails.push(participant);
        }
      }
    }
  }

  return events;
}

/**
 * Get events by type
 */
async function getEventsByType(eventType, limit = 50) {
  const events = await db.query(OBJECT_STORES.EVENTS, { eventType });
  
  // Sort by time
  events.sort((a, b) => new Date(b.eventTime) - new Date(a.eventTime));

  return events.slice(0, limit);
}

/**
 * Get upcoming events
 */
async function getUpcomingEvents(days = 7, limit = 50) {
  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + days);

  const allEvents = await db.getAll(OBJECT_STORES.EVENTS);

  const upcoming = allEvents.filter(event => {
    const eventTime = new Date(event.eventTime);
    return eventTime >= now && eventTime <= endDate;
  });

  // Sort by time
  upcoming.sort((a, b) => new Date(a.eventTime) - new Date(b.eventTime));

  // Enrich
  for (const event of upcoming.slice(0, limit)) {
    if (event.characterId) {
      event.character = await characterService.getCharacterById(event.characterId);
    }
  }

  return upcoming.slice(0, limit);
}

/**
 * Get events in date range
 */
async function getEventsInRange(startDate, endDate) {
  const allEvents = await db.getAll(OBJECT_STORES.EVENTS);

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  const eventsInRange = allEvents.filter(event => {
    const eventTime = new Date(event.eventTime).getTime();
    return eventTime >= start && eventTime <= end;
  });

  // Sort by time
  eventsInRange.sort((a, b) => new Date(a.eventTime) - new Date(b.eventTime));

  return eventsInRange;
}

/**
 * Get recent events
 */
async function getRecentEvents(limit = 20) {
  const allEvents = await db.getAll(OBJECT_STORES.EVENTS);

  // Sort by time (most recent first)
  allEvents.sort((a, b) => new Date(b.eventTime) - new Date(a.eventTime));

  const recent = allEvents.slice(0, limit);

  // Enrich
  for (const event of recent) {
    if (event.characterId) {
      event.character = await characterService.getCharacterById(event.characterId);
    }
  }

  return recent;
}

/**
 * Search events
 */
async function searchEvents(keyword, limit = 50) {
  const allEvents = await db.getAll(OBJECT_STORES.EVENTS);

  if (!keyword || keyword.trim() === '') {
    return allEvents.slice(0, limit);
  }

  const lowerKeyword = keyword.toLowerCase();

  const results = allEvents.filter(event => {
    return (
      event.title.toLowerCase().includes(lowerKeyword) ||
      (event.description && event.description.toLowerCase().includes(lowerKeyword)) ||
      (event.location && event.location.toLowerCase().includes(lowerKeyword)) ||
      (event.tags && event.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)))
    );
  });

  // Sort by relevance (time)
  results.sort((a, b) => new Date(b.eventTime) - new Date(a.eventTime));

  return results.slice(0, limit);
}

/**
 * Get event statistics
 */
async function getEventStatistics(characterId = null) {
  let events;
  
  if (characterId) {
    events = await db.query(OBJECT_STORES.EVENTS, { characterId });
  } else {
    events = await db.getAll(OBJECT_STORES.EVENTS);
  }

  // Count by type
  const typeDistribution = {};
  events.forEach(event => {
    typeDistribution[event.eventType] = (typeDistribution[event.eventType] || 0) + 1;
  });

  // Count by month (last 12 months)
  const monthlyDistribution = {};
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    monthlyDistribution[key] = 0;
  }

  events.forEach(event => {
    const eventDate = new Date(event.eventTime);
    const key = `${eventDate.getFullYear()}-${(eventDate.getMonth() + 1).toString().padStart(2, '0')}`;
    if (monthlyDistribution.hasOwnProperty(key)) {
      monthlyDistribution[key]++;
    }
  });

  return {
    totalEvents: events.length,
    typeDistribution,
    monthlyDistribution,
    averageEventsPerMonth: (events.length / 12).toFixed(1)
  };
}

/**
 * Auto-generate birthday events from characters
 */
async function generateBirthdayEvents() {
  const characters = await characterService.getAllCharacters();
  const generated = [];

  for (const character of characters) {
    if (!character.birthday?.solar) continue;

    // Get current year birthday
    const [year, month, day] = character.birthday.solar.split('-');
    const currentYear = new Date().getFullYear();
    const birthdayThisYear = `${currentYear}-${month}-${day}T00:00:00`;

    // Check if event already exists
    const existing = await db.query(OBJECT_STORES.EVENTS, {
      characterId: character.id,
      eventType: 'birthday'
    });

    const existingThisYear = existing.find(e => 
      e.eventTime.startsWith(`${currentYear}-${month}-${day}`)
    );

    if (!existingThisYear) {
      const event = await createEvent({
        characterId: character.id,
        eventType: 'birthday',
        eventTime: birthdayThisYear,
        title: `${character.displayName || character.name}的生日`,
        description: `${character.displayName || character.name}的生日`,
        importance: 'high',
        metadata: {
          autoGenerated: true,
          age: currentYear - parseInt(year)
        }
      });

      generated.push(event);
    }
  }

  return generated;
}

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getTimeline,
  getEventsByType,
  getUpcomingEvents,
  getEventsInRange,
  getRecentEvents,
  searchEvents,
  getEventStatistics,
  generateBirthdayEvents
};
