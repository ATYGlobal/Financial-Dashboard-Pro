'use client';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';
import { fmt } from '@/lib/calculations';
import type { ForecastMonth } from '@/types';

interface Props {
  data: ForecastMonth[];
  height?: number;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2 text-sm">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.fill }}>
          {p.name}: <span className="font-mono font-medium">{fmt(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

export default function IncomeExpenseChart({ data, height = 240 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ left: -8, right: 4, top: 4, bottom: 0 }} barGap={2}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          iconType="square"
          iconSize={10}
        />
        <Bar
          dataKey="total_income"
          name="Ingresos"
          fill="#3b82f6"
          radius={[3, 3, 0, 0]}
          maxBarSize={40}
        />
        <Bar
          dataKey="total_expenses"
          name="Gastos"
          fill="#f97316"
          radius={[3, 3, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}