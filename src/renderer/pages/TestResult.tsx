import React from 'react';
import { useUIStore } from '../store/uiStore';
import { useTestStore } from '../store/testStore';

const TestResult: React.FC = () => {
  const { setCurrentView } = useUIStore();
  const { currentTest, currentResult } = useTestStore();

  if (!currentTest || !currentResult) {
    return <div>テスト結果がありません</div>;
  }

  const successCount = currentResult.steps.filter((s) => s.status === 'success').length;
  const failedCount = currentResult.steps.filter((s) => s.status === 'failed').length;
  const totalSteps = currentResult.steps.length;

  const duration = currentResult.endTime
    ? (currentResult.endTime.getTime() - currentResult.startTime.getTime()) / 1000
    : 0;

  const handleBack = () => {
    setCurrentView('test-edit');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <button onClick={handleBack} className="btn-secondary mb-4 text-sm">
            ← テストに戻る
          </button>
          <h1 className="text-3xl font-bold text-gray-900">テスト結果</h1>
          <p className="text-gray-600 mt-2">{currentTest.name}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 py-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Overall Result */}
          <div
            className={`card ${
              currentResult.status === 'success'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`text-6xl ${
                  currentResult.status === 'success'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {currentResult.status === 'success' ? '✓' : '✗'}
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentResult.status === 'success'
                    ? 'テスト成功！'
                    : 'テスト失敗'}
                </h2>

                <div className="flex items-center gap-6 text-sm text-gray-700">
                  <div>
                    <span className="font-medium">成功:</span>{' '}
                    <span className="text-green-700 font-bold">
                      {successCount}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">失敗:</span>{' '}
                    <span className="text-red-700 font-bold">
                      {failedCount}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">合計:</span> {totalSteps}
                  </div>
                  <div>
                    <span className="font-medium">実行時間:</span>{' '}
                    {duration.toFixed(2)}秒
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step Results */}
          <div className="mt-8 card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ステップごとの結果
            </h3>

            <div className="space-y-3">
              {currentResult.steps.map((stepResult, index) => {
                const step = currentTest.steps.find(
                  (s) => s.id === stepResult.stepId
                );

                return (
                  <div
                    key={stepResult.stepId}
                    className={`p-4 rounded-lg border ${
                      stepResult.status === 'success'
                        ? 'bg-green-50 border-green-200'
                        : stepResult.status === 'failed'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {step?.description || 'Unknown step'}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {stepResult.duration.toFixed(2)}s
                            </span>
                            {stepResult.status === 'success' && (
                              <span className="badge-success">✓ 成功</span>
                            )}
                            {stepResult.status === 'failed' && (
                              <span className="badge-error">✗ 失敗</span>
                            )}
                          </div>
                        </div>

                        {stepResult.error && (
                          <div className="mt-2 p-3 bg-red-100 rounded text-sm text-red-800">
                            <p className="font-medium mb-1">エラー:</p>
                            <p>{stepResult.error}</p>
                          </div>
                        )}

                        {stepResult.screenshot && (
                          <div className="mt-3">
                            <img
                              src={stepResult.screenshot}
                              alt={`Step ${index + 1} screenshot`}
                              className="rounded-lg border border-gray-300 max-w-md"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Video */}
          {currentResult.videoPath && (
            <div className="mt-8 card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                実行動画
              </h3>
              <video
                src={currentResult.videoPath}
                controls
                className="w-full rounded-lg border border-gray-300"
              />
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button onClick={handleBack} className="btn-primary">
              テストを編集
            </button>
            <button onClick={handleBackToHome} className="btn-secondary">
              ホームに戻る
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestResult;
