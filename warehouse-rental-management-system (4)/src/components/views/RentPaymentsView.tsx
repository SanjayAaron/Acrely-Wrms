import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  Check,
  Edit,
  FileText
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DeleteButton } from '../common/DeleteButton';
import { PaymentDetailsModal } from '../payments/PaymentDetailsModal';
import { RecordPaymentDialog, RecordPaymentData } from '../payments/RecordPaymentDialog';
import { InvoicePrintModal } from '../modals/InvoicePrintModal';

import { RentPayment, Tenant, Warehouse, SystemSettings } from '../../types';

interface RentPaymentsViewProps {
  payments: RentPayment[];
  tenants?: Tenant[];
  warehouses?: Warehouse[];
  settings?: SystemSettings;
  onAddPayment: () => void;
  onRecordPayment: (paymentId: string, details: RecordPaymentData) => void;
  onMarkUnpaid: (paymentId: string, reason: string, notes: string) => void;
  onEditPayment?: (payment: RentPayment) => void;
  onDeletePayment: (payment: RentPayment) => void;
  searchQuery: string;
}

/**
  * Professional ERP Rent Payments & Invoices View.
  * Summary table with strict column specifications and modal integration.
  */
export const RentPaymentsView: React.FC<RentPaymentsViewProps> = ({
  payments,
  tenants = [],
  warehouses = [],
  settings,
  onAddPayment,
  onRecordPayment,
  onMarkUnpaid,
  onEditPayment,
  onDeletePayment,
  searchQuery
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal States
  const [selectedPayment, setSelectedPayment] = useState<RentPayment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  // Quick Record Payment Dialog from Table
  const [recordDialogPayment, setRecordDialogPayment] = useState<RentPayment | null>(null);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState<boolean>(false);

  // Printable Document Modal from Table
  const [printModalPayment, setPrintModalPayment] = useState<RentPayment | null>(null);
  const [printType, setPrintType] = useState<'Invoice' | 'Receipt'>('Invoice');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.warehouseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tenantName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalCollected = payments
    .filter((p) => p.status === 'Paid')
    .reduce((acc, c) => acc + (c.amountPaid || c.amount), 0);

  const totalPending = payments
    .filter((p) => p.status === 'Pending' || p.status === 'Overdue')
    .reduce((acc, c) => acc + (c.outstandingAmount || c.amount), 0);

  const handleOpenDetails = (payment: RentPayment) => {
    setSelectedPayment(payment);
    setIsDetailsModalOpen(true);
  };

  const handleOpenRecordDialog = (payment: RentPayment) => {
    setRecordDialogPayment(payment);
    setIsRecordDialogOpen(true);
  };

  const handleOpenPrintModal = (payment: RentPayment, type: 'Invoice' | 'Receipt') => {
    setPrintModalPayment(payment);
    setPrintType(type);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-xl font-bold text-[#111827] tracking-tight">
            Rent Payments & Invoices
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage commercial lease billing, track payment history, issue receipts, and manage accounts.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={onAddPayment}
          icon={<Plus className="w-4 h-4" />}
        >
          Record Rent Payment
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-[#E5E7EB] rounded-[12px] shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Rent Collected</p>
            <p className="text-lg font-bold text-[#16A34A] mt-0.5">
              ₹{totalCollected.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="p-2.5 bg-green-50 text-[#16A34A] rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white border border-[#E5E7EB] rounded-[12px] shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Pending Dues</p>
            <p className="text-lg font-bold text-[#F59E0B] mt-0.5">
              ₹{totalPending.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="p-2.5 bg-amber-50 text-[#F59E0B] rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white border border-[#E5E7EB] rounded-[12px] shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Overdue Invoices</p>
            <p className="text-lg font-bold text-[#DC2626] mt-0.5">
              {payments.filter((p) => p.status === 'Overdue').length} Invoices
            </p>
          </div>
          <div className="p-2.5 bg-red-50 text-[#DC2626] rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-3 bg-white border border-[#E5E7EB] rounded-[12px] flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-500 font-medium">Status Filter:</span>
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            {['All', 'Paid', 'Pending', 'Overdue'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md transition-all font-medium text-xs ${
                  statusFilter === st
                    ? 'bg-white text-[#2563EB] shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-gray-500">
          Showing <strong>{filteredPayments.length}</strong> payment record(s)
        </span>
      </div>

      {/* Payment Summary Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#111827]">
              <thead className="bg-slate-50 border-b border-[#E5E7EB] text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3.5">Invoice Number</th>
                  <th className="px-4 py-3.5">Warehouse</th>
                  <th className="px-4 py-3.5">Tenant</th>
                  <th className="px-4 py-3.5">Due Date</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No matching rent invoices found.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => {
                    const isPaid = p.status === 'Paid';
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* 1. Invoice Number (Clickable to open Payment Details) */}
                        <td className="px-4 py-3.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDetails(p)}
                            className="font-mono font-bold text-[#2563EB] hover:underline flex items-center gap-1.5 focus:outline-hidden"
                            title="Click to view complete Invoice Details"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                            {p.invoiceNumber}
                          </button>
                        </td>

                        {/* 2. Warehouse */}
                        <td className="px-4 py-3.5 font-medium text-gray-800">{p.warehouseName}</td>

                        {/* 3. Tenant */}
                        <td className="px-4 py-3.5 font-medium text-gray-900">{p.tenantName}</td>

                        {/* 4. Due Date */}
                        <td className="px-4 py-3.5 text-gray-600 font-mono">{p.dueDate}</td>

                        {/* 5. Amount */}
                        <td className="px-4 py-3.5 font-bold text-[#111827]">
                          ₹{p.amount.toLocaleString('en-IN')}
                        </td>

                        {/* 6. Status */}
                        <td className="px-4 py-3.5">
                          <Badge
                            variant={
                              isPaid
                                ? 'success'
                                : p.status === 'Pending'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {p.status}
                          </Badge>
                        </td>

                        {/* 7. Actions */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Icon to open Payment Details Modal */}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="px-2 py-1 text-gray-600 hover:text-[#2563EB]"
                              onClick={() => handleOpenDetails(p)}
                              title="View Invoice Details"
                              icon={<Eye className="w-3.5 h-3.5" />}
                            >
                              View
                            </Button>

                            {/* Actions for Pending Status */}
                            {!isPaid && (
                              <>
                                <Button
                                  size="sm"
                                  variant="primary"
                                  className="px-2 py-1 text-[11px]"
                                  onClick={() => handleOpenRecordDialog(p)}
                                  icon={<Check className="w-3 h-3" />}
                                >
                                  Mark as Paid
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="px-2 py-1 text-[11px]"
                                  onClick={() => handleOpenPrintModal(p, 'Invoice')}
                                  icon={<Download className="w-3 h-3" />}
                                  title="Download Invoice PDF"
                                >
                                  Invoice
                                </Button>
                              </>
                            )}

                            {/* Actions for Paid Status */}
                            {isPaid && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="px-2 py-1 text-[11px]"
                                onClick={() => handleOpenPrintModal(p, 'Receipt')}
                                icon={<Download className="w-3 h-3" />}
                                title="Download Payment Receipt PDF"
                              >
                                Receipt
                              </Button>
                            )}

                            {/* Edit Button */}
                            {onEditPayment && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="px-2 py-1 text-[11px]"
                                onClick={() => onEditPayment(p)}
                                icon={<Edit className="w-3 h-3" />}
                                title="Edit Payment"
                              >
                                Edit
                              </Button>
                            )}

                            {/* Move to Bin */}
                            <DeleteButton
                              onClick={() => onDeletePayment(p)}
                              label="Move to Bin"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Complete Invoice / Payment Details Modal */}
      <PaymentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
        tenants={tenants}
        warehouses={warehouses}
        settings={settings}
        onRecordPayment={(paymentId, details) => {
          onRecordPayment(paymentId, details);
          // Keep state synced
          if (selectedPayment && selectedPayment.id === paymentId) {
            setSelectedPayment({
              ...selectedPayment,
              status: 'Paid',
              amountPaid: details.paymentAmount,
              outstandingAmount: 0,
              paidDate: details.paymentDate,
              paymentMethod: details.paymentMethod,
              transactionId: details.transactionId,
              collectedBy: details.receivedBy,
              notes: details.notes,
              nextDueDate: details.nextDueDate
            });
          }
        }}
        onMarkUnpaid={(paymentId, reason, notes) => {
          onMarkUnpaid(paymentId, reason, notes);
          if (selectedPayment && selectedPayment.id === paymentId) {
            setSelectedPayment({
              ...selectedPayment,
              status: 'Pending',
              amountPaid: 0,
              outstandingAmount: selectedPayment.amount,
              paidDate: undefined
            });
          }
        }}
        onEditPayment={onEditPayment}
        onMoveToBin={onDeletePayment}
      />

      {/* Record Payment Dialog (Triggered directly from table) */}
      <RecordPaymentDialog
        isOpen={isRecordDialogOpen}
        onClose={() => {
          setIsRecordDialogOpen(false);
          setRecordDialogPayment(null);
        }}
        payment={recordDialogPayment}
        onConfirm={(paymentId, details) => {
          onRecordPayment(paymentId, details);
          setIsRecordDialogOpen(false);
        }}
      />

      {/* Printable Invoice / Receipt Modal */}
      <InvoicePrintModal
        isOpen={isPrintModalOpen}
        onClose={() => {
          setIsPrintModalOpen(false);
          setPrintModalPayment(null);
        }}
        payment={printModalPayment}
        tenant={tenants.find((t) => t.id === printModalPayment?.tenantId || t.name === printModalPayment?.tenantName)}
        warehouse={warehouses.find((w) => w.id === printModalPayment?.warehouseId || w.name === printModalPayment?.warehouseName)}
        settings={settings}
        type={printType}
      />
    </div>
  );
};
