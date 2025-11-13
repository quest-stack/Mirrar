import { TestStep } from '../engine/actions/BaseAction';

interface ParsePattern {
  regex: RegExp;
  action: string;
  extract: (match: RegExpMatchArray) => Partial<TestStep>;
}

export class NLPParser {
  private patterns: ParsePattern[];

  constructor() {
    this.patterns = [
      // Navigate patterns
      {
        regex: /(.+?)(?:を|に)開(?:く|いて|き)/,
        action: 'navigate',
        extract: (match) => ({ url: this.extractUrl(match[1]) }),
      },
      {
        regex: /(.+?)(?:へ|に)(?:移動|遷移)(?:する|して)?/,
        action: 'navigate',
        extract: (match) => ({ url: this.extractUrl(match[1]) }),
      },

      // Click patterns
      {
        regex: /(.+?)を(?:クリック|押|タップ)(?:する|して)?/,
        action: 'click',
        extract: (match) => ({ description: match[1].trim() }),
      },
      {
        regex: /(.+?)(?:ボタン|リンク)を(?:クリック|押|タップ)/,
        action: 'click',
        extract: (match) => ({ description: match[1].trim() + 'ボタン' }),
      },

      // Type/Input patterns
      {
        regex: /(.+?)に(.+?)(?:と|を)入力(?:する|して)?/,
        action: 'input',
        extract: (match) => ({
          description: match[1].trim(),
          value: match[2].trim(),
        }),
      },
      {
        regex: /(.+?)(?:欄|フィールド|ボックス)に(.+?)を(?:入れる|入力)/,
        action: 'input',
        extract: (match) => ({
          description: match[1].trim(),
          value: match[2].trim(),
        }),
      },

      // Wait patterns
      {
        regex: /(\d+)秒待(?:つ|って|機)/,
        action: 'wait',
        extract: (match) => ({
          timeout: parseInt(match[1]) * 1000,
          description: `${match[1]}秒待機`,
        }),
      },

      // WaitFor patterns
      {
        regex: /(.+?)が(?:表示|見える|現れる)(?:まで待つ|のを待つ)?/,
        action: 'waitFor',
        extract: (match) => ({
          description: match[1].trim() + 'が表示されるのを待つ',
        }),
      },
      {
        regex: /(.+?)(?:の表示)?を(?:確認|チェック)(?:する|して)?/,
        action: 'waitFor',
        extract: (match) => ({
          description: match[1].trim() + 'を確認',
        }),
      },

      // Assert patterns
      {
        regex: /(.+?)に(.+?)が(?:含まれる|ある)(?:こと)?を(?:確認|検証)/,
        action: 'assert',
        extract: (match) => ({
          description: match[1].trim(),
          value: match[2].trim(),
        }),
      },
    ];
  }

  parse(text: string): TestStep[] {
    const steps: TestStep[] = [];

    // Split by common delimiters
    const lines = text.split(/[、。\n，,]/).filter((l) => l.trim());

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Try each pattern
      for (const pattern of this.patterns) {
        const match = trimmed.match(pattern.regex);
        if (match) {
          const extracted = pattern.extract(match);

          const step: TestStep = {
            id: Math.random().toString(36).substr(2, 9),
            type: pattern.action,
            description: extracted.description || trimmed,
            ...extracted,
          };

          steps.push(step);
          break;
        }
      }
    }

    return steps;
  }

  private extractUrl(text: string): string {
    // If it's already a URL, return as is
    if (text.match(/^https?:\/\//)) {
      return text;
    }

    // If it looks like a domain, add https://
    if (text.match(/^[a-z0-9.-]+\.[a-z]{2,}$/i)) {
      return `https://${text}`;
    }

    // Otherwise, return as is and let the user fix it
    return text.trim();
  }

  // Helper method to convert natural language to test
  convertToTest(naturalLanguage: string): {
    name: string;
    description: string;
    steps: TestStep[];
  } {
    const steps = this.parse(naturalLanguage);

    // Generate test name from first step or use default
    let name = 'カスタムテスト';
    if (steps.length > 0) {
      const firstStep = steps[0];
      if (firstStep.type === 'navigate') {
        name = `${firstStep.url} のテスト`;
      } else {
        name = `${firstStep.description}のテスト`;
      }
    }

    return {
      name,
      description: '自然言語から生成されたテスト',
      steps,
    };
  }

  // Validate parsed steps
  validate(steps: TestStep[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (steps.length === 0) {
      errors.push('ステップが見つかりませんでした');
    }

    // Check if first step is navigate
    if (steps.length > 0 && steps[0].type !== 'navigate') {
      errors.push(
        '最初のステップはページを開く操作（navigate）である必要があります'
      );
    }

    // Validate each step
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      if (step.type === 'navigate' && !step.url) {
        errors.push(`ステップ ${i + 1}: URLが指定されていません`);
      }

      if (step.type === 'input' && !step.value) {
        errors.push(`ステップ ${i + 1}: 入力値が指定されていません`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
