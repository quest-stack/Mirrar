import { AIPromptContext } from './AIPlugin';

export const VIBE_CODER_PROMPTS = {
  selectorFix: {
    title: 'セレクターを修正',
    buildPrompt: (context: AIPromptContext) => `
# セレクター修正の依頼

## 問題
テスト自動化で以下のセレクターが動作しません：
\`${context.selector}\`

## エラー
${context.error}

## ページHTML
\`\`\`html
${context.htmlSnapshot}
\`\`\`

## 依頼
「${context.issue}」を指す正しいセレクターを教えてください。

以下の形式で回答してください：
\`\`\`json
{
  "selector": "推奨するセレクター",
  "reason": "選択理由",
  "alternatives": ["代替案1", "代替案2"]
}
\`\`\`
    `.trim(),
  },

  testCreation: {
    title: 'テストを自動生成',
    buildPrompt: (context: any) => `
# テスト自動生成の依頼

## テスト対象
URL: ${context.url}
目的: ${context.purpose}

## 依頼
上記のページに対するテストケースを作成してください。

以下の形式で回答してください：
\`\`\`json
{
  "name": "テスト名",
  "description": "テストの説明",
  "steps": [
    {
      "type": "navigate",
      "url": "https://...",
      "description": "ページを開く"
    },
    {
      "type": "click",
      "selector": "#button",
      "description": "ボタンをクリック"
    },
    {
      "type": "input",
      "selector": "#email",
      "value": "test@example.com",
      "description": "メールアドレスを入力"
    }
  ]
}
\`\`\`
    `.trim(),
  },

  assertionSuggestion: {
    title: '検証項目を提案',
    buildPrompt: (context: any) => `
# 検証項目提案の依頼

## テスト名
${context.testName}

## 現在のステップ
${context.steps.map((s: any, i: number) => `${i + 1}. ${s.description}`).join('\n')}

## 依頼
このテストで追加すべき検証項目を5つ提案してください。

以下の形式で回答してください：
\`\`\`json
{
  "assertions": [
    {
      "description": "検証内容の説明",
      "selector": "検証対象のセレクター",
      "expectedValue": "期待値"
    }
  ]
}
\`\`\`
    `.trim(),
  },

  debugHelp: {
    title: 'デバッグ支援',
    buildPrompt: (context: AIPromptContext) => `
# テストデバッグの依頼

## 問題
${context.issue}

## 失敗したステップ
${context.currentStep}

## エラーメッセージ
${context.error}

## 現在のセレクター
\`${context.selector}\`

## ページの状態
\`\`\`html
${context.htmlSnapshot}
\`\`\`

## 依頼
この問題の原因と解決方法を教えてください。

以下の形式で回答してください：
\`\`\`json
{
  "cause": "問題の原因",
  "solution": "解決方法",
  "newSelector": "新しいセレクター（必要な場合）",
  "additionalSteps": ["追加で必要な手順"]
}
\`\`\`
    `.trim(),
  },

  optimizationSuggestion: {
    title: 'テスト最適化提案',
    buildPrompt: (context: any) => `
# テスト最適化の依頼

## 現在のテスト
\`\`\`json
${JSON.stringify(context.test, null, 2)}
\`\`\`

## 実行時間
${context.executionTime}秒

## 依頼
このテストを最適化する方法を提案してください：
1. 実行時間の短縮
2. 安定性の向上
3. メンテナンス性の向上

以下の形式で回答してください：
\`\`\`json
{
  "optimizations": [
    {
      "category": "実行時間 / 安定性 / メンテナンス性",
      "suggestion": "提案内容",
      "implementation": "実装方法"
    }
  ]
}
\`\`\`
    `.trim(),
  },
};
