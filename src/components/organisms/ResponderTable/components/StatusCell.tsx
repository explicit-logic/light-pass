import type { Row } from '@tanstack/react-table';
import Flasher from './Flasher';

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
        <Flasher state={original.state} />
        <div className="capitalize font-normal text-gray-500 text-xs cursor-default" title={original.userAgent}>
          {platformToText(original.platform)}
        </div>
      </div>
    </div>
  );
}

export default StatusCell;
