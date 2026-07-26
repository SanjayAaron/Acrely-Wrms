import React, { useState } from 'react';
import {
  UserCheck,
  Users,
  Plus,
  FileText,
  Search,
  CheckCircle2,
  Save,
  Shield,
  Building
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { DeleteButton } from '../common/DeleteButton';
import {
  SystemSettings,
  UserRole,
  EditorAccount,
  DocumentItem,
  StaffMember,
  Warehouse,
  ActivityLog
} from '../../types';

import { StaffForm } from '../settings/StaffForm';
import { StaffCard } from '../settings/StaffCard';
import { StaffDetails } from '../settings/StaffDetails';
import { ResetPasswordDialog } from '../settings/ResetPasswordDialog';
import { DisableAccountDialog } from '../settings/DisableAccountDialog';
import { AdditionalSettingsPanels } from '../settings/AdditionalSettingsPanels';

interface SettingsViewProps {
  settings: SystemSettings;
  onSaveSettings: (newSettings: SystemSettings) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  staffMembers: StaffMember[];
  onSaveStaffMember: (staff: Partial<StaffMember>) => void;
  onResetStaffPassword: (staffId: string, newPassword: string) => void;
  onToggleDisableStaff: (staff: StaffMember) => void;
  onMoveStaffToRecycleBin: (staff: StaffMember) => void;
  editorAccounts: EditorAccount[];
  onDeleteEditorAccount: (account: EditorAccount) => void;
  documents: DocumentItem[];
  onDeleteDocument: (doc: DocumentItem) => void;
  warehouses?: Warehouse[];
  activities?: ActivityLog[];
  onShowToast?: (message: string, type?: 'success' | 'error') => void;
}

/**
 * Enterprise Settings Panel Component
 * Redesigned into a modular enterprise settings panel.
 * Includes:
 * 1. Role switcher & access simulation
 * 2. Staff Accounts Section (Renamed from "Editor & Staff Accounts" to "Staff Accounts")
 *    with "+ Add Staff Account" button launching the 4-section modal.
 * 3. Staff List with photo, role, status, last login, and 5 action buttons.
 * 4. Staff Details view modal (/staff/[id]).
 * 5. Reset Password dialog & Disable Account confirmation dialog.
 * 6. Repository documents list.
 * 7. Modular additional settings sections (Company, Warehouse, Invoice, Notifications, Security, Backup, Audit Logs, Appearance).
 */
export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  userRole,
  onRoleChange,
  staffMembers,
  onSaveStaffMember,
  onResetStaffPassword,
  onToggleDisableStaff,
  onMoveStaffToRecycleBin,
  editorAccounts,
  onDeleteEditorAccount,
  documents,
  onDeleteDocument,
  warehouses = [],
  activities = [],
  onShowToast
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal Control States
  const [isStaffFormOpen, setIsStaffFormOpen] = useState<boolean>(false);
  const [selectedStaffForEdit, setSelectedStaffForEdit] = useState<StaffMember | null>(null);

  const [isStaffDetailsOpen, setIsStaffDetailsOpen] = useState<boolean>(false);
  const [selectedStaffForView, setSelectedStaffForView] = useState<StaffMember | null>(null);

  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState<boolean>(false);
  const [selectedStaffForReset, setSelectedStaffForReset] = useState<StaffMember | null>(null);

  const [isDisableAccountOpen, setIsDisableAccountOpen] = useState<boolean>(false);
  const [selectedStaffForDisable, setSelectedStaffForDisable] = useState<StaffMember | null>(null);

  // Filter staff members based on search
  const filteredStaff = staffMembers.filter((s) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    return (
      fullName.includes(term) ||
      s.email.toLowerCase().includes(term) ||
      s.role.toLowerCase().includes(term) ||
      s.username.toLowerCase().includes(term) ||
      s.phone.includes(term)
    );
  });

  // Action handlers
  const handleOpenAddStaff = () => {
    setSelectedStaffForEdit(null);
    setIsStaffFormOpen(true);
  };

  const handleOpenEditStaff = (staff: StaffMember) => {
    setSelectedStaffForEdit(staff);
    setIsStaffFormOpen(true);
  };

  const handleOpenViewStaff = (staff: StaffMember) => {
    setSelectedStaffForView(staff);
    setIsStaffDetailsOpen(true);
  };

  const handleOpenResetPassword = (staff: StaffMember) => {
    setSelectedStaffForReset(staff);
    setIsResetPasswordOpen(true);
  };

  const handleOpenDisableDialog = (staff: StaffMember) => {
    setSelectedStaffForDisable(staff);
    setIsDisableAccountOpen(true);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-xl font-bold text-[#111827] tracking-tight">
            Enterprise Settings & Staff Access Panel
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure system rules, staff account permissions, company branding, invoicing, and security.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAddStaff}
        >
          + Add Staff Account
        </Button>
      </div>

      {/* Role Switcher Card (Owner vs Editor Role Simulation) */}
      <Card className="border-[#2563EB]/30 bg-blue-50/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#2563EB]" />
              <CardTitle>Active User Role & Access Control Simulation</CardTitle>
            </div>
            <Badge variant={userRole === 'Owner' || userRole === 'Property Owner' ? 'blue' : 'warning'}>
              Current: {userRole} Role
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-gray-600">
            Select an active role to test system-wide permission enforcement. Property Owners possess full administrative and deletion authority across all entities, while Editors/Staff are restricted according to their matrix.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => onRoleChange('Owner')}
              className={`flex-1 p-3 rounded-[12px] border text-left transition-all cursor-pointer ${
                userRole === 'Owner' || userRole === 'Property Owner'
                  ? 'border-[#2563EB] bg-white shadow-sm ring-2 ring-[#2563EB]/20'
                  : 'border-[#E5E7EB] bg-slate-50 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-[#111827]">Property Owner</span>
                {(userRole === 'Owner' || userRole === 'Property Owner') && <Badge variant="success">Active</Badge>}
              </div>
              <p className="text-[11px] text-gray-500">Full administrative control (Can Add, Edit, and Delete all entities).</p>
            </button>

            <button
              type="button"
              onClick={() => onRoleChange('Editor')}
              className={`flex-1 p-3 rounded-[12px] border text-left transition-all cursor-pointer ${
                userRole === 'Editor'
                  ? 'border-[#F59E0B] bg-white shadow-sm ring-2 ring-[#F59E0B]/20'
                  : 'border-[#E5E7EB] bg-slate-50 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-[#111827]">Staff Associate / Editor</span>
                {userRole === 'Editor' && <Badge variant="warning">Active</Badge>}
              </div>
              <p className="text-[11px] text-gray-500">Restricted access (Can View & Edit, but cannot permanently delete data).</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Staff Accounts Section */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2563EB]" />
              <CardTitle>Staff Accounts</CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage system login credentials, assigned roles, and operational permissions.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-[#E5E7EB] rounded-[8px] text-xs w-48 focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <Button
              size="sm"
              variant="primary"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={handleOpenAddStaff}
            >
              + Add Staff Account
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {filteredStaff.length > 0 ? (
            <div className="space-y-3">
              {filteredStaff.map((staff) => (
                <StaffCard
                  key={staff.id}
                  staff={staff}
                  onView={handleOpenViewStaff}
                  onEdit={handleOpenEditStaff}
                  onResetPassword={handleOpenResetPassword}
                  onToggleDisable={handleOpenDisableDialog}
                  onMoveToRecycleBin={onMoveStaffToRecycleBin}
                />
              ))}
            </div>
          ) : (
            <div className="p-6 bg-slate-50 border border-dashed border-[#E5E7EB] rounded-[12px] text-center text-xs text-gray-500">
              No staff accounts found matching search criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Repository Documents Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2563EB]" />
              <CardTitle>Repository Documents</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <div className="divide-y divide-[#E5E7EB]">
              {documents.map((doc) => (
                <div key={doc.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-[#2563EB] rounded-[8px]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#111827]">{doc.name}</span>
                      <p className="text-[11px] text-gray-500">
                        {doc.category} • {doc.fileSize} • {doc.associatedEntity || 'General System'}
                      </p>
                    </div>
                  </div>

                  <DeleteButton
                    onClick={() => onDeleteDocument(doc)}
                    label="Delete Document"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-dashed border-[#E5E7EB] rounded-[10px] text-center text-xs text-gray-500">
              No documents in repository.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Enterprise Settings Sections */}
      <div className="pt-2">
        <h2 className="text-sm font-bold text-[#111827] mb-3 uppercase tracking-wider text-gray-500">
          Enterprise System Configurations
        </h2>
        <AdditionalSettingsPanels
          settings={settings}
          onUpdateSettings={onSaveSettings}
          staffMembers={staffMembers}
          activityLogs={activities}
          onShowToast={onShowToast}
        />
      </div>

      {/* Modals & Dialogs */}

      {/* 1. Add / Edit Staff Account Form Modal */}
      <StaffForm
        isOpen={isStaffFormOpen}
        onClose={() => setIsStaffFormOpen(false)}
        onSave={(staff) => {
          onSaveStaffMember(staff);
          if (onShowToast) {
            onShowToast(
              staff.id
                ? `Staff account for ${staff.firstName} updated!`
                : `New staff account created for ${staff.firstName}!`
            );
          }
        }}
        initialData={selectedStaffForEdit}
      />

      {/* 2. Staff Profile Detail Modal (/staff/[id]) */}
      <StaffDetails
        isOpen={isStaffDetailsOpen}
        onClose={() => setIsStaffDetailsOpen(false)}
        staff={selectedStaffForView}
        allWarehouses={warehouses}
      />

      {/* 3. Reset Password Dialog */}
      <ResetPasswordDialog
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        staff={selectedStaffForReset}
        onConfirmReset={(staffId, newPassword) => {
          onResetStaffPassword(staffId, newPassword);
          if (onShowToast) {
            onShowToast('Staff password reset successfully!');
          }
        }}
      />

      {/* 4. Disable Account Dialog */}
      <DisableAccountDialog
        isOpen={isDisableAccountOpen}
        onClose={() => setIsDisableAccountOpen(false)}
        staff={selectedStaffForDisable}
        onConfirmToggle={(staff) => {
          onToggleDisableStaff(staff);
          if (onShowToast) {
            onShowToast(
              staff.status === 'Active'
                ? `Account for ${staff.firstName} has been disabled.`
                : `Account for ${staff.firstName} has been re-enabled.`
            );
          }
        }}
      />
    </div>
  );
};
