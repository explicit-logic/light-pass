import { invoke } from '@tauri-apps/api';
import { TauriEvent, type UnlistenFn, listen } from '@tauri-apps/api/event';
import { useCallback, useEffect } from 'react';
import { useRevalidator, useRouteLoaderData } from 'react-router-dom';

import type { Locale } from '@/models/Locale';
import BuilderGuide from './components/BuilderGuide';

import EditIcon from '@/components/atoms/EditIcon';

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
              <EditIcon className="w-5 h-5 me-2 text-gray-800 dark:text-white" />
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
