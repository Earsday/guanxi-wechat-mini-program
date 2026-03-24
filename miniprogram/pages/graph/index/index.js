// pages/graph/index/index.js
const i18n = require('../../../utils/i18n.js');
const graphService = require('../../../services/graphService.js');
const characterService = require('../../../services/characterService.js');
const typeService = require('../../../services/typeService.js');

Page({
  data: {
    t: {},
    // Graph data
    nodes: [],
    edges: [],
    positions: [],
    graphStats: null,
    // Center character
    centerCharacterId: null,
    centerCharacterName: '',
    // Layout
    currentLayout: 'force', // force, circular, hierarchical, radial
    layoutOptions: [
      { id: 'force', name: 'Force-Directed' },
      { id: 'circular', name: 'Circular' },
      { id: 'hierarchical', name: 'Hierarchical' },
      { id: 'radial', name: 'Radial' }
    ],
    // Filters
    selectedTypeIds: [],
    excludeDeduced: false,
    maxDepth: 3,
    // UI state
    loading: false,
    showFilters: false,
    showLayoutPicker: false,
    showCenterPicker: false,
    // Available characters for center selection
    availableCharacters: []
  },

  onLoad: function (options) {
    this.setI18nMessages();
    
    // Get center character from params or use first character
    const centerId = options.centerId;
    if (centerId) {
      this.setData({ centerCharacterId: centerId });
      this.loadGraph();
    } else {
      this.selectCenterCharacter();
    }
  },

  onShow: function () {
    this.setI18nMessages();
  },

  /**
   * Set i18n messages
   */
  setI18nMessages() {
    const t = i18n.t('pages.graph') || {};
    if (Object.keys(t).length > 0) {
      this.setData({ t });
    }
  },

  /**
   * Prompt to select center character
   */
  async selectCenterCharacter() {
    try {
      const characters = await characterService.queryCharacters();
      
      if (characters.length === 0) {
        wx.showModal({
          title: this.data.t.noCenterTitle || 'No Characters',
          content: this.data.t.noCenterMessage || 'Please create characters first',
          showCancel: false,
          success: () => {
            wx.switchTab({ url: '/pages/index/index' });
          }
        });
        return;
      }

      this.setData({
        availableCharacters: characters,
        showCenterPicker: true
      });

      // Auto-select first character
      if (characters.length > 0) {
        this.onCenterSelect(characters[0].id);
      }
    } catch (error) {
      console.error('Failed to load characters:', error);
      wx.showToast({
        title: this.data.t.loadError || 'Load failed',
        icon: 'none'
      });
    }
  },

  /**
   * Handle center character selection
   */
  onCenterSelect(characterId) {
    const character = this.data.availableCharacters.find(c => c.id === characterId);
    
    this.setData({
      centerCharacterId: characterId,
      centerCharacterName: character?.name || '',
      showCenterPicker: false
    });

    this.loadGraph();
  },

  /**
   * Load graph data
   */
  async loadGraph() {
    if (!this.data.centerCharacterId) return;

    this.setData({ loading: true });

    try {
      // Build filters
      const filters = {
        maxDepth: this.data.maxDepth
      };

      if (this.data.selectedTypeIds.length > 0) {
        filters.typeIds = this.data.selectedTypeIds;
      }

      if (this.data.excludeDeduced) {
        filters.excludeDeduced = true;
      }

      // Generate graph
      const graph = await graphService.generateGraph(
        this.data.centerCharacterId,
        filters,
        true // use cache
      );

      // Calculate layout
      const positions = await graphService.calculateLayout(
        graph.nodes,
        graph.edges,
        this.data.currentLayout
      );

      this.setData({
        nodes: graph.nodes,
        edges: graph.edges,
        positions,
        graphStats: graph.stats,
        loading: false
      });

    } catch (error) {
      console.error('Failed to load graph:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: this.data.t.loadError || 'Load failed',
        icon: 'none'
      });
    }
  },

  /**
   * Change layout algorithm
   */
  async onLayoutChange(layoutId) {
    this.setData({
      currentLayout: layoutId,
      showLayoutPicker: false,
      loading: true
    });

    try {
      const positions = await graphService.calculateLayout(
        this.data.nodes,
        this.data.edges,
        layoutId
      );

      this.setData({
        positions,
        loading: false
      });
    } catch (error) {
      console.error('Failed to change layout:', error);
      this.setData({ loading: false });
    }
  },

  /**
   * Toggle filters panel
   */
  toggleFilters() {
    this.setData({
      showFilters: !this.data.showFilters
    });
  },

  /**
   * Toggle layout picker
   */
  toggleLayoutPicker() {
    this.setData({
      showLayoutPicker: !this.data.showLayoutPicker
    });
  },

  /**
   * Toggle center picker
   */
  toggleCenterPicker() {
    this.setData({
      showCenterPicker: !this.data.showCenterPicker
    });
  },

  /**
   * Apply filters
   */
  onFilterApply(e) {
    const { typeIds, excludeDeduced, maxDepth } = e.detail;
    
    this.setData({
      selectedTypeIds: typeIds || [],
      excludeDeduced: excludeDeduced || false,
      maxDepth: maxDepth || 3,
      showFilters: false
    });

    this.loadGraph();
  },

  /**
   * Handle node tap from canvas
   */
  onNodeTap(e) {
    const { node, characterId } = e.detail;

    wx.showModal({
      title: node.character?.name || 'Character',
      content: this.data.t.nodeActions || 'What would you like to do?',
      confirmText: this.data.t.viewDetail || 'View Detail',
      cancelText: this.data.t.setAsCenter || 'Set as Center',
      success: (res) => {
        if (res.confirm) {
          // Navigate to character detail
          wx.navigateTo({
            url: `/pages/characters/detail/detail?id=${characterId}`
          });
        } else if (res.cancel) {
          // Set as new center
          this.onCenterSelect(characterId);
        }
      }
    });
  },

  /**
   * Export graph as image
   */
  async onExport() {
    try {
      wx.showLoading({ title: this.data.t.exporting || 'Exporting...' });

      // Get canvas component reference
      const canvas = this.selectComponent('#graph-canvas');
      if (!canvas) {
        throw new Error('Canvas component not found');
      }

      // Export image
      const imagePath = await canvas.exportImage();

      wx.hideLoading();

      // Show save dialog
      wx.showModal({
        title: this.data.t.exportSuccess || 'Export Success',
        content: this.data.t.saveToAlbum || 'Save to album?',
        success: (res) => {
          if (res.confirm) {
            wx.saveImageToPhotosAlbum({
              filePath: imagePath,
              success: () => {
                wx.showToast({
                  title: this.data.t.saved || 'Saved',
                  icon: 'success'
                });
              },
              fail: (err) => {
                console.error('Save failed:', err);
                wx.showToast({
                  title: this.data.t.saveFailed || 'Save failed',
                  icon: 'none'
                });
              }
            });
          }
        }
      });

    } catch (error) {
      console.error('Export failed:', error);
      wx.hideLoading();
      wx.showToast({
        title: this.data.t.exportFailed || 'Export failed',
        icon: 'none'
      });
    }
  },

  /**
   * Refresh graph
   */
  onRefresh() {
    this.loadGraph();
  },

  /**
   * Show graph analysis
   */
  async onAnalyze() {
    if (!this.data.centerCharacterId) return;

    try {
      wx.showLoading({ title: this.data.t.analyzing || 'Analyzing...' });

      const analysis = await graphService.analyzeGraph(this.data.centerCharacterId);

      wx.hideLoading();

      // Format analysis result
      const content = `
${this.data.t.totalCharacters || 'Total Characters'}: ${analysis.totalCharacters}
${this.data.t.totalRelationships || 'Total Relationships'}: ${analysis.totalRelationships}
${this.data.t.averageDegree || 'Average Degree'}: ${analysis.averageDegree.toFixed(2)}
${this.data.t.networkDensity || 'Network Density'}: ${analysis.networkDensity}
${this.data.t.clusteringCoefficient || 'Clustering Coefficient'}: ${analysis.clusteringCoefficient}
      `.trim();

      wx.showModal({
        title: this.data.t.graphAnalysis || 'Graph Analysis',
        content,
        showCancel: false
      });

    } catch (error) {
      console.error('Analysis failed:', error);
      wx.hideLoading();
      wx.showToast({
        title: this.data.t.analysisFailed || 'Analysis failed',
        icon: 'none'
      });
    }
  }
});
