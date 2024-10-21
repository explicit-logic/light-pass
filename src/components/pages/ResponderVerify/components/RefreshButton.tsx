import type { Responder } from '@/models/Responder';
import type { FinalMarkForm } from '../types/FinalMarkForm.types';

import { memo, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useLoaderData, useRevalidator } from 'react-router-dom';

import { generateMockAnswers } from '@/lib/evaluation/generateMockAnswers';
import { run } from '@/lib/evaluation/run';

// Lib
import { toast } from '@/lib/toaster';

function RefreshButton() {
  const { responder } = useLoaderData() as { responder: Responder };
  const revalidator = useRevalidator();

  const methods = useFormContext<FinalMarkForm>();
  const { resetField } = methods;
  const refresh = useCallback(async () => {
    try {
      await generateMockAnswers(responder.id);
      const finalMark = await run(responder.id);
      revalidator.revalidate();
      resetField('finalMark', { defaultValue: finalMark });

      toast.success('Auto evaluation completed');
    } catch (error) {
      const message = (error as Error)?.message ?? error;
      toast.error(message);
      console.log(error);
    }
  }, [responder.id, revalidator, resetField]);

  return (
    <button
      type="button"
      className="h-12 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
      onClick={refresh}
    >
      <svg
        className="w-6 h-6 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
        />
      </svg>
    </button>
  );
}

export default memo(RefreshButton);
