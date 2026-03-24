// services/graphService.js - Relationship graph generation and visualization

const { db, OBJECT_STORES } = require('./indexedDB.js');
const characterService = require('./characterService.js');
const guanxiService = require('./guanxiService.js');
const typeService = require('./typeService.js');

/**
 * Generate relationship graph centered on a character
 */
async function generateGraph(centerCharacterId, filters = {}, useCache = true) {
  const cacheKey = `graph_${centerCharacterId}_${JSON.stringify(filters)}`;

  // Check cache if enabled
  if (useCache) {
    const cached = await getCachedGraph(cacheKey);
    if (cached && Date.now() - cached.createdAt < 3600000) { // 1 hour cache
      return cached.graph;
    }
  }

  // Get center character
  const centerCharacter = await characterService.getCharacterById(centerCharacterId);
  if (!centerCharacter) {
    throw new Error(`Character with id ${centerCharacterId} not found`);
  }

  // Initialize graph structure
  const nodes = new Map();
  const edges = [];
  const visited = new Set();

  // Add center node
  nodes.set(centerCharacterId, {
    id: centerCharacterId,
    character: centerCharacter,
    level: 0,
    isCenter: true
  });

  // BFS to explore relationship network
  const maxDepth = filters.maxDepth || 3;
  const queue = [{ characterId: centerCharacterId, depth: 0 }];

  while (queue.length > 0) {
    const { characterId, depth } = queue.shift();

    if (depth >= maxDepth) continue;
    if (visited.has(characterId)) continue;

    visited.add(characterId);

    // Get all relationships for this character
    const relationships = await guanxiService.getGuanxiByCharacter(characterId);

    for (const rel of relationships) {
      // Apply filters
      if (filters.typeIds && !filters.typeIds.includes(rel.typeId)) {
        continue;
      }

      if (filters.excludeDeduced && rel.isDeduced) {
        continue;
      }

      // Determine the connected character
      const connectedId = rel.fromCharacterId === characterId 
        ? rel.toCharacterId 
        : rel.fromCharacterId;

      // Add node if not already added
      if (!nodes.has(connectedId)) {
        const connectedChar = await characterService.getCharacterById(connectedId);
        if (connectedChar) {
          nodes.set(connectedId, {
            id: connectedId,
            character: connectedChar,
            level: depth + 1,
            isCenter: false
          });

          // Add to queue for further exploration
          queue.push({ characterId: connectedId, depth: depth + 1 });
        }
      }

      // Add edge
      const type = await typeService.getTypeById(rel.typeId);
      edges.push({
        id: `edge_${rel.id}`,
        guanxiId: rel.id,
        source: rel.fromCharacterId,
        target: rel.toCharacterId,
        type: type,
        attributes: rel.attributes,
        isDeduced: rel.isDeduced || false,
        deductionConfidence: rel.deductionConfidence
      });
    }
  }

  const graph = {
    centerCharacterId,
    nodes: Array.from(nodes.values()),
    edges,
    stats: {
      totalNodes: nodes.size,
      totalEdges: edges.length,
      maxDepth: Math.max(...Array.from(nodes.values()).map(n => n.level))
    },
    filters,
    generatedAt: Date.now()
  };

  // Cache the result
  if (useCache) {
    await cacheGraph(cacheKey, graph);
  }

  return graph;
}

/**
 * Calculate layout positions for graph nodes
 */
async function calculateLayout(nodes, edges, layoutType = 'force') {
  switch (layoutType) {
    case 'force':
      return calculateForceDirectedLayout(nodes, edges);
    case 'circular':
      return calculateCircularLayout(nodes, edges);
    case 'hierarchical':
      return calculateHierarchicalLayout(nodes, edges);
    case 'radial':
      return calculateRadialLayout(nodes, edges);
    default:
      return calculateForceDirectedLayout(nodes, edges);
  }
}

/**
 * Force-directed layout algorithm (simplified)
 */
