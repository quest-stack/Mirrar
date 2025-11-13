import { Page } from 'puppeteer';
import { BaseAction, TestStep } from './BaseAction';

export class NavigateAction extends BaseAction {
  type = 'navigate';

  protected async perform(page: Page, step: TestStep): Promise<void> {
    if (!step.url) {
      throw new Error('URL is required for navigate action');
    }

    // Navigate to the URL
    await page.goto(step.url, {
      waitUntil: 'networkidle2',
      timeout: step.timeout || 30000,
    });

    // Wait a bit for any dynamic content
    await this.smartWait(page);
  }
}
