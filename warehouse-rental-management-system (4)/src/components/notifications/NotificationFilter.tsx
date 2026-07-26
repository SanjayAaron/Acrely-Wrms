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

/**
 * Reusable Filter item button inside Notification Sidebar.
 */
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
          ? 'bg-blue-50 text-[#2563EB] font-semibold border border-blue-100 shadow-2xs'
          : 'text-gray-600 hover:bg-slate-100/80 hover:text-[#111827]'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={`shrink-0 ${isActive ? 'text-[#2563EB]' : 'text-gray-400'}`}>
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>

      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 transition-colors ${
          isActive
            ? 'bg-[#2563EB] text-white'
            : 'bg-slate-100 text-gray-500 group-hover:bg-slate-200'
        }`}
      >
        {count}
      </span>
    </button>
  );
};
