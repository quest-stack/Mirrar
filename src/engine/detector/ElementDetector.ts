import { Page, ElementHandle } from 'puppeteer';

export interface DetectionRules {
  selectors?: string[];
  labels?: string[];
  ariaLabels?: string[];
  text?: string[];
  urlPatterns?: string[];
  confidence?: number;
}

export interface DetectionResult {
  element: ElementHandle;
  selector: string;
  confidence: number;
  method: string;
}

export interface DetectionStrategy {
  name: string;
  detect(
    page: Page,
    description: string,
    rules?: DetectionRules
  ): Promise<DetectionResult[]>;
}

export class ElementDetector {
  private strategies: DetectionStrategy[];

  constructor(strategies: DetectionStrategy[]) {
    this.strategies = strategies;
  }

  async detect(
    page: Page,
    description: string,
    rules?: DetectionRules
  ): Promise<DetectionResult[]> {
    const allResults: DetectionResult[] = [];

    // Run all strategies in parallel
    const promises = this.strategies.map((strategy) =>
      strategy
        .detect(page, description, rules)
        .catch((error) => {
          console.error(`Strategy ${strategy.name} failed:`, error);
          return [];
        })
    );

    const strategyResults = await Promise.all(promises);

    // Flatten results
    for (const results of strategyResults) {
      allResults.push(...results);
    }

    // Sort by confidence (descending)
    allResults.sort((a, b) => b.confidence - a.confidence);

    // Remove duplicates (same element)
    const uniqueResults: DetectionResult[] = [];
    const seenSelectors = new Set<string>();

    for (const result of allResults) {
      if (!seenSelectors.has(result.selector)) {
        uniqueResults.push(result);
        seenSelectors.add(result.selector);
      }
    }

    return uniqueResults;
  }

  async pickBest(results: DetectionResult[]): Promise<DetectionResult | null> {
    if (results.length === 0) return null;

    // If confidence is high enough, pick the first one
    if (results[0].confidence >= 0.8) {
      return results[0];
    }

    // Otherwise, return null to let user choose
    return null;
  }

  async highlightElements(page: Page, selectors: string[]): Promise<void> {
    await page.evaluate((sels) => {
      // Remove previous highlights
      const previousHighlights = document.querySelectorAll('.autopailot-highlight');
      previousHighlights.forEach((el) => el.classList.remove('autopailot-highlight'));

      // Add highlights to new elements
      sels.forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            (el as HTMLElement).style.outline = '3px solid #0ea5e9';
            (el as HTMLElement).style.outlineOffset = '2px';
            el.classList.add('autopailot-highlight');
          });
        } catch (e) {
          // Ignore invalid selectors
        }
      });
    }, selectors);
  }
}
