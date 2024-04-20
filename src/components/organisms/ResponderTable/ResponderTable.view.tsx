import { type Row, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { memo } from 'react';

import ActionCell from './components/ActionCell';
import DurationCell from './components/DurationCell';
import IdentityCell from './components/IdentityCell';
import ProgressCell from './components/ProgressCell';
import StatusCell from './components/StatusCell';

const columns = [
  {
    id: 'identity',
    header: 'Name',
    cell: IdentityCell,
  },
  {
    id: 'progress',
    header: 'Progress',
    cell: ProgressCell,
  },
  {
    id: 'duration',
    header: 'Time',
    cell: DurationCell,
  },
  {
    id: 'status',
    header: 'Status',
    cell: StatusCell,
  },
  {
    id: 'action',
    header: 'Action',
    cell: ActionCell,
  },
];

function ResponderTableView(props: { responders: ResponderInterface[] }) {
  const { responders } = props;
  const table = useReactTable({
    data: responders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} scope="col" className="px-6 py-3">
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
                <td key={cell.id} className="px-6 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default memo(ResponderTableView);
