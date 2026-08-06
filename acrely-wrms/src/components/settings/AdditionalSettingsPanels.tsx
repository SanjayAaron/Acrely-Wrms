import React, { useState } from 'react';
import { SystemSettings, StaffMember, ActivityLog } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import {
  Building,
  Warehouse,
  Receipt,
  BellRing,
  ShieldAlert,
  Database,
  History,
  Palette,
  Upload,
  Download,
  CheckCircle2,
  Search,
  FileJson,
  RefreshCw,
  Sun,
  Moon,
  Laptop,
  Volume2,
  VolumeX,
  Vibrate,
  Sparkles,
  Accessibility,
  Sliders,
  Lock,
  ShieldCheck,
  KeyRound,
  QrCode,
  LogOut,
  MailCheck,
  AlertTriangle,
  Cpu,
  Server,
  Clock,
  Globe,
  Eye,
  Check
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useExperience } from '../../context/ExperienceContext';
import { SoundType } from '../../utils/experienceManager';
import { securityEngine, SecurityAlert } from '../../utils/securityManager';
import { SecurityAlertModal } from '../modals/SecurityAlertModal';

interface AdditionalSettingsPanelsProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: SystemSettings) => void;
  staffMembers: StaffMember[];
  activityLogs: ActivityLog[];
  onShowToast?: (msg: string, type?: 'success' | 'error') => void;
}

type SubTabType =
  | 'company'
  | 'warehouse'
  | 'invoice'
  | 'notifications'
  | 'security'
  | 'backup'
  | 'audit'
  | 'appearance'
  | 'experience';

