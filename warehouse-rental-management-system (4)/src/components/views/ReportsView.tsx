import React, { useState, useEffect, useMemo } from 'react';
import { Warehouse, RentPayment, Broker } from '../../types';
import { ReportFilters, DateRangeOption } from '../reports/ReportFilters';
import { ExportButtons } from '../reports/ExportButtons';
import { RevenueChart } from '../reports/RevenueChart';
import { OccupancyChart } from '../reports/OccupancyChart';
import { OutstandingChart } from '../reports/OutstandingChart';
import { BrokerChart } from '../reports/BrokerChart';
import { LoadingSkeleton } from '../reports/LoadingSkeleton';
import { Building2 } from 'lucide-react';

interface ReportsViewProps {
  warehouses: Warehouse[];
  payments: RentPayment[];
  brokers: Broker[];
  onShowToast?: (message: string) => void;
}

type TabType = 'revenue' | 'occupancy' | 'aging' | 'commission';

/**
 * ReportsView Component
 * Renders corporate analytics & financial reports using React + Recharts.
 * Integrates 4 tabs: Revenue & Yield Audit, Area Occupancy Analysis, Rent Outstanding Aging, Broker Commission Summary.
 * Features functional date range filtering, search, export CSV, export PDF, print, and skeleton loading states.
 */
