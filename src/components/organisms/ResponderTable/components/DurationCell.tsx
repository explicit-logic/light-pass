import TimeAgo from '@/components/atoms/TimeAgo';
import type { Row } from '@tanstack/react-table';

// Constants
import { STATES, type StateType } from '@/constants/connection';
import { getDuration } from '@/helpers/getDuration';

// Models
import type { Responder } from '@/models/Responder';

type Props = {
  clientState: Record<string, StateType>;
  row: Row<Responder>;
};

function DurationCell({ clientState, row }: Props) {
  const { original } = row;
  const { clientId, completed, identified, startedAt, finishedAt } = original;
  const online = clientState[clientId] === STATES.ONLINE;

  if (completed) {
    if (startedAt && finishedAt) {
      return <time>{getDuration(startedAt.valueOf(), finishedAt.valueOf())}</time>;
    }

    return '--:--';
  }

  if (!identified) {
    return <div className="animate-pulse w-[50px] h-[28px] bg-gray-200 rounded-md dark:bg-gray-700" role="status" />;
  }

  if (startedAt) {
    if (online) {
      return <TimeAgo date={new Date(startedAt)} />;
    }
    return (
      <div className="flex items-center text-gray-900 whitespace-nowrap dark:text-white">
        <div className="flex flex-col space-y-1">
          <div>{new Date(startedAt).toLocaleTimeString()}</div>
          <div className="font-normal text-gray-500 text-xs">{new Date(startedAt).toLocaleDateString()}</div>
        </div>
      </div>
    );
  }
}

export default DurationCell;
