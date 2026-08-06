import React from 'react';
import { useExperience } from '../../context/ExperienceContext';

/**
 * Custom Styled Form Select Component with Dark Mode Support and audio/haptic feedback
 */

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', id, onChange, onFocus, ...props }, ref) => {
    const { playSound, triggerHaptic } = useExperience();
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      playSound('dropdown');
      triggerHaptic('selection');
      if (onChange) onChange(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      playSound('dropdown');
      if (onFocus) onFocus(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-gray-700 dark:text-[#CBD5E1] mb-1.5">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          onChange={handleChange}
          onFocus={handleFocus}
          className={`w-full bg-white dark:bg-[#1E293B] border ${
            error ? 'border-[#DC2626] dark:border-[#EF4444]' : 'border-[#E5E7EB] dark:border-[#334155]'
          } text-[#111827] dark:text-[#F8FAFC] text-sm rounded-[12px] px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-colors ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC]">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-[#DC2626] dark:text-[#EF4444]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
