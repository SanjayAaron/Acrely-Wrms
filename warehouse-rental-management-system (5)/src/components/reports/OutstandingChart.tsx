import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  AlertTriangle,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Printer
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { RentPayment } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface OutstandingChartProps {
  payments: RentPayment[];
  searchTerm?: string;
}

type SortField = 'invoiceNumber' | 'warehouseName' | 'tenantName' | 'dueDate' | 'amount' | 'status';

/**
 * OutstandingChart Component
 * Renders Rent Outstanding Aging stacked bar chart and filterable, sortable,
 * paginated receivables ledger table with variable page sizes (10, 25, 50, 100 rows).
 */
export const OutstandingChart: React.FC<OutstandingChartProps> = ({
  payments,
  searchTerm: globalSearchTerm = ''
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const activeSearchTerm = localSearchTerm || globalSearchTerm;
  const today = new Date();

  // Filter pending or overdue payments
  const outstandingPayments = useMemo(() => {
    return payments.filter((p) => p.status === 'Pending' || p.status === 'Overdue');
  }, [payments]);

  // Aggregate into aging buckets
  const agingData = useMemo(() => {
    const buckets = {
      Current: 0,
      '1-30 Days': 0,
      '31-60 Days': 0,
      '61-90 Days': 0,
      '90+ Days': 0
    };

    outstandingPayments.forEach((p) => {
      const due = new Date(p.dueDate);
      const diffTime = today.getTime() - due.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      const amt = p.outstandingAmount ?? p.amount;

      if (diffDays <= 0) {
        buckets.Current += amt;
      } else if (diffDays <= 30) {
        buckets['1-30 Days'] += amt;
      } else if (diffDays <= 60) {
        buckets['31-60 Days'] += amt;
      } else if (diffDays <= 90) {
        buckets['61-90 Days'] += amt;
      } else {
        buckets['90+ Days'] += amt;
      }
    });

    return [
      {
        category: 'Aging Buckets',
        Current: buckets.Current,
        '1-30 Days': buckets['1-30 Days'],
        '31-60 Days': buckets['31-60 Days'],
        '61-90 Days': buckets['61-90 Days'],
        '90+ Days': buckets['90+ Days']
      }
    ];
  }, [outstandingPayments, today]);

  const totalOutstanding = outstandingPayments.reduce(
    (acc, p) => acc + (p.outstandingAmount ?? p.amount),
    0
  );

  // Search & Sorting for Table
  const filteredTablePayments = useMemo(() => {
    return outstandingPayments.filter(
      (p) =>
        p.invoiceNumber.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
        p.warehouseName.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
        p.tenantName.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
        p.status.toLowerCase().includes(activeSearchTerm.toLowerCase())
    );
  }, [outstandingPayments, activeSearchTerm]);

  const sortedTablePayments = useMemo(() => {
    return [...filteredTablePayments].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'amount') {
        aVal = a.outstandingAmount ?? a.amount;
        bVal = b.outstandingAmount ?? b.amount;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTablePayments, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedTablePayments.length / itemsPerPage));
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedTablePayments.slice(start, start + itemsPerPage);
  }, [sortedTablePayments, currentPage, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              Outstanding Rent Aging Breakdown (Stacked)
            </span>
            <span className="text-xs font-bold text-[#F59E0B]">
              Total Due: ₹{totalOutstanding.toLocaleString('en-IN')}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {totalOutstanding === 0 ? (
            <div className="h-64 border border-dashed border-[#E5E7EB] dark:border-[#334155] bg-slate-50/60 dark:bg-slate-800/40 rounded-[12px] flex flex-col items-center justify-center p-6 text-center">
              <AlertTriangle className="w-10 h-10 text-gray-300 dark:text-[#64748B] mb-2" />
              <h4 className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">No report data available</h4>
              <p className="text-xs text-gray-500 dark:text-[#94A3B8] max-w-xs mt-1">
                Reports will automatically generate once warehouse payments are recorded.
              </p>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={agingData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#E5E7EB'} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: isDark ? '#94A3B8' : '#6B7280' }}
                    axisLine={{ stroke: isDark ? '#475569' : '#D1D5DB' }}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <YAxis type="category" dataKey="category" hide />
                  <Tooltip
                    formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      borderColor: isDark ? '#334155' : '#E5E7EB',
                      color: isDark ? '#F8FAFC' : '#111827',
                      borderRadius: '8px',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    itemStyle={{ color: isDark ? '#F8FAFC' : '#111827' }}
                    labelStyle={{ color: isDark ? '#F8FAFC' : '#111827', fontWeight: 600 }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', color: isDark ? '#CBD5E1' : '#374151' }} />
                  <Bar dataKey="Current" stackId="a" fill={isDark ? '#3B82F6' : '#2563EB'} name="Current (Not Due)" />
                  <Bar dataKey="1-30 Days" stackId="a" fill={isDark ? '#FBBF24' : '#F59E0B'} name="1-30 Days Overdue" />
                  <Bar dataKey="31-60 Days" stackId="a" fill={isDark ? '#FB923C' : '#F97316'} name="31-60 Days Overdue" />
                  <Bar dataKey="61-90 Days" stackId="a" fill={isDark ? '#F87171' : '#E11D48'} name="61-90 Days Overdue" />
                  <Bar dataKey="90+ Days" stackId="a" fill={isDark ? '#EF4444' : '#991B1B'} name="90+ Days Critical" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Outstanding Payment Table Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
          <div>
            <CardTitle className="text-sm font-bold">Outstanding Receivables Ledger</CardTitle>
            <p className="text-xs text-gray-500">
              Filterable ledger of pending and overdue rent invoices requiring collection.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoice or tenant..."
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
                  <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('invoiceNumber')}>
                    <div className="flex items-center gap-1">
                      <span>Invoice #</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('warehouseName')}>
                    <div className="flex items-center gap-1">
                      <span>Warehouse</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('tenantName')}>
                    <div className="flex items-center gap-1">
                      <span>Tenant</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('dueDate')}>
                    <div className="flex items-center gap-1">
                      <span>Due Date</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer select-none" onClick={() => handleSort('amount')}>
                    <div className="flex items-center justify-end gap-1">
                      <span>Amount Due (₹)</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer select-none" onClick={() => handleSort('status')}>
                    <div className="flex items-center justify-end gap-1">
                      <span>Status</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {paginatedPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-400 text-xs">
                      No outstanding rent invoices found.
                    </td>
                  </tr>
                ) : (
                  paginatedPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-mono font-bold text-[#2563EB]">{p.invoiceNumber}</td>
                      <td className="px-4 py-3 text-gray-800">{p.warehouseName}</td>
                      <td className="px-4 py-3 text-gray-800">{p.tenantName}</td>
                      <td className="px-4 py-3 font-mono text-gray-600">{p.dueDate}</td>
                      <td className="px-4 py-3 text-right font-bold text-[#111827]">
                        ₹{(p.outstandingAmount ?? p.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            p.status === 'Overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination & Page Size Selection */}
          <div className="p-3 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-[#E5E7EB] dark:border-[#334155] rounded-[6px] px-2 py-1 bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>
                Showing {sortedTablePayments.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
                {Math.min(currentPage * itemsPerPage, sortedTablePayments.length)} of {sortedTablePayments.length} entries
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
