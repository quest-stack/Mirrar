import React from 'react';

interface TemplateStep {
  id: string;
  type: string;
  description: string;
  prompt: string;
  testData?: {
    type?: string;
    placeholder?: string;
  };
}

interface StepEditorProps {
  step: TemplateStep;
  value: string;
  onChange: (value: string) => void;
}

const StepEditor: React.FC<StepEditorProps> = ({ step, value, onChange }) => {
  if (step.type === 'navigate') {
    return (
      <div className="card">
        <label className="label">ページのURL</label>
        <input
          type="url"
          className="input"
          placeholder="https://example.com"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
        />
        <p className="text-sm text-gray-500 mt-2">
          テストしたいページのURLを入力してください
        </p>
      </div>
    );
  }

  if (step.type === 'input') {
    return (
      <div className="card">
        <div className="mb-4">
          <label className="label">入力する値</label>
          <input
            type={step.testData?.type || 'text'}
            className="input"
            placeholder={step.testData?.placeholder || 'テストデータを入力'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-2">
            テストで使用する値を入力してください（実際のパスワードなどは使用しないでください）
          </p>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">
            次に、ブラウザで要素を選択します
          </p>
          <p className="text-xs text-gray-600">
            「次へ」をクリックすると、ブラウザが開いて要素を選択できます
          </p>
        </div>
      </div>
    );
  }

  if (step.type === 'click') {
    return (
      <div className="card">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">
            ブラウザで要素を選択します
          </p>
          <p className="text-xs text-gray-600">
            「次へ」をクリックすると、ブラウザが開いてクリックする要素を選択できます
          </p>
        </div>
      </div>
    );
  }

  if (step.type === 'waitFor') {
    return (
      <div className="card">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">
            確認する要素を選択します
          </p>
          <p className="text-xs text-gray-600">
            「次へ」をクリックすると、ブラウザが開いて確認する要素を選択できます
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="text-gray-600">このステップの設定</p>
    </div>
  );
};

export default StepEditor;
