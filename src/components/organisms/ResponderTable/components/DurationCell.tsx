import TimeAgo from '@/components/atoms/TimeAgo';
import type { Row } from '@tanstack/react-table';

import { getDuration } from '@/helpers/getDuration';

type Props = {
  row: Row<ResponderInterface>;
};

function DurationCell({ row }: Props) {
  const { original } = row;
  const { completed, identified, startAt, finishAt } = original;

  if (completed) {
    if (startAt && finishAt) {
      return <time>{getDuration(startAt.valueOf(), finishAt.valueOf())}</time>;
    }

    return '--:--';
  }

  if (!identified) {
    return <div className="animate-pulse w-[50px] h-[28px] bg-gray-200 rounded-md dark:bg-gray-700" role="status" />;
  }

  if (startAt) {
    return <TimeAgo date={startAt} />;
  }
}

export default DurationCell;
