# 人間関係図譜 WeChat ミニプログラム

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | 日本語 | [한국어](README.ko-KR.md)

人間関係ネットワークを包括的に管理・探索するための WeChat ミニプログラム。

## プロジェクト構造

```
├── miniprogram/          # ミニプログラムのソースコード
├── documents/            # プロジェクトドキュメント
├── LICENSE               # Apache License 2.0 オープンソースライセンス
├── NOTICE                # 著作権および特許に関する通知
├── package.json          # NPM パッケージ設定
├── project.config.json   # WeChat 開発者ツールのプロジェクト設定
├── README.md             # 英語版ドキュメント
└── SETUP.md              # セットアップ手順
```

## 開発環境

1. WeChat 開発者ツールをダウンロード・インストール：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
2. WeChat 開発者ツールでこのプロジェクトフォルダを開く
3. ローカルテスト用に AppID：`testappid` を使用
4. 「コンパイル」をクリックしてミニプログラムを実行

## 主な機能

- 動的な関係タイプシステム（データベース駆動）
- プリインストールされた5種類の関係タイプ（家族、友人、クラスメイト、同僚、近隣）
- 人物管理
- カスタム属性による関係追跡
- 自動関係推論

## ドキュメント

詳細なドキュメントは `documents/` ディレクトリをご覧ください。

## 新しい関係タイプへの貢献

関係タイプシステムの拡張に向けたコミュニティからの貢献を歓迎します！プロジェクトには現在5種類の関係タイプ（家族、友人、クラスメイト、同僚、近隣）がプリインストールされており、より多様な関係シナリオをサポートする新しいタイプの開発を奨励しています。

### ドキュメント優先のアプローチ

一貫性と品質を確保するため、**ドキュメント優先の開発プロセス**に従います：

1. **📝 タイプ設計ドキュメントの作成**
   - [関係類型設計規範](documents/関系類型設計/関系類型設計規範.md)（関係タイプ設計標準）に従う
   - `documents/関系類型設計/` ディレクトリの既存例を参照
   - タイプのデータ構造、フィールド、検証ルール、UI コンポーネントを定義
   - 設計ドキュメントを含むプルリクエストを提出

2. **✅ PR レビューと承認**
   - 設計ドキュメントはメンテナによってレビューされます
   - 改善のためのフィードバックが提供される場合があります
   - 承認されると、PR がマージされます

3. **💻 実装**
   - 設計ドキュメント PR が承認・マージされた後
   - 承認された仕様に従って関係タイプを実装
   - `miniprogram/models/guanxiTypes.js` にタイプ定義を追加
   - `miniprogram/locales/` の国際化ファイルを更新
   - 設計ドキュメントを参照した実装 PR を提出

### なぜドキュメント優先なのか？

- **アーキテクチャの一貫性を確保** - すべての関係タイプで統一された標準を維持
- **コミュニティでの議論を促進** - 実装作業前に十分な議論を実施
- **破壊的な変更を防止** - データ構造を早期に検証
- **コードレビューを容易化** - 明確な仕様をレビューの参考に
- **長期的な保守性を維持** - タイプシステム全体の品質を維持

詳細なガイドラインについては、以下を参照してください：
- [関係類型設計規範](documents/関系類型設計/関系類型設計規範.md) - 設計標準と要件
- [技術詳細設計-5-関係類型插件実現](documents/技術詳細設計-5-関系類型插件実現.md) - プラグインシステム実装ガイド

## オープンソースライセンス

このプロジェクトは Apache License 2.0 の下でライセンスされています - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

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

特許付与に関する詳細については、[NOTICE](NOTICE) ファイルを参照してください。
