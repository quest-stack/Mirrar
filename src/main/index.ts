import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { TestRunner } from '../engine/runner/TestRunner';

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production';

// User data paths
const userDataPath = app.getPath('userData');
const testsDir = path.join(userDataPath, 'tests');
const resultsDir = path.join(userDataPath, 'results');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'Mirarr',
    backgroundColor: '#ffffff',
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Ensure directories exist
  if (!fs.existsSync(testsDir)) {
    fs.mkdirSync(testsDir, { recursive: true });
  }
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ============================================================================
// IPC Handlers
// ============================================================================

// App info
ipcMain.handle('get-app-path', () => {
  return userDataPath;
});

// Test execution
ipcMain.handle('run-test', async (_event, testData) => {
  const runner = new TestRunner();

  try {
    const result = await runner.runTest(testData, {
      headless: false,
      onProgress: (stepIndex, total, stepResult) => {
        // Send progress updates to renderer
        if (mainWindow) {
          mainWindow.webContents.send('test-progress', {
            stepIndex,
            total,
            stepResult,
          });
        }
      },
    });

    // Save result
    const resultPath = path.join(resultsDir, `${testData.id}_${Date.now()}.json`);
    fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));

    if (mainWindow) {
      mainWindow.webContents.send('test-complete', result);
    }

    return result;
  } catch (error: any) {
    if (mainWindow) {
      mainWindow.webContents.send('test-error', { message: error.message });
    }
    throw error;
  }
});

ipcMain.handle('stop-test', async () => {
  // TODO: Implement test stopping mechanism
  return { success: true };
});

// Element detection (placeholder)
ipcMain.handle('detect-elements', async (_event, url: string, rules: any) => {
  // This would open a browser and detect elements
  // For now, return empty array
  return [];
});

// Test file operations
ipcMain.handle('save-test', async (_event, test: any) => {
  try {
    const testPath = path.join(testsDir, `${test.id}.json`);
    fs.writeFileSync(testPath, JSON.stringify(test, null, 2));
    return test.id;
  } catch (error: any) {
    throw new Error(`Failed to save test: ${error.message}`);
  }
});

ipcMain.handle('load-test', async (_event, testId: string) => {
  try {
    const testPath = path.join(testsDir, `${testId}.json`);
    if (fs.existsSync(testPath)) {
      const data = fs.readFileSync(testPath, 'utf-8');
      return JSON.parse(data);
    }
    return null;
  } catch (error: any) {
    throw new Error(`Failed to load test: ${error.message}`);
  }
});

ipcMain.handle('load-all-tests', async () => {
  try {
    if (!fs.existsSync(testsDir)) {
      return [];
    }

    const files = fs.readdirSync(testsDir);
    const tests = files
      .filter((file) => file.endsWith('.json'))
      .map((file) => {
        try {
          const data = fs.readFileSync(path.join(testsDir, file), 'utf-8');
          return JSON.parse(data);
        } catch (error) {
          console.error(`Failed to load test ${file}:`, error);
          return null;
        }
      })
      .filter((test) => test !== null);

    return tests;
  } catch (error: any) {
    throw new Error(`Failed to load tests: ${error.message}`);
  }
});

ipcMain.handle('delete-test', async (_event, testId: string) => {
  try {
    const testPath = path.join(testsDir, `${testId}.json`);
    if (fs.existsSync(testPath)) {
      fs.unlinkSync(testPath);
    }
  } catch (error: any) {
    throw new Error(`Failed to delete test: ${error.message}`);
  }
});

// Screenshot and video (placeholder for now)
ipcMain.handle('get-screenshot', async (_event, testId: string, stepIndex: number) => {
  // Screenshots are embedded in test results as base64
  return null;
});

ipcMain.handle('get-video', async (_event, testId: string) => {
  // Videos would be stored in results directory
  const videoPath = path.join(resultsDir, `${testId}.mp4`);
  if (fs.existsSync(videoPath)) {
    return videoPath;
  }
  return null;
});
