import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { RentPayment, PaymentMethodType } from '../../types';
import { Check, DollarSign } from 'lucide-react';

interface RecordPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  payment: RentPayment | null;
  onConfirm: (paymentId: string, details: RecordPaymentData) => void;
}

export interface RecordPaymentData {
  paymentAmount: number;
  paymentDate: string;
  paymentMethod: PaymentMethodType;
  transactionId: string;
  receivedBy: string;
  notes: string;
  nextDueDate: string;
  generateReceipt: boolean;
}

/**
  * Modal dialog for recording rent payment with full ERP accounting details.
  */
export const RecordPaymentDialog: React.FC<RecordPaymentDialogProps> = ({
  isOpen,
  onClose,
  payment,
  onConfirm
}) => {
  const [amount, setAmount] = useState<number>(payment?.amount || 0);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('Bank Transfer');
  const [transactionId, setTransactionId] = useState<string>('');
  const [receivedBy, setReceivedBy] = useState<string>('Property Owner');
  const [notes, setNotes] = useState<string>('');
  const [nextDueDate, setNextDueDate] = useState<string>('');
  const [generateReceipt, setGenerateReceipt] = useState<boolean>(true);

  useEffect(() => {
    if (payment) {
      setAmount(payment.amount);
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod(payment.paymentMethod || 'Bank Transfer');
      setTransactionId(payment.transactionId || `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`);
      setReceivedBy(payment.collectedBy || 'Property Owner');
      setNotes(payment.notes || 'Full rent payment received in good order.');
      
      // Calculate next due date (1 month after current due date)
      if (payment.dueDate) {
        const currentDue = new Date(payment.dueDate);
        currentDue.setMonth(currentDue.getMonth() + 1);
        setNextDueDate(currentDue.toISOString().split('T')[0]);
      } else {
        setNextDueDate('');
      }
    }
  }, [payment, isOpen]);

  if (!payment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(payment.id, {
      paymentAmount: Number(amount),
      paymentDate,
      paymentMethod,
      transactionId,
      receivedBy,
      notes,
      nextDueDate,
      generateReceipt
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Rent Payment" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Invoice Brief Summary Banner */}
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-[10px] flex items-center justify-between text-xs">
          <div>
            <span className="text-gray-500 font-medium">Invoice: </span>
            <span className="font-bold text-[#111827]">{payment.invoiceNumber}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-gray-500 font-medium">Tenant: </span>
            <span className="font-bold text-[#111827]">{payment.tenantName}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-500 text-[11px] block">Warehouse</span>
            <span className="font-semibold text-[#2563EB]">{payment.warehouseName}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Payment Amount */}
          <Input
            label="Payment Amount (₹)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
            placeholder="150000"
          />

          {/* Payment Date */}
          <Input
            label="Payment Date"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />

          {/* Payment Method Dropdown */}
          <Select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethodType)}
            required
            options={[
              { label: 'Cash', value: 'Cash' },
              { label: 'UPI', value: 'UPI' },
              { label: 'Bank Transfer', value: 'Bank Transfer' },
              { label: 'Cheque', value: 'Cheque' },
              { label: 'NEFT', value: 'NEFT' },
              { label: 'RTGS', value: 'RTGS' },
              { label: 'Direct Deposit', value: 'Direct Deposit' }
            ]}
          />

          {/* Transaction ID */}
          <Input
            label="Transaction ID / Ref No."
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="e.g. TXN-9823471029"
          />

          {/* Received By */}
          <Input
            label="Received By"
            value={receivedBy}
            onChange={(e) => setReceivedBy(e.target.value)}
            placeholder="Property Owner"
          />

          {/* Next Payment Due Date */}
          <Input
            label="Next Payment Due Date"
            type="date"
            value={nextDueDate}
            onChange={(e) => setNextDueDate(e.target.value)}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#111827] mb-1">
            Accounting Notes / Comments
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full text-xs px-3 py-2 border border-[#E5E7EB] rounded-[8px] focus:outline-hidden focus:border-[#2563EB] text-[#111827] bg-white"
            placeholder="Optional notes regarding this payment transaction..."
          />
        </div>

        {/* Generate Receipt Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="generateReceipt"
            checked={generateReceipt}
            onChange={(e) => setGenerateReceipt(e.target.checked)}
            className="w-4 h-4 text-[#2563EB] border-gray-300 rounded focus:ring-[#2563EB]"
          />
          <label htmlFor="generateReceipt" className="text-xs font-medium text-[#111827]">
            Automatically Generate & Issue Payment Receipt
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" icon={<Check className="w-3.5 h-3.5" />}>
            Save Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
