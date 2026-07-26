import React, { useState } from 'react';
import {
  IndianRupee,
  Building2,
  CheckCircle2,
  Clock,
  PieChart as PieChartIcon,
  TrendingUp,
  ArrowUpRight,
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
  // Chart toggle: empty state by default as requested in prompt, with option to toggle sample trends preview
  const [showEmptyChartState, setShowEmptyChartState] = useState<boolean>(true);

  // Calculations
  const totalWarehouses = warehouses.length;
  const occupiedCount = warehouses.filter((w) => w.status === 'Occupied').length;
  const vacantCount = warehouses.filter((w) => w.status === 'Vacant').length;
  const occupancyPercentage =
    totalWarehouses > 0 ? Math.round((occupiedCount / totalWarehouses) * 100) : 0;

  const paidPayments = payments.filter((p) => p.status === 'Paid');
  const revenueThisMonth = paidPayments.reduce((acc, curr) => acc + curr.amount, 0);

  const pendingPayments = payments.filter((p) => p.status === 'Pending' || p.status === 'Overdue');
  const outstandingRent = pendingPayments.reduce((acc, curr) => acc + curr.amount, 0);

  // Sample data for chart when toggled off empty state
  const revenueChartData = [
    { month: 'Mar', revenue: 0 },
    { month: 'Apr', revenue: 0 },
    { month: 'May', revenue: 150000 },
    { month: 'Jun', revenue: 370000 },
    { month: 'Jul', revenue: revenueThisMonth }
  ];

  const pieData = [
    { name: 'Occupied', value: occupiedCount, color: '#16A34A' },
    { name: 'Vacant', value: vacantCount, color: '#F59E0B' },
    {
      name: 'Maintenance',
      value: warehouses.filter((w) => w.status === 'Maintenance').length,
      color: '#DC2626'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-xl font-bold text-[#111827] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
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
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-[11px] font-semibold text-gray-500">Revenue This Month</span>
              <div className="p-1.5 bg-blue-50 text-[#2563EB] rounded-lg">
                <IndianRupee className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-lg font-bold text-[#111827]">
              ₹{revenueThisMonth.toLocaleString('en-IN')}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-[#16A34A] mt-1 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>Collected Current Cycle</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Outstanding Rent */}
        <Card className="hover:border-[#F59E0B]/40 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-[11px] font-semibold text-gray-500">Outstanding Rent</span>
              <div className="p-1.5 bg-amber-50 text-[#F59E0B] rounded-lg">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-lg font-bold text-[#111827]">
              ₹{outstandingRent.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-amber-600 mt-1 font-medium">
              {pendingPayments.length} pending invoice(s)
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Total Warehouses */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-[11px] font-semibold text-gray-500">Total Warehouses</span>
              <div className="p-1.5 bg-slate-100 text-gray-600 rounded-lg">
                <Building2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-lg font-bold text-[#111827]">{totalWarehouses}</p>
            <p className="text-[10px] text-gray-500 mt-1">Properties in portfolio</p>
          </CardContent>
        </Card>

        {/* KPI 4: Occupied */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-[11px] font-semibold text-gray-500">Occupied</span>
              <div className="p-1.5 bg-green-50 text-[#16A34A] rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-lg font-bold text-[#16A34A]">{occupiedCount}</p>
            <p className="text-[10px] text-gray-500 mt-1">Active client leases</p>
          </CardContent>
        </Card>

        {/* KPI 5: Vacant */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-[11px] font-semibold text-gray-500">Vacant</span>
              <div className="p-1.5 bg-amber-50 text-[#F59E0B] rounded-lg">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-lg font-bold text-[#F59E0B]">{vacantCount}</p>
            <p className="text-[10px] text-gray-500 mt-1">Ready for lease</p>
          </CardContent>
        </Card>

        {/* KPI 6: Occupancy % */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-[11px] font-semibold text-gray-500">Occupancy %</span>
              <div className="p-1.5 bg-blue-50 text-[#2563EB] rounded-lg">
                <PieChartIcon className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-lg font-bold text-[#2563EB]">{occupancyPercentage}%</p>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-[#2563EB] h-full rounded-full"
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section Header with Empty State Toggle */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#2563EB]" />
          <h2 className="text-sm font-bold text-[#111827]">Financial & Occupancy Analytics</h2>
        </div>

        {/* Toggle between Empty State mode and Visualized trend */}
        <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg p-1 text-xs">
          <span className="text-[11px] text-gray-500 pl-2">Chart Display:</span>
          <button
            onClick={() => setShowEmptyChartState(true)}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              showEmptyChartState
                ? 'bg-[#2563EB] text-white font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Empty State
          </button>
          <button
            onClick={() => setShowEmptyChartState(false)}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              !showEmptyChartState
                ? 'bg-[#2563EB] text-white font-medium'
                : 'text-gray-600 hover:text-gray-900'
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
              <p className="text-xs text-gray-500">Rental collections aggregated over billing cycles</p>
            </div>
            <span className="text-xs font-semibold text-gray-600 bg-slate-100 px-2.5 py-1 rounded-lg">
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#E5E7EB' }} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₹${v / 1000}k`}
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                  />
                  <Tooltip
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                    contentStyle={{ borderRadius: '8px', borderColor: '#E5E7EB', fontSize: '12px' }}
                  />
                  <Bar dataKey="revenue" fill="#2563EB" radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Occupancy Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Distribution Chart</CardTitle>
            <p className="text-xs text-gray-500">Warehouse status allocation</p>
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
                      contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="flex items-center justify-center gap-4 text-xs">
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
              <p className="text-xs text-gray-500">Latest rent payment receipts and pending dues</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onNavigate('payments')}
              className="text-[#2563EB] hover:text-[#1d4ed8]"
            >
              View All Payments
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#111827]">
                <thead className="bg-slate-50 border-b border-[#E5E7EB] text-gray-500 font-semibold">
                  <tr>
                    <th className="px-5 py-3">Invoice #</th>
                    <th className="px-5 py-3">Property</th>
                    <th className="px-5 py-3">Tenant</th>
                    <th className="px-5 py-3">Due Date</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {payments.slice(0, 5).map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-[#2563EB]">
                        <button
                          onClick={() => onNavigate('payments')}
                          className="hover:underline cursor-pointer focus:outline-none"
                        >
                          {pay.invoiceNumber}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">{pay.warehouseName}</td>
                      <td className="px-5 py-3.5">{pay.tenantName}</td>
                      <td className="px-5 py-3.5 text-gray-500">{pay.dueDate}</td>
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
            <p className="text-xs text-gray-500">System actions and tenant events</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">No recent activities logged.</p>
            ) : (
              activities.slice(0, 4).map((act) => {
                // Determine target page tab based on activity log type/title
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
                    className="flex items-start gap-3 text-xs pb-3 border-b border-[#E5E7EB]/60 last:border-0 last:pb-0 hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#111827] hover:text-[#2563EB] transition-colors">{act.title}</p>
                      <p className="text-gray-500 text-[11px] mt-0.5">{act.description}</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">{act.timestamp}</span>
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
