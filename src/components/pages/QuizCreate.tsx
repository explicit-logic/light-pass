import Header from '@/components/molecules/Header';

import { QuizCreateForm } from '@/components/organisms/QuizForm';

function QuizCreate() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-between pt-8">
        <QuizCreateForm />
      </main>
    </>
  );
}

export default QuizCreate;
