import React from 'react';

/**
 * Reusable Card component designed according to corporate dashboard standards:
 * - White background (#FFFFFF)
 * - Border color (#E5E7EB)
 * - 12px rounded corners (rounded-[12px])
 * - Soft subtle shadow (shadow-sm)
 */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-5 pb-3 border-b border-[#E5E7EB]/60 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <h3 className={`text-base font-semibold text-[#111827] tracking-tight ${className}`}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return <p className={`text-xs text-gray-500 mt-0.5 ${className}`}>{children}</p>;
};

export const CardContent: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
};
