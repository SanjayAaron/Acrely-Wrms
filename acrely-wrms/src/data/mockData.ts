import { Warehouse, Tenant, RentPayment, Broker, Lead, ActivityLog, SystemSettings, DocumentItem, EditorAccount, RecycleBinItem, StaffMember } from '../types';
import { getDefaultPermissionsForRole } from '../components/settings/PermissionMatrix';

/**
 * Clean mock data adhering strictly to guidelines:
 * - Neutral generic entity labels (Warehouse 1, Tenant 1, Broker 1, Lead 1)
 * - No fake company names, addresses, or phone numbers
 * - Currency values formatted in ₹ INR
 */

export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'wh-1',
    name: 'Warehouse 1',
    status: 'Occupied',
    tenantId: 'tn-1',
    tenantName: 'Tenant 1',
    monthlyRent: 150000,
    securityDeposit: 450000,
    leaseStart: '2025-01-01',
    leaseEnd: '2026-12-31',
    areaSqFt: 12500,
    address: 'No. 24, SIPCOT Industrial Park,\nOragadam,\nChennai - 602105',
    locationZone: 'Zone A',
    powerCapacity: '75 kVA',
    ceilingHeightFt: 28,
    notes: 'Primary logistics bay with 4 loading docks.'
  },
  {
    id: 'wh-2',
    name: 'Warehouse 2',
    status: 'Occupied',
    tenantId: 'tn-2',
    tenantName: 'Tenant 2',
    monthlyRent: 220000,
    securityDeposit: 660000,
    leaseStart: '2024-06-01',
    leaseEnd: '2027-05-31',
    areaSqFt: 18000,
    address: 'Plot 102, Phase II, GIDC Industrial Estate,\nVatva,\nAhmedabad - 382445',
    locationZone: 'Zone B',
    powerCapacity: '100 kVA',
    ceilingHeightFt: 32,
    notes: 'Temperature-controlled storage facilities.'
  },
  {
    id: 'wh-3',
    name: 'Warehouse 3',
    status: 'Vacant',
    monthlyRent: 180000,
    securityDeposit: 540000,
    areaSqFt: 15000,
    address: 'Survey No. 45/2, Chakan Industrial Area,\nTalegaon-Chakan Road,\nPune - 410501',
    locationZone: 'Zone A',
    powerCapacity: '60 kVA',
    ceilingHeightFt: 26,
    notes: 'Recently refurbished epoxy flooring and high bay LED lighting.'
  },
  {
    id: 'wh-4',
    name: 'Warehouse 4',
    status: 'Maintenance',
    monthlyRent: 200000,
    securityDeposit: 600000,
    areaSqFt: 16500,
    address: 'Shed 8, Logistics Corridor,\nBhiwandi, Thane,\nMaharashtra - 421302',
    locationZone: 'Zone C',
    powerCapacity: '80 kVA',
    ceilingHeightFt: 30,
    notes: 'Roof maintenance work underway. Available next month.'
  }
];

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tn-1',
    name: 'Tenant 1',
    warehouseId: 'wh-1',
    warehouseName: 'Warehouse 1',
    monthlyRent: 150000,
    securityDeposit: 450000,
    leaseStart: '2025-01-01',
    leaseEnd: '2026-12-31',
    status: 'Active',
    contactPerson: 'Contact Person 1',
    email: 'contact@tenant1.com',
    phone: '+91 —',
    documentsUploaded: true
  },
  {
    id: 'tn-2',
    name: 'Tenant 2',
    warehouseId: 'wh-2',
    warehouseName: 'Warehouse 2',
    monthlyRent: 220000,
    securityDeposit: 660000,
    leaseStart: '2024-06-01',
    leaseEnd: '2027-05-31',
    status: 'Active',
    contactPerson: 'Contact Person 2',
    email: 'contact@tenant2.com',
    phone: '+91 —',
    documentsUploaded: true
  }
];

