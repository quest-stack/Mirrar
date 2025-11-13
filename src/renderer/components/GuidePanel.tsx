import React from 'react';

interface TemplateStep {
  id: string;
  type: string;
  description: string;
  prompt: string;
  hints?: string[];
}

interface GuidePanelProps {
  step: TemplateStep;
  stepNumber: number;
  totalSteps: number;
}

const GuidePanel: React.FC<GuidePanelProps> = ({
  step,
  stepNumber,
  totalSteps,
}) => {
  return (
    <div className="card bg-blue-50 border-blue-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
            {stepNumber}
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {step.description}
          </h2>

          <p className="text-gray-700 mb-4">{step.prompt}</p>

          {step.hints && step.hints.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">💡 ヒント:</p>
              <ul className="space-y-1">
                {step.hints.map((hint, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-600 flex items-start"
                  >
                    <span className="mr-2">•</span>
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-xs text-gray-600">
              進捗: {stepNumber} / {totalSteps} ステップ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidePanel;
