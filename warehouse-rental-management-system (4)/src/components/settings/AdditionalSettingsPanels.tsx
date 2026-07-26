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
  Filter,
  Search,
  FileJson,
  RefreshCw,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';

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
  | 'appearance';

/**
 * Additional Enterprise Settings Component
 * Houses the 8 enterprise configuration sub-sections:
 * 1. Company Information
 * 2. Warehouse Settings
 * 3. Invoice Settings
 * 4. Notification Settings
 * 5. Security Settings
 * 6. Backup & Restore
 * 7. Audit Logs
 * 8. Appearance
 */
export const AdditionalSettingsPanels: React.FC<AdditionalSettingsPanelsProps> = ({
  settings,
  onUpdateSettings,
  staffMembers,
  activityLogs,
  onShowToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('company');
  const [formData, setFormData] = useState<SystemSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Filter states for Audit Logs
  const [auditStaffFilter, setAuditStaffFilter] = useState<string>('all');
  const [auditSearchTerm, setAuditSearchTerm] = useState<string>('');

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
        } catch (err) {
          if (onShowToast) onShowToast('Invalid backup file format.', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2 text-xs overflow-x-auto">
        {[
          { id: 'company', label: 'Company Info', icon: <Building className="w-3.5 h-3.5" /> },
          { id: 'warehouse', label: 'Warehouse Defaults', icon: <Warehouse className="w-3.5 h-3.5" /> },
          { id: 'invoice', label: 'Invoice & Receipts', icon: <Receipt className="w-3.5 h-3.5" /> },
          { id: 'notifications', label: 'Notifications', icon: <BellRing className="w-3.5 h-3.5" /> },
          { id: 'security', label: 'Security & Sessions', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
          { id: 'backup', label: 'Backup & Restore', icon: <Database className="w-3.5 h-3.5" /> },
          { id: 'audit', label: 'Audit Logs', icon: <History className="w-3.5 h-3.5" /> },
          { id: 'appearance', label: 'Appearance', icon: <Palette className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as SubTabType)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-[8px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-[#2563EB] text-white shadow-2xs'
                : 'bg-white border border-[#E5E7EB] text-gray-700 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[10px] text-xs text-emerald-700 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
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

            <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-[10px] flex items-center justify-between gap-4">
              <div>
                <span className="block text-xs font-semibold text-[#111827]">Company Logo Upload</span>
                <span className="text-[11px] text-gray-500">Logo will appear on generated PDF receipts & lease reports.</span>
              </div>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-[8px] text-xs font-semibold text-[#111827] hover:bg-slate-100 cursor-pointer shadow-2xs">
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
              <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-[10px] flex items-center justify-between gap-3">
                <div>
                  <span className="block text-xs font-semibold text-[#111827]">Company Signature Upload</span>
                  <span className="text-[10px] text-gray-500">Authorized signatory image for receipts.</span>
                </div>
                <label className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-md text-xs font-semibold cursor-pointer">
                  Upload
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>

              <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-[10px] flex items-center justify-between gap-3">
                <div>
                  <span className="block text-xs font-semibold text-[#111827]">Company Seal Upload</span>
                  <span className="text-[10px] text-gray-500">Official stamp/seal graphic.</span>
                </div>
                <label className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-md text-xs font-semibold cursor-pointer">
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
              <label key={item.key} className="flex items-start gap-3 p-3 bg-slate-50 border border-[#E5E7EB] rounded-[10px] cursor-pointer hover:bg-slate-100/80">
                <input
                  type="checkbox"
                  checked={Boolean(formData[item.key as keyof SystemSettings])}
                  onChange={(e) =>
                    setFormData({ ...formData, [item.key]: e.target.checked })
                  }
                  className="w-4 h-4 text-[#2563EB] rounded focus:ring-[#2563EB] mt-0.5"
                />
                <div>
                  <span className="text-xs font-bold text-[#111827] block">{item.title}</span>
                  <span className="text-[11px] text-gray-500">{item.desc}</span>
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

      {/* 5. Security Settings */}
      {activeSubTab === 'security' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#2563EB]" />
              Security Policy, Auto-Logout & Session History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                label="Session Max Lifetime"
                value={String(formData.sessionTimeoutMinutes || 480)}
                onChange={(e) => setFormData({ ...formData, sessionTimeoutMinutes: Number(e.target.value) })}
                options={[
                  { value: '240', label: '4 Hours' },
                  { value: '480', label: '8 Hours (Standard Shift)' },
                  { value: '1440', label: '24 Hours' }
                ]}
              />
            </div>

            <div>
              <h4 className="font-bold text-[#111827] mb-2">Active Sessions & Device History</h4>
              <div className="border border-[#E5E7EB] rounded-[10px] overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-[#E5E7EB] text-gray-600 font-bold">
                    <tr>
                      <th className="px-3 py-2">Device / Browser</th>
                      <th className="px-3 py-2">IP Address</th>
                      <th className="px-3 py-2">Location</th>
                      <th className="px-3 py-2">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    <tr>
                      <td className="px-3 py-2 font-medium text-[#111827]">Chrome 126 on macOS (Current)</td>
                      <td className="px-3 py-2 text-gray-600">103.211.54.12</td>
                      <td className="px-3 py-2 text-gray-600">Mumbai, India</td>
                      <td className="px-3 py-2 text-emerald-600 font-bold">Active Now</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-600">Safari on iPhone 15 Pro</td>
                      <td className="px-3 py-2 text-gray-600">49.207.18.99</td>
                      <td className="px-3 py-2 text-gray-600">Pune, India</td>
                      <td className="px-3 py-2 text-gray-500">2 hours ago</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" onClick={handleSave}>
                Save Security Settings
              </Button>
            </div>
          </CardContent>
        </Card>
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
              <div className="p-4 bg-slate-50 border border-[#E5E7EB] rounded-[12px] space-y-3">
                <div className="flex items-center gap-2 text-[#2563EB]">
                  <Download className="w-5 h-5" />
                  <h4 className="font-bold text-xs text-[#111827]">Export System Database</h4>
                </div>
                <p className="text-xs text-gray-500">
                  Download a complete JSON snapshot of all system settings, staff credentials, and logs.
                </p>
                <Button variant="primary" icon={<FileJson className="w-4 h-4" />} onClick={handleExportBackup}>
                  Export JSON Backup
                </Button>
              </div>

              <div className="p-4 bg-slate-50 border border-[#E5E7EB] rounded-[12px] space-y-3">
                <div className="flex items-center gap-2 text-[#2563EB]">
                  <Upload className="w-5 h-5" />
                  <h4 className="font-bold text-xs text-[#111827]">Restore Database Snapshot</h4>
                </div>
                <p className="text-xs text-gray-500">
                  Upload a previously exported JSON backup file to restore system configurations.
                </p>
                <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#E5E7EB] rounded-[8px] text-xs font-semibold text-[#111827] hover:bg-slate-100 cursor-pointer shadow-2xs">
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
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <History className="w-4 h-4 text-[#2563EB]" />
              Enterprise System Audit Trail
            </CardTitle>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={auditSearchTerm}
                  onChange={(e) => setAuditSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1 border border-[#E5E7EB] rounded-[8px] text-xs w-44 focus:outline-none"
                />
              </div>

              <select
                value={auditStaffFilter}
                onChange={(e) => setAuditStaffFilter(e.target.value)}
                className="px-2 py-1 border border-[#E5E7EB] rounded-[8px] text-xs bg-white focus:outline-none"
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
                <thead className="bg-slate-50 border-b border-[#E5E7EB] text-gray-600 font-semibold">
                  <tr>
                    <th className="px-4 py-2.5">Timestamp</th>
                    <th className="px-4 py-2.5">Event Title</th>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {activityLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-gray-400">
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
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                          <td className="px-4 py-2.5 font-bold text-[#111827]">{log.title}</td>
                          <td className="px-4 py-2.5 capitalize text-[#2563EB] font-semibold">{log.type}</td>
                          <td className="px-4 py-2.5 text-gray-600">{log.description}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 8. Appearance */}
      {activeSubTab === 'appearance' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#2563EB]" />
              System Branding & Display Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-[#2563EB] bg-blue-50/20 rounded-[12px] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-[#2563EB]" />
                  <div>
                    <h4 className="font-bold text-xs text-[#111827]">Light Theme (Default)</h4>
                    <p className="text-[11px] text-gray-500">Corporate crisp blue & white aesthetics.</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-[#2563EB] text-white font-bold rounded-full">Active</span>
              </div>

              <div className="p-4 border border-[#E5E7EB] bg-slate-50 rounded-[12px] flex items-center justify-between opacity-70">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-gray-500" />
                  <div>
                    <h4 className="font-bold text-xs text-[#111827]">Dark Mode</h4>
                    <p className="text-[11px] text-gray-500">High-contrast dark canvas mode.</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-gray-200 text-gray-700 font-bold rounded-full">Future</span>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="primary" onClick={handleSave}>
                Save Appearance Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
