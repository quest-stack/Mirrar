import React, { useState } from 'react';
import { useUIStore } from '../store/uiStore';
import { useTestStore } from '../store/testStore';
import templatesData from '../../templates/templates.json';
import GuidePanel from '../components/GuidePanel';
import StepEditor from '../components/StepEditor';

const TestCreate: React.FC = () => {
  const { setCurrentView, addNotification } = useUIStore();
  const { currentTest, currentStepIndex, setCurrentStepIndex, addStep } =
    useTestStore();

  const [currentUrl, setCurrentUrl] = useState('');

  if (!currentTest || !currentTest.templateId) {
    return <div>テンプレートが選択されていません</div>;
  }

  const template = templatesData.templates.find(
    (t) => t.id === currentTest.templateId
  );

  if (!template) {
    return <div>テンプレートが見つかりません</div>;
  }

  const templateSteps = template.steps;
  const currentTemplateStep = templateSteps[currentStepIndex];
  const isLastStep = currentStepIndex === templateSteps.length - 1;
  const progress = ((currentStepIndex + 1) / templateSteps.length) * 100;

  const handleNext = async () => {
    // Validate current step
    if (currentTemplateStep.type === 'navigate' && !currentUrl) {
      addNotification({
        type: 'error',
        message: 'URLを入力してください',
      });
      return;
    }

    // Add step to test
    const newStep = {
      id: Math.random().toString(36).substr(2, 9),
      type: currentTemplateStep.type,
      description: currentTemplateStep.description,
      ...(currentTemplateStep.type === 'navigate' && { url: currentUrl }),
    };

    addStep(newStep);

    if (isLastStep) {
      // Test creation complete
      addNotification({
        type: 'success',
        message: 'テストの作成が完了しました！',
      });
      setCurrentView('test-edit');
    } else {
      // Move to next step
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      setCurrentView('template-select');
    }
  };

  const handleCancel = () => {
    setCurrentView('home');
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header with Progress */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentTest.name}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                ステップ {currentStepIndex + 1} / {templateSteps.length}
              </p>
            </div>
            <button onClick={handleCancel} className="btn-secondary text-sm">
              キャンセル
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-8">
          {/* Guide Panel */}
          <GuidePanel
            step={currentTemplateStep}
            stepNumber={currentStepIndex + 1}
            totalSteps={templateSteps.length}
          />

          {/* Step Editor */}
          <div className="flex-1 mt-6">
            <StepEditor
              step={currentTemplateStep}
              value={currentTemplateStep.type === 'navigate' ? currentUrl : ''}
              onChange={(value) => {
                if (currentTemplateStep.type === 'navigate') {
                  setCurrentUrl(value);
                }
              }}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="mt-6 flex items-center justify-between pt-6 border-t border-gray-200">
            <button onClick={handleBack} className="btn-secondary">
              ← 戻る
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleNext}
                className="btn-primary px-8"
              >
                {isLastStep ? '完了' : '次へ →'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestCreate;
