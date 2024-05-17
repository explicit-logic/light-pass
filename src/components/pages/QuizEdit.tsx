import { getMany as getManyLocales } from '@/api/locales';
import { getOne as getOneQuiz } from '@/api/quizzes';
import type { Quiz } from '@/models/Quiz';
import { type LoaderFunction, Outlet, useLoaderData } from 'react-router-dom';

import Header from '@/components/molecules/Header';
import QuizEditSideBar from '@/components/molecules/QuizEditSideBar';

export const loader: LoaderFunction = async ({ params }) => {
  const { quizId: _quizId } = params as unknown as { quizId: string };
  const quizId = Number(_quizId);
  const [quiz, locales] = await Promise.all([getOneQuiz(quizId), getManyLocales(quizId)]);

  return { locales, quiz };
};

export function Component() {
  const { quiz } = useLoaderData() as { quiz: Quiz };

  return (
    <>
      <Header title={quiz.name} />
      <QuizEditSideBar />
      <main className="p-4 md:ml-64 h-auto pt-8">
        <Outlet />
      </main>
    </>
  );
}
