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
      className={`flex flex-col items-center justify-center p-8 text-center rounded-[12px] bg-slate-50/50 border border-dashed border-[#E5E7EB] ${className}`}
    >
      {icon && (
        <div className="p-3 bg-white border border-[#E5E7EB] rounded-full text-gray-400 mb-3 shadow-sm">
          {icon}
        </div>
      )}
      <h4 className="text-sm font-medium text-[#111827]">{title}</h4>
      {description && (
        <p className="text-xs text-gray-500 max-w-sm mt-1">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
