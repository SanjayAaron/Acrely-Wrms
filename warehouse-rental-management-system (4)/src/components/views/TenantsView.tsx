import React, { useState } from 'react';
import {
  Users,
  Plus,
  FileText,
  Building2,
  Calendar,
  Mail,
  Send,
  CheckCircle2,
  Edit,
  Trash2,
  IndianRupee,
  ShieldAlert
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DeleteButton } from '../common/DeleteButton';
import { Tenant } from '../../types';

interface TenantsViewProps {
  tenants: Tenant[];
  onAddTenant: () => void;
  onEditTenant: (tenant: Tenant) => void;
  onDeleteTenant: (tenant: Tenant) => void;
  searchQuery: string;
}

export const TenantsView: React.FC<TenantsViewProps> = ({
  tenants,
  onAddTenant,
  onEditTenant,
  onDeleteTenant,
  searchQuery
}) => {
  const [notificationSentTenantId, setNotificationSentTenantId] = useState<string | null>(null);

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.warehouseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendReminder = (tenant: Tenant) => {
    setNotificationSentTenantId(tenant.id);
    setTimeout(() => {
      setNotificationSentTenantId(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-xl font-bold text-[#111827] tracking-tight">
            Tenant Directory
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Client lease agreements, security deposits, monthly rent obligations, and document records.
          </p>
        </div>

        <Button variant="primary" onClick={onAddTenant} icon={<Plus className="w-4 h-4" />}>
          Add Tenant
        </Button>
      </div>

      {/* Tenants Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTenants.map((t) => (
          <Card key={t.id} className="hover:border-[#2563EB] transition-all">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#111827]">{t.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[#2563EB]" />
                      Rented: <strong className="text-[#111827]">{t.warehouseName}</strong>
                    </p>
                  </div>
                </div>

                <Badge variant={t.status === 'Active' ? 'success' : 'neutral'}>
                  {t.status}
                </Badge>
              </div>

              {/* Terms summary box */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-[#E5E7EB] rounded-[10px] text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 block">Monthly Rent</span>
                  <span className="font-bold text-[#2563EB]">
                    ₹{t.monthlyRent.toLocaleString('en-IN')} / mo
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-500 block">Security Deposit</span>
                  <span className="font-semibold text-[#111827]">
                    ₹{t.securityDeposit.toLocaleString('en-IN')}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-500 block">Lease Start</span>
                  <span className="font-medium text-[#111827]">{t.leaseStart}</span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-500 block">Lease Expiry</span>
                  <span className="font-medium text-[#111827]">{t.leaseEnd}</span>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-1 text-xs text-gray-600">
                <p>
                  <strong className="text-gray-700">Contact Person:</strong> {t.contactPerson}
                </p>
                <p className="flex items-center gap-1.5 text-gray-500">
                  <Mail className="w-3 h-3" /> {t.email}
                </p>
              </div>

              {/* Reminder feedback alert */}
              {notificationSentTenantId === t.id && (
                <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-xs text-[#16A34A] flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Rent payment reminder sent to {t.name}!</span>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Lease Document Verified</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Send className="w-3 h-3" />}
                    onClick={() => handleSendReminder(t)}
                  >
                    Remind
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<Edit className="w-3 h-3" />}
                    onClick={() => onEditTenant(t)}
                  >
                    Edit
                  </Button>
                  <DeleteButton onClick={() => onDeleteTenant(t)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
