import React, { useState } from 'react';
import { useUIStore } from '../store/uiStore';
import { useTestStore } from '../store/testStore';
import templatesData from '../../templates/templates.json';

const TemplateSelector: React.FC = () => {
  const { setCurrentView } = useUIStore();
  const { setCurrentTest, setCurrentStepIndex } = useTestStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { templates, categories } = templatesData;

  const filteredTemplates = selectedCategory
    ? templates.filter((t) => t.category === selectedCategory)
    : templates;

  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    // Create new test from template
    const newTest = {
      id: Math.random().toString(36).substr(2, 9),
      name: template.name,
      description: template.description,
      templateId: template.id,
      steps: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft' as const,
    };

    setCurrentTest(newTest);
    setCurrentStepIndex(0);
    setCurrentView('test-create');
  };

  const handleBack = () => {
    setCurrentView('home');
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleBack}
            className="btn-secondary mb-4 text-sm"
          >
            ← 戻る
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            テンプレートを選択
          </h1>
          <p className="text-gray-600 mt-2">
            どんなテストを作成しますか？
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 py-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              すべて
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleSelectTemplate(template.id)}
                className="card hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{template.icon}</div>
                  <span className="badge-info">
                    {template.steps.length} ステップ
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {template.name}
                </h3>

                <p className="text-sm text-gray-600 mb-4">
                  {template.description}
                </p>

                {/* Preview steps */}
                <div className="space-y-1 mb-4">
                  {template.steps.slice(0, 3).map((step, index) => (
                    <div
                      key={step.id}
                      className="text-xs text-gray-500 flex items-start"
                    >
                      <span className="font-medium mr-2">{index + 1}.</span>
                      <span>{step.description}</span>
                    </div>
                  ))}
                  {template.steps.length > 3 && (
                    <div className="text-xs text-gray-400 italic">
                      ...他 {template.steps.length - 3} ステップ
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700">
                    このテンプレートを使う →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Help Card */}
          <div className="mt-12 card bg-gray-50 border-gray-300">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              💡 テンプレートの使い方
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  テンプレートを選ぶと、必要なステップが自動で設定されます
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  各ステップでガイドに従って要素を選択するだけでOK
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  要素は自動検出されるので、プログラミング知識は不要です
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  「自分で一から作る」を選べば、完全カスタムのテストも作成可能
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TemplateSelector;
