// components/skeleton/skeleton.js
Component({
  properties: {
    // Skeleton type: list, card, profile, stats, form
    type: {
      type: String,
      value: 'list'
    },
    
    // Number of items to show
    rows: {
      type: Number,
      value: 3
    },
    
    // Show avatar/image placeholder
    avatar: {
      type: Boolean,
      value: false
    },
    
    // Animation enabled
    animated: {
      type: Boolean,
      value: true
    },
    
    // Loading state
    loading: {
      type: Boolean,
      value: true
    }
  },

  data: {
    items: []
  },

  lifetimes: {
    attached() {
      this.generateItems();
    }
  },

  observers: {
    'rows': function(newRows) {
      this.generateItems();
    }
  },

  methods: {
    generateItems() {
      const items = [];
      for (let i = 0; i < this.data.rows; i++) {
        items.push({ id: i });
      }
      this.setData({ items });
    }
  }
});
