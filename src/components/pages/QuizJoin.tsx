import { Suspense } from 'react';
import { Await, defer, useLoaderData, useParams } from 'react-router-dom';

import HeaderLocale from '@/components/atoms/HeaderLocale';
import Header from '@/components/molecules/Header';
import { ConnectContainer, ConnectSkeleton } from '@/components/organisms/Connect';

async function getData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('hello');
    }, 3_000);
  });
}

export async function loader() {
  return defer({ data: getData() });
}

function QuizJoin() {
  const { locale } = useParams();
  const { data } = useLoaderData() as { data: string };

  return (
    <>
      <Header right={<HeaderLocale>{locale}</HeaderLocale>}>Next.js Quiz</Header>
      <main className="flex flex-col items-center justify-between">
        <Suspense fallback={<ConnectSkeleton />}>
          <Await resolve={data} errorElement={<p>Error!</p>}>
            <ConnectContainer />
          </Await>
        </Suspense>
      </main>
    </>
  );
}

export default QuizJoin;
