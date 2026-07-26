/**
 * Types and Interfaces for Warehouse Rental Management System (WRMS)
 * Designed for property owners renting commercial warehouses to clients.
 */

export type NavigationTab = 
  | 'login'
  | 'dashboard'
  | 'warehouses'
  | 'tenants'
  | 'payments'
  | 'brokers'
  | 'crm'
  | 'reports'
  | 'settings'
  | 'recycleBin';

export interface DocumentItem {
  id: string;
  name: string;
  category: string;
  fileSize: string;
  uploadedDate: string;
  associatedEntity?: string;
}

export type WarehouseStatus = 'Occupied' | 'Vacant' | 'Maintenance';

export interface Warehouse {
  id: string;
  name: string; // e.g. "Warehouse 1"
  status: WarehouseStatus;
  tenantId?: string;
  tenantName?: string; // e.g. "Tenant 1"
  monthlyRent: number; // in ₹
  securityDeposit: number;
  leaseStart?: string;
  leaseEnd?: string;
  areaSqFt: number;
  address?: string; // Multiline address supporting Street Address, Area, City, State, PIN Code
  locationZone?: string; // Optional legacy zone field
  powerCapacity: string; // e.g. "50 kVA"
  ceilingHeightFt: number;
  notes?: string;
}

export type TenantStatus = 'Active' | 'Pending' | 'Notice Period' | 'Inactive';

export interface Tenant {
  id: string;
  name: string; // e.g. "Tenant 1"
  warehouseId: string;
  warehouseName: string; // e.g. "Warehouse 1"
  monthlyRent: number;
  securityDeposit: number;
  leaseStart: string;
  leaseEnd: string;
  status: TenantStatus;
  contactPerson: string;
  email: string;
  phone: string; // Generic or empty placeholder
  documentsUploaded: boolean;
}

export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue';

export type PaymentMethodType = 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'NEFT' | 'RTGS' | 'Direct Deposit';

export interface PaymentHistoryEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  performedBy?: string;
  statusTag?: 'info' | 'success' | 'warning' | 'danger';
}

export interface RentPayment {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-001"
  warehouseId: string;
  warehouseName: string;
  tenantId: string;
  tenantName: string;
  dueDate: string;
  paidDate?: string;
  amount: number;
  amountPaid?: number;
  outstandingAmount?: number;
  status: PaymentStatus;
  paymentMethod?: PaymentMethodType;
  billingMonth?: string;
  transactionId?: string;
  referenceNumber?: string;
  collectedBy?: string;
  notes?: string;
  nextDueDate?: string;
  receiptGenerated?: boolean;
  history?: PaymentHistoryEvent[];
}

export type BrokerStatus = 'Active Partner' | 'Active' | 'Inactive' | 'Blacklisted' | 'Suspended' | 'Preferred Broker';

export interface BrokerDocument {
  id: string;
  type: 'PAN' | 'Aadhaar' | 'Agreement' | 'GST Certificate' | 'Broker License';
  fileName: string;
  uploadDate: string;
  fileSize?: string;
}

export interface BrokerCommissionPayout {
  id: string;
  date: string;
  amount: number;
  dealWarehouse: string;
  paymentMethod: string;
  referenceNo: string;
  status: 'Paid' | 'Pending';
}

export interface BrokerDeal {
  id: string;
  tenantName: string;
  warehouseName: string;
  leaseStartDate: string;
  monthlyRent: number;
  commissionAmount: number;
  status: 'Active' | 'Pending' | 'Closed';
}

export interface Broker {
  id: string;
  name: string; // e.g. "Broker 1"
  brokerId?: string; // e.g. "BRK-2026-001"
  companyName?: string;
  phone: string;
  whatsappNumber?: string;
  email: string;
  website?: string;
  photoUrl?: string;

  // Business Info
  reraNumber?: string;
  gstNumber?: string;
  panNumber?: string;
  yearsOfExperience?: number;
  operatingAreas?: string[];

  // Commission Details
  commissionType?: 'Percentage' | 'Fixed Amount';
  commissionRatePercent: number;
  pendingCommission: number; // in ₹
  totalCommissionEarned?: number;
  lastCommissionPaid?: number;
  lastCommissionPaidDate?: string;
  commissionStatus?: 'Settled' | 'Pending Payout' | 'Partial';

  // Performance
  totalDealsClosed: number;
  activeLeads?: number;
  warehousesLeased?: number;
  occupancyGeneratedSqFt?: number;
  revenueGeneratedInr?: number;
  averageClosingTimeDays?: number;

