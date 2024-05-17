import { read } from '@/api/configuration';
import type { LoaderFunction } from 'react-router-dom';

import QuizConfigurationForm from '@/components/organisms/QuizConfigurationForm';

export const loader: LoaderFunction = async ({ params }) => {
  const { quizId } = params as unknown as { quizId: string };
  const configuration = await read(Number(quizId));

  return { configuration };
};

export function Component() {
  return (
    <>
      <QuizConfigurationForm />
    </>
  );
}
