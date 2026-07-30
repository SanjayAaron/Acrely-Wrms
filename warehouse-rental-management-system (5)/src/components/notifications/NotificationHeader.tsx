import React from 'react';
import { CheckCheck, Trash, X, ArrowUpDown } from 'lucide-react';
import { NotificationSearch } from './NotificationSearch';
import { NotificationSortOption } from '../../types/notifications';

interface NotificationHeaderProps {
  unreadCount: number;
  totalCount: number;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  sortOption: NotificationSortOption;
  onSortChange: (sort: NotificationSortOption) => void;
  onMarkAllAsRead: () => void;
  onClearRead: () => void;
  onClose: () => void;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  unreadCount,
  totalCount,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  onMarkAllAsRead,
  onClearRead,
  onClose,
}) => {
  return (
    <header className="p-4 sm:p-5 bg-white dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155] rounded-t-[16px] space-y-3.5">
      {/* Top Bar: Title, Counts & Close */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🔔</span>
          <h2 className="text-base sm:text-lg font-extrabold text-[#111827] dark:text-[#F8FAFC] tracking-tight">
            Notification Center
          </h2>

          {/* Counts Badges */}
          <div className="flex items-center gap-1.5 ml-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              {unreadCount} Unread
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {totalCount} Total
            </span>
          </div>
        </div>

        {/* Global Modal Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            className="h-[36px] px-3 bg-white dark:bg-[#1E293B] hover:bg-blue-50 dark:hover:bg-[#273549] border border-[#E5E7EB] dark:border-[#334155] hover:border-blue-300 text-gray-700 dark:text-[#CBD5E1] hover:text-[#2563EB] dark:hover:text-[#F8FAFC] text-xs font-medium rounded-[10px] inline-flex items-center gap-1.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            title="Mark all notifications as read"
          >
            <CheckCheck className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
            <span className="hidden sm:inline">Mark All as Read</span>
          </button>

          <button
            type="button"
            onClick={onClearRead}
            className="h-[36px] px-3 bg-white dark:bg-[#1E293B] hover:bg-slate-100 dark:hover:bg-[#273549] border border-[#E5E7EB] dark:border-[#334155] text-gray-700 dark:text-[#CBD5E1] text-xs font-medium rounded-[10px] inline-flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
            title="Clear all read notifications"
          >
            <Trash className="w-3.5 h-3.5 text-gray-500 dark:text-[#94A3B8]" />
            <span className="hidden sm:inline">Clear Read</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-[36px] w-[36px] bg-slate-100 dark:bg-[#273549] hover:bg-slate-200 dark:hover:bg-[#334155] text-gray-600 dark:text-[#CBD5E1] hover:text-[#111827] dark:hover:text-[#F8FAFC] rounded-[10px] flex items-center justify-center transition-all duration-200 cursor-pointer"
            aria-label="Close Notification Center"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="sm:col-span-2">
          <NotificationSearch value={searchQuery} onChange={onSearchChange} />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 dark:text-[#94A3B8] shrink-0 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 dark:text-[#64748B]" /> Sort:
          </span>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as NotificationSortOption)}
            className="w-full bg-slate-50 dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#334155] text-xs font-medium text-[#111827] dark:text-[#F8FAFC] rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="unread_first">Unread First</option>
            <option value="priority">Priority (Critical First)</option>
          </select>
        </div>
      </div>
    </header>
  );
};
