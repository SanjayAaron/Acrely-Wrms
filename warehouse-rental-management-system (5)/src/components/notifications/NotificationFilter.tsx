import React from 'react';
import { NotificationModule } from '../../types/notifications';

interface NotificationFilterProps {
  id: NotificationModule;
  label: string;
  icon: React.ReactNode;
  count: number;
  isActive: boolean;
  onClick: (id: NotificationModule) => void;
}

export const NotificationFilter: React.FC<NotificationFilterProps> = ({
  id,
  label,
  icon,
  count,
  isActive,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-medium transition-all duration-200 cursor-pointer ${
        isActive
          ? 'bg-blue-50 dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-400 font-semibold border border-blue-100 dark:border-blue-800 shadow-2xs'
          : 'text-gray-600 dark:text-[#CBD5E1] hover:bg-slate-100/80 dark:hover:bg-[#273549] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={`shrink-0 ${isActive ? 'text-[#2563EB] dark:text-blue-400' : 'text-gray-400 dark:text-[#64748B]'}`}>
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>

      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 transition-colors ${
          isActive
            ? 'bg-[#2563EB] text-white'
            : 'bg-slate-100 dark:bg-slate-800 text-gray-500 dark:text-[#94A3B8] group-hover:bg-slate-200'
        }`}
      >
        {count}
      </span>
    </button>
  );
};
