// components/graph-canvas/graph-canvas.js
const i18n = require('../../utils/i18n.js');

Component({
  properties: {
    // Graph data from graphService
    nodes: {
      type: Array,
      value: []
    },
    edges: {
      type: Array,
      value: []
    },
    // Node positions from calculateLayout
    positions: {
      type: Array,
      value: []
    },
    // Canvas dimensions
    width: {
      type: Number,
      value: 750
    },
    height: {
      type: Number,
      value: 1000
    },
    // Visual settings
    nodeRadius: {
      type: Number,
      value: 30
    },
    showLabels: {
      type: Boolean,
      value: true
    },
    enableZoom: {
      type: Boolean,
      value: true
    },
    enablePan: {
      type: Boolean,
      value: true
    }
  },

  data: {
    canvasId: 'graph-canvas',
    // Transform state
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    // Interaction state
    lastTouchX: 0,
    lastTouchY: 0,
    touchStartDistance: 0,
    isDragging: false,
    // Selected node
    selectedNodeId: null
  },

  lifetimes: {
    attached() {
      this.setData({
        canvasId: `graph-canvas-${Date.now()}`
      });
    },

    ready() {
      this.ctx = wx.createCanvasContext(this.data.canvasId, this);
      this.renderGraph();
    }
  },

  observers: {
    'nodes, edges, positions': function() {
      if (this.ctx) {
        this.renderGraph();
      }
    }
  },

  methods: {
    /**
     * Main render function
     */
    renderGraph() {
      if (!this.ctx || this.data.nodes.length === 0) return;

      const { scale, offsetX, offsetY } = this.data;

      // Clear canvas
      this.ctx.clearRect(0, 0, this.properties.width, this.properties.height);
      
      // Apply transformations
      this.ctx.save();
      this.ctx.translate(offsetX, offsetY);
      this.ctx.scale(scale, scale);

      // Render edges first (so they appear behind nodes)
      this.renderEdges();

      // Render nodes
      this.renderNodes();

      // Restore context
      this.ctx.restore();

      // Draw to screen
      this.ctx.draw();
    },

    /**
     * Render all edges
     */
    renderEdges() {
      const { edges, positions } = this.data;

      edges.forEach(edge => {
        const sourcePos = positions.find(p => p.id === edge.source);
        const targetPos = positions.find(p => p.id === edge.target);

        if (!sourcePos || !targetPos) return;

        // Edge style based on relationship type
        const isDeduced = edge.isDeduced;
        this.ctx.beginPath();
        this.ctx.moveTo(sourcePos.x, sourcePos.y);
        this.ctx.lineTo(targetPos.x, targetPos.y);
        
        // Different styles for deduced vs explicit relationships
        if (isDeduced) {
          this.ctx.setLineDash([5, 5]);
          this.ctx.strokeStyle = '#ccc';
          this.ctx.lineWidth = 1;
        } else {
          this.ctx.setLineDash([]);
          this.ctx.strokeStyle = '#999';
          this.ctx.lineWidth = 2;
        }
        
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Draw arrow head for directed edges
        if (edge.type && !edge.type.bidirectional) {
          this.drawArrowHead(sourcePos, targetPos);
        }
      });
    },

    /**
     * Draw arrow head at the target end
     */
    drawArrowHead(sourcePos, targetPos) {
      const nodeRadius = this.properties.nodeRadius;
      const arrowSize = 10;

      // Calculate direction vector
      const dx = targetPos.x - sourcePos.x;
      const dy = targetPos.y - sourcePos.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      if (length === 0) return;

      // Normalize and shorten to node edge
      const unitX = dx / length;
      const unitY = dy / length;
      const arrowX = targetPos.x - unitX * nodeRadius;
      const arrowY = targetPos.y - unitY * nodeRadius;

      // Draw arrow
      this.ctx.save();
      this.ctx.translate(arrowX, arrowY);
      this.ctx.rotate(Math.atan2(dy, dx));
      
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(-arrowSize, -arrowSize / 2);
      this.ctx.lineTo(-arrowSize, arrowSize / 2);
      this.ctx.closePath();
      this.ctx.fillStyle = '#999';
      this.ctx.fill();
      
      this.ctx.restore();
    },

    /**
     * Render all nodes
     */
    renderNodes() {
      const { nodes, positions, selectedNodeId } = this.data;
      const nodeRadius = this.properties.nodeRadius;

      nodes.forEach(node => {
        const pos = positions.find(p => p.id === node.id);
        if (!pos) return;

        const isSelected = node.id === selectedNodeId;
        const isCenter = node.isCenter;

        // Node circle
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI);
        
        // Different colors for center, selected, and normal nodes
        if (isCenter) {
          this.ctx.fillStyle = '#ff6b6b';
        } else if (isSelected) {
          this.ctx.fillStyle = '#4dabf7';
        } else {
          this.ctx.fillStyle = '#5B8FF9';
        }
        
        this.ctx.fill();
        
        // Node border
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = isSelected ? 4 : 2;
        this.ctx.stroke();

        // Node label
        if (this.properties.showLabels) {
          this.ctx.fillStyle = '#333';
          this.ctx.font = '24rpx sans-serif';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'top';
          
          const name = node.character?.name || 'Unknown';
          this.ctx.fillText(name, pos.x, pos.y + nodeRadius + 5);
        }

        // Level indicator (optional)
        if (node.level > 0) {
          this.ctx.fillStyle = '#fff';
          this.ctx.font = 'bold 20rpx sans-serif';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(node.level.toString(), pos.x, pos.y);
        }
      });
    },

    /**
     * Touch start handler
     */
    onTouchStart(e) {
      const touches = e.touches;
      
      if (touches.length === 1) {
        // Single touch - check for node tap or start pan
        const touch = touches[0];
        this.setData({
          lastTouchX: touch.x,
          lastTouchY: touch.y,
          isDragging: false
        });

        // Check if tapped on a node
        const tappedNode = this.findNodeAtPosition(touch.x, touch.y);
        if (tappedNode) {
          this.onNodeTap(tappedNode);
        }
      } else if (touches.length === 2) {
        // Two touches - start pinch zoom
        const distance = this.getTouchDistance(touches[0], touches[1]);
        this.setData({
          touchStartDistance: distance
        });
      }
    },

    /**
     * Touch move handler
     */
    onTouchMove(e) {
      const touches = e.touches;

      if (touches.length === 1 && this.properties.enablePan) {
        // Single touch - pan
        const touch = touches[0];
        const deltaX = touch.x - this.data.lastTouchX;
        const deltaY = touch.y - this.data.lastTouchY;

        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
          this.setData({
            isDragging: true,
            offsetX: this.data.offsetX + deltaX,
            offsetY: this.data.offsetY + deltaY,
            lastTouchX: touch.x,
            lastTouchY: touch.y
          });

          this.renderGraph();
        }
      } else if (touches.length === 2 && this.properties.enableZoom) {
        // Two touches - pinch zoom
        const distance = this.getTouchDistance(touches[0], touches[1]);
        const scale = distance / this.data.touchStartDistance;
        
        const newScale = Math.max(0.5, Math.min(3, this.data.scale * scale));
        
        this.setData({
          scale: newScale,
          touchStartDistance: distance
        });

        this.renderGraph();
      }
    },

    /**
     * Touch end handler
     */
    onTouchEnd(e) {
      this.setData({
        isDragging: false,
        touchStartDistance: 0
      });
    },

    /**
     * Find node at touch position
     */
    findNodeAtPosition(touchX, touchY) {
      const { nodes, positions, scale, offsetX, offsetY } = this.data;
      const nodeRadius = this.properties.nodeRadius;

      // Transform touch coordinates to canvas coordinates
      const canvasX = (touchX - offsetX) / scale;
      const canvasY = (touchY - offsetY) / scale;

      for (let node of nodes) {
        const pos = positions.find(p => p.id === node.id);
        if (!pos) continue;

        const distance = Math.sqrt(
          Math.pow(canvasX - pos.x, 2) + 
          Math.pow(canvasY - pos.y, 2)
        );

        if (distance <= nodeRadius) {
          return node;
        }
      }

      return null;
    },

    /**
     * Get distance between two touches (for pinch zoom)
     */
    getTouchDistance(touch1, touch2) {
      const dx = touch1.x - touch2.x;
      const dy = touch1.y - touch2.y;
      return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * Handle node tap
     */
    onNodeTap(node) {
      if (this.data.isDragging) return;

      // Highlight selected node
      this.setData({
        selectedNodeId: node.id
      });

      this.renderGraph();

      // Emit event to parent
      this.triggerEvent('nodetap', {
        node,
        characterId: node.character?.id || node.id
      });

      // Provide haptic feedback
      wx.vibrateShort({ type: 'light' });
    },

    /**
     * Reset view to default
     */
    resetView() {
      this.setData({
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        selectedNodeId: null
      });
      this.renderGraph();
    },

    /**
     * Zoom to specific scale
     */
    zoomTo(scale) {
      this.setData({
        scale: Math.max(0.5, Math.min(3, scale))
      });
      this.renderGraph();
    },

    /**
     * Center view on a specific node
     */
    centerOnNode(nodeId) {
      const pos = this.data.positions.find(p => p.id === nodeId);
      if (!pos) return;

      const centerX = this.properties.width / 2;
      const centerY = this.properties.height / 2;

      this.setData({
        offsetX: centerX - pos.x * this.data.scale,
        offsetY: centerY - pos.y * this.data.scale,
        selectedNodeId: nodeId
      });

      this.renderGraph();
    },

    /**
     * Export canvas as image
     */
    exportImage() {
      return new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
          canvasId: this.data.canvasId,
          success: res => resolve(res.tempFilePath),
          fail: reject
        }, this);
      });
    }
  }
});
