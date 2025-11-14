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
7. [セキュリティ](#セキュリティ)

---

## システム概要

### 設計思想
- **完全無料**: 外部API不要、ランニングコストゼロ
- **ローカル完結**: すべての処理をユーザーのマシンで実行
- **AI連携可能**: Vibe Coding（Claude Code、Cursor、Windsurf等）スタイルのAI支援に対応
- **超直感的**: 知識ゼロでも10分で使える

### Vibe Codingとは？

**Vibe Coding** = AIコーディングツール（Claude Code、Cursor、Windsurf、GitHub Copilot等）を使って開発するスタイル

このツールは、Vibe Codingで開発している人が、テスト自動化でも同じようにAIの力を借りられるように設計されています。

### Playwrightとの差別化

| 項目 | Playwright | Mirrar |
|------|-----------|-------------|
| コード記述 | 必須 | 不要 |
| セットアップ | CLI操作が必要 | GUIで完結 |
| テスト作成 | 1から書く | テンプレート選択 |
| エラー対応 | 自分で修正 | ガイド付き修正 |
| 学習コスト | 数日〜数週間 | 10分 |
| コスト | 無料 | 無料 |
| AI連携 | なし | AIツール連携（Vibe Coding向け） |

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
├── データ保存: SQLite（ファイルベース）or Turso（クラウド・無料枠大）
├── 録画: puppeteer-screen-recorder
└── スクショ: 組み込み機能
```

**選定理由**:
- Puppeteerは完全無料、API不要
- SQLite/Tursoでサーバーレス
- すべてローカル完結可能

**データベース選択肢**:
1. **SQLite（ローカル）**: 完全オフライン、プライバシー最優先
2. **Turso（クラウド）**: 無料枠が大きい、複数デバイス同期可能

### AI連携（オプション）
```
プラグイン形式（クリップボード経由）
├── Claude Code、Cursor、Windsurf等のAIツール連携
├── ローカルLLM連携（Ollama等）
└── カスタムプロンプトAPI
```

**重要**: すべてクリップボード経由なので、APIキー不要・完全無料

---

## セキュリティ

### 🔒 セキュリティ原則

1. **本番データの使用禁止**
   - テストには必ずダミーデータを使用
   - 本番のパスワード、APIキー、個人情報は絶対に使わない

2. **ローカルストレージの保護**
   - テストデータは暗号化して保存
   - パスワード等の機密情報は自動でマスク表示

3. **プロンプトの機密情報チェック**
   - AIツールに送る前に、機密情報が含まれていないか自動チェック
   - 警告メッセージで確認を促す

4. **XSS/インジェクション対策**
   - すべてのユーザー入力をサニタイズ
   - セレクターの検証
   - eval()の使用禁止

5. **安全なファイル操作**
   - パストラバーサル攻撃の防止
   - ファイルパスの検証

### 実装すべきセキュリティ機能

#### 1. テストデータのマスキング

```typescript
// 機密情報を自動検出してマスク
function maskSensitiveData(value: string, type: 'password' | 'email' | 'text'): string {
  if (type === 'password') {
    return '***MASKED***';
  }

  // メールアドレスの一部をマスク
  if (type === 'email' && value.includes('@')) {
    const [local, domain] = value.split('@');
    return `${local.substring(0, 2)}***@${domain}`;
  }

  return value;
}
```

#### 2. プロンプト送信前の確認

```typescript
// プロンプトに機密情報が含まれていないかチェック
function checkPromptSecurity(prompt: string): { safe: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // パスワードっぽい文字列を検出
  if (prompt.match(/password\s*[:=]\s*\S+/i)) {
    warnings.push('パスワードが含まれている可能性があります');
  }

  // APIキーっぽい文字列を検出
  if (prompt.match(/[a-z0-9]{32,}/i)) {
    warnings.push('APIキーが含まれている可能性があります');
  }

  // メールアドレスを検出
  const emails = prompt.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi);
  if (emails && emails.length > 0) {
    warnings.push(`メールアドレスが含まれています: ${emails.join(', ')}`);
  }

  return {
    safe: warnings.length === 0,
    warnings
  };
}
```

#### 3. 入力のサニタイズ

```typescript
import DOMPurify from 'isomorphic-dompurify';

