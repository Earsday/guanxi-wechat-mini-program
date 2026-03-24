# 人际关系图谱 - 技术详细设计文档

## 导航
- **上一章**: [1. 数据库详细设计](./技术详细设计-1-数据库详细设计.md)
- **返回目录**: [目录](./技术详细设计.md)
- **下一章**: [3. 核心算法设计](./技术详细设计-3-核心算法设计.md)

---

## 2. API接口设计

### 重要说明：本地服务优先架构

本系统采用**本地服务优先**的接口设计：

- **主要实现**：使用 **本地服务层（Service Layer）** 直接操作 IndexedDB
- **可选云同步**：用户启用云同步时，通过云函数进行数据同步
- **架构原则**：所有业务逻辑在本地执行，云函数仅用于数据备份和多设备同步

因此，本文档将分为两部分：

1. **§2.1 本地服务接口** - 主要实现，在小程序前端执行
2. **§2.2 云函数接口（可选）** - 可选功能，用于云同步

---

## 2.1 本地服务接口

### 2.1.0 服务层架构

本地服务层封装了所有业务逻辑和数据访问操作，直接与 IndexedDB 交互。

**服务文件结构**：
```
miniprogram/services/
├── storage.js              # IndexedDB 封装层
├── characterService.js     # 人物管理服务
├── guanxiService.js        # 关系管理服务
├── typeService.js          # 关系类型服务
├── graphService.js         # 图谱生成服务
├── reminderService.js      # 提醒管理服务
├── eventService.js         # 事件管理服务
├── deductionService.js     # 关系推导服务
└── syncService.js          # 云同步服务（可选）
```

**服务接口规范**：
- 所有服务方法返回 Promise
- 统一的错误处理
- 统一的返回格式：`{ success: Boolean, data: Any, error: Object }`

### 2.1.1 人物管理服务（characterService）

**文件**: `miniprogram/services/characterService.js`

#### createCharacter(data)
- **功能**：创建人物
- **参数**：
```javascript
{
  name: String,              // 必填
  nameFields: Object,        // 国际化姓名
  culturalContext: String,   // 文化背景
  gender: String,
  birthday: Object,
  contacts: Object,
  avatar: String,
  description: String,
  tags: Array,
  immutableAttributes: Object,
  isFictional: Boolean,
  source: String
}
```
- **返回**：
```javascript
{
  success: true,
  data: {
    id: Number,             // 新创建的人物ID
    character: Object       // 完整的人物对象
  }
}
```
- **实现逻辑**：
  1. 验证必填字段
  2. 生成 displayName（根据 nameFields 和 culturalContext）
  3. 如果有生日，自动计算星座和生肖
  4. 设置默认值（createdAt, updatedAt, stats等）
  5. 写入 IndexedDB 的 characters 对象存储
  6. 如果启用云同步，标记为待同步

#### updateCharacter(id, updates)
- **功能**：更新人物信息
- **参数**：
```javascript
{
  id: Number,               // 人物ID
  updates: {                // 要更新的字段
    name: String,
    gender: String,
    // ... 其他字段
  }
}
```
- **返回**：
```javascript
{
  success: true,
  data: {
    character: Object       // 更新后的人物对象
  }
}
```
- **实现逻辑**：
  1. 从 IndexedDB 读取现有人物数据
  2. 合并更新字段
  3. 如果更新了生日，重新计算星座和生肖
  4. 更新 updatedAt
  5. 写回 IndexedDB
  6. 如果启用云同步，标记为待同步
  7. 触发数据变更事件（用于UI更新）

#### deleteCharacter(id, options)
- **功能**：删除人物
- **参数**：
```javascript
{
  id: Number,
  options: {
    force: Boolean,         // 是否强制删除（会级联删除关系）
    checkRelations: Boolean // 是否检查关联关系（默认true）
  }
}
```
- **返回**：
```javascript
{
  success: true,
  data: {
    deletedId: Number,
    cascadeDeleted: {
      guanxi: Array,        // 被级联删除的关系ID列表
      events: Array,        // 被级联删除的事件ID列表
      reminders: Array      // 被级联删除的提醒ID列表
    }
  }
}
```
- **实现逻辑**：
  1. 如果 checkRelations 为 true，查询该人物的所有关系
  2. 如果有关系且 force 为 false，返回错误
  3. 如果 force 为 true，级联删除：
     - 删除相关的 guanxi 记录
     - 删除相关的 events 记录
     - 删除相关的 reminders 记录
     - 删除相关的 character_temporal_attributes 记录
  4. 删除人物记录
  5. 如果启用云同步，标记为待同步删除

