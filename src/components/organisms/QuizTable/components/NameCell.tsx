import type { Quiz } from '@/api/quizzes';
import type { Row } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

type Props = {
  row: Row<Quiz>;
};

function NameCell(props: Props) {
  const { row } = props;
  const { original } = row;
  const { id, localeCount, mainLanguage } = original;

  const to = localeCount > 1 ? `${id}/locales` : `${id}/locales/${mainLanguage}/join`;

  return (
    <div className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
      <Link to={to} className="hover:text-blue-500">
        {original.name}
      </Link>
    </div>
  );
}

export default NameCell;
