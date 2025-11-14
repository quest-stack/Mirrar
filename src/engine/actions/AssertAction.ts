import { Page } from 'puppeteer';
import { BaseAction, TestStep } from './BaseAction';

export class AssertAction extends BaseAction {
  type = 'assert';

  protected async perform(page: Page, step: TestStep): Promise<void> {
    if (!step.selector) {
      throw new Error('Selector is required for assert action');
    }

    try {
      // Wait for element to appear
      const element = await page.waitForSelector(step.selector, {
        visible: true,
        timeout: step.timeout || 10000,
      });

      if (!element) {
        throw new Error(`Assertion failed: Element not found or not visible: ${step.selector}`);
      }

      // If value is specified, check element text/value
      if (step.value) {
        const elementText = await page.$eval(step.selector, (el) => {
          if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
            return el.value;
          }
          return el.textContent?.trim() || '';
        });

        if (!elementText.includes(step.value)) {
          throw new Error(
            `Assertion failed: Expected element ${step.selector} to contain "${step.value}", but found "${elementText}"`
          );
        }
      }
    } catch (error: any) {
      if (error.message?.includes('Timeout') || error.message?.includes('waiting for selector')) {
        throw new Error(`Assertion failed: Element ${step.selector} did not appear within ${step.timeout || 10000}ms`);
      }
      if (error.message?.includes('Assertion failed')) {
        throw error;
      }
      throw new Error(`Assertion failed for ${step.selector}: ${error.message}`);
    }
  }
}
