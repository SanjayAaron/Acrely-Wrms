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

/**
 * Helper to render the relevant icon for each Notification Type
 */
const renderNotificationIcon = (type: AppNotification['type']) => {
  switch (type) {
    case 'rent_received':
      return (
        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
          <CreditCard className="w-4 h-4" />
        </div>
      );
    case 'rent_due_tomorrow':
      return (
        <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4" />
        </div>
      );
    case 'overdue_payment':
      return (
        <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
          <AlertCircle className="w-4 h-4" />
        </div>
      );
    case 'warehouse_added':
      return (
        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <Building2 className="w-4 h-4" />
        </div>
      );
    case 'tenant_added':
      return (
        <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
          <UserCheck className="w-4 h-4" />
        </div>
      );
    case 'broker_assigned':
      return (
        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <Handshake className="w-4 h-4" />
        </div>
      );
    case 'crm_lead_updated':
      return (
        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
          <ClipboardList className="w-4 h-4" />
        </div>
      );
    case 'invoice_generated':
      return (
        <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4" />
        </div>
      );
    case 'recycle_bin_item':
      return (
        <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
          <Trash2 className="w-4 h-4" />
        </div>
      );
    case 'staff_account_created':
      return (
        <div className="w-9 h-9 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
          <UserPlus className="w-4 h-4" />
        </div>
      );
    case 'password_changed':
      return (
        <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Lock className="w-4 h-4" />
        </div>
      );
    case 'settings_updated':
    default:
      return (
        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
          <Settings className="w-4 h-4" />
        </div>
      );
  }
};

/**
 * Priority badge visual styles
 */
const getPriorityBadge = (priority: NotificationPriority) => {
  switch (priority) {
    case 'Critical':
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-red-100 text-red-700 border border-red-200 uppercase tracking-wider">
          Critical
        </span>
      );
    case 'High':
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wider">
          High
        </span>
      );
    case 'Medium':
      return (
        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
          Medium
        </span>
      );
    case 'Low':
    default:
      return (
        <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200">
          Low
        </span>
      );
  }
};

/**
 * Reusable NotificationCard Component
 * Displays a single notification with metadata, badges, and action controls.
 */
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
          ? 'bg-white border-[#E5E7EB] hover:border-slate-300 hover:shadow-xs'
          : 'bg-blue-50/40 border-blue-200 shadow-2xs hover:bg-blue-50/70 hover:border-blue-300'
      }`}
    >
      {/* Type Icon */}
      {renderNotificationIcon(notification.type)}

      {/* Main Content Body */}
      <div className="flex-1 min-w-0 w-full space-y-1.5">
        {/* Top Meta Line: Title, Badges, Unread status */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <h4 className={`text-xs sm:text-sm font-bold truncate ${isRead ? 'text-[#111827]' : 'text-blue-950'}`}>
              {title}
            </h4>

            {/* Unread Indicator Badge */}
            {!isRead && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-600 text-white shadow-2xs">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Unread
              </span>
            )}

            {/* Module Badge */}
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
              {module}
            </span>

            {/* Priority Badge */}
            {getPriorityBadge(priority)}
          </div>

          <span className="text-[11px] font-medium text-gray-400 shrink-0">
            {timestamp}
          </span>
        </div>

        {/* Description Body */}
        <p className="text-xs text-gray-600 leading-relaxed pr-2">
          {description}
        </p>

        {/* Card Action Controls Footer */}
        <div className="pt-2.5 mt-2 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
          {/* View Details Primary Action */}
          <button
            type="button"
            onClick={() => onViewDetails(notification)}
            className="h-[34px] px-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-[8px] inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] shadow-2xs cursor-pointer"
            title="Navigate directly to related module page"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Secondary Actions: Mark Read/Unread & Delete */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onToggleRead(id)}
              className="h-[34px] px-2.5 bg-white hover:bg-slate-100 border border-[#E5E7EB] text-gray-700 text-xs font-medium rounded-[8px] inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              title={isRead ? 'Mark as Unread' : 'Mark as Read'}
            >
              {isRead ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                  <span className="hidden sm:inline">Mark Unread</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Mark Read</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onDelete(id)}
              className="h-[34px] px-2.5 bg-white hover:bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-[8px] inline-flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer"
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
