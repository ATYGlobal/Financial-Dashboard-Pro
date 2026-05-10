type Variant = "default" | "blue" | "green" | "red" | "amber" | "purple" | "gray";

interface Props {
  label: string;
  variant?: Variant;
  dot?: boolean;
}

const variantMap: Record<Variant, string> = {
  default: "bg-[#f1f3f7] text-[#5a6276]",
  blue:    "bg-blue-50 text-blue-700",
  green:   "bg-emerald-50 text-emerald-700",
  red:     "bg-red-50 text-red-700",
  amber:   "bg-amber-50 text-amber-700",
  purple:  "bg-purple-50 text-purple-700",
  gray:    "bg-[#f1f3f7] text-[#9aa3b5]",
};

const dotMap: Record<Variant, string> = {
  default: "bg-[#9aa3b5]",
  blue:    "bg-blue-500",
  green:   "bg-emerald-500",
  red:     "bg-red-500",
  amber:   "bg-amber-500",
  purple:  "bg-purple-500",
  gray:    "bg-[#9aa3b5]",
};

export function categoryVariant(category: string): Variant {
  const map: Record<string, Variant> = {
    Trabajo: "blue", Ayuda: "purple", Extra: "green", Otro: "gray",
  };
  return map[category] ?? "default";
}

export function priorityVariant(priority: string): Variant {
  const map: Record<string, Variant> = {
    Esencial: "red", Importante: "amber", Prescindible: "gray",
  };
  return map[priority] ?? "default";
}

export function statusVariant(status: string): Variant {
  const map: Record<string, Variant> = {
    active: "green", planned: "blue", finished: "gray",
  };
  return map[status] ?? "default";
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    active: "Activo", planned: "Previsto", finished: "Finalizado",
  };
  return map[status] ?? status;
}

export default function Badge({ label, variant = "default", dot = false }: Props) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${variantMap[variant]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotMap[variant]}`} />}
      {label}
    </span>
  );
}