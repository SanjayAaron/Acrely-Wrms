import React, { useState } from 'react';
import { Briefcase, Plus, Phone, Mail, Award, IndianRupee, CheckCircle2, Edit, ExternalLink, MapPin, Building2, User } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DeleteButton } from '../common/DeleteButton';
import { ProfileAvatar } from '../common/ProfileAvatar';
import { Broker } from '../../types';
import { BrokerDetailView } from './BrokerDetailView';

interface BrokersViewProps {
  brokers: Broker[];
  onAddBroker: () => void;
  onEditBroker: (broker: Broker) => void;
  onUpdateBrokerDirect?: (broker: Broker) => void;
  onDeleteBroker: (broker: Broker) => void;
  searchQuery: string;
  onShowToast?: (message: string, type?: 'success' | 'error') => void;
}

export const BrokersView: React.FC<BrokersViewProps> = ({
  brokers,
  onAddBroker,
  onEditBroker,
  onUpdateBrokerDirect,
  onDeleteBroker,
  searchQuery,
  onShowToast
}) => {
  const [selectedBrokerId, setSelectedBrokerId] = useState<string | null>(null);

  const selectedBroker = brokers.find((b) => b.id === selectedBrokerId);

  // If a broker is selected, render the dedicated Broker Detail Page View (`/brokers/[id]`)
  if (selectedBroker) {
    return (
      <BrokerDetailView
        broker={selectedBroker}
        onBack={() => setSelectedBrokerId(null)}
        onEdit={(b) => {
          onEditBroker(b);
        }}
        onDelete={(b) => {
          onDeleteBroker(b);
          setSelectedBrokerId(null);
        }}
        onUpdateBroker={(updatedBroker) => {
          if (onUpdateBrokerDirect) {
            onUpdateBrokerDirect(updatedBroker);
          } else {
            onEditBroker(updatedBroker);
          }
        }}
        onShowToast={onShowToast}
      />
    );
  }

  const filteredBrokers = brokers.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.companyName && b.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.brokerId && b.brokerId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB] dark:border-[#334155]">
        <div>
          <h1 className="text-xl font-bold text-[#111827] dark:text-[#F8FAFC] tracking-tight">
            Brokers & Real Estate Partners
          </h1>
          <p className="text-xs text-gray-500 dark:text-[#94A3B8] mt-0.5">
            Manage real estate brokers, track tenant acquisition deals, and settle commission payouts.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={onAddBroker}
          icon={<Plus className="w-4 h-4" />}
        >
          Add New Broker
        </Button>
      </div>

      {/* Cards Grid */}
      {filteredBrokers.length === 0 ? (
        <Card className="p-8 text-center bg-slate-50 dark:bg-[#1E293B] border-dashed">
          <div className="max-w-md mx-auto space-y-2">
            <Briefcase className="w-10 h-10 text-gray-400 dark:text-[#64748B] mx-auto" />
            <h3 className="font-bold text-sm text-[#111827] dark:text-[#F8FAFC]">No Brokers Found</h3>
            <p className="text-xs text-gray-500 dark:text-[#94A3B8]">
              No real estate brokers match your search criteria. Try adding a new broker or clear filters.
            </p>
            <Button size="sm" variant="outline" onClick={onAddBroker} icon={<Plus className="w-3.5 h-3.5" />}>
              Add Broker
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBrokers.map((b) => (
            <Card
              key={b.id}
              className="hover:border-[#2563EB] transition-all hover:shadow-xs group cursor-pointer"
            >
              <CardContent className="p-5 space-y-4">
                <div
                  className="flex items-start justify-between gap-2"
                  onClick={() => setSelectedBrokerId(b.id)}
                >
                  <div className="flex items-center gap-3">
                    <ProfileAvatar photoUrl={b.photoUrl} name={b.name} size="md" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-[#111827] dark:text-[#F8FAFC] group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                          {b.name}
                        </h3>
                        {b.brokerId && (
                          <span className="text-[10px] font-mono text-gray-400 dark:text-[#64748B]">({b.brokerId})</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-[#94A3B8] flex items-center gap-1 truncate max-w-[180px]">
                        <Building2 className="w-3 h-3 text-gray-400 dark:text-[#64748B] shrink-0" />
                        {b.companyName || b.email}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={
                      b.status === 'Active Partner' || b.status === 'Preferred Broker' || b.status === 'Active'
                        ? 'success'
                        : 'neutral'
                    }
                  >
                    {b.status}
                  </Badge>
                </div>

                {/* Operating areas tags preview */}
                {b.operatingAreas && b.operatingAreas.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {b.operatingAreas.slice(0, 3).map((area) => (
                      <span
                        key={area}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-[#111827] text-gray-600 dark:text-[#CBD5E1] rounded text-[10px] font-medium flex items-center gap-0.5"
                      >
                        <MapPin className="w-2.5 h-2.5 text-gray-400 dark:text-[#64748B]" />
                        {area}
                      </span>
                    ))}
                    {b.operatingAreas.length > 3 && (
                      <span className="text-[10px] text-gray-400 dark:text-[#64748B] self-center">
                        +{b.operatingAreas.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Commission Stats Box */}
                <div
                  className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-[#111827]/80 border border-[#E5E7EB] dark:border-[#334155] rounded-[10px] text-xs"
                  onClick={() => setSelectedBrokerId(b.id)}
                >
                  <div>
                    <span className="text-[10px] text-gray-500 dark:text-[#64748B] block">Deals Closed</span>
                    <span className="font-bold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-1">
                      <Award className="w-3 h-3 text-[#2563EB] dark:text-blue-400" />
                      {b.totalDealsClosed}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 dark:text-[#64748B] block">Commission</span>
                    <span className="font-bold text-[#2563EB] dark:text-blue-400">
                      {b.commissionType === 'Fixed Amount'
                        ? `₹${b.commissionRatePercent}`
                        : `${b.commissionRatePercent}%`}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 dark:text-[#64748B] block">Pending Dues</span>
                    <span className="font-bold text-[#F59E0B] dark:text-amber-400">
                      ₹{b.pendingCommission.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#334155] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedBrokerId(b.id)}
                    className="text-xs font-semibold text-[#2563EB] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View Details <ExternalLink className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<Edit className="w-3 h-3" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditBroker(b);
                      }}
                    >
                      Edit
                    </Button>
                    <DeleteButton
                      onClick={() => onDeleteBroker(b)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
