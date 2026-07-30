import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';

/**
 * Accessible Modal / Dialog Component with corporate styling and dark mode support
 */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md'
}) => {
  const { playSound, triggerHaptic } = useExperience();

  useEffect(() => {
    if (isOpen) {
      playSound('modalOpen');
      triggerHaptic('light');
    }
  }, [isOpen]);

  const handleClose = () => {
    playSound('modalClose');
    triggerHaptic('light');
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div
        className="fixed inset-0"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white dark:bg-[#1E293B] rounded-[16px] border border-[#E5E7EB] dark:border-[#334155] shadow-2xl overflow-hidden z-10 my-8 transition-colors`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] dark:border-[#334155]">
          <div>
            <h3 className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">{title}</h3>
            {description && (
              <p className="text-xs text-gray-500 dark:text-[#94A3B8] mt-0.5">{description}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-400 dark:text-[#94A3B8] hover:text-gray-600 dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-[#273549] rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto text-[#111827] dark:text-[#F8FAFC]">{children}</div>
      </div>
    </div>
  );
};
