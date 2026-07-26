import React, { useState } from 'react';
import { StaffMember, Warehouse, DocumentItem } from '../../types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  User,
  Shield,
  Clock,
  Building2,
  FileText,
  FileSpreadsheet,
  Activity,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Lock,
  Globe,
  StickyNote,
  X
} from 'lucide-react';

interface StaffDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
  allWarehouses?: Warehouse[];
}

/**
 * StaffDetails Component (/staff/[id] detail view modal)
 * Displays Personal Information, Assigned Role, Module Permissions Matrix,
 * Activity Log, Recent Logins, Assigned Warehouses, Documents, and Internal Notes.
 */
export const StaffDetails: React.FC<StaffDetailsProps> = ({
  isOpen,
  onClose,
  staff,
  allWarehouses = []
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'permissions' | 'activity' | 'logins' | 'warehouses' | 'documents'>('profile');

  if (!staff) return null;

  // Filter assigned warehouses
  const assignedWarehouses = allWarehouses.filter((w) =>
    staff.assignedWarehouseIds?.includes(w.id)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Staff Account Profile: ${staff.firstName} ${staff.lastName}`}
      description={`System ID: ${staff.id} • Registered ${staff.createdAt || 'Recently'}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="p-4 bg-slate-50 border border-[#E5E7EB] rounded-[12px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-blue-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-lg font-bold text-[#2563EB] shrink-0">
              {staff.photoUrl ? (
                <img src={staff.photoUrl} alt={staff.firstName} className="w-full h-full object-cover" />
              ) : (
                <span>
                  {staff.firstName?.[0]}
                  {staff.lastName?.[0]}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-[#111827]">
                  {staff.firstName} {staff.lastName}
                </h2>
                <Badge variant={staff.role === 'Property Owner' ? 'blue' : 'success'}>
                  {staff.role}
                </Badge>
                <Badge variant={staff.status === 'Active' ? 'success' : 'danger'}>
                  {staff.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Username: <span className="font-semibold text-[#111827]">@{staff.username}</span> • Email Login: {staff.emailLogin}
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-gray-500">
            <div>Last Login: <span className="font-semibold text-[#111827]">{staff.lastLogin || 'Never'}</span></div>
            <div>2FA Status: <span className="font-semibold text-[#2563EB]">{staff.twoFactorEnabled ? 'Enabled' : 'Disabled'}</span></div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2 text-xs overflow-x-auto">
          {[
            { id: 'profile', label: 'Personal Info', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'permissions', label: 'Role & Permissions', icon: <Shield className="w-3.5 h-3.5" /> },
            { id: 'activity', label: 'Activity Log', icon: <Activity className="w-3.5 h-3.5" /> },
            { id: 'logins', label: 'Recent Logins', icon: <Clock className="w-3.5 h-3.5" /> },
            { id: 'warehouses', label: `Warehouses (${assignedWarehouses.length})`, icon: <Building2 className="w-3.5 h-3.5" /> },
            { id: 'documents', label: 'Documents', icon: <FileText className="w-3.5 h-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#2563EB] text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Profile & Personal Info */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white border border-[#E5E7EB] rounded-[10px] space-y-3">
              <h4 className="font-bold text-[#111827] border-b border-[#E5E7EB] pb-2">Contact Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span className="text-gray-400">Full Name:</span>
                  <span className="font-semibold text-[#111827]">{staff.firstName} {staff.lastName}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="text-gray-400">Primary Phone:</span>
                  <span className="font-semibold text-[#111827]">{staff.phone}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="text-gray-400">WhatsApp:</span>
                  <span className="font-semibold text-[#111827]">{staff.whatsappNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="text-gray-400">Email Address:</span>
                  <span className="font-semibold text-[#111827]">{staff.email}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#E5E7EB] rounded-[10px] space-y-3">
              <h4 className="font-bold text-[#111827] border-b border-[#E5E7EB] pb-2">Personal Demographics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span className="text-gray-400">Date of Birth:</span>
                  <span className="font-semibold text-[#111827]">{staff.dateOfBirth || 'Not specified'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="text-gray-400">Gender:</span>
                  <span className="font-semibold text-[#111827]">{staff.gender || 'Not specified'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="text-gray-400">Address:</span>
                  <span className="font-semibold text-[#111827] text-right">{staff.address || 'Not specified'}</span>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="md:col-span-2 p-4 bg-slate-50 border border-[#E5E7EB] rounded-[10px] space-y-2">
              <h4 className="font-bold text-[#111827] flex items-center gap-1.5">
                <StickyNote className="w-4 h-4 text-[#2563EB]" />
                Internal Notes & Remarks
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {staff.notes || 'No internal administrative notes recorded for this staff member.'}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Permissions Matrix Summary */}
        {activeTab === 'permissions' && (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50/50 border border-[#2563EB]/20 rounded-[10px] text-xs text-gray-600">
              Assigned Role: <span className="font-bold text-[#2563EB]">{staff.role}</span>.
              {staff.role === 'Property Owner'
                ? ' Possesses full administrative rights across all system modules.'
                : ' Operating under custom assigned staff permission matrix.'}
            </div>

            <div className="border border-[#E5E7EB] rounded-[10px] overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-[#E5E7EB] text-gray-600 font-bold">
                  <tr>
                    <th className="px-4 py-2">Module</th>
                    <th className="px-3 py-2 text-center">View</th>
                    <th className="px-3 py-2 text-center">Create</th>
                    <th className="px-3 py-2 text-center">Edit</th>
                    <th className="px-3 py-2 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {Object.entries(staff.permissions || {}).map(([mod, p]) => {
                    const perm = p as { view?: boolean; create?: boolean; edit?: boolean; delete?: boolean };
                    return (
                      <tr key={mod} className="hover:bg-slate-50">
                        <td className="px-4 py-2 capitalize font-semibold text-[#111827]">{mod}</td>
                        <td className="px-3 py-2 text-center">{perm.view ? '✅' : '❌'}</td>
                        <td className="px-3 py-2 text-center">{perm.create ? '✅' : '❌'}</td>
                        <td className="px-3 py-2 text-center">{perm.edit ? '✅' : '❌'}</td>
                        <td className="px-3 py-2 text-center">{perm.delete ? '✅' : '❌'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Activity Log */}
        {activeTab === 'activity' && (
          <div className="space-y-3 text-xs">
            {staff.activityLog && staff.activityLog.length > 0 ? (
              <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-[10px]">
                {staff.activityLog.map((log) => (
                  <div key={log.id} className="p-3 flex items-start justify-between gap-3 hover:bg-slate-50">
                    <div>
                      <div className="font-bold text-[#111827]">{log.action}</div>
                      <div className="text-gray-500 mt-0.5">{log.details}</div>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400 border border-dashed border-[#E5E7EB] rounded-[10px]">
                No recent activity logs recorded for this staff member.
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Recent Logins */}
        {activeTab === 'logins' && (
          <div className="space-y-3 text-xs">
            {staff.recentLogins && staff.recentLogins.length > 0 ? (
              <div className="border border-[#E5E7EB] rounded-[10px] overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-[#E5E7EB] text-gray-600 font-bold">
                    <tr>
                      <th className="px-4 py-2">Timestamp</th>
                      <th className="px-4 py-2">IP Address</th>
                      <th className="px-4 py-2">Device / Browser</th>
                      <th className="px-4 py-2">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {staff.recentLogins.map((login) => (
                      <tr key={login.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-medium text-[#111827]">{login.timestamp}</td>
                        <td className="px-4 py-2 text-gray-600">{login.ipAddress}</td>
                        <td className="px-4 py-2 text-gray-600">{login.device}</td>
                        <td className="px-4 py-2 text-gray-600">{login.location || 'Mumbai, MH'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400 border border-dashed border-[#E5E7EB] rounded-[10px]">
                No recent login sessions recorded.
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Assigned Warehouses */}
        {activeTab === 'warehouses' && (
          <div className="space-y-3 text-xs">
            {assignedWarehouses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assignedWarehouses.map((wh) => (
                  <div key={wh.id} className="p-3 border border-[#E5E7EB] rounded-[10px] bg-white">
                    <div className="font-bold text-[#111827]">{wh.name}</div>
                    <div className="text-gray-500 mt-0.5">{wh.address?.split('\n')[0] || wh.locationZone || 'Address N/A'} • {wh.areaSqFt} Sq Ft • Status: {wh.status}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400 border border-dashed border-[#E5E7EB] rounded-[10px]">
                All warehouses assigned or no specific property restrictions active.
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Documents */}
        {activeTab === 'documents' && (
          <div className="space-y-3 text-xs">
            {staff.documents && staff.documents.length > 0 ? (
              <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-[10px]">
                {staff.documents.map((doc) => (
                  <div key={doc.id} className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#2563EB]" />
                      <div>
                        <div className="font-bold text-[#111827]">{doc.name}</div>
                        <div className="text-[10px] text-gray-400">{doc.category} • {doc.fileSize}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400 border border-dashed border-[#E5E7EB] rounded-[10px]">
                No uploaded identification or employment contract documents.
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-[#E5E7EB]">
          <Button variant="outline" onClick={onClose}>
            Close Profile
          </Button>
        </div>
      </div>
    </Modal>
  );
};
