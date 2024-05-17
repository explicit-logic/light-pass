import { invoke } from '@tauri-apps/api';
import { TauriEvent, type UnlistenFn, listen } from '@tauri-apps/api/event';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useParams, useRevalidator, useRouteLoaderData } from 'react-router-dom';

import { DEFAULT_LANGUAGE, languages } from '@/constants/languages';
import type { Locale } from '@/models/Locale';
import type { Quiz } from '@/models/Quiz';

import InfoCard from '@/components/atoms/InfoCard';

const getLabel = (key: Locale['language']) => languages[key];

let didInit = false;
function LocaleItem() {
  const { quizId, language = DEFAULT_LANGUAGE } = useParams() as { quizId: string; language: keyof typeof languages };
  const { locale } = useRouteLoaderData('locale-edit') as { locale: Locale; quiz: Quiz };
  const revalidator = useRevalidator();

  useEffect(() => {
    let unlisten: UnlistenFn;
    if (didInit) return;
    didInit = true;
    const listener = async () => {
      unlisten = await listen<string>(TauriEvent.WINDOW_DESTROYED, (event) => {
        if (event.windowLabel === 'builder') {
          revalidator.revalidate();
        }
      });
    };
    listener();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, [revalidator]);

  const items = useMemo(
    () => [
      {
        id: 1,
        label: 'Language',
        value: getLabel(language),
      },
      {
        id: 2,
        label: 'Question Count',
        value: locale.questionCount || '-',
      },
      {
        id: 3,
        label: 'Page Count',
        value: locale.pageCount || '-',
      },
    ],
    [language, locale.questionCount, locale.pageCount],
  );

  const openBuilder = useCallback(async () => {
    await invoke('open_builder', { quizId: Number(quizId), language });
  }, [quizId, language]);

  return (
    <div className="mt-6 w-full">
      <InfoCard items={items} />
      <div className="flex flex-row justify-center m-auto max-w-lg mt-4">
        <button
          type="button"
          className="text-center inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          onClick={openBuilder}
        >
          <svg
            className="w-5 h-5 me-2 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
              clipRule="evenodd"
            />
          </svg>
          {locale.questionCount ? 'Edit' : 'Add'} Questions
        </button>

        <button
          type="button"
          className="inline-flex items-center text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          disabled
          // onClick={openBuilder}
        >
          <svg
            className="w-3.5 h-3.5 me-2 text-gray-800 dark:text-white"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Edit</title>
            <path d="M224 96l16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zM80 160l26.66-53.33L160 80l-53.34-26.67L80 0 53.34 53.33 0 80l53.34 26.67L80 160zm352 128l-26.66 53.33L352 368l53.34 26.67L432 448l26.66-53.33L512 368l-53.34-26.67L432 288zm70.62-193.77L417.77 9.38C411.53 3.12 403.34 0 395.15 0c-8.19 0-16.38 3.12-22.63 9.38L9.38 372.52c-12.5 12.5-12.5 32.76 0 45.25l84.85 84.85c6.25 6.25 14.44 9.37 22.62 9.37 8.19 0 16.38-3.12 22.63-9.37l363.14-363.15c12.5-12.48 12.5-32.75 0-45.24zM359.45 203.46l-50.91-50.91 86.6-86.6 50.91 50.91-86.6 86.6z" />
          </svg>
          AI Assistant
        </button>
      </div>
    </div>
  );
}

export default memo(LocaleItem);
