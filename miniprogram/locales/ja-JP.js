// locales/ja-JP.js - Japanese translations

module.exports = {
  common: {
    save: '保存',
    cancel: 'キャンセル',
    delete: '削除',
    edit: '編集',
    add: '追加',
    search: '検索',
    confirm: '確認',
    back: '戻る',
    loading: '読み込み中...',
    loadFailed: '読み込みに失敗しました',
    noData: 'データなし',
    error: 'エラー',
    success: '成功',
    submit: '送信',
    reset: 'リセット',
    close: '閉じる',
    more: 'もっと見る',
    less: '閉じる',
    comingSoon: '開発中'
  },

  locale: {
    zhCN: '簡体字中国語',
    zhTW: '繁体字中国語',
    enUS: '英語',
    jaJP: '日本語'
  },

  time: {
    justNow: 'たった今',
    minutesAgo: '{count}分前',
    hoursAgo: '{count}時間前',
    daysAgo: '{count}日前',
    weeksAgo: '{count}週間前',
    monthsAgo: '{count}ヶ月前',
    yearsAgo: '{count}年前',
    today: '今日',
    yesterday: '昨日',
    tomorrow: '明日'
  },

  character: {
    title: '人物',
    name: '名前',
    displayName: '表示名',
    gender: {
      label: '性別',
      male: '男性',
      female: '女性'
    },
    birthday: '誕生日',
    age: '年齢',
    phone: '電話',
    email: 'メール',
    address: '住所',
    description: '説明',
    tags: 'タグ',
    createCharacter: '人物を作成',
    editCharacter: '人物を編集',
    deleteCharacter: '人物を削除',
    searchCharacter: '人物を検索',
    noCharacters: '人物なし'
  },

  guanxi: {
    title: '関係',
    type: '関係タイプ',
    from: 'から',
    to: 'へ',
    attributes: '属性',
    createGuanxi: '関係を作成',
    editGuanxi: '関係を編集',
    deleteGuanxi: '関係を削除',
    noGuanxi: '関係なし'
  },

  guanxiList: {
    title: '関係リスト',
    filterByType: 'タイプでフィルター',
    allTypes: 'すべてのタイプ',
    sortBy: '並べ替え',
    order: '順序',
    createdAt: '作成日',
    updatedAt: '更新日',
    ascending: '昇順',
    descending: '降順',
    totalCount: '合計',
    relationships: '件の関係',
    active: 'アクティブ',
    deduced: '推定',
    emptyTip: '下のボタンをタップして関係を作成'
  },

  graph: {
    title: '関係グラフ',
    center: '中心人物',
    layout: 'レイアウト',
    filter: 'フィルター',
    depth: '深さ',
    showDeduced: '推定を表示',
    hideDeduced: '推定を非表示'
  },

  reminder: {
    title: 'リマインダー',
    createReminder: 'リマインダーを作成',
    editReminder: 'リマインダーを編集',
    deleteReminder: 'リマインダーを削除',
    deleteConfirm: 'このリマインダーを削除してもよろしいですか?',
    upcoming: '近日中',
    pending: '保留中',
    triggered: 'トリガーされた',
    dismissed: '無視された',
    noReminders: 'リマインダーなし',
    noRemindersTip: '下のボタンをタップしてリマインダーを作成',
    filterStatus: 'ステータス',
    allReminders: '全てのリマインダー',
    sortBy: '並べ替え',
    sortOrder: '順序',
    triggerTime: 'トリガー時刻',
    createdAt: '作成日',
    earliest: '古い順',
    latest: '新しい順',
    dismiss: '却下',
    dismissSuccess: 'リマインダーを却下しました',
    dismissFailed: '却下に失敗しました'
  },

  event: {
    title: 'イベント',
    createEvent: 'イベントを作成',
    editEvent: 'イベントを編集',
    deleteEvent: 'イベントを削除',
    deleteConfirm: 'このイベントを削除してもよろしいですか?',
    timeline: 'タイムライン',
    noEvents: 'イベントなし',
    noEventsTip: '下のボタンをタップしてイベントを作成',
    filterType: 'イベント種類',
    allEvents: '全てのイベント',
    birthdays: '誕生日',
    customEvents: 'カスタムイベント',
    sortOrder: '並べ替え順序',
    newest: '新しい順',
    oldest: '古い順'
  },

  search: {
    title: '検索',
    placeholder: '名前、タグなどで検索',
    recentSearches: '最近の検索',
    clearRecent: 'クリア',
    clearRecentConfirm: '検索履歴をクリアしますか？',
    noResults: '人物が見つかりません',
    noResultsTip: '他のキーワードを試してください',
    foundResults: '{count}件の結果が見つかりました',
    emptyState: '人物を検索',
    emptyTip: '名前、タグなどのキーワードを入力'
  },

  pages: {
    index: {
      title: '関係ネットワーク',
      subtitle: '複雑な人間関係を明確に',
      stats: {
        characters: '人物',
        relationships: '関係',
        types: '関係タイプ'
      },
      recentTypes: '最近使用したタイプ',
      actions: {
        manageCharacters: '人物を管理',
        manageCharactersDesc: '人物情報を表示・編集',
        createRelationship: '関係を作成',
        createRelationshipDesc: '新しい人物関係を確立',
        viewGraph: 'グラフを表示',
        viewGraphDesc: '関係ネットワークを可視化'
      }
    },
    characterList: {
      searchPlaceholder: '名前またはメモで検索',
      ageUnit: '歳',
      addButton: '人物を追加',
      sort: {
        title: '並び替え',
        name: '名前順',
        age: '年齢順',
        createTime: '作成日時順',
        updateTime: '更新日時順'
      },
      filter: {
        title: 'フィルター',
        all: 'すべて',
        gender: '性別',
        group: 'グループ'
      },
      empty: {
        title: '人物がありません',
        hint: '下のボタンをタップして人物を追加'
      }
    },
    characterDetail: {
      title: '人物詳細',
      invalidParams: '無効なパラメータ',
      notFound: '人物が見つかりません',
      contactInfo: '連絡先情報',
      phoneLabel: '電話：',
      emailLabel: 'メール：',
      wechatLabel: 'WeChat：',
      relationships: '関係',
      unknownType: '不明なタイプ',
      noRelationships: '関係がありません',
      noEvents: 'イベント記録がありません',
      notes: 'メモ',
      confirmDeleteTitle: '削除の確認',
      confirmDeleteContent: 'この人物を削除してもよろしいですか？',
      relationshipOverview: '関係概要',
      timeline: 'タイムライン',
      stats: {
        relationships: '関係数',
        events: 'イベント',
        daysSince: '知り合い日数',
        days: '日',
        lastContact: '最後の連絡',
        daysAgo: '日前'
      },
      tabs: {
        overview: '概要',
        relationships: '関係',
        timeline: 'タイムライン'
      },
      actions: {
        addRelationship: '関係を追加',
        viewGraph: '関係グラフ',
        share: '共有'
      }
    },
    guanxiCreate: {
      step1: '人物を選択',
      step2: 'タイプを選択',
      step3: '詳細を入力',
      step1Desc: '関係の開始人物と対象人物を選択してください',
      step2Desc: '適切な関係タイプを選択してください',
      step3Desc: '関係の詳細属性を入力してください',
      fromLabel: '開始人物',
      toLabel: '対象人物',
      typeLabel: '関係タイプ',
      selected: '選択済み',
      selectCharacterPlaceholder: 'タップして人物を選択',
      selectTypePlaceholder: '関係タイプを選択',
      selectPlaceholder: '選択してください',
      selectDatePlaceholder: '日付を選択',
      submitButton: '関係を作成',
      createSuccess: '作成成功',
      createFailed: '作成失敗',
      swapped: '人物を交換しました',
      cancelConfirm: '関係の作成をキャンセルしてもよろしいですか？',
      errors: {
        selectFrom: '開始人物を選択してください',
        selectTo: '対象人物を選択してください',
        selectType: '関係タイプを選択してください',
        sameCharacter: '同じ人物を選択できません'
      }
    }
  },

  settings: {
    title: '設定',
    general: '一般設定',
    language: '言語',
    theme: 'テーマ',
    privacy: 'プライバシー',
    dataManagement: 'データ管理',
    statistics: 'データ統計',
    exportData: 'データをエクスポート',
    importData: 'データをインポート',
    clearData: 'データをクリア',
    aboutSection: 'について',
    about: 'アプリについて',
    appName: '関係ネットワーク',
    versionLabel: 'バージョン',
    description: '複雑な人間関係を明確に',
    changeLanguageTitle: '言語を変更',
    changeLanguageConfirm: '言語変更後、アプリが再読み込みされます',
    languageChanged: '言語が変更されました',
    exporting: 'エクスポート中...',
    exportSuccess: 'エクスポート成功',
    exportSuccessMsg: 'データが正常にエクスポートされました',
    exportFailed: 'エクスポート失敗',
    importing: 'インポート中...',
    importSuccess: 'インポート成功',
    importSuccessMsg: 'データが正常にインポートされました。アプリが再読み込みされます',
    importFailed: 'インポート失敗',
    clearDataTitle: 'データをクリア',
    clearDataWarning: 'すべてのデータが削除され、元に戻せません。続行しますか？',
    clearSuccess: 'データがクリアされました',
    clearFailed: 'クリア失敗',
    totalCharacters: '総人物数',
    totalRelationships: '総関係数',
    totalTypes: '関係タイプ',
    totalEvents: '総イベント数',
    totalReminders: '総リマインダー数'
  },

  validation: {
    required: 'このフィールドは必須です',
    invalidEmail: '無効なメール形式',
    invalidPhone: '無効な電話番号形式',
    maxLength: '{max}文字を超えることはできません',
    minLength: '少なくとも{min}文字が必要です'
  },

  messages: {
    saveSuccess: '保存に成功しました',
    saveFailed: '保存に失敗しました',
    deleteSuccess: '削除に成功しました',
    deleteFailed: '削除に失敗しました',
    confirmDelete: '削除を確認しますか？',
    networkError: 'ネットワークエラー、もう一度お試しください'
  }
};
