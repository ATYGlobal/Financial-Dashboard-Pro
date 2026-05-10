"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9"/>
      </svg>
    ),
  },
  {
    href: "/incomes",
    label: "Ingresos",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 13V3M8 3L4 7M8 3L12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/expenses",
    label: "Gastos",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 3V13M8 13L4 9M8 13L12 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/forecast",
    label: "Forecast",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 11L6 7L9 10L14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 4H14V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/scenarios",
    label: "Escenarios",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 8L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 8L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/history",
    label: "Historico",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 1V4M11 1V4M2 7H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Configuracion",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 1.5V3M8 13V14.5M14.5 8H13M3 8H1.5M12.36 3.64L11.3 4.7M4.7 11.3L3.64 12.36M12.36 12.36L11.3 11.3M4.7 4.7L3.64 3.64" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-[#e4e7ed] bg-white sticky top-0 h-screen">
      <div className="px-5 h-16 flex items-center border-b border-[#e4e7ed]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 10L5 7L7.5 9.5L12 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.5 4H12V6.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0f1117] leading-none">FinPRO</p>
            <p className="text-[10px] text-[#9aa3b5] leading-none mt-0.5">Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold text-[#9aa3b5] uppercase tracking-widest mb-2">Menu</p>
        {NAV.map((n) => {
          const active = path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                active
                  ? "bg-blue-600 text-white font-medium shadow-sm"
                  : "text-[#5a6276] hover:bg-[#f1f3f7] hover:text-[#0f1117]"
              }`}
            >
              <span className={`transition-all duration-150 ${active ? "text-white" : "text-[#9aa3b5] group-hover:text-[#5a6276]"}`}>
                {n.icon}
              </span>
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-[#e4e7ed]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-semibold shrink-0">
            FP
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#0f1117] truncate">Financial PRO</p>
            <p className="text-[10px] text-[#9aa3b5] truncate">Personal</p>
          </div>
        </div>
      </div>
    </aside>
  );
}