import type { Row } from '@tanstack/react-table';

// Constants
import { STATES, type StateType } from '@/constants/connection';

// Models
import type { Responder } from '@/models/Responder';

const showIcon = (online: boolean) => {
  if (online) {
    return (
      <span className="flex relative h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
      </span>
    );
  }

  return <span className="rounded-full h-2 w-2 bg-gray-500" />;
};

type Props = {
  clientState: Record<string, StateType>;
  row: Row<Responder>;
};

function ProgressCell({ clientState, row }: Props) {
  const { original } = row;
  const { clientId, context, identified, progress } = original;
  const total = context?.slugs?.length || 0;
  const online = clientState[clientId] === STATES.ONLINE;
  const progressText = progress ? `${progress} / ${total}` : '- / -';

  if (!identified) {
    return <div className="animate-pulse w-[50px] h-[28px] bg-gray-200 rounded-md dark:bg-gray-700" role="status" />;
  }

  return (
    <div className="flex space-x-2 items-center text-xs">
      {showIcon(online)}
      <span>{progressText}</span>
    </div>
  );
}

export default ProgressCell;