// ユーザー入力をサニタイズ
function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // HTMLタグを全て削除
    ALLOWED_ATTR: []
  });
}

// セレクターの検証
function validateSelector(selector: string): boolean {
  try {
    // セレクターが有効かチェック
    document.querySelector(selector);

    // 危険な文字列を検出
    const dangerous = ['javascript:', 'data:', 'vbscript:', '<script'];
    return !dangerous.some(d => selector.toLowerCase().includes(d));
  } catch {
    return false;
  }
}
```

#### 4. ファイルパスの検証

```typescript
import path from 'path';

function validateFilePath(filePath: string, baseDir: string): boolean {
  // パスを正規化
  const normalized = path.normalize(filePath);
  const absolute = path.resolve(baseDir, normalized);

  // ベースディレクトリ外へのアクセスを防ぐ
  return absolute.startsWith(path.resolve(baseDir));
}
```

### セキュリティチェックリスト

**開発時**:
- [ ] すべてのユーザー入力をサニタイズ
- [ ] eval()、Function()等の動的コード実行を使用しない
- [ ] ファイルパスを検証
- [ ] セレクターを検証
- [ ] SQLインジェクション対策（パラメータ化クエリ使用）

**ユーザー向け警告**:
- [ ] 初回起動時に「本番データを使わないでください」と警告
- [ ] パスワード入力欄には「テスト用のダミーパスワードを使用してください」と表示
- [ ] AIツールにプロンプトを送る前に機密情報チェック

**ストレージ**:
- [ ] パスワード等はハッシュ化または暗号化して保存
- [ ] スクリーンショット/動画は定期的に自動削除（設定可能）
- [ ] ローカルファイルのアクセス権限を適切に設定

---

## データベース戦略

### オプション1: SQLite（ローカル）

**メリット**:
- 完全オフライン
- セットアップ不要
- プライバシー最優先

**デメリット**:
- 複数デバイス同期不可
- バックアップは手動

**実装**:
```typescript
import Database from 'better-sqlite3';

const db = new Database('autopailot.db');

// テーブル作成
db.exec(`
  CREATE TABLE IF NOT EXISTS tests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    steps TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS test_results (
    id TEXT PRIMARY KEY,
    test_id TEXT NOT NULL,
    status TEXT NOT NULL,
    started_at INTEGER NOT NULL,
    ended_at INTEGER,
    FOREIGN KEY (test_id) REFERENCES tests(id)
  );
`);
```

### オプション2: Turso（クラウド・無料枠大）

**メリット**:
- 無料枠が大きい（500DBまで、月100万行書き込み）
- 複数デバイス同期可能
- 自動バックアップ

**デメリット**:
- アカウント作成が必要
- オンライン必須

**実装**:
```typescript
import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db', // フォールバック
  authToken: process.env.TURSO_AUTH_TOKEN
});

// 同じSQLが使える（LibSQL = SQLite互換）
```

### 推奨アプローチ: ハイブリッド

```typescript
// 設定でローカル/クラウドを切り替え可能
class DatabaseManager {
  private db: Database | LibSQLDatabase;

  constructor(config: { mode: 'local' | 'cloud'; tursoUrl?: string; tursoToken?: string }) {
    if (config.mode === 'local') {
      this.db = new Database('autopailot.db');
    } else {
      this.db = createClient({
        url: config.tursoUrl!,
        authToken: config.tursoToken
      });
    }
  }

  // 統一されたインターフェース
  async saveTest(test: Test): Promise<void> {
    // ...
  }
}
```

---

(以下、元の内容を継続...)
