import React from 'react';
import Link from 'next/link';

interface SectionEmptyProps {
  title: string;
  icon?: string;
  message: string;
  subMessage?: string;
  actionLabel?: string;
  actionLink?: string;
}

export const SectionEmpty: React.FC<SectionEmptyProps> = ({
  title,
  icon = '👋',
  message,
  subMessage,
  actionLabel,
  actionLink,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">{title}</h2>
      <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-50 mb-2">{message}</h3>
        {subMessage && <p className="text-gray-600 dark:text-slate-400 mb-4">{subMessage}</p>}
        {actionLabel && actionLink && (
          <Link
            href={actionLink}
            className="bg-linear-to-r from-sky-500 to-emerald-400 text-white px-4 sm:px-6 py-2 rounded-lg hover:from-sky-600 hover:to-emerald-500 transition-all duration-200 text-sm sm:text-base inline-block"
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
};