#### queryCharacters(filter, sort, pagination)
- **功能**：查询人物列表
- **参数**：
```javascript
{
  filter: {
    keyword: String,        // 搜索关键词（匹配 name, alias）
    tags: Array,            // 标签筛选
    gender: String,         // 性别筛选
    isFictional: Boolean,   // 是否虚构
    source: String,         // 来源
    hasAvatar: Boolean      // 是否有头像
  },
  sort: {
    field: String,          // 排序字段：name/createdAt/updatedAt/guanxiCount
    order: String           // asc/desc
  },
  pagination: {
    page: Number,           // 页码（从1开始）
    pageSize: Number        // 每页数量（默认20）
  }
}
```
- **返回**：
```javascript
{
  success: true,
  data: {
    list: Array,            // 人物列表
    pagination: {
      page: Number,
      pageSize: Number,
      total: Number,
      totalPages: Number
    }
  }
}
```
- **实现逻辑**：
  1. 根据 filter 构建 IndexedDB 查询
  2. 使用索引优化查询性能
  3. 对结果进行排序
  4. 分页处理
  5. 返回结果

#### getCharacter(id, options)
- **功能**：获取人物详情
- **参数**：
```javascript
{
  id: Number,
  options: {
    includeGuanxi: Boolean,         // 是否包含关系列表
    includeTemporalAttributes: Boolean, // 是否包含可变属性
    includeStats: Boolean           // 是否包含统计信息
  }
}
```
- **返回**：
```javascript
{
  success: true,
  data: {
    character: Object,
    guanxi: Array,          // 如果 includeGuanxi 为 true
    temporalAttributes: Array, // 如果 includeTemporalAttributes 为 true
    stats: Object           // 如果 includeStats 为 true
  }
}
```

#### searchCharacters(keyword, limit)
- **功能**：搜索人物（全文搜索）
- **参数**：
```javascript
{
  keyword: String,          // 搜索关键词
  limit: Number             // 返回数量限制（默认10）
}
```
- **返回**：
```javascript
{
  success: true,
  data: {
    results: [{
      id: Number,
      name: String,
      avatar: String,
      matchField: String,   // 匹配字段：name/alias/description
      relevance: Number     // 相关度得分
    }]
  }
}
```
- **实现逻辑**：
  1. 在 name, alias, description 中搜索关键词
  2. 使用 IndexedDB 的 cursor 遍历
  3. 计算相关度得分
  4. 按相关度排序
  5. 返回前 N 个结果

#### importFromWechat(friends)
- **功能**：从微信好友导入人物
- **参数**：
```javascript
{
  friends: [{
    nickName: String,
    avatarUrl: String,
    // 微信好友信息
  }]
}
```
- **返回**：
```javascript
{
  success: true,
  data: {
    imported: Number,       // 成功导入数量
    skipped: Number,        // 跳过数量（已存在）
    characters: Array       // 导入的人物列表
  }
}
```

#### addTemporalAttribute(characterId, attribute)
- **功能**：添加人物可变属性
- **参数**：
```javascript
{
  characterId: Number,
  attribute: {
    attributeType: String,  // nationality/residence/occupation/politicalParty/religion
    value: String,
    startTime: String,      // YYYY-MM-DD
    endTime: String,        // YYYY-MM-DD（可选）
    note: String
  }
}
```
- **返回**：
```javascript
{
  success: true,
  data: {
    id: Number,             // 新创建的属性ID
    attribute: Object
  }
}
```
- **实现逻辑**：
  1. 验证时间段合法性（startTime < endTime）
  2. 检查是否与现有属性时间段重叠
  3. 如果 endTime 为空，将之前该属性类型的 isActive 设为 false
  4. 插入新记录到 character_temporal_attributes
  5. 如果启用云同步，标记为待同步

