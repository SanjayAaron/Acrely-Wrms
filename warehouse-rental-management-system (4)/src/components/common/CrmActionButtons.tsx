import React, { useState, useRef, useEffect } from 'react';
import { Eye, ArrowLeft, ArrowRight, Trash2, MoreHorizontal } from 'lucide-react';

/**
 * CRM Action Button System
 * 
 * Inspired by enterprise design systems (Stripe, Vercel, Linear).
 * Features:
 * - Fixed height of 40px
 * - Smooth 10px rounded corners (rounded-[10px])
 * - Vertically centered icons with 8px (gap-2) spacing to text
 * - Medium font weight (font-medium)
 * - 200ms transitions with click feedback scale animation (active:scale-[0.98])
 * - Accessible focus ring and native hover tooltips
 */

// Base Props shared by all CRM action buttons
export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variant style of the button */
  variant?: 'outline' | 'secondary' | 'primary' | 'danger-outline';
  /** Lucide icon component to display */
  icon?: React.ReactNode;
  /** Position of the icon relative to the text label */
  iconPosition?: 'left' | 'right';
  /** Accessible hover tooltip description */
  tooltip?: string;
  /** Button label content */
  children?: React.ReactNode;
}

/**
 * Base ActionButton Component
 * Core reusable button providing consistent 40px height, rounded-[10px] geometry,
 * typography, focus state, active scale transition, and icon alignment.
 */
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
  // Base styling for all enterprise action buttons
  const baseClasses =
    'h-[40px] px-3.5 rounded-[10px] inline-flex items-center justify-center gap-2 font-medium text-xs transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/30 focus-visible:ring-offset-1 select-none whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

  // Variant-specific styles matching enterprise software aesthetics
  const variantClasses = {
    // View Button - Gray outline with light gray hover
    outline:
      'border border-[#E5E7EB] bg-white text-[#374151] hover:bg-slate-50 hover:text-[#111827] hover:border-slate-300 shadow-2xs',

    // Previous Button - Neutral secondary background with subtle gray hover
    secondary:
      'border border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900',

    // Next Button - Primary solid blue background with darker blue hover
    primary:
      'border border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-xs font-semibold',

    // Move to Bin Button - Red outline with light red hover background (no solid red)
    'danger-outline':
      'border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700',
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

/**
 * PrimaryButton Component
 * Used for forward progression actions (e.g. "Next Stage")
 */
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

/**
 * SecondaryButton Component
 * Used for backward progression actions (e.g. "Previous Stage")
 */
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

/**
 * DangerOutlineButton Component
 * Used for soft-delete / recycle bin actions ("Move to Bin")
 */
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

/**
 * ViewButton Component
 * Used for opening the detailed view page of a CRM lead
 */
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

/**
 * CrmRowActionGroup Component
 * Responsive action group layout for CRM table rows:
 * - Desktop: [ View ] [ Previous ] [ Next ] [ Move to Bin ] in a non-wrapping flex container.
 * - Mobile / Narrow screens: Collapses cleanly into an overflow menu (...) dropdown to avoid wrapping or table breaking.
 */
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

  // Close dropdown menu when clicking outside
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
      {/* Desktop Layout: [ View ] [ Previous ] [ Next ] [ Move to Bin ] */}
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
          className="h-[40px] px-3 rounded-[10px] border border-[#E5E7EB] bg-white text-[#374151] hover:bg-slate-50 inline-flex items-center justify-center gap-1.5 font-medium text-xs transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/30 cursor-pointer"
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Actions</span>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-1.5 w-48 bg-white border border-[#E5E7EB] rounded-[12px] shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                onView();
              }}
              className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-gray-500 shrink-0" />
              <span>View Lead Details</span>
            </button>

            {hasPrevious && onPrevious && (
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onPrevious();
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-gray-500 shrink-0" />
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
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>Move to Next Stage</span>
              </button>
            )}

            <div className="my-1 border-t border-[#E5E7EB]" />

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                onMoveToBin();
              }}
              className="w-full text-left px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
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
