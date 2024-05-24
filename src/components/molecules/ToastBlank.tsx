import type { Toast } from '@/lib/toaster/types';
import { type ReactNode, memo } from 'react';

export function ToastBlank(props: { t: Toast }) {
  const { t } = props;

  return (
    <div
      className="flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow top-5 right-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800"
      role="alert"
    >
      <div className="text-sm font-normal">{t.message as ReactNode}</div>
    </div>
  );
}

export default memo(ToastBlank);
