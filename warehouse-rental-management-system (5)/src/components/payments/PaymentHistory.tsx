import React from 'react';
import { PaymentHistoryEvent } from '../../types';
import { Calendar, User, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface PaymentHistoryProps {
  history?: PaymentHistoryEvent[];
}

/**
  * Reusable PaymentHistory component rendering structured audit log timeline events for rent invoices.
  */
export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ history = [] }) => {
  if (history.length === 0) {
    return (
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-[#E5E7EB] dark:border-[#334155] rounded-[10px] text-xs text-gray-500 dark:text-[#94A3B8] text-center">
        No payment history records log yet.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {history.map((event) => (
        <div
          key={event.id}
          className="p-3 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[10px] flex items-start gap-3 hover:border-gray-300 dark:hover:border-slate-600 transition-colors"
        >
          <div
            className={`p-1.5 rounded-full shrink-0 mt-0.5 ${
              event.statusTag === 'success'
                ? 'bg-green-50 text-[#16A34A]'
                : event.statusTag === 'warning'
                ? 'bg-amber-50 text-amber-600'
                : event.statusTag === 'danger'
                ? 'bg-red-50 text-red-600'
                : 'bg-blue-50 text-[#2563EB]'
            }`}
          >
            {event.statusTag === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : event.statusTag === 'warning' ? (
              <Clock className="w-3.5 h-3.5" />
            ) : event.statusTag === 'danger' ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : (
              <Calendar className="w-3.5 h-3.5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h5 className="text-xs font-bold text-[#111827]">{event.title}</h5>
              <span className="text-[10px] text-gray-400 font-medium shrink-0">
                {event.date}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{event.description}</p>
            {event.performedBy && (
              <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                <User className="w-3 h-3 text-gray-400" />
                <span>By {event.performedBy}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
