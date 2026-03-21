# 关系网 - 技术详细设计文档

## 导航
- **上一章**: [1. 数据库详细设计](./技术详细设计-1-数据库详细设计.md)
- **返回目录**: [目录](./技术详细设计.md)
- **下一章**: [3. 核心算法设计](./技术详细设计-3-核心算法设计.md)

---

## 2. API接口设计

### 2.1 云函数列表

#### 2.1.1 人物管理（character）

**createCharacter**
- **功能**：创建人物
- **入参**：
```javascript
{
  name: String,
  gender: String,
  birthday: String,
  phone: String,
  avatar: String,
  // ... 其他字段
}
```
- **出参**：
```javascript
{
  code: 0,
  message: "success",
  data: {
    characterId: String,
    character: Object
  }
}
```

**updateCharacter**
- **功能**：更新人物信息
- **入参**：
```javascript
{
  characterId: String,
  updates: Object
}
```

**deleteCharacter**
- **功能**：删除人物（软删除，检查关联关系）
- **入参**：
```javascript
{
  characterId: String,
  force: Boolean  // 是否强制删除（会级联删除关系）
}
```

**queryCharacters**
- **功能**：查询人物列表
- **入参**：
```javascript
{
  filter: {
    keyword: String,       // 搜索关键词
    tags: [String],        // 标签筛选
    isFictional: Boolean,  // 是否虚构
    source: String         // 来源
  },
  sort: {
    field: String,         // 排序字段
    order: String          // asc/desc
  },
  pagination: {
    page: Number,
    pageSize: Number
  }
}
```

**getCharacter**
- **功能**：获取人物详情
- **入参**：
```javascript
{
  characterId: String,
  includeGuanxi: Boolean  // 是否包含关系列表
}
```

**searchCharacters**
- **功能**：搜索人物（全文搜索）
- **入参**：
```javascript
{
  keyword: String,
  limit: Number
}
```

**importFromWechat**
- **功能**：从微信好友导入人物
- **入参**：
```javascript
{
  friends: [{
    nickName: String,
    avatarUrl: String,
    // ...
  }]
}
```

**addTemporalAttribute**
- **功能**：添加人物可变属性
- **入参**：
```javascript
{
  characterId: String,
  attributeType: String,  // nationality/residence/occupation/politicalParty/religion
  value: String,
  startTime: String,      // 生效开始时间
  endTime: String,        // 生效结束时间（可选）
  note: String            // 备注
}
```
- **逻辑**：
  - 验证时间段合法性
  - 检查是否与现有属性时间段重叠
  - 如果 endTime 为空，将之前该属性类型的 isActive 设为 false
  - 插入新记录

**updateTemporalAttribute**
- **功能**：更新人物可变属性
- **入参**：
```javascript
{
  attributeId: String,
  updates: {
    value: String,
    startTime: String,
    endTime: String,
    note: String
  }
}
```

**endTemporalAttribute**
- **功能**：结束当前活跃的可变属性
- **入参**：
```javascript
{
  characterId: String,
  attributeType: String,
  endTime: String,
  note: String
}
```

**queryTemporalAttributes**
- **功能**：查询人物的可变属性历史
- **入参**：
```javascript
{
  characterId: String,
  attributeType: String,  // 可选，不传则查询所有类型
  timePoint: String       // 可选，查询某时间点的属性值
}
```

#### 2.1.2 关系管理（guanxi）

**createGuanxi**
- **功能**：创建关系
- **入参**：
```javascript
{
  fromCharacterId: String,
  toCharacterId: String,
  typeId: String,
  attributes: Object,
  periods: [{
    startTime: String,
    endTime: String,
    note: String
  }],
  strength: String,
  description: String
}
```

**updateGuanxi**
- **功能**：更新关系
- **入参**：
```javascript
{
  guanxiId: String,
  updates: Object
}
```

**deleteGuanxi**
- **功能**：删除关系
- **入参**：
```javascript
{
  guanxiId: String
}
```

**addPeriod**
- **功能**：添加时间段
- **入参**：
```javascript
{
  guanxiId: String,
  period: {
    startTime: String,
    endTime: String,
    note: String
  }
}
```
- **逻辑**：
  - 验证时间段合法性（开始时间 < 结束时间）
  - 检查与现有时间段是否重叠
  - 按时间顺序插入
  - 更新 isActive 状态

**endPeriod**
- **功能**：结束当前活跃时间段
- **入参**：
```javascript
{
  guanxiId: String,
  endTime: String,
  note: String
}
```

**queryGuanxi**
- **功能**：查询关系列表
- **入参**：
```javascript
{
  filter: {
    characterId: String,    // 查询某人物的所有关系
    typeId: String,         // 关系类型筛选
    isActive: Boolean,      // 是否活跃
    timeRange: {            // 时间范围筛选
      start: String,
      end: String
    },
    strength: String        // 关系强度
  },
  pagination: Object
}
```

**getGuanxi**
- **功能**：获取关系详情
- **入参**：
```javascript
{
  guanxiId: String,
  includeCharacters: Boolean,  // 是否包含人物详情
  includeEvents: Boolean       // 是否包含事件列表
}
```

