import { ReactNode } from "react";
import EmptyState from "./EmptyState";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
  hideBelow?: "md" | "lg";
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  rowClassName?: (row: T) => string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
}

const alignClass = (a?: string) =>
  a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";

const hideClass = (h?: string) =>
  h === "md" ? "hidden md:table-cell" : h === "lg" ? "hidden lg:table-cell" : "";

export default function DataTable<T>({
  columns, data, keyExtractor,
  emptyTitle = "Sin resultados",
  emptyDescription,
  emptyAction,
  rowClassName,
  onRowClick,
  loading,
}: Props<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#e4e7ed] overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 px-5 py-4 border-b border-[#f1f3f7] last:border-0">
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-4 w-24 ml-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#e4e7ed] overflow-hidden">
        <EmptyState
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          }
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e4e7ed] overflow-x-auto shadow-[0_1px_2px_0_rgb(0_0_0/0.04),0_0_0_1px_rgb(0_0_0/0.04)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#f1f3f7]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-5 py-3.5 text-xs font-semibold text-[#9aa3b5] uppercase tracking-wide ${alignClass(col.align)} ${hideClass(col.hideBelow)} ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-[#f1f3f7] last:border-0 transition-colors duration-100 ${
                onRowClick ? "cursor-pointer hover:bg-[#f6f7f9]" : "hover:bg-[#f6f7f9]/60"
              } ${rowClassName?.(row) ?? ""}`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-5 py-3.5 ${alignClass(col.align)} ${hideClass(col.hideBelow)} ${col.className ?? ""}`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}