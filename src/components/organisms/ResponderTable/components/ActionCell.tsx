import { useCallback } from 'react';

import type { Row } from '@tanstack/react-table';

// Models
import type { Responder } from '@/models/Responder';

type Props = {
  remove: (responder: Responder) => void;
  row: Row<Responder>;
};

function ActionCell(props: Props) {
  const { remove, row } = props;
  const { original } = row;
  const { id } = original;

  const onRemove = useCallback(() => remove(original), [original, remove]);

  return (
    <div className="flex justify-end gap-2 text-right pr-2">
      <button type="button" className="group">
        <svg
          className="w-4 h-4 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
            clipRule="evenodd"
          />
        </svg>

        <span className="group-hover:visible group-hover:opacity-100 invisible transition-opacity duration-500 inline-block opacity-0 px-2 py-1 -mt-12 -ml-6 text-xs font-body text-white rounded-lg shadow-sm bg-gray-900 dark:bg-gray-700 absolute text-center z-50">
          Verify
        </span>
      </button>

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
