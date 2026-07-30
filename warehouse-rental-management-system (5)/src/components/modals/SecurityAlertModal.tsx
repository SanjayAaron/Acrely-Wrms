import React from 'react';
import { ShieldAlert, Clock, MapPin, Monitor, Globe, Mail, X, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { SecurityAlert } from '../../utils/securityManager';

interface SecurityAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: SecurityAlert | null;
}

export const SecurityAlertModal: React.FC<SecurityAlertModalProps> = ({
  isOpen,
  onClose,
  alert
}) => {
  if (!isOpen || !alert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-2xl shadow-2xl overflow-hidden z-10 my-auto animate-scaleUp">
        {/* Top Security Banner */}
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-red-700 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-200">
                Acrely OS Security Dispatch
              </span>
              <h3 className="text-sm font-bold text-white">
                {alert.subject}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulated Security Email Container */}
        <div className="p-6 space-y-5 text-xs text-[#111827] dark:text-[#F8FAFC] max-h-[80vh] overflow-y-auto">
          {/* Email Headers Card */}
          <div className="p-3 bg-slate-50 dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155] rounded-xl space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-[#94A3B8]">From:</span>
              <span className="font-semibold text-[#2563EB] dark:text-blue-400">security-alerts@acrely.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-[#94A3B8]">To:</span>
              <span className="font-semibold text-gray-800 dark:text-[#CBD5E1]">{alert.recipientEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-[#94A3B8]">Date:</span>
              <span className="text-gray-700 dark:text-[#CBD5E1]">{alert.timestamp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-[#94A3B8]">Status:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Dispatched to Owner
              </span>
            </div>
          </div>

          {/* Email Body Content */}
          <div className="space-y-3 leading-relaxed">
            <p className="font-semibold text-[#111827] dark:text-[#F8FAFC]">
              Dear Account Owner,
            </p>

            <p className="text-gray-600 dark:text-[#CBD5E1]">
              Our automated threat response system detected <strong className="text-red-600 dark:text-red-400">{alert.failedAttempts} consecutive failed login attempts</strong> for account <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-red-600 dark:text-red-300 font-bold">{alert.attemptedEmail}</code>.
            </p>

            <p className="text-gray-600 dark:text-[#CBD5E1]">
              As an enterprise security precaution, access to this account has been <strong className="text-red-600 dark:text-red-400">temporarily locked for {alert.lockoutDurationMinutes} minutes</strong> to prevent unauthorized brute-force entry.
            </p>
          </div>

          {/* Incident Technical Details Grid */}
          <div className="p-4 bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-xl space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-900 dark:text-red-300 block border-b border-red-200 dark:border-red-900/50 pb-1.5">
              Incident Incident Analysis & Location Data
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                <div>
                  <span className="text-gray-500 dark:text-slate-400 block text-[10px]">Timestamp:</span>
                  <span className="font-mono font-bold text-gray-800 dark:text-slate-200">{alert.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                <div>
                  <span className="text-gray-500 dark:text-slate-400 block text-[10px]">Origin IP Address:</span>
                  <span className="font-mono font-bold text-gray-800 dark:text-slate-200">{alert.ipAddress}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                <div>
                  <span className="text-gray-500 dark:text-slate-400 block text-[10px]">Device & Browser:</span>
                  <span className="font-medium text-gray-800 dark:text-slate-200">{alert.deviceBrowser}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                <div>
                  <span className="text-gray-500 dark:text-slate-400 block text-[10px]">Approx. Location:</span>
                  <span className="font-medium text-gray-800 dark:text-slate-200">{alert.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl space-y-1.5 text-amber-900 dark:text-amber-200 text-xs">
            <span className="font-bold flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Recommended Security Actions:
            </span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-800 dark:text-amber-300">
              <li>If you attempted this login, please wait 2 minutes for the lockout timer to expire.</li>
              <li>If this wasn't you, your account may be under automated credential spray. Reset your password immediately.</li>
              <li>Review active device sessions in Acrely OS Settings → Security & Sessions.</li>
            </ul>
          </div>

          {/* Footer signature */}
          <div className="pt-2 text-[11px] text-gray-500 dark:text-[#94A3B8] border-t border-[#E5E7EB] dark:border-[#334155] flex items-center justify-between">
            <span>Acrely OS Security Operations Center</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#2563EB] hover:bg-[#3B82F6] text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Acknowledge Notice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
