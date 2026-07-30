import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Filter,
  Eye,
  Edit,
  LayoutGrid,
  List,
  Calendar,
  User,
  IndianRupee
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DeleteButton } from '../common/DeleteButton';
import { Warehouse } from '../../types';

interface WarehousesViewProps {
  warehouses: Warehouse[];
  onViewWarehouse: (warehouse: Warehouse) => void;
  onEditWarehouse: (warehouse: Warehouse) => void;
  onDeleteWarehouse: (warehouse: Warehouse) => void;
  onAddWarehouse: () => void;
  searchQuery: string;
}

const getFirstLineAddress = (address?: string, legacyZone?: string): string => {
  if (address && address.trim()) {
    const lines = address.split('\n').map((line) => line.trim()).filter(Boolean);
    if (lines.length > 0) {
      let firstLine = lines[0];
      firstLine = firstLine.replace(/[,.]+$/, '');
      return `${firstLine}...`;
    }
  }
  return legacyZone ? `${legacyZone}...` : 'Address not specified';
};

export const WarehousesView: React.FC<WarehousesViewProps> = ({
  warehouses,
  onViewWarehouse,
  onEditWarehouse,
  onDeleteWarehouse,
  onAddWarehouse,
  searchQuery
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredWarehouses = warehouses.filter((wh) => {
    const matchesSearch =
      wh.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (wh.tenantName && wh.tenantName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (wh.address && wh.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (wh.locationZone && wh.locationZone.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || wh.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Warehouse['status']) => {
    switch (status) {
      case 'Occupied':
        return <Badge variant="success">Occupied</Badge>;
      case 'Vacant':
        return <Badge variant="warning">Vacant</Badge>;
      case 'Maintenance':
        return <Badge variant="danger">Under Maintenance</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB] dark:border-[#334155]">
        <div>
          <h1 className="text-xl font-bold text-[#111827] dark:text-[#F8FAFC] tracking-tight">
            Warehouse Properties
          </h1>
          <p className="text-xs text-gray-500 dark:text-[#94A3B8] mt-0.5">
            Manage commercial warehouse units, floor areas, rental pricing, and tenancy leases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[10px] p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-gray-500 dark:text-[#CBD5E1] hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-gray-500 dark:text-[#CBD5E1] hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            onClick={onAddWarehouse}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Warehouse
          </Button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-3 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[12px] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-[#94A3B8] font-medium px-2 py-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter By:</span>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-[#111827] rounded-lg p-0.5">
            {['All', 'Occupied', 'Vacant', 'Maintenance'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md transition-all font-medium cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-blue-400 shadow-xs'
                    : 'text-gray-600 dark:text-[#CBD5E1] hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-gray-500 dark:text-[#94A3B8]">
          Showing <strong className="text-[#111827] dark:text-[#F8FAFC]">{filteredWarehouses.length}</strong> property unit(s)
        </span>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWarehouses.map((wh) => (
            <Card
              key={wh.id}
              className="group hover:border-[#2563EB] transition-all hover:shadow-md flex flex-col justify-between"
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[10px] bg-blue-50 dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#111827] dark:text-[#F8FAFC] group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                        {wh.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-[#94A3B8] font-medium" title={wh.address}>
                        {getFirstLineAddress(wh.address, wh.locationZone)}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(wh.status)}
                </div>

                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 dark:bg-[#111827]/80 rounded-[10px] border border-[#E5E7EB]/80 dark:border-[#334155] text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 dark:text-[#64748B] block">Area</span>
                    <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">
                      {wh.areaSqFt.toLocaleString('en-IN')} sq ft
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 dark:text-[#64748B] block">Power Grid</span>
                    <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">{wh.powerCapacity}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 dark:text-[#64748B] block">Height</span>
                    <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">{wh.ceilingHeightFt} Ft</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-gray-600 dark:text-[#CBD5E1]">
                    <span className="flex items-center gap-1.5 text-gray-500 dark:text-[#94A3B8]">
                      <User className="w-3.5 h-3.5 text-gray-400 dark:text-[#64748B]" />
                      Tenant:
                    </span>
                    <span className="font-medium text-[#111827] dark:text-[#F8FAFC]">
                      {wh.tenantName ? wh.tenantName : '— Vacant —'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600 dark:text-[#CBD5E1]">
                    <span className="flex items-center gap-1.5 text-gray-500 dark:text-[#94A3B8]">
                      <IndianRupee className="w-3.5 h-3.5 text-gray-400 dark:text-[#64748B]" />
                      Monthly Rent:
                    </span>
                    <span className="font-bold text-[#2563EB] dark:text-blue-400">
                      ₹{wh.monthlyRent.toLocaleString('en-IN')} / mo
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600 dark:text-[#CBD5E1]">
                    <span className="flex items-center gap-1.5 text-gray-500 dark:text-[#94A3B8]">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-[#64748B]" />
                      Lease End:
                    </span>
                    <span className="font-medium text-[#111827] dark:text-[#F8FAFC]">
                      {wh.leaseEnd ? wh.leaseEnd : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>

              <div className="px-5 py-3 bg-slate-50/80 dark:bg-[#111827]/60 border-t border-[#E5E7EB] dark:border-[#334155] flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Eye className="w-3.5 h-3.5" />}
                  onClick={() => onViewWarehouse(wh)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<Edit className="w-3.5 h-3.5" />}
                  onClick={() => onEditWarehouse(wh)}
                >
                  Edit
                </Button>
                <DeleteButton onClick={() => onDeleteWarehouse(wh)} />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#111827] dark:text-[#F8FAFC]">
                <thead className="bg-slate-50 dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155] text-gray-500 dark:text-[#CBD5E1] font-semibold">
                  <tr>
                    <th className="px-5 py-3">Warehouse Name</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Tenant</th>
                    <th className="px-5 py-3">Monthly Rent</th>
                    <th className="px-5 py-3">Area (Sq Ft)</th>
                    <th className="px-5 py-3">Lease End</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
                  {filteredWarehouses.map((wh) => (
                    <tr key={wh.id} className="hover:bg-slate-50/80 dark:hover:bg-[#273549]/50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#111827] dark:text-[#F8FAFC]">{wh.name}</td>
                      <td className="px-5 py-3.5">{getStatusBadge(wh.status)}</td>
                      <td className="px-5 py-3.5">{wh.tenantName || '— Vacant —'}</td>
                      <td className="px-5 py-3.5 font-bold text-[#2563EB] dark:text-blue-400">
                        ₹{wh.monthlyRent.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-3.5">{wh.areaSqFt.toLocaleString('en-IN')} sq ft</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-[#94A3B8]">{wh.leaseEnd || '—'}</td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewWarehouse(wh)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onEditWarehouse(wh)}
                        >
                          Edit
                        </Button>
                        <DeleteButton onClick={() => onDeleteWarehouse(wh)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
