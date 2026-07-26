import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import {
  Briefcase,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Broker } from '../../types';

interface BrokerChartProps {
  brokers: Broker[];
  searchTerm?: string;
}

type SortField = 'name' | 'totalDealsClosed' | 'revenueGeneratedInr' | 'commissionEarned' | 'pendingCommission';

/**
 * BrokerChart Component
 * Renders Broker Commission Summary horizontal bar chart and detailed
 * filterable, sortable ledger table with pagination choices (10, 25, 50, 100 rows).
 */
export const BrokerChart: React.FC<BrokerChartProps> = ({
  brokers,
  searchTerm: globalSearchTerm = ''
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('revenueGeneratedInr');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const activeSearchTerm = localSearchTerm || globalSearchTerm;

  // Chart Data: Top Brokers by Revenue
  const chartData = useMemo(() => {
    return brokers
      .map((b) => ({
        name: b.name,
        revenue: b.revenueGeneratedInr || b.totalDealsClosed * 100000,
        commission: b.pendingCommission
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [brokers]);

  // Filter & Search Table
  const filteredBrokers = useMemo(() => {
    return brokers.filter(
      (b) =>
        b.name.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
        (b.companyName && b.companyName.toLowerCase().includes(activeSearchTerm.toLowerCase())) ||
        b.email.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
        b.phone.includes(activeSearchTerm)
    );
  }, [brokers, activeSearchTerm]);

  // Sort Table
  const sortedBrokers = useMemo(() => {
    return [...filteredBrokers].sort((a, b) => {
      let aVal: any = a[sortField as keyof Broker] ?? 0;
      let bVal: any = b[sortField as keyof Broker] ?? 0;

      if (sortField === 'commissionEarned') {
        aVal = a.totalCommissionEarned ?? (a.pendingCommission * 2);
        bVal = b.totalCommissionEarned ?? (b.pendingCommission * 2);
      } else if (sortField === 'revenueGeneratedInr') {
        aVal = a.revenueGeneratedInr ?? (a.totalDealsClosed * 100000);
        bVal = b.revenueGeneratedInr ?? (b.totalDealsClosed * 100000);
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredBrokers, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedBrokers.length / itemsPerPage));
  const paginatedBrokers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedBrokers.slice(start, start + itemsPerPage);
  }, [sortedBrokers, currentPage, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#2563EB]" />
            Top Brokers by Lease Revenue (Horizontal Bar)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {brokers.length === 0 ? (
            <div className="h-64 border border-dashed border-[#E5E7EB] bg-slate-50/60 rounded-[12px] flex flex-col items-center justify-center p-6 text-center">
              <Briefcase className="w-10 h-10 text-gray-300 mb-2" />
              <h4 className="text-sm font-bold text-[#111827]">No report data available</h4>
              <p className="text-xs text-gray-500 max-w-xs mt-1">
                Reports will automatically generate once warehouse payments are recorded.
              </p>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#111827', fontWeight: 600 }}
                    width={100}
                  />
                  <Tooltip
                    formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E5E7EB',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    name="Revenue Generated (₹)"
                    fill="#2563EB"
                    radius={[0, 6, 6, 0]}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commission Summary Table Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
          <div>
            <CardTitle className="text-sm font-bold">Broker Commission Ledger</CardTitle>
            <p className="text-xs text-gray-500">
              Detailed tracking of closed deals, generated revenues, and pending payouts per partner broker.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search broker..."
                value={localSearchTerm}
                onChange={(e) => {
                  setLocalSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 pr-3 py-1.5 border border-[#E5E7EB] rounded-[8px] text-xs w-48 focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#111827]">
              <thead className="bg-slate-50 border-b border-[#E5E7EB] text-gray-500 font-semibold">
                <tr>
                  <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      <span>Broker</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('totalDealsClosed')}>
                    <div className="flex items-center gap-1">
                      <span>Deals Closed</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer select-none" onClick={() => handleSort('revenueGeneratedInr')}>
                    <div className="flex items-center justify-end gap-1">
                      <span>Revenue Generated (₹)</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer select-none" onClick={() => handleSort('commissionEarned')}>
                    <div className="flex items-center justify-end gap-1">
                      <span>Commission Earned (₹)</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer select-none" onClick={() => handleSort('pendingCommission')}>
                    <div className="flex items-center justify-end gap-1">
                      <span>Pending Commission (₹)</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {paginatedBrokers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400 text-xs">
                      No brokers registered yet.
                    </td>
                  </tr>
                ) : (
                  paginatedBrokers.map((b) => {
                    const revenue = b.revenueGeneratedInr || b.totalDealsClosed * 100000;
                    const earned = b.totalCommissionEarned || b.pendingCommission * 2;

                    return (
                      <tr key={b.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-semibold text-[#111827]">
                          <div>{b.name}</div>
                          {b.companyName && (
                            <div className="text-[10px] font-normal text-gray-500">{b.companyName}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-800">{b.totalDealsClosed} deals</td>
                        <td className="px-4 py-3 text-right font-semibold text-[#111827]">
                          ₹{revenue.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-emerald-700">
                          ₹{earned.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-[#2563EB]">
                          ₹{b.pendingCommission.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination & Rows Selector */}
          <div className="p-3 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-[#E5E7EB] rounded-[6px] px-2 py-1 bg-white focus:outline-none focus:border-[#2563EB]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>
                Showing {sortedBrokers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
                {Math.min(currentPage * itemsPerPage, sortedBrokers.length)} of {sortedBrokers.length} entries
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="p-1 border border-[#E5E7EB] rounded-[6px] hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="p-1 border border-[#E5E7EB] rounded-[6px] hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
