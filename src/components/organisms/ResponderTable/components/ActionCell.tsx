import type { Row } from '@tanstack/react-table';
import { useCallback } from 'react';

// Models
import type { Responder } from '@/models/Responder';

type Props = {
  remove: (responder: Responder) => void;
  row: Row<Responder>;
};

function ActionCell(props: Props) {
  const { remove, row } = props;
  const { original } = row;
  const onRemove = useCallback(() => remove(original), [original, remove]);

  return (
    <div className="flex justify-end gap-2 text-right pr-2">
      <button type="button" className="group" onClick={onRemove}>
        <svg
          className="w-4 h-4 text-gray-800 dark:text-rose-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M5 8a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm-2 9a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1Zm13-6a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-4Z"
            clipRule="evenodd"
          />
        </svg>

        <span className="group-hover:visible group-hover:opacity-100 invisible transition-opacity duration-500 inline-block opacity-0 px-2 py-1 -mt-12 -ml-8 text-xs font-medium text-white rounded-lg shadow-sm bg-gray-900 dark:bg-gray-700 absolute text-center z-50">
          Remove
        </span>
      </button>
    </div>
  );
}

export default ActionCell;
