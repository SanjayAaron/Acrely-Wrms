import React from 'react';

/**
 * Reusable Card component designed according to corporate dashboard standards:
 * - Light Mode: White background (#FFFFFF), Border (#E5E7EB)
 * - Dark Mode: Card background (#1E293B), Border (#334155)
 * - 12px rounded corners (rounded-[12px])
 * - Soft subtle shadow
 */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[12px] shadow-xs overflow-hidden transition-colors duration-150 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-5 pb-3 border-b border-[#E5E7EB]/60 dark:border-[#334155]/60 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <h3 className={`text-base font-semibold text-[#111827] dark:text-[#F8FAFC] tracking-tight ${className}`}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return <p className={`text-xs text-gray-500 dark:text-[#94A3B8] mt-0.5 ${className}`}>{children}</p>;
};

export const CardContent: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
};
