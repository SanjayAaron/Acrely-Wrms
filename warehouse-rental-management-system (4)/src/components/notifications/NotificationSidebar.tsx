import React from 'react';
import {
  Bell,
  CircleDot,
  CreditCard,
  ClipboardList,
  Building2,
  UserCheck,
  Handshake,
  Settings,
  FileText,
} from 'lucide-react';
import { NotificationModule, AppNotification } from '../../types/notifications';
import { NotificationFilter } from './NotificationFilter';

interface NotificationSidebarProps {
  activeModule: NotificationModule;
  onSelectModule: (module: NotificationModule) => void;
  notifications: AppNotification[];
}

/**
 * Reusable Left Sidebar Component for Notification Center.
 * Houses category filter controls with dynamic count pills for All, Unread, Payments, CRM, Warehouses, Tenants, Brokers, System, Documents.
 */
export const NotificationSidebar: React.FC<NotificationSidebarProps> = ({
  activeModule,
  onSelectModule,
  notifications,
}) => {
  // Compute counts for each filter category dynamically
  const getCount = (filterId: NotificationModule): number => {
    if (filterId === 'All') return notifications.length;
    if (filterId === 'Unread') return notifications.filter((n) => !n.isRead).length;
    return notifications.filter((n) => n.module === filterId).length;
  };

  const filterItems: Array<{
    id: NotificationModule;
    label: string;
    icon: React.ReactNode;
  }> = [
    { id: 'All', label: 'All Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'Unread', label: 'Unread Only', icon: <CircleDot className="w-4 h-4 text-blue-500" /> },
    { id: 'Payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'CRM', label: 'CRM Pipeline', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'Warehouses', label: 'Warehouses', icon: <Building2 className="w-4 h-4" /> },
    { id: 'Tenants', label: 'Tenants', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'Brokers', label: 'Brokers', icon: <Handshake className="w-4 h-4" /> },
    { id: 'System', label: 'System & Security', icon: <Settings className="w-4 h-4" /> },
    { id: 'Documents', label: 'Invoices & Documents', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-full lg:w-60 bg-slate-50/80 border-r border-[#E5E7EB] p-3.5 flex flex-col gap-1.5 shrink-0">
      <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
        Categories & Modules
      </div>

      <div className="space-y-1 overflow-y-auto max-h-[160px] lg:max-h-none pr-1">
        {filterItems.map((item) => (
          <NotificationFilter
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            count={getCount(item.id)}
            isActive={activeModule === item.id}
            onClick={onSelectModule}
          />
        ))}
      </div>
    </aside>
  );
};
