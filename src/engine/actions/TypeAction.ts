import { Page } from 'puppeteer';
import { BaseAction, TestStep } from './BaseAction';

export class TypeAction extends BaseAction {
  type = 'input';

  protected async perform(page: Page, step: TestStep): Promise<void> {
    if (!step.selector) {
      throw new Error('Selector is required for type action');
    }

    if (step.value === undefined) {
      throw new Error('Value is required for type action');
    }

    // Wait for element to be visible
    await page.waitForSelector(step.selector, {
      visible: true,
      timeout: step.timeout || 10000,
    });

    // Clear existing value
    await page.click(step.selector, { clickCount: 3 });
    await page.keyboard.press('Backspace');

    // Type the value with a slight delay to simulate human typing
    await page.type(step.selector, step.value, { delay: 50 });

    // Wait a bit for any auto-complete or validation
    await page.waitForTimeout(300);
  }
}
