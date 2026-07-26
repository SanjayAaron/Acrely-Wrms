import React from 'react';
import { StaffPermissions, StaffModule, StaffRole } from '../../types';
import { ShieldCheck, CheckSquare, Square } from 'lucide-react';

interface PermissionMatrixProps {
  permissions: StaffPermissions;
  onChange: (permissions: StaffPermissions) => void;
  role: StaffRole;
  isOwnerRole?: boolean;
}

const MODULE_LABELS: Record<StaffModule, { name: string; description: string }> = {
  dashboard: { name: 'Dashboard', description: 'Overview KPIs, occupancy rates & revenue graphs' },
  warehouses: { name: 'Warehouses', description: 'Warehouse property profiles, specifications & status' },
  tenants: { name: 'Tenants', description: 'Lease agreements, tenant records & contact info' },
  payments: { name: 'Rent Payments', description: 'Rent collection, invoices, receipts & transaction history' },
  brokers: { name: 'Brokers', description: 'Partner broker directory, commission deals & settlements' },
  crm: { name: 'CRM Leads', description: 'Inquiry leads pipeline, site visits & negotiations' },
  reports: { name: 'Reports', description: 'Financial analytics, yield audits & aging reports' },
  recycleBin: { name: 'Recycle Bin', description: 'Restoration & permanent purge of soft-deleted items' },
  documents: { name: 'Documents', description: 'Property deed storage, tax certificates & contracts' },
  settings: { name: 'Settings', description: 'System configuration, staff accounts & access control' }
};

/**
 * Helper to generate default permission matrix based on assigned StaffRole
 */
export function getDefaultPermissionsForRole(role: StaffRole): StaffPermissions {
  const modules: StaffModule[] = [
    'dashboard',
    'warehouses',
    'tenants',
    'payments',
    'brokers',
    'crm',
    'reports',
    'recycleBin',
    'documents',
    'settings'
  ];

  const permissions: Partial<StaffPermissions> = {};

  modules.forEach((mod) => {
    if (role === 'Property Owner') {
      permissions[mod] = { view: true, create: true, edit: true, delete: true };
    } else if (role === 'Manager') {
      if (mod === 'settings' || mod === 'recycleBin') {
        permissions[mod] = { view: true, create: false, edit: false, delete: false };
      } else {
        permissions[mod] = { view: true, create: true, edit: true, delete: mod === 'crm' || mod === 'tenants' };
      }
    } else if (role === 'Accountant') {
      if (mod === 'payments' || mod === 'reports' || mod === 'brokers') {
        permissions[mod] = { view: true, create: true, edit: true, delete: false };
      } else if (mod === 'settings' || mod === 'recycleBin') {
        permissions[mod] = { view: false, create: false, edit: false, delete: false };
      } else {
        permissions[mod] = { view: true, create: false, edit: false, delete: false };
      }
    } else if (role === 'Broker') {
      if (mod === 'crm' || mod === 'brokers' || mod === 'warehouses') {
        permissions[mod] = { view: true, create: true, edit: true, delete: false };
      } else {
        permissions[mod] = { view: false, create: false, edit: false, delete: false };
      }
    } else if (role === 'Staff') {
      if (mod === 'settings' || mod === 'recycleBin') {
        permissions[mod] = { view: false, create: false, edit: false, delete: false };
      } else {
        permissions[mod] = { view: true, create: true, edit: true, delete: false };
      }
    } else {
      // Custom
      permissions[mod] = { view: true, create: false, edit: false, delete: false };
    }
  });

  return permissions as StaffPermissions;
}

/**
 * Reusable PermissionMatrix Component
 * Renders module-wise View, Create, Edit, Delete permission matrix.
 * Enforces automatic full access for Property Owner.
 */
