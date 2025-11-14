# テスト自動化システム設計書
## Mirrar

> 🎯 **コンセプト**: 完全無料・APIコスト0円で使える、非エンジニア向けテスト自動化ツール

---

## 📋 目次
1. [システム概要](#システム概要)
2. [技術スタック](#技術スタック)
3. [コア機能設計](#コア機能設計)
4. [AI連携戦略](#ai連携戦略)
5. [アーキテクチャ](#アーキテクチャ)
6. [実装ロードマップ](#実装ロードマップ)

---

## システム概要

### 設計思想
- **完全無料**: 外部API不要、ランニングコストゼロ
- **ローカル完結**: すべての処理をユーザーのマシンで実行
- **AI連携可能**: Vibe Coderなど外部AIツールとオプション連携
- **超直感的**: 知識ゼロでも10分で使える

### Playwrightとの差別化

| 項目 | Playwright | Mirrar |
|------|-----------|-------------|
| コード記述 | 必須 | 不要 |
| セットアップ | CLI操作が必要 | GUIで完結 |
| テスト作成 | 1から書く | テンプレート選択 |
| エラー対応 | 自分で修正 | ガイド付き修正 |
| 学習コスト | 数日〜数週間 | 10分 |
| コスト | 無料 | 無料 |
| AI連携 | なし | Vibe Coder連携 |

---

## 技術スタック

### フロントエンド
```
Electron + React + TypeScript
├── UI Framework: React 18+
├── State Management: Zustand (軽量)
├── Styling: Tailwind CSS
└── デスクトップ: Electron
```

**選定理由**:
- Electronで完全ローカル動作
- クロスプラットフォーム対応（Windows/Mac/Linux）
- インストール1回で完結

### バックエンド（ローカル）
```
Node.js
├── 自動化エンジン: Puppeteer
├── データ保存: SQLite（ファイルベース）
├── 録画: puppeteer-screen-recorder
└── スクショ: 組み込み機能
```

**選定理由**:
- Puppeteerは完全無料、API不要
- SQLiteでサーバー不要
- すべてローカルで完結

### AI連携（オプション）
```
プラグイン形式
├── Vibe Coder連携
├── ローカルLLM連携（Ollama等）
└── カスタムプロンプトAPI
```

---

## コア機能設計

### 1. テンプレートライブラリ（API不要）

**実装方法**: JSON定義ファイル + ルールベース

```json
{
  "templates": [
    {
      "id": "login_test",
      "name": "ログイン機能をテストする",
      "description": "メール・パスワード入力の確認",
      "icon": "📝",
      "steps": [
        {
          "type": "navigate",
          "description": "ログインページを開く",
          "prompt": "ログインページのURLを入力してください",
          "detectionRules": ["login", "signin", "auth"]
        },
        {
          "type": "input",
          "description": "メールアドレスを入力",
          "prompt": "メールアドレスの入力欄をクリックしてください",
          "detectionRules": {
            "selectors": [
              "input[type='email']",
              "input[name*='email']",
              "input[id*='email']",
              "input[placeholder*='email']"
            ],
            "labels": ["メール", "Email", "mail"]
          }
        },
        {
          "type": "input",
          "description": "パスワードを入力",
          "prompt": "パスワードの入力欄をクリックしてください",
          "detectionRules": {
            "selectors": [
              "input[type='password']",
              "input[name*='password']",
              "input[id*='pass']"
            ],
            "labels": ["パスワード", "Password", "pass"]
          }
        },
        {
          "type": "click",
          "description": "ログインボタンをクリック",
          "prompt": "ログインボタンをクリックしてください",
          "detectionRules": {
            "selectors": [
              "button[type='submit']",
              "input[type='submit']"
            ],
            "text": ["ログイン", "Login", "Sign in", "送信"]
          }
        }
      ]
    },
    {
      "id": "form_test",
      "name": "フォーム送信をテストする",
      "description": "入力→送信→完了画面の確認",
      "icon": "📄",
      "steps": [...]
    },
    {
      "id": "shopping_test",
      "name": "商品購入フローをテストする",
      "description": "カートに追加→決済までの流れ",
      "icon": "🛒",
      "steps": [...]
    },
    {
      "id": "search_test",
      "name": "検索機能をテストする",
      "description": "キーワード入力→結果表示の確認",
      "icon": "🔍",
      "steps": [...]
    }
  ]
}
```

**自動検出アルゴリズム（API不要）**:
```javascript
// 要素を自動検出する関数
async function detectElement(page, rules) {
  const candidates = [];

  // 1. セレクターで検索
  for (const selector of rules.selectors) {
    const elements = await page.$$(selector);
    candidates.push(...elements.map(el => ({
      element: el,
      confidence: 0.8,
      method: 'selector'
    })));
  }

  // 2. ラベルテキストで検索
  for (const label of rules.labels) {
    const elements = await page.$$(`label:has-text("${label}") + input`);
    candidates.push(...elements.map(el => ({
      element: el,
      confidence: 0.9,
      method: 'label'
    })));
  }

  // 3. プレースホルダーで検索
  for (const text of rules.labels) {
    const elements = await page.$$(`input[placeholder*="${text}"]`);
    candidates.push(...elements.map(el => ({
      element: el,
      confidence: 0.7,
      method: 'placeholder'
    })));
  }

  // 4. 信頼度順にソート
  candidates.sort((a, b) => b.confidence - a.confidence);

  return candidates;
}
```

### 2. 超具体的なガイドシステム（API不要）

**ステップバイステップUI**:
```javascript
const GuideFlow = {
  steps: [
    {
      id: 1,
      title: "テンプレートを選択",
      description: "どんなテストをしたいですか？",
      ui: "template-selector",
      hints: [
        "初めての方は「ログイン機能」がおすすめです",
        "テンプレートは後から変更できます"
      ]
    },
    {
      id: 2,
      title: "URLを入力",
      description: "テストしたいページのURLを入力してください",
      ui: "url-input",
      validation: "url",
      hints: [
        "例: https://example.com/login",
        "ローカル開発環境も使えます（http://localhost:3000）"
      ]
    },
    {
      id: 3,
      title: "要素を選択",
      description: "{{elementName}}をクリックしてください",
      ui: "element-picker",
      realtime: true, // リアルタイムプレビュー
      hints: [
        "ページ内の要素にマウスを重ねると、ハイライトされます",
        "自動検出された要素には ✅ マークが表示されます"
      ]
    },
    {
      id: 4,
      title: "テスト値を設定",
      description: "入力するテストデータを設定してください",
      ui: "test-data-form",
      hints: [
        "本番データは使わないでください",
        "複数のパターンを試すこともできます"
      ]
    },
    {
      id: 5,
      title: "テスト実行",
      description: "準備完了！テストを実行しましょう",
      ui: "test-runner",
      hints: [
        "初回は少し時間がかかることがあります",
        "実行中の様子を動画で記録します"
      ]
    }
  ]
};
```

**リアルタイムヘルプシステム**:
```javascript
// コンテキストに応じたヘルプ表示
const contextualHelp = {
  "element-not-found": {
    title: "要素が見つかりません",
    suggestions: [
      "ページの読み込みが完了していますか？",
      "要素は画面に表示されていますか？",
      "スクロールが必要な場合があります"
    ],
    action: {
      label: "もう一度試す",
      retry: true
    }
  },
  "test-failed": {
    title: "テストが失敗しました",
    suggestions: [
      "画面が変更されていませんか？",
      "セレクターを更新してみましょう",
      "Vibe Coderに修正を依頼できます"
    ],
    actions: [
      {
        label: "セレクターを再取得",
        action: "redetect"
      },
      {
        label: "Vibe Coderで修正",
        action: "vibe-coder"
      }
    ]
  }
};
```

### 3. 簡易自然言語パーサー（API不要）

**ルールベースのパーサー実装**:
```javascript
// パターンマッチングで自然言語を解析
class SimpleNLPParser {
  constructor() {
    this.patterns = [
      {
        // "〜を開く" パターン
        regex: /(.+?)を開/,
        action: 'navigate',
        extract: (match) => ({ url: match[1] })
      },
      {
        // "〜をクリック" パターン
        regex: /(.+?)を(?:クリック|押)/,
        action: 'click',
        extract: (match) => ({ target: match[1] })
      },
      {
        // "〜に〜と入力" パターン
        regex: /(.+?)に(.+?)(?:と|を)入力/,
        action: 'type',
        extract: (match) => ({
          target: match[1],
          value: match[2]
        })
      },
      {
        // "〜が表示される" パターン
        regex: /(.+?)が(?:表示|見える)/,
        action: 'waitFor',
        extract: (match) => ({ target: match[1] })
      },
      {
        // "〜秒待つ" パターン
        regex: /(\d+)秒待/,
        action: 'wait',
        extract: (match) => ({ duration: parseInt(match[1]) * 1000 })
      }
    ];
  }

  parse(text) {
    const lines = text.split(/[、。\n]/).filter(l => l.trim());
    const steps = [];

    for (const line of lines) {
      for (const pattern of this.patterns) {
        const match = line.match(pattern.regex);
        if (match) {
          steps.push({
            action: pattern.action,
            ...pattern.extract(match),
            originalText: line
          });
          break;
        }
      }
    }

    return steps;
  }
}

// 使用例
const parser = new SimpleNLPParser();
const input = `
  example.comを開いて、
  ログインボタンをクリックして、
  メールにtest@example.comと入力して、
  パスワードにpassword123と入力して、
  ログインボタンを押す
`;

const steps = parser.parse(input);
// => [
//   { action: 'navigate', url: 'example.com', originalText: 'example.comを開いて' },
//   { action: 'click', target: 'ログインボタン', originalText: 'ログインボタンをクリックして' },
//   { action: 'type', target: 'メール', value: 'test@example.com', ... },
//   ...
// ]
```

**スマート要素マッチング**:
```javascript
// 自然言語の要素名を実際のセレクターに変換
async function matchElementByDescription(page, description) {
  const keywords = description.toLowerCase().split(/\s+/);

  // 優先度付きマッチング
  const strategies = [
    // 1. data-testid（最優先）
    async () => {
      for (const keyword of keywords) {
        const el = await page.$(`[data-testid*="${keyword}"]`);
        if (el) return { element: el, confidence: 1.0, method: 'testid' };
      }
    },

    // 2. button/input のテキスト
    async () => {
      for (const keyword of keywords) {
        const el = await page.$(`button:has-text("${keyword}")`);
        if (el) return { element: el, confidence: 0.9, method: 'text' };
      }
    },

    // 3. label + input
    async () => {
      for (const keyword of keywords) {
        const el = await page.$(`label:has-text("${keyword}") + input`);
        if (el) return { element: el, confidence: 0.85, method: 'label' };
      }
    },

    // 4. aria-label
    async () => {
      for (const keyword of keywords) {
        const el = await page.$(`[aria-label*="${keyword}"]`);
        if (el) return { element: el, confidence: 0.8, method: 'aria' };
      }
    },

    // 5. id/name 属性
    async () => {
      for (const keyword of keywords) {
        const el = await page.$(`[id*="${keyword}"], [name*="${keyword}"]`);
        if (el) return { element: el, confidence: 0.7, method: 'attribute' };
      }
    }
  ];

  // 各戦略を順番に試す
  for (const strategy of strategies) {
    const result = await strategy();
    if (result) return result;
  }

  return null;
}
```

### 4. Vibe Coder連携（オプション機能）

**プラグインアーキテクチャ**:
```javascript
// プラグインインターフェース
class AIPlugin {
  constructor(name, endpoint) {
    this.name = name;
    this.endpoint = endpoint;
  }

  async sendPrompt(prompt, context) {
    // 各AIツールとの連携実装
    throw new Error('Must be implemented by subclass');
  }
}

// Vibe Coder連携プラグイン
class VibeCoderPlugin extends AIPlugin {
  constructor() {
    super('Vibe Coder', null); // エンドポイントは不要
  }

  // プロンプトをクリップボードにコピー
  async sendPrompt(prompt, context) {
    const fullPrompt = this.buildPrompt(prompt, context);

    // クリップボードにコピー
    await navigator.clipboard.writeText(fullPrompt);

    // Vibe Coderを開くガイドを表示
    return {
      success: true,
      message: 'プロンプトをコピーしました！Vibe Coderに貼り付けてください',
      action: {
        type: 'guide',
        steps: [
          'Vibe Coderを開く',
          'Ctrl+V でプロンプトを貼り付け',
          '生成された内容をコピー',
          'このアプリに戻って「適用」ボタンを押す'
        ]
      }
    };
  }

  buildPrompt(issue, context) {
    return `
# テスト自動化の問題修正

## 現在の状況
${context.currentTest ? `テスト名: ${context.currentTest.name}` : ''}
ステップ: ${context.currentStep}

## 発生している問題
${issue}

## 現在のセレクター
\`\`\`
${context.selector}
\`\`\`

## ページのHTML（関連部分）
\`\`\`html
${context.htmlSnapshot}
\`\`\`

## 依頼内容
上記の問題を解決するための新しいセレクターを提案してください。
以下の形式で回答してください：

\`\`\`json
{
  "selector": "推奨するセレクター",
  "reason": "選択理由",
  "alternatives": ["代替案1", "代替案2"]
}
\`\`\`
    `.trim();
  }

  // AI からの応答を適用
  async applyResponse(response, context) {
    try {
      const data = JSON.parse(response);

      // セレクターを更新
      context.updateSelector(data.selector);

      return {
        success: true,
        message: `セレクターを更新しました: ${data.selector}`,
        details: data.reason
      };
    } catch (error) {
      return {
        success: false,
        message: '応答の解析に失敗しました'
      };
    }
  }
}
```

**UI統合**:
```jsx
// Vibe Coder連携ボタン
function VibeCoderAssist({ issue, context }) {
  const [step, setStep] = useState('initial');
  const [prompt, setPrompt] = useState('');

  const handleRequest = async () => {
    const plugin = new VibeCoderPlugin();
    const result = await plugin.sendPrompt(issue, context);

    setPrompt(result.action.steps);
    setStep('waiting');
  };

  const handleApply = async (aiResponse) => {
    const plugin = new VibeCoderPlugin();
    const result = await plugin.applyResponse(aiResponse, context);

    if (result.success) {
      setStep('complete');
    }
  };

  return (
    <div className="vibe-coder-assist">
      {step === 'initial' && (
        <>
          <h3>Vibe Coderに修正を依頼</h3>
          <p>{issue}</p>
          <button onClick={handleRequest}>
            プロンプトをコピー
          </button>
        </>
      )}

      {step === 'waiting' && (
        <>
          <h3>Vibe Coderで実行してください</h3>
          <ol>
            {prompt.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <textarea
            placeholder="Vibe Coderからの回答を貼り付けてください"
            onChange={(e) => setResponse(e.target.value)}
          />
          <button onClick={() => handleApply(response)}>
            適用
          </button>
        </>
      )}

      {step === 'complete' && (
        <>
          <h3>✅ 修正完了！</h3>
          <button onClick={() => context.retryTest()}>
            テストを再実行
          </button>
        </>
      )}
    </div>
  );
}
```

**プリセットプロンプト集**:
```javascript
const VIBE_CODER_PROMPTS = {
  selectorFix: {
    title: "セレクターを修正",
    template: (context) => `
テスト自動化でセレクターが動作しません。
${context.htmlSnapshot}
上記のHTMLから、「${context.elementDescription}」を指すセレクターを教えてください。
    `
  },

  testCreation: {
    title: "テストを自動生成",
    template: (context) => `
以下のページのテストを作成してください：
URL: ${context.url}
目的: ${context.purpose}

以下の形式で出力してください：
\`\`\`json
{
  "steps": [
    {"action": "navigate", "url": "..."},
    {"action": "click", "selector": "..."}
  ]
}
\`\`\`
    `
  },

  assertionSuggestion: {
    title: "検証項目を提案",
    template: (context) => `
${context.testName}のテストで、どんな検証をすべきですか？
具体的な検証項目を5つ提案してください。
    `
  }
};
```

---

## アーキテクチャ

### システム構成図

```
┌─────────────────────────────────────────────────────────┐
│                    Electron App                          │
│                 (デスクトップアプリ)                        │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  React Frontend                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Template     │  │ Test Editor  │  │ Result       │  │
│  │ Selector     │  │              │  │ Viewer       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Element      │  │ NLP Parser   │  │ Guide        │  │
│  │ Picker       │  │ (ルールベース) │  │ System       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    Core Engine                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Test Runner (Puppeteer)                            │ │
│  │  - ブラウザ制御                                      │ │
│  │  - スクリーンショット                                │ │
│  │  - 動画録画                                         │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Smart Detector                                     │ │
│  │  - 要素自動検出                                      │ │
│  │  - セレクター最適化                                  │ │
│  │  - リトライロジック                                  │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ SQLite       │  │ File System  │  │ Templates    │  │
│  │ (テスト履歴)  │  │ (動画・画像)  │  │ (JSON)       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↕
                   ┌─────────────────┐
                   │ AI Plugin       │
                   │ (オプション)     │
                   │ - Vibe Coder   │
                   │ - Local LLM    │
                   │ - Custom API   │
                   └─────────────────┘
```

### ディレクトリ構造

```
Mirrar/
├── src/
│   ├── main/                      # Electronメインプロセス
│   │   ├── index.ts               # アプリエントリーポイント
│   │   ├── menu.ts                # メニューバー
│   │   └── window.ts              # ウィンドウ管理
│   │
│   ├── renderer/                  # Reactアプリ
│   │   ├── components/            # UIコンポーネント
│   │   │   ├── TemplateSelector/  # テンプレート選択
│   │   │   ├── TestEditor/        # テストエディター
│   │   │   ├── ElementPicker/     # 要素選択ツール
│   │   │   ├── GuidePanel/        # ガイドUI
│   │   │   ├── ResultViewer/      # 結果表示
│   │   │   └── VibeCoderAssist/   # AI連携UI
│   │   │
│   │   ├── pages/                 # ページコンポーネント
│   │   │   ├── Home.tsx           # ホーム画面
│   │   │   ├── TestCreate.tsx     # テスト作成画面
│   │   │   ├── TestEdit.tsx       # テスト編集画面
│   │   │   └── TestResult.tsx     # 結果表示画面
│   │   │
│   │   ├── store/                 # 状態管理
│   │   │   ├── testStore.ts       # テスト管理
│   │   │   ├── uiStore.ts         # UI状態
│   │   │   └── configStore.ts     # 設定
│   │   │
│   │   ├── App.tsx                # Reactルート
│   │   └── index.tsx              # レンダラーエントリー
│   │
│   ├── engine/                    # テスト実行エンジン
│   │   ├── runner/
│   │   │   ├── TestRunner.ts      # テスト実行制御
│   │   │   ├── Browser.ts         # ブラウザ管理
│   │   │   └── Recorder.ts        # 録画機能
│   │   │
│   │   ├── detector/              # 要素検出
│   │   │   ├── ElementDetector.ts # 要素自動検出
│   │   │   ├── SelectorBuilder.ts # セレクター生成
│   │   │   └── strategies/        # 検出戦略
│   │   │       ├── TestIdStrategy.ts
│   │   │       ├── TextStrategy.ts
│   │   │       ├── LabelStrategy.ts
│   │   │       └── AriaStrategy.ts
│   │   │
│   │   ├── actions/               # テストアクション
│   │   │   ├── BaseAction.ts      # アクション基底クラス
│   │   │   ├── NavigateAction.ts  # ページ遷移
│   │   │   ├── ClickAction.ts     # クリック
│   │   │   ├── TypeAction.ts      # テキスト入力
│   │   │   ├── WaitAction.ts      # 待機
│   │   │   └── AssertAction.ts    # 検証
│   │   │
│   │   └── utils/
│   │       ├── smartWait.ts       # インテリジェント待機
│   │       └── retry.ts           # リトライロジック
│   │
│   ├── parser/                    # 自然言語パーサー
│   │   ├── NLPParser.ts           # メインパーサー
│   │   ├── patterns.ts            # パターン定義
│   │   └── matcher.ts             # 要素マッチング
│   │
│   ├── plugins/                   # AIプラグイン
│   │   ├── AIPlugin.ts            # プラグイン基底クラス
│   │   ├── VibeCoderPlugin.ts     # Vibe Coder連携
│   │   ├── OllamaPlugin.ts        # Ollama連携
│   │   └── prompts.ts             # プロンプトテンプレート
│   │
│   ├── storage/                   # データ管理
│   │   ├── db/
│   │   │   ├── schema.sql         # DBスキーマ
│   │   │   ├── migrations/        # マイグレーション
│   │   │   └── repository/        # リポジトリ
│   │   │       ├── TestRepository.ts
│   │   │       └── ResultRepository.ts
│   │   │
│   │   └── files/
│   │       ├── FileManager.ts     # ファイル管理
│   │       └── VideoManager.ts    # 動画管理
│   │
│   └── templates/                 # テンプレート定義
│       ├── templates.json         # テンプレート一覧
│       └── schemas/               # スキーマ定義
│           └── template.schema.json
│
├── assets/                        # 静的ファイル
│   ├── icons/                     # アイコン
│   ├── images/                    # 画像
│   └── videos/                    # チュートリアル動画
│
├── tests/                         # テストコード
│   ├── unit/                      # ユニットテスト
│   ├── integration/               # 統合テスト
│   └── e2e/                       # E2Eテスト
│
├── docs/                          # ドキュメント
│   ├── DESIGN.md                  # 設計書（このファイル）
│   ├── USER_GUIDE.md              # ユーザーガイド
│   ├── DEVELOPMENT.md             # 開発ガイド
│   └── API.md                     # API仕様
│
├── electron-builder.json          # Electronビルド設定
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

---

## 実装ロードマップ

### Phase 1: MVP（最小機能版）- 2週間

**目標**: 基本的なテスト作成・実行ができる

#### Week 1
- [ ] プロジェクトセットアップ
  - [ ] Electron + React環境構築
  - [ ] Puppeteer統合
  - [ ] SQLiteセットアップ
- [ ] 基本UI実装
  - [ ] ホーム画面
  - [ ] テンプレート選択画面
  - [ ] シンプルなエディター
- [ ] テンプレートシステム
  - [ ] templates.json作成
  - [ ] ログインテストテンプレート
  - [ ] フォームテストテンプレート

#### Week 2
- [ ] 要素検出機能
  - [ ] ElementDetector実装
  - [ ] 基本的な検出戦略（TestId, Text, Label）
- [ ] テスト実行エンジン
  - [ ] TestRunner実装
  - [ ] 基本アクション（navigate, click, type）
  - [ ] スクリーンショット機能
- [ ] 結果表示
  - [ ] 成功/失敗表示
  - [ ] スクリーンショット表示

**成果物**:
- テンプレートからテストを作成できる
- 要素を選択してテストを実行できる
- 結果を画面で確認できる

---

### Phase 2: 使いやすさ向上 - 2週間

**目標**: 非エンジニアが迷わず使える

#### Week 3
- [ ] ガイドシステム
  - [ ] ステップバイステップUI
  - [ ] コンテキストヘルプ
  - [ ] ツールチップ
- [ ] 要素ピッカー改善
  - [ ] ビジュアルハイライト
  - [ ] リアルタイムプレビュー
  - [ ] 自動検出の信頼度表示
- [ ] エディター機能
  - [ ] ドラッグ&ドロップでステップ並び替え
  - [ ] ステップの追加・削除
  - [ ] テストデータ編集

#### Week 4
- [ ] 簡易NLPパーサー
  - [ ] パターンマッチング実装
  - [ ] 日本語パターン定義
  - [ ] 英語パターン定義
- [ ] 動画録画機能
  - [ ] puppeteer-screen-recorder統合
  - [ ] テスト実行の動画記録
- [ ] テンプレート追加
  - [ ] 商品購入フロー
  - [ ] 検索機能
  - [ ] フォーム送信

**成果物**:
- ガイドに従って迷わず操作できる
- 自然な日本語でテストを書ける
- 実行結果を動画で確認できる

---

### Phase 3: AI連携・高機能化 - 2週間

**目標**: Vibe Coder連携とスマート機能

#### Week 5
- [ ] Vibe Coder連携
  - [ ] プラグインアーキテクチャ
  - [ ] VibeCoderPlugin実装
  - [ ] プロンプトテンプレート
  - [ ] UI統合
- [ ] スマート機能
  - [ ] インテリジェント待機
  - [ ] 自動リトライ
  - [ ] セレクター最適化

#### Week 6
- [ ] 高度な機能
  - [ ] 複数テストの連続実行
  - [ ] テスト結果の比較
  - [ ] パフォーマンス計測
- [ ] データ管理
  - [ ] テスト履歴
  - [ ] タグ・カテゴリ
  - [ ] エクスポート/インポート

**成果物**:
- Vibe Coderと連携して問題を自動解決
- セレクターが変わっても動き続ける
- テストを効率的に管理できる

---

### Phase 4: 公開準備 - 1週間

**目標**: 安定版リリース

#### Week 7
- [ ] ドキュメント整備
  - [ ] README.md
  - [ ] USER_GUIDE.md
  - [ ] チュートリアル動画
- [ ] テスト・バグ修正
  - [ ] E2Eテスト
  - [ ] バグ修正
  - [ ] パフォーマンス最適化
- [ ] パッケージング
  - [ ] Windows版ビルド
  - [ ] Mac版ビルド
  - [ ] Linux版ビルド（オプション）
- [ ] 公開
  - [ ] GitHubリリース
  - [ ] ダウンロードページ
  - [ ] 紹介記事

**成果物**:
- 誰でもダウンロードして使える
- ドキュメントが充実している
- 安定して動作する

---

## 技術的な実装詳細

### 1. スマート要素検出

```typescript
// src/engine/detector/ElementDetector.ts

interface DetectionResult {
  element: ElementHandle;
  selector: string;
  confidence: number;
  method: string;
}

class ElementDetector {
  private strategies: DetectionStrategy[];

  constructor() {
    this.strategies = [
      new TestIdStrategy(),      // data-testid (最優先)
      new LabelStrategy(),       // label + input
      new AriaStrategy(),        // aria-label
      new TextStrategy(),        // テキスト内容
      new PlaceholderStrategy(), // placeholder
      new AttributeStrategy(),   // id, name, class
    ];
  }

  async detect(
    page: Page,
    description: string,
    rules?: DetectionRules
  ): Promise<DetectionResult[]> {
    const results: DetectionResult[] = [];

    // 各戦略を並列実行
    const promises = this.strategies.map(strategy =>
      strategy.detect(page, description, rules)
    );

    const strategyResults = await Promise.all(promises);

    // 結果を統合
    for (const result of strategyResults) {
      if (result) {
        results.push(...result);
      }
    }

    // 信頼度順にソート
    results.sort((a, b) => b.confidence - a.confidence);

    return results;
  }

  async pickBest(results: DetectionResult[]): Promise<DetectionResult | null> {
    if (results.length === 0) return null;

    // 信頼度0.8以上なら即採用
    if (results[0].confidence >= 0.8) {
      return results[0];
    }

    // それ以外はユーザーに選択させる
    return null;
  }
}
```

### 2. インテリジェント待機

```typescript
// src/engine/utils/smartWait.ts

class SmartWait {
  async waitForPageLoad(page: Page, timeout = 30000) {
    await Promise.race([
      // ネットワークアイドル
      page.waitForLoadState('networkidle'),

      // 最大タイムアウト
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeout)
      ),
    ]);
  }

  async waitForElement(
    page: Page,
    selector: string,
    options: {
      timeout?: number;
      visible?: boolean;
      stable?: boolean;
    } = {}
  ) {
    const {
      timeout = 10000,
      visible = true,
      stable = true
    } = options;

    const element = await page.waitForSelector(selector, {
      timeout,
      state: visible ? 'visible' : 'attached'
    });

    if (stable) {
      // 要素が動かなくなるまで待つ
      await this.waitForStability(page, selector);
    }

    return element;
  }

  private async waitForStability(page: Page, selector: string) {
    let lastPosition = await this.getElementPosition(page, selector);
    let stableCount = 0;

    while (stableCount < 3) {
      await page.waitForTimeout(100);
      const currentPosition = await this.getElementPosition(page, selector);

      if (
        lastPosition.x === currentPosition.x &&
        lastPosition.y === currentPosition.y
      ) {
        stableCount++;
      } else {
        stableCount = 0;
      }

      lastPosition = currentPosition;
    }
  }

  private async getElementPosition(page: Page, selector: string) {
    return page.$eval(selector, el => {
      const rect = el.getBoundingClientRect();
      return { x: rect.x, y: rect.y };
    });
  }
}
```

### 3. 自動リトライロジック

```typescript
// src/engine/utils/retry.ts

interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    onRetry
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts) {
        throw lastError;
      }

      const waitTime = backoff ? delay * attempt : delay;

      if (onRetry) {
        onRetry(attempt, lastError);
      }

      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError!;
}

// 使用例
const element = await withRetry(
  () => page.click('#button'),
  {
    maxAttempts: 3,
    delay: 1000,
    backoff: true,
    onRetry: (attempt, error) => {
      console.log(`リトライ ${attempt}/3: ${error.message}`);
    }
  }
);
```

---

## セキュリティとプライバシー

### データの扱い

```
すべてローカルに保存:
├── テストデータ → SQLite (ローカル)
├── 動画・スクショ → ファイルシステム (ローカル)
├── 設定 → JSON (ローカル)
└── 外部送信 → なし（AI連携は手動コピペ）
```

### ベストプラクティス

1. **本番データを使わない**
   - テスト用のダミーデータを推奨
   - パスワード等は自動でマスク

2. **動画・スクショの管理**
   - 定期的な自動削除機能
   - 保存先フォルダの選択可能

3. **AI連携時の注意**
   - プロンプトに機密情報が含まれないかチェック
   - 手動コピペなのでユーザーが制御可能

---

## まとめ

### このシステムの強み

1. **完全無料**
   - APIコストゼロ
   - サーバー不要
   - ライセンス料なし

2. **非エンジニア向け**
   - コード不要
   - テンプレートで簡単作成
   - ガイドが充実

3. **Playwrightを超える**
   - 自動要素検出
   - スマート待機
   - Vibe Coder連携

4. **プライバシー重視**
   - 完全ローカル動作
   - データ外部送信なし

### 次のステップ

このDESIGN.mdを基に、順次実装を進めていきます。
まずはPhase 1のMVPから開始しましょう！
