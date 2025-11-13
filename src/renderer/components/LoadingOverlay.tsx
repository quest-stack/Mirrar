import React from 'react';
import { useUIStore } from '../store/uiStore';

const LoadingOverlay: React.FC = () => {
  const { isLoading, loadingMessage } = useUIStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          {/* Loading Spinner */}
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />

          {/* Loading Message */}
          <p className="text-lg font-medium text-gray-900 text-center">
            {loadingMessage || '処理中...'}
          </p>

          <p className="text-sm text-gray-500 mt-2 text-center">
            しばらくお待ちください
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
