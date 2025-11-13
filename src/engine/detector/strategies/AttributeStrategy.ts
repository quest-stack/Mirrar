import { Page } from 'puppeteer';
import { DetectionStrategy, DetectionRules, DetectionResult } from '../ElementDetector';

export class AttributeStrategy implements DetectionStrategy {
  name = 'Attribute';

  async detect(
    page: Page,
    description: string,
    rules?: DetectionRules
  ): Promise<DetectionResult[]> {
    const results: DetectionResult[] = [];

    // Try explicit selectors from rules
    if (rules?.selectors) {
      for (const selector of rules.selectors) {
        try {
          const elements = await page.$$(selector);

          for (const element of elements) {
            // Determine confidence based on selector type
            let confidence = 0.7;

            if (selector.includes('[type=')) {
              confidence = 0.8;
            }
            if (selector.includes('[name')) {
              confidence = 0.75;
            }
            if (selector.includes('#')) {
              confidence = 0.9; // ID is pretty reliable
            }
            if (selector.includes('[autocomplete')) {
              confidence = 0.85;
            }

            results.push({
              element,
              selector,
              confidence,
              method: 'attribute',
            });
          }
        } catch (error) {
          // Ignore invalid selectors
        }
      }
    }

    // Extract keywords and try common attributes
    const keywords = this.extractKeywords(description);

    for (const keyword of keywords) {
      try {
        // Try ID
        const idSelector = `#${keyword}`;
        const idElements = await page.$$(idSelector);
        for (const element of idElements) {
          results.push({
            element,
            selector: idSelector,
            confidence: 0.9,
            method: 'id',
          });
        }

        // Try name attribute
        const nameSelector = `[name*="${keyword}" i]`;
        const nameElements = await page.$$(nameSelector);
        for (const element of nameElements) {
          results.push({
            element,
            selector: nameSelector,
            confidence: 0.75,
            method: 'name',
          });
        }

        // Try class
        const classSelector = `.${keyword}`;
        const classElements = await page.$$(classSelector);
        for (const element of classElements) {
          results.push({
            element,
            selector: classSelector,
            confidence: 0.6,
            method: 'class',
          });
        }

        // Try placeholder
        const placeholderSelector = `[placeholder*="${keyword}" i]`;
        const placeholderElements = await page.$$(placeholderSelector);
        for (const element of placeholderElements) {
          results.push({
            element,
            selector: placeholderSelector,
            confidence: 0.7,
            method: 'placeholder',
          });
        }
      } catch (error) {
        // Ignore errors
      }
    }

    return results;
  }

  private extractKeywords(description: string): string[] {
    // Remove common words and split
    const commonWords = ['を', 'に', 'の', 'が', 'は', 'て', 'で', 'と', 'から', 'する', 'ボタン', 'クリック', '入力'];
    const words = description.toLowerCase().split(/\s+/);

    return words
      .filter((word) => {
        return (
          word.length > 1 &&
          !commonWords.includes(word) &&
          !/^[0-9]+$/.test(word)
        );
      })
      .map((word) => word.replace(/[^a-z0-9]/gi, ''));
  }
}
