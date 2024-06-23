import type { Quiz } from '@/models/Quiz';
import { memo } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import GlobeIcon from '@/components/atoms/GlobeIcon';
import SideBarLink from '@/components/atoms/SideBarLink';

function QuizEditSideBar() {
  const { quiz } = useRouteLoaderData('quiz-edit') as { quiz: Quiz };

  return (
    <aside className="fixed left-0 w-64 h-screen pt-10 pl-10 transition-transform -translate-x-full md:translate-x-0">
      <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <SideBarLink to="" title="Details" caption="Base information" completed={quiz.detailsCompleted}>
          <svg
            className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <title>Details</title>
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5" />
          </svg>
        </SideBarLink>
        <SideBarLink to="questions" title="Questions" caption="" completed={quiz.questionCompleted} disabled={!quiz.detailsCompleted}>
          <svg
            className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Questions</title>
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <path d="M10 10.3c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2" />
            <path d="M12 17h.01" />
          </svg>
        </SideBarLink>
        <SideBarLink to="locale" title="Locales" caption="">
          <svg
            className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Fork</title>
            <path
              fillRule="evenodd"
              d="M5 6a3 3 0 1 1 4 2.83V10a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V8.83a3.001 3.001 0 1 1 2 0V10a3 3 0 0 1-3 3h-1v2.17a3.001 3.001 0 1 1-2 0V13h-1a3 3 0 0 1-3-3V8.83A3.001 3.001 0 0 1 5 6Z"
              clipRule="evenodd"
            />
          </svg>
        </SideBarLink>
        <SideBarLink to="deployment" title="Create a Website" caption="" completed={quiz.deployed} disabled={!quiz.questionCompleted}>
          <GlobeIcon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
        </SideBarLink>
      </ol>
    </aside>
  );
}

export default memo(QuizEditSideBar);
