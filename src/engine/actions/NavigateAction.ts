import { Page } from 'puppeteer';
import { BaseAction, TestStep } from './BaseAction';

export class NavigateAction extends BaseAction {
  type = 'navigate';

  protected async perform(page: Page, step: TestStep): Promise<void> {
    if (!step.url) {
      throw new Error('URL is required for navigate action');
    }

    // Validate URL format
    try {
      new URL(step.url);
    } catch (error) {
      throw new Error(`Invalid URL format: ${step.url}`);
    }

    try {
      // Navigate to the URL
      const response = await page.goto(step.url, {
        waitUntil: 'networkidle2',
        timeout: step.timeout || 30000,
      });

      // Check if navigation was successful
      if (!response) {
        throw new Error(`Failed to navigate to ${step.url}: No response received`);
      }

      const status = response.status();
      if (status >= 400) {
        throw new Error(`Failed to navigate to ${step.url}: HTTP ${status} ${response.statusText()}`);
      }

      // Wait a bit for any dynamic content
      await this.smartWait(page);
    } catch (error: any) {
      if (error.message?.includes('Timeout')) {
        throw new Error(`Navigation timeout: ${step.url} took longer than ${step.timeout || 30000}ms to load`);
      }
      if (error.message?.includes('net::ERR')) {
        throw new Error(`Network error navigating to ${step.url}: ${error.message}`);
      }
      throw error;
    }
  }
}
