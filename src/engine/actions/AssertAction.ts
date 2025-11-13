import { Page } from 'puppeteer';
import { BaseAction, TestStep } from './BaseAction';

export class AssertAction extends BaseAction {
  type = 'assert';

  protected async perform(page: Page, step: TestStep): Promise<void> {
    if (!step.selector) {
      throw new Error('Selector is required for assert action');
    }

    // Wait for element to appear
    const element = await page.waitForSelector(step.selector, {
      visible: true,
      timeout: step.timeout || 10000,
    });

    if (!element) {
      throw new Error(`Element not found: ${step.selector}`);
    }

    // If value is specified, check element text/value
    if (step.value) {
      const elementText = await page.$eval(step.selector, (el) => {
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
          return el.value;
        }
        return el.textContent || '';
      });

      if (!elementText.includes(step.value)) {
        throw new Error(
          `Element text "${elementText}" does not contain expected value "${step.value}"`
        );
      }
    }
  }
}
