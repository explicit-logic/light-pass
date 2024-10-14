import type { Correction } from '@/models/Correction';

import { memo } from 'react';
import AssessmentBar from './AssessmentBar';

// Hooks
import { useQuestionBlock } from '../hooks/useQuestionBlock';

type Props = {
  block: QuestionBlock;
  currentSlug: string | null;
  correction?: Correction;
};
function QuestionBlock({ correction, currentSlug, block }: Props) {
  const component = useQuestionBlock({ block, correction });

  if (!component) return;

  return (
    <div className="flex flex-row justify-between">
      {component}
      <div>
        <AssessmentBar block={block} correction={correction} currentSlug={currentSlug} />
      </div>
    </div>
  );
}

export default memo(QuestionBlock);
