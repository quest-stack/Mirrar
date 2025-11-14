import { Page } from 'puppeteer';
import { BaseAction, TestStep } from './BaseAction';

export class ClickAction extends BaseAction {
  type = 'click';

  protected async perform(page: Page, step: TestStep): Promise<void> {
    if (!step.selector) {
      throw new Error('Selector is required for click action');
    }

    try {
      // Wait for element to be visible and stable
      await page.waitForSelector(step.selector, {
        visible: true,
        timeout: step.timeout || 10000,
      });
    } catch (error: any) {
      if (error.message?.includes('Timeout') || error.message?.includes('waiting for selector')) {
        throw new Error(`Element not found or not visible: ${step.selector} (waited ${step.timeout || 10000}ms)`);
      }
      throw new Error(`Failed to find element ${step.selector}: ${error.message}`);
    }

    try {
      // Wait for element to be stable (not moving)
      await this.waitForStability(page, step.selector);

      // Click the element
      await page.click(step.selector);

      // Wait for any navigation or network activity
      await this.smartWait(page);
    } catch (error: any) {
      throw new Error(`Failed to click element ${step.selector}: ${error.message}`);
    }
  }

  private async waitForStability(page: Page, selector: string): Promise<void> {
    let lastPosition = await this.getElementPosition(page, selector);
    let stableCount = 0;

    while (stableCount < 3) {
      await page.waitForTimeout(100);

      const currentPosition = await this.getElementPosition(page, selector);

      if (
        lastPosition.x === currentPosition.x &&
        lastPosition.y === currentPosition.y
      ) {
        stableCount++;
      } else {
        stableCount = 0;
      }

      lastPosition = currentPosition;
    }
  }

  private async getElementPosition(
    page: Page,
    selector: string
  ): Promise<{ x: number; y: number }> {
    return page.$eval(selector, (el) => {
      const rect = el.getBoundingClientRect();
      return { x: rect.x, y: rect.y };
    });
  }
}
