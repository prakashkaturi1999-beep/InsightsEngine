"use client";

import { useState } from "react";

export type SortConfig<T> = {
  key: keyof T;
  direction: "asc" | "desc";
};

type Column<T> = {
  key: keyof T;
  label: string;
  numeric?: boolean;
  render?: (row: T) => React.ReactNode;
};

type Props<T extends { id: string }> = {
  columns: Column<T>[];
  rows: T[];
  defaultSort: SortConfig<T>;
};

export function SortableTable<T extends { id: string }>({
  columns,
  rows,
  defaultSort,
}: Props<T>) {
  const [sort, setSort] = useState<SortConfig<T>>(defaultSort);

  const sortedRows = [...rows].sort((a, b) => {
    const aVal = a[sort.key];
    const bVal = b[sort.key];
    if (aVal === bVal) return 0;
    const directionFactor = sort.direction === "asc" ? 1 : -1;
    if (typeof aVal === "number" && typeof bVal === "number") {
      return aVal < bVal ? -1 * directionFactor : 1 * directionFactor;
    }
    return String(aVal).localeCompare(String(bVal)) * directionFactor;
  });

  const toggleSort = (key: keyof T) => {
    setSort((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "desc" };
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="sticky left-0 z-10 bg-slate-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Rank
              </th>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-400"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900"
                  >
                    <span>{col.label}</span>
                    <span className="text-[10px]">
                      {sort.key === col.key
                        ? sort.direction === "asc"
                          ? "▲"
                          : "▼"
                        : "▾"}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {sortedRows.map((row, index) => (
              <tr key={row.id} className="hover:bg-amber-50/40">
                <td className="sticky left-0 z-10 bg-white px-3 py-2 text-xs text-slate-400">
                  {index + 1}
                </td>
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`px-3 py-2 ${
                      col.numeric ? "text-right" : "text-left"
                    } text-sm text-slate-700`}
                  >
                    {col.render ? col.render(row) : (row[col.key] as any)}
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

