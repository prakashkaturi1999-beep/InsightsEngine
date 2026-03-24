"use client";

type FilterOption = {
  label: string;
  value: string;
};

export type FilterConfig = {
  id: string;
  label: string;
  options: FilterOption[];
};

type Props = {
  filters: FilterConfig[];
  isDark?: boolean;
};

export function FilterBar({ filters, isDark }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <select
          key={filter.id}
          className={`h-9 rounded-full border px-3 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70 ${
            isDark 
              ? 'bg-slate-900 border-slate-700 text-slate-300' 
              : 'bg-white border-slate-200 text-slate-700'
          }`}
          aria-label={filter.label}
        >
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}

