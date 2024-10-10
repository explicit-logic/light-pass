import { memo } from 'react';

type Props = {
  block: Blocks.Input;
};

function ShortAnswer({ block }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-base leading-6 text-gray-500 dark:text-white">{block.label}</label>
      <div className="">
        <p className="italic text-sm font-medium text-green-500 underline underline-offset-8">Tokyo</p>
      </div>
    </div>
  );
}

export default memo(ShortAnswer);
