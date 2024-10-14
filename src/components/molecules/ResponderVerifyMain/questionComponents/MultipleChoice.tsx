import type { Correction } from '@/models/Correction';

import { memo } from 'react';

// Constants
import { MARKS } from '@/constants/marks';

type Props = {
  block: Blocks.RadioGroup;
  correction?: Correction;
};

function MultipleChoice({ block, correction }: Props) {
  const { values } = block;
  const { mark } = correction ?? {};
  const noMark = mark === undefined || mark === null;

  return (
    <div className="space-y-2">
      <label
        className={`text-base leading-6 ${mark === MARKS.WRONG && 'text-red-500'} ${mark === MARKS.HALF && 'text-yellow-300'} ${
          mark === MARKS.RIGHT && 'text-green-500'
        } ${noMark && 'text-gray-500 dark:text-white'}`}
      >
        {block.label}
      </label>
      <div className="space-y-2">
        {values.map((option, idx) => (
          <div key={idx} className="flex items-center">
            <input
              defaultChecked={false}
              disabled
              type="radio"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            />
            <label className={`ms-2 text-sm font-medium ${option.selected ? 'text-green-500' : 'text-gray-900 dark:text-gray-300'}`}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(MultipleChoice);
