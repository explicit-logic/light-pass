// Components
import MultipleChoice from '../questionComponents/MultipleChoice';
import MultipleResponse from '../questionComponents/MultipleResponse';
import ShortAnswer from '../questionComponents/ShortAnswer';

// Constants
import { TYPES } from '@/constants/block';

type Props = {
  block: Block;
};

export function useBlockRender(props: Props) {
  const { block } = props;

  if (block.type === TYPES.INPUT) {
    return <ShortAnswer block={block} />;
  }

  if (block.type === TYPES.RADIO_GROUP) {
    return <MultipleChoice block={block} />;
  }

  if (block.type === TYPES.CHECKBOX_GROUP) {
    return <MultipleResponse block={block} />;
  }

  return null;
}
