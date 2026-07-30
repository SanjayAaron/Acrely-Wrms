import React, { useState, useRef, useEffect } from 'react';
import { Eye, ArrowLeft, ArrowRight, Trash2, MoreHorizontal } from 'lucide-react';

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'secondary' | 'primary' | 'danger-outline';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  tooltip?: string;
  children?: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant = 'outline',
  icon,
  iconPosition = 'left',
  tooltip,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'h-[40px] px-3.5 rounded-[10px] inline-flex items-center justify-center gap-2 font-medium text-xs transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/30 focus-visible:ring-offset-1 select-none whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

  const variantClasses = {
    // View Button - Gray outline with light gray hover in light mode, slate border & bg in dark mode
    outline:
      'border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#374151] dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#273549] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs',

    // Previous Button - Neutral secondary background with subtle hover
    secondary:
      'border border-transparent bg-slate-100 dark:bg-[#273549] text-slate-700 dark:text-[#CBD5E1] hover:bg-slate-200 dark:hover:bg-[#334155] hover:text-slate-900 dark:hover:text-[#F8FAFC]',

    // Next Button - Primary solid blue background with darker/lighter blue hover
    primary:
      'border border-transparent bg-[#2563EB] hover:bg-[#3B82F6] text-white shadow-xs font-semibold',

    // Move to Bin Button - Red outline with soft red hover
    'danger-outline':
      'border border-red-200 dark:border-red-800 bg-white dark:bg-[#1E293B] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-300 dark:hover:border-red-700 hover:text-red-700 dark:hover:text-red-300',
  };

  return (
    <button
      type="button"
      title={tooltip}
      aria-label={tooltip || (typeof children === 'string' ? children : undefined)}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="inline-flex items-center justify-center shrink-0">{icon}</span>
      )}
      {children && <span>{children}</span>}
      {icon && iconPosition === 'right' && (
        <span className="inline-flex items-center justify-center shrink-0">{icon}</span>
      )}
    </button>
  );
};

export const PrimaryButton: React.FC<Omit<ActionButtonProps, 'variant'>> = ({
  icon = <ArrowRight className="w-4 h-4 shrink-0" />,
  iconPosition = 'right',
  tooltip = 'Move to Next Stage',
  children = 'Next',
  ...props
}) => {
  return (
    <ActionButton
      variant="primary"
      icon={icon}
      iconPosition={iconPosition}
      tooltip={tooltip}
      {...props}
    >
      {children}
    </ActionButton>
  );
};

export const SecondaryButton: React.FC<Omit<ActionButtonProps, 'variant'>> = ({
  icon = <ArrowLeft className="w-4 h-4 shrink-0" />,
  iconPosition = 'left',
  tooltip = 'Move to Previous Stage',
  children = 'Previous',
  ...props
}) => {
  return (
    <ActionButton
      variant="secondary"
      icon={icon}
      iconPosition={iconPosition}
      tooltip={tooltip}
      {...props}
    >
      {children}
    </ActionButton>
  );
};

export const DangerOutlineButton: React.FC<Omit<ActionButtonProps, 'variant'>> = ({
  icon = <Trash2 className="w-4 h-4 shrink-0" />,
  iconPosition = 'left',
  tooltip = 'Move Lead to Recycle Bin',
  children = 'Move to Bin',
  ...props
}) => {
  return (
    <ActionButton
      variant="danger-outline"
      icon={icon}
      iconPosition={iconPosition}
      tooltip={tooltip}
      {...props}
    >
      {children}
    </ActionButton>
  );
};

export const ViewButton: React.FC<Omit<ActionButtonProps, 'variant'>> = ({
  icon = <Eye className="w-4 h-4 shrink-0" />,
  iconPosition = 'left',
  tooltip = 'View Lead Details',
  children = 'View',
  ...props
}) => {
  return (
    <ActionButton
      variant="outline"
      icon={icon}
      iconPosition={iconPosition}
      tooltip={tooltip}
      {...props}
    >
      {children}
    </ActionButton>
  );
};

interface CrmRowActionGroupProps {
  onView: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onMoveToBin: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export const CrmRowActionGroup: React.FC<CrmRowActionGroupProps> = ({
  onView,
  onPrevious,
  onNext,
  onMoveToBin,
  hasPrevious = true,
  hasNext = true,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="relative inline-flex items-center justify-end">
      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center gap-2 flex-nowrap">
        <ViewButton onClick={onView} />

        {hasPrevious && onPrevious && (
          <SecondaryButton onClick={onPrevious} />
        )}

        {hasNext && onNext && (
          <PrimaryButton onClick={onNext} />
        )}

        <DangerOutlineButton onClick={onMoveToBin} />
      </div>

      {/* Mobile & Tablet Overflow Layout (...) */}
      <div className="lg:hidden relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          title="More Actions"
          className="h-[40px] px-3 rounded-[10px] border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#374151] dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#273549] inline-flex items-center justify-center gap-1.5 font-medium text-xs transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/30 cursor-pointer"
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Actions</span>
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[12px] shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                onView();
              }}
              className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#273549] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-gray-500 dark:text-[#94A3B8] shrink-0" />
              <span>View Lead Details</span>
            </button>

            {hasPrevious && onPrevious && (
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onPrevious();
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#273549] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-gray-500 dark:text-[#94A3B8] shrink-0" />
                <span>Move to Previous Stage</span>
              </button>
            )}

            {hasNext && onNext && (
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onNext();
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#273549] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 text-[#2563EB] dark:text-blue-400 shrink-0" />
                <span>Move to Next Stage</span>
              </button>
            )}

            <div className="my-1 border-t border-[#E5E7EB] dark:border-[#334155]" />

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                onMoveToBin();
              }}
              className="w-full text-left px-3.5 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-red-500 shrink-0" />
              <span>Move to Recycle Bin</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
