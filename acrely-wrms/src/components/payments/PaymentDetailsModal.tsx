import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DeleteButton } from '../common/DeleteButton';
import { PaymentTimeline } from './PaymentTimeline';
import { PaymentHistory } from './PaymentHistory';
import { RecordPaymentDialog, RecordPaymentData } from './RecordPaymentDialog';
import { MarkUnpaidDialog } from './MarkUnpaidDialog';
import { InvoicePrintModal } from '../modals/InvoicePrintModal';
import { RentPayment, Tenant, Warehouse, SystemSettings } from '../../types';

import {
  FileText,
  Building2,
  User,
  CreditCard,
  Calendar,
  CheckCircle2,
  Download,
  Edit,
  RotateCcw,
  Check,
  Phone,
  Mail,
  MapPin,
  Maximize2,
  DollarSign,
  ShieldAlert,
  Clock
} from 'lucide-react';

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: RentPayment | null;
  tenants: Tenant[];
  warehouses: Warehouse[];
  settings?: SystemSettings;
  onRecordPayment: (paymentId: string, details: RecordPaymentData) => void;
  onMarkUnpaid: (paymentId: string, reason: string, notes: string) => void;
  onEditPayment?: (payment: RentPayment) => void;
  onMoveToBin?: (payment: RentPayment) => void;
}

/**
  * Full ERP Payment Details Modal / Page Component.
  * Displays complete information for Rent Invoices including Invoice, Tenant, Warehouse,
  * Payment Information, Timeline, Audit History and Status-aware Actions.
  */
