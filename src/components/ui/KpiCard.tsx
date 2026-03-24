import { ReactNode } from "react";

type Props = {
  label: string;
  value: string;
  sublabel?: string;
  trendLabel?: string;
  trendPct?: number;
  icon?: ReactNode;
};

export function KpiCard({
  label,
  value,
  sublabel,
  trendLabel,
  trendPct,
  icon,
}: Props) {
  const isPositive = trendPct !== undefined && trendPct >= 0;

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">
            {value}
          </div>
          {sublabel && (
            <div className="mt-1 text-xs text-slate-500">{sublabel}</div>
          )}
        </div>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
            {icon}
          </div>
        )}
      </div>
      {trendLabel && trendPct !== undefined && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-50 px-2.5 py-1 text-xs">
          <span
            className={`font-semibold ${
              isPositive ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {trendPct.toFixed(1)}%
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="text-slate-500">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}

