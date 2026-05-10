import type { AlertItem } from "@/types";

export default function AlertBanner({ alerts }: { alerts: AlertItem[] }) {
  if (!alerts.length) return null;
  return (
    <div className="space-y-2">
      {alerts.map((a, i) => (
        <div
          key={i}
          className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm border ${
            a.severity === "error"
              ? "bg-red-50 text-red-800 border-red-100"
              : "bg-amber-50 text-amber-800 border-amber-100"
          }`}
        >
          <span className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold ${
            a.severity === "error" ? "bg-red-500" : "bg-amber-500"
          }`}>
            !
          </span>
          <span className="font-medium leading-snug">{a.message}</span>
        </div>
      ))}
    </div>
  );
}