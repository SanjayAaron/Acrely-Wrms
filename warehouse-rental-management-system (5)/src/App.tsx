import React, { useState, useEffect } from 'react';
import { useExperience } from './context/ExperienceContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginView } from './components/views/LoginView';
import { DashboardView } from './components/views/DashboardView';
import { WarehousesView } from './components/views/WarehousesView';
import { TenantsView } from './components/views/TenantsView';
import { RentPaymentsView } from './components/views/RentPaymentsView';
import { BrokersView } from './components/views/BrokersView';
import { CrmView } from './components/views/CrmView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { RecycleBinView } from './components/views/RecycleBinView';

// Modals
import { WarehouseModal } from './components/modals/WarehouseModal';
import { WarehouseDetailModal } from './components/modals/WarehouseDetailModal';
import { TenantModal } from './components/modals/TenantModal';
import { PaymentModal } from './components/modals/PaymentModal';
import { BrokerModal } from './components/modals/BrokerModal';
import { LeadModal } from './components/modals/LeadModal';
import { ConfirmationDialog } from './components/modals/ConfirmationDialog';

// Initial Mock Data
import {
  INITIAL_WAREHOUSES,
  INITIAL_TENANTS,
  INITIAL_PAYMENTS,
  INITIAL_BROKERS,
  INITIAL_LEADS,
  INITIAL_ACTIVITIES,
  DEFAULT_SETTINGS,
  INITIAL_DOCUMENTS,
  INITIAL_EDITOR_ACCOUNTS,
  INITIAL_STAFF_MEMBERS,
  INITIAL_RECYCLE_ITEMS
} from './data/mockData';

import {
  NavigationTab,
  Warehouse,
  Tenant,
  RentPayment,
  Broker,
  Lead,
  LeadStage,
  LeadActivity,
  ActivityLog,
  SystemSettings,
  UserRole,
  DocumentItem,
  EditorAccount,
  StaffMember,
  RecycleBinItem,
  RecycleBinEntityType,
  PaymentHistoryEvent
} from './types';
import { getDefaultPermissionsForRole } from './components/settings/PermissionMatrix';
import { RecordPaymentData } from './components/payments/RecordPaymentDialog';
import { CheckCircle2, AlertCircle, X, Trash2 } from 'lucide-react';

import { initialNotifications } from './data/mockNotifications';
import { AppNotification } from './types/notifications';

