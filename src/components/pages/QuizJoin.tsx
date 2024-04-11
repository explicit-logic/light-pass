import type Peer from 'peerjs';

import { Suspense } from 'react';
import { Await, defer, useLoaderData, useParams } from 'react-router-dom';

// Lib
import { connect } from '@/lib/peer/connect';

import HeaderLocale from '@/components/atoms/HeaderLocale';
import Header from '@/components/molecules/Header';
import { ConnectContainer, ConnectError, ConnectSkeleton } from '@/components/organisms/Connect';

export async function loader() {
  return defer({
    peer: connect({
      onMessage: (clientId, message) => {
        console.info('Message', clientId, message);
      },
      onClose: (clientId) => {
        console.info('Student disconnected:', clientId);
      },
      onError: (clientId, error) => {
        console.error(clientId, error);
      },
    }),
  });
}

function QuizJoin() {
  const { locale } = useParams();
  const { peer } = useLoaderData() as { peer: Peer };

  return (
    <>
      <Header right={<HeaderLocale>{locale}</HeaderLocale>} title="Next.js Quiz" />
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
