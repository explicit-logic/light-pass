import type { Quiz } from '@/models/Quiz';
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
    <div className="flex justify-end gap-2 text-right pr-2">
      <Link to={to} className="group font-medium text-blue-600 dark:text-blue-500 hover:underline">
        <svg
          className="w-4 h-4 text-gray-800 dark:text-gray-100"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
          />
        </svg>
        <span className="group-hover:visible group-hover:opacity-100 invisible transition-opacity duration-500 inline-block opacity-0 px-2 py-1 -mt-12 -ml-7 text-xs font-body text-white rounded-lg shadow-sm bg-gray-900 dark:bg-gray-700 absolute text-center z-50">
          Edit
        </span>
      </Link>
    </div>
  );
}

export default ActionCell;
