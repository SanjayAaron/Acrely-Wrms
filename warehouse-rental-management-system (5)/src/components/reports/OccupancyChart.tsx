import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { PieChart as PieIcon, BarChart2, Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Warehouse } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface OccupancyChartProps {
  warehouses: Warehouse[];
  searchTerm?: string;
}

const COLORS = {
  Occupied: '#16A34A', // Green
  Vacant: '#E11D48',   // Red
  Maintenance: '#F59E0B' // Amber
};

/**
 * OccupancyChart Component
 * Renders Area Occupancy Analysis using Pie Chart for status distribution
 * and Bar Chart for property floor space comparison.
 */
export const OccupancyChart: React.FC<OccupancyChartProps> = ({
  warehouses,
  searchTerm = ''
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const themeColors = {
    Occupied: isDark ? '#22C55E' : '#16A34A',
    Vacant: isDark ? '#F43F5E' : '#E11D48',
    Maintenance: isDark ? '#F59E0B' : '#D97706'
  };
  // Filter warehouses based on search query
  const filteredWarehouses = useMemo(() => {
    if (!searchTerm) return warehouses;
    const term = searchTerm.toLowerCase();
    return warehouses.filter(
      (w) =>
        w.name.toLowerCase().includes(term) ||
        (w.address && w.address.toLowerCase().includes(term)) ||
        (w.locationZone && w.locationZone.toLowerCase().includes(term)) ||
        (w.tenantName && w.tenantName.toLowerCase().includes(term)) ||
        w.status.toLowerCase().includes(term)
    );
  }, [warehouses, searchTerm]);

  // Aggregate status distribution for Pie Chart
  const statusCounts = {
    Occupied: 0,
    Vacant: 0,
    Maintenance: 0
  };

  const statusAreas = {
    Occupied: 0,
    Vacant: 0,
    Maintenance: 0
  };

  filteredWarehouses.forEach((w) => {
    if (w.status in statusCounts) {
      statusCounts[w.status as keyof typeof statusCounts] += 1;
      statusAreas[w.status as keyof typeof statusAreas] += w.areaSqFt;
    }
  });

  const pieData = [
    { name: 'Occupied', value: statusCounts.Occupied, area: statusAreas.Occupied, color: themeColors.Occupied },
    { name: 'Vacant', value: statusCounts.Vacant, area: statusAreas.Vacant, color: themeColors.Vacant },
    { name: 'Maintenance', value: statusCounts.Maintenance, area: statusAreas.Maintenance, color: themeColors.Maintenance }
  ].filter((item) => item.value > 0);

  // Bar Chart Data: Warehouse Area Comparison
  const barData = filteredWarehouses.map((w) => ({
    name: w.name,
    areaSqFt: w.areaSqFt,
    rent: w.monthlyRent,
    status: w.status
  }));

  const totalArea = filteredWarehouses.reduce((acc, w) => acc + w.areaSqFt, 0);
  const isZero = filteredWarehouses.length === 0 || totalArea === 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart: Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[#2563EB]" />
              Property Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isZero ? (
              <div className="h-64 border border-dashed border-[#E5E7EB] dark:border-[#334155] bg-slate-50/60 dark:bg-slate-800/40 rounded-[12px] flex flex-col items-center justify-center p-6 text-center">
                <PieIcon className="w-10 h-10 text-gray-300 dark:text-[#64748B] mb-2" />
                <h4 className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">No report data available</h4>
                <p className="text-xs text-gray-500 dark:text-[#94A3B8] max-w-xs mt-1">
                  Reports will automatically generate once warehouse payments are recorded.
                </p>
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="area"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      paddingAngle={4}
                      label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                      isAnimationActive={true}
                    >
                      {pieData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [`${val.toLocaleString('en-IN')} sq ft`, 'Floor Area']}
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
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart: Area Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#2563EB]" />
              Warehouse Area Comparison (Sq Ft)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isZero ? (
              <div className="h-64 border border-dashed border-[#E5E7EB] dark:border-[#334155] bg-slate-50/60 dark:bg-slate-800/40 rounded-[12px] flex flex-col items-center justify-center p-6 text-center">
                <BarChart2 className="w-10 h-10 text-gray-300 dark:text-[#64748B] mb-2" />
                <h4 className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">No report data available</h4>
                <p className="text-xs text-gray-500 dark:text-[#94A3B8] max-w-xs mt-1">
                  Reports will automatically generate once warehouse payments are recorded.
                </p>
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#E5E7EB'} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: isDark ? '#94A3B8' : '#6B7280' }}
                      axisLine={{ stroke: isDark ? '#475569' : '#D1D5DB' }}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: isDark ? '#94A3B8' : '#6B7280' }}
                      axisLine={{ stroke: isDark ? '#475569' : '#D1D5DB' }}
                      tickFormatter={(val) => `${val} sqft`}
                    />
                    <Tooltip
                      formatter={(val: number) => [`${val.toLocaleString('en-IN')} sq ft`, 'Area']}
                      contentStyle={{
                        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                        borderColor: isDark ? '#334155' : '#E5E7EB',
                        color: isDark ? '#F8FAFC' : '#111827',
                        borderRadius: '8px',
                        fontSize: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      itemStyle={{ color: isDark ? '#60A5FA' : '#2563EB' }}
                      labelStyle={{ color: isDark ? '#F8FAFC' : '#111827', fontWeight: 600 }}
                    />
                    <Bar
                      dataKey="areaSqFt"
                      name="Area (Sq Ft)"
                      fill={isDark ? '#3B82F6' : '#2563EB'}
                      radius={[6, 6, 0, 0]}
                      isAnimationActive={true}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Warehouses Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-[#E5E7EB]">
          <CardTitle className="text-sm font-bold flex items-center justify-between">
            <span>Property Occupancy Ledger</span>
            <span className="text-xs font-normal text-gray-500">
              Total Area: {totalArea.toLocaleString('en-IN')} Sq Ft
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#111827]">
              <thead className="bg-slate-50 border-b border-[#E5E7EB] text-gray-500 font-semibold">
                <tr>
                  <th className="px-4 py-3">Property Name</th>
                  <th className="px-4 py-3">Zone</th>
                  <th className="px-4 py-3">Tenant</th>
                  <th className="px-4 py-3 text-right">Area (Sq Ft)</th>
                  <th className="px-4 py-3 text-right">Monthly Rent (₹)</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredWarehouses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-400 text-xs">
                      No warehouses found matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredWarehouses.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-bold text-[#111827]">{w.name}</td>
                      <td className="px-4 py-3 text-gray-600 truncate max-w-[160px]" title={w.address}>
                        {w.address?.split('\n')[0] || w.locationZone || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-gray-800">{w.tenantName || '—'}</td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-[#111827]">
                        {w.areaSqFt.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-[#2563EB]">
                        ₹{w.monthlyRent.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right">
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
