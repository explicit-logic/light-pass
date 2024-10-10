import { memo, useCallback } from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';

// Components
import SideBarItem from './components/SideBarItem';

const getPageName = (idx: number) => `Page ${idx + 1}`;

type Props = {
  changePage: (slug: string) => () => void;
  currentSlug?: string | null;
};

function ResponderVerifySidebar({ currentSlug, changePage }: Props) {
  const { slugs } = useLoaderData() as { slugs: string[] };

  return (
    <aside className="sticky sm:top-32 sm:h-[calc(100vh-theme(spacing.52))] sm:w-60 sm:overflow-y-auto w-full px-2 py-3 bg-white dark:bg-gray-800">
      <ul className="space-y-2 font-medium">
        {slugs.map((slug, idx) => (
          <SideBarItem key={slug} active={currentSlug === slug} name={getPageName(idx)} onClick={changePage(slug)} />
        ))}
      </ul>
    </aside>
  );
}

export default memo(ResponderVerifySidebar);
