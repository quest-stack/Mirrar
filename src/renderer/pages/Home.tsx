import React, { useEffect } from 'react';
import { useUIStore } from '../store/uiStore';
import { useTestStore } from '../store/testStore';

const Home: React.FC = () => {
  const { setCurrentView } = useUIStore();
  const { tests, setTests } = useTestStore();

  useEffect(() => {
    // Load tests from storage
    if (window.electronAPI) {
      window.electronAPI.loadAllTests().then((loadedTests) => {
        setTests(loadedTests);
      });
    }
  }, [setTests]);

  const handleNewTest = () => {
    setCurrentView('template-select');
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900">
          🪞 Mirrar
        </h1>
        <p className="text-gray-600 mt-2">
          非エンジニアでも使える、完全無料のテスト自動化ツール
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 py-8">
        {/* Quick Start Section */}
        <div className="max-w-6xl mx-auto">
          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  🚀 新しいテストを作成
                </h2>
                <p className="text-gray-600 mb-6">
                  テンプレートを選んで、10分でテストを作成できます
                </p>
                <button
                  onClick={handleNewTest}
                  className="btn-primary text-lg px-8 py-3"
                >
                  テストを作成する
                </button>
              </div>
              <div className="ml-8 text-6xl">✨</div>
            </div>
          </div>

          {/* Recent Tests */}
          {tests.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                最近のテスト
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tests.slice(0, 6).map((test) => (
                  <div
                    key={test.id}
                    className="card hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      useTestStore.getState().setCurrentTest(test);
                      setCurrentView('test-edit');
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 flex-1">
                        {test.name}
                      </h4>
                      {test.status === 'success' && (
                        <span className="badge-success">✓ 成功</span>
                      )}
                      {test.status === 'failed' && (
                        <span className="badge-error">✗ 失敗</span>
                      )}
                      {test.status === 'draft' && (
                        <span className="badge-warning">下書き</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {test.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{test.steps.length} ステップ</span>
                      <span>
                        {new Date(test.updatedAt).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="font-bold text-gray-900 mb-2">
                テンプレートで簡単
              </h3>
              <p className="text-sm text-gray-600">
                用意されたテンプレートを選ぶだけで、すぐにテストを作成できます
              </p>
            </div>

            <div className="card">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-bold text-gray-900 mb-2">
                コード不要
              </h3>
              <p className="text-sm text-gray-600">
                プログラミング知識は一切不要。画面を見ながら要素を選ぶだけ
              </p>
            </div>

            <div className="card">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-bold text-gray-900 mb-2">
                完全無料
              </h3>
              <p className="text-sm text-gray-600">
                APIコストなし。すべてローカルで動作します
              </p>
            </div>
          </div>

          {/* Getting Started */}
          {tests.length === 0 && (
            <div className="mt-12 card bg-blue-50 border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-3">
                はじめてのテスト作成
              </h3>
              <ol className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>「テストを作成する」ボタンをクリック</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>やりたいテストのテンプレートを選択</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>ガイドに従って要素を選択</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <span>テストを実行して結果を確認</span>
                </li>
              </ol>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
