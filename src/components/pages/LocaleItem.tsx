import { type LoaderFunction, useLoaderData, useParams } from 'react-router-dom';

import { type Locale, getOne as getOneLocale } from '@/api/locales';
import { type Quiz, getOne as getOneQuiz } from '@/api/quizzes';

import HeaderLocale from '@/components/atoms/HeaderLocale';
import Header from '@/components/molecules/Header';
import LocaleItem from '@/components/molecules/LocaleItem';

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
      <Header right={<HeaderLocale>{language}</HeaderLocale>} title={quiz.name} />
      <main className="flex flex-col items-center justify-center">
        <LocaleItem />
      </main>
    </>
  );
}