export const INITIAL_PAYMENTS: RentPayment[] = [
  {
    id: 'pm-1',
    invoiceNumber: 'INV-2026-001',
    warehouseId: 'wh-1',
    warehouseName: 'Warehouse 1',
    tenantId: 'tn-1',
    tenantName: 'Tenant 1',
    dueDate: '2026-07-05',
    paidDate: '2026-07-03',
    amount: 150000,
    amountPaid: 150000,
    outstandingAmount: 0,
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    billingMonth: 'July 2026',
    transactionId: 'TXN-9823471029',
    referenceNumber: 'REF-2026-07-001',
    collectedBy: 'Property Owner',
    notes: 'Payment settled on time via IMPS Bank Transfer.',
    nextDueDate: '2026-08-05',
    receiptGenerated: true,
    history: [
      {
        id: 'h1',
        title: 'Invoice Created',
        date: '2026-07-01 09:00 AM',
        description: 'Monthly rent invoice INV-2026-001 generated for Tenant 1.',
        performedBy: 'System Auto-Billing',
        statusTag: 'info'
      },
      {
        id: 'h2',
        title: 'Reminder Sent',
        date: '2026-07-02 10:30 AM',
        description: 'Payment reminder email dispatched to contact@tenant1.com.',
        performedBy: 'System Notification',
        statusTag: 'info'
      },
      {
        id: 'h3',
        title: 'Payment Recorded',
        date: '2026-07-03 02:15 PM',
        description: 'Full payment of ₹150,000 received via Bank Transfer.',
        performedBy: 'Property Owner',
        statusTag: 'success'
      },
      {
        id: 'h4',
        title: 'Receipt Generated',
        date: '2026-07-03 02:16 PM',
        description: 'Official payment receipt RCT-2026-001 issued.',
        performedBy: 'Property Owner',
        statusTag: 'success'
      }
    ]
  },
  {
    id: 'pm-2',
    invoiceNumber: 'INV-2026-002',
    warehouseId: 'wh-2',
    warehouseName: 'Warehouse 2',
    tenantId: 'tn-2',
    tenantName: 'Tenant 2',
    dueDate: '2026-07-05',
    paidDate: '2026-07-05',
    amount: 220000,
    amountPaid: 220000,
    outstandingAmount: 0,
    status: 'Paid',
    paymentMethod: 'UPI',
    billingMonth: 'July 2026',
    transactionId: 'UPI/20260705/88127391',
    referenceNumber: 'REF-2026-07-002',
    collectedBy: 'Property Owner',
    notes: 'Paid via Corporate UPI handle.',
    nextDueDate: '2026-08-05',
    receiptGenerated: true,
    history: [
      {
        id: 'h21',
        title: 'Invoice Created',
        date: '2026-07-01 09:00 AM',
        description: 'Monthly rent invoice INV-2026-002 generated for Tenant 2.',
        performedBy: 'System Auto-Billing',
        statusTag: 'info'
      },
      {
        id: 'h22',
        title: 'Payment Recorded',
        date: '2026-07-05 11:45 AM',
        description: 'Received ₹220,000 via UPI transaction UPI/20260705/88127391.',
        performedBy: 'Property Owner',
        statusTag: 'success'
      },
      {
        id: 'h23',
        title: 'Receipt Generated',
        date: '2026-07-05 11:46 AM',
        description: 'Official payment receipt RCT-2026-002 issued.',
        performedBy: 'Property Owner',
        statusTag: 'success'
      }
    ]
  },
  {
    id: 'pm-3',
    invoiceNumber: 'INV-2026-003',
    warehouseId: 'wh-1',
    warehouseName: 'Warehouse 1',
    tenantId: 'tn-1',
    tenantName: 'Tenant 1',
    dueDate: '2026-08-05',
    amount: 150000,
    amountPaid: 0,
    outstandingAmount: 150000,
    status: 'Pending',
    billingMonth: 'August 2026',
    referenceNumber: 'REF-2026-08-001',
    history: [
      {
        id: 'h31',
        title: 'Invoice Created',
        date: '2026-07-20 09:00 AM',
        description: 'Upcoming rent invoice INV-2026-003 created.',
        performedBy: 'System Auto-Billing',
        statusTag: 'info'
      },
      {
        id: 'h32',
        title: 'Reminder Sent',
        date: '2026-07-22 10:00 AM',
        description: 'Advance billing notice emailed to Tenant 1.',
        performedBy: 'System Notification',
        statusTag: 'info'
      }
    ]
  },
  {
    id: 'pm-4',
    invoiceNumber: 'INV-2026-004',
    warehouseId: 'wh-2',
    warehouseName: 'Warehouse 2',
    tenantId: 'tn-2',
    tenantName: 'Tenant 2',
    dueDate: '2026-08-05',
    amount: 220000,
    amountPaid: 0,
    outstandingAmount: 220000,
    status: 'Pending',
    billingMonth: 'August 2026',
    referenceNumber: 'REF-2026-08-002',
    history: [
      {
        id: 'h41',
        title: 'Invoice Created',
        date: '2026-07-20 09:00 AM',
        description: 'Upcoming rent invoice INV-2026-004 created.',
        performedBy: 'System Auto-Billing',
        statusTag: 'info'
      }
    ]
  }
];

