import React from 'react';
import { BellOff, RefreshCw } from 'lucide-react';

interface NotificationEmptyStateProps {
  onReset?: () => void;
  message?: string;
}

/**
 * Reusable Empty State display for Notification Center.
 */
export const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({
  onReset,
  message = 'No notifications available.',
}) => {
  return (
    <div className="p-12 text-center bg-white border border-dashed border-[#E5E7EB] rounded-[16px] flex flex-col items-center justify-center my-auto">
      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-gray-400 mb-3.5">
        <BellOff className="w-7 h-7" />
      </div>

      <h3 className="text-base font-bold text-[#111827]">{message}</h3>
      <p className="text-xs text-gray-500 max-w-sm mt-1 mb-4 leading-relaxed">
        We couldn't find any notifications matching your current filter criteria or search query.
      </p>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="h-[38px] px-4 bg-slate-100 hover:bg-slate-200 text-[#111827] text-xs font-semibold rounded-[10px] inline-flex items-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Filters & Search</span>
        </button>
      )}
    </div>
  );
};
