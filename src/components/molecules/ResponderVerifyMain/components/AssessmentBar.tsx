import { MARKS, type MARK_TYPE } from '@/constants/marks';
import { memo, useCallback, useState } from 'react';

type Props = {
  mark?: MARK_TYPE;
};

function AssessmentBar({ mark }: Props) {
  const [currentMark, setCurrentMark] = useState(mark);
  const onClick = useCallback((newMark: MARK_TYPE) => () => setCurrentMark(newMark), []);

  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <button
        type="button"
        className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
          currentMark !== MARKS.WRONG ? 'hover:bg-gray-400 dark:hover:bg-gray-700' : ''
        } text-gray-900 bg-white border-r border-gray-200 rounded-s-lg focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-blue-500`}
        onClick={onClick(MARKS.WRONG)}
      >
        <svg
          className={`w-5 h-5 ${currentMark === MARKS.WRONG ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}
          aria-hidden="true"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM184,136H72a8,8,0,0,1,0-16H184a8,8,0,0,1,0,16Z" />
        </svg>
      </button>
      <button
        type="button"
        className={`inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-white focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 ${
          currentMark !== MARKS.HALF ? 'hover:bg-gray-400 dark:hover:bg-gray-700' : ''
        } dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-blue-500`}
        onClick={onClick(MARKS.HALF)}
      >
        <svg
          className={`w-5 h-5 ${currentMark === MARKS.HALF ? 'text-yellow-300' : 'text-gray-800 dark:text-gray-200'}`}
          aria-hidden="true"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM56,96a8,8,0,0,1,8-8H80V72a8,8,0,0,1,16,0V88h16a8,8,0,0,1,0,16H96v16a8,8,0,0,1-16,0V104H64A8,8,0,0,1,56,96Zm24,96a8,8,0,0,1-5.66-13.66l96-96a8,8,0,0,1,11.32,11.32l-96,96A8,8,0,0,1,80,192Zm112-8H144a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Z" />
        </svg>
      </button>
      <button
        type="button"
        className={`inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-white border-l border-gray-200 rounded-e-lg ${
          currentMark !== MARKS.RIGHT ? 'hover:bg-gray-400 dark:hover:bg-gray-700' : ''
        } focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-blue-500`}
        onClick={onClick(MARKS.RIGHT)}
      >
        <svg
          className={`w-5 h-5 ${currentMark === MARKS.RIGHT ? 'text-green-500' : 'text-gray-800 dark:text-gray-200'}`}
          aria-hidden="true"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 448 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
        </svg>
      </button>
    </div>
  );
}

export default memo(AssessmentBar);
