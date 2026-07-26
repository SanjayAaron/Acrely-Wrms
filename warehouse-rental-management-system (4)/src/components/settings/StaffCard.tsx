import React from 'react';
import { StaffMember } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DeleteButton } from '../common/DeleteButton';
import {
  Eye,
  Edit2,
  KeyRound,
  UserX,
  UserCheck,
  Trash2,
  Mail,
  Phone,
  Clock,
  Shield,
  User
} from 'lucide-react';

interface StaffCardProps {
  staff: StaffMember;
  onView: (staff: StaffMember) => void;
  onEdit: (staff: StaffMember) => void;
  onResetPassword: (staff: StaffMember) => void;
  onToggleDisable: (staff: StaffMember) => void;
  onMoveToRecycleBin: (staff: StaffMember) => void;
}

/**
 * Reusable StaffCard / Staff Row Component
 * Displays staff photo, name, role, email, phone, status badge, last login time,
 * and 5 distinct action buttons (View, Edit, Reset Password, Disable Account, Move to Recycle Bin).
 */
export const StaffCard: React.FC<StaffCardProps> = ({
  staff,
  onView,
  onEdit,
  onResetPassword,
  onToggleDisable,
  onMoveToRecycleBin
}) => {
  const isInactive = staff.status === 'Inactive' || staff.status === 'Suspended';

  return (
    <div className="p-4 bg-white border border-[#E5E7EB] rounded-[12px] hover:border-[#2563EB]/40 transition-all shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Photo & Basic Info */}
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-full bg-blue-50 border border-[#E5E7EB] overflow-hidden flex items-center justify-center font-bold text-xs text-[#2563EB]">
            {staff.photoUrl ? (
              <img
                src={staff.photoUrl}
                alt={`${staff.firstName} ${staff.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>
                {staff.firstName?.[0]}
                {staff.lastName?.[0]}
              </span>
            )}
          </div>
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
              staff.status === 'Active'
                ? 'bg-emerald-500'
                : staff.status === 'Suspended'
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-[#111827] hover:text-[#2563EB] cursor-pointer" onClick={() => onView(staff)}>
              {staff.firstName} {staff.lastName}
            </h4>
            <Badge
              variant={
                staff.role === 'Property Owner'
                  ? 'blue'
                  : staff.role === 'Manager'
                  ? 'success'
                  : staff.role === 'Accountant'
                  ? 'warning'
                  : 'secondary'
              }
            >
              {staff.role}
            </Badge>

            <Badge
              variant={
                staff.status === 'Active'
                  ? 'success'
                  : staff.status === 'Suspended'
                  ? 'warning'
                  : 'danger'
              }
            >
              {staff.status}
            </Badge>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-gray-400" />
              {staff.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-gray-400" />
              {staff.phone}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Clock className="w-3 h-3 text-gray-400" />
              Last login: {staff.lastLogin || 'Never'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 flex-wrap pt-2 md:pt-0 border-t md:border-t-0 border-[#E5E7EB]">
        {/* View Details */}
        <Button
          size="sm"
          variant="outline"
          icon={<Eye className="w-3.5 h-3.5 text-[#2563EB]" />}
          onClick={() => onView(staff)}
        >
          View
        </Button>

        {/* Edit Account */}
        <Button
          size="sm"
          variant="outline"
          icon={<Edit2 className="w-3.5 h-3.5 text-gray-600" />}
          onClick={() => onEdit(staff)}
        >
          Edit
        </Button>

        {/* Reset Password */}
        <Button
          size="sm"
          variant="outline"
          icon={<KeyRound className="w-3.5 h-3.5 text-amber-600" />}
          onClick={() => onResetPassword(staff)}
        >
          Reset Password
        </Button>

        {/* Disable / Enable Account */}
        <Button
          size="sm"
          variant="outline"
          icon={
            isInactive ? (
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <UserX className="w-3.5 h-3.5 text-rose-600" />
            )
          }
          onClick={() => onToggleDisable(staff)}
        >
          {isInactive ? 'Enable' : 'Disable'}
        </Button>

        {/* Move to Recycle Bin */}
        <Button
          size="sm"
          variant="ghost"
          icon={<Trash2 className="w-3.5 h-3.5 text-rose-600" />}
          onClick={() => onMoveToRecycleBin(staff)}
          className="text-rose-600 hover:bg-rose-50"
        >
          Bin
        </Button>
      </div>
    </div>
  );
};
