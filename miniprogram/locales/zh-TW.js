// locales/zh-TW.js - Traditional Chinese translations

module.exports = {
  common: {
    save: '保存',
    cancel: '取消',
    delete: '刪除',
    edit: '編輯',
    add: '添加',
    search: '搜索',
    confirm: '確認',
    back: '返回',
    loading: '加載中...',
    loadFailed: '加載失敗',
    noData: '暫無數據',
    error: '錯誤',
    success: '成功',
    submit: '提交',
    reset: '重置',
    close: '關閉',
    more: '更多',
    less: '收起',
    comingSoon: '功能開發中'
  },

  locale: {
    zhCN: '簡體中文',
    zhTW: '繁體中文',
    enUS: '英語',
    jaJP: '日語'
  },

  time: {
    justNow: '剛剛',
    minutesAgo: '{count}分鐘前',
    hoursAgo: '{count}小時前',
    daysAgo: '{count}天前',
    weeksAgo: '{count}週前',
    monthsAgo: '{count}個月前',
    yearsAgo: '{count}年前',
    today: '今天',
    yesterday: '昨天',
    tomorrow: '明天'
  },

  character: {
    title: '人物',
    name: '姓名',
    displayName: '顯示名稱',
    gender: {
      label: '性別',
      male: '男',
      female: '女'
    },
    birthday: '生日',
    age: '年齡',
    phone: '電話',
    email: '郵箱',
    address: '地址',
    description: '描述',
    tags: '標籤',
    createCharacter: '創建人物',
    editCharacter: '編輯人物',
    deleteCharacter: '刪除人物',
    searchCharacter: '搜索人物',
    noCharacters: '暫無人物'
  },

  guanxi: {
    title: '關係',
    type: '關係類型',
    from: '從',
    to: '到',
    attributes: '屬性',
    createGuanxi: '創建關係',
    editGuanxi: '編輯關係',
    deleteGuanxi: '刪除關係',
    noGuanxi: '暫無關係'
  },

  guanxiType: {
    family_relative: {
      name: '親屬關係',
      fields: {
        title: {
          label: '稱謂',
          placeholder: '如：姑姑、表哥、姨夫'
        },
        lineage: {
          label: '親緣類型',
          options: {
            direct: '直系',
            collateral: '旁系',
            in_law: '姻親',
            adoptive: '義親'
          }
        },
        proximity: {
          label: '親緣遠近',
          placeholder: '請選擇親緣遠近',
          options: {
            immediate: '至親',
            close: '近親',
            distant: '遠親'
          }
        },
        contactFrequency: {
          label: '來往頻率',
          placeholder: '選擇來往頻率',
          options: {
            daily: '每天',
            weekly: '每週',
            monthly: '每月',
            yearly: '每年',
            rarely: '很少聯繫'
          }
        },
        branch: {
          label: '家族支系',
          placeholder: '如：父系、母系、外公家、大伯家'
        }
      }
    },
    social_friend: {
      name: '好友關係',
      fields: {
        friendType: {
          label: '好友類型',
          options: {
            best_friend: '閨蜜/死黨',
            childhood: '發小/青梅竹馬',
            close: '好朋友',
            casual: '普通朋友',
            online: '網友',
            acquaintance: '泛泛之交'
          }
        },
        metAt: {
          label: '認識場合',
          placeholder: '如：大學、旅行、朋友介紹'
        },
        intimacy: {
          label: '親密程度',
          placeholder: '選擇親密程度',
          options: {
            very_close: '非常親密',
            close: '比較親密',
            moderate: '一般',
            distant: '疏遠'
          }
        },
        contactFrequency: {
          label: '來往頻率',
          placeholder: '選擇來往頻率',
          options: {
            daily: '每天',
            weekly: '每週',
            monthly: '每月',
            rarely: '很少',
            lost_contact: '失去聯繫'
          }
        },
        commonInterests: {
          label: '共同興趣',
          placeholder: '選擇共同興趣',
          options: {
            sports: '運動',
            music: '音樂',
            movies: '電影',
            reading: '閱讀',
            gaming: '遊戲',
            travel: '旅行',
            food: '美食',
            photography: '攝影'
          }
        },
        friendshipStatus: {
          label: '友情狀態',
          options: {
            active: '活躍中',
            stable: '穩定',
            fading: '漸行漸遠',
            paused: '暫時中斷',
            ended: '已結束'
          }
        }
      }
    },
    work_colleague: {
      name: '同事關係',
      fields: {
        relationship: {
          label: '職務關係',
          options: {
            peer: '平級同事',
            superior: '上級',
            subordinate: '下級',
            cross_department: '跨部門同事',
            partner: '合作夥伴'
          }
        },
        company: {
          label: '公司名稱',
          placeholder: '如：阿里巴巴、騰訊'
        },
        department: {
          label: '部門',
          placeholder: '如：技術部、市場部'
        },
        position: {
          label: '職位',
          placeholder: '如：高級工程師、產品經理'
        },
        collaborationType: {
          label: '合作類型',
          placeholder: '選擇合作類型',
          options: {
            daily: '日常工作',
            project: '項目合作',
            mentor: '導師關係',
            occasional: '偶爾協作'
          }
        },
        workStatus: {
          label: '工作狀態',
          options: {
            current: '當前同事',
            former: '前同事'
          }
        }
      }
    },
    education_classmate: {
      name: '同學關係',
      fields: {
        school: {
          label: '學校名稱',
          placeholder: '如：清華大學、北京四中'
        },
        educationLevel: {
          label: '教育階段',
          options: {
            elementary: '小學',
            middle_school: '初中',
            high_school: '高中',
            undergraduate: '本科',
            master: '碩士',
            phd: '博士'
          }
        },
        major: {
          label: '專業',
          placeholder: '如：計算機科學、經濟學'
        },
        classRelation: {
          label: '班級關係',
          options: {
            same_class: '同班同學',
            same_grade: '同屆校友',
            senior: '學長/學姐',
            junior: '學弟/學妹',
            alumni: '校友'
          }
        },
        closeness: {
          label: '親密程度',
          placeholder: '選擇親密程度',
          options: {
            very_close: '非常要好',
            close: '比較熟',
            acquainted: '認識'
          }
        }
      }
    },
    location_neighbor: {
      name: '鄰里關係',
      fields: {
        locationType: {
          label: '居住類型',
          options: {
            same_building: '同樓',
            same_floor: '同層',
            next_door: '隔壁',
            same_community: '同小區',
            nearby: '附近居民'
          }
        },
        address: {
          label: '地址',
          placeholder: '如：北京市朝陽區XX小區'
        },
        familiarity: {
          label: '熟悉程度',
          options: {
            very_familiar: '非常熟',
            familiar: '比較熟',
            acquainted: '認識',
            stranger: '不熟'
          }
        },
        interactionType: {
          label: '互動類型',
          placeholder: '選擇互動類型',
          options: {
            greet: '打招呼',
            chat: '閒聊',
            help: '互助',
            activity: '一起活動'
          }
        }
      }
    }
  },

  pages: {
    index: {
      title: '關係網',
      subtitle: '讓複雜的人際關係變得清晰',
      stats: {
        characters: '人物',
        relationships: '關係',
        types: '關係類型'
      },
      recentTypes: '常用關係類型',
      actions: {
        manageCharacters: '管理人物',
        manageCharactersDesc: '查看和編輯人物信息',
        createRelationship: '創建關係',
        createRelationshipDesc: '建立新的人物關係',
        viewGraph: '查看圖譜',
        viewGraphDesc: '可視化展示關係網絡'
      }
    },
    characterList: {
      searchPlaceholder: '搜索人物姓名或備註',
      ageUnit: '歲',
      empty: {
        title: '暫無人物',
        hint: '點擊下方按鈕添加人物'
      }
    },
    characterDetail: {
      invalidParams: '參數錯誤',
      notFound: '人物不存在',
      contactInfo: '聯繫方式',
      phoneLabel: '手機號：',
      emailLabel: '郵箱：',
      relationships: '關係',
      unknownType: '未知類型',
      noRelationships: '暫無關係',
      notes: '備註',
      confirmDeleteTitle: '確認刪除',
      confirmDeleteContent: '確定要刪除這個人物嗎？'
    },
    guanxiCreate: {
      fromLabel: '從',
      toLabel: '到',
      typeLabel: '關係類型',
      selected: '已選擇',
      selectCharacterPlaceholder: '選擇人物',
      selectTypePlaceholder: '選擇關係類型',
      selectPlaceholder: '請選擇',
      selectDatePlaceholder: '選擇日期',
      submitButton: '創建關係',
      createSuccess: '創建成功',
      createFailed: '創建失敗',
      errors: {
        selectFrom: '請選擇起始人物',
        selectTo: '請選擇目標人物',
        selectType: '請選擇關係類型'
      }
    }
  },

  graph: {
    title: '關係圖譜',
    center: '中心人物',
    layout: '佈局',
    filter: '篩選',
    depth: '深度',
    showDeduced: '顯示推導關係',
    hideDeduced: '隱藏推導關係'
  },

  reminder: {
    title: '提醒',
    createReminder: '創建提醒',
    editReminder: '編輯提醒',
    deleteReminder: '刪除提醒',
    upcoming: '即將到來',
    pending: '待處理',
    triggered: '已觸發',
    dismissed: '已忽略',
    noReminders: '暫無提醒'
  },

  event: {
    title: '事件',
    createEvent: '創建事件',
    editEvent: '編輯事件',
    deleteEvent: '刪除事件',
    timeline: '時間線',
    noEvents: '暫無事件'
  },

  settings: {
    title: '設置',
    language: '語言',
    theme: '主題',
    privacy: '隱私',
    data: '數據管理',
    about: '關於'
  },

  validation: {
    required: '此項為必填項',
    invalidEmail: '郵箱格式不正確',
    invalidPhone: '電話格式不正確',
    maxLength: '不能超過{max}個字符',
    minLength: '至少需要{min}個字符'
  },

  messages: {
    saveSuccess: '保存成功',
    saveFailed: '保存失敗',
    deleteSuccess: '刪除成功',
    deleteFailed: '刪除失敗',
    confirmDelete: '確認刪除嗎？',
    networkError: '網絡錯誤，請稍後重試'
  }
};
