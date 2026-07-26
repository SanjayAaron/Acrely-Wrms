import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  LayoutGrid,
  List,
  Calendar,
  User,
  Zap,
  Maximize,
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

/**
 * Helper function to extract and display only the first line of the warehouse address.
 * Example: "No. 24, SIPCOT Industrial Park..."
 */
const getFirstLineAddress = (address?: string, legacyZone?: string): string => {
  if (address && address.trim()) {
    const lines = address.split('\n').map((line) => line.trim()).filter(Boolean);
    if (lines.length > 0) {
      let firstLine = lines[0];
      // Strip trailing commas/periods before adding ellipsis for a clean display
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

  // Filter Logic matching search query across name, tenant name, and address
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-xl font-bold text-[#111827] tracking-tight">
            Warehouse Properties
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage commercial warehouse units, floor areas, rental pricing, and tenancy leases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-white border border-[#E5E7EB] rounded-[10px] p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-gray-500 hover:text-gray-900'
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
      <div className="p-3 bg-white border border-[#E5E7EB] rounded-[12px] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-gray-500 font-medium px-2 py-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter By:</span>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            {['All', 'Occupied', 'Vacant', 'Maintenance'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  statusFilter === st
                    ? 'bg-white text-[#2563EB] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-gray-500">
          Showing <strong className="text-[#111827]">{filteredWarehouses.length}</strong> property unit(s)
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
                {/* Title & Warehouse Address (First Line Only) */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[10px] bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-sm shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#111827] group-hover:text-[#2563EB] transition-colors">
                        {wh.name}
                      </h3>
                      {/* Displays only the first line of the warehouse address */}
                      <p className="text-xs text-gray-500 font-medium" title={wh.address}>
                        {getFirstLineAddress(wh.address, wh.locationZone)}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(wh.status)}
                </div>

                {/* Property Specs summary */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-[10px] border border-[#E5E7EB]/80 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 block">Area</span>
                    <span className="font-semibold text-[#111827]">
                      {wh.areaSqFt.toLocaleString('en-IN')} sq ft
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Power Grid</span>
                    <span className="font-semibold text-[#111827]">{wh.powerCapacity}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Height</span>
                    <span className="font-semibold text-[#111827]">{wh.ceilingHeightFt} Ft</span>
                  </div>
                </div>

                {/* Tenant & Lease Info */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      Tenant:
                    </span>
                    <span className="font-medium text-[#111827]">
                      {wh.tenantName ? wh.tenantName : '— Vacant —'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
                      Monthly Rent:
                    </span>
                    <span className="font-bold text-[#2563EB]">
                      ₹{wh.monthlyRent.toLocaleString('en-IN')} / mo
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      Lease End:
                    </span>
                    <span className="font-medium text-[#111827]">
                      {wh.leaseEnd ? wh.leaseEnd : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>

              {/* Card Footer Actions */}
              <div className="px-5 py-3 bg-slate-50/80 border-t border-[#E5E7EB] flex items-center justify-end gap-2">
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
              <table className="w-full text-left text-xs text-[#111827]">
                <thead className="bg-slate-50 border-b border-[#E5E7EB] text-gray-500 font-semibold">
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
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredWarehouses.map((wh) => (
                    <tr key={wh.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#111827]">{wh.name}</td>
                      <td className="px-5 py-3.5">{getStatusBadge(wh.status)}</td>
                      <td className="px-5 py-3.5">{wh.tenantName || '— Vacant —'}</td>
                      <td className="px-5 py-3.5 font-bold text-[#2563EB]">
                        ₹{wh.monthlyRent.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-3.5">{wh.areaSqFt.toLocaleString('en-IN')} sq ft</td>
                      <td className="px-5 py-3.5 text-gray-500">{wh.leaseEnd || '—'}</td>
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
