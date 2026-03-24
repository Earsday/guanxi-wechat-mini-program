// locales/zh-CN.js - Simplified Chinese translations

module.exports = {
  common: {
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    confirm: '确认',
    back: '返回',
    loading: '加载中...',
    deleting: '删除中...',
    loadFailed: '加载失败',
    noData: '暂无数据',
    error: '错误',
    success: '成功',
    submit: '提交',
    reset: '重置',
    close: '关闭',
    more: '更多',
    less: '收起',
    retry: '重试',
    present: '至今',
    comingSoon: '功能开发中'
  },

  locale: {
    zhCN: '简体中文',
    zhTW: '繁体中文',
    enUS: '英语',
    jaJP: '日语'
  },

  time: {
    justNow: '刚刚',
    minutesAgo: '{count}分钟前',
    hoursAgo: '{count}小时前',
    daysAgo: '{count}天前',
    weeksAgo: '{count}周前',
    monthsAgo: '{count}个月前',
    yearsAgo: '{count}年前',
    today: '今天',
    yesterday: '昨天',
    tomorrow: '明天'
  },

  character: {
    title: '人物',
    name: '姓名',
    displayName: '显示名称',
    gender: {
      label: '性别',
      male: '男',
      female: '女'
    },
    birthday: '生日',
    age: '年龄',
    phone: '电话',
    email: '邮箱',
    address: '地址',
    description: '描述',
    tags: '标签',
    createCharacter: '创建人物',
    editCharacter: '编辑人物',
    deleteCharacter: '删除人物',
    searchCharacter: '搜索人物',
    noCharacters: '暂无人物'
  },

  guanxi: {
    title: '关系',
    type: '关系类型',
    from: '从',
    to: '到',
    attributes: '属性',
    createGuanxi: '创建关系',
    editGuanxi: '编辑关系',
    deleteGuanxi: '删除关系',
    noGuanxi: '暂无关系'
  },

  guanxiList: {
    title: '关系列表',
    filterByType: '类型筛选',
    allTypes: '全部类型',
    sortBy: '排序',
    order: '顺序',
    createdAt: '创建时间',
    updatedAt: '更新时间',
    ascending: '升序',
    descending: '降序',
    totalCount: '共',
    relationships: '个关系',
    active: '活跃',
    deduced: '推导',
    emptyTip: '点击下方按钮创建关系'
  },

  guanxiType: {
    family_relative: {
      name: '亲属关系',
      fields: {
        title: {
          label: '称谓',
          placeholder: '如：姑姑、表哥、姨夫'
        },
        lineage: {
          label: '亲缘类型',
          options: {
            direct: '直系',
            collateral: '旁系',
            in_law: '姻亲',
            adoptive: '义亲'
          }
        },
        proximity: {
          label: '亲缘远近',
          placeholder: '请选择亲缘远近',
          options: {
            immediate: '至亲',
            close: '近亲',
            distant: '远亲'
          }
        },
        contactFrequency: {
          label: '来往频率',
          placeholder: '选择来往频率',
          options: {
            daily: '每天',
            weekly: '每周',
            monthly: '每月',
            yearly: '每年',
            rarely: '很少联系'
          }
        },
        branch: {
          label: '家族支系',
          placeholder: '如：父系、母系、外公家、大伯家'
        }
      }
    },
    social_friend: {
      name: '好友关系',
      fields: {
        friendType: {
          label: '好友类型',
          options: {
            best_friend: '闺蜜/死党',
            childhood: '发小/青梅竹马',
            close: '好朋友',
            casual: '普通朋友',
            online: '网友',
            acquaintance: '泛泛之交'
          }
        },
        metAt: {
          label: '认识场合',
          placeholder: '如：大学、旅行、朋友介绍'
        },
        intimacy: {
          label: '亲密程度',
          placeholder: '选择亲密程度',
          options: {
            very_close: '非常亲密',
            close: '比较亲密',
            moderate: '一般',
            distant: '疏远'
          }
        },
        contactFrequency: {
          label: '来往频率',
          placeholder: '选择来往频率',
          options: {
            daily: '每天',
            weekly: '每周',
            monthly: '每月',
            rarely: '很少',
            lost_contact: '失去联系'
          }
        },
        commonInterests: {
          label: '共同兴趣',
          placeholder: '选择共同兴趣',
          options: {
            sports: '运动',
            music: '音乐',
            movies: '电影',
            reading: '阅读',
            gaming: '游戏',
            travel: '旅行',
            food: '美食',
            photography: '摄影'
          }
        },
        friendshipStatus: {
          label: '友情状态',
          options: {
            active: '活跃中',
            stable: '稳定',
            fading: '渐行渐远',
            paused: '暂时中断',
            ended: '已结束'
          }
        }
      }
    },
    work_colleague: {
      name: '同事关系',
      fields: {
        relationship: {
          label: '职务关系',
          options: {
            peer: '平级同事',
            superior: '上级',
            subordinate: '下级',
            cross_department: '跨部门同事',
            partner: '合作伙伴'
          }
        },
        company: {
          label: '公司名称',
          placeholder: '如：阿里巴巴、腾讯'
        },
        department: {
          label: '部门',
          placeholder: '如：技术部、市场部'
        },
        position: {
          label: '职位',
          placeholder: '如：高级工程师、产品经理'
        },
        collaborationType: {
          label: '合作类型',
          placeholder: '选择合作类型',
          options: {
            daily: '日常工作',
            project: '项目合作',
            mentor: '导师关系',
            occasional: '偶尔协作'
          }
        },
        workStatus: {
          label: '工作状态',
          options: {
            current: '当前同事',
            former: '前同事'
          }
        }
      }
    },
    education_classmate: {
      name: '同学关系',
      fields: {
        school: {
          label: '学校名称',
          placeholder: '如：清华大学、北京四中'
        },
        educationLevel: {
          label: '教育阶段',
          options: {
            elementary: '小学',
            middle_school: '初中',
            high_school: '高中',
            undergraduate: '本科',
            master: '硕士',
            phd: '博士'
          }
        },
        major: {
          label: '专业',
          placeholder: '如：计算机科学、经济学'
        },
        classRelation: {
          label: '班级关系',
          options: {
            same_class: '同班同学',
            same_grade: '同届校友',
            senior: '学长/学姐',
            junior: '学弟/学妹',
            alumni: '校友'
          }
        },
        closeness: {
          label: '亲密程度',
          placeholder: '选择亲密程度',
          options: {
            very_close: '非常要好',
            close: '比较熟',
            acquainted: '认识'
          }
        }
      }
    },
    location_neighbor: {
      name: '邻里关系',
      fields: {
        locationType: {
          label: '居住类型',
          options: {
            same_building: '同楼',
            same_floor: '同层',
            next_door: '隔壁',
            same_community: '同小区',
            nearby: '附近居民'
          }
        },
        address: {
          label: '地址',
          placeholder: '如：北京市朝阳区XX小区'
        },
        familiarity: {
          label: '熟悉程度',
          options: {
            very_familiar: '非常熟',
            familiar: '比较熟',
            acquainted: '认识',
            stranger: '不熟'
          }
        },
        interactionType: {
          label: '互动类型',
          placeholder: '选择互动类型',
          options: {
            greet: '打招呼',
            chat: '闲聊',
            help: '互助',
            activity: '一起活动'
          }
        }
      }
    }
  },

  pages: {
    index: {
      title: '关系网',
      subtitle: '让复杂的人际关系变得清晰',
      stats: {
        characters: '人物',
        relationships: '关系',
        types: '关系类型'
      },
      recentTypes: '常用关系类型',
      actions: {
        manageCharacters: '管理人物',
        manageCharactersDesc: '查看和编辑人物信息',
        createRelationship: '创建关系',
        createRelationshipDesc: '建立新的人物关系',
        viewGraph: '查看图谱',
        viewGraphDesc: '可视化展示关系网络'
      }
    },
    characterList: {
      searchPlaceholder: '搜索人物姓名或备注',
      ageUnit: '岁',
      addButton: '添加人物',
      sort: {
        title: '排序',
        name: '按姓名',
        age: '按年龄',
        createTime: '按创建时间',
        updateTime: '按更新时间'
      },
      filter: {
        title: '筛选',
        all: '全部',
        gender: '性别',
        group: '分组'
      },
      empty: {
        title: '暂无人物',
        hint: '点击下方按钮添加人物'
      }
    },
    characterDetail: {
      title: '人物详情',
      invalidParams: '参数错误',
      notFound: '人物不存在',
      contactInfo: '联系方式',
      phoneLabel: '手机号：',
      emailLabel: '邮箱：',
      wechatLabel: '微信：',
      relationships: '关系',
      unknownType: '未知类型',
      noRelationships: '暂无关系',
      noEvents: '暂无事件记录',
      notes: '备注',
      confirmDeleteTitle: '确认删除',
      confirmDeleteContent: '确定要删除这个人物吗？',
      relationshipOverview: '关系概览',
      timeline: '时间线',
      stats: {
        relationships: '关系数量',
        events: '事件记录',
        daysSince: '认识天数',
        days: '天',
        lastContact: '最后联系',
        daysAgo: '天前'
      },
      tabs: {
        overview: '概览',
        relationships: '关系',
        timeline: '时间线'
      },
      actions: {
        addRelationship: '添加关系',
        viewGraph: '关系图谱',
        share: '分享'
      }
    },
    characterEdit: {
      createTitle: '添加人物',
      editTitle: '编辑人物',
      basicInfo: '基本信息',
      nameLabel: '姓名',
      namePlaceholder: '请输入姓名',
      nameRequired: '姓名为必填项',
      aliasLabel: '别名',
      aliasPlaceholder: '请输入别名（可选）',
      genderLabel: '性别',
      genderRequired: '请选择性别',
      birthdayLabel: '生日',
      birthdayPlaceholder: '请选择生日（可选）',
      contactInfo: '联系方式',
      phoneLabel: '手机号',
      phonePlaceholder: '请输入手机号（可选）',
      emailLabel: '邮箱',
      emailPlaceholder: '请输入邮箱（可选）',
      wechatLabel: '微信号',
      wechatPlaceholder: '请输入微信号（可选）',
      qqLabel: 'QQ号',
      qqPlaceholder: '请输入QQ号（可选）',
      additionalInfo: '其他信息',
      tagsLabel: '标签',
      tagsPlaceholder: '请输入标签，用逗号分隔',
      groupLabel: '分组',
      groupPlaceholder: '请输入分组（可选）',
      notesLabel: '备注',
      notesPlaceholder: '请输入备注信息',
      avatarLabel: '头像',
      uploadAvatar: '上传头像',
      changeAvatar: '更换头像',
      submitButton: '保存',
      cancelButton: '取消',
      saveSuccess: '保存成功',
      saveFailed: '保存失败',
      invalidPhone: '手机号格式不正确',
      invalidEmail: '邮箱格式不正确',
      confirmCancelTitle: '确认取消',
      confirmCancelContent: '当前有未保存的内容，确定要取消吗？'
    },
    guanxiCreate: {
      step1: '选择人物',
      step2: '选择关系类型',
      step3: '填写详细信息',
      step1Desc: '选择关系的起始人物和目标人物',
      step2Desc: '选择合适的关系类型',
      step3Desc: '填写关系的详细属性信息',
      fromLabel: '起始人物',
      toLabel: '目标人物',
      typeLabel: '关系类型',
      selected: '已选择',
      selectCharacterPlaceholder: '点击选择人物',
      selectTypePlaceholder: '选择关系类型',
      selectPlaceholder: '请选择',
      selectDatePlaceholder: '选择日期',
      submitButton: '创建关系',
      createSuccess: '创建成功',
      createFailed: '创建失败',
      swapped: '已交换人物',
      cancelConfirm: '确定要取消创建关系吗？',
      errors: {
        selectFrom: '请选择起始人物',
        selectTo: '请选择目标人物',
        selectType: '请选择关系类型',
        sameCharacter: '不能选择相同的人物'
      }
    },
    guanxiDetail: {
      title: '关系详情',
      basicInfo: '基本信息',
      fromLabel: '从',
      toLabel: '到',
      typeLabel: '关系类型',
      createdAt: '创建时间',
      updatedAt: '更新时间',
      periods: '时间段',
      currentPeriod: '当前时间段',
      historicalPeriods: '历史时间段',
      startTime: '开始时间',
      endTime: '结束时间',
      status: '状态',
      active: '活跃',
      inactive: '已结束',
      attributes: '关系属性',
      noAttributes: '暂无关系属性',
      notes: '备注',
      noNotes: '暂无备注',
      editButton: '编辑',
      deleteButton: '删除',
      addPeriodButton: '添加时间段',
      endPeriodButton: '结束当前时间段',
      notFound: '关系不存在',
      invalidParams: '参数错误',
      loadFailed: '加载失败',
      deleteFailed: '删除失败',
      confirmDeleteTitle: '确认删除',
      confirmDeleteContent: '确定要删除这个关系吗？删除后无法恢复。',
      deleteSuccess: '删除成功'
    }
  },

  graph: {
    title: '关系图谱',
    centerCharacter: '中心人物',
    selectCenter: '选择中心人物',
    selectLayout: '选择布局',
    layout: '布局',
    filters: '筛选',
    apply: '应用',
    cancel: '取消',
    maxDepth: '最大深度',
    excludeDeduced: '排除推导关系',
    characters: '人物',
    relationships: '关系',
    levels: '层级',
    loading: '加载中...',
    exporting: '导出中...',
    analyzing: '分析中...',
    exportSuccess: '导出成功',
    exportFailed: '导出失败',
    saveToAlbum: '保存到相册？',
    saved: '已保存',
    saveFailed: '保存失败',
    loadError: '加载失败',
    analysisFailed: '分析失败',
    graphAnalysis: '图谱分析',
    totalCharacters: '总人物数',
    totalRelationships: '总关系数',
    averageDegree: '平均度数',
    networkDensity: '网络密度',
    clusteringCoefficient: '聚类系数',
    nodeActions: '请选择操作',
    viewDetail: '查看详情',
    setAsCenter: '设为中心',
    noCenterTitle: '无人物',
    noCenterMessage: '请先创建人物',
    empty: '暂无数据',
    legend: {
      explicitRelation: '显式关系',
      deducedRelation: '推导关系'
    }
  },

  reminder: {
    title: '提醒',
    createReminder: '创建提醒',
    editReminder: '编辑提醒',
    deleteReminder: '删除提醒',
    deleteConfirm: '确定要删除这条提醒吗?',
    upcoming: '即将到来',
    pending: '待处理',
    triggered: '已触发',
    dismissed: '已忽略',
    noReminders: '暂无提醒',
    noRemindersTip: '点击下方按钮创建提醒',
    filterStatus: '筛选状态',
    allReminders: '全部提醒',
    sortBy: '排序方式',
    sortOrder: '排序顺序',
    triggerTime: '触发时间',
    createdAt: '创建时间',
    earliest: '最早优先',
    latest: '最晚优先',
    dismiss: '忽略',
    dismissSuccess: '已忽略提醒',
    dismissFailed: '忽略失败'
  },

  event: {
    title: '事件',
    createEvent: '创建事件',
    editEvent: '编辑事件',
    deleteEvent: '删除事件',
    deleteConfirm: '确定要删除这个事件吗?',
    timeline: '时间线',
    noEvents: '暂无事件',
    noEventsTip: '点击下方按钮创建事件',
    filterType: '事件类型',
    allEvents: '全部事件',
    birthdays: '生日',
    customEvents: '自定义事件',
    sortOrder: '排序顺序',
    newest: '最新优先',
    oldest: '最旧优先'
  },

  search: {
    title: '搜索',
    placeholder: '搜索人物姓名、标签等',
    recentSearches: '最近搜索',
    clearRecent: '清空',
    clearRecentConfirm: '确定要清空搜索历史吗？',
    noResults: '未找到相关人物',
    noResultsTip: '试试其他关键词',
    foundResults: '找到 {count} 个结果',
    emptyState: '搜索人物',
    emptyTip: '输入姓名、标签等关键词'
  },

  settings: {
    title: '设置',
    general: '通用设置',
    language: '语言',
    theme: '主题',
    privacy: '隐私',
    dataManagement: '数据管理',
    statistics: '数据统计',
    exportData: '导出数据',
    importData: '导入数据',
    clearData: '清空数据',
    aboutSection: '关于',
    about: '关于应用',
    appName: '关系网小程序',
    versionLabel: '版本',
    description: '让复杂的人际关系变得清晰',
    changeLanguageTitle: '切换语言',
    changeLanguageConfirm: '切换语言后需要重新加载页面',
    languageChanged: '语言已切换',
    exporting: '导出中...',
    exportSuccess: '导出成功',
    exportSuccessMsg: '数据已导出',
    exportFailed: '导出失败',
    importing: '导入中...',
    importSuccess: '导入成功',
    importSuccessMsg: '数据已成功导入，页面将重新加载',
    importFailed: '导入失败',
    clearDataTitle: '清空数据',
    clearDataWarning: '此操作将删除所有数据，且无法恢复。确定要继续吗？',
    clearSuccess: '已清空',
    clearFailed: '清空失败',
    totalCharacters: '人物总数',
    totalRelationships: '关系总数',
    totalTypes: '关系类型',
    totalEvents: '事件总数',
    totalReminders: '提醒总数'
  },

  validation: {
    required: '此项为必填项',
    invalidEmail: '邮箱格式不正确',
    invalidPhone: '电话格式不正确',
    maxLength: '不能超过{max}个字符',
    minLength: '至少需要{min}个字符'
  },

  messages: {
    saveSuccess: '保存成功',
    saveFailed: '保存失败',
    deleteSuccess: '删除成功',
    deleteFailed: '删除失败',
    confirmDelete: '确认删除吗？',
    networkError: '网络错误，请稍后重试'
  }
};
