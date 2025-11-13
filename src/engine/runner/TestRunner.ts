import puppeteer, { Browser, Page } from 'puppeteer';
import { NavigateAction } from '../actions/NavigateAction';
import { ClickAction } from '../actions/ClickAction';
import { TypeAction } from '../actions/TypeAction';
import { WaitAction, WaitForAction } from '../actions/WaitAction';
import { AssertAction } from '../actions/AssertAction';
import { BaseAction, TestStep, ActionResult } from '../actions/BaseAction';

export interface Test {
  id: string;
  name: string;
  description: string;
  steps: TestStep[];
}

export interface TestResult {
  testId: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'success' | 'failed';
  steps: Array<{
    stepId: string;
    status: 'success' | 'failed' | 'skipped';
    duration: number;
    error?: string;
    screenshot?: string;
  }>;
  videoPath?: string;
  error?: string;
}

export interface TestRunnerOptions {
  headless?: boolean;
  slowMo?: number;
  viewport?: {
    width: number;
    height: number;
  };
  onProgress?: (stepIndex: number, total: number, result: ActionResult) => void;
}

export class TestRunner {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private actions: Map<string, BaseAction>;

  constructor() {
    // Register all actions
    this.actions = new Map();
    this.registerAction(new NavigateAction());
    this.registerAction(new ClickAction());
    this.registerAction(new TypeAction());
    this.registerAction(new WaitAction());
    this.registerAction(new WaitForAction());
    this.registerAction(new AssertAction());
  }

  private registerAction(action: BaseAction): void {
    this.actions.set(action.type, action);
  }

  async initialize(options: TestRunnerOptions = {}): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: options.headless ?? false,
      slowMo: options.slowMo ?? 0,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    this.page = await this.browser.newPage();

    if (options.viewport) {
      await this.page.setViewport(options.viewport);
    } else {
      await this.page.setViewport({ width: 1280, height: 720 });
    }
  }

  async runTest(test: Test, options: TestRunnerOptions = {}): Promise<TestResult> {
    const result: TestResult = {
      testId: test.id,
      startTime: new Date(),
      status: 'running',
      steps: [],
    };

    try {
      // Initialize browser
      await this.initialize(options);

      if (!this.page) {
        throw new Error('Page not initialized');
      }

      // Execute each step
      for (let i = 0; i < test.steps.length; i++) {
        const step = test.steps[i];
        const action = this.actions.get(step.type);

        if (!action) {
          result.steps.push({
            stepId: step.id,
            status: 'failed',
            duration: 0,
            error: `Unknown action type: ${step.type}`,
          });
          continue;
        }

        try {
          const actionResult = await action.execute(this.page, step);

          result.steps.push({
            stepId: step.id,
            status: actionResult.success ? 'success' : 'failed',
            duration: actionResult.duration,
            error: actionResult.error,
            screenshot: actionResult.screenshot,
          });

          // Call progress callback
          if (options.onProgress) {
            options.onProgress(i, test.steps.length, actionResult);
          }

          if (!actionResult.success) {
            // Step failed
            result.status = 'failed';
            result.error = `Step ${i + 1} failed: ${actionResult.error}`;
            break;
          }
        } catch (error: any) {
          result.steps.push({
            stepId: step.id,
            status: 'failed',
            duration: 0,
            error: error.message || String(error),
          });

          result.status = 'failed';
          result.error = `Step ${i + 1} failed: ${error.message}`;
          break;
        }
      }

      // If all steps succeeded
      if (result.status === 'running') {
        result.status = 'success';
      }
    } catch (error: any) {
      result.status = 'failed';
      result.error = error.message || String(error);
    } finally {
      result.endTime = new Date();
      await this.cleanup();
    }

    return result;
  }

  async cleanup(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }

    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  getPage(): Page | null {
    return this.page;
  }

  getBrowser(): Browser | null {
    return this.browser;
  }
}
