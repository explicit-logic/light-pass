import { memo } from 'react';

const showIcon = (online: boolean) => {
  if (online) {
    return (
      <span className="flex relative h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
      </span>
    );
  }

  return <span className="rounded-full h-2 w-2 bg-gray-500" />;
};

function ConnectionIndicatorView(props: { activeCount: number; online?: boolean }) {
  const { activeCount, online = false } = props;
  const title = online ? 'Online' : '';

  return (
    <div className="flex items-center space-x-1 text-xs justify-center rounded-lg px-2 py-1 text-gray-800 dark:text-white" title={title}>
      {showIcon(online)}
      {activeCount > 0 && (
        <div className="flex items-center ">
          <svg
            className="w-4 h-4 text-gray-800 dark:text-white me-0.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
              clipRule="evenodd"
            />
          </svg>
          <span>{activeCount}</span>
        </div>
      )}
    </div>
  );
}

export default memo(ConnectionIndicatorView);
