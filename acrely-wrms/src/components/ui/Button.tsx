import React from 'react';
import { useExperience } from '../../context/ExperienceContext';

/**
 * Reusable Button component with dark mode support and tactile audio/haptic feedback
 */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
  soundType?: 'click' | 'pop' | 'save' | 'delete' | 'success';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  soundType,
  onClick,
  ...props
}) => {
  const { playSound, triggerHaptic } = useExperience();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (soundType) {
      playSound(soundType);
    } else if (variant === 'danger') {
      playSound('delete');
    } else if (variant === 'success') {
      playSound('success');
    } else {
      playSound('click');
    }

    triggerHaptic(variant === 'danger' ? 'medium' : 'light');

    if (onClick) {
      onClick(e);
    }
  };

  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-[12px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5'
  };

  const variantStyles = {
    primary: 'bg-[#2563EB] hover:bg-[#3B82F6] active:bg-[#1d4ed8] text-white shadow-xs',
    secondary: 'bg-gray-100 dark:bg-[#1E293B] hover:bg-gray-200 dark:hover:bg-[#273549] text-[#111827] dark:text-[#F8FAFC] border border-transparent dark:border-[#334155]',
    outline: 'border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-[#273549] text-[#111827] dark:text-[#F8FAFC] shadow-xs',
    ghost: 'text-gray-600 dark:text-[#CBD5E1] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-[#1E293B]',
    danger: 'bg-[#DC2626] dark:bg-[#EF4444] hover:bg-[#b91c1c] dark:hover:bg-[#dc2626] text-white shadow-xs',
    success: 'bg-[#16A34A] dark:bg-[#22C55E] hover:bg-[#15803d] dark:hover:bg-[#16a34a] text-white shadow-xs'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
