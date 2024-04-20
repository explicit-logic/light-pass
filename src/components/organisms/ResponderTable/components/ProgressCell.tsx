import type { Row } from '@tanstack/react-table';

type Props = {
  row: Row<ResponderInterface>;
};

function ProgressCell(props: Props) {
  const { row } = props;
  const { original } = row;

  if (!original.identified) {
    return <div className="animate-pulse w-[50px] h-[28px] bg-gray-200 rounded-md dark:bg-gray-700" role="status" />;
  }

  return `${original.progress} / 10`;
}

export default ProgressCell;
