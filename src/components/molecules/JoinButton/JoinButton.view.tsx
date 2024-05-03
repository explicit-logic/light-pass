import { memo } from 'react';
import { Link } from 'react-router-dom';

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

function JoinButtonView(props: { language: string; online?: boolean; quizId: number }) {
  const { language, online = false, quizId } = props;

  return (
    <Link
      to={`/quizzes/${quizId}/locales/${language}`}
      className="flex items-center justify-center rounded-lg dark:hover:bg-gray-700 hover:bg-gray-200 px-2 py-1 text-gray-800 dark:text-white"
    >
      {showIcon(online)}
      <span>Join</span>
    </Link>
  );
}

export default memo(JoinButtonView);
