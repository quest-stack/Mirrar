import { Page } from 'puppeteer';
import { BaseAction, TestStep } from './BaseAction';

export class TypeAction extends BaseAction {
  type = 'input';

  protected async perform(page: Page, step: TestStep): Promise<void> {
    if (!step.selector) {
      throw new Error('Selector is required for type action');
    }

    if (step.value === undefined || step.value === null) {
      throw new Error('Value is required for type action');
    }

    try {
      // Wait for element to be visible
      await page.waitForSelector(step.selector, {
        visible: true,
        timeout: step.timeout || 10000,
      });
    } catch (error: any) {
      if (error.message?.includes('Timeout') || error.message?.includes('waiting for selector')) {
        throw new Error(`Input field not found or not visible: ${step.selector} (waited ${step.timeout || 10000}ms)`);
      }
      throw new Error(`Failed to find input field ${step.selector}: ${error.message}`);
    }

    try {
      // Check if element is an input or textarea
      const isInputField = await page.$eval(step.selector, (el) => {
        return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
      });

      if (!isInputField) {
        throw new Error(`Element ${step.selector} is not an input field or textarea`);
      }

      // Clear existing value
      await page.click(step.selector, { clickCount: 3 });
      await page.keyboard.press('Backspace');

      // Type the value with a slight delay to simulate human typing
      await page.type(step.selector, String(step.value), { delay: 50 });

      // Wait a bit for any auto-complete or validation
      await page.waitForTimeout(300);
    } catch (error: any) {
      throw new Error(`Failed to type into ${step.selector}: ${error.message}`);
    }
  }
}