export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  permissions,
  onChange,
  role,
  isOwnerRole = role === 'Property Owner'
}) => {
  const modulesList: StaffModule[] = [
    'dashboard',
    'warehouses',
    'tenants',
    'payments',
    'brokers',
    'crm',
    'reports',
    'recycleBin',
    'documents',
    'settings'
  ];

  // Toggle single operation checkbox for a module
  const handleToggle = (moduleKey: StaffModule, action: 'view' | 'create' | 'edit' | 'delete') => {
    if (isOwnerRole) return; // Owner automatically gets every permission

    const updated = {
      ...permissions,
      [moduleKey]: {
        ...permissions[moduleKey],
        [action]: !permissions[moduleKey]?.[action]
      }
    };

    // If unchecking View, uncheck create, edit, delete
    if (action === 'view' && permissions[moduleKey]?.view) {
      updated[moduleKey] = { view: false, create: false, edit: false, delete: false };
    }
    // If checking create/edit/delete, automatically check View
    if (action !== 'view' && !permissions[moduleKey]?.view) {
      updated[moduleKey].view = true;
    }

    onChange(updated);
  };

  // Toggle All View / Create / Edit / Delete for column
  const handleToggleColumn = (action: 'view' | 'create' | 'edit' | 'delete') => {
    if (isOwnerRole) return;

    const allChecked = modulesList.every((mod) => permissions[mod]?.[action]);
    const updated = { ...permissions };

    modulesList.forEach((mod) => {
      updated[mod] = {
        ...updated[mod],
        [action]: !allChecked
      };
      if (action !== 'view' && !allChecked) {
        updated[mod].view = true;
      }
    });

    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
            Module Access & Operational Permissions
          </h4>
          <p className="text-[11px] text-gray-500">
            {isOwnerRole
              ? 'Property Owner automatically possesses full View, Create, Edit, and Delete privileges on all system modules.'
              : 'Customize granular operational permissions for each module below.'}
          </p>
        </div>

        {isOwnerRole && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#2563EB] border border-[#2563EB]/30 rounded-md text-[11px] font-bold">
            All Granted (Owner)
          </span>
        )}
      </div>

      <div className="border border-[#E5E7EB] rounded-[10px] overflow-hidden bg-white text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-[#E5E7EB] text-gray-600 font-bold">
              <tr>
                <th className="px-4 py-2.5">System Module</th>
                <th className="px-3 py-2.5 text-center w-20">
                  <button
                    type="button"
                    disabled={isOwnerRole}
                    onClick={() => handleToggleColumn('view')}
                    className="hover:text-[#2563EB] cursor-pointer"
                  >
                    View
                  </button>
                </th>
                <th className="px-3 py-2.5 text-center w-20">
                  <button
                    type="button"
                    disabled={isOwnerRole}
                    onClick={() => handleToggleColumn('create')}
                    className="hover:text-[#2563EB] cursor-pointer"
                  >
                    Create
                  </button>
                </th>
                <th className="px-3 py-2.5 text-center w-20">
                  <button
                    type="button"
                    disabled={isOwnerRole}
                    onClick={() => handleToggleColumn('edit')}
                    className="hover:text-[#2563EB] cursor-pointer"
                  >
                    Edit
                  </button>
                </th>
                <th className="px-3 py-2.5 text-center w-20">
                  <button
                    type="button"
                    disabled={isOwnerRole}
                    onClick={() => handleToggleColumn('delete')}
                    className="hover:text-[#2563EB] cursor-pointer"
                  >
                    Delete
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {modulesList.map((modKey) => {
                const info = MODULE_LABELS[modKey];
                const perm = isOwnerRole
                  ? { view: true, create: true, edit: true, delete: true }
                  : permissions[modKey] || { view: false, create: false, edit: false, delete: false };

                return (
                  <tr key={modKey} className="hover:bg-slate-50/60">
                    <td className="px-4 py-2.5">
                      <div className="font-semibold text-[#111827]">{info.name}</div>
                      <div className="text-[10px] text-gray-500">{info.description}</div>
                    </td>

                    {(['view', 'create', 'edit', 'delete'] as const).map((action) => (
                      <td key={action} className="px-3 py-2.5 text-center">
                        <label className="inline-flex items-center justify-center cursor-pointer">
                          <input
                            type="checkbox"
                            disabled={isOwnerRole}
                            checked={perm[action]}
                            onChange={() => handleToggle(modKey, action)}
                            className="w-4 h-4 text-[#2563EB] rounded focus:ring-[#2563EB] disabled:opacity-80"
                          />
                        </label>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
