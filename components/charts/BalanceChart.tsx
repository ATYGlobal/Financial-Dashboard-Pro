'use client';

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from 'recharts';
import { fmt } from '@/lib/calculations';
import type { ForecastMonth } from '@/types';

interface Props {
  data: ForecastMonth[];
  height?: number;
}

type TooltipPayloadItem = {
  dataKey?: string;
  name?: string;
  value?: number | string;
  color?: string;
  fill?: string;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2 text-sm">
      <p className="font-medium text-gray-700 mb-1">{label}</p>

      {payload.map((item) => (
        <p
          key={item.dataKey}
          style={{ color: item.color ?? item.fill }}
        >
          {item.name}:{' '}
          <span className="font-mono font-medium">
            {fmt(Number(item.value ?? 0))}
          </span>
        </p>
      ))}
    </div>
  );
}

export default function BalanceChart({ data, height = 240 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={data}
        margin={{ left: -8, right: 4, top: 4, bottom: 0 }}
      >
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
          tickFormatter={(value) => `${(Number(value) / 1000).toFixed(0)}k`}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />

        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          iconType="square"
          iconSize={10}
        />

        <ReferenceLine y={0} stroke="#e5e7eb" strokeWidth={1} />

        <Bar
          dataKey="monthly_balance"
          name="Balance mensual"
          radius={[3, 3, 0, 0]}
          maxBarSize={36}
        >
          {data.map((item) => (
            <Cell
              key={item.month}
              fill={item.monthly_balance >= 0 ? '#10b981' : '#ef4444'}
            />
          ))}
        </Bar>

        <Line
          type="monotone"
          dataKey="cumulative_balance"
          name="Acumulado"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}