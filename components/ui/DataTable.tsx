import { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;          // aplicado a th y td
  hideBelow?: 'md' | 'lg';    // responsive hiding
  align?: 'left' | 'right' | 'center';
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  rowClassName?: (row: T) => string;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'Sin resultados',
  rowClassName,
  onRowClick,
}: Props<T>) {
  const hideClass = (col: Column<T>) => {
    if (col.hideBelow === 'md') return 'hidden md:table-cell';
    if (col.hideBelow === 'lg') return 'hidden lg:table-cell';
    return '';
  };

  const alignClass = (align?: string) => {
    if (align === 'right')  return 'text-right';
    if (align === 'center') return 'text-center';
    return 'text-left';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={[
                  'px-4 py-3 font-medium text-gray-600',
                  hideClass(col),
                  alignClass(col.align),
                  col.className ?? '',
                ].join(' ')}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-10 text-gray-400 text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(row => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={[
                  'hover:bg-gray-50 transition-colors',
                  onRowClick ? 'cursor-pointer' : '',
                  rowClassName?.(row) ?? '',
                ].join(' ')}
              >
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={[
                      'px-4 py-3',
                      hideClass(col),
                      alignClass(col.align),
                      col.className ?? '',
                    ].join(' ')}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}