  // Status
  status: BrokerStatus;

  // Bank Details
  bankDetails?: {
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
  };

  // Documents
  documents?: BrokerDocument[];

  // Notes
  notes?: string;

  // History & Deals
  payouts?: BrokerCommissionPayout[];
  deals?: BrokerDeal[];
}

export type LeadStage = 'New Inquiry' | 'Site Visit' | 'Proposal' | 'Negotiation' | 'Closed';

export interface LeadActivity {
  id: string;
  fromStage?: LeadStage;
  toStage?: LeadStage;
  performedBy: string;
  timestamp: string;
  description: string;
}

export interface Lead {
  id: string;
  name: string; // e.g. "Lead 1" or "Acrely Corp"
  companyName?: string;
  contactPerson: string;
  phone?: string;
  email?: string;
  requestedSqFt: number;
  preferredZone: string;
  targetBudget: number; // in ₹
  stage: LeadStage;
  brokerId?: string;
  brokerName?: string; // e.g. "Broker 1"
  expectedMoveInDate?: string;
  createdAt: string;
  notes?: string;
  activityTimeline?: LeadActivity[];
}

export interface ActivityLog {
  id: string;
  title: string;
  timestamp: string;
  type: 'payment' | 'lease' | 'lead' | 'maintenance' | 'broker';
  description: string;
}

export interface SystemSettings {
  ownerName: string;
  companyName: string;
  gstinTaxId: string;
  panNumber?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  companyLogoUrl?: string;

  // Warehouse Defaults
  currencySymbol: string;
  measurementUnit?: 'Sq Ft' | 'Sq M';
  defaultLeaseDurationMonths?: number;
  gracePeriodDays: number;
  lateFeePercentage: number;
  defaultSecurityDepositMonths: number;
  defaultRentDueDay?: number;

  // Invoice Settings
  invoicePrefix?: string;
  receiptPrefix?: string;
  companySignatureUrl?: string;
  companySealUrl?: string;
  gstPercentage?: number;

  // Notification Alerts
  emailNotifications: boolean;
  smsAlerts: boolean;
  rentDueReminders?: boolean;
  leaseExpiryAlerts?: boolean;
  browserNotifications?: boolean;

  // Security Settings
  autoLogoutMinutes?: number;
  sessionTimeoutMinutes?: number;

  // Appearance
  appearanceMode?: 'light' | 'dark';
  accentColor?: string;
}

export type StaffModule =
  | 'dashboard'
  | 'warehouses'
  | 'tenants'
  | 'payments'
  | 'brokers'
  | 'crm'
  | 'reports'
  | 'recycleBin'
  | 'documents'
  | 'settings';

export interface ModulePermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export type StaffPermissions = Record<StaffModule, ModulePermission>;

export type StaffRole = 'Property Owner' | 'Manager' | 'Staff' | 'Accountant' | 'Broker' | 'Custom';
export type StaffStatus = 'Active' | 'Inactive' | 'Suspended';

export type UserRole = 'Owner' | 'Editor' | StaffRole;

export interface StaffLoginEvent {
  id: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  location?: string;
}

export interface StaffActivityItem {
  id: string;
  action: string;
  module: string;
  timestamp: string;
  details: string;
}

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  whatsappNumber?: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  photoUrl?: string;

  // Credentials
  username: string;
  emailLogin: string;
  password?: string;

  // Role & Permissions
  role: StaffRole;
  permissions: StaffPermissions;

  // Account Settings
  status: StaffStatus;
  isTemporaryPassword?: boolean;
  forcePasswordChange?: boolean;
  twoFactorEnabled?: boolean;

  // Log & Profile Meta
  lastLogin?: string;
  createdAt?: string;
  assignedWarehouseIds?: string[];
  documents?: DocumentItem[];
  notes?: string;
  activityLog?: StaffActivityItem[];
  recentLogins?: StaffLoginEvent[];
}

export interface EditorAccount {
  id: string;
  name: string;
  email: string;
  role: 'Editor' | 'Viewer' | StaffRole;
  status: 'Active' | 'Inactive' | StaffStatus;
  lastActive: string;
}

export type RecycleBinEntityType =
  | 'Warehouse'
  | 'Tenant'
  | 'Rent Payment'
  | 'Broker'
  | 'CRM Lead'
  | 'Document'
  | 'Editor Account'
  | 'Staff Account';

export interface RecycleBinItem {
  id: string;
  entityType: RecycleBinEntityType;
  name: string;
  deletedDate: string;
  daysRemaining: number;
  originalData: any;
}
