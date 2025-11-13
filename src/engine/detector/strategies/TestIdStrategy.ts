import { Page } from 'puppeteer';
import { DetectionStrategy, DetectionRules, DetectionResult } from '../ElementDetector';

export class TestIdStrategy implements DetectionStrategy {
  name = 'TestId';

  async detect(
    page: Page,
    description: string,
    rules?: DetectionRules
  ): Promise<DetectionResult[]> {
    const results: DetectionResult[] = [];

    // Extract keywords from description
    const keywords = this.extractKeywords(description);

    // Try data-testid attributes
    for (const keyword of keywords) {
      try {
        const selector = `[data-testid*="${keyword}" i]`;
        const elements = await page.$$(selector);

        for (const element of elements) {
          results.push({
            element,
            selector,
            confidence: 1.0, // Highest confidence for testid
            method: 'data-testid',
          });
        }
      } catch (error) {
        // Ignore errors
      }
    }

    // Try explicit selectors from rules
    if (rules?.selectors) {
      for (const selector of rules.selectors) {
        if (selector.includes('data-testid')) {
          try {
            const elements = await page.$$(selector);

            for (const element of elements) {
              results.push({
                element,
                selector,
                confidence: 1.0,
                method: 'data-testid-explicit',
              });
            }
          } catch (error) {
            // Ignore errors
          }
        }
      }
    }

    return results;
  }

  private extractKeywords(description: string): string[] {
    // Remove common words and split
    const commonWords = ['を', 'に', 'の', 'が', 'は', 'て', 'で', 'と', 'から'];
    const words = description.toLowerCase().split(/\s+/);

    return words.filter((word) => {
      return (
        word.length > 1 &&
        !commonWords.includes(word) &&
        !/^[0-9]+$/.test(word)
      );
    });
  }
}