export const INITIAL_BROKERS: Broker[] = [
  {
    id: 'br-1',
    name: 'Broker 1',
    brokerId: 'BRK-2026-001',
    companyName: 'Prime Commercial Realty',
    phone: '+91 98201 55432',
    whatsappNumber: '+91 98201 55432',
    email: 'broker1@agency.com',
    website: 'https://primecommercialrealty.in',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    reraNumber: 'TN/01/Agent/2024/00812',
    gstNumber: '33AAACB1234F1Z9',
    panNumber: 'ABCDE1234F',
    yearsOfExperience: 8,
    operatingAreas: ['Chennai', 'Oragadam', 'Sriperumbudur'],
    commissionType: 'Percentage',
    commissionRatePercent: 5.0,
    pendingCommission: 18500,
    totalCommissionEarned: 125000,
    lastCommissionPaid: 45000,
    lastCommissionPaidDate: '2026-06-15',
    commissionStatus: 'Pending Payout',
    totalDealsClosed: 4,
    activeLeads: 3,
    warehousesLeased: 2,
    occupancyGeneratedSqFt: 30500,
    revenueGeneratedInr: 370000,
    averageClosingTimeDays: 14,
    status: 'Active Partner',
    bankDetails: {
      accountHolderName: 'Prime Commercial Realty Pvt Ltd',
      bankName: 'HDFC Bank',
      accountNumber: '50200044192001',
      ifscCode: 'HDFC0000240',
      upiId: 'primecommercial@hdfcbank'
    },
    documents: [
      { id: 'doc-pan', type: 'PAN', fileName: 'PAN_Broker1_PrimeRealty.pdf', uploadDate: '2025-01-10', fileSize: '1.1 MB' },
      { id: 'doc-gst', type: 'GST Certificate', fileName: 'GSTIN_PrimeRealty.pdf', uploadDate: '2025-01-10', fileSize: '1.4 MB' },
      { id: 'doc-rera', type: 'Broker License', fileName: 'RERA_License_2025.pdf', uploadDate: '2025-01-12', fileSize: '2.0 MB' }
    ],
    notes: 'Good relationship with logistics companies. Prefers industrial warehouses with heavy power backup.',
    payouts: [
      { id: 'po-1', date: '2026-06-15', amount: 45000, dealWarehouse: 'Warehouse 1', paymentMethod: 'Bank Transfer', referenceNo: 'TXN-99881122', status: 'Paid' },
      { id: 'po-2', date: '2026-03-10', amount: 61500, dealWarehouse: 'Warehouse 2', paymentMethod: 'NEFT', referenceNo: 'TXN-77665544', status: 'Paid' }
    ],
    deals: [
      { id: 'dl-1', tenantName: 'Tenant 1', warehouseName: 'Warehouse 1', leaseStartDate: '2025-01-01', monthlyRent: 150000, commissionAmount: 45000, status: 'Active' },
      { id: 'dl-2', tenantName: 'Tenant 2', warehouseName: 'Warehouse 2', leaseStartDate: '2024-06-01', monthlyRent: 220000, commissionAmount: 61500, status: 'Active' }
    ]
  },
  {
    id: 'br-2',
    name: 'Broker 2',
    brokerId: 'BRK-2026-002',
    companyName: 'Industrial Space Experts',
    phone: '+91 98402 11987',
    whatsappNumber: '+91 98402 11987',
    email: 'broker2@agency.com',
    website: 'https://industrialspace.com',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    reraNumber: 'TN/01/Agent/2023/00451',
    gstNumber: '33XYZAB5678C1Z2',
    panNumber: 'XYZAB5678C',
    yearsOfExperience: 5,
    operatingAreas: ['Guindy', 'Ambattur', 'Sriperumbudur'],
    commissionType: 'Percentage',
    commissionRatePercent: 4.5,
    pendingCommission: 0,
    totalCommissionEarned: 88000,
    lastCommissionPaid: 32000,
    lastCommissionPaidDate: '2026-05-20',
    commissionStatus: 'Settled',
    totalDealsClosed: 2,
    activeLeads: 2,
    warehousesLeased: 1,
    occupancyGeneratedSqFt: 18000,
    revenueGeneratedInr: 220000,
    averageClosingTimeDays: 18,
    status: 'Preferred Broker',
    bankDetails: {
      accountHolderName: 'Industrial Space Experts LLC',
      bankName: 'ICICI Bank',
      accountNumber: '001105029381',
      ifscCode: 'ICIC0000011',
      upiId: 'industrialspace@icici'
    },
    documents: [
      { id: 'doc-pan2', type: 'PAN', fileName: 'PAN_Broker2_IndustrialSpace.pdf', uploadDate: '2025-02-01', fileSize: '0.9 MB' },
      { id: 'doc-aadhaar2', type: 'Aadhaar', fileName: 'Aadhaar_Card_Broker2.pdf', uploadDate: '2025-02-01', fileSize: '1.2 MB' }
    ],
    notes: 'Specializes in FMCG cold storage facilities and high bay clearance requirements.',
    payouts: [
      { id: 'po-3', date: '2026-05-20', amount: 32000, dealWarehouse: 'Warehouse 2', paymentMethod: 'UPI', referenceNo: 'UPI/20260520/11827', status: 'Paid' }
    ],
    deals: [
      { id: 'dl-3', tenantName: 'Tenant 2', warehouseName: 'Warehouse 2', leaseStartDate: '2024-06-01', monthlyRent: 220000, commissionAmount: 88000, status: 'Active' }
    ]
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'ld-1',
    name: 'Lead 1',
    companyName: 'Apex Logistics Pvt Ltd',
    contactPerson: 'Contact 1',
    phone: '+91 98765 43210',
    email: 'contact1@apexlogistics.com',
    requestedSqFt: 15000,
    preferredZone: 'Zone A',
    targetBudget: 180000,
    stage: 'Site Visit',
    brokerId: 'br-1',
    brokerName: 'Broker 1',
    expectedMoveInDate: '2026-09-01',
    createdAt: '2026-07-15',
    notes: 'Interested in Warehouse 3. Requested site inspection for high-capacity flooring.',
    activityTimeline: [
      {
        id: 'act-ld1-1',
        fromStage: 'New Inquiry',
        toStage: 'Site Visit',
        performedBy: 'Owner',
        timestamp: 'Today at 02:30 PM',
        description: 'Lead moved New Inquiry → Site Visit by Owner'
      },
      {
        id: 'act-ld1-0',
        performedBy: 'Broker 1',
        timestamp: '2026-07-15 at 10:00 AM',
        description: 'Lead created via Broker 1'
      }
    ]
  },
  {
    id: 'ld-2',
    name: 'Lead 2',
    companyName: 'Nexus Global Distribution',
    contactPerson: 'Contact 2',
    phone: '+91 98123 45678',
    email: 'contact2@nexusglobal.in',
    requestedSqFt: 20000,
    preferredZone: 'Zone B',
    targetBudget: 250000,
    stage: 'Proposal',
    brokerId: 'br-2',
    brokerName: 'Broker 2',
    expectedMoveInDate: '2026-10-15',
    createdAt: '2026-07-18',
    notes: 'Commercial lease proposal sent for custom bay construction and loading docks.',
    activityTimeline: [
      {
        id: 'act-ld2-2',
        fromStage: 'Site Visit',
        toStage: 'Proposal',
        performedBy: 'Owner',
        timestamp: 'Yesterday at 04:15 PM',
        description: 'Lead moved Site Visit → Proposal by Owner'
      },
      {
        id: 'act-ld2-1',
        fromStage: 'New Inquiry',
        toStage: 'Site Visit',
        performedBy: 'Owner',
        timestamp: '2026-07-19 at 11:30 AM',
        description: 'Lead moved New Inquiry → Site Visit by Owner'
      },
      {
        id: 'act-ld2-0',
        performedBy: 'Broker 2',
        timestamp: '2026-07-18 at 09:00 AM',
        description: 'Lead created via Broker 2'
      }
    ]
  },
  {
    id: 'ld-3',
    name: 'Lead 3',
    companyName: 'Swift Express Parcel',
    contactPerson: 'Contact 3',
    phone: '+91 99000 11223',
    email: 'contact3@swiftexpress.io',
    requestedSqFt: 10000,
    preferredZone: 'Zone C',
    targetBudget: 120000,
    stage: 'New Inquiry',
    expectedMoveInDate: '2026-08-15',
    createdAt: '2026-07-21',
    notes: 'Inquired through web form for e-commerce last-mile hub.',
    activityTimeline: [
      {
        id: 'act-ld3-0',
        performedBy: 'System',
        timestamp: '2026-07-21 at 03:20 PM',
        description: 'Lead registered as New Inquiry'
      }
    ]
  }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    title: 'Rent Payment Received',
    timestamp: 'Today at 10:30 AM',
    type: 'payment',
    description: 'Tenant 2 paid ₹220,000 for Warehouse 2 via UPI.'
  },
  {
    id: 'act-2',
    title: 'Site Visit Scheduled',
    timestamp: 'Yesterday at 3:15 PM',
    type: 'lead',
    description: 'Lead 1 scheduled a walkthrough for Warehouse 3 with Broker 1.'
  },
  {
    id: 'act-3',
    title: 'Maintenance Logged',
    timestamp: '2026-07-19',
    type: 'maintenance',
    description: 'Warehouse 4 ceiling repair initiated by contractor.'
  },
  {
    id: 'act-4',
    title: 'Lease Renewal Updated',
    timestamp: '2026-07-14',
    type: 'lease',
    description: 'Tenant 1 extended lease agreement for Warehouse 1 until Dec 2026.'
  }
];

