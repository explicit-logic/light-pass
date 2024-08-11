import type { Row } from '@tanstack/react-table';

// Models
import type { Responder } from '@/models/Responder';

type Props = {
  row: Row<Responder>;
};

function MarkCell(props: Props) {
  const { row } = props;
  const { original } = row;

  const text = original.completed ? original.mark : '–';

  return <span>{text}</span>;
}

export default MarkCell;
