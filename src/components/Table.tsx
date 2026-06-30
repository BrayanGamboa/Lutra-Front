import type { Key, ReactNode } from 'react';

import { cn } from '@/components/ui/cn';
import { OtterMascot } from '@/components/OtterMascot';

export interface TableColumn<T> {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (row: T) => Key;
  emptyMessage?: string;
  className?: string;
  showOtterOnEmpty?: boolean;
}

export const Table = <T,>({
  className,
  columns,
  data,
  emptyMessage = 'No hay datos para mostrar.',
  rowKey,
  showOtterOnEmpty = true,
}: TableProps<T>): JSX.Element => (
  <div className={cn('overflow-hidden rounded-2xl border border-slate-200 bg-white', className)}>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500',
                  column.headerClassName,
                )}
                scope="col"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={rowKey(row)} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn('px-4 py-3 text-sm text-slate-700', column.cellClassName)}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center" colSpan={columns.length}>
                {showOtterOnEmpty ? (
                  <OtterMascot variant="empty" message={emptyMessage} size="md" />
                ) : (
                  <p className="px-4 py-10 text-sm text-slate-500">{emptyMessage}</p>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
