import type { Row } from '@tanstack/react-table';

// Models
import type { Responder } from '@/models/Responder';

type Props = {
  row: Row<Responder>;
};

function ProgressCell({ row }: Props) {
  const { original } = row;
  const { context, identified, progress } = original;
  const total = context?.slugs?.length || 0;

  if (!identified) {
    return <div className="animate-pulse w-[50px] h-[28px] bg-gray-200 rounded-md dark:bg-gray-700" role="status" />;
  }

  return `${progress} / ${total}`;
}

export default ProgressCell;
