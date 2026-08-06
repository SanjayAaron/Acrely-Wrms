import React from 'react';

/**
 * Custom Styled Form Input Component with Dark Mode Support
 */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-gray-700 dark:text-[#CBD5E1] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative rounded-[12px]">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-[#64748B]">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-white dark:bg-[#1E293B] border ${
              error ? 'border-[#DC2626] dark:border-[#EF4444]' : 'border-[#E5E7EB] dark:border-[#334155]'
            } text-[#111827] dark:text-[#F8FAFC] placeholder:text-gray-400 dark:placeholder:text-[#64748B] text-sm rounded-[12px] ${
              icon ? 'pl-9' : 'px-3.5'
            } py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-colors ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <p className="mt-1 text-xs text-[#DC2626] dark:text-[#EF4444]">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-gray-500 dark:text-[#94A3B8]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
