"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, Zap, LayoutDashboard, WalletCards, BarChart3,
  ShoppingCart, Package, Users, HeartPulse, ChevronDown,
  Settings, HelpCircle, Home,
} from "lucide-react";

type NavItem = {
  label: string;
  href?: string;
  icon: React.ReactNode;
  color: string;
  children?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <Home size={20} />,
    color: "text-slate-600",
  },
  {
    label: "Finance",
    href: "/finance",
    icon: <WalletCards size={20} />,
    color: "text-emerald-600",
    children: [
      { label: "P&L Overview", href: "/finance" },
      { label: "Cash Flow", href: "/finance/cash" },
      { label: "Budget Variance", href: "/finance/variance" },
    ],
  },
  {
    label: "Sales",
    href: "/sales",
    icon: <BarChart3 size={20} />,
    color: "text-indigo-600",
    children: [
      { label: "Daily Snapshot", href: "/sales" },
      { label: "Overview", href: "/sales/overview" },
      { label: "Channel Breakdown", href: "/sales/channels" },
      { label: "Item Performance", href: "/sales/items" },
      { label: "Employees", href: "/sales/employees" },
    ],
  },
  {
    label: "Orders",
    href: "/supply",
    icon: <ShoppingCart size={20} />,
    color: "text-amber-600",
    children: [
      { label: "Vendor Overview", href: "/supply" },
      { label: "Purchase Orders", href: "/supply/orders" },
      { label: "Lead Times", href: "/supply/lead-times" },
    ],
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: <Package size={20} />,
    color: "text-orange-600",
    children: [
      { label: "Stock Health", href: "/inventory" },
      { label: "Replenishment", href: "/inventory/replenishment" },
      { label: "Shrinkage", href: "/inventory/shrinkage" },
    ],
  },
  {
    label: "HR",
    href: "/hr",
    icon: <Users size={20} />,
    color: "text-violet-600",
    children: [
      { label: "Labor Overview", href: "/hr" },
      { label: "Staffing", href: "/hr/staffing" },
      { label: "Attrition", href: "/hr/attrition" },
    ],
  },
  {
    label: "Customer",
    href: "/customer",
    icon: <HeartPulse size={20} />,
    color: "text-rose-600",
    children: [
      { label: "NPS & Sentiment", href: "/customer" },
      { label: "Complaints", href: "/customer/complaints" },
      { label: "Loyalty", href: "/customer/loyalty" },
    ],
  },
];

export function BurgerNav() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  const toggle = (label: string) =>
    setExpanded((prev) => (prev === label ? null : label));

  return (
    <>
      {/* Hamburger toggle button */}
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer — wider and more premium */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-[340px] flex-col bg-white shadow-[6px_0_50px_rgba(15,23,42,0.15)] transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Navigation drawer"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 bg-gradient-to-r from-slate-950 to-slate-800">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 group"
            aria-label="Go home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white shadow-sm backdrop-blur-sm ring-1 ring-white/20">
              <Zap size={18} className="text-amber-400" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white">Insights Engine</span>
              <p className="text-[11px] text-slate-400 font-medium">CEO Command Centre</p>
            </div>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Business Domains</p>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = item.href
                ? pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                : false;
              const isExpanded = expanded === item.label;

              return (
                <li key={item.label}>
                  {item.children ? (
                    <button
                      onClick={() => toggle(item.label)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${isActive ? "bg-white/10 text-white" : `bg-slate-100 ${item.color}`}`}>
                        {item.icon}
                      </span>
                      <span className="flex-1 text-left text-[15px]">{item.label}</span>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href!}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-semibold transition-all ${
                        isActive
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${isActive ? "bg-white/10 text-white" : `bg-slate-100 ${item.color}`}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  )}

                  {/* Subpages — animated */}
                  {item.children && isExpanded && (
                    <ul className="mt-1 ml-5 space-y-0.5 border-l-2 border-slate-100 pl-4">
                      {item.children.map((child) => {
                        const childActive = pathname === child.href || (child.href !== "/" && pathname === child.href);
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                childActive
                                  ? "text-indigo-600 bg-indigo-50 font-semibold"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Drawer footer */}
        <div className="border-t border-slate-100 px-3 py-4 space-y-0.5 bg-slate-50/60">
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <Settings size={16} />
            </span>
            Settings
          </Link>
          <Link
            href="/help"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <HelpCircle size={16} />
            </span>
            Help & Support
          </Link>
        </div>
      </aside>
    </>
  );
}
