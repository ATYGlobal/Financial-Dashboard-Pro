import { fmt } from "@/lib/calculations";
import { ReactNode } from "react";

type Color = "default" | "blue" | "green" | "red" | "amber" | "purple";

interface Props {
  label: string;
  value: number | string;
  currency?: boolean;
  isPct?: boolean;
  color?: Color;
  delta?: number;
  sub?: string;
  icon?: ReactNode;
  loading?: boolean;
}

const colorConfig: Record<Color, { text: string; bg: string; iconBg: string }> = {
  default: { text: "text-[#0f1117]",   bg: "bg-[#f6f7f9]",  iconBg: "bg-[#e4e7ed]" },
  blue:    { text: "text-blue-600",    bg: "bg-blue-50",     iconBg: "bg-blue-100" },
  green:   { text: "text-emerald-600", bg: "bg-emerald-50",  iconBg: "bg-emerald-100" },
  red:     { text: "text-red-600",     bg: "bg-red-50",      iconBg: "bg-red-100" },
  amber:   { text: "text-amber-600",   bg: "bg-amber-50",    iconBg: "bg-amber-100" },
  purple:  { text: "text-purple-600",  bg: "bg-purple-50",   iconBg: "bg-purple-100" },
};

export default function KPICard({ label, value, currency, isPct, color = "default", delta, sub, icon, loading }: Props) {
  const cfg = colorConfig[color];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#e4e7ed] p-5 shadow-[0_1px_2px_0_rgb(0_0_0/0.04),0_0_0_1px_rgb(0_0_0/0.04)]">
        <div className="skeleton h-3 w-20 mb-3" />
        <div className="skeleton h-7 w-28 mb-2" />
        <div className="skeleton h-3 w-16" />
      </div>
    );
  }

  const display = currency
    ? fmt(Number(value))
    : isPct
      ? `${Number(value).toFixed(1)}%`
      : String(value);

  const deltaPositive = delta !== undefined && delta >= 0;

  return (
    <div className="bg-white rounded-2xl border border-[#e4e7ed] p-5 shadow-[0_1px_2px_0_rgb(0_0_0/0.04),0_0_0_1px_rgb(0_0_0/0.04)] transition-shadow duration-200 hover:shadow-[0_4px_12px_-2px_rgb(0_0_0/0.08),0_0_0_1px_rgb(0_0_0/0.04)]">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-[#9aa3b5] uppercase tracking-wide">{label}</p>
        {icon && (
          <div className={`w-7 h-7 rounded-lg ${cfg.iconBg} flex items-center justify-center`}>
            <span className={cfg.text}>{icon}</span>
          </div>
        )}
      </div>

      <p className={`text-2xl font-bold font-mono-num tracking-tight ${cfg.text}`}>
        {display}
      </p>

      {(delta !== undefined || sub) && (
        <div className="flex items-center gap-2 mt-2">
          {delta !== undefined && (
            <span className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-md ${
              deltaPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            }`}>
              {deltaPositive ? "↑" : "↓"} {fmt(Math.abs(delta))}
            </span>
          )}
          {sub && <span className="text-xs text-[#9aa3b5]">{sub}</span>}
        </div>
      )}
    </div>
  );
}