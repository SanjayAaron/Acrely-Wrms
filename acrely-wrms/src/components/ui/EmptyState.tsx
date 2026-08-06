import React from 'react';

/**
 * Reusable Empty State component for charts, tables, and vacant sections
 */

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-[12px] bg-slate-50/50 dark:bg-[#111827]/60 border border-dashed border-[#E5E7EB] dark:border-[#334155] ${className}`}
    >
      {icon && (
        <div className="p-3 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-full text-gray-400 dark:text-[#94A3B8] mb-3 shadow-2xs">
          {icon}
        </div>
      )}
      <h4 className="text-sm font-semibold text-[#111827] dark:text-[#F8FAFC]">{title}</h4>
      {description && (
        <p className="text-xs text-gray-500 dark:text-[#94A3B8] max-w-sm mt-1">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
