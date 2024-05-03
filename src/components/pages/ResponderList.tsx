import { type LoaderFunction, useLoaderData, useParams } from 'react-router-dom';

import { type Quiz, getOne } from '@/api/quizzes';

// Components
import HeaderLocale from '@/components/atoms/HeaderLocale';
import BroadcastForm from '@/components/molecules/BroadcastForm';
import Header from '@/components/molecules/Header';
import ResponderTable from '@/components/organisms/ResponderTable';

export const loader: LoaderFunction = async ({ params }) => {
  const { quizId } = params as unknown as { quizId: string };

  const quiz = await getOne(Number(quizId));

  return { quiz };
};

function ResponderList() {
  const { quizId, language } = useParams();
  const { quiz } = useLoaderData() as { quiz: Quiz };

  return (
    <>
      <Header right={<HeaderLocale>{language}</HeaderLocale>} title={quiz.name} />
      <main className="flex flex-col">
        <div className="mt-4">
          <div className="mb-4 px-4">
            <h2 className="text-xl leading-7 text-gray-900 sm:truncate sm:tracking-tight dark:text-white">Responders</h2>
          </div>
          <BroadcastForm />
          <ResponderTable />
        </div>
      </main>
    </>
  );
}

export default ResponderList;