**findPath**
- **功能**：查找两个人物之间的关系路径
- **入参**：
```javascript
{
  fromCharacterId: String,
  toCharacterId: String,
  maxDepth: Number           // 最大搜索深度（默认6）
}
```
- **出参**：
```javascript
{
  code: 0,
  data: {
    paths: [[               // 可能有多条路径
      {
        characterId: String,
        characterName: String,
        guanxiId: String,
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

**updateContactTime**
- **功能**：更新最后联系时间
- **入参**：
```javascript
{
  guanxiId: String,
  contactTime: Date,
  note: String
}
```

#### 2.1.3 关系类型管理（guanxiType）

**registerType**
- **功能**：注册新的关系类型
- **入参**：
```javascript
{
  id: String,
  name: String,
  fields: Array,
  config: Object,
  // ...
}
```

**updateType**
- **功能**：更新关系类型定义

**getType**
- **功能**：获取关系类型详情
- **入参**：
```javascript
{
  typeId: String
}
```

**queryTypes**
- **功能**：查询关系类型列表
- **入参**：
```javascript
{
  category: String,
  isEnabled: Boolean
}
```

**validateAttributes**
- **功能**：验证关系属性
- **入参**：
```javascript
{
  typeId: String,
  attributes: Object
}
```
- **逻辑**：
  - 根据类型定义的 fields 验证
  - 检查必填字段
  - 验证字段类型和格式
  - 返回验证结果

#### 2.1.4 关系图谱（graph）

**generateGraph**
- **功能**：生成关系图谱数据
- **入参**：
```javascript
{
  centerCharacterId: String,  // 中心人物ID（可选，默认当前用户）
  filters: {
    typeIds: [String],
    timePoint: String,        // 时间点（查看某时间的关系网）
    maxDepth: Number,         // 最大深度（默认3）
    maxNodes: Number          // 最大节点数（默认200）
  },
  useCache: Boolean           // 是否使用缓存
}
```
- **出参**：
```javascript
{
  code: 0,
  data: {
    nodes: Array,
    edges: Array,
    stats: Object
  }
}
```
- **算法**：
  - 从中心人物开始，层层扩展
  - 使用 BFS 遍历关系图
  - 根据 filters 过滤
  - 限制节点数量避免过大

**calculateLayout**
- **功能**：计算图谱布局（客户端调用，也可云端预计算）
- **入参**：
```javascript
{
  nodes: Array,
  edges: Array,
  layoutType: String  // force/circular/grid
}
```

**analyzeGraph**
- **功能**：图谱分析
- **入参**：
```javascript
{
  userId: String,
  characterId: String
}
```
- **出参**：
```javascript
{
  code: 0,
  data: {
    totalCharacters: Number,
    totalGuanxi: Number,
    typeDistribution: Object,    // 各类型关系数量
    activeGuanxiCount: Number,
    averageConnectionsPerCharacter: Number,
    densityScore: Number,         // 关系网密度
    keyCharacters: Array          // 关键人物（度数最高）
  }
}
```

#### 2.1.5 提醒管理（reminder）

**createReminder**
**updateReminder**
**deleteReminder**
**queryReminders**
**triggerReminders** - 定时任务触发

#### 2.1.6 事件管理（event）

**createEvent**
**updateEvent**
**deleteEvent**
**queryEvents**
**getTimeline** - 获取时间线

### 2.2 错误码定义

```javascript
const ErrorCodes = {
  SUCCESS: 0,

  // 通用错误 (1000-1999)
  UNKNOWN_ERROR: 1000,
  INVALID_PARAMS: 1001,
  UNAUTHORIZED: 1002,
  PERMISSION_DENIED: 1003,

  // 人物相关 (2000-2999)
  CHARACTER_NOT_FOUND: 2000,
  CHARACTER_ALREADY_EXISTS: 2001,
  CHARACTER_HAS_GUANXI: 2002,  // 删除时仍有关系
  INVALID_CHARACTER_DATA: 2003,

  // 关系相关 (3000-3999)
  GUANXI_NOT_FOUND: 3000,
  GUANXI_ALREADY_EXISTS: 3001,
  INVALID_GUANXI_TYPE: 3002,
  INVALID_PERIOD: 3003,         // 时间段不合法
  PERIOD_OVERLAP: 3004,         // 时间段重叠
  SELF_GUANXI_NOT_ALLOWED: 3005, // 不能与自己建立关系

  // 类型相关 (4000-4999)
  TYPE_NOT_FOUND: 4000,
  TYPE_ALREADY_EXISTS: 4001,
  INVALID_TYPE_CONFIG: 4002,
  ATTRIBUTE_VALIDATION_FAILED: 4003,

  // 图谱相关 (5000-5999)
  GRAPH_GENERATION_FAILED: 5000,
  TOO_MANY_NODES: 5001,
  PATH_NOT_FOUND: 5002
};
```

### 2.3 接口通用规范

#### 2.3.1 请求格式
```javascript
// 云函数调用
wx.cloud.callFunction({
  name: 'functionName',
  data: {
    action: 'actionName',  // 子操作
    ...params
  }
})
```

#### 2.3.2 响应格式
```javascript
{
  code: Number,      // 错误码，0表示成功
  message: String,   // 消息
  data: Any,         // 返回数据
  timestamp: Number  // 时间戳
}
```

#### 2.3.3 分页格式
```javascript
// 请求
{
  page: Number,      // 页码，从1开始
  pageSize: Number   // 每页数量，默认20
}

// 响应
{
  list: Array,
  pagination: {
    page: Number,
    pageSize: Number,
    total: Number,
    totalPages: Number
  }
}
```

---

## 导航
- **上一章**: [1. 数据库详细设计](./技术详细设计-1-数据库详细设计.md)
- **返回目录**: [目录](./技术详细设计.md)
- **下一章**: [3. 核心算法设计](./技术详细设计-3-核心算法设计.md)
