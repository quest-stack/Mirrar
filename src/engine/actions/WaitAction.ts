import { Page } from 'puppeteer';
import { BaseAction, TestStep } from './BaseAction';

export class WaitAction extends BaseAction {
  type = 'wait';

  protected async perform(page: Page, step: TestStep): Promise<void> {
    const timeout = step.timeout || 3000;
    await page.waitForTimeout(timeout);
  }
}

export class WaitForAction extends BaseAction {
  type = 'waitFor';

  protected async perform(page: Page, step: TestStep): Promise<void> {
    if (!step.selector) {
      throw new Error('Selector is required for waitFor action');
    }

    try {
      // Wait for element to appear
      await page.waitForSelector(step.selector, {
        visible: true,
        timeout: step.timeout || 10000,
      });

      // Additional smart wait
      await this.smartWait(page);
    } catch (error: any) {
      if (error.message?.includes('Timeout') || error.message?.includes('waiting for selector')) {
        throw new Error(`Element did not appear: ${step.selector} (waited ${step.timeout || 10000}ms)`);
      }
      throw new Error(`Failed to wait for element ${step.selector}: ${error.message}`);
    }
  }
}
