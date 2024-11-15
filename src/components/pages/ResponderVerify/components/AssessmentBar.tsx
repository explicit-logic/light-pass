import type { Correction } from '@/models/Correction';
import type { Responder } from '@/models/Responder';
import type { FinalMarkForm } from '../types/FinalMarkForm.types';

import { memo, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useLoaderData, useRevalidator } from 'react-router-dom';

// API
import { evaluate as correctionEvaluate } from '@/api/corrections';

// Components
import { Button } from '@headlessui/react';

// Constants
import { MARKS, type MARK_TYPE } from '@/constants/marks';

// Lib
import { toast } from '@/lib/toaster';

const MARK_LABEL = {
  [MARKS.WRONG]: 'Wrong',
  [MARKS.HALF]: 'Half Right',
  [MARKS.RIGHT]: 'Right',
};

type Props = {
  block: QuestionBlock;
  correction?: Correction;
  currentSlug: string | null;
};

function AssessmentBar({ block, correction, currentSlug }: Props) {
  const { responder } = useLoaderData() as { responder: Responder };
  const { points, verified = false } = correction ?? {};
  const noMark = points === undefined || points === null;
  const revalidator = useRevalidator();
  const methods = useFormContext<FinalMarkForm>();
  const { resetField } = methods;

  const checkButtonDisabled = useCallback(
    (mark: MARK_TYPE) => responder.verified || (verified && points === mark),
    [responder.verified, verified, points],
  );

  const evaluate = useCallback(
    (newMark: MARK_TYPE) => async () => {
      if (!currentSlug) return;

      try {
        const autoMark = await correctionEvaluate({
          responderId: responder.id,
          page: currentSlug,
          question: block.name,
          points: newMark,
        });
        revalidator.revalidate();
        resetField('finalMark', { defaultValue: autoMark });

        toast('Answer is verified', { duration: 1 });
      } catch (error) {
        const message = (error as Error)?.message ?? error;
        toast.error(message);
      }
    },
    [block.name, currentSlug, responder.id, revalidator, resetField],
  );

  return (
    <div>
      <div className="inline-flex border-b border-gray-200 dark:border-gray-700" role="group">
        <Button
          type="button"
          className="inline-flex items-center px-3 py-2 text-sm font-medium data-[hover]:bg-gray-400 dark:data-[hover]:bg-gray-700 text-gray-900 bg-white border-r border-gray-200 rounded-tl-lg focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-blue-500"
          disabled={checkButtonDisabled(MARKS.WRONG)}
          onClick={evaluate(MARKS.WRONG)}
        >
          <svg
            className={`w-5 h-5 ${verified && points === MARKS.WRONG ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}
            aria-hidden="true"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 256 256"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM184,136H72a8,8,0,0,1,0-16H184a8,8,0,0,1,0,16Z" />
          </svg>
        </Button>
        <Button
          type="button"
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-white focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 data-[hover]:bg-gray-400 dark:data-[hover]:bg-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-blue-500"
          disabled={checkButtonDisabled(MARKS.HALF)}
          onClick={evaluate(MARKS.HALF)}
        >
          <svg
            className={`w-5 h-5 ${verified && points === MARKS.HALF ? 'text-yellow-300' : 'text-gray-800 dark:text-gray-200'}`}
            aria-hidden="true"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 256 256"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM56,96a8,8,0,0,1,8-8H80V72a8,8,0,0,1,16,0V88h16a8,8,0,0,1,0,16H96v16a8,8,0,0,1-16,0V104H64A8,8,0,0,1,56,96Zm24,96a8,8,0,0,1-5.66-13.66l96-96a8,8,0,0,1,11.32,11.32l-96,96A8,8,0,0,1,80,192Zm112-8H144a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Z" />
          </svg>
        </Button>
        <Button
          type="button"
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-white border-l border-gray-200 rounded-tr-lg data-[hover]:bg-gray-400 dark:data-[hover]:bg-gray-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-blue-500"
          disabled={checkButtonDisabled(MARKS.RIGHT)}
          onClick={evaluate(MARKS.RIGHT)}
        >
          <svg
            className={`w-5 h-5 ${verified && points === MARKS.RIGHT ? 'text-green-500' : 'text-gray-800 dark:text-gray-200'}`}
            aria-hidden="true"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
          </svg>
        </Button>
      </div>
      <div className="flex justify-center shadow-sm text-sm py-1 rounded-b-lg text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800">
        {noMark ? '-' : MARK_LABEL[points]}
      </div>
    </div>
  );
}

export default memo(AssessmentBar);
