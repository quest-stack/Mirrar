import { create } from 'zustand';

export interface TestStep {
  id: string;
  type: 'navigate' | 'click' | 'input' | 'waitFor' | 'wait' | 'assert';
  description: string;
  selector?: string;
  value?: string;
  url?: string;
  timeout?: number;
  status?: 'pending' | 'running' | 'success' | 'failed';
  error?: string;
  screenshot?: string;
}

export interface Test {
  id: string;
  name: string;
  description: string;
  templateId?: string;
  steps: TestStep[];
  createdAt: Date;
  updatedAt: Date;
  lastRunAt?: Date;
  status?: 'draft' | 'ready' | 'running' | 'success' | 'failed';
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

interface TestStore {
  // Current test being edited/created
  currentTest: Test | null;
  setCurrentTest: (test: Test | null) => void;
  updateCurrentTest: (updates: Partial<Test>) => void;

  // All tests
  tests: Test[];
  setTests: (tests: Test[]) => void;
  addTest: (test: Test) => void;
  updateTest: (id: string, updates: Partial<Test>) => void;
  deleteTest: (id: string) => void;

  // Test execution
  currentResult: TestResult | null;
  setCurrentResult: (result: TestResult | null) => void;
  updateCurrentResult: (updates: Partial<TestResult>) => void;

  // UI state
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;

  // Current step in creation flow
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Test step management
  addStep: (step: TestStep) => void;
  updateStep: (stepId: string, updates: Partial<TestStep>) => void;
  deleteStep: (stepId: string) => void;
  reorderSteps: (fromIndex: number, toIndex: number) => void;
}

export const useTestStore = create<TestStore>((set, get) => ({
  currentTest: null,
  setCurrentTest: (test) => set({ currentTest: test }),
  updateCurrentTest: (updates) =>
    set((state) => ({
      currentTest: state.currentTest
        ? { ...state.currentTest, ...updates, updatedAt: new Date() }
        : null,
    })),

  tests: [],
  setTests: (tests) => set({ tests }),
  addTest: (test) =>
    set((state) => ({
      tests: [...state.tests, test],
    })),
  updateTest: (id, updates) =>
    set((state) => ({
      tests: state.tests.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
      ),
    })),
  deleteTest: (id) =>
    set((state) => ({
      tests: state.tests.filter((t) => t.id !== id),
    })),

  currentResult: null,
  setCurrentResult: (result) => set({ currentResult: result }),
  updateCurrentResult: (updates) =>
    set((state) => ({
      currentResult: state.currentResult
        ? { ...state.currentResult, ...updates }
        : null,
    })),

  isRunning: false,
  setIsRunning: (running) => set({ isRunning: running }),

  currentStepIndex: 0,
  setCurrentStepIndex: (index) => set({ currentStepIndex: index }),
  nextStep: () =>
    set((state) => ({ currentStepIndex: state.currentStepIndex + 1 })),
  prevStep: () =>
    set((state) => ({
      currentStepIndex: Math.max(0, state.currentStepIndex - 1),
    })),

  addStep: (step) =>
    set((state) => ({
      currentTest: state.currentTest
        ? {
            ...state.currentTest,
            steps: [...state.currentTest.steps, step],
            updatedAt: new Date(),
          }
        : null,
    })),

  updateStep: (stepId, updates) =>
    set((state) => ({
      currentTest: state.currentTest
        ? {
            ...state.currentTest,
            steps: state.currentTest.steps.map((s) =>
              s.id === stepId ? { ...s, ...updates } : s
            ),
            updatedAt: new Date(),
          }
        : null,
    })),

  deleteStep: (stepId) =>
    set((state) => ({
      currentTest: state.currentTest
        ? {
            ...state.currentTest,
            steps: state.currentTest.steps.filter((s) => s.id !== stepId),
            updatedAt: new Date(),
          }
        : null,
    })),

  reorderSteps: (fromIndex, toIndex) =>
    set((state) => {
      if (!state.currentTest) return state;

      const steps = [...state.currentTest.steps];
      const [removed] = steps.splice(fromIndex, 1);
      steps.splice(toIndex, 0, removed);

      return {
        currentTest: {
          ...state.currentTest,
          steps,
          updatedAt: new Date(),
        },
      };
    }),
}));
