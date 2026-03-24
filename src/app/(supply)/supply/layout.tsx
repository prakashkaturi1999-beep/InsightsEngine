import { ReactNode } from "react";
import Link from "next/link";
import { FilterBar, type FilterConfig } from "@/components/ui/FilterBar";

type Props = {
  children: ReactNode;
};

const supplyLinks = [
  { href: "/supply", label: "Supply Home" },
  { href: "/supply/inventory", label: "Inventory Levels" },
  { href: "/supply/stockouts", label: "Stockouts" },
  { href: "/supply/suppliers", label: "Supplier Performance" },
  { href: "/supply/purchase-orders", label: "Purchase Orders" },
];

export default function SupplyLayout({ children }: Props) {
  const filters: FilterConfig[] = [
    {
      id: "warehouse",
      label: "Warehouse / Store",
      options: [
        { label: "All Locations", value: "all" },
        { label: "Central Warehouse", value: "central" },
        { label: "Downtown Store", value: "downtown" },
      ],
    },
    {
      id: "category",
      label: "Category",
      options: [
        { label: "All Categories", value: "all" },
        { label: "Food", value: "food" },
        { label: "Beverage", value: "beverage" },
        { label: "Packaging", value: "packaging" },
      ],
    },
    {
      id: "range",
      label: "Time Range",
      options: [
        { label: "Last 7 Days", value: "7d" },
        { label: "Last 30 Days", value: "30d" },
        { label: "Last 90 Days", value: "90d" },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-100">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-600 shadow-sm" />
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Insight Engine
            </div>
            <div className="text-sm font-semibold text-slate-900">
              Supply Domain
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4 text-sm">
          {supplyLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center rounded-lg px-3 py-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition-colors"
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div className="space-y-1">
              <h1 className="text-base font-semibold text-slate-900">
                Supply Chain & Inventory
              </h1>
              <p className="text-xs text-slate-500">
                Inventory availability, supplier performance, and purchasing
                health.
              </p>
            </div>
            <FilterBar filters={filters} />
          </div>
        </header>
        <main className="flex-1 px-4 py-4 md:px-6 md:py-6">{children}</main>
      </div>
    </div>
  );
}

