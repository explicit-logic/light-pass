import type { Quiz } from '@/models/Quiz';

import { memo } from 'react';

import ActionCell from './components/ActionCell';
import LanguageCell from './components/LanguageCell';
import NameCell from './components/NameCell';

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

const columnHelper = createColumnHelper<Quiz>();

const columns = [
  columnHelper.accessor('mainLanguage', {
    header: '',
    cell: LanguageCell,
    size: 50,
  }),
  columnHelper.accessor('name', {
    header: 'Quiz',
    cell: NameCell,
  }),
  columnHelper.display({
    id: 'actions',
    cell: ActionCell,
    size: 100,
  }),
];

function QuizTableView(props: { quizzes: Quiz[] }) {
  const { quizzes } = props;
  const table = useReactTable({
    data: quizzes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: 0,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
  });

  return (
    <div className="mt-4 px-4">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-3 py-3"
                    style={{ width: header.getSize() === Number.MAX_SAFE_INTEGER ? 'auto' : header.getSize() }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-2 py-4"
                    style={{ width: cell.column.getSize() === Number.MAX_SAFE_INTEGER ? 'auto' : cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(QuizTableView);
