import React, { useState } from 'react';
import { Calendar, Filter, Search } from 'lucide-react';
import { DateRangePicker } from './DateRangePicker';

export type DateRangeOption = 
  | 'This Month'
  | 'Last Month'
  | 'Last 3 Months'
  | 'Last 6 Months'
  | 'Yearly'
  | 'Custom Range';

interface ReportFiltersProps {
  dateRange: DateRangeOption;
  onDateRangeChange: (range: DateRangeOption) => void;
  customStartDate?: string;
  customEndDate?: string;
  onCustomDateChange?: (start: string, end: string) => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

/**
 * ReportFilters Component
 * Allows users to filter financial and operational reports by date range (This Month, Last Month, etc.)
 * and search records across warehouses, tenants, brokers, and invoices.
 */
export const ReportFilters: React.FC<ReportFiltersProps> = ({
  dateRange,
  onDateRangeChange,
  customStartDate = '',
  customEndDate = '',
  onCustomDateChange,
  searchTerm = '',
  onSearchChange
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleRangeClick = (range: DateRangeOption) => {
    onDateRangeChange(range);
    if (range === 'Custom Range') {
      setIsDatePickerOpen(true);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] p-3 rounded-[12px] shadow-2xs">
      {/* Filter Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-[#F8FAFC] shrink-0 mr-1">
          <Filter className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
          <span>Period:</span>
        </div>

        {(
          [
            'This Month',
            'Last Month',
            'Last 3 Months',
            'Last 6 Months',
            'Yearly',
            'Custom Range'
          ] as DateRangeOption[]
        ).map((range) => (
          <button
            key={range}
            type="button"
            onClick={() => handleRangeClick(range)}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-medium transition-colors cursor-pointer ${
              dateRange === range
                ? 'bg-[#2563EB] text-white font-semibold'
                : 'text-gray-600 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-[#273549] hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {range}
          </button>
        ))}

        {dateRange === 'Custom Range' && customStartDate && customEndDate && (
          <div
            onClick={() => setIsDatePickerOpen(true)}
            className="flex items-center gap-1.5 text-xs bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-900 text-[#2563EB] dark:text-blue-400 px-2.5 py-1 rounded-[6px] font-semibold cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/80"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {customStartDate} to {customEndDate}
            </span>
          </div>
        )}
      </div>

      {/* Global Search Input within Reports */}
      {onSearchChange && (
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400 dark:text-[#64748B]" />
          <input
            type="text"
            placeholder="Search warehouse, tenant, broker..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#334155] text-gray-900 dark:text-[#F8FAFC] placeholder-gray-400 dark:placeholder-gray-500 rounded-[8px] text-xs focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-400"
          />
        </div>
      )}

      {/* Date Range Picker Modal for Custom Range */}
      {isDatePickerOpen && (
        <DateRangePicker
          isOpen={isDatePickerOpen}
          onClose={() => setIsDatePickerOpen(false)}
          initialStartDate={customStartDate}
          initialEndDate={customEndDate}
          onApply={(start, end) => {
            if (onCustomDateChange) {
              onCustomDateChange(start, end);
            }
          }}
        />
      )}
    </div>
  );
};