#### updateTemporalAttribute(id, updates)
- **功能**：更新人物可变属性

#### endTemporalAttribute(characterId, attributeType, endTime, note)
- **功能**：结束当前活跃的可变属性

#### queryTemporalAttributes(characterId, attributeType, timePoint)
- **功能**：查询人物的可变属性历史

---

### 2.1.2 关系管理服务（guanxiService）

**文件**: `miniprogram/services/guanxiService.js`

#### createGuanxi(data)
- **功能**：创建关系
- **参数**：
```javascript
{
  fromCharacterId: Number,
  toCharacterId: Number,
  typeId: String,           // 关系类型ID
  attributes: Object,       // 动态属性（根据类型定义）
  periods: [{
    startTime: String,      // YYYY-MM-DD
    endTime: String,        // YYYY-MM-DD（可选）
    status: String,         // active/ended/paused
    note: String
  }],
  strength: String,         // strong/medium/weak
  intimacy: Number,         // 0-100
  description: String,
  note: String,
  tags: Array
}
```
- **返回**：
```javascript
{
  success: true,
  data: {
    id: Number,
    guanxi: Object
  }
}
```
- **实现逻辑**：
  1. 验证 fromCharacterId 和 toCharacterId 存在且不相同
  2. 验证 typeId 存在
  3. 从 typeService 获取类型定义，验证 attributes
  4. 验证 periods 时间段合法性
  5. 设置默认值（isActive, createdAt, 冗余字段等）
  6. 写入 IndexedDB 的 guanxi 对象存储
  7. 更新关联人物的 stats.guanxiCount
  8. 如果启用关系推导，触发推导事件
  9. 如果启用云同步，标记为待同步

#### updateGuanxi(id, updates)
- **功能**：更新关系

#### deleteGuanxi(id)
- **功能**：删除关系
- **实现逻辑**：
  1. 删除 guanxi 记录
  2. 删除相关的 events 记录
  3. 删除相关的 reminders 记录
  4. 更新关联人物的 stats.guanxiCount
  5. 如果是推导关系的源，删除推导出的关系
  6. 如果启用云同步，标记为待同步删除

#### addPeriod(guanxiId, period)
- **功能**：添加时间段
- **参数**：
```javascript
{
  guanxiId: Number,
  period: {
    startTime: String,      // YYYY-MM-DD
    endTime: String,        // YYYY-MM-DD（可选）
    status: String,         // active/ended/paused
    note: String
  }
}
```
- **实现逻辑**：
  1. 验证时间段合法性（startTime < endTime）
  2. 检查与现有时间段是否重叠
  3. 按时间顺序插入到 periods 数组
  4. 更新 isActive 状态
  5. 更新 updatedAt
  6. 如果启用云同步，标记为待同步

#### endPeriod(guanxiId, endTime, note)
- **功能**：结束当前活跃时间段
- **参数**：
```javascript
{
  guanxiId: Number,
  endTime: String,          // YYYY-MM-DD
  note: String
}
```

#### queryGuanxi(filter, pagination)
- **功能**：查询关系列表
- **参数**：
```javascript
{
  filter: {
    characterId: Number,    // 查询某人物的所有关系
    typeId: String,         // 关系类型筛选
    isActive: Boolean,      // 是否活跃
    isDeduced: Boolean,     // 是否推导关系
    timeRange: {            // 时间范围筛选
      start: String,
      end: String
    },
    strength: String        // 关系强度
  },
  pagination: Object
}
```

#### getGuanxi(id, options)
- **功能**：获取关系详情
- **参数**：
```javascript
{
  id: Number,
  options: {
    includeCharacters: Boolean,  // 是否包含人物详情
    includeEvents: Boolean,      // 是否包含事件列表
    includeType: Boolean         // 是否包含类型定义
  }
}
```

