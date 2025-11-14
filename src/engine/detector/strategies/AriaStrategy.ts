import { Page } from 'puppeteer';
import { DetectionStrategy, DetectionRules, DetectionResult } from '../ElementDetector';

export class AriaStrategy implements DetectionStrategy {
  name = 'Aria';

  async detect(
    page: Page,
    _description: string,
    rules?: DetectionRules
  ): Promise<DetectionResult[]> {
    const results: DetectionResult[] = [];
    const ariaLabels = rules?.ariaLabels || [];

    for (const ariaLabel of ariaLabels) {
      try {
        // Try aria-label
        const ariaLabelSelector = `[aria-label*="${ariaLabel}" i]`;
        const ariaLabelElements = await page.$$(ariaLabelSelector);

        for (const element of ariaLabelElements) {
          results.push({
            element,
            selector: ariaLabelSelector,
            confidence: 0.85,
            method: 'aria-label',
          });
        }

        // Try aria-labelledby
        const elementsWithLabelledBy = await page.evaluate((label) => {
          const results: Array<{ selector: string }> = [];
          const elements = Array.from(document.querySelectorAll('[aria-labelledby]'));

          elements.forEach((el, index) => {
            const labelledBy = el.getAttribute('aria-labelledby');
            if (labelledBy) {
              const labelElement = document.getElementById(labelledBy);
              if (labelElement?.textContent?.toLowerCase().includes(label.toLowerCase())) {
                const id = el.id || `aria-element-${index}`;
                if (!el.id) {
                  el.id = id;
                }
                results.push({ selector: `#${id}` });
              }
            }
          });

          return results;
        }, ariaLabel);

        for (const { selector } of elementsWithLabelledBy) {
          try {
            const element = await page.$(selector);
            if (element) {
              results.push({
                element,
                selector,
                confidence: 0.8,
                method: 'aria-labelledby',
              });
            }
          } catch (e) {
            // Ignore
          }
        }
      } catch (error) {
        // Ignore errors
      }
    }

    return results;
  }
}
