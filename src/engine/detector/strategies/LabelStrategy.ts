import { Page } from 'puppeteer';
import { DetectionStrategy, DetectionRules, DetectionResult } from '../ElementDetector';

export class LabelStrategy implements DetectionStrategy {
  name = 'Label';

  async detect(
    page: Page,
    _description: string,
    rules?: DetectionRules
  ): Promise<DetectionResult[]> {
    const results: DetectionResult[] = [];
    const labels = rules?.labels || [];

    for (const labelText of labels) {
      try {
        // Find label elements containing the text
        // Note: has-text is not a standard CSS selector, using evaluate instead
        const elements = await page.evaluate((lText) => {
            const results: Array<{ selector: string; index: number }> = [];
            const labels = Array.from(document.querySelectorAll('label'));

            labels.forEach((label, index) => {
              if (label.textContent?.includes(lText)) {
                // Find associated input
                const forAttr = label.getAttribute('for');
                if (forAttr) {
                  results.push({
                    selector: `#${forAttr}`,
                    index,
                  });
                } else {
                  // Input might be inside the label
                  const input = label.querySelector('input, textarea, select');
                  if (input) {
                    const id = input.id || `label-input-${index}`;
                    if (!input.id) {
                      input.id = id;
                    }
                    results.push({
                      selector: `#${id}`,
                      index,
                    });
                  }
                }
              }
            });

            return results;
          }, labelText);

          for (const { selector } of elements) {
            try {
              const element = await page.$(selector);
              if (element) {
                results.push({
                  element,
                  selector,
                  confidence: 0.9,
                  method: 'label',
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
