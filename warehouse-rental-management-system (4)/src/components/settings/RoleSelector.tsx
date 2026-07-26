import React from 'react';
import { StaffRole } from '../../types';
import { Shield, UserCheck, Briefcase, Calculator, Users, Wrench } from 'lucide-react';

interface RoleSelectorProps {
  value: StaffRole;
  onChange: (role: StaffRole) => void;
  disabled?: boolean;
}

const ROLE_DESCRIPTIONS: Record<StaffRole, { title: string; description: string; icon: React.ReactNode }> = {
  'Property Owner': {
    title: 'Property Owner',
    description: 'Full system control. Automatically possesses View, Create, Edit, and Delete authority on all modules.',
    icon: <Shield className="w-4 h-4 text-[#2563EB]" />
  },
  Manager: {
    title: 'Manager',
    description: 'Operational lead. Can manage warehouses, tenants, leases, and CRM leads. Limited deletion authority.',
    icon: <UserCheck className="w-4 h-4 text-[#2563EB]" />
  },
  Staff: {
    title: 'Staff',
    description: 'Day-to-day associate. Can view and create warehouse listings, record site visits, and view documents.',
    icon: <Users className="w-4 h-4 text-[#2563EB]" />
  },
  Accountant: {
    title: 'Accountant',
    description: 'Financial auditor. Direct access to Rent Payments, Invoice Generation, Ledger Reports, and Broker Settlements.',
    icon: <Calculator className="w-4 h-4 text-[#2563EB]" />
  },
  Broker: {
    title: 'Broker Partner',
    description: 'External broker associate. Restricted access to CRM leads, broker deals, and vacant warehouse inquiries.',
    icon: <Briefcase className="w-4 h-4 text-[#2563EB]" />
  },
  Custom: {
    title: 'Custom Role',
    description: 'Tailored permissions matrix configured granularly per module and operation type.',
    icon: <Wrench className="w-4 h-4 text-[#2563EB]" />
  }
};

/**
 * Reusable RoleSelector Component
 * Provides preset staff role selection with descriptive tooltips and icons.
 */
export const RoleSelector: React.FC<RoleSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-[#111827]">
        Assign Staff Role <span className="text-rose-500">*</span>
      </label>

      {/* Grid of Preset Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {(Object.keys(ROLE_DESCRIPTIONS) as StaffRole[]).map((role) => {
          const isSelected = value === role;
          const info = ROLE_DESCRIPTIONS[role];

          return (
            <button
              key={role}
              type="button"
              disabled={disabled}
              onClick={() => onChange(role)}
              className={`p-3 rounded-[10px] border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#2563EB] bg-blue-50/40 ring-2 ring-[#2563EB]/20 shadow-2xs'
                  : 'border-[#E5E7EB] bg-white hover:bg-slate-50'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1">
                {info.icon}
                <span className="font-bold text-xs text-[#111827]">{info.title}</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">{info.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
