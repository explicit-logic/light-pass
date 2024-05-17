import { type Messages, read } from '@/api/messages';
import { TauriEvent, type UnlistenFn, listen } from '@tauri-apps/api/event';
import { useEffect, useMemo } from 'react';
import { type LoaderFunction, useLoaderData, useRevalidator, useRouteLoaderData } from 'react-router-dom';

import { getValue } from '@/helpers/getValue';

import type { Locale } from '@/models/Locale';
import type { Quiz } from '@/models/Quiz';

import InfoCard from '@/components/atoms/InfoCard';
import CreateButton from './components/CreateButton';
import OpenEditorButton from './components/OpenEditorButton';

export const loader: LoaderFunction = async ({ params }) => {
  const { quizId, language } = params as unknown as { quizId: string; language: Locale['language'] };
  const messages = await read(Number(quizId), language);

  return { messages };
};

let didInit = false;

export function Component() {
  const { quiz, locale } = useRouteLoaderData('locale-edit') as { locale: Locale; quiz: Quiz };
  const { messages } = useLoaderData() as { messages: Messages };
  const quizId = quiz.id;
  const { language } = locale;
  const revalidator = useRevalidator();

  useEffect(() => {
    let unlisten: UnlistenFn;
    if (didInit) return;
    didInit = true;
    const listener = async () => {
      unlisten = await listen<string>(TauriEvent.WINDOW_DESTROYED, (event) => {
        if (event.windowLabel === 'editor') {
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
        label: 'Application Name',
        value: getValue<string>(messages, 'Metadata.applicationName'),
      },
      {
        id: 2,
        label: 'Keywords',
        value: getValue<string>(messages, 'Metadata.keywords'),
      },
      {
        id: 3,
        label: 'Description',
        value: getValue<string>(messages, 'Metadata.description'),
      },
      {
        id: 4,
        label: 'Creator',
        value: getValue<string>(messages, 'Metadata.creator'),
      },
    ],
    [messages],
  );

  return (
    <>
      <div className="mt-6 w-full">
        {messages && <InfoCard items={items} />}
        <div className="m-auto max-w-lg mt-1">
          {messages ? <OpenEditorButton quizId={quizId} language={language} /> : <CreateButton quiz={quiz} language={language} />}
        </div>
      </div>
    </>
  );
}
