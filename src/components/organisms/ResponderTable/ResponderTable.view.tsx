import { type Row, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { memo } from 'react';
import StatusCell from './components/StatusCell';

// const columnHelper = createColumnHelper<ResponderInterface>();

const columns = [
  {
    id: 'identity',
    header: 'Name',
    cell: ({ row }: { row: Row<ResponderInterface> }) => {
      const { original } = row;

      return (
        <div className="flex items-center text-gray-900 whitespace-nowrap dark:text-white">
          {/* <img className="w-10 h-10 rounded-full" src={`https://source.unsplash.com/40x40/?portrait&${original.id}`} alt="Jese" /> */}
          <div className="ps-3">
            <div className="text-base font-semibold">{original.name}</div>
            <div className="font-normal text-gray-500">{original.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    id: 'progress',
    header: 'Progress',
    cell: ({ row }: { row: Row<ResponderInterface> }) => {
      const { original } = row;
      const a = Math.round(Math.random() * 10);

      return `${a} / 10`;
    },
  },
  {
    id: 'time',
    header: 'Time',
    cell: () => {
      return `0:${Math.round(Math.random() * 60)}`;
    },
  },
  {
    id: 'status',
    header: 'Status',
    cell: StatusCell,
  },
  {
    id: 'action',
    header: 'Action',
    cell: () => {
      return (
        <a href="/#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
          Edit user
        </a>
      );
    },
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
                <td key={cell.id} className="px-6 py-4">
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
