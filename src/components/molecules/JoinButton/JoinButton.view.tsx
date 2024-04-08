import { memo } from 'react';
import { Link } from 'react-router-dom';

const showIcon = (online: boolean) => {
  if (online) {
    return (
      <span className="flex relative h-2 w-2 mr-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
      </span>
    );
  }

  return (
    <svg
      className="w-6 h-6 me-1"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>QR</title>
      <path d="M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm0,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48ZM200,40H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-64,72V144a8,8,0,0,1,16,0v32a8,8,0,0,1-16,0Zm80-16a8,8,0,0,1-8,8H184v40a8,8,0,0,1-8,8H144a8,8,0,0,1,0-16h24V144a8,8,0,0,1,16,0v8h24A8,8,0,0,1,216,160Zm0,32v16a8,8,0,0,1-16,0V192a8,8,0,0,1,16,0Z" />
    </svg>
  );
};

function JoinButtonView(props: { locale: string; online?: boolean; quizId: number }) {
  const { locale, online = false, quizId } = props;

  return (
    <Link
      to={`/quizzes/${quizId}/locales/${locale}`}
      className="flex items-center justify-center rounded-lg dark:hover:bg-gray-700 hover:bg-gray-200 px-2 py-1 text-gray-800 dark:text-white"
    >
      {showIcon(online)}
      <span>Join</span>
    </Link>
  );
}

export default memo(JoinButtonView);
