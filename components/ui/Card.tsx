import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const padMap = { none: "", sm: "p-4", md: "p-5", lg: "p-6" };

export default function Card({ children, className = "", hover = false, padding = "md" }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-[#e4e7ed]
        shadow-[0_1px_2px_0_rgb(0_0_0/0.04),0_0_0_1px_rgb(0_0_0/0.04)]
        ${hover ? "transition-shadow duration-200 hover:shadow-[0_4px_12px_-2px_rgb(0_0_0/0.08),0_0_0_1px_rgb(0_0_0/0.04)]" : ""}
        ${padMap[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface SectionCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, subtitle, action, children, className = "" }: SectionCardProps) {
  return (
    <Card padding="none" className={className}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f3f7]">
        <div>
          <h2 className="text-sm font-semibold text-[#0f1117]">{title}</h2>
          {subtitle && <p className="text-xs text-[#9aa3b5] mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </Card>
  );
}