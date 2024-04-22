import TimeAgo from '@/components/atoms/TimeAgo';
import type { Row } from '@tanstack/react-table';

import { STATES } from '@/constants/connection';
import { getDuration } from '@/helpers/getDuration';

type Props = {
  row: Row<ResponderInterface>;
};

function DurationCell({ row }: Props) {
  const { original } = row;
  const { completed, identified, startAt, finishAt, state } = original;

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
    if (state === STATES.ONLINE) {
      return <TimeAgo date={startAt} />;
    }
    return (
      <div className="flex items-center text-gray-900 whitespace-nowrap dark:text-white">
        <div className="flex flex-col space-y-1">
          <div>{startAt.toLocaleTimeString()}</div>
          <div className="font-normal text-gray-500 text-xs">{startAt.toLocaleDateString()}</div>
        </div>
      </div>
    );
  }
}

export default DurationCell;
