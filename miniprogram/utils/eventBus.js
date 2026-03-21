// utils/eventBus.js - Event management for relationship deduction

class EventBus {
  constructor() {
    this.events = {};
  }

  /**
   * Subscribe to an event
   */
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  /**
   * Unsubscribe from an event
   */
  off(eventName, callback) {
    if (!this.events[eventName]) return;

    this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
  }

  /**
   * Emit an event
   */
  emit(eventName, data) {
    if (!this.events[eventName]) return;

    console.log(`[EventBus] Emitting event: ${eventName}`, data);

    this.events[eventName].forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error(`[EventBus] Error in callback for ${eventName}:`, err);
      }
    });
  }

  /**
   * Subscribe to an event once
   */
  once(eventName, callback) {
    const onceCallback = (data) => {
      callback(data);
      this.off(eventName, onceCallback);
    };
    this.on(eventName, onceCallback);
  }

  /**
   * Clear all event listeners
   */
  clear() {
    this.events = {};
  }
}

// Export singleton instance
const eventBus = new EventBus();

module.exports = eventBus;
