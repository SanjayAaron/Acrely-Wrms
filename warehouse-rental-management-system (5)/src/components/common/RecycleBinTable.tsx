import React from 'react';
import { RecycleBinItem, RecycleBinEntityType } from '../../types';
import { RestoreButton } from './RestoreButton';
import { PermanentDeleteButton } from './PermanentDeleteButton';
import { Trash2, Calendar, Clock, FolderOpen } from 'lucide-react';

interface RecycleBinTableProps {
  items: RecycleBinItem[];
  onRestore: (item: RecycleBinItem) => void;
  onPermanentDelete: (item: RecycleBinItem) => void;
}

/**
 * Badge color mapping per requested entity specs:
 * Warehouse = Blue
 * Tenant = Green
 * Broker = Purple
 * CRM = Orange
 * Payment = Emerald
 * Document = Gray
 * Editor Account = Indigo
 */
const getBadgeStyle = (type: RecycleBinEntityType): string => {
  switch (type) {
    case 'Warehouse':
      return 'bg-blue-50 dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-400 border-blue-200 dark:border-blue-900';
    case 'Tenant':
      return 'bg-green-50 dark:bg-emerald-950/80 text-[#16A34A] dark:text-emerald-400 border-green-200 dark:border-emerald-900';
    case 'Broker':
      return 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900';
    case 'CRM Lead':
      return 'bg-orange-50 dark:bg-amber-950/80 text-orange-700 dark:text-amber-400 border-orange-200 dark:border-amber-900';
    case 'Rent Payment':
      return 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900';
    case 'Document':
      return 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-[#CBD5E1] border-gray-200 dark:border-slate-700';
    case 'Editor Account':
      return 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900';
    default:
      return 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-[#CBD5E1] border-gray-200 dark:border-slate-700';
  }
};

export const RecycleBinTable: React.FC<RecycleBinTableProps> = ({
  items,
  onRestore,
  onPermanentDelete
}) => {
  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[16px] p-12 text-center shadow-xs my-4">
        <div className="w-12 h-12 bg-slate-100 dark:bg-[#111827] text-gray-400 dark:text-[#64748B] rounded-full flex items-center justify-center mx-auto mb-3">
          <Trash2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">Recycle Bin is empty.</h3>
        <p className="text-xs text-gray-500 dark:text-[#94A3B8] max-w-md mx-auto mt-1">
          Deleted items will appear here for 30 days before permanent removal. You can safely restore them at any time.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[16px] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-[#111827] border-b border-[#E5E7EB] dark:border-[#334155] text-gray-500 dark:text-[#CBD5E1] font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Name</th>
              <th className="px-5 py-3.5">Deleted On</th>
              <th className="px-5 py-3.5">Days Remaining</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-[#273549]/50 transition-colors">
                {/* Type Badge */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getBadgeStyle(
                      item.entityType
                    )}`}
                  >
                    {item.entityType === 'CRM Lead' ? 'CRM' : item.entityType}
                  </span>
                </td>

                {/* Name */}
                <td className="px-5 py-4 font-semibold text-[#111827] dark:text-[#F8FAFC] whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-gray-400 dark:text-[#64748B] shrink-0" />
                    <span>{item.name}</span>
                  </div>
                </td>

                {/* Deleted On */}
                <td className="px-5 py-4 text-gray-600 dark:text-[#CBD5E1] whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-[#64748B]" />
                    <span>{item.deletedDate}</span>
                  </div>
                </td>

                {/* Days Remaining */}
                <td className="px-5 py-4 text-gray-600 dark:text-[#CBD5E1] whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900 text-[11px]">
                      {item.daysRemaining} days left
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <RestoreButton onClick={() => onRestore(item)} />
                    <PermanentDeleteButton onClick={() => onPermanentDelete(item)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
