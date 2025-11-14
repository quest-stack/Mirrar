# 💾 データベース戦略

## 概要

Mirarrは、2つのデータベースオプションをサポートしています：

1. **SQLite（ローカル）** - デフォルト、完全オフライン
2. **Turso（クラウド）** - オプション、無料枠が大きい

---

## オプション1: SQLite（ローカル）

### 特徴

**メリット**:
- ✅ 完全オフライン動作
- ✅ セットアップ不要
- ✅ プライバシー最優先
- ✅ 高速（ローカルファイル）
- ✅ 追加コスト0円

**デメリット**:
- ❌ 複数デバイス同期不可
- ❌ バックアップは手動
- ❌ 複数人での共有が困難

### 使い方

**インストール**: すでに含まれています（`better-sqlite3`）

**設定**:
```typescript
// デフォルトで有効
// 特に設定不要
```

**データ保存場所**:
```
Windows: C:\Users\[ユーザー名]\AppData\Roaming\auto-pailot-tester\autopailot.db
Mac: ~/Library/Application Support/auto-pailot-tester/autopailot.db
Linux: ~/.config/auto-pailot-tester/autopailot.db
```

### バックアップ

**手動バックアップ**:
```bash
# データベースファイルをコピー
cp ~/.config/auto-pailot-tester/autopailot.db ~/backups/
```

**アプリ内からバックアップ**:
```
設定 → データベース → バックアップを作成
```

---

## オプション2: Turso（クラウド）

### 特徴

**メリット**:
- ✅ 無料枠が非常に大きい
  - 最大500データベース
  - 月間100万行の書き込み
  - 月間10億行の読み取り
  - 8GBストレージ
- ✅ 複数デバイス同期可能
- ✅ 自動バックアップ
- ✅ SQLite互換（LibSQL）
- ✅ エッジ展開で高速

**デメリット**:
- ❌ アカウント作成が必要
- ❌ オンライン接続必須
- ❌ 外部サービス依存

### Tursoとは？

