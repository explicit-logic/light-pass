import { read } from '@/api/configuration';
import { getOne as getOneLocale } from '@/api/locales';
import { getOne as getOneQuiz } from '@/api/quizzes';
import { getMany as getManyResponders } from '@/api/responders';
import type { LanguageType } from '@/constants/languages';
import type { Quiz } from '@/models/Quiz';
import { type LoaderFunction, useLoaderData, useParams } from 'react-router-dom';

// Components
import HeaderLocale from '@/components/atoms/HeaderLocale';
import Header from '@/components/molecules/Header';
import SearchForm from '@/components/molecules/SearchForm';
import ConnectBar from '@/components/organisms/ConnectBar';
import NewResponder from '@/components/organisms/NewResponder';
import ResponderTable from '@/components/organisms/ResponderTable';

export const loader: LoaderFunction = async ({ request, params }) => {
  const { quizId, language } = params as unknown as { quizId: string; language: LanguageType };
  const url = new URL(request.url);
  const q = url.searchParams.get('q') ?? undefined;

  const [configuration, quiz, locale, responders] = await Promise.all([
    read(Number(quizId)),
    getOneQuiz(Number(quizId)),
    getOneLocale(Number(quizId), language),
    getManyResponders(Number(quizId), { q }),
  ]);

  return { configuration, quiz, locale, responders };
};

export function Component() {
  const { quizId, language } = useParams();
  const { quiz } = useLoaderData() as { quiz: Quiz };

  return (
    <>
      <Header right={<HeaderLocale>{language}</HeaderLocale>} title={quiz.name} />
      <main className="flex flex-col">
        <div className="mt-4">
          <div className="flex flex-wrap">
            <div className="sm:basis-1/2 mb-4 px-4 w-full">
              <div className="flex space-x-2 mb-4">
                <h2 className="inline-flex text-xl leading-7 text-gray-900 sm:truncate sm:tracking-tight dark:text-white">Responders</h2>
                <NewResponder />
              </div>
              <SearchForm />
            </div>
            <div className="sm:basis-1/2 w-full px-3.5">
              <div className="w-full flex justify-end mb-3">
                <ConnectBar />
              </div>
            </div>
          </div>
          <ResponderTable />
        </div>
      </main>
    </>
  );
}
