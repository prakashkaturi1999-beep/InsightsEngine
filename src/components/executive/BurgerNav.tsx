"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, Zap, WalletCards, BarChart3,
  ShoppingCart, Package, Users, HeartPulse, ChevronDown,
  Settings, HelpCircle, Home, Shield
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
    label: "Executive Home",
    href: "/",
    icon: <Home size={18} />,
    color: "text-slate-600",
  },
  {
    label: "Finance",
    href: "/finance",
    icon: <WalletCards size={18} />,
    color: "text-emerald-600",
    children: [
      { label: "Command Dashboard", href: "/finance" },
      { label: "Revenue & Costs", href: "/finance/revenue-costs" },
      { label: "Cash Flow", href: "/finance/cash-flow" },
    ],
  },
  {
    label: "Sales",
    href: "/sales",
    icon: <BarChart3 size={18} />,
    color: "text-indigo-600",
    children: [
      { label: "Sales Home", href: "/sales" },
      { label: "Channel Breakdown", href: "/sales/channels" },
      { label: "Item Performance", href: "/sales/items" },
    ],
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: <Package size={18} />,
    color: "text-teal-600",
    children: [
      { label: "Command Center", href: "/inventory" },
      { label: "Current Snapshot", href: "/inventory/current" },
      { label: "Health & Coverage", href: "/inventory/health" },
    ],
  },
  {
    label: "Orders",
    href: "/orders",
    icon: <ShoppingCart size={18} />,
    color: "text-orange-600",
    children: [
      { label: "Command Center", href: "/orders" },
      { label: "Consumption Snapshot", href: "/orders/consumption" },
      { label: "Trends & Forecast", href: "/orders/trends-forecast" },
    ],
  },
  {
    label: "HR & Labor",
    href: "/hr",
    icon: <Users size={18} />,
    color: "text-violet-600",
    children: [
      { label: "Command Center", href: "/hr" },
      { label: "Workforce Overview", href: "/hr/workforce-overview" },
      { label: "Labor Cost", href: "/hr/labor-cost" },
    ],
  },
  {
    label: "Customer",
    href: "/customers",
    icon: <HeartPulse size={18} />,
    color: "text-rose-600",
    children: [
      { label: "Command Center", href: "/customers" },
      { label: "Loyalty Drivers", href: "/customers/loyalty-drivers" },
      { label: "Visit Behavior", href: "/customers/visit-behavior" },
    ],
  },
  {
    label: "User Administration",
    href: "/admin",
    icon: <Shield size={18} />,
    color: "text-slate-800",
    children: [
      { label: "Access Governance", href: "/admin" },
      { label: "Role Permissions", href: "/admin/roles" },
      { label: "Audit Logs", href: "/admin/audit" },
    ],
  },
];

export function BurgerNav() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const toggle = (label: string) =>
    setExpanded((prev) => (prev === label ? null : label));

  const drawerContent = (
    <div className={`fixed inset-0 z-[99999] ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Premium Glass Overlay */}
      <div 
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ease-out ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Premium Drawer Container */}
      <aside 
        className={`absolute top-0 left-0 flex h-full w-[340px] flex-col bg-white shadow-[20px_0_60px_-15px_rgba(0,0,0,0.5)] transition-transform duration-500 ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        aria-label="Navigation drawer"
      >
        {/* Header - Super Clean and Premium */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <Zap size={18} className="text-amber-400" />
            </div>
            <div>
              <span className="block text-[15px] font-bold tracking-tight text-slate-900">Insights Engine</span>
              <span className="block text-[11px] font-bold uppercase tracking-widest text-slate-400">Hub</span>
            </div>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 overflow-y-auto px-4 py-6" style={{ scrollbarWidth: "none" }}>
          <div className="mb-4 px-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Business Domains</span>
          </div>
          
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = item.href === "/" 
                ? pathname === "/" 
                : pathname.startsWith(item.href || "");
              const isExpanded = expanded === item.label;

              return (
                <li key={item.label}>
                  {item.children ? (
                    <div className="flex flex-col">
                      <button
                        onClick={() => toggle(item.label)}
                        className={`group flex w-full items-center justify-between rounded-2xl px-3 py-3 font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                            : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                            isActive ? "bg-white/15 text-white" : `bg-white shadow-sm ring-1 ring-slate-200 group-hover:ring-slate-300 ${item.color}`
                          }`}>
                            {item.icon}
                          </span>
                          <span className="text-[14px]">{item.label}</span>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-300 ease-out ${
                            isExpanded ? "rotate-180" : ""
                          } ${isActive ? "text-slate-400" : "text-slate-400 group-hover:text-slate-600"}`}
                        />
                      </button>
                      
                      {/* Premium Accordion Expansion */}
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-64 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
                      >
                        <ul className="ml-[22px] border-l-[1.5px] border-slate-100 pl-4 py-1 space-y-1">
                          {item.children.map((child) => {
                            const childActive = pathname === child.href;
                            return (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={() => setOpen(false)}
                                  className={`block rounded-xl px-3 py-2 text-[13px] font-semibold transition-all ${
                                    childActive
                                      ? "bg-slate-100 text-slate-900"
                                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      onClick={() => setOpen(false)}
                      className={`group flex items-center justify-between rounded-2xl px-3 py-3 font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                          : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                          isActive ? "bg-white/15 text-white" : `bg-white shadow-sm ring-1 ring-slate-200 group-hover:ring-slate-300 ${item.color}`
                        }`}>
                          {item.icon}
                        </span>
                        <span className="text-[14px]">{item.label}</span>
                      </div>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer actions */}
        <div className="border-t border-slate-100 bg-white p-4">
          <div className="flex gap-2">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl bg-slate-50 py-3 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <Settings size={18} />
              <span className="text-[11px] font-bold">Settings</span>
            </Link>
            <Link
              href="/help"
              onClick={() => setOpen(false)}
              className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl bg-slate-50 py-3 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <HelpCircle size={18} />
              <span className="text-[11px] font-bold">Support</span>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:shadow-md hover:border-slate-300 transition-all duration-200 shadow-sm"
        aria-label="Open navigation menu"
      >
        <Menu size={20} className="transition-transform duration-200 group-hover:scale-110" />
      </button>

      {mounted && createPortal(drawerContent, document.body)}
    </>
  );
}