function calculateForceDirectedLayout(nodes, edges) {
  const width = 750; // Canvas width
  const height = 1000; // Canvas height
  
  // Initialize random positions
  const positions = nodes.map((node, index) => ({
    id: node.id,
    x: Math.random() * width,
    y: Math.random() * height,
    vx: 0,
    vy: 0
  }));

  // Simplified force simulation (in production, use a proper physics engine)
  const iterations = 50;
  const k = Math.sqrt((width * height) / nodes.length); // Ideal distance

  for (let iter = 0; iter < iterations; iter++) {
    // Repulsive forces between all nodes
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[j].x - positions[i].x;
        const dy = positions[j].y - positions[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (k * k) / distance;

        positions[i].vx -= (dx / distance) * force;
        positions[i].vy -= (dy / distance) * force;
        positions[j].vx += (dx / distance) * force;
        positions[j].vy += (dy / distance) * force;
      }
    }

    // Attractive forces for connected nodes
    edges.forEach(edge => {
      const sourcePos = positions.find(p => p.id === edge.source);
      const targetPos = positions.find(p => p.id === edge.target);
      
      if (sourcePos && targetPos) {
        const dx = targetPos.x - sourcePos.x;
        const dy = targetPos.y - sourcePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (distance * distance) / k;

        sourcePos.vx += (dx / distance) * force * 0.1;
        sourcePos.vy += (dy / distance) * force * 0.1;
        targetPos.vx -= (dx / distance) * force * 0.1;
        targetPos.vy -= (dy / distance) * force * 0.1;
      }
    });

    // Update positions with damping
    positions.forEach(pos => {
      pos.x += pos.vx * 0.1;
      pos.y += pos.vy * 0.1;
      pos.vx *= 0.95;
      pos.vy *= 0.95;

      // Keep within bounds
      pos.x = Math.max(50, Math.min(width - 50, pos.x));
      pos.y = Math.max(50, Math.min(height - 50, pos.y));
    });
  }

  return positions;
}

/**
 * Circular layout
 */
function calculateCircularLayout(nodes, edges) {
  const width = 750;
  const height = 1000;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.4;

  // Find center node
  const centerNode = nodes.find(n => n.isCenter);
  const otherNodes = nodes.filter(n => !n.isCenter);

  const positions = [];

  // Place center node
  if (centerNode) {
    positions.push({
      id: centerNode.id,
      x: centerX,
      y: centerY
    });
  }

  // Place other nodes in circle
  otherNodes.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / otherNodes.length;
    positions.push({
      id: node.id,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    });
  });

  return positions;
}

/**
 * Hierarchical layout (by relationship level)
 */
function calculateHierarchicalLayout(nodes, edges) {
  const width = 750;
  const height = 1000;
  
  // Group nodes by level
  const levels = new Map();
  nodes.forEach(node => {
    if (!levels.has(node.level)) {
      levels.set(node.level, []);
    }
    levels.get(node.level).push(node);
  });

  const positions = [];
  const maxLevel = Math.max(...Array.from(levels.keys()));
  const levelHeight = height / (maxLevel + 2);

  levels.forEach((levelNodes, level) => {
    const levelWidth = width / (levelNodes.length + 1);
    levelNodes.forEach((node, index) => {
      positions.push({
        id: node.id,
        x: levelWidth * (index + 1),
        y: levelHeight * (level + 1)
      });
    });
  });

  return positions;
}

/**
 * Radial layout (concentric circles by level)
 */
function calculateRadialLayout(nodes, edges) {
  const width = 750;
  const height = 1000;
  const centerX = width / 2;
  const centerY = height / 2;

  // Group by level
  const levels = new Map();
  nodes.forEach(node => {
    if (!levels.has(node.level)) {
      levels.set(node.level, []);
    }
    levels.get(node.level).push(node);
  });

  const positions = [];
  const maxLevel = Math.max(...Array.from(levels.keys()));
  const radiusStep = Math.min(width, height) * 0.4 / (maxLevel + 1);

  levels.forEach((levelNodes, level) => {
    const radius = radiusStep * (level + 1);
    levelNodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / levelNodes.length;
      positions.push({
        id: node.id,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      });
    });
  });

  return positions;
}

