import { memo } from 'react';

import QrIcon from '@/components/atoms/QrIcon';

const showIcon = (online: boolean) => {
  if (online) {
    return (
      <span className="flex relative h-2 w-2 mr-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
      </span>
    );
  }

  return <QrIcon className="w-6 h-6 me-1" />;
};

function ConnectionIndicatorView(props: { online?: boolean }) {
  const { online = false } = props;
  const title = online ? 'Online' : '';

  return (
    <div className="flex items-center justify-center rounded-lg px-2 py-1 text-gray-800 dark:text-white" title={title}>
      {showIcon(online)}
    </div>
  );
}

export default memo(ConnectionIndicatorView);
