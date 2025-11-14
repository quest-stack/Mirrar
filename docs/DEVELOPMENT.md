# 開発ガイド

Mirarrの開発に参加する際のガイドです。

## 📋 目次

- [開発環境のセットアップ](#開発環境のセットアップ)
- [アーキテクチャ概要](#アーキテクチャ概要)
- [ビルドとテスト](#ビルドとテスト)
- [機能拡張ガイド](#機能拡張ガイド)
- [コントリビューション](#コントリビューション)

---

## 🛠️ 開発環境のセットアップ

### 必要な環境

- **Node.js**: v18以上
- **npm**: v9以上
- **Git**: 最新版推奨
- **エディタ**: VSCode推奨（TypeScript補完が快適）

### 初回セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/quest-stack/Mirarr.git
cd Mirarr

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### 推奨VSCode拡張機能

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss"
  ]
}
```

---

## 🏗️ アーキテクチャ概要

### プロジェクト構造

```
auto_pailot_tester/
├── src/
│   ├── main/              # Electronメインプロセス
│   │   ├── index.ts       # アプリエントリーポイント
│   │   └── preload.ts     # セキュアなIPC通信ブリッジ
│   ├── renderer/          # React UIコンポーネント
│   │   ├── pages/         # ページコンポーネント
│   │   ├── components/    # 再利用可能なコンポーネント
│   │   └── store/         # Zustand状態管理
│   ├── engine/            # テスト実行エンジン
│   │   ├── runner/        # TestRunner - Puppeteer制御
│   │   ├── detector/      # ElementDetector - 要素検出
│   │   └── actions/       # Action実装（click, input等）
│   ├── parser/            # 自然言語パーサー
│   │   └── NLPParser.ts   # ルールベースパターンマッチング
│   ├── plugins/           # AIツール連携プラグイン
│   │   └── AICodingAssistPlugin.ts
│   ├── storage/           # データベース層（未実装）
│   ├── templates/         # テストテンプレート定義
│   │   └── templates.json
│   └── utils/             # ユーティリティ関数
│       └── security.ts    # セキュリティ機能
├── landing/               # Next.js ランディングページ
├── docs/                  # ドキュメント
├── dist/                  # ビルド成果物
└── release/               # パッケージ成果物
```

### 主要コンポーネント

#### 1. TestRunner（テスト実行エンジン）

**責務**: Puppeteerを使ってブラウザを制御し、テストステップを実行

```typescript
// src/engine/runner/TestRunner.ts
export class TestRunner {
  async runTest(test: Test, options: TestRunnerOptions): Promise<TestResult> {
    // 1. ブラウザ初期化
    await this.initialize({ headless: false });

    // 2. 各ステップを順次実行
    for (let i = 0; i < test.steps.length; i++) {
      const step = test.steps[i];
      const action = this.actions.get(step.type);
      const result = await action.execute(this.page, step);

      // 3. 進捗をUIに通知
      options.onProgress?.(i, test.steps.length, result);
    }

    return testResult;
  }
}
```

**拡張ポイント**:
- 新しいアクション追加: `src/engine/actions/` にクラス追加
- エラーハンドリング改善: `executeStep()` メソッド修正

#### 2. ElementDetector（要素検出）

**責務**: 5つの戦略で要素を自動検出し、信頼度スコアでランク付け

```typescript
// src/engine/detector/ElementDetector.ts
export class ElementDetector {
  private strategies: DetectionStrategy[] = [
    new TestIdStrategy(),      // data-testid (信頼度: 1.0)
    new LabelStrategy(),       // label関連付け (信頼度: 0.9)
    new AriaStrategy(),        // aria-label (信頼度: 0.85)
    new TextStrategy(),        // ボタンテキスト (信頼度: 0.85)
    new AttributeStrategy(),   // id/name/class (信頼度: 0.7)
  ];

  async detect(page: Page, description: string): Promise<DetectionResult[]> {
    // 全戦略を並列実行し、信頼度でソート
    const results = await Promise.all(
      this.strategies.map(s => s.detect(page, description))
    );
    return results.flat().sort((a, b) => b.confidence - a.confidence);
  }
}
```

**拡張ポイント**:
- 新しい検出戦略追加: `DetectionStrategy` インターフェース実装
- 信頼度調整: 各戦略の `confidence` 値変更

#### 3. NLPParser（自然言語パーサー）

**責務**: 日本語の自然文をテストステップに変換（APIコストゼロ）

```typescript
// src/parser/NLPParser.ts
export class NLPParser {
  private patterns: ParsePattern[] = [
    {
      regex: /(.+?)を開/,
      action: 'navigate',
      extract: (match) => ({ url: match[1] })
    },
    {
      regex: /(.+?)をクリック/,
      action: 'click',
      extract: (match) => ({ target: match[1] })
    }
  ];

  parse(text: string): TestStep[] {
    return text.split('\n').map(line => {
      for (const pattern of this.patterns) {
        const match = line.match(pattern.regex);
        if (match) return { type: pattern.action, ...pattern.extract(match) };
      }
    });
  }
}
```

**拡張ポイント**:
- パターン追加: `patterns` 配列に新規追加
- 英語対応: 新しい `EnglishNLPParser` クラス作成

#### 4. AICodingAssistPlugin（AI連携）

**責務**: テスト失敗時にAIツールへのプロンプトを生成（クリップボード経由）

```typescript
// src/plugins/AICodingAssistPlugin.ts
export class AICodingAssistPlugin extends AIPlugin {
  async sendPrompt(issue: string, context: AIPromptContext): Promise<AIResponse> {
    // セキュリティチェック
    const securityCheck = checkPromptSecurity(fullPrompt);
    if (!securityCheck.safe) {
      return { success: false, warnings: securityCheck.warnings };
    }

    // クリップボードにコピー
    await navigator.clipboard.writeText(fullPrompt);

    return {
      success: true,
      message: 'Claude Code/Cursor/Windsurf等のAIツールに貼り付けてください',
      action: { type: 'guide', steps: [...] }
    };
  }
}
```

**拡張ポイント**:
- プロンプトテンプレート改善: `buildPrompt()` メソッド修正
- 新しいAIプラグイン追加: `AIPlugin` 継承クラス作成

---

## 🔨 ビルドとテスト

### 開発モード

```bash
# UI開発（ホットリロード有効）
npm run dev:renderer

# メインプロセス開発
npm run watch:main

# 両方同時起動
npm run dev
```

### プロダクションビルド

```bash
# ビルド実行
npm run build

# ビルド結果確認
npm start

# パッケージング（配布用）
npm run package        # 現在のOS用
npm run package:win    # Windows用
npm run package:mac    # macOS用
npm run package:linux  # Linux用
```

### テスト実行

```bash
# ユニットテスト
npm test

# E2Eテスト（未実装）
npm run test:e2e

# リント
npm run lint

# フォーマット
npm run format
```

---

## 🚀 機能拡張ガイド

### 新しいテンプレートを追加

**ファイル**: `src/templates/templates.json`

```json
{
  "templates": [
    {
      "id": "new_template",
      "name": "新機能テスト",
      "description": "新しい機能のテストテンプレート",
      "steps": [
        {
          "type": "navigate",
          "description": "ページを開く",
          "url": "https://example.com"
        },
        {
          "type": "click",
          "description": "ボタンをクリック",
          "detectionRules": {
            "preferredStrategy": "testid",
            "fallbackStrategies": ["label", "text"]
          }
        }
      ],
      "variables": [
        {
          "name": "testUrl",
          "type": "string",
          "description": "テスト対象URL",
          "required": true
        }
      ]
    }
  ]
}
```

**テストのコツ**:
1. `detectionRules` で検出戦略の優先順位を指定
2. `variables` で動的な値をユーザーに入力させる
3. `description` は日本語で具体的に書く（NLPパーサーが使う）

### 新しい検出戦略を追加

**ファイル**: `src/engine/detector/strategies/CustomStrategy.ts`

```typescript
import { DetectionStrategy, DetectionResult } from './DetectionStrategy';
import { Page } from 'puppeteer';

export class CustomStrategy implements DetectionStrategy {
  name = 'custom';
  confidence = 0.8;  // 0.0 ~ 1.0

  async detect(page: Page, description: string): Promise<DetectionResult[]> {
    // ページ内の要素を検索
    const elements = await page.$$('your-selector');

    // マッチした要素を返す
    return elements.map(element => ({
      element,
      selector: 'your-selector',
      confidence: this.confidence,
      strategy: this.name,
      description: `Found by ${this.name} strategy`
    }));
  }
}
```

**ElementDetectorに登録**:

```typescript
// src/engine/detector/ElementDetector.ts
import { CustomStrategy } from './strategies/CustomStrategy';

constructor() {
  this.strategies = [
    new TestIdStrategy(),
    new CustomStrategy(),  // 追加
    // ...
  ];
}
```

### NLPパーサーにパターン追加

**ファイル**: `src/parser/NLPParser.ts`

```typescript
private patterns: ParsePattern[] = [
  // 既存パターン
  { regex: /(.+?)を開/, action: 'navigate', ... },

  // 新規パターン追加
  {
    regex: /(.+?)が表示されることを確認/,
    action: 'assert_visible',
    extract: (match) => ({
      target: match[1],
      assertion: 'visible'
    })
  },
  {
    regex: /(.+?)から(.+?)を選択/,
    action: 'select',
    extract: (match) => ({
      target: match[1],
      value: match[2]
    })
  }
];
```

**対応するActionを実装**:

```typescript
// src/engine/actions/AssertVisibleAction.ts
export class AssertVisibleAction extends Action {
  async execute(page: Page, step: TestStep): Promise<ActionResult> {
    const element = await this.detector.detect(page, step.target);
    const isVisible = await element.isVisible();

    return {
      success: isVisible,
      message: isVisible ? '要素が表示されています' : '要素が見つかりません'
    };
  }
}
```

### 新しいActionを追加

**ファイル**: `src/engine/actions/UploadFileAction.ts`

```typescript
import { Action, ActionResult } from './Action';
import { Page } from 'puppeteer';
import { TestStep } from '../../types';

export class UploadFileAction extends Action {
  type = 'upload_file';

  async execute(page: Page, step: TestStep): Promise<ActionResult> {
    try {
      // 要素検出
      const results = await this.detector.detect(page, step.description);
      if (results.length === 0) {
        return { success: false, message: 'ファイル入力フィールドが見つかりません' };
      }

      // ファイルアップロード
      const inputElement = results[0].element;
      await inputElement.uploadFile(step.filePath);

      return {
        success: true,
        message: `ファイル "${step.filePath}" をアップロードしました`,
        screenshot: await page.screenshot()
      };
    } catch (error) {
      return {
        success: false,
        message: `アップロード失敗: ${error.message}`
      };
    }
  }
}
```

**TestRunnerに登録**:

```typescript
// src/engine/runner/TestRunner.ts
import { UploadFileAction } from '../actions/UploadFileAction';

private initializeActions() {
  this.actions.set('upload_file', new UploadFileAction(this.detector));
  // ...
}
```

---

## 🤝 コントリビューション

### ブランチ戦略

- `main`: 本番リリース用
- `develop`: 開発用統合ブランチ
- `feature/*`: 機能追加
- `fix/*`: バグ修正
- `docs/*`: ドキュメント更新

### プルリクエストの流れ

1. **Issue作成**: 実装する機能や修正するバグを記載
2. **ブランチ作成**:
   ```bash
   git checkout -b feature/new-detection-strategy
   ```
3. **実装**: コードを書く
4. **テスト**: 動作確認とテスト追加
5. **コミット**: 明確なコミットメッセージ
   ```bash
   git commit -m "feat: Add CustomStrategy for shadow DOM detection"
   ```
6. **Push & PR作成**:
   ```bash
   git push origin feature/new-detection-strategy
   ```

### コミットメッセージ規約

```
<type>: <subject>

<body>

<footer>
```

**Type**:
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `refactor`: リファクタリング
- `test`: テスト追加
- `chore`: ビルド・設定変更

**例**:
```
feat: Add drag-and-drop action support

- Implement DragAndDropAction class
- Add detection rules for draggable elements
- Update templates.json with drag-drop example

Closes #42
```

### コードスタイル

```bash
# ESLintでチェック
npm run lint

# Prettierで自動整形
npm run format
```

**重要な規約**:
- TypeScriptの型は厳密に（`any` は避ける）
- 関数はシングルレスポンシビリティ
- エラーハンドリングは必須
- ユーザー向けメッセージは日本語、コードは英語

### AIツール（Vibe Coding）での開発Tips

**Claude Code / Cursor / Windsurf を使う場合**:

```
# 良いプロンプト例
「ElementDetectorにXPath戦略を追加したい。
既存のTestIdStrategyと同じインターフェースで実装して。
信頼度は0.75で、XPath式でマッチした要素を返すようにしてほしい。」

# 避けるべきプロンプト
「要素検出を改善して」（曖昧すぎる）
```

**エラーが出たら**:
1. エラーメッセージ全文をコピー
2. 関連するファイルパスを含める
3. 「このエラーを修正して」とAIに依頼

**リファクタリング**:
```
「TestRunner.tsのrunTest()メソッドが長すぎるので、
以下の責務に分割してリファクタリングして：
- ブラウザ初期化
- ステップ実行ループ
- 結果集約」
```

---

## 📚 参考資料

### 使用技術のドキュメント

- [Electron](https://www.electronjs.org/docs/latest/)
- [Puppeteer](https://pptr.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Zustand](https://zustand-demo.pmnd.rs/)

### プロジェクト内ドキュメント

- [設計ドキュメント](../DESIGN_v2.md)
- [ユーザーガイド](./USER_GUIDE.md)
- [セキュリティガイド](./SECURITY.md)
- [データベース戦略](./DATABASE.md)

### 質問・サポート

- **GitHub Issues**: バグ報告・機能提案
- **Discussions**: 技術的な質問・アイデア共有

---

## 🎯 今後の開発ロードマップ

### Phase 1: コア機能完成（v0.1.0）
- [x] TestRunner基本実装
- [x] ElementDetector 5戦略
- [x] NLPParser基本パターン
- [x] テンプレート5種類
- [ ] SQLite統合
- [ ] ビデオ録画機能

### Phase 2: ユーザビリティ向上（v0.2.0）
- [ ] テストデバッグUI
- [ ] ステップ実行（ブレークポイント）
- [ ] 要素選択ツール（Chrome DevTools風）
- [ ] テンプレートマーケットプレイス

### Phase 3: 高度な機能（v0.3.0）
- [ ] APIテスト対応
- [ ] モバイルブラウザ対応
- [ ] CI/CD統合（GitHub Actions）
- [ ] チーム機能（Tursoクラウド同期）

---

Happy Coding! 🚀

このプロジェクトは、非エンジニアでもテスト自動化できる世界を目指しています。
あなたの貢献が、誰かの開発体験を変えるかもしれません。
