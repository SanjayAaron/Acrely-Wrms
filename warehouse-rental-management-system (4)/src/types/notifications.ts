import { NavigationTab } from './index';

export type NotificationModule =
  | 'All'
  | 'Unread'
  | 'Payments'
  | 'CRM'
  | 'Warehouses'
  | 'Tenants'
  | 'Brokers'
  | 'System'
  | 'Documents';

export type NotificationPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type NotificationType =
  | 'rent_received'
  | 'rent_due_tomorrow'
  | 'overdue_payment'
  | 'warehouse_added'
  | 'tenant_added'
  | 'broker_assigned'
  | 'crm_lead_updated'
  | 'invoice_generated'
  | 'recycle_bin_item'
  | 'staff_account_created'
  | 'password_changed'
  | 'settings_updated';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  module: Exclude<NotificationModule, 'All' | 'Unread'>;
  priority: NotificationPriority;
  type: NotificationType;
  timestamp: string;
  createdAt: string; // ISO string for precise sorting
  isRead: boolean;
  relatedEntity?: {
    type: 'payment' | 'warehouse' | 'tenant' | 'broker' | 'lead' | 'invoice' | 'staff' | 'recycle_bin' | 'settings';
    id?: string;
    targetTab: NavigationTab;
  };
}

export type NotificationSortOption =
  | 'newest'
  | 'oldest'
  | 'unread_first'
  | 'priority';