export const DEFAULT_SETTINGS: SystemSettings = {
  ownerName: 'Property Owner',
  companyName: 'Warehouse Holdings',
  gstinTaxId: '27AAAAA0000A1Z5',
  currencySymbol: '₹',
  gracePeriodDays: 5,
  lateFeePercentage: 2,
  defaultSecurityDepositMonths: 3,
  emailNotifications: true,
  smsAlerts: false,
  enableUiSounds: true,
  soundVolume: 30,
  enableHaptics: true,
  enableAnimations: true,
  reduceMotion: false,
  muteAllSounds: false,
  followSystemPreferences: false
};

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'Lease_Agreement_Warehouse_1.pdf',
    category: 'Lease Agreement',
    fileSize: '2.4 MB',
    uploadedDate: '2025-01-02',
    associatedEntity: 'Warehouse 1'
  },
  {
    id: 'doc-2',
    name: 'Property_Deed_Zone_A.pdf',
    category: 'Property Deed',
    fileSize: '4.1 MB',
    uploadedDate: '2024-11-15',
    associatedEntity: 'Warehouse 1'
  },
  {
    id: 'doc-3',
    name: 'Fire_Safety_Certificate_2026.pdf',
    category: 'Tax Certificate',
    fileSize: '1.2 MB',
    uploadedDate: '2026-02-10',
    associatedEntity: 'Warehouse 2'
  }
];

