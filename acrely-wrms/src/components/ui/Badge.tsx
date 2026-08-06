import React from 'react';

/**
 * Status Badge Component for Occupied/Vacant/Paid/Pending/Overdue statuses.
 * Dark mode compliant with soft non-saturated backgrounds.
 */

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'blue';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = ''
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs'
  };

  const variantStyles = {
    success: 'bg-[#22C55E]/15 text-emerald-700 dark:text-[#4ADE80] border border-[#22C55E]/30',
    warning: 'bg-[#F59E0B]/15 text-amber-700 dark:text-[#FBBF24] border border-[#F59E0B]/30',
    danger: 'bg-[#EF4444]/15 text-red-700 dark:text-[#F87171] border border-[#EF4444]/30',
    info: 'bg-[#38BDF8]/15 text-sky-700 dark:text-[#38BDF8] border border-[#38BDF8]/30',
    blue: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50',
    neutral: 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700'
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full whitespace-nowrap ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 shrink-0 opacity-75" />
      {children}
    </span>
  );
};
