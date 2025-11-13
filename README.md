# 🚀 Auto Pailot Tester

> 非エンジニアでも使える、完全無料のテスト自動化ツール

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ 特徴

- **📝 テンプレートで簡単**: 用意されたテンプレートを選ぶだけで、すぐにテストを作成
- **🎯 コード不要**: プログラミング知識は一切不要。画面を見ながら要素を選ぶだけ
- **💰 完全無料**: APIコストゼロ、すべてローカルで動作
- **🤖 AI連携**: Vibe Coderと連携して、問題を自動解決
- **📊 詳細なレポート**: 動画・スクリーンショット付きの分かりやすい結果表示

## 🎯 Playwrightとの違い

| 項目 | Playwright | Auto Pailot |
|------|-----------|-------------|
| **操作方法** | コードを書く | 画面で操作するだけ |
| **セレクター** | 自分で指定 | **AIが自動で最適なものを選択** |
| **エラー時** | 止まる | **Vibe Coderで自動修復** |
| **テスト作成** | 1から書く | **テンプレート選択で8割完成** |
| **結果** | ログだけ | **動画+スクショ+改善提案** |
| **学習コスト** | 高い | **チュートリアルで10分** |

## 📦 インストール

### 必要なもの

- Node.js 18以上
- npm または yarn

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/your-username/auto_pailot_tester.git
cd auto_pailot_tester

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

## 🤖 Vibe Coder連携

テストが失敗したら、Vibe Coderに修正を依頼できます：

1. 「Vibe Coderに修正を依頼」ボタンをクリック
2. プロンプトが自動生成され、クリップボードにコピーされます
3. Vibe Coderに貼り付けて実行
4. 結果をコピーして「適用」ボタンを押す

**完全無料** - APIキー不要！

## 📁 プロジェクト構造

```
auto_pailot_tester/
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
- 🐛 [Issue トラッカー](https://github.com/your-username/auto_pailot_tester/issues)
- 💡 [ディスカッション](https://github.com/your-username/auto_pailot_tester/discussions)

## 🙏 謝辞

- [Puppeteer](https://pptr.dev/) - ブラウザ自動化エンジン
- [Electron](https://www.electronjs.org/) - デスクトップアプリフレームワーク
- [React](https://react.dev/) - UIライブラリ
- [Tailwind CSS](https://tailwindcss.com/) - スタイリング

---

**Made with ❤️ for non-engineers**
