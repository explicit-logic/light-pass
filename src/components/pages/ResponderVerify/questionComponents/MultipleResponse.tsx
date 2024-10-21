import type { Correction } from '@/models/Correction';

import { memo } from 'react';

// Constants
import { MARKS } from '@/constants/marks';

type Props = {
  answer?: string[];
  block: Blocks.CheckboxGroup;
  correction?: Correction;
};

function MultipleResponse({ answer, block, correction }: Props) {
  const { values } = block;
  const { points } = correction ?? {};
  const noMark = points === undefined || points === null;

  return (
    <div className="space-y-2">
      <label
        className={`text-base leading-6 ${points === MARKS.WRONG && 'text-red-500'} ${points === MARKS.HALF && 'text-yellow-300'} ${
          points === MARKS.RIGHT && 'text-green-500'
        } ${noMark && 'text-gray-500 dark:text-white'}`}
      >
        {block.label}
      </label>
      <div className="space-y-2">
        {values.map((option) => {
          const name = `${block.name}-${option.value}`;
          const checked = answer?.includes(option.value);
          const right = checked && option.selected;

          return (
            <div key={name} className="flex items-center">
              <input
                name={name}
                checked={checked}
                disabled
                type="checkbox"
                className={`w-4 h-4 ${
                  right ? 'text-green-600' : 'text-gray-700'
                } bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600`}
                value={option.value}
              />
              <label
                className={`ms-2 text-sm font-medium ${
                  option.selected ? 'text-green-500' : checked ? 'text-red-600' : 'text-gray-900 dark:text-gray-300'
                } ${checked && 'underline italic'}`}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(MultipleResponse);
