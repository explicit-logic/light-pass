import type { languages } from '@/constants/languages';
import type Peer from 'peerjs';

import { Suspense } from 'react';
import { Await, type LoaderFunction, defer, redirect, useLoaderData, useParams } from 'react-router-dom';

// Lib
import { getOne as getOneLocale } from '@/api/locales';
import { type Quiz, getOne as getOneQuiz } from '@/api/quizzes';
import { connect } from '@/lib/peer/connect';
import { getContext } from '@/lib/peer/store';

import HeaderLocale from '@/components/atoms/HeaderLocale';
import Header from '@/components/molecules/Header';
import { ConnectContainer, ConnectError, ConnectSkeleton } from '@/components/organisms/Connect';

export const loader: LoaderFunction = async ({ params }) => {
  const { quizId: _quizId, language } = params as unknown as { quizId: string; language: keyof typeof languages };
  const quizId = Number(_quizId);
  const context = getContext();

  if (context && (context.quizId !== quizId || context.language !== language)) {
    return redirect('/quizzes');
  }

  const [locale, quiz] = await Promise.all([getOneLocale(quizId, language), getOneQuiz(quizId)]);

  return defer({
    locale,
    quiz,
    peer: connect({ quizId, language }),
  });
};

function QuizJoin() {
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

export default QuizJoin;
