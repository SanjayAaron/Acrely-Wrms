import React from 'react';
import { FileSpreadsheet, Download, Printer } from 'lucide-react';
import { Button } from '../ui/Button';

interface ExportButtonsProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
  onPrint: () => void;
  isExportingPdf?: boolean;
}

/**
 * ExportButtons Component
 * Provides standard action buttons to export reports in CSV format, PDF format, or trigger browser printing.
 */
export const ExportButtons: React.FC<ExportButtonsProps> = ({
  onExportCSV,
  onExportPDF,
  onPrint,
  isExportingPdf = false
}) => {
  return (
    <div className="flex items-center gap-2 print:hidden flex-wrap">
      <Button
        variant="outline"
        size="sm"
        icon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
        onClick={onExportCSV}
        title="Export tabular data to CSV spreadsheet"
      >
        Export CSV
      </Button>

      <Button
        variant="primary"
        size="sm"
        icon={<Download className="w-4 h-4" />}
        onClick={onExportPDF}
        disabled={isExportingPdf}
        title="Download official PDF report document"
      >
        {isExportingPdf ? 'Generating PDF...' : 'Export PDF'}
      </Button>

      <Button
        variant="secondary"
        size="sm"
        icon={<Printer className="w-4 h-4 text-gray-700" />}
        onClick={onPrint}
        title="Print current report layout"
      >
        Print Report
      </Button>
    </div>
  );
};
