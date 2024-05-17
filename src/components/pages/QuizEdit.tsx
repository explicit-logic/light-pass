import { type Locale, getMany as getManyLocales } from '@/api/locales';
import { type Quiz, getOne as getOneQuiz } from '@/api/quizzes';
import { type LoaderFunction, useLoaderData } from 'react-router-dom';

import Header from '@/components/molecules/Header';

import { QuizEditForm } from '@/components/organisms/QuizForm';

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
      <main className="flex flex-col items-center justify-between pt-8">
        <QuizEditForm />
      </main>
    </>
  );
}
