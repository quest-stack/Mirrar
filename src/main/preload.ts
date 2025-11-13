import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App methods
  getAppPath: () => ipcRenderer.invoke('get-app-path'),

  // Test execution methods (will be implemented later)
  runTest: (testData: any) => ipcRenderer.invoke('run-test', testData),
  stopTest: () => ipcRenderer.invoke('stop-test'),

  // Element detection methods
  detectElements: (url: string, rules: any) =>
    ipcRenderer.invoke('detect-elements', url, rules),

  // File operations
  saveTest: (test: any) => ipcRenderer.invoke('save-test', test),
  loadTest: (testId: string) => ipcRenderer.invoke('load-test', testId),
  loadAllTests: () => ipcRenderer.invoke('load-all-tests'),
  deleteTest: (testId: string) => ipcRenderer.invoke('delete-test', testId),

  // Screenshot and video
  getScreenshot: (testId: string, stepIndex: number) =>
    ipcRenderer.invoke('get-screenshot', testId, stepIndex),
  getVideo: (testId: string) => ipcRenderer.invoke('get-video', testId),

  // Listeners
  onTestProgress: (callback: (data: any) => void) => {
    ipcRenderer.on('test-progress', (_event, data) => callback(data));
  },
  onTestComplete: (callback: (data: any) => void) => {
    ipcRenderer.on('test-complete', (_event, data) => callback(data));
  },
  onTestError: (callback: (error: any) => void) => {
    ipcRenderer.on('test-error', (_event, error) => callback(error));
  },
});

// Type definitions for TypeScript
export interface ElectronAPI {
  getAppPath: () => Promise<string>;
  runTest: (testData: any) => Promise<any>;
  stopTest: () => Promise<void>;
  detectElements: (url: string, rules: any) => Promise<any[]>;
  saveTest: (test: any) => Promise<string>;
  loadTest: (testId: string) => Promise<any>;
  loadAllTests: () => Promise<any[]>;
  deleteTest: (testId: string) => Promise<void>;
  getScreenshot: (testId: string, stepIndex: number) => Promise<string>;
  getVideo: (testId: string) => Promise<string>;
  onTestProgress: (callback: (data: any) => void) => void;
  onTestComplete: (callback: (data: any) => void) => void;
  onTestError: (callback: (error: any) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
