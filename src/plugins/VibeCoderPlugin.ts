import { AIPlugin, AIPromptContext, AIResponse } from './AIPlugin';

export class VibeCoderPlugin extends AIPlugin {
  constructor() {
    super('Vibe Coder', null); // No endpoint needed for clipboard approach
  }

  async sendPrompt(
    issue: string,
    context: AIPromptContext
  ): Promise<AIResponse> {
    const fullPrompt = this.buildPrompt(issue, context);

    try {
      // Copy to clipboard (will be handled by Electron main process)
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fullPrompt);
      }

      return {
        success: true,
        message: 'プロンプトをクリップボードにコピーしました！',
        action: {
          type: 'guide',
          steps: [
            'Vibe Coderを開く',
            'Ctrl+V (Mac: Cmd+V) でプロンプトを貼り付け',
            '生成された内容をコピー',
            'このアプリに戻って「適用」ボタンを押す',
          ],
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: `クリップボードへのコピーに失敗しました: ${error.message}`,
      };
    }
  }

  protected buildPrompt(issue: string, context: AIPromptContext): string {
    const sections = [];

    sections.push('# テスト自動化の問題修正\n');

    if (context.currentTest) {
      sections.push('## 現在のテスト');
      sections.push(`テスト名: ${context.currentTest.name}`);
      sections.push(`ステップ数: ${context.currentTest.steps.length}\n`);
    }

    if (context.currentStep) {
      sections.push('## 現在のステップ');
      sections.push(context.currentStep + '\n');
    }

    sections.push('## 発生している問題');
    sections.push(issue + '\n');

    if (context.selector) {
      sections.push('## 現在のセレクター');
      sections.push('```');
      sections.push(context.selector);
      sections.push('```\n');
    }

    if (context.htmlSnapshot) {
      sections.push('## ページのHTML（関連部分）');
      sections.push('```html');
      sections.push(context.htmlSnapshot);
      sections.push('```\n');
    }

    if (context.error) {
      sections.push('## エラーメッセージ');
      sections.push('```');
      sections.push(context.error);
      sections.push('```\n');
    }

    sections.push('## 依頼内容');
    sections.push(
      '上記の問題を解決するための新しいセレクターを提案してください。'
    );
    sections.push('以下の形式で回答してください：\n');
    sections.push('```json');
    sections.push('{');
    sections.push('  "selector": "推奨するセレクター",');
    sections.push('  "reason": "選択理由",');
    sections.push('  "alternatives": ["代替案1", "代替案2"]');
    sections.push('}');
    sections.push('```');

    return sections.join('\n');
  }

  async applyResponse(
    response: string,
    context: any
  ): Promise<AIResponse> {
    try {
      // Extract JSON from response (might be wrapped in markdown code blocks)
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : response;

      const data = JSON.parse(jsonStr);

      if (!data.selector) {
        return {
          success: false,
          message: '応答にセレクターが含まれていません',
        };
      }

      // Update the selector in the context
      if (context.updateSelector) {
        context.updateSelector(data.selector);
      }

      return {
        success: true,
        message: `セレクターを更新しました: ${data.selector}`,
        details: {
          selector: data.selector,
          reason: data.reason,
          alternatives: data.alternatives,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: `応答の解析に失敗しました: ${error.message}`,
      };
    }
  }
}
