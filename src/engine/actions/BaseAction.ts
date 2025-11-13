import { Page } from 'puppeteer';

export interface ActionResult {
  success: boolean;
  error?: string;
  duration: number;
  screenshot?: string;
}

export interface TestStep {
  id: string;
  type: string;
  description: string;
  selector?: string;
  value?: string;
  url?: string;
  timeout?: number;
}

export abstract class BaseAction {
  abstract type: string;

  async execute(page: Page, step: TestStep): Promise<ActionResult> {
    const startTime = Date.now();

    try {
      await this.perform(page, step);

      const duration = Date.now() - startTime;
      const screenshot = await page.screenshot({ encoding: 'base64' });

      return {
        success: true,
        duration,
        screenshot: `data:image/png;base64,${screenshot}`,
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;

      return {
        success: false,
        error: error.message || String(error),
        duration,
      };
    }
  }

  protected abstract perform(page: Page, step: TestStep): Promise<void>;

  protected async smartWait(page: Page, timeout: number = 5000): Promise<void> {
    try {
      await page.waitForNetworkIdle({ timeout, idleTime: 500 });
    } catch (e) {
      // If network idle times out, that's okay
      // The page might have ongoing requests
    }
  }
}