export default function App() {
  // Navigation State - Default to ACRELY Enterprise Login Page
  const [activeTab, setActiveTab] = useState<NavigationTab>('login');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Access Control & Role State
  const [userRole, setUserRole] = useState<UserRole>('Owner');

  // Domain Entity State
  const [warehouses, setWarehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [payments, setPayments] = useState<RentPayment[]>(INITIAL_PAYMENTS);
  const [brokers, setBrokers] = useState<Broker[]>(INITIAL_BROKERS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [activities, setActivities] = useState<ActivityLog[]>(INITIAL_ACTIVITIES);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [editorAccounts, setEditorAccounts] = useState<EditorAccount[]>(INITIAL_EDITOR_ACCOUNTS);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(INITIAL_STAFF_MEMBERS);
  const [recycleBinItems, setRecycleBinItems] = useState<RecycleBinItem[]>(INITIAL_RECYCLE_ITEMS);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  const { playSound, triggerHaptic, syncWithSystemSettings } = useExperience();

  useEffect(() => {
    syncWithSystemSettings(settings);
  }, [settings]);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });

    const lowerMsg = message.toLowerCase();
    if (type === 'error') {
      playSound('error');
      triggerHaptic('error');
    } else if (lowerMsg.includes('payment') || lowerMsg.includes('paid')) {
      playSound('payment');
      triggerHaptic('success');
    } else if (lowerMsg.includes('invoice') || lowerMsg.includes('receipt')) {
      playSound('invoice');
      triggerHaptic('success');
    } else if (lowerMsg.includes('saved') || lowerMsg.includes('updated')) {
      playSound('save');
      triggerHaptic('light');
    } else if (lowerMsg.includes('delete') || lowerMsg.includes('bin')) {
      playSound('delete');
      triggerHaptic('medium');
    } else {
      playSound('success');
      triggerHaptic('success');
    }

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Soft Delete Dialog State (Move to Recycle Bin)
  type EntityType = RecycleBinEntityType;
  const [softDeleteModal, setSoftDeleteModal] = useState<{
    isOpen: boolean;
    entityType: EntityType;
    entityId: string;
    entityName: string;
    entityData: any;
  }>({
    isOpen: false,
    entityType: 'Warehouse',
    entityId: '',
    entityName: '',
    entityData: null
  });

  // Permanent Delete Dialog State (Delete Permanently)
  const [permanentDeleteModal, setPermanentDeleteModal] = useState<{
    isOpen: boolean;
    itemId: string;
    itemName: string;
    isAllBin?: boolean;
  }>({
    isOpen: false,
    itemId: '',
    itemName: ''
  });

  // Modal Control States
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [warehouseToEdit, setWarehouseToEdit] = useState<Warehouse | null>(null);

  const [isWarehouseDetailOpen, setIsWarehouseDetailOpen] = useState(false);
  const [warehouseToView, setWarehouseToView] = useState<Warehouse | null>(null);

  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [tenantToEdit, setTenantToEdit] = useState<Tenant | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState<RentPayment | null>(null);

  const [isBrokerModalOpen, setIsBrokerModalOpen] = useState(false);
  const [brokerToEdit, setBrokerToEdit] = useState<Broker | null>(null);

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);

  // Quick Add Trigger Handler
  const handleQuickAction = (type: 'warehouse' | 'tenant' | 'payment' | 'lead' | 'broker') => {
    switch (type) {
      case 'warehouse':
        setWarehouseToEdit(null);
        setIsWarehouseModalOpen(true);
        break;
      case 'tenant':
        setTenantToEdit(null);
        setIsTenantModalOpen(true);
        break;
      case 'payment':
        setPaymentToEdit(null);
        setIsPaymentModalOpen(true);
        break;
      case 'lead':
        setLeadToEdit(null);
        setIsLeadModalOpen(true);
        break;
      case 'broker':
        setBrokerToEdit(null);
        setIsBrokerModalOpen(true);
        break;
    }
  };

  // Request Soft Delete (Moves item to Recycle Bin after confirmation dialog)
  const handleRequestSoftDelete = (
    entityType: EntityType,
    entityId: string,
    entityName: string,
    entityData: any
  ) => {
    if (userRole !== 'Owner') {
      showToast('Permission Denied: Editors cannot delete items.', 'error');
      return;
    }
    setSoftDeleteModal({
      isOpen: true,
      entityType,
      entityId,
      entityName,
      entityData
    });
  };

  // Confirm Soft Delete (Move to Bin)
  const handleConfirmSoftDelete = () => {
    const { entityType, entityId, entityName, entityData } = softDeleteModal;
    if (userRole !== 'Owner') {
      showToast('Permission Denied: Editors cannot delete items.', 'error');
      setSoftDeleteModal((prev) => ({ ...prev, isOpen: false }));
      return;
    }

    // 1. Remove item from its active page state
    switch (entityType) {
      case 'Warehouse':
        setWarehouses((prev) => prev.filter((w) => w.id !== entityId));
        logActivity('Warehouse Moved to Bin', `Moved "${entityName}" to Recycle Bin.`, 'maintenance');
        break;
      case 'Tenant':
        setTenants((prev) => prev.filter((t) => t.id !== entityId));
        logActivity('Tenant Moved to Bin', `Moved "${entityName}" to Recycle Bin.`, 'lease');
        break;
      case 'Rent Payment':
        setPayments((prev) => prev.filter((p) => p.id !== entityId));
        logActivity('Payment Moved to Bin', `Moved invoice "${entityName}" to Recycle Bin.`, 'payment');
        break;
      case 'Broker':
        setBrokers((prev) => prev.filter((b) => b.id !== entityId));
        logActivity('Broker Moved to Bin', `Moved broker "${entityName}" to Recycle Bin.`, 'broker');
        break;
      case 'CRM Lead':
        setLeads((prev) => prev.filter((l) => l.id !== entityId));
        logActivity('Lead Moved to Bin', `Moved lead "${entityName}" to Recycle Bin.`, 'lead');
        break;
      case 'Document':
        setDocuments((prev) => prev.filter((d) => d.id !== entityId));
        logActivity('Document Moved to Bin', `Moved file "${entityName}" to Recycle Bin.`, 'maintenance');
        break;
      case 'Editor Account':
        setEditorAccounts((prev) => prev.filter((e) => e.id !== entityId));
        logActivity('Editor Account Moved to Bin', `Moved account "${entityName}" to Recycle Bin.`, 'maintenance');
        break;
      case 'Staff Account':
        setStaffMembers((prev) => prev.filter((s) => s.id !== entityId));
        logActivity('Staff Account Moved to Bin', `Moved staff account "${entityName}" to Recycle Bin.`, 'maintenance');
        break;
    }

    // 2. Create Recycle Bin Record
    const binRecord: RecycleBinItem = {
      id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      entityType,
      name: entityName,
      deletedDate: new Date().toISOString().split('T')[0],
      daysRemaining: 30,
      originalData: entityData
    };

    setRecycleBinItems((prev) => [binRecord, ...prev]);
    setSoftDeleteModal((prev) => ({ ...prev, isOpen: false }));
    showToast(`"${entityName}" moved to Recycle Bin.`);
  };

  // Restore Soft-Deleted Item
  const handleRestoreItem = (item: RecycleBinItem) => {
    // 1. Re-add item to its original page state
    switch (item.entityType) {
      case 'Warehouse':
        setWarehouses((prev) => [item.originalData, ...prev]);
        logActivity('Warehouse Restored', `Restored "${item.name}" from Recycle Bin.`, 'maintenance');
        break;
      case 'Tenant':
        setTenants((prev) => [item.originalData, ...prev]);
        logActivity('Tenant Restored', `Restored "${item.name}" from Recycle Bin.`, 'lease');
        break;
      case 'Rent Payment':
        setPayments((prev) => [item.originalData, ...prev]);
        logActivity('Payment Invoice Restored', `Restored invoice "${item.name}" from Recycle Bin.`, 'payment');
        break;
      case 'Broker':
        setBrokers((prev) => [item.originalData, ...prev]);
        logActivity('Broker Restored', `Restored broker "${item.name}" from Recycle Bin.`, 'broker');
        break;
      case 'CRM Lead':
        setLeads((prev) => [item.originalData, ...prev]);
        logActivity('Lead Restored', `Restored lead "${item.name}" from Recycle Bin.`, 'lead');
        break;
      case 'Document':
        setDocuments((prev) => [item.originalData, ...prev]);
        logActivity('Document Restored', `Restored file "${item.name}" from Recycle Bin.`, 'maintenance');
        break;
      case 'Editor Account':
        setEditorAccounts((prev) => [item.originalData, ...prev]);
        logActivity('Editor Account Restored', `Restored account "${item.name}" from Recycle Bin.`, 'maintenance');
        break;
      case 'Staff Account':
        setStaffMembers((prev) => [item.originalData, ...prev]);
        logActivity('Staff Account Restored', `Restored staff account "${item.name}" from Recycle Bin.`, 'maintenance');
        break;
    }

    // 2. Remove item from Recycle Bin
    setRecycleBinItems((prev) => prev.filter((i) => i.id !== item.id));
    showToast('Item restored successfully.');
  };

  // Staff Account Management Handlers
  const handleSaveStaffMember = (staffData: Partial<StaffMember>) => {
    if (staffData.id) {
      setStaffMembers((prev) =>
        prev.map((s) => (s.id === staffData.id ? ({ ...s, ...staffData } as StaffMember) : s))
      );
      logActivity('Staff Account Updated', `Updated staff account for ${staffData.firstName} ${staffData.lastName}.`, 'maintenance');
    } else {
      const newStaff: StaffMember = {
        id: `stf-${Date.now()}`,
        firstName: staffData.firstName || '',
        lastName: staffData.lastName || '',
        phone: staffData.phone || '',
        whatsappNumber: staffData.whatsappNumber || '',
        email: staffData.email || '',
        dateOfBirth: staffData.dateOfBirth || '',
        gender: staffData.gender || 'Male',
        address: staffData.address || '',
        photoUrl: staffData.photoUrl || '',
        username: staffData.username || `staff.${Date.now().toString().slice(-4)}`,
        emailLogin: staffData.emailLogin || staffData.email || '',
        password: staffData.password || 'Password@123',
        role: staffData.role || 'Staff',
        permissions: staffData.permissions || getDefaultPermissionsForRole(staffData.role || 'Staff'),
        status: staffData.status || 'Active',
        isTemporaryPassword: staffData.isTemporaryPassword ?? true,
        forcePasswordChange: staffData.forcePasswordChange ?? true,
        twoFactorEnabled: staffData.twoFactorEnabled ?? false,
        lastLogin: 'Never',
        createdAt: new Date().toISOString().split('T')[0],
        assignedWarehouseIds: ['wh-1', 'wh-2'],
        notes: staffData.notes || '',
        activityLog: [
          {
            id: `act-${Date.now()}`,
            action: 'Account Created',
            module: 'settings',
            timestamp: 'Just now',
            details: 'Account initialized by Administrator.'
          }
        ],
        recentLogins: []
      };
      setStaffMembers((prev) => [newStaff, ...prev]);
      logActivity('Staff Account Created', `Created staff account for ${newStaff.firstName} ${newStaff.lastName} (${newStaff.role}).`, 'maintenance');
    }
  };

  const handleResetStaffPassword = (staffId: string, newPassword: string) => {
    setStaffMembers((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, password: newPassword, forcePasswordChange: true } : s))
    );
    logActivity('Staff Password Reset', `Reset password for staff ID ${staffId}.`, 'maintenance');
  };

  const handleToggleDisableStaff = (staff: StaffMember) => {
    const newStatus = staff.status === 'Active' ? 'Inactive' : 'Active';
    setStaffMembers((prev) =>
      prev.map((s) => (s.id === staff.id ? { ...s, status: newStatus } : s))
    );
    logActivity('Staff Status Changed', `Set staff ${staff.firstName} ${staff.lastName} status to ${newStatus}.`, 'maintenance');
  };

  // Request Permanent Delete
  const handleRequestPermanentDelete = (item: RecycleBinItem) => {
    if (userRole !== 'Owner') {
      showToast('Permission Denied: Editors cannot delete items.', 'error');
      return;
    }
    setPermanentDeleteModal({
      isOpen: true,
      itemId: item.id,
      itemName: item.name,
      isAllBin: false
    });
  };

  // Confirm Permanent Delete
  const handleConfirmPermanentDelete = () => {
    if (userRole !== 'Owner') {
      showToast('Permission Denied: Editors cannot delete items.', 'error');
      setPermanentDeleteModal((prev) => ({ ...prev, isOpen: false }));
      return;
    }

    if (permanentDeleteModal.isAllBin) {
      setRecycleBinItems([]);
      showToast('Recycle Bin emptied.');
    } else {
      setRecycleBinItems((prev) => prev.filter((i) => i.id !== permanentDeleteModal.itemId));
      showToast('Item permanently deleted.');
    }

    setPermanentDeleteModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Empty Entire Recycle Bin
  const handleEmptyRecycleBin = () => {
    if (userRole !== 'Owner') {
      showToast('Permission Denied: Editors cannot delete items.', 'error');
      return;
    }
    setPermanentDeleteModal({
      isOpen: true,
      itemId: 'ALL',
      itemName: 'All items in Recycle Bin',
      isAllBin: true
    });
  };

  // Warehouse CRUD Handlers
  const handleSaveWarehouse = (savedWh: Warehouse) => {
    const exists = warehouses.some((w) => w.id === savedWh.id);
    if (exists) {
      setWarehouses(warehouses.map((w) => (w.id === savedWh.id ? savedWh : w)));
    } else {
      setWarehouses([savedWh, ...warehouses]);
      logActivity(
        'New Warehouse Added',
        `Registered ${savedWh.name} (${savedWh.address?.split('\n')[0] || savedWh.locationZone || 'Address provided'}) with area of ${savedWh.areaSqFt} sq ft.`,
        'lease'
      );
    }
  };

  // Tenant CRUD Handlers
  const handleSaveTenant = (savedTenant: Tenant) => {
    const exists = tenants.some((t) => t.id === savedTenant.id);
    if (exists) {
      setTenants(tenants.map((t) => (t.id === savedTenant.id ? savedTenant : t)));
    } else {
      setTenants([savedTenant, ...tenants]);
      setWarehouses(
        warehouses.map((w) =>
          w.id === savedTenant.warehouseId
            ? { ...w, status: 'Occupied', tenantId: savedTenant.id, tenantName: savedTenant.name }
            : w
        )
      );
      logActivity(
        'New Tenant Registered',
        `${savedTenant.name} assigned to ${savedTenant.warehouseName}.`,
        'lease'
      );
    }
  };

  // Payment CRUD & ERP Accounting Handlers
  const handleSavePayment = (savedPay: RentPayment) => {
    const exists = payments.some((p) => p.id === savedPay.id);
    if (exists) {
      setPayments(payments.map((p) => (p.id === savedPay.id ? savedPay : p)));
      showToast('Payment details updated.');
    } else {
      const initialHistory: PaymentHistoryEvent[] = [
        {
          id: `h-init-${Date.now()}`,
          title: 'Invoice Created',
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          description: `Invoice ${savedPay.invoiceNumber} created for ${savedPay.tenantName}.`,
          performedBy: userRole,
          statusTag: 'info'
        }
      ];
      setPayments([{ ...savedPay, history: initialHistory }, ...payments]);
      if (savedPay.status === 'Paid') {
        logActivity(
          'Rent Payment Recorded',
          `Received ₹${savedPay.amount.toLocaleString('en-IN')} for ${savedPay.warehouseName} from ${savedPay.tenantName}.`,
          'payment'
        );
      }
      showToast('Rent payment record created.');
    }
  };

  const handleRecordPayment = (paymentId: string, details: RecordPaymentData) => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === paymentId) {
          const nowFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);
          const newHistoryItem: PaymentHistoryEvent = {
            id: `h-${Date.now()}`,
            title: 'Payment Recorded',
            date: details.paymentDate || nowFormatted,
            description: `Payment of ₹${details.paymentAmount.toLocaleString('en-IN')} received via ${details.paymentMethod}.${details.transactionId ? ` Trans ID: ${details.transactionId}` : ''}`,
            performedBy: details.receivedBy || 'Property Owner',
            statusTag: 'success'
          };

          const receiptHistoryItem: PaymentHistoryEvent | null = details.generateReceipt
            ? {
                id: `h-rct-${Date.now()}`,
                title: 'Receipt Generated',
                date: details.paymentDate || nowFormatted,
                description: `Official payment receipt issued.`,
                performedBy: details.receivedBy || 'Property Owner',
                statusTag: 'success'
              }
            : null;

          const updatedHistory = [...(p.history || []), newHistoryItem];
          if (receiptHistoryItem) {
            updatedHistory.push(receiptHistoryItem);
          }

          const updated: RentPayment = {
            ...p,
            status: 'Paid',
            paidDate: details.paymentDate,
            amountPaid: details.paymentAmount,
            outstandingAmount: Math.max(0, p.amount - details.paymentAmount),
            paymentMethod: details.paymentMethod,
            transactionId: details.transactionId,
            collectedBy: details.receivedBy,
            notes: details.notes || p.notes,
            nextDueDate: details.nextDueDate || p.nextDueDate,
            receiptGenerated: details.generateReceipt,
            history: updatedHistory
          };

          logActivity(
            'Rent Payment Settled',
            `Invoice ${p.invoiceNumber} marked as paid (₹${details.paymentAmount.toLocaleString('en-IN')} via ${details.paymentMethod}).`,
            'payment'
          );

          return updated;
        }
        return p;
      })
    );
    showToast('Rent payment recorded successfully.');
  };

  const handleMarkUnpaid = (paymentId: string, reason: string, notes: string) => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === paymentId) {
          const nowFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);
          const reversalHistoryItem: PaymentHistoryEvent = {
            id: `h-rev-${Date.now()}`,
            title: 'Payment Marked as Unpaid',
            date: nowFormatted,
            description: `Payment reversed back to Pending. Reason: ${reason}.${notes ? ` Notes: ${notes}` : ''}`,
            performedBy: userRole,
            statusTag: 'danger'
          };

          const updated: RentPayment = {
            ...p,
            status: 'Pending',
            amountPaid: 0,
            outstandingAmount: p.amount,
            paidDate: undefined,
            history: [...(p.history || []), reversalHistoryItem]
          };

          logActivity(
            'Payment Reversal Logged',
            `Invoice ${p.invoiceNumber} moved back to Pending. Reason: ${reason}.`,
            'payment'
          );

          return updated;
        }
        return p;
      })
    );
    showToast('Payment status updated to Pending.', 'error');
  };

  const handleMarkPaymentPaid = (paymentId: string) => {
    setPayments(
      payments.map((p) => {
        if (p.id === paymentId) {
          const updated = {
            ...p,
            status: 'Paid' as const,
            paidDate: new Date().toISOString().split('T')[0]
          };
          logActivity(
            'Payment Settled',
            `Invoice ${p.invoiceNumber} (₹${p.amount.toLocaleString('en-IN')}) marked as paid.`,
            'payment'
          );
          return updated;
        }
        return p;
      })
    );
  };

  // Broker CRUD Handlers
  const handleSaveBroker = (savedBroker: Broker) => {
    const exists = brokers.some((b) => b.id === savedBroker.id);
    if (exists) {
      setBrokers(brokers.map((b) => (b.id === savedBroker.id ? savedBroker : b)));
    } else {
      setBrokers([savedBroker, ...brokers]);
    }
  };

  // Lead CRUD Handlers
  const handleSaveLead = (savedLead: Lead) => {
    const exists = leads.some((l) => l.id === savedLead.id);
    if (exists) {
      setLeads(leads.map((l) => (l.id === savedLead.id ? savedLead : l)));
    } else {
      setLeads([savedLead, ...leads]);
      logActivity('New Lead Logged', `Inquiry created for ${savedLead.name}.`, 'lead');
    }
  };

  const handleUpdateLeadStage = (leadId: string, newStage: LeadStage, fromStage?: LeadStage) => {
    let movedLeadName = '';
    let previousStage: LeadStage = 'New Inquiry';

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          movedLeadName = l.name;
          previousStage = fromStage || l.stage;

          const nowFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const newActivity: LeadActivity = {
            id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            fromStage: previousStage,
            toStage: newStage,
            performedBy: userRole || 'Owner',
            timestamp: `Today at ${nowFormatted}`,
            description: `Lead moved ${previousStage} → ${newStage} by ${userRole || 'Owner'}`
          };

          logActivity(
            'Lead Stage Moved',
            `Moved "${l.name}" from ${previousStage} to ${newStage}.`,
            'lead'
          );

          return {
            ...l,
            stage: newStage,
            activityTimeline: [newActivity, ...(l.activityTimeline || [])]
          };
        }
        return l;
      })
    );

    showToast(`Moved "${movedLeadName || 'Lead'}" from ${fromStage || previousStage} to ${newStage}`);
  };

  // Activity Logger Helper
  const logActivity = (
    title: string,
    description: string,
    type: ActivityLog['type']
  ) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      title,
      description,
      timestamp: 'Just now',
      type
    };
    setActivities([newLog, ...activities]);
  };

  // Render Enterprise Login Page if user is on login screen
  if (activeTab === 'login') {
    return (
      <LoginView
        onSignIn={() => {
          playSound('login');
          triggerHaptic('success');
          setActiveTab('dashboard');
        }}
        onAuditLog={(log) => {
          logActivity(
            `[Security Audit] ${log.action}`,
            `${log.details} [User: ${log.user} | IP: ${log.ipAddress}]`,
            'maintenance'
          );
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#111827] dark:text-[#F8FAFC] flex flex-col font-sans antialiased relative transition-colors duration-200">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[12px] shadow-lg animate-in fade-in slide-in-from-top-2">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#16A34A] dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-[#DC2626] dark:text-red-400 shrink-0" />
          )}
          <span className="text-xs font-semibold text-[#111827] dark:text-[#F8FAFC]">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-[#111827] dark:hover:text-[#F8FAFC] p-1 rounded-md"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onQuickAction={handleQuickAction}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLogout={() => setActiveTab('login')}
        onNavigate={(tab) => setActiveTab(tab)}
        userRole={userRole}
        onToggleRole={() => {
          const nextRole = userRole === 'Owner' ? 'Editor' : 'Owner';
          setUserRole(nextRole);
          showToast(`Switched user role to ${nextRole}`);
        }}
        notifications={notifications}
        setNotifications={setNotifications}
      />

      {/* Main Container Layout */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Primary View Outlet */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-hidden">
          {activeTab === 'dashboard' && (
            <DashboardView
              warehouses={warehouses}
              payments={payments}
              activities={activities}
              onNavigate={(tab) => setActiveTab(tab)}
              onQuickAction={handleQuickAction}
            />
          )}

          {activeTab === 'warehouses' && (
            <WarehousesView
              warehouses={warehouses}
              onViewWarehouse={(wh) => {
                setWarehouseToView(wh);
                setIsWarehouseDetailOpen(true);
              }}
              onEditWarehouse={(wh) => {
                setWarehouseToEdit(wh);
                setIsWarehouseModalOpen(true);
              }}
              onDeleteWarehouse={(wh) => handleRequestSoftDelete('Warehouse', wh.id, wh.name, wh)}
              onAddWarehouse={() => {
                setWarehouseToEdit(null);
                setIsWarehouseModalOpen(true);
              }}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'tenants' && (
            <TenantsView
              tenants={tenants}
              onAddTenant={() => {
                setTenantToEdit(null);
                setIsTenantModalOpen(true);
              }}
              onEditTenant={(tenant) => {
                setTenantToEdit(tenant);
                setIsTenantModalOpen(true);
              }}
              onDeleteTenant={(t) => handleRequestSoftDelete('Tenant', t.id, t.name, t)}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'payments' && (
            <RentPaymentsView
              payments={payments}
              tenants={tenants}
              warehouses={warehouses}
              settings={settings}
              onAddPayment={() => {
                setPaymentToEdit(null);
                setIsPaymentModalOpen(true);
              }}
              onRecordPayment={handleRecordPayment}
              onMarkUnpaid={handleMarkUnpaid}
              onEditPayment={(p) => {
                setPaymentToEdit(p);
                setIsPaymentModalOpen(true);
              }}
              onDeletePayment={(p) => handleRequestSoftDelete('Rent Payment', p.id, p.invoiceNumber, p)}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'brokers' && (
            <BrokersView
              brokers={brokers}
              onAddBroker={() => {
                setBrokerToEdit(null);
                setIsBrokerModalOpen(true);
              }}
              onEditBroker={(broker) => {
                setBrokerToEdit(broker);
                setIsBrokerModalOpen(true);
              }}
              onUpdateBrokerDirect={handleSaveBroker}
              onDeleteBroker={(b) => handleRequestSoftDelete('Broker', b.id, b.name, b)}
              searchQuery={searchQuery}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'crm' && (
            <CrmView
              leads={leads}
              onAddLead={() => {
                setLeadToEdit(null);
                setIsLeadModalOpen(true);
              }}
              onEditLead={(lead) => {
                setLeadToEdit(lead);
                setIsLeadModalOpen(true);
              }}
              onUpdateLeadStage={handleUpdateLeadStage}
              onDeleteLead={(l) => handleRequestSoftDelete('CRM Lead', l.id, l.name, l)}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              warehouses={warehouses}
              payments={payments}
              brokers={brokers}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={(newSettings) => setSettings(newSettings)}
              userRole={userRole}
              onRoleChange={(role) => {
                setUserRole(role);
                showToast(`User role updated to ${role}`);
              }}
              staffMembers={staffMembers}
              onSaveStaffMember={handleSaveStaffMember}
              onResetStaffPassword={handleResetStaffPassword}
              onToggleDisableStaff={handleToggleDisableStaff}
              onMoveStaffToRecycleBin={(staff) =>
                handleRequestSoftDelete('Staff Account', staff.id, `${staff.firstName} ${staff.lastName}`, staff)
              }
              editorAccounts={editorAccounts}
              onDeleteEditorAccount={(account) =>
                handleRequestSoftDelete('Editor Account', account.id, account.name, account)
              }
              documents={documents}
              onDeleteDocument={(doc) => handleRequestSoftDelete('Document', doc.id, doc.name, doc)}
              warehouses={warehouses}
              activities={activities}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'recycleBin' && (
            <RecycleBinView
              items={recycleBinItems}
              onRestore={handleRestoreItem}
              onPermanentDelete={handleRequestPermanentDelete}
              onEmptyBin={handleEmptyRecycleBin}
              searchQuery={searchQuery}
            />
          )}

          {/* App-wide Footer */}
          <footer className="mt-12 pt-6 border-t border-[#E5E7EB] dark:border-[#334155] text-center text-[11px] text-gray-500 dark:text-[#64748B] font-medium space-y-1 pb-6">
            <p className="font-bold text-gray-700 dark:text-[#CBD5E1]">
              © {new Date().getFullYear()} Acrely OS. All Rights Reserved.
            </p>
            <p className="max-w-3xl mx-auto text-[10px] leading-relaxed text-gray-400 dark:text-[#64748B]">
              Acrely OS and its applications, including Acrely WRMS, Acrely PMS and related services, are proprietary software developed by Acrely. All trademarks, product names, logos, designs and source code are protected by applicable intellectual property laws. Unauthorized use, reproduction or distribution is strictly prohibited.
            </p>
          </footer>
        </main>
      </div>

      {/* 1. Confirmation Dialog for Move to Recycle Bin */}
      <ConfirmationDialog
        isOpen={softDeleteModal.isOpen}
        onClose={() => setSoftDeleteModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmSoftDelete}
        title="Move to Recycle Bin"
        itemName={softDeleteModal.entityName}
        message={`Are you sure you want to move this item to the Recycle Bin?\n\nIt will remain in the Recycle Bin for 30 days.\nYou can restore it at any time before it is permanently deleted.`}
        confirmText="Move to Bin"
        cancelText="Cancel"
        confirmVariant="danger"
        icon={<Trash2 className="w-4 h-4" />}
      />

      {/* 2. Confirmation Dialog for Permanent Delete */}
      <ConfirmationDialog
        isOpen={permanentDeleteModal.isOpen}
        onClose={() => setPermanentDeleteModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmPermanentDelete}
        title="Delete Permanently"
        itemName={permanentDeleteModal.itemName}
        message="This action cannot be undone."
        confirmText="Delete Permanently"
        cancelText="Cancel"
        confirmVariant="danger"
        icon={<Trash2 className="w-4 h-4" />}
      />

      {/* Global Entity Modals */}
      <WarehouseModal
        isOpen={isWarehouseModalOpen}
        onClose={() => setIsWarehouseModalOpen(false)}
        onSave={handleSaveWarehouse}
        warehouseToEdit={warehouseToEdit}
      />

      <WarehouseDetailModal
        isOpen={isWarehouseDetailOpen}
        onClose={() => setIsWarehouseDetailOpen(false)}
        warehouse={warehouseToView}
        onEdit={(wh) => {
          setWarehouseToEdit(wh);
          setIsWarehouseModalOpen(true);
        }}
        documents={documents}
        onDeleteDocument={(doc) => handleRequestSoftDelete('Document', doc.id, doc.name, doc)}
      />

      <TenantModal
        isOpen={isTenantModalOpen}
        onClose={() => setIsTenantModalOpen(false)}
        onSave={handleSaveTenant}
        warehouses={warehouses}
        tenantToEdit={tenantToEdit}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSave={handleSavePayment}
        tenants={tenants}
        warehouses={warehouses}
        paymentToEdit={paymentToEdit}
      />

      <BrokerModal
        isOpen={isBrokerModalOpen}
        onClose={() => setIsBrokerModalOpen(false)}
        onSave={handleSaveBroker}
        onDelete={(b) => handleRequestSoftDelete('Broker', b.id, b.name, b)}
        brokerToEdit={brokerToEdit}
      />

      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSave={handleSaveLead}
        brokers={brokers}
        leadToEdit={leadToEdit}
      />
    </div>
  );
}
