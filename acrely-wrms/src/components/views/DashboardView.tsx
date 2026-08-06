import React, { useState } from 'react';
import {
  IndianRupee,
  Building2,
  CheckCircle2,
  Clock,
  PieChart as PieChartIcon,
  TrendingUp,
  Plus,
  BarChart2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Warehouse, RentPayment, ActivityLog } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardViewProps {
  warehouses: Warehouse[];
  payments: RentPayment[];
  activities: ActivityLog[];
  onNavigate: (tab: any) => void;
  onQuickAction: (action: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  warehouses,
  payments,
  activities,
  onNavigate,
  onQuickAction
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [showEmptyChartState, setShowEmptyChartState] = useState<boolean>(true);

  const totalWarehouses = warehouses.length;
  const occupiedCount = warehouses.filter((w) => w.status === 'Occupied').length;
  const vacantCount = warehouses.filter((w) => w.status === 'Vacant').length;
  const occupancyPercentage =
    totalWarehouses > 0 ? Math.round((occupiedCount / totalWarehouses) * 100) : 0;

  const paidPayments = payments.filter((p) => p.status === 'Paid');
  const revenueThisMonth = paidPayments.reduce((acc, curr) => acc + curr.amount, 0);

  const pendingPayments = payments.filter((p) => p.status === 'Pending' || p.status === 'Overdue');
  const outstandingRent = pendingPayments.reduce((acc, curr) => acc + curr.amount, 0);

  const revenueChartData = [
    { month: 'Mar', revenue: 0 },
    { month: 'Apr', revenue: 0 },
    { month: 'May', revenue: 150000 },
    { month: 'Jun', revenue: 370000 },
    { month: 'Jul', revenue: revenueThisMonth }
  ];

  const pieData = [
    { name: 'Occupied', value: occupiedCount, color: isDark ? '#22C55E' : '#16A34A' },
    { name: 'Vacant', value: vacantCount, color: isDark ? '#F59E0B' : '#D97706' },
    {
      name: 'Maintenance',
      value: warehouses.filter((w) => w.status === 'Maintenance').length,
      color: isDark ? '#F87171' : '#DC2626'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB] dark:border-[#334155]">
        <div>
          <h1 className="text-xl font-bold text-[#111827] dark:text-[#F8FAFC] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-gray-500 dark:text-[#94A3B8] mt-0.5">
            Real-time occupancy performance, rental income, and pending lease actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onQuickAction('payment')}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Record Payment
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onQuickAction('warehouse')}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Warehouse
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* KPI 1: Revenue This Month */}
        <Card className="hover:border-[#2563EB]/40 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-gray-400 dark:text-[#64748B] mb-2">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-[#94A3B8]">Revenue This Month</span>
              <div className="p-1.5 bg-blue-50 dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-400 rounded-lg">
                <IndianRupee className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">
              ₹{revenueThisMonth.toLocaleString('en-IN')}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-[#16A34A] dark:text-emerald-400 mt-1 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>Collected Current Cycle</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Outstanding Rent */}
        <Card className="hover:border-[#F59E0B]/40 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-gray-400 dark:text-[#64748B] mb-2">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-[#94A3B8]">Outstanding Rent</span>
              <div className="p-1.5 bg-amber-50 dark:bg-amber-950/80 text-[#F59E0B] dark:text-amber-400 rounded-lg">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">
              ₹{outstandingRent.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
              {pendingPayments.length} pending invoice(s)
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Total Warehouses */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-gray-400 dark:text-[#64748B] mb-2">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-[#94A3B8]">Total Warehouses</span>
              <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-lg">
                <Building2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">{totalWarehouses}</p>
            <p className="text-[10px] text-gray-500 dark:text-[#94A3B8] mt-1">Properties in portfolio</p>
          </CardContent>
        </Card>

        {/* KPI 4: Occupied */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-gray-400 dark:text-[#64748B] mb-2">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-[#94A3B8]">Occupied</span>
              <div className="p-1.5 bg-green-50 dark:bg-emerald-950/80 text-[#16A34A] dark:text-emerald-400 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-lg font-bold text-[#16A34A] dark:text-emerald-400">{occupiedCount}</p>
            <p className="text-[10px] text-gray-500 dark:text-[#94A3B8] mt-1">Active client leases</p>
          </CardContent>
        </Card>

        {/* KPI 5: Vacant */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-gray-400 dark:text-[#64748B] mb-2">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-[#94A3B8]">Vacant</span>
              <div className="p-1.5 bg-amber-50 dark:bg-amber-950/80 text-[#F59E0B] dark:text-amber-400 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-lg font-bold text-[#F59E0B] dark:text-amber-400">{vacantCount}</p>
            <p className="text-[10px] text-gray-500 dark:text-[#94A3B8] mt-1">Ready for lease</p>
          </CardContent>
        </Card>

        {/* KPI 6: Occupancy % */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-gray-400 dark:text-[#64748B] mb-2">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-[#94A3B8]">Occupancy %</span>
              <div className="p-1.5 bg-blue-50 dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-400 rounded-lg">
                <PieChartIcon className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-lg font-bold text-[#2563EB] dark:text-blue-400">{occupancyPercentage}%</p>
            <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-[#2563EB] dark:bg-blue-500 h-full rounded-full"
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Header & Controls */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
          <h2 className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">Financial & Occupancy Analytics</h2>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-lg p-1 text-xs">
          <span className="text-[11px] text-gray-500 dark:text-[#94A3B8] pl-2">Chart Display:</span>
          <button
            onClick={() => setShowEmptyChartState(true)}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              showEmptyChartState
                ? 'bg-[#2563EB] text-white font-medium'
                : 'text-gray-600 dark:text-[#CBD5E1] hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Empty State
          </button>
          <button
            onClick={() => setShowEmptyChartState(false)}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              !showEmptyChartState
                ? 'bg-[#2563EB] text-white font-medium'
                : 'text-gray-600 dark:text-[#CBD5E1] hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Trend View
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Monthly Revenue Chart</CardTitle>
              <p className="text-xs text-gray-500 dark:text-[#94A3B8]">Rental collections aggregated over billing cycles</p>
            </div>
            <span className="text-xs font-semibold text-gray-600 dark:text-[#CBD5E1] bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              YTD ₹{revenueThisMonth.toLocaleString('en-IN')}
            </span>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            {showEmptyChartState ? (
              <EmptyState
                icon={<BarChart2 className="w-6 h-6" />}
                title="Revenue Chart Empty State"
                description="No historical revenue records to display. Record new rent payments to visualize monthly income growth trends."
                action={
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowEmptyChartState(false)}
                  >
                    View Sample Trend
                  </Button>
                }
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#E5E7EB'} />
                  <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: isDark ? '#475569' : '#D1D5DB' }} tick={{ fontSize: 12, fill: isDark ? '#94A3B8' : '#6B7280' }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₹${v / 1000}k`}
                    tick={{ fontSize: 11, fill: isDark ? '#94A3B8' : '#6B7280' }}
                  />
                  <Tooltip
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                    contentStyle={{
                      borderRadius: '8px',
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      borderColor: isDark ? '#334155' : '#E5E7EB',
                      color: isDark ? '#F8FAFC' : '#111827',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    itemStyle={{ color: isDark ? '#60A5FA' : '#2563EB' }}
                    labelStyle={{ color: isDark ? '#F8FAFC' : '#111827', fontWeight: 600 }}
                  />
                  <Bar dataKey="revenue" fill={isDark ? '#3B82F6' : '#2563EB'} radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Occupancy Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Distribution Chart</CardTitle>
            <p className="text-xs text-gray-500 dark:text-[#94A3B8]">Warehouse status allocation</p>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            {showEmptyChartState ? (
              <EmptyState
                icon={<PieChartIcon className="w-6 h-6" />}
                title="Occupancy Chart Empty State"
                description="Zero active distribution data. Assign tenants or update warehouse status to update pie allocation."
                action={
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowEmptyChartState(false)}
                  >
                    View Distribution
                  </Button>
                }
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [val, 'Properties']}
                      contentStyle={{
                        borderRadius: '8px',
                        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                        borderColor: isDark ? '#334155' : '#E5E7EB',
                        color: isDark ? '#F8FAFC' : '#111827',
                        fontSize: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      itemStyle={{ color: isDark ? '#F8FAFC' : '#111827' }}
                      labelStyle={{ color: isDark ? '#F8FAFC' : '#111827', fontWeight: 600 }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-[#CBD5E1]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                    <span>Occupied ({occupiedCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                    <span>Vacant ({vacantCount})</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Payments Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Rent Payments</CardTitle>
              <p className="text-xs text-gray-500 dark:text-[#94A3B8]">Latest rent payment receipts and pending dues</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onNavigate('payments')}
              className="text-[#2563EB] dark:text-blue-400 hover:text-[#1d4ed8]"
            >
              View All Payments
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#111827] dark:text-[#F8FAFC]">
                <thead className="bg-slate-50 dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155] text-gray-500 dark:text-[#CBD5E1] font-semibold">
                  <tr>
                    <th className="px-5 py-3">Invoice #</th>
                    <th className="px-5 py-3">Property</th>
                    <th className="px-5 py-3">Tenant</th>
                    <th className="px-5 py-3">Due Date</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
                  {payments.slice(0, 5).map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50/70 dark:hover:bg-[#273549]/50 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-[#2563EB] dark:text-blue-400">
                        <button
                          onClick={() => onNavigate('payments')}
                          className="hover:underline cursor-pointer focus:outline-none"
                        >
                          {pay.invoiceNumber}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">{pay.warehouseName}</td>
                      <td className="px-5 py-3.5">{pay.tenantName}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-[#94A3B8]">{pay.dueDate}</td>
                      <td className="px-5 py-3.5 font-semibold">
                        ₹{pay.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          variant={
                            pay.status === 'Paid'
                              ? 'success'
                              : pay.status === 'Pending'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                        >
                          {pay.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Portfolio Activity</CardTitle>
            <p className="text-xs text-gray-500 dark:text-[#94A3B8]">System actions and tenant events</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-[#94A3B8] text-center py-6">No recent activities logged.</p>
            ) : (
              activities.slice(0, 4).map((act) => {
                let targetTab: any = 'warehouses';
                const lowerTitle = act.title.toLowerCase();
                if (act.type === 'payment' || lowerTitle.includes('payment') || lowerTitle.includes('rent')) {
                  targetTab = 'payments';
                } else if (act.type === 'lead' || lowerTitle.includes('visit') || lowerTitle.includes('lead') || lowerTitle.includes('inquiry')) {
                  targetTab = 'crm';
                } else if (act.type === 'lease' || lowerTitle.includes('tenant') || lowerTitle.includes('lease')) {
                  targetTab = 'tenants';
                } else if (lowerTitle.includes('warehouse') || lowerTitle.includes('maintenance')) {
                  targetTab = 'warehouses';
                }

                return (
                  <div
                    key={act.id}
                    onClick={() => onNavigate(targetTab)}
                    className="flex items-start gap-3 text-xs pb-3 border-b border-[#E5E7EB]/60 dark:border-[#334155] last:border-0 last:pb-0 hover:bg-slate-50 dark:hover:bg-[#273549] p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#111827] dark:text-[#F8FAFC] hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors">{act.title}</p>
                      <p className="text-gray-500 dark:text-[#94A3B8] text-[11px] mt-0.5">{act.description}</p>
                      <span className="text-[10px] text-gray-400 dark:text-[#64748B] mt-1 block">{act.timestamp}</span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
