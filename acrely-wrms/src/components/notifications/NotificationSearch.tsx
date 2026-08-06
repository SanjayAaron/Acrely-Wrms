import React from 'react';
import { Search, X } from 'lucide-react';

interface NotificationSearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const NotificationSearch: React.FC<NotificationSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search by warehouse, tenant, invoice, broker, lead, staff...',
}) => {
  return (
    <div className="relative w-full">
      <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400 dark:text-[#64748B] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#334155] text-xs text-[#111827] dark:text-[#F8FAFC] rounded-[10px] pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-[#64748B]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 dark:text-[#64748B] dark:hover:text-[#F8FAFC] transition-colors p-0.5 rounded-full"
          title="Clear Search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
