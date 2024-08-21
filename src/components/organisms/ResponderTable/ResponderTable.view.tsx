import { type Row, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { memo, useCallback, useMemo, useState } from 'react';

// Components
import ActionCell from './components/ActionCell';
import DurationCell from './components/DurationCell';
import IdentityCell from './components/IdentityCell';
import MarkCell from './components/MarkCell';
import ProgressCell from './components/ProgressCell';
import StatusCell from './components/StatusCell';

import RemovalModal from '@/components/molecules/RemovalModal';

// Constants
import type { StateType } from '@/constants/connection';

// Models
import type { Responder } from '@/models/Responder';

type Props = {
  clientState: Record<string, StateType>;
  closeRemoveModal: () => void;
  onRemove: () => void;
  openRemoveModal: (responder: Responder) => void;
  responders: Responder[];
  responderToRemove?: Responder;
};

function ResponderTableView(props: Props) {
  const { clientState, closeRemoveModal, onRemove, openRemoveModal, responders, responderToRemove } = props;

  const removalMessage = `Are you sure you want to delete ${responderToRemove?.name || responderToRemove?.email || 'Unknown'}?`;

  const columns = useMemo(() => {
    return [
      {
        id: 'identity',
        header: 'Name',
        cell: IdentityCell,
      },
      {
        id: 'progress',
        header: 'Progress',
        cell: ({ row }) => {
          return <ProgressCell clientState={clientState} row={row} />;
        },
      },
      {
        id: 'duration',
        header: 'Time',
        cell: ({ row }) => {
          return <DurationCell clientState={clientState} row={row} />;
        },
      },
      // {
      //   id: 'status',
      //   header: 'Status',
      //   cell: StatusCell,
      // },
      {
        id: 'mark',
        header: 'Mark',
        cell: MarkCell,
      },
      {
        id: 'action',
        header: '',
        cell: ({ row }) => {
          return <ActionCell remove={openRemoveModal} row={row} />;
        },
      },
    ];
  }, [clientState, openRemoveModal]);

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

      <RemovalModal isOpen={Boolean(responderToRemove)} close={closeRemoveModal} message={removalMessage} onRemove={onRemove} />
    </>
  );
}

export default memo(ResponderTableView);
