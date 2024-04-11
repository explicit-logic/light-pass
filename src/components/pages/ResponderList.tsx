import { Link, useParams } from 'react-router-dom';

import HeaderLocale from '@/components/atoms/HeaderLocale';
// Components
import BroadcastForm from '@/components/molecules/BroadcastForm';
import Header from '@/components/molecules/Header';
import ResponderTable from '@/components/organisms/ResponderTable';

function ResponderList() {
  const { quizId, locale } = useParams();

  return (
    <>
      <Header right={<HeaderLocale>{locale}</HeaderLocale>} title="Next.js Quiz" />
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
