import React from 'react';
import {
  CreditCard,
  Clock,
  AlertCircle,
  Building2,
  UserCheck,
  Handshake,
  ClipboardList,
  FileText,
  Trash2,
  UserPlus,
  Lock,
  Settings,
  ArrowRight,
  Check,
  RotateCcw,
} from 'lucide-react';
import { AppNotification, NotificationPriority } from '../../types/notifications';

interface NotificationCardProps {
  notification: AppNotification;
  onViewDetails: (notification: AppNotification) => void;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const renderNotificationIcon = (type: AppNotification['type']) => {
  switch (type) {
    case 'rent_received':
      return (
        <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <CreditCard className="w-4 h-4" />
        </div>
      );
    case 'rent_due_tomorrow':
      return (
        <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4" />
        </div>
      );
    case 'overdue_payment':
      return (
        <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
          <AlertCircle className="w-4 h-4" />
        </div>
      );
    case 'warehouse_added':
      return (
        <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Building2 className="w-4 h-4" />
        </div>
      );
    case 'tenant_added':
      return (
        <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
          <UserCheck className="w-4 h-4" />
        </div>
      );
    case 'broker_assigned':
      return (
        <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <Handshake className="w-4 h-4" />
        </div>
      );
    case 'crm_lead_updated':
      return (
        <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <ClipboardList className="w-4 h-4" />
        </div>
      );
    case 'invoice_generated':
      return (
        <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4" />
        </div>
      );
    case 'recycle_bin_item':
      return (
        <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
          <Trash2 className="w-4 h-4" />
        </div>
      );
    case 'staff_account_created':
      return (
        <div className="w-9 h-9 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
          <UserPlus className="w-4 h-4" />
        </div>
      );
    case 'password_changed':
      return (
        <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Lock className="w-4 h-4" />
        </div>
      );
    case 'settings_updated':
    default:
      return (
        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
          <Settings className="w-4 h-4" />
        </div>
      );
  }
};

const getPriorityBadge = (priority: NotificationPriority) => {
  switch (priority) {
    case 'Critical':
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 uppercase tracking-wider">
          Critical
        </span>
      );
    case 'High':
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 uppercase tracking-wider">
          High
        </span>
      );
    case 'Medium':
      return (
        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
          Medium
        </span>
      );
    case 'Low':
    default:
      return (
        <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          Low
        </span>
      );
  }
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onViewDetails,
  onToggleRead,
  onDelete,
}) => {
  const { id, title, description, module, priority, timestamp, isRead } = notification;

  return (
    <div
      className={`p-4 rounded-[12px] border transition-all duration-200 flex flex-col sm:flex-row items-start gap-3.5 relative group ${
        isRead
          ? 'bg-white dark:bg-[#1E293B] border-[#E5E7EB] dark:border-[#334155] hover:border-slate-300 dark:hover:border-slate-600'
          : 'bg-blue-50/40 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/80 shadow-2xs hover:bg-blue-50/70 dark:hover:bg-blue-950/50'
      }`}
    >
      {renderNotificationIcon(notification.type)}

      <div className="flex-1 min-w-0 w-full space-y-1.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <h4 className={`text-xs sm:text-sm font-bold truncate ${isRead ? 'text-[#111827] dark:text-[#F8FAFC]' : 'text-blue-950 dark:text-blue-300'}`}>
              {title}
            </h4>

            {!isRead && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-600 text-white shadow-2xs">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Unread
              </span>
            )}

            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {module}
            </span>

            {getPriorityBadge(priority)}
          </div>

          <span className="text-[11px] font-medium text-gray-400 dark:text-[#64748B] shrink-0">
            {timestamp}
          </span>
        </div>

        <p className="text-xs text-gray-600 dark:text-[#CBD5E1] leading-relaxed pr-2">
          {description}
        </p>

        <div className="pt-2.5 mt-2 border-t border-gray-100 dark:border-[#334155] flex items-center justify-between gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onViewDetails(notification)}
            className="h-[34px] px-3 bg-[#2563EB] hover:bg-[#3B82F6] text-white text-xs font-medium rounded-[8px] inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] shadow-2xs cursor-pointer"
            title="Navigate directly to related module page"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onToggleRead(id)}
              className="h-[34px] px-2.5 bg-white dark:bg-[#1E293B] hover:bg-slate-100 dark:hover:bg-[#273549] border border-[#E5E7EB] dark:border-[#334155] text-gray-700 dark:text-[#CBD5E1] text-xs font-medium rounded-[8px] inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              title={isRead ? 'Mark as Unread' : 'Mark as Read'}
            >
              {isRead ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-gray-500 dark:text-[#94A3B8]" />
                  <span className="hidden sm:inline">Mark Unread</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="hidden sm:inline">Mark Read</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onDelete(id)}
              className="h-[34px] px-2.5 bg-white dark:bg-[#1E293B] hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-medium rounded-[8px] inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              title="Move notification to Recycle Bin"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
