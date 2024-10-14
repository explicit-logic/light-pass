import type { Correction } from '@/models/Correction';

// Components
import MultipleChoice from '../questionComponents/MultipleChoice';
import MultipleResponse from '../questionComponents/MultipleResponse';
import ShortAnswer from '../questionComponents/ShortAnswer';

// Constants
import { TYPES } from '@/constants/block';

export type Props = {
  block: QuestionBlock;
  correction?: Correction;
};

export function useQuestionBlock(props: Props) {
  const { block, correction } = props;

  if (block.type === TYPES.INPUT) {
    return <ShortAnswer block={block} />;
  }

  if (block.type === TYPES.RADIO_GROUP) {
    return <MultipleChoice block={block} correction={correction} />;
  }

  if (block.type === TYPES.CHECKBOX_GROUP) {
    return <MultipleResponse block={block} correction={correction} />;
  }

  return null;
}
