import React from 'react';

interface SectionErrorProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export const SectionError: React.FC<SectionErrorProps> = ({ title, message, onRetry }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">{title}</h2>
      <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-50 mb-2">
          Error Loading {title}
        </h3>
        <p className="text-gray-600 dark:text-slate-400 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
