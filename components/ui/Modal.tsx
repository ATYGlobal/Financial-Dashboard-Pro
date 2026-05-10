"use client";
import { ReactNode, useEffect } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
}

export default function Modal({ title, subtitle, children, onClose, footer }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-2xl shadow-[0_20px_60px_-10px_rgb(0_0_0/0.3)] max-h-[92dvh] flex flex-col">
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#e4e7ed]" />
        </div>
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#f1f3f7] shrink-0">
          <div>
            <h2 className="text-base font-semibold text-[#0f1117]">{title}</h2>
            {subtitle && <p className="text-xs text-[#9aa3b5] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#f1f3f7] hover:bg-[#eef0f5] flex items-center justify-center transition-colors duration-150 shrink-0 ml-4"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="#5a6276" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
        {footer && (
          <div className="shrink-0 px-6 py-4 border-t border-[#f1f3f7] flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}