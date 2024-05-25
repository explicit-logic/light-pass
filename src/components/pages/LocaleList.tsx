import { getOne } from '@/api/quizzes';
import type { Quiz } from '@/models/Quiz';
import { type LoaderFunction, useLoaderData } from 'react-router-dom';

import Header from '@/components/molecules/Header';
import LocaleList from '@/components/molecules/LocaleList';

export const loader: LoaderFunction = async ({ params }) => {
  const { quizId } = params as unknown as { quizId: string };

  return getOne(Number(quizId));
};

export function Component() {
  const quiz = useLoaderData() as Quiz;

  return (
    <>
      <Header title={quiz.name} />
      <main className="flex flex-col items-center justify-center">
        <LocaleList />
      </main>
    </>
  );
}
