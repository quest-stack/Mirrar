/**
 * セキュリティユーティリティ
 *
 * テストデータの保護、機密情報の検出、入力のサニタイズ等を提供
 */

/**
 * 機密情報を自動検出してマスク
 */
export function maskSensitiveData(
  value: string,
  type: 'password' | 'email' | 'text' | 'apikey' | 'token'
): string {
  if (!value) return value;

  switch (type) {
    case 'password':
      // パスワードは完全にマスク
      return '***MASKED***';

    case 'email':
      // メールアドレスの一部をマスク
      if (value.includes('@')) {
        const [local, domain] = value.split('@');
        const maskedLocal = local.length > 2
          ? `${local.substring(0, 2)}***`
          : '***';
        return `${maskedLocal}@${domain}`;
      }
      return value;

    case 'apikey':
    case 'token':
      // APIキーやトークンは最初と最後の4文字だけ表示
      if (value.length > 8) {
        return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
      }
      return '***MASKED***';

    case 'text':
    default:
      return value;
  }
}

/**
 * プロンプトに機密情報が含まれていないかチェック
 */
export interface SecurityCheckResult {
  safe: boolean;
  warnings: string[];
  suggestions?: string[];
}

export function checkPromptSecurity(prompt: string): SecurityCheckResult {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // 1. パスワードっぽい文字列を検出
  if (prompt.match(/password\s*[:=]\s*\S+/i)) {
    warnings.push('⚠️ パスワードが含まれている可能性があります');
    suggestions.push('テスト用のダミーパスワードを使用してください');
  }

  // 2. APIキーっぽい文字列を検出（32文字以上の英数字）
  const apiKeyPattern = /\b[a-z0-9]{32,}\b/gi;
  if (prompt.match(apiKeyPattern)) {
    warnings.push('⚠️ APIキーまたはトークンが含まれている可能性があります');
    suggestions.push('機密情報は削除してください');
  }

  // 3. メールアドレスを検出
  const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  const emails = prompt.match(emailPattern);
  if (emails && emails.length > 0) {
    warnings.push(`ℹ️ メールアドレスが含まれています: ${emails.join(', ')}`);
    suggestions.push('実在しないテスト用メールアドレスを使用してください');
  }

  // 4. クレジットカード番号っぽいパターンを検出
  const ccPattern = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
  if (prompt.match(ccPattern)) {
    warnings.push('⚠️ クレジットカード番号が含まれている可能性があります');
    suggestions.push('絶対に本物のクレジットカード情報は使用しないでください');
  }

  // 5. 電話番号っぽいパターンを検出
  const phonePattern = /\b\d{2,4}[-\s]?\d{2,4}[-\s]?\d{4}\b/g;
  if (prompt.match(phonePattern)) {
    warnings.push('ℹ️ 電話番号が含まれている可能性があります');
  }

  // 6. JWTトークンを検出
  const jwtPattern = /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g;
  if (prompt.match(jwtPattern)) {
    warnings.push('⚠️ JWTトークンが含まれています');
    suggestions.push('トークンは削除してください');
  }

  return {
    safe: warnings.length === 0,
    warnings,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * セレクターの検証
 */
export function validateSelector(selector: string): { valid: boolean; error?: string } {
  if (!selector || selector.trim() === '') {
    return { valid: false, error: 'セレクターが空です' };
  }

  // 危険な文字列を検出
  const dangerousPatterns = [
    'javascript:',
    'data:',
    'vbscript:',
    '<script',
    'onerror=',
    'onclick=',
  ];

  const lower = selector.toLowerCase();
  for (const pattern of dangerousPatterns) {
    if (lower.includes(pattern)) {
      return {
        valid: false,
        error: `危険なパターンが検出されました: ${pattern}`,
      };
    }
  }

  // セレクターが有効な CSS セレクターかチェック
  try {
    // DOMがない環境でも動作するように、単純な検証
    if (selector.includes('..') || selector.includes('//')) {
      return { valid: false, error: 'セレクターに不正なパターンが含まれています' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'セレクターの形式が不正です' };
  }
}

/**
 * ファイルパスの検証（パストラバーサル攻撃を防ぐ）
 */
export function validateFilePath(filePath: string, baseDir: string): boolean {
  // 相対パスのチェック
  if (filePath.includes('..')) {
    return false;
  }

  // 絶対パスのチェック（Windowsも考慮）
  if (filePath.match(/^[a-zA-Z]:\\/) || filePath.startsWith('/')) {
    return false;
  }

  // null バイト攻撃を防ぐ
  if (filePath.includes('\0')) {
    return false;
  }

  return true;
}

/**
 * テストデータの安全性をチェック
 */
export interface TestDataCheckResult {
  safe: boolean;
  warnings: string[];
  recommendations: string[];
}

export function checkTestDataSafety(testData: {
  url?: string;
  email?: string;
  password?: string;
  [key: string]: any;
}): TestDataCheckResult {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // 1. URLチェック
  if (testData.url) {
    if (testData.url.includes('localhost') || testData.url.includes('127.0.0.1')) {
      // ローカル環境は問題なし
    } else if (testData.url.match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b/)) {
      // 有効なURL
    } else {
      warnings.push('URLの形式が不正です');
    }
  }

  // 2. メールアドレスチェック
  if (testData.email) {
    const commonTestDomains = ['example.com', 'test.com', 'localhost'];
    const domain = testData.email.split('@')[1];

    if (!commonTestDomains.some(d => domain?.includes(d))) {
      warnings.push('実在するドメインのメールアドレスが使用されています');
      recommendations.push('test@example.com のようなテスト用メールアドレスを使用してください');
    }
  }

  // 3. パスワードチェック
  if (testData.password) {
    // 一般的な弱いパスワードを検出
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];

    if (testData.password.length < 6) {
      recommendations.push('パスワードは6文字以上が推奨されます（テスト用でも）');
    }

    if (commonPasswords.includes(testData.password.toLowerCase())) {
      // テスト用なので問題なし
    }

    // 実際のパスワードっぽい強力なパスワード（大文字小文字数字記号）を検出
    if (
      testData.password.match(/[A-Z]/) &&
      testData.password.match(/[a-z]/) &&
      testData.password.match(/[0-9]/) &&
      testData.password.match(/[^A-Za-z0-9]/) &&
      testData.password.length >= 12
    ) {
      warnings.push('本番環境のパスワードを使用している可能性があります');
      recommendations.push('テスト用のシンプルなパスワード（例: testpassword123）を使用してください');
    }
  }

  return {
    safe: warnings.length === 0,
    warnings,
    recommendations,
  };
}

/**
 * HTMLコンテンツのサニタイズ（表示用）
 */
export function sanitizeHTML(html: string): string {
  // 基本的なHTMLエスケープ
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * SQL文字列のエスケープ（SQLiteパラメータ化クエリと併用）
 */
export function escapeSQLString(str: string): string {
  // シングルクォートをエスケープ
  return str.replace(/'/g, "''");
}
