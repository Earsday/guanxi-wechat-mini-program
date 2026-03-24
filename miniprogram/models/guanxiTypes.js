// models/guanxiTypes.js - Pre-installed relationship type definitions
// These types will be loaded into database on first initialization

/**
 * System pre-installed relationship types
 * Each type follows the structure defined in 关系类型设计规范.md
 */

const PRE_INSTALLED_TYPES = [
  // ============================================================
  // 1. 亲属关系 (Family Relative)
  // ============================================================
  {
    _id: 'family_relative',
    name: '亲属关系',
    nameEn: 'Relative',
    nameI18nKey: 'guanxiType.family_relative.name',
    icon: 'users',
    color: '#FF6B6B',
    category: 'family',
    description: '家族成员、血缘或姻亲关系，包括直系、旁系、姻亲等',
    descriptionEn: 'Family members, blood or marriage relations, including lineal, collateral, and in-law relationships',
    
    fields: [
      {
        name: 'title',
        label: '称谓',
        labelEn: 'Title',
        labelI18nKey: 'guanxiType.family_relative.fields.title.label',
        type: 'string',
        required: true,
        placeholder: '如：姑姑、表哥、姨夫',
        placeholderEn: 'e.g., Uncle, Cousin, Aunt',
        placeholderI18nKey: 'guanxiType.family_relative.fields.title.placeholder',
        validation: {
          max: 20,
          message: '称谓不能超过20个字符',
          messageEn: 'Title cannot exceed 20 characters',
          messageI18nKey: 'guanxiType.family_relative.fields.title.validation.max'
        }
      },
      {
        name: 'lineage',
        label: '亲缘类型',
        labelEn: 'Lineage Type',
        labelI18nKey: 'guanxiType.family_relative.fields.lineage.label',
        type: 'select',
        required: true,
        options: [
          { value: 'direct', label: '直系', labelEn: 'Direct Lineage', labelI18nKey: 'guanxiType.family_relative.fields.lineage.options.direct' },
          { value: 'collateral', label: '旁系', labelEn: 'Collateral Lineage', labelI18nKey: 'guanxiType.family_relative.fields.lineage.options.collateral' },
          { value: 'in_law', label: '姻亲', labelEn: 'In-law', labelI18nKey: 'guanxiType.family_relative.fields.lineage.options.in_law' },
          { value: 'adoptive', label: '义亲', labelEn: 'Adoptive', labelI18nKey: 'guanxiType.family_relative.fields.lineage.options.adoptive' }
        ],
        defaultValue: 'collateral'
      },
      {
        name: 'proximity',
        label: '亲缘远近',
        labelEn: 'Proximity',
        labelI18nKey: 'guanxiType.family_relative.fields.proximity.label',
        type: 'select',
        required: false,
        options: [
          { value: 'immediate', label: '至亲', labelEn: 'Immediate', labelI18nKey: 'guanxiType.family_relative.fields.proximity.options.immediate' },
          { value: 'close', label: '近亲', labelEn: 'Close', labelI18nKey: 'guanxiType.family_relative.fields.proximity.options.close' },
          { value: 'distant', label: '远亲', labelEn: 'Distant', labelI18nKey: 'guanxiType.family_relative.fields.proximity.options.distant' }
        ],
        placeholder: '请选择亲缘远近',
        placeholderEn: 'Select proximity',
        placeholderI18nKey: 'guanxiType.family_relative.fields.proximity.placeholder'
      },
      {
        name: 'contactFrequency',
        label: '来往频率',
        labelEn: 'Contact Frequency',
        labelI18nKey: 'guanxiType.family_relative.fields.contactFrequency.label',
        type: 'select',
        required: false,
        options: [
          { value: 'daily', label: '每天', labelEn: 'Daily', labelI18nKey: 'guanxiType.family_relative.fields.contactFrequency.options.daily' },
          { value: 'weekly', label: '每周', labelEn: 'Weekly', labelI18nKey: 'guanxiType.family_relative.fields.contactFrequency.options.weekly' },
          { value: 'monthly', label: '每月', labelEn: 'Monthly', labelI18nKey: 'guanxiType.family_relative.fields.contactFrequency.options.monthly' },
          { value: 'yearly', label: '每年', labelEn: 'Yearly', labelI18nKey: 'guanxiType.family_relative.fields.contactFrequency.options.yearly' },
          { value: 'rarely', label: '很少联系', labelEn: 'Rarely', labelI18nKey: 'guanxiType.family_relative.fields.contactFrequency.options.rarely' }
        ],
        placeholder: '选择来往频率',
        placeholderEn: 'Select contact frequency',
        placeholderI18nKey: 'guanxiType.family_relative.fields.contactFrequency.placeholder'
      },
      {
        name: 'branch',
        label: '家族支系',
        labelEn: 'Family Branch',
        labelI18nKey: 'guanxiType.family_relative.fields.branch.label',
        type: 'string',
        required: false,
        placeholder: '如：父系、母系、外公家、大伯家',
        placeholderEn: 'e.g., Paternal, Maternal, Uncle\'s Family',
        placeholderI18nKey: 'guanxiType.family_relative.fields.branch.placeholder',
        validation: {
          max: 30,
          message: '家族支系不能超过30个字符',
          messageEn: 'Family branch cannot exceed 30 characters',
          messageI18nKey: 'guanxiType.family_relative.fields.branch.validation.max'
        }
      }
    ],

    config: {
      supportMultiPeriod: false,
      requirePeriod: false,
      bidirectional: true,
      showInGraph: true,
      priority: 85,
      allowDuplicate: false,
      autoReminder: false
    },

    isBuiltIn: true,
    isEnabled: true,
    createdBy: 'system'
  },

  // ============================================================
  // 2. 好友关系 (Friend)
  // ============================================================
  {
    _id: 'social_friend',
    name: '好友关系',
    nameEn: 'Friend',
    nameI18nKey: 'guanxiType.social_friend.name',
    icon: 'smile',
    color: '#4ECDC4',
    category: 'social',
    description: '朋友、闺蜜、发小、网友等社交关系',
    descriptionEn: 'Friends, best friends, childhood friends, online friends, and other social relationships',
    
    fields: [
      {
        name: 'friendType',
        label: '好友类型',
        labelEn: 'Friend Type',
        labelI18nKey: 'guanxiType.social_friend.fields.friendType.label',
        type: 'select',
        required: true,
        options: [
          { value: 'best_friend', label: '闺蜜/死党', labelEn: 'Best Friend', labelI18nKey: 'guanxiType.social_friend.fields.friendType.options.best_friend' },
          { value: 'childhood', label: '发小/青梅竹马', labelEn: 'Childhood Friend', labelI18nKey: 'guanxiType.social_friend.fields.friendType.options.childhood' },
          { value: 'close', label: '好朋友', labelEn: 'Close Friend', labelI18nKey: 'guanxiType.social_friend.fields.friendType.options.close' },
          { value: 'casual', label: '普通朋友', labelEn: 'Casual Friend', labelI18nKey: 'guanxiType.social_friend.fields.friendType.options.casual' },
          { value: 'online', label: '网友', labelEn: 'Online Friend', labelI18nKey: 'guanxiType.social_friend.fields.friendType.options.online' },
          { value: 'acquaintance', label: '泛泛之交', labelEn: 'Acquaintance', labelI18nKey: 'guanxiType.social_friend.fields.friendType.options.acquaintance' }
        ],
        defaultValue: 'close'
      },
      {
        name: 'metAt',
        label: '认识场合',
        labelEn: 'Met At',
        labelI18nKey: 'guanxiType.social_friend.fields.metAt.label',
        type: 'string',
        required: false,
        placeholder: '如：大学、旅行、朋友介绍',
        placeholderEn: 'e.g., University, Travel, Through Friends',
        placeholderI18nKey: 'guanxiType.social_friend.fields.metAt.placeholder',
        validation: {
          max: 50,
          message: '认识场合不能超过50个字符',
          messageEn: 'Met location cannot exceed 50 characters',
          messageI18nKey: 'guanxiType.social_friend.fields.metAt.validation.max'
        }
      },
      {
        name: 'intimacy',
        label: '亲密程度',
        labelEn: 'Intimacy',
        labelI18nKey: 'guanxiType.social_friend.fields.intimacy.label',
        type: 'select',
        required: false,
        options: [
          { value: 'very_close', label: '非常亲密', labelEn: 'Very Close', labelI18nKey: 'guanxiType.social_friend.fields.intimacy.options.very_close' },
          { value: 'close', label: '比较亲密', labelEn: 'Close', labelI18nKey: 'guanxiType.social_friend.fields.intimacy.options.close' },
          { value: 'moderate', label: '一般', labelEn: 'Moderate', labelI18nKey: 'guanxiType.social_friend.fields.intimacy.options.moderate' },
          { value: 'distant', label: '疏远', labelEn: 'Distant', labelI18nKey: 'guanxiType.social_friend.fields.intimacy.options.distant' }
        ],
        placeholder: '选择亲密程度',
        placeholderEn: 'Select intimacy level',
        placeholderI18nKey: 'guanxiType.social_friend.fields.intimacy.placeholder'
      },
      {
        name: 'contactFrequency',
        label: '来往频率',
        labelEn: 'Contact Frequency',
        labelI18nKey: 'guanxiType.social_friend.fields.contactFrequency.label',
        type: 'select',
        required: false,
        options: [
          { value: 'daily', label: '每天', labelEn: 'Daily', labelI18nKey: 'guanxiType.social_friend.fields.contactFrequency.options.daily' },
          { value: 'weekly', label: '每周', labelEn: 'Weekly', labelI18nKey: 'guanxiType.social_friend.fields.contactFrequency.options.weekly' },
          { value: 'monthly', label: '每月', labelEn: 'Monthly', labelI18nKey: 'guanxiType.social_friend.fields.contactFrequency.options.monthly' },
          { value: 'rarely', label: '很少', labelEn: 'Rarely', labelI18nKey: 'guanxiType.social_friend.fields.contactFrequency.options.rarely' },
          { value: 'lost_contact', label: '失去联系', labelEn: 'Lost Contact', labelI18nKey: 'guanxiType.social_friend.fields.contactFrequency.options.lost_contact' }
        ],
        placeholder: '选择来往频率',
        placeholderEn: 'Select contact frequency',
        placeholderI18nKey: 'guanxiType.social_friend.fields.contactFrequency.placeholder'
      },
      {
        name: 'commonInterests',
        label: '共同兴趣',
        labelEn: 'Common Interests',
        labelI18nKey: 'guanxiType.social_friend.fields.commonInterests.label',
        type: 'multiSelect',
        required: false,
        options: [
          { value: 'sports', label: '运动', labelEn: 'Sports', labelI18nKey: 'guanxiType.social_friend.fields.commonInterests.options.sports' },
          { value: 'music', label: '音乐', labelEn: 'Music', labelI18nKey: 'guanxiType.social_friend.fields.commonInterests.options.music' },
          { value: 'movies', label: '电影', labelEn: 'Movies', labelI18nKey: 'guanxiType.social_friend.fields.commonInterests.options.movies' },
          { value: 'reading', label: '阅读', labelEn: 'Reading', labelI18nKey: 'guanxiType.social_friend.fields.commonInterests.options.reading' },
          { value: 'gaming', label: '游戏', labelEn: 'Gaming', labelI18nKey: 'guanxiType.social_friend.fields.commonInterests.options.gaming' },
          { value: 'travel', label: '旅行', labelEn: 'Travel', labelI18nKey: 'guanxiType.social_friend.fields.commonInterests.options.travel' },
          { value: 'food', label: '美食', labelEn: 'Food', labelI18nKey: 'guanxiType.social_friend.fields.commonInterests.options.food' },
          { value: 'photography', label: '摄影', labelEn: 'Photography', labelI18nKey: 'guanxiType.social_friend.fields.commonInterests.options.photography' }
        ],
        placeholder: '选择共同兴趣',
        placeholderEn: 'Select common interests',
        placeholderI18nKey: 'guanxiType.social_friend.fields.commonInterests.placeholder'
      },
      {
        name: 'friendshipStatus',
        label: '友情状态',
        labelEn: 'Friendship Status',
        labelI18nKey: 'guanxiType.social_friend.fields.friendshipStatus.label',
        type: 'select',
        required: false,
        options: [
          { value: 'active', label: '活跃中', labelEn: 'Active', labelI18nKey: 'guanxiType.social_friend.fields.friendshipStatus.options.active' },
          { value: 'stable', label: '稳定', labelEn: 'Stable', labelI18nKey: 'guanxiType.social_friend.fields.friendshipStatus.options.stable' },
          { value: 'fading', label: '渐行渐远', labelEn: 'Fading', labelI18nKey: 'guanxiType.social_friend.fields.friendshipStatus.options.fading' },
          { value: 'paused', label: '暂时中断', labelEn: 'Paused', labelI18nKey: 'guanxiType.social_friend.fields.friendshipStatus.options.paused' },
          { value: 'ended', label: '已结束', labelEn: 'Ended', labelI18nKey: 'guanxiType.social_friend.fields.friendshipStatus.options.ended' }
        ],
        defaultValue: 'active'
      }
    ],

    config: {
      supportMultiPeriod: true,
      requirePeriod: false,
      bidirectional: true,
      showInGraph: true,
      priority: 70,
      allowDuplicate: false,
      autoReminder: true
    },

    isBuiltIn: true,
    isEnabled: true,
    createdBy: 'system'
  },

  // ============================================================
  // 3. 同事关系 (Colleague)
  // ============================================================
  {
    _id: 'work_colleague',
    name: '同事关系',
    nameEn: 'Colleague',
    nameI18nKey: 'guanxiType.work_colleague.name',
    icon: 'briefcase',
    color: '#95E1D3',
    category: 'work',
    description: '工作中的同事、合作伙伴、上下级关系',
    descriptionEn: 'Colleagues, partners, and hierarchical relationships at work',
    
    fields: [
      {
        name: 'relationship',
        label: '职务关系',
        labelEn: 'Work Relationship',
        labelI18nKey: 'guanxiType.work_colleague.fields.relationship.label',
        type: 'select',
        required: true,
        options: [
          { value: 'peer', label: '平级同事', labelEn: 'Peer', labelI18nKey: 'guanxiType.work_colleague.fields.relationship.options.peer' },
          { value: 'superior', label: '上级', labelEn: 'Superior', labelI18nKey: 'guanxiType.work_colleague.fields.relationship.options.superior' },
          { value: 'subordinate', label: '下级', labelEn: 'Subordinate', labelI18nKey: 'guanxiType.work_colleague.fields.relationship.options.subordinate' },
          { value: 'cross_department', label: '跨部门同事', labelEn: 'Cross-department', labelI18nKey: 'guanxiType.work_colleague.fields.relationship.options.cross_department' },
          { value: 'partner', label: '合作伙伴', labelEn: 'Partner', labelI18nKey: 'guanxiType.work_colleague.fields.relationship.options.partner' }
        ],
        defaultValue: 'peer'
      },
      {
        name: 'company',
        label: '公司名称',
        labelEn: 'Company',
        labelI18nKey: 'guanxiType.work_colleague.fields.company.label',
        type: 'string',
        required: false,
        placeholder: '如：阿里巴巴、腾讯',
        placeholderEn: 'e.g., Alibaba, Tencent',
        placeholderI18nKey: 'guanxiType.work_colleague.fields.company.placeholder',
        validation: {
          max: 100,
          message: '公司名称不能超过100个字符',
          messageEn: 'Company name cannot exceed 100 characters',
          messageI18nKey: 'guanxiType.work_colleague.fields.company.validation.max'
        }
      },
      {
        name: 'department',
        label: '部门',
        labelEn: 'Department',
        labelI18nKey: 'guanxiType.work_colleague.fields.department.label',
        type: 'string',
        required: false,
        placeholder: '如：技术部、市场部',
        placeholderEn: 'e.g., Engineering, Marketing',
        placeholderI18nKey: 'guanxiType.work_colleague.fields.department.placeholder',
        validation: {
          max: 50,
          message: '部门名称不能超过50个字符',
          messageEn: 'Department name cannot exceed 50 characters',
          messageI18nKey: 'guanxiType.work_colleague.fields.department.validation.max'
        }
      },
      {
        name: 'position',
        label: '职位',
        labelEn: 'Position',
        labelI18nKey: 'guanxiType.work_colleague.fields.position.label',
        type: 'string',
        required: false,
        placeholder: '如：高级工程师、产品经理',
        placeholderEn: 'e.g., Senior Engineer, Product Manager',
        placeholderI18nKey: 'guanxiType.work_colleague.fields.position.placeholder',
        validation: {
          max: 50,
          message: '职位名称不能超过50个字符',
          messageEn: 'Position cannot exceed 50 characters',
          messageI18nKey: 'guanxiType.work_colleague.fields.position.validation.max'
        }
      },
      {
        name: 'collaborationType',
        label: '合作类型',
        labelEn: 'Collaboration Type',
        labelI18nKey: 'guanxiType.work_colleague.fields.collaborationType.label',
        type: 'multiSelect',
        required: false,
        options: [
          { value: 'daily', label: '日常工作', labelEn: 'Daily Work', labelI18nKey: 'guanxiType.work_colleague.fields.collaborationType.options.daily' },
          { value: 'project', label: '项目合作', labelEn: 'Project', labelI18nKey: 'guanxiType.work_colleague.fields.collaborationType.options.project' },
          { value: 'mentor', label: '导师关系', labelEn: 'Mentorship', labelI18nKey: 'guanxiType.work_colleague.fields.collaborationType.options.mentor' },
          { value: 'occasional', label: '偶尔协作', labelEn: 'Occasional', labelI18nKey: 'guanxiType.work_colleague.fields.collaborationType.options.occasional' }
        ],
        placeholder: '选择合作类型',
        placeholderEn: 'Select collaboration type',
        placeholderI18nKey: 'guanxiType.work_colleague.fields.collaborationType.placeholder'
      },
      {
        name: 'workStatus',
        label: '工作状态',
        labelEn: 'Work Status',
        labelI18nKey: 'guanxiType.work_colleague.fields.workStatus.label',
        type: 'select',
        required: false,
        options: [
          { value: 'current', label: '当前同事', labelEn: 'Current', labelI18nKey: 'guanxiType.work_colleague.fields.workStatus.options.current' },
          { value: 'former', label: '前同事', labelEn: 'Former', labelI18nKey: 'guanxiType.work_colleague.fields.workStatus.options.former' }
        ],
        defaultValue: 'current'
      }
    ],

    config: {
      supportMultiPeriod: true,
      requirePeriod: true,
      bidirectional: false,
      showInGraph: true,
      priority: 75,
      allowDuplicate: true,
      autoReminder: false
    },

    isBuiltIn: true,
    isEnabled: true,
    createdBy: 'system'
  },

  // ============================================================
  // 4. 同学关系 (Classmate)
  // ============================================================
  {
    _id: 'education_classmate',
    name: '同学关系',
    nameEn: 'Classmate',
    nameI18nKey: 'guanxiType.education_classmate.name',
    icon: 'book',
    color: '#F38181',
    category: 'education',
    description: '校友、同班同学、学长学姐等教育相关关系',
    descriptionEn: 'Alumni, classmates, seniors/juniors, and other education-related relationships',
    
    fields: [
      {
        name: 'school',
        label: '学校名称',
        labelEn: 'School',
        labelI18nKey: 'guanxiType.education_classmate.fields.school.label',
        type: 'string',
        required: true,
        placeholder: '如：清华大学、北京四中',
        placeholderEn: 'e.g., Tsinghua University, Beijing No.4 High School',
        placeholderI18nKey: 'guanxiType.education_classmate.fields.school.placeholder',
        validation: {
          max: 100,
          message: '学校名称不能超过100个字符',
          messageEn: 'School name cannot exceed 100 characters',
          messageI18nKey: 'guanxiType.education_classmate.fields.school.validation.max'
        }
      },
      {
        name: 'educationLevel',
        label: '教育阶段',
        labelEn: 'Education Level',
        labelI18nKey: 'guanxiType.education_classmate.fields.educationLevel.label',
        type: 'select',
        required: true,
        options: [
          { value: 'elementary', label: '小学', labelEn: 'Elementary', labelI18nKey: 'guanxiType.education_classmate.fields.educationLevel.options.elementary' },
          { value: 'middle_school', label: '初中', labelEn: 'Middle School', labelI18nKey: 'guanxiType.education_classmate.fields.educationLevel.options.middle_school' },
          { value: 'high_school', label: '高中', labelEn: 'High School', labelI18nKey: 'guanxiType.education_classmate.fields.educationLevel.options.high_school' },
          { value: 'undergraduate', label: '本科', labelEn: 'Undergraduate', labelI18nKey: 'guanxiType.education_classmate.fields.educationLevel.options.undergraduate' },
          { value: 'master', label: '硕士', labelEn: 'Master', labelI18nKey: 'guanxiType.education_classmate.fields.educationLevel.options.master' },
          { value: 'phd', label: '博士', labelEn: 'PhD', labelI18nKey: 'guanxiType.education_classmate.fields.educationLevel.options.phd' }
        ]
      },
      {
        name: 'major',
        label: '专业',
        labelEn: 'Major',
        labelI18nKey: 'guanxiType.education_classmate.fields.major.label',
        type: 'string',
        required: false,
        placeholder: '如：计算机科学、经济学',
        placeholderEn: 'e.g., Computer Science, Economics',
        placeholderI18nKey: 'guanxiType.education_classmate.fields.major.placeholder',
        validation: {
          max: 50,
          message: '专业名称不能超过50个字符',
          messageEn: 'Major cannot exceed 50 characters',
          messageI18nKey: 'guanxiType.education_classmate.fields.major.validation.max'
        }
      },
      {
        name: 'classRelation',
        label: '班级关系',
        labelEn: 'Class Relation',
        labelI18nKey: 'guanxiType.education_classmate.fields.classRelation.label',
        type: 'select',
        required: false,
        options: [
          { value: 'same_class', label: '同班同学', labelEn: 'Same Class', labelI18nKey: 'guanxiType.education_classmate.fields.classRelation.options.same_class' },
          { value: 'same_grade', label: '同届校友', labelEn: 'Same Grade', labelI18nKey: 'guanxiType.education_classmate.fields.classRelation.options.same_grade' },
          { value: 'senior', label: '学长/学姐', labelEn: 'Senior', labelI18nKey: 'guanxiType.education_classmate.fields.classRelation.options.senior' },
          { value: 'junior', label: '学弟/学妹', labelEn: 'Junior', labelI18nKey: 'guanxiType.education_classmate.fields.classRelation.options.junior' },
          { value: 'alumni', label: '校友', labelEn: 'Alumni', labelI18nKey: 'guanxiType.education_classmate.fields.classRelation.options.alumni' }
        ],
        defaultValue: 'same_class'
      },
      {
        name: 'closeness',
        label: '亲密程度',
        labelEn: 'Closeness',
        labelI18nKey: 'guanxiType.education_classmate.fields.closeness.label',
        type: 'select',
        required: false,
        options: [
          { value: 'very_close', label: '非常要好', labelEn: 'Very Close', labelI18nKey: 'guanxiType.education_classmate.fields.closeness.options.very_close' },
          { value: 'close', label: '比较熟', labelEn: 'Close', labelI18nKey: 'guanxiType.education_classmate.fields.closeness.options.close' },
          { value: 'acquainted', label: '认识', labelEn: 'Acquainted', labelI18nKey: 'guanxiType.education_classmate.fields.closeness.options.acquainted' }
        ],
        placeholder: '选择亲密程度',
        placeholderEn: 'Select closeness',
        placeholderI18nKey: 'guanxiType.education_classmate.fields.closeness.placeholder'
      }
    ],

    config: {
      supportMultiPeriod: false,
      requirePeriod: true,
      bidirectional: true,
      showInGraph: true,
      priority: 65,
      allowDuplicate: true,
      autoReminder: false
    },

    isBuiltIn: true,
    isEnabled: true,
    createdBy: 'system'
  },

  // ============================================================
  // 5. 邻里关系 (Neighbor)
  // ============================================================
  {
    _id: 'location_neighbor',
    name: '邻里关系',
    nameEn: 'Neighbor',
    nameI18nKey: 'guanxiType.location_neighbor.name',
    icon: 'home',
    color: '#FFD93D',
    category: 'location',
    description: '邻居、同小区居民等基于地理位置的关系',
    descriptionEn: 'Neighbors and community members based on geographic proximity',
    
    fields: [
      {
        name: 'locationType',
        label: '居住类型',
        labelEn: 'Location Type',
        labelI18nKey: 'guanxiType.location_neighbor.fields.locationType.label',
        type: 'select',
        required: true,
        options: [
          { value: 'same_building', label: '同楼', labelEn: 'Same Building', labelI18nKey: 'guanxiType.location_neighbor.fields.locationType.options.same_building' },
          { value: 'same_floor', label: '同层', labelEn: 'Same Floor', labelI18nKey: 'guanxiType.location_neighbor.fields.locationType.options.same_floor' },
          { value: 'next_door', label: '隔壁', labelEn: 'Next Door', labelI18nKey: 'guanxiType.location_neighbor.fields.locationType.options.next_door' },
          { value: 'same_community', label: '同小区', labelEn: 'Same Community', labelI18nKey: 'guanxiType.location_neighbor.fields.locationType.options.same_community' },
          { value: 'nearby', label: '附近居民', labelEn: 'Nearby', labelI18nKey: 'guanxiType.location_neighbor.fields.locationType.options.nearby' }
        ],
        defaultValue: 'same_community'
      },
      {
        name: 'address',
        label: '地址',
        labelEn: 'Address',
        labelI18nKey: 'guanxiType.location_neighbor.fields.address.label',
        type: 'text',
        required: false,
        placeholder: '如：北京市朝阳区XX小区',
        placeholderEn: 'e.g., XX Community, Chaoyang District, Beijing',
        placeholderI18nKey: 'guanxiType.location_neighbor.fields.address.placeholder',
        validation: {
          max: 200,
          message: '地址不能超过200个字符',
          messageEn: 'Address cannot exceed 200 characters',
          messageI18nKey: 'guanxiType.location_neighbor.fields.address.validation.max'
        }
      },
      {
        name: 'familiarity',
        label: '熟悉程度',
        labelEn: 'Familiarity',
        labelI18nKey: 'guanxiType.location_neighbor.fields.familiarity.label',
        type: 'select',
        required: false,
        options: [
          { value: 'very_familiar', label: '非常熟', labelEn: 'Very Familiar', labelI18nKey: 'guanxiType.location_neighbor.fields.familiarity.options.very_familiar' },
          { value: 'familiar', label: '比较熟', labelEn: 'Familiar', labelI18nKey: 'guanxiType.location_neighbor.fields.familiarity.options.familiar' },
          { value: 'acquainted', label: '认识', labelEn: 'Acquainted', labelI18nKey: 'guanxiType.location_neighbor.fields.familiarity.options.acquainted' },
          { value: 'stranger', label: '不熟', labelEn: 'Stranger', labelI18nKey: 'guanxiType.location_neighbor.fields.familiarity.options.stranger' }
        ],
        defaultValue: 'acquainted'
      },
      {
        name: 'interactionType',
        label: '互动类型',
        labelEn: 'Interaction Type',
        labelI18nKey: 'guanxiType.location_neighbor.fields.interactionType.label',
        type: 'multiSelect',
        required: false,
        options: [
          { value: 'greet', label: '打招呼', labelEn: 'Greet', labelI18nKey: 'guanxiType.location_neighbor.fields.interactionType.options.greet' },
          { value: 'chat', label: '闲聊', labelEn: 'Chat', labelI18nKey: 'guanxiType.location_neighbor.fields.interactionType.options.chat' },
          { value: 'help', label: '互助', labelEn: 'Help', labelI18nKey: 'guanxiType.location_neighbor.fields.interactionType.options.help' },
          { value: 'activity', label: '一起活动', labelEn: 'Activities', labelI18nKey: 'guanxiType.location_neighbor.fields.interactionType.options.activity' }
        ],
        placeholder: '选择互动类型',
        placeholderEn: 'Select interaction types',
        placeholderI18nKey: 'guanxiType.location_neighbor.fields.interactionType.placeholder'
      }
    ],

    config: {
      supportMultiPeriod: true,
      requirePeriod: true,
      bidirectional: true,
      showInGraph: true,
      priority: 50,
      allowDuplicate: false,
      autoReminder: false
    },

    isBuiltIn: true,
    isEnabled: true,
    createdBy: 'system'
  }
];

module.exports = {
  PRE_INSTALLED_TYPES
};