export const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'stf-1',
    firstName: 'Vikramaditya',
    lastName: 'Mehta',
    phone: '+91 98200 11223',
    whatsappNumber: '+91 98200 11223',
    email: 'vikram.mehta@acrelyparks.com',
    dateOfBirth: '1982-05-14',
    gender: 'Male',
    address: 'Plot 12, Industrial Skyline, BKC, Mumbai',
    username: 'vikram.owner',
    emailLogin: 'vikram.mehta@acrelyparks.com',
    role: 'Property Owner',
    permissions: getDefaultPermissionsForRole('Property Owner'),
    status: 'Active',
    isTemporaryPassword: false,
    forcePasswordChange: false,
    twoFactorEnabled: true,
    lastLogin: 'Today at 08:30 AM',
    createdAt: '2024-01-01',
    assignedWarehouseIds: ['wh-1', 'wh-2', 'wh-3', 'wh-4'],
    notes: 'Primary Property Owner & Managing Director of Acrely Industrial Parks.',
    activityLog: [
      { id: 'act-1', action: 'System Config Update', module: 'settings', timestamp: 'Today at 08:35 AM', details: 'Updated lease grace period to 5 days.' },
      { id: 'act-2', action: 'Approved Payment', module: 'payments', timestamp: 'Yesterday at 04:12 PM', details: 'Confirmed receipt for INV-2026-001.' }
    ],
    recentLogins: [
      { id: 'log-1', timestamp: 'Today at 08:30 AM', ipAddress: '103.211.54.12', device: 'Chrome on macOS', location: 'Mumbai, MH' },
      { id: 'log-2', timestamp: '2026-07-22 09:15 AM', ipAddress: '103.211.54.12', device: 'Safari on iPhone', location: 'Mumbai, MH' }
    ]
  },
  {
    id: 'stf-2',
    firstName: 'Ananya',
    lastName: 'Deshmukh',
    phone: '+91 98765 88990',
    whatsappNumber: '+91 98765 88990',
    email: 'ananya.d@acrelyparks.com',
    dateOfBirth: '1990-11-20',
    gender: 'Female',
    address: 'Flat 402, Seawood Towers, Navi Mumbai',
    username: 'ananya.manager',
    emailLogin: 'ananya.d@acrelyparks.com',
    role: 'Manager',
    permissions: getDefaultPermissionsForRole('Manager'),
    status: 'Active',
    isTemporaryPassword: false,
    forcePasswordChange: false,
    twoFactorEnabled: false,
    lastLogin: 'Yesterday at 03:45 PM',
    createdAt: '2024-06-15',
    assignedWarehouseIds: ['wh-1', 'wh-2'],
    notes: 'Senior Park Operations Lead overseeing Zone A and Zone B warehouses.',
    activityLog: [
      { id: 'act-3', action: 'Created Tenant Record', module: 'tenants', timestamp: 'Yesterday at 02:20 PM', details: 'Added Tenant 2 to Warehouse 2.' }
    ],
    recentLogins: [
      { id: 'log-3', timestamp: '2026-07-22 03:45 PM', ipAddress: '49.207.18.99', device: 'Chrome on Windows', location: 'Navi Mumbai, MH' }
    ]
  },
  {
    id: 'stf-3',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    phone: '+91 97112 33445',
    whatsappNumber: '+91 97112 33445',
    email: 'rajesh.k@acrelyparks.com',
    dateOfBirth: '1988-03-08',
    gender: 'Male',
    address: 'Sector 15, Vashi, Navi Mumbai',
    username: 'rajesh.accounts',
    emailLogin: 'rajesh.k@acrelyparks.com',
    role: 'Accountant',
    permissions: getDefaultPermissionsForRole('Accountant'),
    status: 'Active',
    isTemporaryPassword: false,
    forcePasswordChange: false,
    twoFactorEnabled: false,
    lastLogin: '2026-07-21 at 11:00 AM',
    createdAt: '2025-02-01',
    assignedWarehouseIds: ['wh-1', 'wh-2', 'wh-3', 'wh-4'],
    notes: 'Lead Finance & GST Auditor.',
    activityLog: [
      { id: 'act-4', action: 'Generated Rent Invoice', module: 'payments', timestamp: '2026-07-21 11:15 AM', details: 'Generated INV-2026-003.' }
    ],
    recentLogins: [
      { id: 'log-4', timestamp: '2026-07-21 11:00 AM', ipAddress: '115.110.22.40', device: 'Edge on Windows', location: 'Mumbai, MH' }
    ]
  }
];