#### findPath(fromCharacterId, toCharacterId, maxDepth)
- **功能**：查找两个人物之间的关系路径
- **参数**：
```javascript
{
  fromCharacterId: Number,
  toCharacterId: Number,
  maxDepth: Number          // 最大搜索深度（默认6）
}
```
- **返回**：
```javascript
{
  success: true,
  data: {
    paths: [[               // 可能有多条路径
      {
        characterId: Number,
        characterName: String,
        guanxiId: Number,
        guanxiType: String,
        direction: String    // from/to
      }
    ]],
    shortestPath: Array,    // 最短路径
    pathCount: Number
  }
}
```
- **算法**：广度优先搜索（BFS）
- **实现逻辑**：参见 [3. 核心算法设计](./技术详细设计-3-核心算法设计.md) § 3.1

#### updateContactTime(guanxiId, contactTime, note)
- **功能**：更新最后联系时间

---

### 2.1.3 关系类型服务（typeService）

**文件**: `miniprogram/services/typeService.js`

#### registerType(typeData)
- **功能**：注册新的关系类型
- **参数**：
```javascript
{
  id: String,               // 类型ID（全局唯一）
  name: String,
  nameEn: String,
  icon: String,
  color: String,
  category: String,
  description: String,
  fields: Array,            // 字段定义
  config: Object,           // 配置
  i18n: Object,             // 国际化资源
  version: String,
  author: String,
  tags: Array
}
```
- **返回**：
```javascript
{
  success: true,
  data: {
    type: Object
  }
}
```
- **实现逻辑**：
  1. 验证类型ID唯一性
  2. 验证字段定义格式
  3. 设置默认值（isEnabled: true, downloads: 0等）
  4. 写入 IndexedDB 的 guanxi_types 对象存储
  5. 如果启用云同步，标记为待同步

#### updateType(id, updates)
- **功能**：更新关系类型定义
- **注意**：更新类型定义可能影响现有关系，需要处理兼容性

#### getType(id)
- **功能**：获取关系类型详情

#### queryTypes(filter)
- **功能**：查询关系类型列表
- **参数**：
```javascript
{
  category: String,         // 分类筛选
  isEnabled: Boolean,       // 是否启用
  tags: Array,              // 标签筛选
  keyword: String           // 搜索关键词
}
```

#### validateAttributes(typeId, attributes)
- **功能**：验证关系属性
- **参数**：
```javascript
{
  typeId: String,
  attributes: Object        // 要验证的属性对象
}
```
- **返回**：
```javascript
{
  success: Boolean,
  errors: [{
    field: String,
    message: String,
    code: String
  }]
}
```
- **实现逻辑**：
  1. 从 IndexedDB 获取类型定义
  2. 遍历类型定义的 fields
  3. 检查必填字段是否存在
  4. 验证字段类型和格式
  5. 验证字段值范围（min/max）
  6. 验证正则表达式（pattern）
  7. 返回验证结果

#### importType(typeData)
- **功能**：从外部导入关系类型

#### exportType(id)
- **功能**：导出关系类型定义为 JSON

---

### 2.1.4 图谱生成服务（graphService）

**文件**: `miniprogram/services/graphService.js`

#### generateGraph(centerCharacterId, filters, useCache)
- **功能**：生成关系图谱数据
- **参数**：
```javascript
{
  centerCharacterId: Number, // 中心人物ID（可选，默认当前用户）
  filters: {
    typeIds: Array,         // 关系类型筛选
    timePoint: String,      // 时间点（查看某时间的关系网）
    maxDepth: Number,       // 最大深度（默认3）
    maxNodes: Number,       // 最大节点数（默认200）
    includeDeduced: Boolean // 是否包含推导关系
  },
  useCache: Boolean         // 是否使用缓存（默认true）
}
```
- **返回**：
```javascript
{
  success: true,
  data: {
    nodes: [{
      id: Number,
      name: String,
      avatar: String,
      type: String,
      level: Number,        // 层级（距离中心人物的度数）
      x: Number,            // 坐标（如果已计算布局）
      y: Number
    }],
    edges: [{
      id: Number,
      source: Number,
      target: Number,
      typeId: String,
      typeName: String,
      label: String,
      isDeduced: Boolean
    }],
    stats: {
      nodeCount: Number,
      edgeCount: Number,
      typeDistribution: Object, // 各类型关系数量
      maxDepth: Number
    }
  }
}
```
- **算法**：广度优先搜索（BFS）遍历关系图
- **实现逻辑**：参见 [3. 核心算法设计](./技术详细设计-3-核心算法设计.md) § 3.2
- **缓存策略**：
  1. 如果 useCache 为 true，先查询 graph_snapshots
  2. 检查缓存是否过期（expiresAt）
  3. 如果缓存有效，直接返回
  4. 否则重新生成图谱数据
  5. 将结果保存到 graph_snapshots（设置过期时间）

