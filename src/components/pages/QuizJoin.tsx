import { useParams } from 'react-router-dom';

import HeaderLocale from '@/components/atoms/HeaderLocale';
import Header from '@/components/molecules/Header';
import Connect from '@/components/organisms/Connect';

function QuizJoin() {
  const { locale } = useParams();

  return (
    <>
      <Header right={<HeaderLocale>{locale}</HeaderLocale>}>Next.js Quiz</Header>
      <main className="flex flex-col items-center justify-between">
        <Connect />
      </main>
    </>
  );
}

export default QuizJoin;
