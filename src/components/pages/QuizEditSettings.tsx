import { invoke } from '@tauri-apps/api';
import { TauriEvent, type UnlistenFn, listen } from '@tauri-apps/api/event';
import { useCallback, useEffect } from 'react';
import { useParams, useRouteLoaderData } from 'react-router-dom';

import { toast } from '@/lib/toaster';

import type { Locale } from '@/models/Locale';
import EditIcon from '../atoms/EditIcon';

import QuizSettingsForm from '@/components/organisms/QuizForm/QuizSettingsForm';

let didInit = false;

export function Component() {
  const { quizId } = useParams() as { quizId: string };
  const { locales } = useRouteLoaderData('quiz-edit') as { locales: Locale[] };
  const mainLocale = locales.find(({ main }) => main);

  useEffect(() => {
    let unlisten: UnlistenFn;
    if (didInit) return;
    didInit = true;
    const listener = async () => {
      unlisten = await listen<string>(TauriEvent.WINDOW_DESTROYED, (event) => {
        if (event.windowLabel === 'editor') {
          toast.success('Texts updated');
        }
      });
    };
    listener();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  const openEditor = useCallback(async () => {
    await invoke('open_editor', { quizId: Number(quizId), language: mainLocale?.language });
  }, [quizId, mainLocale?.language]);

  return (
    <div>
      <div className="mb-4 space-y-3 text-gray-500 dark:text-gray-400">
        <p>Your website texts: Headers, Buttons, SEO, etc.</p>
        <p>
          <button
            type="button"
            className="text-center inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={openEditor}
          >
            <EditIcon className="w-5 h-5 me-2 text-gray-800 dark:text-white" />
            Edit
          </button>
        </p>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
      </div>
      <QuizSettingsForm />
    </div>
  );
}