#### calculateLayout(nodes, edges, layoutType)
- **功能**：计算图谱布局
- **参数**：
```javascript
{
  nodes: Array,
  edges: Array,
  layoutType: String        // force/circular/grid/hierarchical
}
```
- **返回**：
```javascript
{
  success: true,
  data: {
    nodes: Array,           // 包含 x, y 坐标的节点
    layoutInfo: Object      // 布局信息
  }
}
```
- **实现**：
  - 使用图可视化布局算法（如 d3-force）
  - 在小程序端计算，或使用 Web Worker

#### analyzeGraph(characterId)
- **功能**：图谱分析
- **返回**：
```javascript
{
  success: true,
  data: {
    totalCharacters: Number,
    totalGuanxi: Number,
    typeDistribution: Object,    // 各类型关系数量
    activeGuanxiCount: Number,
    averageConnectionsPerCharacter: Number,
    densityScore: Number,         // 关系网密度（0-1）
    keyCharacters: [{             // 关键人物（度数最高）
      id: Number,
      name: String,
      degree: Number,
      betweenness: Number         // 中介中心性
    }],
    clusters: Array               // 社群发现结果
  }
}
```

---

### 2.1.5 提醒管理服务（reminderService）

**文件**: `miniprogram/services/reminderService.js`

#### createReminder(data)
- **功能**：创建提醒

#### updateReminder(id, updates)
- **功能**：更新提醒

#### deleteReminder(id)
- **功能**：删除提醒

#### queryReminders(filter)
- **功能**：查询提醒列表

#### getPendingReminders(limit)
- **功能**：获取待发送的提醒
- **参数**：
```javascript
{
  limit: Number             // 返回数量限制
}
```
- **实现逻辑**：
  1. 查询 status 为 'pending' 且 remindTime <= 当前时间的提醒
  2. 按 remindTime 排序
  3. 返回前 N 个

#### triggerReminder(id)
- **功能**：触发提醒（更新状态为 sent）

---

### 2.1.6 事件管理服务（eventService）

**文件**: `miniprogram/services/eventService.js`

#### createEvent(data)
- **功能**：创建事件

#### updateEvent(id, updates)
- **功能**：更新事件

#### deleteEvent(id)
- **功能**：删除事件

#### queryEvents(filter, sort)
- **功能**：查询事件列表

#### getTimeline(characterId, guanxiId, timeRange)
- **功能**：获取时间线
- **参数**：
```javascript
{
  characterId: Number,      // 人物ID（可选）
  guanxiId: Number,         // 关系ID（可选）
  timeRange: {              // 时间范围（可选）
    start: String,
    end: String
  }
}
```
- **返回**：按时间倒序排列的事件列表

---

### 2.1.7 关系推导服务（deductionService）

**文件**: `miniprogram/services/deductionService.js`

#### deduceRelations(sourceGuanxiId, depth)
- **功能**：根据源关系推导新关系
- **参数**：
```javascript
{
  sourceGuanxiId: Number,   // 源关系ID
  depth: Number             // 推导深度（默认1）
}
```
- **返回**：
```javascript
{
  success: true,
  data: {
    deduced: [{             // 推导出的关系
      fromCharacterId: Number,
      toCharacterId: Number,
      typeId: String,
      confidence: Number,   // 置信度
      rule: String,         // 使用的推导规则
      sourceGuanxiIds: Array
    }]
  }
}
```
- **实现逻辑**：参见 [关系类型设计规范](./关系类型设计/关系类型设计规范.md) § 5

#### deduceFromCharacter(characterId, maxDepth)
- **功能**：从某个人物开始推导所有可能的关系

#### validateDeduction(deduction)
- **功能**：验证推导关系的合理性

---

### 2.1.8 云同步服务（syncService）

**文件**: `miniprogram/services/syncService.js`