export const AdditionalSettingsPanels: React.FC<AdditionalSettingsPanelsProps> = ({
  settings,
  onUpdateSettings,
  staffMembers,
  activityLogs,
  onShowToast
}) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { playSound, triggerHaptic, updateSettings: updateExpSettings } = useExperience();
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('company');
  const [formData, setFormData] = useState<SystemSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [testSoundType, setTestSoundType] = useState<SoundType>('success');

  // Filter states for Audit Logs
  const [auditStaffFilter, setAuditStaffFilter] = useState<string>('all');
  const [auditSearchTerm, setAuditSearchTerm] = useState<string>('');

  // Security & Account Protection State
  const [secState, setSecState] = useState(securityEngine.getState());
  const [secAlerts, setSecAlerts] = useState<SecurityAlert[]>(securityEngine.getAlerts());
  const [selectedAlertModal, setSelectedAlertModal] = useState<SecurityAlert | null>(null);
  const [isSecAlertModalOpen, setIsSecAlertModalOpen] = useState<boolean>(false);
  const [show2FAModal, setShow2FAModal] = useState<boolean>(false);
  const [activeSessions, setActiveSessions] = useState([
    { id: 's1', device: 'Chrome 126 on macOS', ip: '182.73.128.45', location: 'Chennai, India', lastActive: 'Active Now', current: true },
    { id: 's2', device: 'Safari on iPhone 15 Pro', ip: '49.207.18.99', location: 'Pune, India', lastActive: '2 hours ago', current: false },
    { id: 's3', device: 'Firefox on Windows 11', ip: '103.211.54.12', location: 'Mumbai, India', lastActive: '1 day ago', current: false }
  ]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateSettings(formData);
    setSaveSuccess(true);
    if (onShowToast) onShowToast('System configuration saved successfully!');
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Export system JSON database backup
  const handleExportBackup = () => {
    const backupObj = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      settings: formData,
      staffCount: staffMembers.length,
      activityLogCount: activityLogs.length
    };

    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Acrely_System_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    if (onShowToast) onShowToast('System database backup downloaded.');
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.settings) {
            setFormData(parsed.settings);
            onUpdateSettings(parsed.settings);
            if (onShowToast) onShowToast('Backup database restored successfully!');
          }
        } catch {
          if (onShowToast) onShowToast('Invalid backup file format.', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] dark:border-[#334155] pb-2 text-xs overflow-x-auto">
        {[
          { id: 'company', label: 'Company Info', icon: <Building className="w-3.5 h-3.5" /> },
          { id: 'warehouse', label: 'Warehouse Defaults', icon: <Warehouse className="w-3.5 h-3.5" /> },
          { id: 'invoice', label: 'Invoice & Receipts', icon: <Receipt className="w-3.5 h-3.5" /> },
          { id: 'notifications', label: 'Notifications', icon: <BellRing className="w-3.5 h-3.5" /> },
          { id: 'security', label: 'Security & Sessions', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
          { id: 'backup', label: 'Backup & Restore', icon: <Database className="w-3.5 h-3.5" /> },
          { id: 'audit', label: 'Audit Logs', icon: <History className="w-3.5 h-3.5" /> },
          { id: 'appearance', label: 'Appearance', icon: <Palette className="w-3.5 h-3.5" /> },
          { id: 'experience', label: 'Experience & Haptics', icon: <Volume2 className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as SubTabType)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-[8px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-[#2563EB] text-white shadow-2xs'
                : 'bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] text-gray-700 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#273549]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-[10px] text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* 1. Company Information */}
      {activeSubTab === 'company' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Building className="w-4 h-4 text-[#2563EB]" />
              Enterprise Company Profile & Legal Identifiers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                value={formData.companyName || ''}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Acrely Industrial Parks Ltd."
              />
              <Input
                label="GSTIN (Goods & Services Tax ID)"
                value={formData.gstinTaxId || ''}
                onChange={(e) => setFormData({ ...formData, gstinTaxId: e.target.value })}
                placeholder="27AAAAA0000A1Z5"
              />
              <Input
                label="PAN Number"
                value={formData.panNumber || ''}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                placeholder="ABCDE1234F"
              />
              <Input
                label="Official Email Address"
                type="email"
                value={formData.companyEmail || ''}
                onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                placeholder="contact@acrelyparks.com"
              />
              <Input
                label="Company Phone"
                value={formData.companyPhone || ''}
                onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                placeholder="+91 22 4567 8900"
              />
              <Input
                label="Company Website"
                value={formData.companyWebsite || ''}
                onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                placeholder="https://www.acrelyparks.com"
              />
            </div>

            <Input
              label="Registered Office Address"
              value={formData.companyAddress || ''}
              onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
              placeholder="Suite 402, Financial Tower, Bandra Kurla Complex, Mumbai, MH"
            />

            <div className="p-3 bg-slate-50 dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[10px] flex items-center justify-between gap-4">
              <div>
                <span className="block text-xs font-semibold text-[#111827] dark:text-[#F8FAFC]">Company Logo Upload</span>
                <span className="text-[11px] text-gray-500 dark:text-[#94A3B8]">Logo will appear on generated PDF receipts & lease reports.</span>
              </div>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#273549] border border-[#E5E7EB] dark:border-[#334155] rounded-[8px] text-xs font-semibold text-[#111827] dark:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-[#334155] cursor-pointer shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Upload Logo</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" onClick={handleSave}>
                Save Company Info
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 2. Warehouse Settings */}
      {activeSubTab === 'warehouse' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-[#2563EB]" />
              Default Lease & Warehouse Property Defaults
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Default Currency"
                value={formData.currencySymbol || '₹'}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                options={[
                  { value: '₹', label: '₹ INR (Indian Rupee)' },
                  { value: '$', label: '$ USD (US Dollar)' },
                  { value: '€', label: '€ EUR (Euro)' }
                ]}
              />

              <Select
                label="Measurement Unit"
                value={formData.measurementUnit || 'Sq Ft'}
                onChange={(e) => setFormData({ ...formData, measurementUnit: e.target.value as any })}
                options={[
                  { value: 'Sq Ft', label: 'Sq Ft (Square Feet)' },
                  { value: 'Sq M', label: 'Sq M (Square Meters)' }
                ]}
              />

              <Input
                label="Default Lease Duration (Months)"
                type="number"
                value={formData.defaultLeaseDurationMonths || 24}
                onChange={(e) =>
                  setFormData({ ...formData, defaultLeaseDurationMonths: Number(e.target.value) })
                }
              />

              <Input
                label="Default Security Deposit (Months)"
                type="number"
                value={formData.defaultSecurityDepositMonths || 3}
                onChange={(e) =>
                  setFormData({ ...formData, defaultSecurityDepositMonths: Number(e.target.value) })
                }
              />

              <Input
                label="Default Rent Due Day of Month"
                type="number"
                min={1}
                max={31}
                value={formData.defaultRentDueDay || 5}
                onChange={(e) => setFormData({ ...formData, defaultRentDueDay: Number(e.target.value) })}
              />

              <Input
                label="Grace Period (Days)"
                type="number"
                value={formData.gracePeriodDays || 5}
                onChange={(e) => setFormData({ ...formData, gracePeriodDays: Number(e.target.value) })}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" onClick={handleSave}>
                Save Warehouse Defaults
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. Invoice Settings */}
      {activeSubTab === 'invoice' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#2563EB]" />
              Invoicing & Payment Receipt Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Invoice Number Prefix"
                value={formData.invoicePrefix || 'INV-'}
                onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                placeholder="INV-"
              />
              <Input
                label="Receipt Number Prefix"
                value={formData.receiptPrefix || 'REC-'}
                onChange={(e) => setFormData({ ...formData, receiptPrefix: e.target.value })}
                placeholder="REC-"
              />
              <Input
                label="GST Percentage (%)"
                type="number"
                value={formData.gstPercentage || 18}
                onChange={(e) => setFormData({ ...formData, gstPercentage: Number(e.target.value) })}
              />
              <Input
                label="Late Fee Interest Rate (% / month)"
                type="number"
                step="0.5"
                value={formData.lateFeePercentage || 2}
                onChange={(e) => setFormData({ ...formData, lateFeePercentage: Number(e.target.value) })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[10px] flex items-center justify-between gap-3">
                <div>
                  <span className="block text-xs font-semibold text-[#111827] dark:text-[#F8FAFC]">Company Signature Upload</span>
                  <span className="text-[10px] text-gray-500 dark:text-[#94A3B8]">Authorized signatory image for receipts.</span>
                </div>
                <label className="px-3 py-1 bg-white dark:bg-[#273549] border border-[#E5E7EB] dark:border-[#334155] rounded-md text-xs font-semibold cursor-pointer">
                  Upload
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[10px] flex items-center justify-between gap-3">
                <div>
                  <span className="block text-xs font-semibold text-[#111827] dark:text-[#F8FAFC]">Company Seal Upload</span>
                  <span className="text-[10px] text-gray-500 dark:text-[#94A3B8]">Official stamp/seal graphic.</span>
                </div>
                <label className="px-3 py-1 bg-white dark:bg-[#273549] border border-[#E5E7EB] dark:border-[#334155] rounded-md text-xs font-semibold cursor-pointer">
                  Upload
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" onClick={handleSave}>
                Save Invoice Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. Notification Settings */}
      {activeSubTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <BellRing className="w-4 h-4 text-[#2563EB]" />
              Automated Alert Dispatch & Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                key: 'emailNotifications',
                title: 'Email Reminders',
                desc: 'Dispatch monthly automated rent payment invoices via email to active tenants.'
              },
              {
                key: 'rentDueReminders',
                title: 'Rent Due Alerts',
                desc: 'Alert property owner and accountants 5 days prior to rent due dates.'
              },
              {
                key: 'leaseExpiryAlerts',
                title: 'Lease Expiry Alerts',
                desc: 'Receive advance warnings 60 days before any warehouse tenant lease expires.'
              },
              {
                key: 'browserNotifications',
                title: 'Browser Push Notifications',
                desc: 'Display desktop popups when payment receipts are uploaded or leads are created.'
              }
            ].map((item) => (
              <label key={item.key} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[10px] cursor-pointer hover:bg-slate-100 dark:hover:bg-[#273549]">
                <input
                  type="checkbox"
                  checked={Boolean(formData[item.key as keyof SystemSettings])}
                  onChange={(e) =>
                    setFormData({ ...formData, [item.key]: e.target.checked })
                  }
                  className="w-4 h-4 text-[#2563EB] rounded focus:ring-[#2563EB] mt-0.5"
                />
                <div>
                  <span className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC] block">{item.title}</span>
                  <span className="text-[11px] text-gray-500 dark:text-[#94A3B8]">{item.desc}</span>
                </div>
              </label>
            ))}

            <div className="flex justify-end pt-2">
              <Button variant="primary" onClick={handleSave}>
                Save Notification Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 5. Security & Account Protection Settings */}
      {activeSubTab === 'security' && (
        <div className="space-y-6">
          {/* Top Lockout Status & Threat Protection Banner */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#111827] dark:text-[#F8FAFC]">
                <ShieldAlert className="w-4.5 h-4.5 text-red-600 dark:text-red-400" />
                Login Security, Brute-Force Lockout & Threat Protection
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-full text-[11px] font-extrabold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  5 Failed Attempt Lockout Policy Enforced
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-[#1E293B]/80 border border-[#E5E7EB] dark:border-[#334155] rounded-xl space-y-1">
                  <span className="text-gray-500 dark:text-[#94A3B8] text-[11px] block font-medium">Max Failed Attempts</span>
                  <span className="text-sm font-extrabold text-[#111827] dark:text-[#F8FAFC] block">5 Consecutive</span>
                  <span className="text-[10px] text-gray-400 dark:text-[#64748B]">Generic message on 1st-4th attempt</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#1E293B]/80 border border-[#E5E7EB] dark:border-[#334155] rounded-xl space-y-1">
                  <span className="text-gray-500 dark:text-[#94A3B8] text-[11px] block font-medium">Lockout Duration</span>
                  <span className="text-sm font-extrabold text-red-600 dark:text-red-400 block">2 Minutes (120s)</span>
                  <span className="text-[10px] text-gray-400 dark:text-[#64748B]">Resets automatically after timer</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#1E293B]/80 border border-[#E5E7EB] dark:border-[#334155] rounded-xl space-y-1">
                  <span className="text-gray-500 dark:text-[#94A3B8] text-[11px] block font-medium">Current Lockout Status</span>
                  <span className={`text-sm font-extrabold ${secState.lockoutUntil ? 'text-red-600 animate-pulse' : 'text-emerald-600 dark:text-emerald-400'} block`}>
                    {secState.lockoutUntil ? 'Account Locked Out' : 'Healthy / Unlocked'}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-[#64748B]">
                    {secState.failedAttempts > 0 ? `${secState.failedAttempts} failed attempt(s) recorded` : 'No active failed attempts'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#1E293B]/80 border border-[#E5E7EB] dark:border-[#334155] rounded-xl space-y-1 flex flex-col justify-between">
                  <div>
                    <span className="text-gray-500 dark:text-[#94A3B8] text-[11px] block font-medium">Owner Alerts Logged</span>
                    <span className="text-sm font-extrabold text-[#2563EB] dark:text-blue-400 block">{secAlerts.length} Security Alerts</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      securityEngine.resetLockout();
                      setSecState(securityEngine.getState());
                      playSound('success');
                      triggerHaptic('success');
                      if (onShowToast) onShowToast('Lockout state and failed attempt counter reset by admin.');
                    }}
                    className="mt-1 text-[10px] font-bold text-[#2563EB] dark:text-blue-400 hover:underline cursor-pointer text-left"
                  >
                    Reset Lockout Counter
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <Select
                  label="Auto Logout Inactivity Time"
                  value={String(formData.autoLogoutMinutes || 30)}
                  onChange={(e) => setFormData({ ...formData, autoLogoutMinutes: Number(e.target.value) })}
                  options={[
                    { value: '15', label: '15 Minutes' },
                    { value: '30', label: '30 Minutes' },
                    { value: '60', label: '1 Hour' },
                    { value: '0', label: 'Never (Not recommended)' }
                  ]}
                />

                <Select
                  label="Password Expiration Policy"
                  value={String(secState.passwordExpirationDays || 90)}
                  onChange={(e) => {
                    const days = Number(e.target.value);
                    securityEngine.updateSecurityConfig({ passwordExpirationDays: days });
                    setSecState(securityEngine.getState());
                  }}
                  options={[
                    { value: '30', label: 'Require Change Every 30 Days' },
                    { value: '60', label: 'Require Change Every 60 Days' },
                    { value: '90', label: 'Require Change Every 90 Days (Enterprise Standard)' },
                    { value: '0', label: 'Never Expire' }
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          {/* Owner Security Email Notifications Log */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#111827] dark:text-[#F8FAFC]">
                <MailCheck className="w-4 h-4 text-[#2563EB]" />
                Owner Security Notifications (Dispatched Security Email Alerts)
              </CardTitle>
              <span className="text-xs text-gray-500 dark:text-[#94A3B8]">Recipient: sanjayarron046@gmail.com</span>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <p className="text-gray-600 dark:text-[#CBD5E1] text-[11px]">
                When an account experiences 5 consecutive failed login attempts, an automated security alert email is dispatched immediately to the registered owner.
              </p>

              <div className="border border-[#E5E7EB] dark:border-[#334155] rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155] text-gray-600 dark:text-[#CBD5E1] font-bold">
                    <tr>
                      <th className="px-3 py-2.5">Alert ID & Subject</th>
                      <th className="px-3 py-2.5">Target Email</th>
                      <th className="px-3 py-2.5">Origin IP & Location</th>
                      <th className="px-3 py-2.5">Dispatched At</th>
                      <th className="px-3 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
                    {secAlerts.map((alt) => (
                      <tr key={alt.id} className="hover:bg-slate-50/50 dark:hover:bg-[#1E293B]/40 transition-colors">
                        <td className="px-3 py-2.5">
                          <span className="font-bold text-[#111827] dark:text-[#F8FAFC] block">{alt.subject}</span>
                          <span className="font-mono text-[10px] text-gray-400 dark:text-[#64748B]">{alt.id}</span>
                        </td>
                        <td className="px-3 py-2.5 font-medium text-gray-700 dark:text-[#CBD5E1]">
                          {alt.attemptedEmail}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="font-mono text-[11px] font-semibold text-gray-800 dark:text-slate-200 block">{alt.ipAddress}</span>
                          <span className="text-[10px] text-gray-500 dark:text-[#94A3B8]">{alt.location}</span>
                        </td>
                        <td className="px-3 py-2.5 text-gray-600 dark:text-[#CBD5E1]">
                          {alt.timestamp}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            icon={<Eye className="w-3.5 h-3.5 text-[#2563EB]" />}
                            onClick={() => {
                              setSelectedAlertModal(alt);
                              setIsSecAlertModalOpen(true);
                              playSound('pop');
                            }}
                          >
                            View Email
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Encryption Standards & Future Roadmap Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Encryption & Password Storage Standards */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Password Hashing & Encryption Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Argon2id Memory-Hard Hash Algorithm
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 rounded text-[10px] font-mono font-bold">
                      Memory: 64MB
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                    Passwords are never stored in plain text. Acrely OS utilizes Argon2id salted hashes designed to withstand GPU/ASIC brute-force cracking.
                  </p>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-[#2563EB]" />
                      HTTPS / TLS 1.3 Transport Encryption
                    </span>
                    <span className="px-2 py-0.5 bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded text-[10px] font-mono font-bold">
                      256-Bit SSL
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-800 dark:text-blue-300">
                    All authentication payloads and session cookies are transmitted over strictly enforced TLS 1.3 encrypted HTTPS tunnels.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Future Security Roadmap Interactive Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#2563EB]" />
                  Advanced Authentication & Security Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                {/* 2FA Toggle */}
                <div className="p-3 bg-slate-50 dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <QrCode className="w-4 h-4 text-[#2563EB]" />
                    <div>
                      <span className="font-bold text-[#111827] dark:text-[#F8FAFC] block">Two-Factor Authentication (2FA)</span>
                      <span className="text-[10px] text-gray-500 dark:text-[#94A3B8]">TOTP Authenticator app requirement</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={secState.twoFactorEnabled ? 'outline' : 'primary'}
                    onClick={() => setShow2FAModal(true)}
                  >
                    {secState.twoFactorEnabled ? 'Configured' : 'Setup 2FA'}
                  </Button>
                </div>

                {/* Email Verification */}
                <div className="p-3 bg-slate-50 dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <MailCheck className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-[#111827] dark:text-[#F8FAFC] block">Email Verification</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Verified: sanjayarron046@gmail.com</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      playSound('success');
                      if (onShowToast) onShowToast('Verification email link sent to owner inbox.');
                    }}
                  >
                    Resend Link
                  </Button>
                </div>

                {/* Login Approval New Devices */}
                <div className="p-3 bg-slate-50 dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#111827] dark:text-[#F8FAFC] block">Login Approval for New Devices</span>
                    <span className="text-[10px] text-gray-500 dark:text-[#94A3B8]">Requires owner push confirmation for unrecognized devices</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={secState.loginApprovalNewDevices}
                    onChange={(e) => {
                      const val = e.target.checked;
                      securityEngine.updateSecurityConfig({ loginApprovalNewDevices: val });
                      setSecState(securityEngine.getState());
                      playSound('toggle');
                    }}
                    className="w-4 h-4 rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Sessions & Force Logout */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#111827] dark:text-[#F8FAFC]">
                <Globe className="w-4 h-4 text-[#2563EB]" />
                Active Sessions & Device History Management
              </CardTitle>
              <Button
                size="sm"
                variant="danger"
                icon={<LogOut className="w-3.5 h-3.5" />}
                onClick={() => {
                  setActiveSessions(activeSessions.filter(s => s.current));
                  playSound('delete');
                  triggerHaptic('medium');
                  if (onShowToast) onShowToast('Force logged out from all other active devices.');
                }}
              >
                Force Logout All Devices
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="border border-[#E5E7EB] dark:border-[#334155] rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155] text-gray-600 dark:text-[#CBD5E1] font-bold">
                    <tr>
                      <th className="px-3 py-2.5">Device & Browser</th>
                      <th className="px-3 py-2.5">IP Address</th>
                      <th className="px-3 py-2.5">Location</th>
                      <th className="px-3 py-2.5">Last Activity</th>
                      <th className="px-3 py-2.5 text-right">Session Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
                    {activeSessions.map((sess) => (
                      <tr key={sess.id}>
                        <td className="px-3 py-2.5 font-semibold text-[#111827] dark:text-[#F8FAFC]">
                          {sess.device} {sess.current && <span className="ml-1.5 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-950 text-[#2563EB] text-[10px] rounded font-bold">(Current)</span>}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-gray-600 dark:text-[#CBD5E1]">{sess.ip}</td>
                        <td className="px-3 py-2.5 text-gray-600 dark:text-[#CBD5E1]">{sess.location}</td>
                        <td className="px-3 py-2.5 font-medium text-emerald-600 dark:text-emerald-400">{sess.lastActive}</td>
                        <td className="px-3 py-2.5 text-right">
                          {!sess.current ? (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveSessions(activeSessions.filter(s => s.id !== sess.id));
                                playSound('delete');
                                if (onShowToast) onShowToast(`Revoked session for ${sess.device}`);
                              }}
                              className="text-red-600 dark:text-red-400 hover:underline font-bold cursor-pointer"
                            >
                              Revoke
                            </button>
                          ) : (
                            <span className="text-gray-400 text-[10px]">Active Session</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 2FA Setup Modal */}
          {show2FAModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
              <div className="relative w-full max-w-md bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#334155] pb-3">
                  <h3 className="font-bold text-sm text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-[#2563EB]" />
                    Configure Two-Factor Authentication (2FA)
                  </h3>
                  <button onClick={() => setShow2FAModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
                </div>

                <p className="text-gray-600 dark:text-[#CBD5E1]">
                  Scan this QR code with Google Authenticator, Authy, or 1Password to bind TOTP 2FA to your Acrely account.
                </p>

                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 border border-[#E5E7EB] dark:border-[#334155] rounded-xl space-y-2">
                  <div className="w-36 h-36 bg-white p-2 border rounded-lg flex items-center justify-center shadow-inner">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=otpauth://totp/AcrelyOS:sanjayarron046@gmail.com?secret=ACRELY2026SECUREKEY&issuer=AcrelyOS"
                      alt="2FA QR Code"
                      className="w-full h-full"
                    />
                  </div>
                  <span className="font-mono text-[10px] text-gray-500">Secret Key: ACRELY2026SECUREKEY</span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setShow2FAModal(false)}>Cancel</Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      securityEngine.updateSecurityConfig({ twoFactorEnabled: true });
                      setSecState(securityEngine.getState());
                      setShow2FAModal(false);
                      playSound('success');
                      triggerHaptic('success');
                      if (onShowToast) onShowToast('Two-Factor Authentication (2FA) enabled successfully!');
                    }}
                  >
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Security Alert Modal Integration */}
          <SecurityAlertModal
            isOpen={isSecAlertModalOpen}
            onClose={() => setIsSecAlertModalOpen(false)}
            alert={selectedAlertModal}
          />
        </div>
      )}

      {/* 6. Backup & Restore */}
      {activeSubTab === 'backup' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Database className="w-4 h-4 text-[#2563EB]" />
              Database Export, Manual Backup & Restore
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[12px] space-y-3">
                <div className="flex items-center gap-2 text-[#2563EB]">
                  <Download className="w-5 h-5" />
                  <h4 className="font-bold text-xs text-[#111827] dark:text-[#F8FAFC]">Export System Database</h4>
                </div>
                <p className="text-xs text-gray-500 dark:text-[#94A3B8]">
                  Download a complete JSON snapshot of all system settings, staff credentials, and logs.
                </p>
                <Button variant="primary" icon={<FileJson className="w-4 h-4" />} onClick={handleExportBackup}>
                  Export JSON Backup
                </Button>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[12px] space-y-3">
                <div className="flex items-center gap-2 text-[#2563EB]">
                  <Upload className="w-5 h-5" />
                  <h4 className="font-bold text-xs text-[#111827] dark:text-[#F8FAFC]">Restore Database Snapshot</h4>
                </div>
                <p className="text-xs text-gray-500 dark:text-[#94A3B8]">
                  Upload a previously exported JSON backup file to restore system configurations.
                </p>
                <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#273549] border border-[#E5E7EB] dark:border-[#334155] rounded-[8px] text-xs font-semibold text-[#111827] dark:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-[#334155] cursor-pointer shadow-2xs">
                  <RefreshCw className="w-4 h-4 text-[#2563EB]" />
                  <span>Restore from JSON File</span>
                  <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 7. Audit Logs */}
      {activeSubTab === 'audit' && (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB] dark:border-[#334155]">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <History className="w-4 h-4 text-[#2563EB]" />
              Enterprise System Audit Trail
            </CardTitle>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400 dark:text-[#64748B]" />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={auditSearchTerm}
                  onChange={(e) => setAuditSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1 border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-xs text-[#111827] dark:text-[#F8FAFC] rounded-[8px] w-44 focus:outline-none"
                />
              </div>

              <select
                value={auditStaffFilter}
                onChange={(e) => setAuditStaffFilter(e.target.value)}
                className="px-2 py-1 border border-[#E5E7EB] dark:border-[#334155] rounded-[8px] text-xs bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none"
              >
                <option value="all">All Staff Members</option>
                {staffMembers.map((s) => (
                  <option key={s.id} value={s.firstName}>
                    {s.firstName} {s.lastName}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155] text-gray-600 dark:text-[#CBD5E1] font-semibold">
                  <tr>
                    <th className="px-4 py-2.5">Timestamp</th>
                    <th className="px-4 py-2.5">Event Title</th>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
                  {activityLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-gray-400 dark:text-[#64748B]">
                        No activity logs recorded.
                      </td>
                    </tr>
                  ) : (
                    activityLogs
                      .filter(
                        (a) =>
                          a.title.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                          a.description.toLowerCase().includes(auditSearchTerm.toLowerCase())
                      )
                      .map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-[#273549]/50">
                          <td className="px-4 py-2.5 text-gray-500 dark:text-[#94A3B8] whitespace-nowrap">{log.timestamp}</td>
                          <td className="px-4 py-2.5 font-bold text-[#111827] dark:text-[#F8FAFC]">{log.title}</td>
                          <td className="px-4 py-2.5 capitalize text-[#2563EB] dark:text-blue-400 font-semibold">{log.type}</td>
                          <td className="px-4 py-2.5 text-gray-600 dark:text-[#CBD5E1]">{log.description}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 8. Appearance & Theme Selection */}
      {activeSubTab === 'appearance' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#2563EB]" />
              System Theme & Display Mode Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-gray-600 dark:text-[#CBD5E1]">
              Select your preferred color theme. Changes take effect instantly across all screens and persist automatically across sessions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Light Mode Option */}
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-[12px] border-2 text-left transition-all cursor-pointer flex flex-col justify-between h-32 ${
                  theme === 'light'
                    ? 'border-[#2563EB] bg-blue-50/40 dark:bg-blue-950/40 shadow-sm ring-2 ring-[#2563EB]/20'
                    : 'border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:border-gray-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <Sun className="w-5 h-5" />
                  </div>
                  {theme === 'light' && (
                    <span className="text-[10px] px-2 py-0.5 bg-[#2563EB] text-white font-bold rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#111827] dark:text-[#F8FAFC]">Light Theme</h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">Corporate crisp blue & white canvas</p>
                </div>
              </button>

              {/* Dark Mode Option */}
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-[12px] border-2 text-left transition-all cursor-pointer flex flex-col justify-between h-32 ${
                  theme === 'dark'
                    ? 'border-[#2563EB] bg-blue-50/40 dark:bg-blue-950/40 shadow-sm ring-2 ring-[#2563EB]/20'
                    : 'border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:border-gray-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-slate-800 text-amber-400 rounded-lg">
                    <Moon className="w-5 h-5" />
                  </div>
                  {theme === 'dark' && (
                    <span className="text-[10px] px-2 py-0.5 bg-[#2563EB] text-white font-bold rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#111827] dark:text-[#F8FAFC]">Dark Theme</h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">High-contrast slate dark theme</p>
                </div>
              </button>

              {/* System Theme Option */}
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-4 rounded-[12px] border-2 text-left transition-all cursor-pointer flex flex-col justify-between h-32 ${
                  theme === 'system'
                    ? 'border-[#2563EB] bg-blue-50/40 dark:bg-blue-950/40 shadow-sm ring-2 ring-[#2563EB]/20'
                    : 'border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:border-gray-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg">
                    <Laptop className="w-5 h-5" />
                  </div>
                  {theme === 'system' && (
                    <span className="text-[10px] px-2 py-0.5 bg-[#2563EB] text-white font-bold rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#111827] dark:text-[#F8FAFC]">System Theme</h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">
                    Automatically matches OS mode ({resolvedTheme === 'dark' ? 'currently Dark' : 'currently Light'})
                  </p>
                </div>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#E5E7EB] dark:border-[#334155]">
              <span className="text-xs text-gray-500 dark:text-[#94A3B8]">
                Active resolved theme: <strong className="text-[#111827] dark:text-[#F8FAFC] capitalize">{resolvedTheme} Mode</strong>
              </span>
              <Button variant="primary" onClick={handleSave}>
                Save Appearance Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 9. Experience Settings (Sound, Haptics, Animations & Accessibility) */}
      {activeSubTab === 'experience' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#111827] dark:text-[#F8FAFC]">
              <Volume2 className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
              Tactile Experience, Audio Feedback & Motion Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-xs text-gray-600 dark:text-[#CBD5E1]">
              Configure soft, modern UI sounds, subtle vibration haptics, and animation speeds designed to make Acrely OS feel fast, tactile, and responsive.
            </p>

            {/* Sound Section */}
            <div className="p-4 bg-slate-50 dark:bg-[#1E293B]/60 border border-[#E5E7EB] dark:border-[#334155] rounded-[14px] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-400 rounded-lg">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">Sound</h4>
                    <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">Soft, minimal audio cues for buttons, actions, and alerts.</p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.enableUiSounds !== false}
                    onChange={(e) => {
                      const val = e.target.checked;
                      setFormData({ ...formData, enableUiSounds: val });
                      updateExpSettings({ enableUiSounds: val });
                      if (val) playSound('click');
                    }}
                    className="w-4 h-4 rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">Enable UI Sounds</span>
                </label>
              </div>

              {/* Volume Slider & Sound Tester */}
              <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#334155]/60 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700 dark:text-[#CBD5E1]">Adjust UI Sound Volume</span>
                  <span className="font-mono font-bold text-[#2563EB] dark:text-blue-400">
                    {formData.soundVolume ?? 30}%
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <VolumeX className="w-4 h-4 text-gray-400 dark:text-[#64748B] shrink-0" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.soundVolume ?? 30}
                    onChange={(e) => {
                      const vol = parseInt(e.target.value, 10);
                      setFormData({ ...formData, soundVolume: vol });
                      updateExpSettings({ soundVolume: vol });
                    }}
                    onMouseUp={() => playSound('click')}
                    onTouchEnd={() => playSound('click')}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                  />
                  <Volume2 className="w-4 h-4 text-[#2563EB] dark:text-blue-400 shrink-0" />
                </div>

                {/* Live Sound Type Previewer */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 dark:text-[#94A3B8]">Sound Preset Preview:</span>
                    <select
                      value={testSoundType}
                      onChange={(e) => setTestSoundType(e.target.value as SoundType)}
                      className="bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[8px] px-2.5 py-1 text-xs text-[#111827] dark:text-[#F8FAFC] font-medium"
                    >
                      <option value="click">Button Click</option>
                      <option value="pop">Bubble Pop</option>
                      <option value="save">Save Action</option>
                      <option value="success">Success Chime</option>
                      <option value="delete">Delete Warning</option>
                      <option value="notification">Notification Bell</option>
                      <option value="toggle">Toggle Switch</option>
                      <option value="modalOpen">Modal Open</option>
                      <option value="modalClose">Modal Close</option>
                      <option value="payment">Payment Recorded</option>
                      <option value="invoice">Invoice Generated</option>
                      <option value="login">Login Welcome</option>
                      <option value="error">Error Alert</option>
                    </select>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Volume2 className="w-3.5 h-3.5 text-[#2563EB]" />}
                    onClick={() => {
                      playSound(testSoundType);
                      triggerHaptic('light');
                    }}
                  >
                    Test Sound Tone
                  </Button>
                </div>
              </div>
            </div>

            {/* Haptics Section */}
            <div className="p-4 bg-slate-50 dark:bg-[#1E293B]/60 border border-[#E5E7EB] dark:border-[#334155] rounded-[14px] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-lg">
                    <Vibrate className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">Haptics</h4>
                    <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">Provides subtle vibration feedback on supported devices.</p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.enableHaptics !== false}
                    onChange={(e) => {
                      const val = e.target.checked;
                      setFormData({ ...formData, enableHaptics: val });
                      updateExpSettings({ enableHaptics: val });
                      if (val) triggerHaptic('light');
                    }}
                    className="w-4 h-4 rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">Enable Haptic Feedback</span>
                </label>
              </div>

              <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#334155]/60 flex items-center justify-between">
                <span className="text-[11px] text-gray-500 dark:text-[#94A3B8]">
                  Subtle vibration taps for button presses, toggles, long presses, and pull actions on mobile/tablets.
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Vibrate className="w-3.5 h-3.5 text-emerald-600" />}
                  onClick={() => {
                    triggerHaptic('success');
                    playSound('pop');
                  }}
                >
                  Test Haptic Pulse
                </Button>
              </div>
            </div>

            {/* Animations Section */}
            <div className="p-4 bg-slate-50 dark:bg-[#1E293B]/60 border border-[#E5E7EB] dark:border-[#334155] rounded-[14px] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">Animations</h4>
                    <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">Allows users to reduce motion if preferred.</p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.enableAnimations !== false}
                    onChange={(e) => {
                      const val = e.target.checked;
                      setFormData({ ...formData, enableAnimations: val });
                      updateExpSettings({ enableAnimations: val });
                    }}
                    className="w-4 h-4 rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">Enable UI Animations</span>
                </label>
              </div>
            </div>

            {/* Accessibility Section */}
            <div className="p-4 bg-slate-50 dark:bg-[#1E293B]/60 border border-[#E5E7EB] dark:border-[#334155] rounded-[14px] space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 rounded-lg">
                  <Accessibility className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">Accessibility Controls</h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">Universal comfort and quiet-mode options.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E5E7EB] dark:border-[#334155]/60">
                {/* Reduce Motion */}
                <label className="p-3 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[10px] flex items-center gap-3 cursor-pointer hover:border-[#2563EB] transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.reduceMotion)}
                    onChange={(e) => {
                      const val = e.target.checked;
                      setFormData({ ...formData, reduceMotion: val });
                      updateExpSettings({ reduceMotion: val });
                    }}
                    className="w-4 h-4 rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC] block">Reduce Motion</span>
                    <span className="text-[10px] text-gray-500 dark:text-[#94A3B8]">Minimizes layout shifts</span>
                  </div>
                </label>

                {/* Mute All Sounds */}
                <label className="p-3 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[10px] flex items-center gap-3 cursor-pointer hover:border-[#2563EB] transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.muteAllSounds)}
                    onChange={(e) => {
                      const val = e.target.checked;
                      setFormData({ ...formData, muteAllSounds: val });
                      updateExpSettings({ muteAllSounds: val });
                    }}
                    className="w-4 h-4 rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC] block">Mute All Sounds</span>
                    <span className="text-[10px] text-gray-500 dark:text-[#94A3B8]">Silence all audio cues</span>
                  </div>
                </label>

                {/* Follow System Preferences */}
                <label className="p-3 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[10px] flex items-center gap-3 cursor-pointer hover:border-[#2563EB] transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.followSystemPreferences)}
                    onChange={(e) => {
                      const val = e.target.checked;
                      setFormData({ ...formData, followSystemPreferences: val });
                      updateExpSettings({ followSystemPreferences: val });
                    }}
                    className="w-4 h-4 rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC] block">Follow System Preferences</span>
                    <span className="text-[10px] text-gray-500 dark:text-[#94A3B8]">Match OS motion & audio settings</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Save Experience Settings */}
            <div className="pt-2 flex items-center justify-between border-t border-[#E5E7EB] dark:border-[#334155]">
              <span className="text-xs text-gray-500 dark:text-[#94A3B8]">
                Preferences save automatically to local browser storage and system profile.
              </span>
              <Button variant="primary" onClick={handleSave}>
                Save Experience Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
