import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { RentPayment } from '../../types';

interface MarkUnpaidDialogProps {
  isOpen: boolean;
  onClose: () => void;
  payment: RentPayment | null;
  onConfirm: (paymentId: string, reason: string, notes: string) => void;
}

/**
  * Modal confirmation dialog for marking a paid invoice back to Unpaid / Pending status.
  * Available ONLY inside the Payment Details page / modal.
  */
export const MarkUnpaidDialog: React.FC<MarkUnpaidDialogProps> = ({
  isOpen,
  onClose,
  payment,
  onConfirm
}) => {
  const [reason, setReason] = useState<string>('Payment Reversed');
  const [notes, setNotes] = useState<string>('');

  if (!payment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(payment.id, reason, notes);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mark Payment as Unpaid" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Warning Alert Banner */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-[10px] flex items-start gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">This payment will be moved back to Pending.</p>
            <p className="text-[11px] text-amber-700 mt-0.5">
              Invoice <span className="font-bold">{payment.invoiceNumber}</span> for{' '}
              <span className="font-bold">{payment.tenantName}</span> will be marked as unpaid.
            </p>
          </div>
        </div>

        {/* Reason Dropdown */}
        <Select
          label="Reason for Reversal / Unpaid Status"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          options={[
            { label: 'Payment Reversed', value: 'Payment Reversed' },
            { label: 'Cheque Bounced', value: 'Cheque Bounced' },
            { label: 'Incorrect Entry', value: 'Incorrect Entry' },
            { label: 'Other', value: 'Other' }
          ]}
        />

        {/* Audit Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#111827] mb-1">
            Reason Details / Audit Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full text-xs px-3 py-2 border border-[#E5E7EB] rounded-[8px] focus:outline-hidden focus:border-[#2563EB] text-[#111827] bg-white"
            placeholder="Provide brief details regarding why this payment is being marked as unpaid..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Mark Unpaid
          </Button>
        </div>
      </form>
    </Modal>
  );
};
