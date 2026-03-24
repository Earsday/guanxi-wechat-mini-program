# 人際關係圖譜 微信小程式

[English](README.md) | [简体中文](README.zh-CN.md) | 繁體中文 | [日本語](README.ja-JP.md) | [한국어](README.ko-KR.md)

一款用於全面管理和探索人際關係網路的微信小程式。

## 專案結構

```
├── miniprogram/          # 小程式原始碼
├── documents/            # 專案文件
├── LICENSE               # Apache License 2.0 開源授權
├── NOTICE                # 版權和專利聲明
├── package.json          # NPM 套件設定
├── project.config.json   # 微信開發者工具專案設定
├── README.md             # 英文版說明文件
└── SETUP.md              # 安裝設定說明
```

## 開發環境

1. 下載並安裝微信開發者工具：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
2. 在微信開發者工具中開啟本專案資料夾
3. 使用 AppID：`testappid` 進行本機測試
4. 點擊「編譯」執行小程式

## 核心功能

- 動態關係類型系統（資料庫驅動）
- 預設 5 種關係類型（親屬、好友、同學、同事、鄰里）
- 人物/人員管理
- 關係追蹤與自訂屬性
- 自動關係推導

## 文件

詳細文件請查看 `documents/` 目錄。

## 貢獻新的關係類型

我們歡迎社群貢獻，共同擴展關係類型系統！專案目前包含 5 種預設關係類型（親屬、好友、同學、同事、鄰里），我們鼓勵社群開發新的類型以支援更多樣化的關係情境。

### 文件優先開發流程

為確保一致性和品質，我們遵循**文件優先的開發流程**：

1. **📝 建立類型設計文件**
   - 遵循 [關係類型設計規範](documents/關系類型設計/關系類型設計規範.md)
   - 參考 `documents/關系類型設計/` 目錄中的現有範例
   - 定義類型的資料結構、欄位、驗證規則和 UI 元件
   - 提交包含設計文件的 Pull Request

2. **✅ PR 審核與批准**
   - 維護者將審核設計文件
   - 可能會提供改進建議
   - 批准後，PR 將被合併

3. **💻 程式碼實作**
   - 設計文件 PR 被批准並合併後
   - 按照已批准的規範實作關係類型
   - 在 `miniprogram/models/guanxiTypes.js` 中新增類型定義
   - 更新 `miniprogram/locales/` 中的國際化檔案
   - 提交實作程式碼的 PR，並引用設計文件

### 為什麼要文件優先？

- **確保架構一致性** - 所有關係類型保持統一標準
- **促進社群討論** - 在投入開發工作前進行充分討論
- **避免破壞性變更** - 提前驗證資料結構的合理性
- **便於程式碼審查** - 以明確的規範作為審查參考
- **保持長期可維護性** - 維護類型系統的整體品質

詳細指南請參閱：
- [關係類型設計規範](documents/關系類型設計/關系類型設計規範.md) - 設計標準和要求
- [技術詳細設計-5-關係類型外掛實作](documents/技術詳細設計-5-關系類型插件實現.md) - 外掛系統實作指南

## 開源授權

本專案採用 Apache License 2.0 開源授權 - 詳見 [LICENSE](LICENSE) 檔案。

Copyright 2026 GuanXi WeChat Mini Program Contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

有關專利授權的更多資訊，請參閱 [NOTICE](NOTICE) 檔案。
