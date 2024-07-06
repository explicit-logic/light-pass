import { invoke } from '@tauri-apps/api';
import { TauriEvent, type UnlistenFn, listen } from '@tauri-apps/api/event';
import { useCallback, useEffect } from 'react';
import { useRevalidator, useRouteLoaderData } from 'react-router-dom';

import type { Locale } from '@/models/Locale';
import BuilderGuide from './components/BuilderGuide';

let didInit = false;
export function Component() {
  const { locales } = useRouteLoaderData('quiz-edit') as { locales: Locale[] };
  const revalidator = useRevalidator();

  const locale = locales.find(({ main }) => main) as Locale;
  const { quizId, language } = locale;

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

  const openBuilder = useCallback(async () => {
    await invoke('open_builder', { quizId, language });
  }, [quizId, language]);

  return (
    <>
      <div className="w-full border border-gray-200 rounded-lg dark:border-gray-700">
        <BuilderGuide />
        <div className="columns-2 px-2 py-1 rounded-b-lg bg-gray-100 dark:bg-gray-800">
          <div className="">
            <button
              type="button"
              className="text-center inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
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
          </div>
          {locale.questionCount > 0 && (
            <div className="flex justify-end w-full">
              <div className="flex flex-col text-xs bg-gray-100 border border-gray-500 py-1 px-2 rounded-md dark:text-gray-200 dark:bg-gray-800">
                <p>
                  <span className="font-semibold">{locale.questionCount}</span> {locale.questionCount > 1 ? 'questions' : 'question'}
                </p>
                <p>
                  <span className="font-semibold">{locale.pageCount}</span> {locale.pageCount > 1 ? 'pages' : 'page'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
