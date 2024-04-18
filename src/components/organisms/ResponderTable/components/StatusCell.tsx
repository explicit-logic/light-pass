import type { Row } from '@tanstack/react-table';

import { platformToText } from '@/helpers/platformToText';

type Props = {
  row: Row<ResponderInterface>;
};

function StatusCell(props: Props) {
  const { row } = props;
  const { original } = row;

  return (
    <div className="flex items-center text-gray-900 whitespace-nowrap dark:text-white">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2" />
          <span>Online</span>
        </div>
        <div className="capitalize font-normal text-gray-500 text-xs cursor-default" title={original.userAgent}>
          {platformToText(original.platform)}
        </div>
      </div>
    </div>
  );

  // <div className="flex items-center">
  //   <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2" /> Offline
  // </div>

  // <div className="flex items-center">
  //   <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2" /> Online
  // </div>
}

export default StatusCell;
