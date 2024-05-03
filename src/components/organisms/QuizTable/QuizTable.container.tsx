import { type Quiz, getMany } from '@/api/quizzes';
import { useEffect, useState } from 'react';

import QuizTableView from './QuizTable.view';

function QuizTableContainer() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const getData = async () => {
      const data = await getMany();
      setQuizzes(data);
    };

    getData();
  }, []);

  return <QuizTableView quizzes={quizzes} />;
}

export default QuizTableContainer;
