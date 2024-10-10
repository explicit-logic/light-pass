import { memo } from 'react';

type Props = {
  block: Blocks.CheckboxGroup;
};

function MultipleResponse({ block }: Props) {
  const { values } = block;

  return (
    <div className="space-y-2">
      <label className="text-base leading-6 text-gray-500 dark:text-white">{block.label}</label>
      <div className="space-y-2">
        {values.map((option, idx) => (
          <div key={idx} className="flex items-center">
            <input
              defaultChecked={false}
              disabled
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
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

export default memo(MultipleResponse);
