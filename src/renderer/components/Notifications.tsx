import React from 'react';
import { useUIStore } from '../store/uiStore';

const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useUIStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-lg shadow-lg p-4 flex items-start justify-between animate-slide-in ${
            notification.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : notification.type === 'error'
              ? 'bg-red-50 border border-red-200'
              : notification.type === 'warning'
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-blue-50 border border-blue-200'
          }`}
        >
          <div className="flex items-start flex-1">
            <div className="mr-3 text-2xl">
              {notification.type === 'success' && '✓'}
              {notification.type === 'error' && '✗'}
              {notification.type === 'warning' && '⚠'}
              {notification.type === 'info' && 'ℹ'}
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  notification.type === 'success'
                    ? 'text-green-900'
                    : notification.type === 'error'
                    ? 'text-red-900'
                    : notification.type === 'warning'
                    ? 'text-yellow-900'
                    : 'text-blue-900'
                }`}
              >
                {notification.message}
              </p>
            </div>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
