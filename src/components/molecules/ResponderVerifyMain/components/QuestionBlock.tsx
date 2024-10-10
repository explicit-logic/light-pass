import { memo } from 'react';
import AssessmentBar from './AssessmentBar';

// Hooks
import { useBlockRender } from '../hooks/useBlockRender';

type Props = {
  block: Block;
};
function QuestionBlock({ block }: Props) {
  const component = useBlockRender({ block });

  if (!component) return;

  return (
    <div className="flex flex-row justify-between">
      {component}
      <div>
        <AssessmentBar />
      </div>
    </div>
  );
}

export default memo(QuestionBlock);
