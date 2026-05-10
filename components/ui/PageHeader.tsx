import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  badge?: string;
}

export default function PageHeader({ title, subtitle, action, badge }: Props) {
  return (
    <div className="flex items-start justify-between mb-6 md:mb-8">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[#0f1117]">{title}</h1>
          {badge && (
            <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-[#9aa3b5]">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}