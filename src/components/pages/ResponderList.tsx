import { Link, useParams } from 'react-router-dom';

import HeaderLocale from '@/components/atoms/HeaderLocale';
// Components
import Header from '@/components/molecules/Header';
import ResponderTable from '@/components/organisms/ResponderTable';

function ResponderList() {
  const { quizId, locale } = useParams();

  return (
    <>
      <Header right={<HeaderLocale>{locale}</HeaderLocale>}>Next.js Quiz</Header>
      <main className="flex flex-col">
        <div className="mt-4">
          <ResponderTable />
        </div>
      </main>
    </>
  );
}

export default ResponderList;
