import { ReactNode } from "react";

interface InputProps {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  fullWidth?: boolean;
}

export function FormField({ label, hint, required, error, children, fullWidth = false }: InputProps) {
  return (
    <div className={fullWidth ? "col-span-2" : ""}>
      <label className="block text-xs font-semibold text-[#5a6276] mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-[#9aa3b5] mt-1">{hint}</p>}
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

const inputClass = `
  w-full border border-[#e4e7ed] rounded-xl px-3.5 py-2.5 text-sm
  text-[#0f1117] placeholder:text-[#9aa3b5]
  bg-white transition-all duration-150
  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
  hover:border-[#d1d6e0]
`;

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function TextInput(props: TextInputProps) {
  return <input {...props} className={inputClass} />;
}

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export function SelectInput({ children, ...props }: SelectInputProps) {
  return (
    <select {...props} className={`${inputClass} appearance-none cursor-pointer`}>
      {children}
    </select>
  );
}

interface TextareaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function TextareaInput(props: TextareaInputProps) {
  return <textarea {...props} className={`${inputClass} resize-none`} />;
}