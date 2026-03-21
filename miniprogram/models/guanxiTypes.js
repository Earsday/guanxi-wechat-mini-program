// models/guanxiTypes.js - Pre-installed relationship type definitions

/**
 * 5 pre-installed relationship types
 * These will be loaded into the guanxi_types collection on first launch
 */

const PRE_INSTALLED_TYPES = [
  {
    id: 'family_relative',
    name: '亲属',
    category: 'family',
    icon: '👨‍👩‍👧‍👦',
    color: '#E57373',
    description: '血缘或婚姻关系的家庭成员',
    priority: 85,
    isBuiltIn: true,
    isActive: true,
    formFields: [
      {
        key: 'relation_type',
        label: '关系称谓',
        type: 'text',
        required: true,
        placeholder: '如：父亲、母亲、兄弟、姐妹等',
        order: 1
      },
      {
        key: 'blood_relation',
        label: '血缘关系',
        type: 'select',
        required: true,
        options: [
          { label: '直系血亲', value: 'direct' },
          { label: '旁系血亲', value: 'collateral' },
          { label: '姻亲关系', value: 'affinity' },
          { label: '无血缘', value: 'none' }
        ],
        defaultValue: 'direct',
        order: 2
      },
      {
        key: 'contact_frequency',
        label: '联系频率',
        type: 'select',
        required: false,
        options: [
          { label: '每天', value: 'daily' },
          { label: '每周', value: 'weekly' },
          { label: '每月', value: 'monthly' },
          { label: '偶尔', value: 'occasionally' }
        ],
        order: 3
      }
    ]
  },
  {
    id: 'social_friend',
    name: '朋友',
    category: 'social',
    icon: '🤝',
    color: '#64B5F6',
    description: '社交圈子中的朋友关系',
    priority: 70,
    isBuiltIn: true,
    isActive: true,
    formFields: [
      {
        key: 'friendship_level',
        label: '友谊程度',
        type: 'select',
        required: true,
        options: [
          { label: '挚友', value: 'close' },
          { label: '好友', value: 'good' },
          { label: '普通朋友', value: 'normal' },
          { label: '泛泛之交', value: 'acquaintance' }
        ],
        defaultValue: 'normal',
        order: 1
      },
      {
        key: 'meet_origin',
        label: '认识途径',
        type: 'text',
        required: false,
        placeholder: '如何认识的',
        order: 2
      },
      {
        key: 'common_interests',
        label: '共同兴趣',
        type: 'text',
        required: false,
        placeholder: '共同爱好或话题',
        order: 3
      },
      {
        key: 'contact_frequency',
        label: '联系频率',
        type: 'select',
        required: false,
        options: [
          { label: '经常', value: 'frequent' },
          { label: '偶尔', value: 'occasional' },
          { label: '很少', value: 'rare' }
        ],
        order: 4
      }
    ]
  },
  {
    id: 'education_classmate',
    name: '同学',
    category: 'education',
    icon: '🎓',
    color: '#81C784',
    description: '同校、同班或同届的同学关系',
    priority: 68,
    isBuiltIn: true,
    isActive: true,
    formFields: [
      {
        key: 'school_name',
        label: '学校名称',
        type: 'text',
        required: true,
        placeholder: '就读的学校',
        order: 1
      },
      {
        key: 'education_level',
        label: '教育阶段',
        type: 'select',
        required: true,
        options: [
          { label: '小学', value: 'primary' },
          { label: '初中', value: 'middle' },
          { label: '高中', value: 'high' },
          { label: '大学', value: 'university' },
          { label: '研究生', value: 'graduate' }
        ],
        order: 2
      },
      {
        key: 'grade_class',
        label: '年级班级',
        type: 'text',
        required: false,
        placeholder: '如：2010级、3班',
        order: 3
      },
      {
        key: 'major',
        label: '专业',
        type: 'text',
        required: false,
        placeholder: '专业名称（大学）',
        order: 4
      }
    ]
  },
  {
    id: 'work_colleague',
    name: '同事',
    category: 'work',
    icon: '💼',
    color: '#FFB74D',
    description: '同单位或合作过的工作伙伴',
    priority: 65,
    isBuiltIn: true,
    isActive: true,
    formFields: [
      {
        key: 'company_name',
        label: '公司名称',
        type: 'text',
        required: true,
        placeholder: '工作的公司',
        order: 1
      },
      {
        key: 'department',
        label: '部门',
        type: 'text',
        required: false,
        placeholder: '所在部门',
        order: 2
      },
      {
        key: 'position',
        label: '职位',
        type: 'text',
        required: false,
        placeholder: 'TA的职位',
        order: 3
      },
      {
        key: 'cooperation_type',
        label: '合作关系',
        type: 'select',
        required: false,
        options: [
          { label: '直接上级', value: 'supervisor' },
          { label: '直接下属', value: 'subordinate' },
          { label: '同级同事', value: 'peer' },
          { label: '跨部门合作', value: 'cross_dept' }
        ],
        order: 4
      }
    ]
  },
  {
    id: 'neighbor_community',
    name: '邻居',
    category: 'neighbor',
    icon: '🏘️',
    color: '#A1887F',
    description: '居住地相近的邻居关系',
    priority: 40,
    isBuiltIn: true,
    isActive: true,
    formFields: [
      {
        key: 'location',
        label: '位置',
        type: 'text',
        required: true,
        placeholder: '如：同栋、同单元、隔壁楼',
        order: 1
      },
      {
        key: 'familiarity',
        label: '熟悉程度',
        type: 'select',
        required: false,
        options: [
          { label: '很熟', value: 'familiar' },
          { label: '认识', value: 'known' },
          { label: '打过招呼', value: 'greeted' },
          { label: '仅见过', value: 'seen' }
        ],
        defaultValue: 'known',
        order: 2
      },
      {
        key: 'move_in_date',
        label: '入住时间',
        type: 'date',
        required: false,
        placeholder: '对方入住时间',
        order: 3
      }
    ]
  }
];

module.exports = {
  PRE_INSTALLED_TYPES
};
