"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { fmt } from "@/lib/calculations";
import type { ForecastMonth } from "@/types";

interface Props { data: ForecastMonth[]; height?: number; }

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#e4e7ed] rounded-xl shadow-[0_8px_24px_-4px_rgb(0_0_0/0.12)] px-4 py-3 text-sm min-w-[160px]">
      <p className="font-semibold text-[#0f1117] mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
            <span className="text-[#5a6276] text-xs">{p.name}</span>
          </div>
          <span className="font-medium font-mono-num text-[#0f1117] text-xs">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function IncomeExpenseChart({ data, height = 260 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ left: 0, right: 4, top: 4, bottom: 0 }} barGap={3} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="0" stroke="#f1f3f7" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9aa3b5" }} axisLine={false} tickLine={false} dy={6} />
        <YAxis tick={{ fontSize: 11, fill: "#9aa3b5" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} width={36} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f6f7f9", radius: 6 } as any} />
        <Bar dataKey="total_income"   name="Ingresos" fill="#2563eb" radius={[4,4,0,0]} maxBarSize={28} />
        <Bar dataKey="total_expenses" name="Gastos"   fill="#f97316" radius={[4,4,0,0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}