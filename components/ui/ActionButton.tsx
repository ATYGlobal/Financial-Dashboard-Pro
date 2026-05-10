import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  className?: string;
}

const variantMap: Record<Variant, string> = {
  primary:   "bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:bg-blue-800",
  secondary: "bg-[#f1f3f7] text-[#0f1117] hover:bg-[#eef0f5] border border-[#e4e7ed] active:bg-[#e4e7ed]",
  ghost:     "text-[#5a6276] hover:bg-[#f1f3f7] hover:text-[#0f1117] active:bg-[#eef0f5]",
  danger:    "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 active:bg-red-200",
};

const sizeMap: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5",
  md: "text-sm px-4 py-2 rounded-xl gap-2",
  lg: "text-sm px-5 py-2.5 rounded-xl gap-2",
};

export default function ActionButton({ children, onClick, variant = "secondary", size = "md", disabled, className = "" }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${variantMap[variant]} ${sizeMap[size]} ${className}`}
    >
      {children}
    </button>
  );
}