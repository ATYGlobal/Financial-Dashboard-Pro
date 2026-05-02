import type { AlertItem } from '@/types';

export default function AlertBanner({ alerts }: { alerts: AlertItem[] }) {
  if (!alerts.length) return null;
  return (
    <div className="space-y-2">
      {alerts.map((a, i) => (
        <div
          key={i}
          className={`rounded px-4 py-2 text-sm flex items-center gap-2 ${
            a.severity === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          <span>{a.severity === 'error' ? '🔴' : '🟡'}</span>
          {a.message}
        </div>
      ))}
    </div>
  );
}