export const ReportsView: React.FC<ReportsViewProps> = ({
  warehouses,
  payments,
  brokers,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('revenue');
  const [dateRange, setDateRange] = useState<DateRangeOption>('This Month');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoadingTab, setIsLoadingTab] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  // Tab change handler with skeleton loader
  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    setIsLoadingTab(true);
    setActiveTab(tab);
    setTimeout(() => {
      setIsLoadingTab(false);
    }, 250);
  };

  // Date Range filter handler with brief skeleton reload
  const handleDateRangeChange = (range: DateRangeOption) => {
    setIsLoadingTab(true);
    setDateRange(range);
    setTimeout(() => {
      setIsLoadingTab(false);
    }, 200);
  };

  // Filter Payments based on Date Range
  const filteredPayments = useMemo(() => {
    const now = new Date();

    return payments.filter((p) => {
      const dateStr = p.paidDate || p.dueDate;
      if (!dateStr) return true;
      const pDate = new Date(dateStr);
      if (isNaN(pDate.getTime())) return true;

      if (dateRange === 'This Month') {
        return pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
      }
      if (dateRange === 'Last Month') {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return pDate.getMonth() === lastMonth.getMonth() && pDate.getFullYear() === lastMonth.getFullYear();
      }
      if (dateRange === 'Last 3 Months') {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        return pDate >= threeMonthsAgo && pDate <= now;
      }
      if (dateRange === 'Last 6 Months') {
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        return pDate >= sixMonthsAgo && pDate <= now;
      }
      if (dateRange === 'Yearly') {
        return pDate.getFullYear() === now.getFullYear();
      }
      if (dateRange === 'Custom Range') {
        if (!customStart || !customEnd) return true;
        const startDate = new Date(customStart);
        const endDate = new Date(customEnd);
        endDate.setHours(23, 59, 59, 999);
        return pDate >= startDate && pDate <= endDate;
      }
      return true;
    });
  }, [payments, dateRange, customStart, customEnd]);

  const todayStr = new Date().toISOString().split('T')[0];

  // Global CSV Export Handler
  const handleExportCSV = () => {
    let filename = '';
    let csvHeaders: string[] = [];
    let csvRows: string[][] = [];

    if (activeTab === 'revenue') {
      filename = `Revenue_Report_${todayStr}.csv`;
      csvHeaders = ['Warehouse Name', 'Address', 'Status', 'Area (Sq Ft)', 'Monthly Rent (INR)', 'Annual Yield (INR)'];
      csvRows = warehouses.map((w) => [
        `"${w.name}"`,
        `"${(w.address || w.locationZone || '').replace(/\n/g, ', ')}"`,
        `"${w.status}"`,
        `"${w.areaSqFt}"`,
        `"${w.monthlyRent}"`,
        `"${w.monthlyRent * 12}"`
      ]);
    } else if (activeTab === 'occupancy') {
      filename = `Occupancy_Report_${todayStr}.csv`;
      csvHeaders = ['Warehouse Name', 'Address', 'Status', 'Tenant', 'Area (Sq Ft)', 'Monthly Rent (INR)'];
      csvRows = warehouses.map((w) => [
        `"${w.name}"`,
        `"${(w.address || w.locationZone || '').replace(/\n/g, ', ')}"`,
        `"${w.status}"`,
        `"${w.tenantName || 'Vacant'}"`,
        `"${w.areaSqFt}"`,
        `"${w.monthlyRent}"`
      ]);
    } else if (activeTab === 'aging') {
      filename = `Outstanding_Aging_Report_${todayStr}.csv`;
      csvHeaders = ['Invoice #', 'Warehouse', 'Tenant', 'Due Date', 'Amount (INR)', 'Status'];
      csvRows = filteredPayments
        .filter((p) => p.status === 'Pending' || p.status === 'Overdue')
        .map((p) => [
          `"${p.invoiceNumber}"`,
          `"${p.warehouseName}"`,
          `"${p.tenantName}"`,
          `"${p.dueDate}"`,
          `"${p.outstandingAmount ?? p.amount}"`,
          `"${p.status}"`
        ]);
    } else {
      filename = `Broker_Commission_Report_${todayStr}.csv`;
      csvHeaders = ['Broker Name', 'Company', 'Deals Closed', 'Revenue Generated (INR)', 'Pending Commission (INR)'];
      csvRows = brokers.map((b) => [
        `"${b.name}"`,
        `"${b.companyName || ''}"`,
        `"${b.totalDealsClosed}"`,
        `"${b.revenueGeneratedInr || b.totalDealsClosed * 100000}"`,
        `"${b.pendingCommission}"`
      ]);
    }

    const csvContent = [
      `"ACRELY WAREHOUSE MANAGEMENT SYSTEM - OFFICIAL REPORT"`,
      `"Report Type: ${filename.replace('.csv', '').replace(/_/g, ' ')}"`,
      `"Filter Date Range: ${dateRange}"`,
      `"Generated On: ${todayStr}"`,
      `""`,
      csvHeaders.join(','),
      ...csvRows.map((r) => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    if (onShowToast) {
      onShowToast(`CSV exported: ${filename}`);
    }
  };

  // PDF Export Handler
  const handleExportPDF = async () => {
    setIsExportingPdf(true);
    let reportTitle = 'Revenue_Report';
    if (activeTab === 'occupancy') reportTitle = 'Occupancy_Report';
    if (activeTab === 'aging') reportTitle = 'Outstanding_Aging_Report';
    if (activeTab === 'commission') reportTitle = 'Broker_Commission_Report';

    const filename = `${reportTitle}_${todayStr}.pdf`;

    const container = document.getElementById('reports-printable-root');
    if (!container) {
      setIsExportingPdf(false);
      return;
    }

    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;
      const opt = {
        margin: 10,
        filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(container).save();
      if (onShowToast) {
        onShowToast(`PDF downloaded: ${filename}`);
      }
    } catch (err) {
      console.error('PDF export fallback:', err);
      window.print();
      if (onShowToast) {
        onShowToast('PDF print preview opened');
      }
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
    if (onShowToast) {
      onShowToast('Print dialog opened for current report');
    }
  };

  return (
    <div className="space-y-6" id="reports-printable-root">
      {/* Official Company Branding Header for Print/PDF */}
      <div className="hidden print:flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111827]">Acrely Industrial Parks</h2>
            <p className="text-[10px] text-gray-500">Warehouse Management & Financial Analytics System</p>
          </div>
        </div>
        <div className="text-right text-[10px] text-gray-500">
          <div>Report Date: {todayStr}</div>
          <div>Period: {dateRange}</div>
        </div>
      </div>

      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-xl font-bold text-[#111827] tracking-tight">
            Financial & Operational Reports
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Interactive analytics for rental yield audit, area occupancy, aging dues, and broker settlements.
          </p>
        </div>

        {/* Export Buttons */}
        <ExportButtons
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
          onPrint={handlePrint}
          isExportingPdf={isExportingPdf}
        />
      </div>

      {/* Date Range Filter Bar */}
      <div className="print:hidden">
        <ReportFilters
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          customStartDate={customStart}
          customEndDate={customEnd}
          onCustomDateChange={(start, end) => {
            setCustomStart(start);
            setCustomEnd(end);
            setIsLoadingTab(true);
            setTimeout(() => setIsLoadingTab(false), 200);
          }}
          searchTerm={searchTerm}
          onSearchChange={(val) => setSearchTerm(val)}
        />
      </div>

      {/* Report Navigation Tabs */}
      <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-[12px] p-1.5 shadow-2xs overflow-x-auto text-xs print:hidden">
        {[
          { id: 'revenue', label: '1. Revenue & Yield Audit' },
          { id: 'occupancy', label: '2. Area Occupancy Analysis' },
          { id: 'aging', label: '3. Rent Outstanding Aging' },
          { id: 'commission', label: '4. Broker Commission Summary' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id as TabType)}
            className={`px-4 py-2 rounded-[8px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#2563EB] text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Tab Content Render / Skeleton Loading State */}
      {isLoadingTab ? (
        <LoadingSkeleton />
      ) : (
        <div className="transition-opacity duration-300 opacity-100">
          {activeTab === 'revenue' && (
            <RevenueChart
              warehouses={warehouses}
              payments={filteredPayments}
              searchTerm={searchTerm}
            />
          )}

          {activeTab === 'occupancy' && (
            <OccupancyChart
              warehouses={warehouses}
              searchTerm={searchTerm}
            />
          )}

          {activeTab === 'aging' && (
            <OutstandingChart
              payments={filteredPayments}
              searchTerm={searchTerm}
            />
          )}

          {activeTab === 'commission' && (
            <BrokerChart
              brokers={brokers}
              searchTerm={searchTerm}
            />
          )}
        </div>
      )}
    </div>
  );
};
