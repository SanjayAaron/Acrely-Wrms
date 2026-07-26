import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { RentPayment, Tenant, Warehouse, SystemSettings } from '../../types';
import {
  Printer,
  Download,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Phone,
  Mail,
  Globe,
  MapPin,
  X
} from 'lucide-react';

interface InvoicePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: RentPayment | null;
  tenant?: Tenant;
  warehouse?: Warehouse;
  settings?: SystemSettings;
  type?: 'Invoice' | 'Receipt';
}

/**
 * Premium Enterprise Commercial Rent Invoice & Payment Receipt Component.
 * Supports clean A4 layout, CSS print media target, and html2pdf export with exact branding.
 */
export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  isOpen,
  onClose,
  payment,
  tenant,
  warehouse,
  settings,
  type = 'Invoice'
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  if (!payment) return null;

  const isPaid = payment.status === 'Paid';
  const isOverdue = payment.status === 'Overdue';

  // Title and Reference Calculations
  const isReceiptDoc = type === 'Receipt' || isPaid;
  const docTitle = isReceiptDoc ? 'OFFICIAL RENT RECEIPT' : 'COMMERCIAL WAREHOUSE RENT INVOICE';
  const invoiceNum = payment.invoiceNumber || 'INV-2026-003';
  const receiptNum = `RCT-${invoiceNum.replace('INV-', '')}`;
  const displayDocNum = isReceiptDoc ? receiptNum : invoiceNum;

  // Billing calculation
  const totalAmount = payment.amount || 0;
  const subtotalBeforeGst = Math.round(totalAmount / 1.18);
  const gstAmount = totalAmount - subtotalBeforeGst;
  const outstandingAmt = isPaid ? (payment.outstandingAmount || 0) : totalAmount;

  // Dates
  const invoiceDate = payment.dueDate ? payment.dueDate : '2026-07-01';
  const dueDate = payment.dueDate ? payment.dueDate : '2026-07-15';
  const paymentDate = payment.paidDate || (isPaid ? dueDate : 'Pending');
  const billingMonth = payment.billingMonth || 'July 2026';

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Download PDF Handler via html2pdf.js
  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    const element = document.getElementById('printable-invoice-content');
    if (!element) {
      setIsGeneratingPdf(false);
      return;
    }

    const pdfFileName = `${isReceiptDoc ? 'Receipt' : 'Invoice'}_${displayDocNum}.pdf`;

    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;

      const opt = {
        margin: 10,
        filename: pdfFileName,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF export fallback:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${type} Enterprise Document Preview`} maxWidth="max-w-4xl">
      <div className="space-y-4">
        {/* CSS Print Styles to isolate invoice for window.print() */}
        <style font-sans>{`
          @media print {
            body * {
              visibility: hidden !important;
            }
            #printable-invoice-content, #printable-invoice-content * {
              visibility: visible !important;
            }
            #printable-invoice-content {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 24px !important;
              background: #ffffff !important;
              border: none !important;
              box-shadow: none !important;
            }
            .no-print {
              display: none !important;
            }
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
          }
        `}</style>

        {/* Outer Card Wrapper */}
        <div
          id="printable-invoice-content"
          className="bg-white border border-[#E5E7EB] rounded-2xl p-8 text-xs text-[#111827] space-y-6 shadow-2xs font-sans max-w-3xl mx-auto"
        >
          {/* Company Branding & Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-[#E5E7EB]">
            {/* Left Column: Company Branding */}
            <div className="space-y-2.5 max-w-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-extrabold text-lg shadow-2xs">
                  A
                </div>
                <div>
                  <h1 className="text-xl font-black text-[#111827] tracking-wider uppercase">
                    ACRELY
                  </h1>
                  <p className="text-[11px] font-semibold text-[#2563EB] tracking-tight">
                    Advanced Commercial Rental & Estate Logistics
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium">
                    Warehouse Rental Management System
                  </p>
                </div>
              </div>

              {/* Company Information Underneath */}
              <div className="pt-2 text-[11px] text-gray-600 space-y-1">
                <p className="font-semibold text-gray-800">
                  GSTIN: <span className="font-mono text-[#111827]">{settings?.gstinTaxId || '27AABCA1234F1Z5'}</span>
                </p>
                <p className="flex items-start gap-1">
                  <MapPin className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
                  <span>{settings?.companyName ? `${settings.companyName}, ` : ''}Plot 42, Sector 18, Industrial Logistics Hub, Mumbai - 400705</span>
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-gray-500 text-[10.5px]">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-400" /> +91 (022) 8899-1000
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gray-400" /> billing@acrely-logistics.com
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-gray-400" /> www.acrely-logistics.com
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Invoice Header Details */}
            <div className="text-left sm:text-right space-y-2 w-full sm:w-auto">
              <div>
                <h2 className="text-sm font-extrabold text-[#2563EB] tracking-wider uppercase">
                  {docTitle}
                </h2>
                <p className="text-xs font-mono font-extrabold text-gray-900 mt-0.5">
                  #{displayDocNum}
                </p>
              </div>

              <div className="space-y-1 text-[11px] text-gray-600">
                <p>
                  <span className="text-gray-400">Invoice Date:</span>{' '}
                  <span className="font-medium text-gray-900 font-mono">{invoiceDate}</span>
                </p>
                <p>
                  <span className="text-gray-400">Due Date:</span>{' '}
                  <span className="font-medium text-gray-900 font-mono">{dueDate}</span>
                </p>
              </div>

              {/* Status Badge */}
              <div className="pt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    isPaid
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : isOverdue
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {isPaid ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : isOverdue ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  {payment.status}
                </span>
              </div>
            </div>
          </div>

          {/* Grid Layout: Section 1 (Tenant Info) & Section 2 (Warehouse Info) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section 1: Tenant Information */}
            <div className="p-4 bg-slate-50/80 border border-gray-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h3 className="font-bold text-gray-700 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#2563EB]" />
                  1. Tenant Information
                </h3>
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-extrabold text-[#111827] text-sm">{payment.tenantName}</p>
                <p className="text-gray-600">
                  <span className="text-gray-400">Company:</span> {tenant?.name || payment.tenantName}
                </p>
                <p className="text-gray-600">
                  <span className="text-gray-400">Phone:</span>{' '}
                  <span className="font-mono">{tenant?.phone || '+91 98200 12345'}</span>
                </p>
                <p className="text-gray-600">
                  <span className="text-gray-400">Email:</span> {tenant?.email || 'accounts@tenant.com'}
                </p>
                <p className="text-gray-600">
                  <span className="text-gray-400">GST Number:</span>{' '}
                  <span className="font-mono">{tenant?.contactPerson ? `27AAACT9876M1ZB` : '27AAACT9876M1ZB'}</span>
                </p>
                <p className="text-gray-600">
                  <span className="text-gray-400">Address:</span> Suite 401, Logistics Tower, Kurla, Mumbai - 400070
                </p>
              </div>
            </div>

            {/* Section 2: Warehouse Information */}
            <div className="p-4 bg-slate-50/80 border border-gray-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h3 className="font-bold text-gray-700 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                  2. Warehouse Information
                </h3>
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-extrabold text-[#111827] text-sm">{payment.warehouseName}</p>
                <p className="text-gray-600">
                  <span className="text-gray-400">Warehouse Code:</span>{' '}
                  <span className="font-mono">{warehouse?.id ? `WH-${warehouse.id.toUpperCase()}` : 'WH-MUM-01'}</span>
                </p>
                <p className="text-gray-600">
                  <span className="text-gray-400">Address:</span>{' '}
                  {warehouse?.address?.split('\n')[0] || warehouse?.locationZone || 'No. 24, SIPCOT Industrial Park, Oragadam'}
                </p>
                <p className="text-gray-600">
                  <span className="text-gray-400">Area (Sq.Ft):</span>{' '}
                  <span className="font-semibold">{warehouse?.areaSqFt ? warehouse.areaSqFt.toLocaleString('en-IN') : '25,000'} Sq.Ft</span>
                </p>
                <p className="text-gray-600">
                  <span className="text-gray-400">Lease Number:</span>{' '}
                  <span className="font-mono">LEASE-2026-8891</span>
                </p>
                <p className="text-gray-600">
                  <span className="text-gray-400">Billing Month:</span>{' '}
                  <span className="font-medium text-[#2563EB]">{billingMonth}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Invoice Details Bar */}
          <div className="p-3 bg-[#2563EB]/5 border border-[#2563EB]/20 rounded-xl">
            <h3 className="font-bold text-gray-800 uppercase text-[10px] tracking-wider mb-2">
              3. Invoice & Payment Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div>
                <span className="text-gray-400 text-[10px] block uppercase">Invoice Date</span>
                <span className="font-bold text-[#111827] font-mono">{invoiceDate}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block uppercase">Due Date</span>
                <span className="font-bold text-[#111827] font-mono">{dueDate}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block uppercase">Payment Date</span>
                <span className="font-bold text-[#111827] font-mono">{paymentDate}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block uppercase">Payment Method</span>
                <span className="font-bold text-[#111827]">
                  {payment.paymentMethod || (isPaid ? 'Bank Transfer (NEFT)' : 'Pending Transfer')}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block uppercase">Reference Number</span>
                <span className="font-bold font-mono text-[#2563EB]">
                  {payment.transactionId || (isPaid ? 'TXN-982347102' : 'N/A')}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Charges Table */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 uppercase text-[10px] tracking-wider">
              4. Itemized Rent Charges & Tax Breakdown
            </h3>

            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 border-b border-[#E5E7EB] text-gray-600 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3">Period</th>
                    <th className="p-3 text-center">Quantity</th>
                    <th className="p-3 text-right">Rate (₹)</th>
                    <th className="p-3 text-right">Tax (%)</th>
                    <th className="p-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  <tr>
                    <td className="p-3">
                      <p className="font-bold text-[#111827]">
                        Commercial Warehouse License Fee & Rent
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Property: {payment.warehouseName} • Cycle: {billingMonth}
                      </p>
                    </td>
                    <td className="p-3 text-gray-600">1 Month</td>
                    <td className="p-3 text-center font-mono">1</td>
                    <td className="p-3 text-right font-mono">
                      ₹{subtotalBeforeGst.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right font-mono text-gray-600">18% GST</td>
                    <td className="p-3 text-right font-bold font-mono text-[#111827]">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Totals Summary */}
              <div className="bg-slate-50 p-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                <div className="text-[11px] text-gray-500 space-y-0.5">
                  <p>• GST Breakdown: CGST @ 9% + SGST @ 9% included.</p>
                  <p>• All values rendered in Indian Rupees (₹ INR).</p>
                </div>

                <div className="w-full sm:w-64 space-y-1.5 text-right font-sans">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-medium">₹{subtotalBeforeGst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%):</span>
                    <span className="font-mono font-medium">₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Discount:</span>
                    <span className="font-mono font-medium">₹0.00</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300 font-extrabold text-sm text-[#111827]">
                    <span>Total Amount:</span>
                    <span className="font-mono text-[#2563EB]">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-gray-800">
                    <span>Outstanding Amount:</span>
                    <span className={`font-mono ${outstandingAmt > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      ₹{outstandingAmt.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Notes & Policy */}
          <div className="p-4 bg-slate-50 border border-gray-200 rounded-xl space-y-2 text-[11px] text-gray-600">
            <h3 className="font-bold text-gray-800 uppercase text-[10px] tracking-wider border-b border-gray-200 pb-1">
              5. Notes & Payment Terms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="font-semibold text-gray-800">Payment Terms:</p>
                <p>• Rent payable on or before due date each calendar month.</p>
                <p>• Electronic transfers (NEFT/RTGS/UPI) preferred.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Late Payment Policy:</p>
                <p>• 1.5% late interest fee per month applies after due date.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Bank Transfer Details:</p>
                <p className="font-mono text-[10.5px] text-gray-800">
                  Acrely Industrial Parks Ltd | HDFC Bank | A/C: 50200088192301 | IFSC: HDFC0000240
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Billing Support:</p>
                <p>Email: billing@acrely-logistics.com | Phone: +91 (022) 8899-1000</p>
              </div>
            </div>
          </div>

          {/* Section 6: Authorized Signature & Company Seal */}
          <div className="pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row justify-between items-center gap-6 text-[11px]">
            {/* Digital Seal Placeholder */}
            <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-dashed border-gray-300 rounded-xl">
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#2563EB] flex items-center justify-center text-[9px] font-black text-[#2563EB] text-center leading-none p-1">
                SEAL
              </div>
              <div>
                <p className="font-bold text-gray-800">ACRELY CORPORATE SEAL</p>
                <p className="text-[10px] text-gray-500">Verified & Digitally Audited Document</p>
              </div>
            </div>

            {/* Digital Signature Placeholder */}
            <div className="text-right space-y-1">
              <div className="inline-block p-2 bg-blue-50/60 border border-blue-200 rounded-lg text-center min-w-[180px]">
                <p className="font-serif italic font-extrabold text-sm text-[#2563EB] tracking-wide">
                  Acrely Officer
                </p>
                <p className="text-[9px] text-gray-500 font-mono border-t border-blue-200 mt-1 pt-0.5">
                  Digitally Signed for ACRELY
                </p>
              </div>
              <p className="font-bold text-gray-800 text-xs">6. Authorized Signatory</p>
            </div>
          </div>
        </div>

        {/* Action Controls (Bottom Right Buttons) */}
        <div className="flex items-center justify-end gap-2 pt-2 no-print">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
            title="Print invoice via browser print dialog"
          >
            Print
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            title="Download PDF document"
          >
            {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
