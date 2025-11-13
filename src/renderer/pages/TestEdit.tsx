import React from 'react';
import { useUIStore } from '../store/uiStore';
import { useTestStore } from '../store/testStore';

const TestEdit: React.FC = () => {
  const { setCurrentView, addNotification } = useUIStore();
  const { currentTest, isRunning, setIsRunning } = useTestStore();

  if (!currentTest) {
    return <div>テストが選択されていません</div>;
  }

  const handleRunTest = async () => {
    if (!window.electronAPI) {
      addNotification({
        type: 'error',
        message: 'Electron APIが利用できません',
      });
      return;
    }

    try {
      setIsRunning(true);
      addNotification({
        type: 'info',
        message: 'テストを実行中...',
      });

      const result = await window.electronAPI.runTest(currentTest);

      setIsRunning(false);
      addNotification({
        type: 'success',
        message: 'テストが完了しました！',
      });

      setCurrentView('test-result');
    } catch (error) {
      setIsRunning(false);
      addNotification({
        type: 'error',
        message: `テストの実行に失敗しました: ${error}`,
      });
    }
  };

  const handleBack = () => {
    setCurrentView('home');
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <button onClick={handleBack} className="btn-secondary mb-4 text-sm">
            ← ホームに戻る
          </button>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {currentTest.name}
              </h1>
              <p className="text-gray-600 mt-2">{currentTest.description}</p>
            </div>
            <button
              onClick={handleRunTest}
              disabled={isRunning}
              className="btn-success text-lg px-8 py-3"
            >
              {isRunning ? '実行中...' : '▶ テストを実行'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 py-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              テストステップ
            </h2>

            {currentTest.steps.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                ステップがまだ追加されていません
              </p>
            ) : (
              <div className="space-y-3">
                {currentTest.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge-info text-xs">
                          {step.type}
                        </span>
                        <h3 className="font-medium text-gray-900">
                          {step.description}
                        </h3>
                      </div>

                      {step.url && (
                        <p className="text-sm text-gray-600">
                          URL: {step.url}
                        </p>
                      )}

                      {step.selector && (
                        <p className="text-sm text-gray-600">
                          セレクター: <code className="bg-gray-200 px-2 py-0.5 rounded">{step.selector}</code>
                        </p>
                      )}

                      {step.value && (
                        <p className="text-sm text-gray-600">
                          値: {step.value}
                        </p>
                      )}
                    </div>

                    {step.status === 'success' && (
                      <span className="badge-success">✓</span>
                    )}
                    {step.status === 'failed' && (
                      <span className="badge-error">✗</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Test Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">ステップ数</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentTest.steps.length}
              </p>
            </div>

            <div className="card">
              <p className="text-sm text-gray-600 mb-1">作成日</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date(currentTest.createdAt).toLocaleDateString('ja-JP')}
              </p>
            </div>

            <div className="card">
              <p className="text-sm text-gray-600 mb-1">最終更新</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date(currentTest.updatedAt).toLocaleDateString('ja-JP')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestEdit;
