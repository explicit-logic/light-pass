import { type LoaderFunction, Outlet, useLoaderData, useParams } from 'react-router-dom';

import { getOne as getOneLocale } from '@/api/locales';
import { getOne as getOneQuiz } from '@/api/quizzes';
import type { Locale } from '@/models/Locale';
import type { Quiz } from '@/models/Quiz';

import HeaderLocale from '@/components/atoms/HeaderLocale';
import Header from '@/components/molecules/Header';
import LocaleEditSideBar from '@/components/molecules/LocaleEditSideBar';

export const loader: LoaderFunction = async ({ params }) => {
  const { quizId, language } = params as unknown as { quizId: string; language: Locale['language'] };
  const locale = await getOneLocale(Number(quizId), language);
  const quiz = await getOneQuiz(Number(quizId));

  return { locale, quiz };
};

export function Component() {
  const { language } = useParams();
  const { quiz } = useLoaderData() as { quiz: Quiz };

  return (
    <>
      <Header right={<HeaderLocale>{language}</HeaderLocale>} title={quiz.name} goBackLink={`/quizzes/${quiz.id}/edit/locale`} />
      <LocaleEditSideBar />
      <main className="flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </>
  );
}
