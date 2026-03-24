"use client";

import { useFinanceFilters, dateRangeLabel } from "@/lib/financeFilterContext";
import { getFinanceKpis, getTenderMix, getTaxLiabilities, getProcessingFees } from "@/lib/financeDataEngine";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { CreditCard, Landmark, Receipt, Percent, Smartphone, TrendingDown } from "lucide-react";

const tenderColors = ["#6366f1", "#8b5cf6", "#f59e0b", "#ec4899", "#10b981", "#0ea5e9", "#94a3b8"];
const taxColors = ["#ef4444", "#f59e0b", "#6366f1", "#8b5cf6"];

function fmtM(v: number) { return "$" + (v / 1_000_000).toFixed(1) + "M"; }
function fmtK(v: number) { return "$" + (v / 1000).toFixed(0) + "K"; }
function fmtDollar(v: number) { return "$" + v.toLocaleString(); }
function fmtAxisM(v: number) { return "$" + (v / 1_000_000).toFixed(1) + "M"; }

export default function PaymentsTaxesPage() {
  const { filters } = useFinanceFilters();
  const kpis = getFinanceKpis(filters);
  const tender = getTenderMix(filters);
  const taxes = getTaxLiabilities(filters);
  const fees = getProcessingFees(filters);

  const cashlessRevenue = tender.filter(t => t.name !== "Cash").reduce((s, t) => s + t.value, 0);
  const cashlessPct = ((cashlessRevenue / kpis.netRevenue) * 100).toFixed(1);

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payments & Tax Liability</h1>
        <p className="text-sm text-slate-500">Processor mix, effective rates, cashless penetration, and accrued obligations for {dateRangeLabel(filters.dateRange)}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { label: "Processed Volume", val: fmtM(kpis.netRevenue), icon: CreditCard, color: "text-indigo-900", bg: "bg-gradient-to-br from-indigo-50/80 to-indigo-100/30", border: "border-indigo-200/60" },
          { label: "Effective Fee Rate", val: fees.effectiveRate + "%", icon: Percent, color: "text-amber-900", bg: "bg-gradient-to-br from-amber-50/80 to-amber-100/30", border: "border-amber-200/60" },
          { label: "Cashless %", val: cashlessPct + "%", icon: Smartphone, color: "text-emerald-900", bg: "bg-gradient-to-br from-emerald-50/80 to-emerald-100/30", border: "border-emerald-200/60" },
          { label: "Cost Per Txn", val: "$" + fees.costPerTransaction.toFixed(3), icon: Receipt, color: "text-blue-900", bg: "bg-gradient-to-br from-blue-50/80 to-blue-100/30", border: "border-blue-200/60" },
          { label: "Processing Fees", val: fmtK(fees.totalFees), icon: TrendingDown, color: "text-rose-900", bg: "bg-gradient-to-br from-rose-50/80 to-rose-100/30", border: "border-rose-200/60" },
          { label: "Sales Tax Accrued", val: fmtM(taxes[0]?.value || 0), icon: Landmark, color: "text-violet-900", bg: "bg-gradient-to-br from-violet-50/80 to-violet-100/30", border: "border-violet-200/60" },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={"relative overflow-hidden rounded-3xl border p-4 shadow-sm " + kpi.bg + " " + kpi.border}>
              <div className="absolute -right-3 -top-3 opacity-5"><Icon size={60} className={kpi.color} /></div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
              <p className={"text-xl font-extrabold " + kpi.color}>{kpi.val}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tender Mix Donut */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Tender Mix by Processor</h2>
          <p className="text-xs text-slate-500 mb-2">Volume distribution across payment types</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={tender} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={2} stroke="none">
                {tender.map((_, i) => <Cell key={"td" + i} fill={tenderColors[i]} />)}
              </Pie>
              <Tooltip formatter={((v: number) => [fmtDollar(v), "Volume"]) as any} contentStyle={{ fontSize: 11, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 500, paddingTop: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tax Liability Bars */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Tax Obligation Waterfall</h2>
          <p className="text-xs text-slate-500 mb-4">Accrued liabilities by tax category</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={taxes} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tickFormatter={fmtAxisM} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12, fontWeight: 600 }} formatter={((v: number) => [fmtDollar(v), "Liability"]) as any} />
              <Bar dataKey="value" name="Tax Liability" radius={[4, 4, 0, 0]}>
                {taxes.map((_, i) => <Cell key={"tx" + i} fill={taxColors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Processor Detail Table */}
      <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm flex flex-col">
        <div className="border-b border-slate-100/50 p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-0.5">Processor Fee Schedule</h2>
          <p className="text-xs text-slate-500">Negotiated rates and volume-weighted fees per processor</p>
        </div>
        <div className="flex-1 p-2 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100/50 text-sm">
            <thead>
              <tr>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Processor</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Volume</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Mix %</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Rate</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Est. Fees</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/50">
              {tender.map((t, i) => {
                const estFees = Math.round(t.value * (t.feeRate / 100));
                return (
                  <tr key={t.name} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: tenderColors[i] }} />
                      <span className="font-bold text-slate-800">{t.name}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-900">{fmtDollar(t.value)}</td>
                    <td className="px-5 py-3.5 text-right font-medium text-slate-500">{t.pct}%</td>
                    <td className="px-5 py-3.5 text-right font-bold text-amber-700">{t.feeRate > 0 ? t.feeRate + "%" : "—"}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-rose-600">{estFees > 0 ? "-" + fmtDollar(estFees) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
