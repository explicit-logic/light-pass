import type { Responder } from '@/models/Responder';
import type { FinalMarkForm } from '../types/FinalMarkForm.types';

import { memo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useLoaderData } from 'react-router-dom';

// Constants
import { MAX_MARK } from '@/constants/marks';

function FinalMark() {
  const { responder } = useLoaderData() as { responder: Responder };
  const methods = useFormContext<FinalMarkForm>();
  const { register } = methods;
  const edited = responder.autoMark !== responder.finalMark;

  return (
    <div className="flex flex-row items-center justify-center space-x-4">
      <div className="text-2xl font-medium leading-6 text-gray-900 dark:text-white">Final Mark</div>
      <div className="flex flex-row space-x-1">
        <div className="group">
          <input
            {...register('finalMark')}
            disabled={responder.verified}
            type="text"
            inputMode="numeric"
            className={`block w-20 px-4 text-gray-900 text-center border border-gray-300 rounded-lg bg-gray-50 text-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 ${
              edited ? 'dark:border-yellow-700' : 'dark:border-gray-600'
            } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
          />
          {edited && (
            <span className="group-hover:visible group-hover:opacity-100 invisible transition-opacity duration-500 inline-block opacity-0 px-2 py-1 -mt-20 -ml-4 text-xs font-body text-white rounded-lg shadow-sm bg-gray-900 dark:bg-gray-700 absolute text-center z-50">
              Original Mark: {responder.autoMark}
            </span>
          )}
        </div>
        <div className="text-base font-medium leading-6 text-gray-900 dark:text-white py-3">&nbsp;/&nbsp;</div>
        <div className="text-xl font-medium leading-6 text-gray-900 dark:text-white py-3">
          <span>{MAX_MARK}</span>
        </div>
      </div>
    </div>
  );
}

export default memo(FinalMark);
