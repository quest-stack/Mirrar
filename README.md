# 🪞 Mirarr（ミラー）

> 非エンジニアでも使える、完全無料のテスト自動化ツール

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ 特徴

- **📝 テンプレートで簡単**: 用意されたテンプレートを選ぶだけで、すぐにテストを作成
- **🎯 コード不要**: プログラミング知識は一切不要。画面を見ながら要素を選ぶだけ
- **💰 完全無料**: APIコストゼロ、すべてローカルで動作
- **🤖 Vibe Coding対応**: Claude Code、Cursor、Windsurf等のAIツールと連携して問題を自動解決
- **📊 詳細なレポート**: 動画・スクリーンショット付きの分かりやすい結果表示

## 🎯 既存ツールとの違い

| 項目 | コードベースのツール | Mirarr |
|------|-----------|-------------|
| **操作方法** | コードを書く | 画面で操作するだけ |
| **セレクター** | 自分で指定 | **AIが自動で最適なものを選択** |
| **エラー時** | 止まる | **AIツールで自動修復（Vibe Coding）** |
| **テスト作成** | 1から書く | **テンプレート選択で8割完成** |
| **結果** | ログだけ | **動画+スクショ+改善提案** |
| **学習コスト** | 高い | **チュートリアルで10分** |

**補足:** コードベースのテストツール（Playwright、Puppeteer等）は、エンジニア向けの強力で優れたツールです。Mirarr は、それらとは異なるアプローチで非エンジニアでもVibe Codingで使えるように設計されています。プログラミングスキルや用途に応じて、最適なツールをお選びください。

## 📦 インストール

### 必要なもの

- Node.js 18以上
- npm または yarn

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/quest-stack/Mirrar.git
cd Mirarr

# 依存関係をインストール
npm install

# 開発モードで起動
npm run dev

# ビルド
npm run build

# パッケージング（実行ファイル作成）
npm run package
```

## 🚀 使い方

### 1. テンプレートを選択

アプリを起動したら、「新しいテストを作成」ボタンをクリック。

以下のテンプレートから選べます：

- **📝 ログイン機能をテストする** - メール・パスワード入力の確認
- **📄 フォーム送信をテストする** - 入力→送信→完了画面の確認
- **🛒 商品購入フローをテストする** - カートに追加→決済までの流れ
- **🔍 検索機能をテストする** - キーワード入力→結果表示の確認
- **✨ 自分で一から作る** - 完全カスタムのテスト

### 2. ガイドに従って設定

各ステップで表示されるガイドに従って：

1. URLを入力
2. 要素を選択（自動検出されます）
3. テストデータを入力

### 3. テストを実行

「テストを実行」ボタンをクリックするだけ！

実行結果は：
- ✅ 各ステップの成功/失敗
- 📸 スクリーンショット
- 🎥 実行動画
- 💡 改善提案

で確認できます。

## 🎨 自然言語でテストを作成

普通の日本語でテストを書けます：

```
example.comを開いて、
ログインボタンをクリックして、
メールにtest@example.comと入力して、
パスワードにpassword123と入力して、
ログインボタンを押す
```

これだけで、自動的にテストが生成されます！

## 🤖 Vibe Coding スタイルのAI連携

**Vibe Coding** = Claude Code、Cursor、Windsurf、GitHub Copilot等のAIツールを使った開発スタイル

テストが失敗したら、普段使っているAIツールに修正を依頼できます：

1. 「AIツールに修正を依頼」ボタンをクリック
2. プロンプトが自動生成され、クリップボードにコピーされます
3. **Claude Code / Cursor / Windsurf** 等、普段使っているAIツールに貼り付けて実行
4. 生成された修正案をコピーして「適用」ボタンを押す

**完全無料** - APIキー不要！クリップボード経由なので、どのAIツールでも使えます。

## 📁 プロジェクト構造

```
Mirarr/
├── src/
│   ├── main/              # Electronメインプロセス
│   ├── renderer/          # Reactアプリ
│   │   ├── components/    # UIコンポーネント
│   │   ├── pages/         # ページ
│   │   └── store/         # 状態管理
│   ├── engine/            # テスト実行エンジン
│   │   ├── runner/        # テストランナー
│   │   ├── detector/      # 要素検出
│   │   └── actions/       # テストアクション
│   ├── parser/            # 自然言語パーサー
│   ├── plugins/           # AIプラグイン
│   └── templates/         # テンプレート定義
├── docs/                  # ドキュメント
└── tests/                 # テストコード
```

## 🛠️ 開発

```bash
# 開発モードで起動
npm run dev

# テスト実行
npm test

# Lint
npm run lint

# フォーマット
npm run format
```

## 📝 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) をご覧ください。

## 🤝 コントリビューション

プルリクエスト大歓迎です！

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 💬 サポート

- 📖 [ユーザーガイド](docs/USER_GUIDE.md)
- 🐛 [Issue トラッカー](https://github.com/quest-stack/Mirrar/issues)
- 💡 [ディスカッション](https://github.com/quest-stack/Mirrar/discussions)

## 🙏 謝辞

- [Puppeteer](https://pptr.dev/) - ブラウザ自動化エンジン
- [Electron](https://www.electronjs.org/) - デスクトップアプリフレームワーク
- [React](https://react.dev/) - UIライブラリ
- [Tailwind CSS](https://tailwindcss.com/) - スタイリング

---

**Made by 合同会社QUEST for non-engineers**