[Turso](https://turso.tech/)は、SQLite互換のLibSQLをベースにしたクラウドデータベースサービスです。

**無料プランの詳細**:
- 個人利用に最適
- クレジットカード登録不要
- 無料枠を超えても自動課金なし

### セットアップ手順

#### 1. Tursoアカウント作成

```bash
# Turso CLIをインストール
curl -sSfL https://get.tur.so/install.sh | bash

# ログイン
turso auth login

# データベース作成
turso db create autopailot-tester
```

#### 2. 認証情報の取得

```bash
# データベースURLを取得
turso db show autopailot-tester --url

# 認証トークンを作成
turso db tokens create autopailot-tester
```

出力例:
```
Database URL: libsql://autopailot-tester-your-username.turso.io
Token: eyJh...（長いトークン）
```

#### 3. Mirarrで設定

**方法1: 設定画面から**
```
設定 → データベース → Tursoを使用
 ├─ Database URL: [コピーしたURL]
 └─ Auth Token: [コピーしたトークン]
```

**方法2: 環境変数**
```.env
TURSO_DATABASE_URL=libsql://autopailot-tester-your-username.turso.io
TURSO_AUTH_TOKEN=eyJh...
```

#### 4. 動作確認

```
設定 → データベース → 接続テスト
```

成功すれば、Tursoが使用可能になります！

---

## ハイブリッドアプローチ（推奨）

### オフライン時はローカル、オンライン時はクラウド

```typescript
// 自動切り替え
if (navigator.onLine && TURSO_ENABLED) {
  // Tursoを使用
  connectToTurso();
} else {
  // SQLiteを使用
  connectToSQLite();
}
```

### 設定

```
設定 → データベース → ハイブリッドモード
 ├─ ✓ オンライン時はTursoを使用
 ├─ ✓ オフライン時はローカルSQLiteを使用
 └─ ✓ オンライン復帰時に自動同期
```

---

## データ構造

### テーブル定義

```sql
-- テスト定義
CREATE TABLE tests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  template_id TEXT,
  steps TEXT NOT NULL,  -- JSON形式
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  status TEXT DEFAULT 'draft'
);

-- テスト実行結果
CREATE TABLE test_results (
  id TEXT PRIMARY KEY,
  test_id TEXT NOT NULL,
  status TEXT NOT NULL,  -- 'success', 'failed', 'running'
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  steps_result TEXT,  -- JSON形式
  video_path TEXT,
  error TEXT,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- ステップ実行結果
CREATE TABLE step_results (
  id TEXT PRIMARY KEY,
  result_id TEXT NOT NULL,
  step_id TEXT NOT NULL,
  status TEXT NOT NULL,  -- 'success', 'failed', 'skipped'
  duration INTEGER NOT NULL,
  error TEXT,
  screenshot TEXT,  -- Base64 or ファイルパス
  FOREIGN KEY (result_id) REFERENCES test_results(id) ON DELETE CASCADE
);

-- 設定
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
```

---

## マイグレーション

### SQLiteからTursoへの移行

```bash
# アプリ内機能を使用
設定 → データベース → Tursoに移行
```

または、手動で：

```bash
# SQLiteデータをエクスポート
sqlite3 autopailot.db .dump > backup.sql

# Tursoにインポート
turso db shell autopailot-tester < backup.sql
```

### TursoからSQLiteへの移行

```bash
# Tursoデータをエクスポート
turso db shell autopailot-tester .dump > backup.sql

# ローカルSQLiteにインポート
sqlite3 autopailot.db < backup.sql
```

---

## パフォーマンス比較

| 項目 | SQLite | Turso |
|------|--------|-------|
| 読み取り速度 | 非常に高速 | 高速（エッジ） |
| 書き込み速度 | 非常に高速 | 高速 |
| 初回接続 | 即座 | 1-2秒 |
| オフライン | ✅ | ❌ |
| 同期 | ❌ | ✅ |
| バックアップ | 手動 | 自動 |

**推奨**:
- 個人利用・オフライン重視 → SQLite
- 複数デバイス・チーム利用 → Turso
- 両方のメリット → ハイブリッドモード

---

## セキュリティ

### SQLite

- ✅ 完全ローカル、外部送信なし
- ✅ ファイルシステムの権限で保護
- ⚠️ ディスク暗号化を推奨（OS機能）

### Turso

- ✅ TLS暗号化通信
- ✅ 認証トークンによるアクセス制御
- ✅ データセンターレベルのセキュリティ
- ⚠️ トークンの安全な管理が重要

**トークン管理**:
```
❌ コードに直接書かない
❌ GitHubにコミットしない
✅ 環境変数に保存
✅ .envファイルを.gitignoreに追加
```

---

## トラブルシューティング

### Turso接続エラー

**エラー**: "Failed to connect to Turso"

**原因**:
1. インターネット接続がない
2. 認証トークンが間違っている
3. データベースURLが間違っている

**対処法**:
```bash
# 接続テスト
turso db show autopailot-tester

# トークンを再作成
turso db tokens create autopailot-tester
```

### SQLiteファイルが壊れた

**エラー**: "database disk image is malformed"

**対処法**:
```bash
# バックアップから復元
cp ~/backups/autopailot.db ~/.config/auto-pailot-tester/

# または、整合性チェック
sqlite3 autopailot.db "PRAGMA integrity_check;"
```

---

## FAQ

### Q: Tursoは本当に無料ですか？

A: はい、個人利用の範囲であれば完全無料です。無料枠（月間100万行書き込み）を超えることはほぼありません。

### Q: Tursoのデータは安全ですか？

A: はい、TLS暗号化され、データセンターで保護されています。ただし、機密情報は保存しないでください（テスト自動化なので）。

### Q: SQLiteとTursoを両方使えますか？

A: はい、ハイブリッドモードで両方使えます。オンライン時はTurso、オフライン時はSQLiteに自動切り替えできます。

### Q: 既存のSQLiteデータをTursoに移行できますか？

A: はい、アプリ内の移行機能、またはコマンドラインで簡単に移行できます。

### Q: Tursoを使うとパフォーマンスは落ちますか？

A: ネットワーク遅延はありますが、エッジデプロイにより最小限です。実用上の問題はありません。

---

## 参考リンク

- [Turso公式サイト](https://turso.tech/)
- [Tursoドキュメント](https://docs.turso.tech/)
- [SQLite公式サイト](https://www.sqlite.org/)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)

---

**データベース選択に迷ったら、まずはデフォルトのSQLiteを使って、必要に応じてTursoに移行しましょう！**
