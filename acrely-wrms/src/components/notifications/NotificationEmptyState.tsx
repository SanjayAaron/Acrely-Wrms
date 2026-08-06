import React from 'react';
import { BellOff, RefreshCw } from 'lucide-react';

interface NotificationEmptyStateProps {
  onReset?: () => void;
  message?: string;
}

export const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({
  onReset,
  message = 'No notifications available.',
}) => {
  return (
    <div className="p-12 text-center bg-white dark:bg-[#1E293B] border border-dashed border-[#E5E7EB] dark:border-[#334155] rounded-[16px] flex flex-col items-center justify-center my-auto">
      <div className="w-14 h-14 bg-slate-100 dark:bg-[#273549] rounded-full flex items-center justify-center text-gray-400 dark:text-[#64748B] mb-3.5">
        <BellOff className="w-7 h-7" />
      </div>

      <h3 className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">{message}</h3>
      <p className="text-xs text-gray-500 dark:text-[#94A3B8] max-w-sm mt-1 mb-4 leading-relaxed">
        We couldn't find any notifications matching your current filter criteria or search query.
      </p>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="h-[38px] px-4 bg-slate-100 dark:bg-[#273549] hover:bg-slate-200 dark:hover:bg-[#334155] text-[#111827] dark:text-[#F8FAFC] text-xs font-semibold rounded-[10px] inline-flex items-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Filters & Search</span>
        </button>
      )}
    </div>
  );
};