> 注：此服务仅在用户启用云同步时使用

#### syncToCloud(options)
- **功能**：将本地数据同步到云端
- **参数**：
```javascript
{
  syncType: String,         // full/incremental
  tables: Array             // 要同步的表（可选）
}
```

#### syncFromCloud(options)
- **功能**：从云端同步数据到本地

#### resolveConflict(conflicts)
- **功能**：解决同步冲突

#### getSyncStatus()
- **功能**：获取同步状态

---

## 2.2 云函数接口（可选同步功能）

> **重要提示**：本节描述的是**可选的云同步功能**。只有当用户启用云同步时，才需要调用这些云函数。

### 2.2.1 云函数架构

**云函数列表**：
```
cloudfunctions/
├── sync/                   # 数据同步云函数
│   └── index.js
├── backup/                 # 数据备份云函数
│   └── index.js
└── share/                  # 数据分享云函数（可选）
    └── index.js
```

### 2.2.2 sync 云函数

**功能**：处理数据同步请求

**调用方式**：
```javascript
wx.cloud.callFunction({
  name: 'sync',
  data: {
    action: 'push',         // push/pull/resolve
    syncData: Object
  }
})
```

**支持的 actions**：

#### push（推送到云端）
- **功能**：将本地数据推送到云数据库
- **参数**：
```javascript
{
  action: 'push',
  syncData: {
    table: String,          // 表名
    records: Array,         // 记录列表
    syncVersion: Number
  }
}
```
- **实现逻辑**：
  1. 验证用户权限（_openid）
  2. 对每条记录：
     - 检查云端是否存在（通过 localId 映射）
     - 如果不存在，插入新记录
     - 如果存在，比较 syncVersion
     - 如果本地版本更新，更新云端记录
     - 如果云端版本更新，返回冲突
  3. 返回同步结果

#### pull（从云端拉取）
- **功能**：从云数据库拉取数据到本地
- **参数**：
```javascript
{
  action: 'pull',
  lastSyncTime: Number,     // 上次同步时间
  tables: Array             // 要拉取的表
}
```

#### resolve（解决冲突）
- **功能**：解决同步冲突
- **参数**：
```javascript
{
  action: 'resolve',
  conflicts: [{
    table: String,
    localId: Number,
    cloudId: String,
    resolution: String      // keep-local/keep-cloud/merge
  }]
}
```

### 2.2.3 backup 云函数

**功能**：创建和恢复数据备份

#### createBackup
- **功能**：创建完整数据备份
- **实现**：将用户的所有数据导出为 JSON，上传到云存储

#### listBackups
- **功能**：列出用户的所有备份

#### restoreBackup
- **功能**：从备份恢复数据

### 2.2.4 云函数通用规范

#### 请求格式
```javascript
wx.cloud.callFunction({
  name: 'functionName',
  data: {
    action: 'actionName',   // 子操作
    ...params
  }
})
```

#### 响应格式
```javascript
{
  code: Number,             // 错误码，0表示成功
  message: String,          // 消息
  data: Any,                // 返回数据
  timestamp: Number         // 时间戳
}
```

#### 错误码定义
```javascript
const CloudErrorCodes = {
  SUCCESS: 0,

  // 同步相关 (6000-6999)
  SYNC_CONFLICT: 6000,      // 同步冲突
  SYNC_VERSION_MISMATCH: 6001,
  SYNC_DATA_CORRUPTED: 6002,
  SYNC_LIMIT_EXCEEDED: 6003, // 超过同步限制

  // 备份相关 (7000-7999)
  BACKUP_NOT_FOUND: 7000,
  BACKUP_CORRUPTED: 7001,
  BACKUP_LIMIT_EXCEEDED: 7002
};
```

---

## 2.3 本地服务错误码定义

