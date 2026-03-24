// locales/ko-KR.js - Korean translations

module.exports = {
  common: {
    save: '저장',
    cancel: '취소',
    delete: '삭제',
    edit: '편집',
    add: '추가',
    search: '검색',
    confirm: '확인',
    back: '뒤로',
    loading: '로딩 중...',
    loadFailed: '로딩 실패',
    noData: '데이터 없음',
    error: '오류',
    success: '성공',
    submit: '제출',
    reset: '초기화',
    close: '닫기',
    more: '더보기',
    less: '접기',
    comingSoon: '개발 중'
  },

  locale: {
    zhCN: '중국어(간체)',
    zhTW: '중국어(번체)',
    enUS: '영어',
    jaJP: '일본어',
    koKR: '한국어'
  },

  time: {
    justNow: '방금',
    minutesAgo: '{count}분 전',
    hoursAgo: '{count}시간 전',
    daysAgo: '{count}일 전',
    weeksAgo: '{count}주 전',
    monthsAgo: '{count}개월 전',
    yearsAgo: '{count}년 전',
    today: '오늘',
    yesterday: '어제',
    tomorrow: '내일'
  },

  character: {
    title: '인물',
    name: '이름',
    displayName: '표시 이름',
    gender: {
      label: '성별',
      male: '남성',
      female: '여성'
    },
    birthday: '생일',
    age: '나이',
    phone: '전화',
    email: '이메일',
    address: '주소',
    description: '설명',
    tags: '태그',
    createCharacter: '인물 생성',
    editCharacter: '인물 편집',
    deleteCharacter: '인물 삭제',
    searchCharacter: '인물 검색',
    noCharacters: '인물 없음'
  },

  guanxi: {
    title: '관계',
    type: '관계 유형',
    from: '시작',
    to: '대상',
    attributes: '속성',
    createGuanxi: '관계 생성',
    editGuanxi: '관계 편집',
    deleteGuanxi: '관계 삭제',
    noGuanxi: '관계 없음'
  },

  guanxiList: {
    title: '관계 목록',
    filterByType: '유형으로 필터',
    allTypes: '모든 유형',
    sortBy: '정렬',
    order: '순서',
    createdAt: '생성일',
    updatedAt: '수정일',
    ascending: '오름차순',
    descending: '내림차순',
    totalCount: '총',
    relationships: '개의 관계',
    active: '활성',
    deduced: '추론됨',
    emptyTip: '아래 버튼을 눌러 관계를 생성하세요'
  },

  graph: {
    title: '관계 그래프',
    center: '중심 인물',
    layout: '레이아웃',
    filter: '필터',
    depth: '깊이',
    showDeduced: '추론된 관계 표시',
    hideDeduced: '추론된 관계 숨기기'
  },

  reminder: {
    title: '알림',
    createReminder: '알림 생성',
    editReminder: '알림 편집',
    deleteReminder: '알림 삭제',
    deleteConfirm: '이 알림을 삭제하시겠습니까?',
    upcoming: '예정됨',
    pending: '대기 중',
    triggered: '트리거됨',
    dismissed: '무시됨',
    noReminders: '알림 없음',
    noRemindersTip: '아래 버튼을 눌러 알림을 생성하세요',
    filterStatus: '상태',
    allReminders: '모든 알림',
    sortBy: '정렬',
    sortOrder: '순서',
    triggerTime: '트리거 시간',
    createdAt: '생성일',
    earliest: '오래된 순',
    latest: '최신순',
    dismiss: '무시',
    dismissSuccess: '알림을 무시했습니다',
    dismissFailed: '무시 실패'
  },

  event: {
    title: '이벤트',
    createEvent: '이벤트 생성',
    editEvent: '이벤트 편집',
    deleteEvent: '이벤트 삭제',
    deleteConfirm: '이 이벤트를 삭제하시겠습니까?',
    timeline: '타임라인',
    noEvents: '이벤트 없음',
    noEventsTip: '아래 버튼을 눌러 이벤트를 생성하세요',
    filterType: '이벤트 유형',
    allEvents: '모든 이벤트',
    birthdays: '생일',
    customEvents: '사용자 정의 이벤트',
    sortOrder: '정렬 순서',
    newest: '최신순',
    oldest: '오래된 순'
  },

  search: {
    title: '검색',
    placeholder: '이름, 태그 등으로 검색',
    recentSearches: '최근 검색',
    clearRecent: '지우기',
    clearRecentConfirm: '검색 기록을 지우시겠습니까?',
    noResults: '인물을 찾을 수 없습니다',
    noResultsTip: '다른 키워드를 시도해보세요',
    foundResults: '{count}개의 결과를 찾았습니다',
    emptyState: '인물 검색',
    emptyTip: '이름, 태그 등의 키워드를 입력하세요'
  },

  pages: {
    index: {
      title: '대인 관계 그래프',
      subtitle: '복잡한 인간관계를 명확하게',
      stats: {
        characters: '인물',
        relationships: '관계',
        types: '관계 유형'
      },
      recentTypes: '최근 사용한 유형',
      actions: {
        manageCharacters: '인물 관리',
        manageCharactersDesc: '인물 정보 보기 및 편집',
        createRelationship: '관계 생성',
        createRelationshipDesc: '새로운 인물 관계 설정',
        viewGraph: '그래프 보기',
        viewGraphDesc: '관계 네트워크 시각화'
      }
    },
    characterList: {
      searchPlaceholder: '이름 또는 메모로 검색',
      ageUnit: '세',
      addButton: '인물 추가',
      sort: {
        title: '정렬',
        name: '이름순',
        age: '나이순',
        createTime: '생성일시순',
        updateTime: '수정일시순'
      },
      filter: {
        title: '필터',
        all: '전체',
        gender: '성별',
        group: '그룹'
      },
      empty: {
        title: '인물이 없습니다',
        hint: '아래 버튼을 눌러 인물을 추가하세요'
      }
    },
    characterDetail: {
      title: '인물 상세',
      invalidParams: '잘못된 매개변수',
      notFound: '인물을 찾을 수 없습니다',
      contactInfo: '연락처 정보',
      phoneLabel: '전화:',
      emailLabel: '이메일:',
      wechatLabel: 'WeChat:',
      relationships: '관계',
      unknownType: '알 수 없는 유형',
      noRelationships: '관계가 없습니다',
      noEvents: '이벤트 기록이 없습니다',
      notes: '메모',
      confirmDeleteTitle: '삭제 확인',
      confirmDeleteContent: '이 인물을 삭제하시겠습니까?',
      relationshipOverview: '관계 개요',
      timeline: '타임라인',
      stats: {
        relationships: '관계 수',
        events: '이벤트',
        daysSince: '알고 지낸 일수',
        days: '일',
        lastContact: '마지막 연락',
        daysAgo: '일 전'
      },
      tabs: {
        overview: '개요',
        relationships: '관계',
        timeline: '타임라인'
      },
      actions: {
        addRelationship: '관계 추가',
        viewGraph: '관계 그래프',
        share: '공유'
      }
    },
    guanxiCreate: {
      step1: '인물 선택',
      step2: '유형 선택',
      step3: '상세 입력',
      step1Desc: '관계의 시작 인물과 대상 인물을 선택하세요',
      step2Desc: '적절한 관계 유형을 선택하세요',
      step3Desc: '관계의 상세 속성을 입력하세요',
      fromLabel: '시작 인물',
      toLabel: '대상 인물',
      typeLabel: '관계 유형',
      selected: '선택됨',
      selectCharacterPlaceholder: '눌러서 인물 선택',
      selectTypePlaceholder: '관계 유형 선택',
      selectPlaceholder: '선택해주세요',
      selectDatePlaceholder: '날짜 선택',
      submitButton: '관계 생성',
      createSuccess: '생성 성공',
      createFailed: '생성 실패',
      swapped: '인물을 교환했습니다',
      cancelConfirm: '관계 생성을 취소하시겠습니까?',
      errors: {
        selectFrom: '시작 인물을 선택해주세요',
        selectTo: '대상 인물을 선택해주세요',
        selectType: '관계 유형을 선택해주세요',
        sameCharacter: '같은 인물을 선택할 수 없습니다'
      }
    }
  },

  settings: {
    title: '설정',
    general: '일반 설정',
    language: '언어',
    theme: '테마',
    privacy: '개인정보',
    dataManagement: '데이터 관리',
    statistics: '데이터 통계',
    exportData: '데이터 내보내기',
    importData: '데이터 가져오기',
    clearData: '데이터 지우기',
    aboutSection: '정보',
    about: '앱 정보',
    appName: '관계 네트워크',
    versionLabel: '버전',
    description: '복잡한 인간관계를 명확하게',
    changeLanguageTitle: '언어 변경',
    changeLanguageConfirm: '언어 변경 후 앱이 다시 로드됩니다',
    languageChanged: '언어가 변경되었습니다',
    exporting: '내보내는 중...',
    exportSuccess: '내보내기 성공',
    exportSuccessMsg: '데이터를 성공적으로 내보냈습니다',
    exportFailed: '내보내기 실패',
    importing: '가져오는 중...',
    importSuccess: '가져오기 성공',
    importSuccessMsg: '데이터를 성공적으로 가져왔습니다. 앱이 다시 로드됩니다',
    importFailed: '가져오기 실패',
    clearDataTitle: '데이터 지우기',
    clearDataWarning: '모든 데이터가 삭제되며 복구할 수 없습니다. 계속하시겠습니까?',
    clearSuccess: '데이터를 지웠습니다',
    clearFailed: '지우기 실패',
    totalCharacters: '총 인물 수',
    totalRelationships: '총 관계 수',
    totalTypes: '관계 유형',
    totalEvents: '총 이벤트 수',
    totalReminders: '총 알림 수'
  },

  validation: {
    required: '이 필드는 필수입니다',
    invalidEmail: '잘못된 이메일 형식',
    invalidPhone: '잘못된 전화번호 형식',
    maxLength: '{max}자를 초과할 수 없습니다',
    minLength: '최소 {min}자가 필요합니다'
  },

  messages: {
    saveSuccess: '저장 성공',
    saveFailed: '저장 실패',
    deleteSuccess: '삭제 성공',
    deleteFailed: '삭제 실패',
    confirmDelete: '삭제를 확인하시겠습니까?',
    networkError: '네트워크 오류, 다시 시도해주세요'
  }
};
