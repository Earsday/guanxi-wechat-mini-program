// components/alphabet-index/alphabet-index.js

/**
 * Alphabet Index Component
 * Provides quick navigation through alphabetically sorted lists
 * Supports Chinese pinyin, English letters, and custom index labels
 */
Component({
  properties: {
    // Index letters to display
    indexList: {
      type: Array,
      value: []
    },
    
    // Show all letters even if no items for that letter
    showAllLetters: {
      type: Boolean,
      value: false
    },
    
    // Highlight color for active index
    activeColor: {
      type: String,
      value: '#1989fa'
    },
    
    // Index type: 'alphabet' | 'pinyin' | 'custom'
    type: {
      type: String,
      value: 'alphabet'
    },
    
    // Enable haptic feedback
    hapticFeedback: {
      type: Boolean,
      value: true
    },
    
    // Show indicator popup when scrolling
    showIndicator: {
      type: Boolean,
      value: true
    }
  },

  data: {
    // Standard English alphabet
    standardAlphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
                      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'],
    
    // Chinese pinyin initials
    pinyinInitials: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 
                     'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z', '#'],
    
    // Current active index
    activeIndex: '',
    
    // Show indicator popup
    showIndicatorPopup: false,
    
    // Display index list (computed)
    displayIndexList: [],
    
    // Touch tracking
    touching: false
  },

  lifetimes: {
    attached() {
      this.updateDisplayIndexList();
    }
  },

  observers: {
    'indexList, showAllLetters, type': function() {
      this.updateDisplayIndexList();
    }
  },

  methods: {
    /**
     * Update the display index list based on properties
     */
    updateDisplayIndexList() {
      const { indexList, showAllLetters, type } = this.properties;
      let displayList = [];

      if (indexList && indexList.length > 0) {
        // Use custom index list
        displayList = indexList;
      } else if (showAllLetters) {
        // Use full alphabet based on type
        if (type === 'pinyin') {
          displayList = this.data.pinyinInitials;
        } else {
          displayList = this.data.standardAlphabet;
        }
      }

      this.setData({ displayIndexList: displayList });
    },

    /**
     * Handle touch start on index
     */
    onTouchStart(e) {
      this.setData({ touching: true });
      this.handleTouch(e);
    },

    /**
     * Handle touch move on index
     */
    onTouchMove(e) {
      if (!this.data.touching) return;
      this.handleTouch(e);
    },

    /**
     * Handle touch end on index
     */
    onTouchEnd(e) {
      this.setData({ 
        touching: false,
        showIndicatorPopup: false,
        activeIndex: ''
      });
    },

    /**
     * Process touch events to determine which index was touched
     */
    handleTouch(e) {
      const touch = e.touches[0];
      const { clientY } = touch;

      // Get the index bar element's position
      const query = this.createSelectorQuery();
      query.select('.alphabet-index-bar').boundingClientRect();
      query.exec((res) => {
        if (!res[0]) return;

        const { top, height } = res[0];
        const { displayIndexList } = this.data;
        
        // Calculate which index item was touched
        const relativeY = clientY - top;
        const itemHeight = height / displayIndexList.length;
        const index = Math.floor(relativeY / itemHeight);

        if (index >= 0 && index < displayIndexList.length) {
          const letter = displayIndexList[index];
          this.selectIndex(letter);
        }
      });
    },

    /**
     * Handle index item tap
     */
    onIndexTap(e) {
      const { letter } = e.currentTarget.dataset;
      this.selectIndex(letter);
    },

    /**
     * Select an index and trigger events
     */
    selectIndex(letter) {
      if (letter === this.data.activeIndex) return;

      // Haptic feedback
      if (this.properties.hapticFeedback) {
        wx.vibrateShort({
          type: 'light'
        });
      }

      // Show indicator popup
      if (this.properties.showIndicator) {
        this.setData({
          activeIndex: letter,
          showIndicatorPopup: true
        });

        // Auto hide indicator after 1 second
        clearTimeout(this.indicatorTimer);
        this.indicatorTimer = setTimeout(() => {
          this.setData({ showIndicatorPopup: false });
        }, 1000);
      } else {
        this.setData({ activeIndex: letter });
      }

      // Trigger select event
      this.triggerEvent('select', {
        index: letter,
        letter: letter
      });
    },

    /**
     * Get the first letter of a string (for sorting)
     */
    getFirstLetter(str) {
      if (!str) return '#';
      
      const firstChar = str.charAt(0).toUpperCase();
      
      // Check if it's A-Z
      if (/[A-Z]/.test(firstChar)) {
        return firstChar;
      }
      
      // For Chinese characters, try to get pinyin initial
      // This is a simplified approach; in production, use a proper pinyin library
      if (/[\u4e00-\u9fa5]/.test(firstChar)) {
        return this.getChinesePinyinInitial(firstChar);
      }
      
      // Default to '#' for non-alphabetic
      return '#';
    },

    /**
     * Get pinyin initial for Chinese character (simplified)
     * In production, replace this with a proper pinyin library
     */
    getChinesePinyinInitial(char) {
      const code = char.charCodeAt(0);
      
      // Simplified mapping based on Unicode ranges
      // This is not accurate and should be replaced with a real pinyin library
      if (code >= 0x4e00 && code <= 0x9fa5) {
        // Very rough approximation
        const ranges = [
          [0x4e00, 0x4fff, 'A'], [0x5000, 0x53ff, 'B'], [0x5400, 0x57ff, 'C'],
          [0x5800, 0x5bff, 'D'], [0x5c00, 0x5fff, 'E'], [0x6000, 0x63ff, 'F'],
          [0x6400, 0x67ff, 'G'], [0x6800, 0x6bff, 'H'], [0x6c00, 0x6fff, 'J'],
          [0x7000, 0x73ff, 'K'], [0x7400, 0x77ff, 'L'], [0x7800, 0x7bff, 'M'],
          [0x7c00, 0x7fff, 'N'], [0x8000, 0x83ff, 'P'], [0x8400, 0x87ff, 'Q'],
          [0x8800, 0x8bff, 'R'], [0x8c00, 0x8fff, 'S'], [0x9000, 0x93ff, 'T'],
          [0x9400, 0x97ff, 'W'], [0x9800, 0x9bff, 'X'], [0x9c00, 0x9eff, 'Y'],
          [0x9f00, 0x9fa5, 'Z']
        ];
        
        for (let [start, end, letter] of ranges) {
          if (code >= start && code <= end) {
            return letter;
          }
        }
      }
      
      return '#';
    },

    /**
     * Public method: scroll to specific index
     */
    scrollToIndex(letter) {
      this.selectIndex(letter);
    },

    /**
     * Public method: reset active index
     */
    reset() {
      this.setData({
        activeIndex: '',
        showIndicatorPopup: false
      });
    }
  }
});
