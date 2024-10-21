import type { Page } from '../models/Page';

import { memo } from 'react';
import { useLoaderData } from 'react-router-dom';

// Components
import SideBarItem from './SideBarItem';

type Props = {
  changePage: (slug: string) => () => void;
};

function Sidebar({ changePage }: Props) {
  const { pages } = useLoaderData() as { pages: Page[] };

  return (
    <aside className="sticky sm:top-32 sm:h-[calc(100vh-theme(spacing.52))] sm:w-60 sm:overflow-y-auto w-full px-2 py-3 bg-white dark:bg-gray-800">
      <ul className="space-y-2 font-medium">
        {pages.map((page) => (
          <SideBarItem key={page.slug} page={page} onClick={changePage(page.slug)} />
        ))}
      </ul>
    </aside>
  );
}

export default memo(Sidebar);