```javascript
const ErrorCodes = {
  SUCCESS: 0,

  // 通用错误 (1000-1999)
  UNKNOWN_ERROR: 1000,
  INVALID_PARAMS: 1001,
  NOT_FOUND: 1002,
  ALREADY_EXISTS: 1003,
  OPERATION_FAILED: 1004,

  // 人物相关 (2000-2999)
  CHARACTER_NOT_FOUND: 2000,
  CHARACTER_ALREADY_EXISTS: 2001,
  CHARACTER_HAS_GUANXI: 2002,  // 删除时仍有关系
  INVALID_CHARACTER_DATA: 2003,
  INVALID_NAME_FORMAT: 2004,

  // 关系相关 (3000-3999)
  GUANXI_NOT_FOUND: 3000,
  GUANXI_ALREADY_EXISTS: 3001,
  INVALID_GUANXI_TYPE: 3002,
  INVALID_PERIOD: 3003,         // 时间段不合法
  PERIOD_OVERLAP: 3004,         // 时间段重叠
  SELF_GUANXI_NOT_ALLOWED: 3005, // 不能与自己建立关系
  ATTRIBUTE_VALIDATION_FAILED: 3006,

  // 类型相关 (4000-4999)
  TYPE_NOT_FOUND: 4000,
  TYPE_ALREADY_EXISTS: 4001,
  INVALID_TYPE_CONFIG: 4002,
  TYPE_IN_USE: 4003,            // 类型正在使用中，不能删除

  // 图谱相关 (5000-5999)
  GRAPH_GENERATION_FAILED: 5000,
  TOO_MANY_NODES: 5001,
  PATH_NOT_FOUND: 5002,
  INVALID_CENTER_CHARACTER: 5003,

  // 存储相关 (8000-8999)
  STORAGE_NOT_AVAILABLE: 8000,
  STORAGE_QUOTA_EXCEEDED: 8001,
  DATABASE_ERROR: 8002
};
```

---

## 2.4 接口使用示例

### 示例 1：创建人物并建立关系

```javascript
// 1. 导入服务
import characterService from '../../services/characterService';
import guanxiService from '../../services/guanxiService';

// 2. 创建人物
const result1 = await characterService.createCharacter({
  name: '张三',
  nameFields: {
    lastName: '张',
    firstName: '三'
  },
  culturalContext: 'zh-CN',
  gender: 'male',
  birthday: {
    solar: '1990-05-15',
    primary: 'solar'
  }
});

const character1Id = result1.data.id;

// 3. 创建另一个人物
const result2 = await characterService.createCharacter({
  name: '李四',
  gender: 'female'
});

const character2Id = result2.data.id;

// 4. 建立关系
const guanxiResult = await guanxiService.createGuanxi({
  fromCharacterId: character1Id,
  toCharacterId: character2Id,
  typeId: 'social_friend',
  attributes: {
    friendLevel: '好友',
    metAt: '大学',
    commonHobbies: ['篮球', '电影']
  },
  periods: [{
    startTime: '2010-09-01',
    status: 'active'
  }],
  strength: 'strong'
});
```

### 示例 2：生成关系图谱

```javascript
import graphService from '../../services/graphService';

// 生成以当前用户为中心的关系图谱
const graphResult = await graphService.generateGraph(
  currentUserId,
  {
    maxDepth: 3,
    maxNodes: 100,
    includeDeduced: true
  },
  true  // 使用缓存
);

// 获取节点和边
const { nodes, edges, stats } = graphResult.data;

// 计算布局
const layoutResult = await graphService.calculateLayout(
  nodes,
  edges,
  'force'  // 力导向布局
);

// 渲染图谱
this.renderGraph(layoutResult.data.nodes, edges);
```

### 示例 3：云同步（可选）

```javascript
import syncService from '../../services/syncService';

// 检查是否启用云同步
const user = await getUserSettings();
if (!user.settings.cloudSyncEnabled) {
  console.log('云同步未启用');
  return;
}

// 执行增量同步
const syncResult = await syncService.syncToCloud({
  syncType: 'incremental',
  tables: ['characters', 'guanxi']
});

if (syncResult.success) {
  wx.showToast({
    title: '同步成功',
    icon: 'success'
  });
} else {
  // 处理同步错误
  console.error('同步失败:', syncResult.error);
}
```

---

## 导航
- **上一章**: [1. 数据库详细设计](./技术详细设计-1-数据库详细设计.md)
- **返回目录**: [目录](./技术详细设计.md)
- **下一章**: [3. 核心算法设计](./技术详细设计-3-核心算法设计.md)
