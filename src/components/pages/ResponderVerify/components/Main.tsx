import type { Answer } from '@/models/Answer';
import type { Correction } from '@/models/Correction';

import { memo } from 'react';
import { useLoaderData } from 'react-router-dom';

// Components
import QuestionBlock from './QuestionBlock';

// Constants
import { QUESTION_TYPES } from '@/constants/block';

// Helpers
import { retrieveAnswer } from '@/helpers/retrieveAnswer';

type Props = {
  currentSlug: string | null;
};

function Main({ currentSlug }: Props) {
  const { answer, correctionsMap, pageData } = useLoaderData() as {
    answer: Answer;
    correctionsMap: Record<Correction['question'], Correction>;
    pageData: PageConfig;
  };
  const { formData } = pageData;

  return (
    <main className="w-full py-3 px-2 space-y-6">
      {formData.map(
        (block) =>
          block.type in QUESTION_TYPES && (
            <QuestionBlock
              key={(block as QuestionBlock).name}
              answer={retrieveAnswer(answer, (block as QuestionBlock).name)}
              block={block as QuestionBlock}
              correction={correctionsMap[(block as QuestionBlock).name]}
              currentSlug={currentSlug}
            />
          ),
      )}
    </main>
  );
}

export default memo(Main);
