import type { Quiz } from '@/api/quizzes';
import type { Row } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

type Props = {
  row: Row<Quiz>;
};

function ActionCell(props: Props) {
  const { row } = props;
  const { original } = row;
  const { id } = original;

  const to = `${id}/edit`;

  return (
    <div className="text-right">
      <Link to={to} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
        Edit
      </Link>
    </div>
  );
}

export default ActionCell;
