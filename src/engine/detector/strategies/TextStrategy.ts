import { Page } from 'puppeteer';
import { DetectionStrategy, DetectionRules, DetectionResult } from '../ElementDetector';

export class TextStrategy implements DetectionStrategy {
  name = 'Text';

  async detect(
    page: Page,
    description: string,
    rules?: DetectionRules
  ): Promise<DetectionResult[]> {
    const results: DetectionResult[] = [];
    const textPatterns = rules?.text || [];

    for (const text of textPatterns) {
      try {
        // Find elements with matching text
        const elements = await page.evaluate((textContent) => {
          const results: Array<{ selector: string; tagName: string }> = [];

          // Check buttons
          const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"]'));
          buttons.forEach((btn, index) => {
            const btnText = btn.textContent || (btn as HTMLInputElement).value || '';
            if (btnText.trim().toLowerCase().includes(textContent.toLowerCase())) {
              const id = btn.id || `text-button-${index}`;
              if (!btn.id) {
                btn.id = id;
              }
              results.push({
                selector: `#${id}`,
                tagName: btn.tagName.toLowerCase(),
              });
            }
          });

          // Check links
          const links = Array.from(document.querySelectorAll('a'));
          links.forEach((link, index) => {
            if (link.textContent?.trim().toLowerCase().includes(textContent.toLowerCase())) {
              const id = link.id || `text-link-${index}`;
              if (!link.id) {
                link.id = id;
              }
              results.push({
                selector: `#${id}`,
                tagName: 'a',
              });
            }
          });

          return results;
        }, text);

        for (const { selector, tagName } of elements) {
          try {
            const element = await page.$(selector);
            if (element) {
              results.push({
                element,
                selector,
                confidence: tagName === 'button' ? 0.85 : 0.75,
                method: 'text',
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
