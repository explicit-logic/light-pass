import type { LanguageType } from '@/constants/languages';
import type { Quiz } from '@/models/Quiz';
import type Peer from 'peerjs';

import { Suspense } from 'react';
import { Await, type LoaderFunction, defer, redirect, useLoaderData, useParams } from 'react-router-dom';

// Lib
import { getOne as getOneLocale } from '@/api/locales';
import { getOne as getOneQuiz } from '@/api/quizzes';
import { connect } from '@/lib/peer/connect';

import HeaderLocale from '@/components/atoms/HeaderLocale';
import Header from '@/components/molecules/Header';
import { ConnectContainer, ConnectError, ConnectSkeleton } from '@/components/organisms/Connect';

export const loader: LoaderFunction = async ({ params }) => {
  const { quizId: _quizId, language } = params as unknown as { quizId: string; language: LanguageType };
  const quizId = Number(_quizId);

  const [locale, quiz] = await Promise.all([getOneLocale(quizId, language), getOneQuiz(quizId)]);

  return defer({
    locale,
    quiz,
    peer: connect(),
  });
};

export function Component() {
  const { language } = useParams();
  const { quiz, peer } = useLoaderData() as { quiz: Quiz; peer: Peer };

  return (
    <>
      <Header right={<HeaderLocale>{language}</HeaderLocale>} title={quiz.name} />
      <main className="flex flex-col items-center justify-between">
        <Suspense fallback={<ConnectSkeleton />}>
          <Await resolve={peer} errorElement={<ConnectError />}>
            <ConnectContainer />
          </Await>
        </Suspense>
      </main>
    </>
  );
}
