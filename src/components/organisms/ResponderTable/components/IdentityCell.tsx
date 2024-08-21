import type { Row } from '@tanstack/react-table';

// Helpers
import { platformToText } from '@/helpers/platformToText';

// Models
import type { Responder } from '@/models/Responder';

type Props = {
  row: Row<Responder>;
};

function IdentityCell(props: Props) {
  const { row } = props;
  const { original } = row;
  const { email, identified, name, platform, connectedAt, userAgent } = original;

  if (!identified) {
    const platformText = platformToText(platform);
    const connectedAtDate = new Date(connectedAt);
    const timeText = connectedAtDate.toLocaleTimeString();
    const dateText = connectedAtDate.toLocaleDateString();

    return (
      <div className="flex flex-col space-y-2" role="status">
        <div className="animate-pulse inline-flex w-[150px] h-[20px] bg-gray-200 rounded-md dark:bg-gray-700" />
        <div className="font-normal text-xs">
          <time className="text-gray-400 dark:text-gray-300" title={dateText}>
            {timeText}
          </time>
          {' | '}
          <span title={userAgent}>{platformText}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center text-gray-900 whitespace-nowrap dark:text-white">
      {/* <img className="w-10 h-10 rounded-full" src={`https://source.unsplash.com/40x40/?portrait&${original.id}`} alt="Jese" /> */}
      <div className="ps-3">
        <div className="text-base font-semibold">{name}</div>
        <div className="font-normal text-gray-500">{email}</div>
      </div>
    </div>
  );
}

export default IdentityCell;
