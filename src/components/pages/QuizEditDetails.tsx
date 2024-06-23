import { read } from '@/api/configuration';
import { QuizEditForm } from '@/components/organisms/QuizForm';
import type { LoaderFunction } from 'react-router-dom';

export const loader: LoaderFunction = async ({ params }) => {
  const { quizId } = params as unknown as { quizId: string };
  const configuration = await read(Number(quizId));

  return { configuration };
};

export function Component() {
  return (
    <>
      <QuizEditForm />
    </>
  );
}
