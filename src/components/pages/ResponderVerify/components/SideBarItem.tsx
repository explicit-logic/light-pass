import type { Page } from '../models/Page';

import { memo } from 'react';

type Props = {
  onClick: () => void;
  page: Page;
};

function SideBarItem(props: Props) {
  const { onClick, page } = props;
  const { active, verified } = page;
  const isBlue = active && !verified;
  const isGray = !active && !verified;
  const isActiveGreen = active && verified;
  const isGreen = verified && !active;

  return (
    <li>
      <button
        type="button"
        className={`flex items-center h-10 whitespace-nowrap w-full px-2 text-gray-900 rounded-lg ${isBlue && 'bg-blue-600'} ${
          isGray && 'bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
        } ${isActiveGreen && 'bg-green-500'} ${isGreen && 'bg-green-800 hover:bg-green-700'} dark:text-white`}
        disabled={page.active}
        onClick={onClick}
      >
        {page.assessed && (
          <span className="tabular-nums text-sm min-w-16 block">
            {page.mark}&nbsp;/&nbsp;<span className="text-xs">{page.threshold}</span>
            {/* <span className={`block h-full border-r ${page.active ? 'border-gray-300' : 'border-gray-500'} mx-1`} /> */}
          </span>
        )}
        <span className="text-ellipsis overflow-hidden">{page.name}</span>
      </button>
    </li>
  );
}

export default memo(SideBarItem);
