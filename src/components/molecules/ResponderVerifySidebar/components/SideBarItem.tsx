import { memo } from 'react';

type Props = {
  active: boolean;
  name: string;
  onClick: () => void;
  progress?: number;
  showProgress?: boolean;
  total?: number;
};

function SideBarItem(props: Props) {
  const { active = false, name, onClick, progress = 0, showProgress = false, total = 0 } = props;

  return (
    <li>
      <button
        type="button"
        className={`flex items-center h-10 whitespace-nowrap w-full px-2 text-gray-900 rounded-lg ${
          active ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
        } dark:text-white`}
        disabled={active}
        onClick={onClick}
      >
        {showProgress && (
          <>
            <span className="tabular-nums">
              {progress}&nbsp;/&nbsp;{total}
            </span>
            <span className={`block h-full border-r ${active ? 'border-gray-300' : 'border-gray-500'} mx-1`} />
          </>
        )}
        <span className="text-ellipsis overflow-hidden">{name}</span>
      </button>
    </li>
  );
}

export default memo(SideBarItem);
