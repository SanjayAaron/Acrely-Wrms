import React from 'react';

/**
 * Status Badge Component for Occupied/Vacant/Paid/Pending/Overdue statuses.
 * Follows exact brand color constraints:
 * Success (#16A34A), Warning (#F59E0B), Danger (#DC2626), Primary (#2563EB)
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
    success: 'bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20',
    warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20',
    danger: 'bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20',
    info: 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200'
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