/**
 * Analyze graph structure and provide insights
 */
async function analyzeGraph(characterId) {
  const graph = await generateGraph(characterId, { maxDepth: 3 });

  // Calculate degree centrality
  const degreeCentrality = new Map();
  graph.nodes.forEach(node => {
    const degree = graph.edges.filter(e => 
      e.source === node.id || e.target === node.id
    ).length;
    degreeCentrality.set(node.id, degree);
  });

  // Find most connected characters
  const sortedByDegree = Array.from(degreeCentrality.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Analyze relationship type distribution
  const typeDistribution = new Map();
  graph.edges.forEach(edge => {
    const typeName = edge.type?.name || 'Unknown';
    typeDistribution.set(typeName, (typeDistribution.get(typeName) || 0) + 1);
  });

  // Calculate clustering coefficient (simplified)
  const clusteringCoefficient = calculateClusteringCoefficient(graph);

  return {
    totalCharacters: graph.nodes.length,
    totalRelationships: graph.edges.length,
    averageDegree: graph.edges.length * 2 / graph.nodes.length,
    mostConnectedCharacters: sortedByDegree.map(([id, degree]) => ({
      characterId: id,
      character: graph.nodes.find(n => n.id === id)?.character,
      connections: degree
    })),
    typeDistribution: Array.from(typeDistribution.entries()).map(([type, count]) => ({
      type,
      count,
      percentage: (count / graph.edges.length * 100).toFixed(1)
    })),
    clusteringCoefficient,
    networkDensity: (graph.edges.length / (graph.nodes.length * (graph.nodes.length - 1) / 2)).toFixed(3)
  };
}

/**
 * Calculate clustering coefficient
 */
function calculateClusteringCoefficient(graph) {
  // Simplified implementation
  let totalCoefficient = 0;
  
  graph.nodes.forEach(node => {
    const neighbors = new Set();
    graph.edges.forEach(edge => {
      if (edge.source === node.id) neighbors.add(edge.target);
      if (edge.target === node.id) neighbors.add(edge.source);
    });

    if (neighbors.size < 2) return;

    let connections = 0;
    const neighborsArray = Array.from(neighbors);
    for (let i = 0; i < neighborsArray.length; i++) {
      for (let j = i + 1; j < neighborsArray.length; j++) {
        const hasEdge = graph.edges.some(e =>
          (e.source === neighborsArray[i] && e.target === neighborsArray[j]) ||
          (e.source === neighborsArray[j] && e.target === neighborsArray[i])
        );
        if (hasEdge) connections++;
      }
    }

    const possibleConnections = (neighbors.size * (neighbors.size - 1)) / 2;
    totalCoefficient += possibleConnections > 0 ? connections / possibleConnections : 0;
  });

  return graph.nodes.length > 0 ? (totalCoefficient / graph.nodes.length).toFixed(3) : 0;
}

/**
 * Cache graph snapshot
 */
async function cacheGraph(cacheKey, graph) {
  await db.add(OBJECT_STORES.GRAPH_SNAPSHOTS, {
    cacheKey,
    graph,
    createdAt: Date.now()
  });
}

/**
 * Get cached graph
 */
async function getCachedGraph(cacheKey) {
  const results = await db.query(OBJECT_STORES.GRAPH_SNAPSHOTS, { cacheKey });
  return results.length > 0 ? results[0] : null;
}

/**
 * Clear expired cache
 */
async function clearExpiredCache(maxAge = 86400000) { // 24 hours
  const snapshots = await db.getAll(OBJECT_STORES.GRAPH_SNAPSHOTS);
  const now = Date.now();

  for (const snapshot of snapshots) {
    if (now - snapshot.createdAt > maxAge) {
      await db.delete(OBJECT_STORES.GRAPH_SNAPSHOTS, snapshot.id);
    }
  }
}

module.exports = {
  generateGraph,
  calculateLayout,
  analyzeGraph,
  clearExpiredCache
};
