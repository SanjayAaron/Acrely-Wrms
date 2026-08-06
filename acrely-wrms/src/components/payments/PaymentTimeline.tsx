import React from 'react';
import { RentPayment } from '../../types';
import { CheckCircle2, Clock, FileText, Send, DollarSign, Receipt } from 'lucide-react';

interface PaymentTimelineProps {
  payment: RentPayment;
}

/**
  * Reusable PaymentTimeline component rendering ERP payment progression steps:
  * 1. Invoice Created
  * 2. Reminder Sent
  * 3. Payment Received
  * 4. Receipt Generated
  */
export const PaymentTimeline: React.FC<PaymentTimelineProps> = ({ payment }) => {
  const isPaid = payment.status === 'Paid';
  const hasReminder = payment.history?.some((h) => h.title.includes('Reminder'));
  const isReceiptDone = payment.receiptGenerated || isPaid;

  const steps = [
    {
      id: 'step-1',
      title: 'Invoice Created',
      icon: <FileText className="w-4 h-4" />,
      completed: true,
      subtext: payment.history?.find((h) => h.title.includes('Invoice'))?.date || 'Generated'
    },
    {
      id: 'step-2',
      title: 'Reminder Sent',
      icon: <Send className="w-4 h-4" />,
      completed: hasReminder || isPaid,
      subtext: payment.history?.find((h) => h.title.includes('Reminder'))?.date || (hasReminder ? 'Sent' : 'Scheduled')
    },
    {
      id: 'step-3',
      title: 'Payment Received',
      icon: <DollarSign className="w-4 h-4" />,
      completed: isPaid,
      subtext: isPaid ? (payment.paidDate || 'Paid') : 'Awaiting Payment'
    },
    {
      id: 'step-4',
      title: 'Receipt Generated',
      icon: <Receipt className="w-4 h-4" />,
      completed: isPaid && isReceiptDone,
      subtext: isPaid && isReceiptDone ? 'Receipt Issued' : 'Pending Payment'
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 border border-[#E5E7EB] dark:border-[#334155] rounded-[14px] p-4 my-3">
      <h4 className="text-xs font-semibold text-gray-500 dark:text-[#94A3B8] uppercase tracking-wider mb-3">
        Payment Progress Timeline
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={`flex flex-col p-3 rounded-[10px] border transition-all ${
              step.completed
                ? 'bg-white dark:bg-[#1E293B] border-blue-200 dark:border-blue-900/60 shadow-2xs'
                : 'bg-slate-100/70 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div
                className={`p-1.5 rounded-md ${
                  step.completed ? 'bg-blue-50 text-[#2563EB]' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.icon}
              </div>
              {step.completed ? (
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              ) : (
                <Clock className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <p className="text-xs font-bold text-[#111827]">{step.title}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{step.subtext}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