export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  isOpen,
  onClose,
  payment,
  tenants,
  warehouses,
  settings,
  onRecordPayment,
  onMarkUnpaid,
  onEditPayment,
  onMoveToBin
}) => {
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [isMarkUnpaidDialogOpen, setIsMarkUnpaidDialogOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printType, setPrintType] = useState<'Invoice' | 'Receipt'>('Invoice');

  if (!payment) return null;

  // Resolve associated tenant and warehouse
  const tenant = tenants.find((t) => t.id === payment.tenantId || t.name === payment.tenantName);
  const warehouse = warehouses.find((w) => w.id === payment.warehouseId || w.name === payment.warehouseName);

  const isPaid = payment.status === 'Paid';

  const handleOpenDownloadInvoice = () => {
    setPrintType('Invoice');
    setIsPrintModalOpen(true);
  };

  const handleOpenDownloadReceipt = () => {
    setPrintType('Receipt');
    setIsPrintModalOpen(true);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Rent Payment Details — ${payment.invoiceNumber}`}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-5">
          {/* Top Banner & Header Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 border border-[#E5E7EB] rounded-[12px]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[#2563EB]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#111827]">{payment.invoiceNumber}</h3>
                  <Badge variant={isPaid ? 'success' : payment.status === 'Overdue' ? 'danger' : 'warning'}>
                    {payment.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Billing Period: <span className="font-semibold text-gray-700">{payment.billingMonth || 'July 2026'}</span> • Due Date: <span className="font-semibold text-gray-700">{payment.dueDate}</span>
                </p>
              </div>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex items-center flex-wrap gap-2">
              {/* Actions for Pending / Overdue Status */}
              {!isPaid && (
                <>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={<Check className="w-3.5 h-3.5" />}
                    onClick={() => setIsRecordDialogOpen(true)}
                  >
                    Mark as Paid
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Download className="w-3.5 h-3.5" />}
                    onClick={handleOpenDownloadInvoice}
                  >
                    Download Invoice
                  </Button>
                </>
              )}

              {/* Actions for Paid Status */}
              {isPaid && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Download className="w-3.5 h-3.5" />}
                    onClick={handleOpenDownloadReceipt}
                  >
                    Download Receipt
                  </Button>

                  {/* Mark as Unpaid - ONLY EXISTS INSIDE PAYMENT DETAILS PAGE/MODAL */}
                  <Button
                    size="sm"
                    variant="danger"
                    icon={<RotateCcw className="w-3.5 h-3.5" />}
                    onClick={() => setIsMarkUnpaidDialogOpen(true)}
                    title="Move payment back to Pending"
                  >
                    Mark as Unpaid
                  </Button>
                </>
              )}

              {/* Common Actions */}
              {onEditPayment && (
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Edit className="w-3.5 h-3.5" />}
                  onClick={() => {
                    onClose();
                    onEditPayment(payment);
                  }}
                  title="Edit Payment"
                >
                  Edit
                </Button>
              )}

              {onMoveToBin && (
                <DeleteButton
                  onClick={() => {
                    onClose();
                    onMoveToBin(payment);
                  }}
                  label="Move to Bin"
                />
              )}
            </div>
          </div>

          {/* ERP Payment Timeline Step Progress */}
          <PaymentTimeline payment={payment} />

          {/* Grid Layout of Information Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Invoice Information */}
            <div className="p-4 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[12px] space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB] dark:border-[#334155]">
                <FileText className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                <h4 className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC] uppercase tracking-wider">
                  Invoice Information
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#334155]">
                  <span className="text-gray-500 dark:text-[#94A3B8]">Invoice Number</span>
                  <span className="font-mono font-bold text-[#111827] dark:text-[#F8FAFC]">{payment.invoiceNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Warehouse</span>
                  <span className="font-semibold text-[#111827]">{payment.warehouseName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Tenant</span>
                  <span className="font-semibold text-[#111827]">{payment.tenantName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Monthly Rent</span>
                  <span className="font-bold text-[#111827]">
                    ₹{(tenant?.monthlyRent || payment.amount).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Security Deposit</span>
                  <span className="font-semibold text-gray-700">
                    ₹{(tenant?.securityDeposit || (payment.amount * 3)).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Billing Month</span>
                  <span className="font-semibold text-[#111827]">{payment.billingMonth || 'July 2026'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Due Date</span>
                  <span className="font-semibold text-gray-800">{payment.dueDate}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-500">Payment Status</span>
                  <Badge variant={isPaid ? 'success' : 'warning'}>{payment.status}</Badge>
                </div>
              </div>
            </div>

            {/* 2. Tenant Information */}
            <div className="p-4 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[12px] space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB] dark:border-[#334155]">
                <User className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                <h4 className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC] uppercase tracking-wider">
                  Tenant Information
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#334155]">
                  <span className="text-gray-500 dark:text-[#94A3B8]">Tenant Name</span>
                  <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">{payment.tenantName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#334155]">
                  <span className="text-gray-500 dark:text-[#94A3B8]">Company</span>
                  <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">
                    {tenant?.contactPerson ? `${payment.tenantName} Corp` : '—'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#334155]">
                  <span className="text-gray-500 dark:text-[#94A3B8] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-400 dark:text-[#64748B]" /> Phone
                  </span>
                  <span className="font-mono text-[#111827] dark:text-[#F8FAFC]">{tenant?.phone || '+91 98200 12345'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#334155]">
                  <span className="text-gray-500 dark:text-[#94A3B8] flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gray-400 dark:text-[#64748B]" /> Email
                  </span>
                  <span className="text-[#2563EB] dark:text-blue-400 font-medium">{tenant?.email || `contact@${payment.tenantName.toLowerCase().replace(/\s+/g, '')}.com`}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#334155]">
                  <span className="text-gray-500 dark:text-[#94A3B8]">Lease Start</span>
                  <span className="font-semibold text-gray-800 dark:text-[#CBD5E1]">{tenant?.leaseStart || '2025-01-01'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#334155]">
                  <span className="text-gray-500 dark:text-[#94A3B8]">Lease End</span>
                  <span className="font-semibold text-gray-800 dark:text-[#CBD5E1]">{tenant?.leaseEnd || '2026-12-31'}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-500 dark:text-[#94A3B8]">Next Due Date</span>
                  <span className="font-bold text-[#2563EB] dark:text-blue-400">{payment.nextDueDate || '2026-08-05'}</span>
                </div>
              </div>
            </div>

            {/* 3. Warehouse Information */}
            <div className="p-4 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[12px] space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB] dark:border-[#334155]">
                <Building2 className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                <h4 className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC] uppercase tracking-wider">
                  Warehouse Information
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#334155]">
                  <span className="text-gray-500 dark:text-[#94A3B8]">Warehouse Name</span>
                  <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">{payment.warehouseName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#334155]">
                  <span className="text-gray-500 dark:text-[#94A3B8] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400 dark:text-[#64748B]" /> Address
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-[#CBD5E1] truncate max-w-[180px]" title={warehouse?.address}>
                    {warehouse?.address?.split('\n')[0] || warehouse?.locationZone || 'Address not provided'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#334155]">
                  <span className="text-gray-500 dark:text-[#94A3B8] flex items-center gap-1">
                    <Maximize2 className="w-3 h-3 text-gray-400 dark:text-[#64748B]" /> Total Area
                  </span>
                  <span className="font-mono font-semibold text-[#111827] dark:text-[#F8FAFC]">
                    {warehouse?.areaSqFt ? `${warehouse.areaSqFt.toLocaleString()} sq ft` : '15,000 sq ft'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#334155]">
                  <span className="text-gray-500 dark:text-[#94A3B8]">Monthly Rent</span>
                  <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">
                    ₹{(warehouse?.monthlyRent || payment.amount).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-500 dark:text-[#94A3B8]">Property Owner</span>
                  <span className="font-semibold text-[#2563EB] dark:text-blue-400">
                    {settings?.ownerName || 'Property Owner'}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Payment Information */}
            <div className="p-4 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[12px] space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB] dark:border-[#334155]">
                <CreditCard className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                <h4 className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC] uppercase tracking-wider">
                  Payment Information
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Amount Due</span>
                  <span className="font-bold text-[#111827]">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="font-bold text-[#16A34A]">
                    ₹{(isPaid ? (payment.amountPaid || payment.amount) : 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Outstanding Amount</span>
                  <span className="font-bold text-amber-600">
                    ₹{(isPaid ? (payment.outstandingAmount || 0) : payment.amount).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-semibold text-gray-800">
                    {payment.paymentMethod || (isPaid ? 'Bank Transfer' : '—')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Payment Date</span>
                  <span className="font-semibold text-gray-800">
                    {payment.paidDate || 'Not Paid Yet'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-mono text-gray-800">
                    {payment.transactionId || (isPaid ? 'TXN-8821948192' : '—')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Reference Number</span>
                  <span className="font-mono text-gray-800">{payment.referenceNumber || 'REF-2026-07'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Collected By</span>
                  <span className="font-semibold text-gray-800">
                    {payment.collectedBy || (isPaid ? 'Property Owner' : '—')}
                  </span>
                </div>
                <div className="pt-1">
                  <span className="text-gray-500 block text-[11px] mb-0.5">Accounting Notes</span>
                  <p className="text-[11px] text-gray-700 bg-gray-50 p-2 rounded-[6px] border border-gray-200">
                    {payment.notes || 'Standard monthly rent charge issued per active lease contract.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Payment Audit Log & History */}
          <div className="p-4 bg-slate-50 border border-[#E5E7EB] rounded-[12px] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2563EB]" />
                <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                  Payment History & ERP Audit Log
                </h4>
              </div>
              <span className="text-[10px] text-gray-500">
                {payment.history?.length || 0} events recorded
              </span>
            </div>

            <PaymentHistory history={payment.history} />
          </div>

          {/* Bottom Close Button */}
          <div className="flex items-center justify-end pt-2 border-t border-[#E5E7EB]">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close Details
            </Button>
          </div>
        </div>
      </Modal>

      {/* Record Payment Dialog */}
      <RecordPaymentDialog
        isOpen={isRecordDialogOpen}
        onClose={() => setIsRecordDialogOpen(false)}
        payment={payment}
        onConfirm={(paymentId, details) => {
          onRecordPayment(paymentId, details);
          setIsRecordDialogOpen(false);
        }}
      />

      {/* Mark Unpaid Dialog */}
      <MarkUnpaidDialog
        isOpen={isMarkUnpaidDialogOpen}
        onClose={() => setIsMarkUnpaidDialogOpen(false)}
        payment={payment}
        onConfirm={(paymentId, reason, notes) => {
          onMarkUnpaid(paymentId, reason, notes);
          setIsMarkUnpaidDialogOpen(false);
        }}
      />

      {/* Print/Download Invoice Modal */}
      <InvoicePrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        payment={payment}
        tenant={tenant}
        warehouse={warehouse}
        settings={settings}
        type={printType}
      />
    </>
  );
};
