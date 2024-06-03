import { open } from '@tauri-apps/api/shell';
import { memo, useCallback } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import { languages } from '@/constants/languages';

import type { Locale } from '@/models/Locale';
import type { Quiz } from '@/models/Quiz';

function WebsiteList({ running }: { running: boolean }) {
  const { locales, quiz } = useRouteLoaderData('quiz-edit') as { locales: Locale[]; quiz: Quiz };

  const openLink = useCallback(async (url: string) => {
    await open(url);
  }, []);

  if (running || !quiz.deployed) return;

  return (
    <div className="text-left px-3 space-y-2 text-sm">
      {locales.map(({ url, language }) => (
        <div key={language}>
          <p className="text-xs text-gray-400">{languages[language]}</p>
          <p>
            <button type="button" className="underline text-white" onClick={() => openLink(url)}>
              {url}
            </button>
          </p>
        </div>
      ))}
    </div>
  );
}

export default memo(WebsiteList);
