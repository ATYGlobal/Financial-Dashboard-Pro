"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    href: "/dashboard",
    label: "Inicio",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="2" fill={active ? "#2563eb" : "none"} stroke={active ? "#2563eb" : "#9aa3b5"} strokeWidth="1.5"/>
        <rect x="11" y="2" width="7" height="7" rx="2" fill="none" stroke={active ? "#2563eb" : "#9aa3b5"} strokeWidth="1.5" opacity={active ? "0.5" : "1"}/>
        <rect x="2" y="11" width="7" height="7" rx="2" fill="none" stroke={active ? "#2563eb" : "#9aa3b5"} strokeWidth="1.5" opacity={active ? "0.5" : "1"}/>
        <rect x="11" y="11" width="7" height="7" rx="2" fill={active ? "#2563eb" : "none"} stroke={active ? "#2563eb" : "#9aa3b5"} strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    href: "/incomes",
    label: "Ingresos",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 16V4M10 4L5 9M10 4L15 9" stroke={active ? "#2563eb" : "#9aa3b5"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/expenses",
    label: "Gastos",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 4V16M10 16L5 11M10 16L15 11" stroke={active ? "#2563eb" : "#9aa3b5"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/forecast",
    label: "Forecast",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 14L7.5 9L11 12.5L17 5" stroke={active ? "#2563eb" : "#9aa3b5"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.5 5H17V8.5" stroke={active ? "#2563eb" : "#9aa3b5"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/history",
    label: "Historico",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="4" width="14" height="13" rx="2" stroke={active ? "#2563eb" : "#9aa3b5"} strokeWidth="1.5"/>
        <path d="M7 2V5M13 2V5M3 9H17" stroke={active ? "#2563eb" : "#9aa3b5"} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function MobileNav() {
  const path = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-t border-[#e4e7ed]" />
      <div className="relative flex items-stretch">
        {NAV.map((n) => {
          const active = path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-1 transition-all duration-150 active:scale-95"
            >
              {n.icon(active)}
              <span className={`text-[10px] font-medium transition-colors duration-150 ${active ? "text-blue-600" : "text-[#9aa3b5]"}`}>
                {n.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}