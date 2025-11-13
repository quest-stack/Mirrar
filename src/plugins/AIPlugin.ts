export interface AIPromptContext {
  currentTest?: {
    name: string;
    steps: any[];
  };
  currentStep?: string;
  issue: string;
  selector?: string;
  htmlSnapshot?: string;
  error?: string;
}

export interface AIResponse {
  success: boolean;
  message: string;
  action?: {
    type: string;
    steps?: string[];
  };
  details?: any;
}

export abstract class AIPlugin {
  constructor(public name: string, public endpoint: string | null) {}

  abstract sendPrompt(
    prompt: string,
    context: AIPromptContext
  ): Promise<AIResponse>;

  abstract applyResponse(response: string, context: any): Promise<AIResponse>;

  protected abstract buildPrompt(
    issue: string,
    context: AIPromptContext
  ): string;
}
