import type { Correction } from '@/models/Correction';

import { memo } from 'react';
import { useLoaderData } from 'react-router-dom';

// Components
import AssessmentBar from './components/AssessmentBar';
import QuestionBlock from './components/QuestionBlock';

// Constants
import { QUESTION_TYPES } from '@/constants/block';

type Props = {
  currentSlug: string | null;
};

function ResponderVerifyMain({ currentSlug }: Props) {
  const { correctionsMap, pageData } = useLoaderData() as {
    correctionsMap: Record<Correction['question'], Correction>;
    pageData: PageConfig;
  };
  const { formData } = pageData;

  return (
    <main className="w-full py-3 px-2 space-y-6">
      {formData.map(
        (block, idx) =>
          block.type in QUESTION_TYPES && (
            <QuestionBlock
              key={(block as QuestionBlock).name}
              block={block as QuestionBlock}
              correction={correctionsMap[(block as QuestionBlock).name]}
              currentSlug={currentSlug}
            />
          ),
      )}
      <div className="flex flex-row justify-between">
        <div className="space-y-2">
          <label className="text-base leading-6 text-gray-500 dark:text-white">What is the largest city in the world?</label>
          <div className="">
            <p className="italic text-sm font-medium text-green-500 underline underline-offset-8">Tokyo</p>
          </div>
        </div>
        <div>{/* <AssessmentBar /> */}</div>
      </div>
      <div className="space-y-2">
        <label className="text-base leading-6 text-gray-500 dark:text-white">Who is the richest man in the world?</label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="default-radio-1"
              disabled
              type="radio"
              value=""
              name="default-radio-1"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Option
            </label>
          </div>
          <div className="flex items-center">
            <input
              defaultChecked
              disabled
              id="default-radio-2"
              type="radio"
              value=""
              name="default-radio-2"
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-red-500">
              Wrong Answer
            </label>
          </div>
          <div className="flex items-center">
            <input
              defaultChecked
              disabled
              id="default-radio-2"
              type="radio"
              value=""
              name="default-radio-3"
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-green-500">
              Right Choice
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="default-radio-1"
              disabled
              type="radio"
              value=""
              name="default-radio-4"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-green-500">
              Correct answer
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-base leading-6 text-gray-500 dark:text-white">What is the difference between a sea and an ocean?</label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="default-checkbox"
              type="checkbox"
              disabled
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Answer
            </label>
          </div>
          <div className="flex items-center">
            <input
              defaultChecked
              disabled
              id="default-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-red-500">
              Wrong Answer
            </label>
          </div>
          <div className="flex items-center">
            <input
              defaultChecked
              disabled
              id="checked-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="checked-checkbox" className="ms-2 text-sm font-medium text-green-500">
              Right choice
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="default-checkbox"
              type="checkbox"
              disabled
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="checked-checkbox" className="ms-2 text-sm font-medium text-green-500">
              Correct answer
            </label>
          </div>
        </div>
      </div>
    </main>
  );
}

export default memo(ResponderVerifyMain);
