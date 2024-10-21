import type { FinalMarkForm } from '../types/FinalMarkForm.types';

import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

// Constants
import { MAX_MARK } from '@/constants/marks';

function FinalMark() {
  const methods = useFormContext<FinalMarkForm>();
  const { register } = methods;

  return (
    <div className="flex flex-row items-center justify-center space-x-4">
      <div className="text-2xl font-medium leading-6 text-gray-900 dark:text-white">Final Mark</div>
      <div className="flex flex-row space-x-1">
        <input
          {...register('finalMark')}
          type="text"
          inputMode="numeric"
          className="block w-20 px-4 text-gray-900 text-center border border-gray-300 rounded-lg bg-gray-50 text-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <div className="text-base font-medium leading-6 text-gray-900 dark:text-white py-3">&nbsp;/&nbsp;</div>
        <div className="text-xl font-medium leading-6 text-gray-900 dark:text-white py-3">
          <span>{MAX_MARK}</span>
        </div>
      </div>
    </div>
  );
}

export default memo(FinalMark);
