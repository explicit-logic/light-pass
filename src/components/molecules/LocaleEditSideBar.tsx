import { memo } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import type { Locale } from '@/models/Locale';

import SideBarLink from '@/components/atoms/SideBarLink';

function LocaleEditSideBar() {
  const { locale } = useRouteLoaderData('locale-edit') as { locale: Locale };

  return (
    <aside className="fixed left-0 w-64 h-screen pt-10 pl-10 transition-transform -translate-x-full md:translate-x-0">
      <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <SideBarLink to="" title="Questions" caption="" completed={locale.questionCompleted}>
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

        <SideBarLink to="text" title="Text" caption="" completed={locale.textCompleted}>
          <svg
            className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <title>Text</title>
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5" />
          </svg>
        </SideBarLink>
      </ol>
    </aside>
  );
}

export default memo(LocaleEditSideBar);
