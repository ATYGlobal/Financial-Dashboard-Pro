import { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-[#f1f3f7] flex items-center justify-center mb-4 text-[#9aa3b5]">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-[#0f1117] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[#9aa3b5] max-w-xs leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}