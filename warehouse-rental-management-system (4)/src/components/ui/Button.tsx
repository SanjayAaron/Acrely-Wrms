import React from 'react';

/**
 * Reusable Button component with corporate styling:
 * Primary Blue: #2563EB
 * Border: #E5E7EB
 * Rounded 12px (rounded-[12px])
 */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-[12px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5'
  };

  const variantStyles = {
    primary: 'bg-[#2563EB] hover:bg-[#1d4ed8] text-white shadow-sm',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-[#111827]',
    outline: 'border border-[#E5E7EB] bg-white hover:bg-slate-50 text-[#111827] shadow-sm',
    ghost: 'text-gray-600 hover:text-[#111827] hover:bg-slate-100',
    danger: 'bg-[#DC2626] hover:bg-[#b91c1c] text-white shadow-sm',
    success: 'bg-[#16A34A] hover:bg-[#15803d] text-white shadow-sm'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