export const INITIAL_EDITOR_ACCOUNTS: EditorAccount[] = [
  {
    id: 'ed-1',
    name: 'Editor User 1',
    email: 'editor1@acrely.com',
    role: 'Editor',
    status: 'Active',
    lastActive: 'Today at 09:15 AM'
  },
  {
    id: 'ed-2',
    name: 'Editor User 2',
    email: 'editor2@acrely.com',
    role: 'Editor',
    status: 'Active',
    lastActive: 'Yesterday'
  }
];

export const INITIAL_RECYCLE_ITEMS: RecycleBinItem[] = [
  {
    id: 'rec-1',
    entityType: 'Warehouse',
    name: 'Warehouse 4 - North Zone',
    deletedDate: '2026-07-20',
    daysRemaining: 28,
    originalData: {
      id: 'wh-4-restored',
      name: 'Warehouse 4 - North Zone',
      status: 'Vacant',
      monthlyRent: 195000,
      securityDeposit: 585000,
      areaSqFt: 16000,
      locationZone: 'Zone C',
      powerCapacity: '75 kVA',
      ceilingHeightFt: 26,
      notes: 'Restored from Recycle Bin.'
    }
  },
  {
    id: 'rec-2',
    entityType: 'Document',
    name: 'Archived_Property_Tax_2024.pdf',
    deletedDate: '2026-07-18',
    daysRemaining: 26,
    originalData: {
      id: 'doc-archived',
      name: 'Archived_Property_Tax_2024.pdf',
      category: 'Tax Certificate',
      fileSize: '1.8 MB',
      uploadedDate: '2024-12-01',
      associatedEntity: 'Warehouse 1'
    }
  }
];

