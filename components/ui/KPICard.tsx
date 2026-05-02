import { fmt } from '@/lib/calculations';

interface Props {
  label: string;
  value: number | string;
  currency?: boolean;
  pct?: boolean;
  color?: 'default' | 'green' | 'red' | 'blue' | 'orange';
  sub?: string;
}

const colorMap = {
  default: 'text-gray-900',
  green:   'text-emerald-600',
  red:     'text-red-600',
  blue:    'text-blue-700',
  orange:  'text-orange-600',
};

export default function KPICard({ label, value, currency, pct, color = 'default', sub }: Props) {
  const display = currency
    ? fmt(Number(value))
    : pct
      ? `${Number(value).toFixed(1)}%`
      : value;

  const colorClass = colorMap[color];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-semibold ${colorClass}`}>{display}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}