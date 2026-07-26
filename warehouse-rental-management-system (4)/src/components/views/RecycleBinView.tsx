import React, { useState } from 'react';
import { RecycleBinItem, RecycleBinEntityType } from '../../types';
import { RecycleBinTable } from '../common/RecycleBinTable';
import { Trash2, RefreshCw, Search, ShieldAlert, Filter } from 'lucide-react';
import { Button } from '../ui/Button';

interface RecycleBinViewProps {
  items: RecycleBinItem[];
  onRestore: (item: RecycleBinItem) => void;
  onPermanentDelete: (item: RecycleBinItem) => void;
  onEmptyBin?: () => void;
  searchQuery?: string;
}

export const RecycleBinView: React.FC<RecycleBinViewProps> = ({
  items,
  onRestore,
  onPermanentDelete,
  onEmptyBin,
  searchQuery = ''
}) => {
  const [localSearch, setLocalSearch] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const effectiveSearch = (searchQuery || localSearch).toLowerCase();

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(effectiveSearch) ||
      item.entityType.toLowerCase().includes(effectiveSearch);
    const matchesType =
      typeFilter === 'All' || item.entityType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              🗑 Recycle Bin
            </h1>
            <span className="bg-slate-100 text-gray-700 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-[#E5E7EB]">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Soft-deleted items are safely stored here for 30 days. You can restore them anytime or delete them permanently.
          </p>
        </div>

        {items.length > 0 && onEmptyBin && (
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={onEmptyBin}
          >
            Empty Recycle Bin
          </Button>
        )}
      </div>

      {/* Info Notice Banner */}
      <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-[12px] flex items-center gap-3 text-xs text-blue-900">
        <ShieldAlert className="w-4 h-4 text-[#2563EB] shrink-0" />
        <p className="leading-relaxed">
          <span className="font-semibold text-blue-950">Automatic Soft-Delete Protection:</span> Moving an item to the Recycle Bin immediately hides it from active lease records and property tables without destroying data. Items expire permanently after 30 days.
        </p>
      </div>

      {/* Search & Filters */}
      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 border border-[#E5E7EB] rounded-[14px]">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search soft-deleted items..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-[#E5E7EB] rounded-[8px] px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            >
              <option value="All">All Types</option>
              <option value="Warehouse">Warehouses</option>
              <option value="Tenant">Tenants</option>
              <option value="Rent Payment">Rent Payments</option>
              <option value="Broker">Brokers</option>
              <option value="CRM Lead">CRM Leads</option>
              <option value="Document">Documents</option>
              <option value="Editor Account">Editor Accounts</option>
            </select>
          </div>
        </div>
      )}

      {/* Main Recycle Bin Table */}
      <RecycleBinTable
        items={filteredItems}
        onRestore={onRestore}
        onPermanentDelete={onPermanentDelete}
      />
    </div>
  );
};
