import React, { useState } from 'react';
import { Broker } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProfileAvatar } from '../common/ProfileAvatar';
import { ProfilePhotoUploadModal } from '../common/ProfilePhotoUploadModal';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Phone,
  Mail,
  Globe,
  Award,
  IndianRupee,
  FileText,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Download,
  ExternalLink,
  MessageSquare,
  Camera
} from 'lucide-react';

interface BrokerDetailViewProps {
  broker: Broker;
  onBack: () => void;
  onEdit: (broker: Broker) => void;
  onDelete: (broker: Broker) => void;
  onUpdateBroker?: (updatedBroker: Broker) => void;
  onShowToast?: (message: string, type?: 'success' | 'error') => void;
}

/**
 * Dedicated Enterprise Broker Detail Page View (`/brokers/[id]`).
 * Renders Broker Photo, Profile, Performance, Commission History, Deals,
 * Activity Timeline, Uploaded Documents, Payments, and Notes.
 */
export const BrokerDetailView: React.FC<BrokerDetailViewProps> = ({
  broker,
  onBack,
  onEdit,
  onDelete,
  onUpdateBroker,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'deals' | 'commission' | 'documents' | 'timeline'>('overview');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const formattedRevenue = (broker.revenueGeneratedInr || 0).toLocaleString('en-IN');
  const formattedEarned = (broker.totalCommissionEarned || 0).toLocaleString('en-IN');
  const formattedPending = (broker.pendingCommission || 0).toLocaleString('en-IN');

  const handleSavePhoto = (newPhotoUrl: string | null) => {
    const updated = {
      ...broker,
      photoUrl: newPhotoUrl || undefined
    };
    if (onUpdateBroker) {
      onUpdateBroker(updated);
    } else {
      onEdit(updated);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB] dark:border-[#334155]">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Brokers List
          </Button>
          <div>
            <span className="text-[10px] font-mono text-gray-400 dark:text-[#64748B] uppercase tracking-wider block">
              Broker Management / {broker.brokerId || broker.id}
            </span>
            <h1 className="text-xl font-black text-[#111827] dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              {broker.name}
              {broker.companyName && (
                <span className="text-xs font-medium text-gray-500 dark:text-[#94A3B8]">({broker.companyName})</span>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Camera className="w-4 h-4" />}
            onClick={() => setIsPhotoModalOpen(true)}
          >
            Edit Photo
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => onEdit(broker)}
          >
            Edit Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => onDelete(broker)}
          >
            Move to Bin
          </Button>
        </div>
      </div>

      {/* Hero Profile Header Card */}
      <Card className="border-[#2563EB]/20 bg-gradient-to-r from-blue-50/40 via-white to-slate-50 dark:from-blue-950/40 dark:via-[#1E293B] dark:to-[#0F172A]">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Broker Photo & Core Info */}
            <div className="flex items-start gap-4">
              <ProfileAvatar
                photoUrl={broker.photoUrl}
                name={broker.name}
                size="xl"
                editable
                onEditClick={() => setIsPhotoModalOpen(true)}
                statusColor={
                  broker.status === 'Active Partner' || broker.status === 'Preferred Broker'
                    ? 'bg-emerald-500'
                    : 'bg-gray-400'
                }
              />

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-[#111827] dark:text-[#F8FAFC]">{broker.name}</h2>
                  <Badge
                    variant={
                      broker.status === 'Active Partner' || broker.status === 'Preferred Broker'
                        ? 'success'
                        : 'neutral'
                    }
                  >
                    {broker.status}
                  </Badge>
                  {broker.commissionStatus && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                      Commission: {broker.commissionStatus}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 dark:text-[#CBD5E1] font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                  {broker.companyName || 'Independent Real Estate Agency'}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-[#94A3B8] pt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400 dark:text-[#64748B]" />
                    <a href={`tel:${broker.phone}`} className="hover:text-[#2563EB] dark:hover:text-blue-400 font-mono">
                      {broker.phone}
                    </a>
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400 dark:text-[#64748B]" />
                    <a href={`mailto:${broker.email}`} className="hover:text-[#2563EB] dark:hover:text-blue-400">
                      {broker.email}
                    </a>
                  </span>
                  {broker.website && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-gray-400 dark:text-[#64748B]" />
                      <a
                        href={broker.website}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-[#2563EB] dark:hover:text-blue-400 flex items-center gap-0.5"
                      >
                        Website <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Commission Stats Header Box */}
            <div className="w-full md:w-auto p-4 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-2xl shadow-2xs space-y-2">
              <div className="text-xs text-gray-500 dark:text-[#94A3B8] font-medium">Agreed Commission Structure</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#2563EB] dark:text-blue-400 font-mono">
                  {broker.commissionType === 'Fixed Amount'
                    ? `₹${broker.commissionRatePercent.toLocaleString('en-IN')}`
                    : `${broker.commissionRatePercent}%`}
                </span>
                <span className="text-xs text-gray-500 dark:text-[#94A3B8] font-medium">
                  ({broker.commissionType || 'Percentage'})
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-xs pt-1 border-t border-[#E5E7EB] dark:border-[#334155]">
                <span className="text-gray-500 dark:text-[#94A3B8]">Pending Dues:</span>
                <span className="font-bold text-[#F59E0B] font-mono">₹{formattedPending}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card>
          <CardContent className="p-3.5 space-y-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-[#64748B] uppercase tracking-wider block">
              Total Deals
            </span>
            <p className="text-lg font-black text-[#111827] dark:text-[#F8FAFC] flex items-center gap-1.5 font-mono">
              <Award className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
              {broker.totalDealsClosed}
            </p>
            <span className="text-[10px] text-gray-500 dark:text-[#94A3B8]">Successful leases</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3.5 space-y-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-[#64748B] uppercase tracking-wider block">
              Active Leads
            </span>
            <p className="text-lg font-black text-[#111827] dark:text-[#F8FAFC] flex items-center gap-1.5 font-mono">
              <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {broker.activeLeads || 0}
            </p>
            <span className="text-[10px] text-gray-500 dark:text-[#94A3B8]">In CRM pipeline</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3.5 space-y-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-[#64748B] uppercase tracking-wider block">
              Warehouses Leased
            </span>
            <p className="text-lg font-black text-[#111827] dark:text-[#F8FAFC] flex items-center gap-1.5 font-mono">
              <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              {broker.warehousesLeased || 0}
            </p>
            <span className="text-[10px] text-gray-500 dark:text-[#94A3B8]">Properties occupied</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3.5 space-y-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-[#64748B] uppercase tracking-wider block">
              Occupancy Generated
            </span>
            <p className="text-lg font-black text-[#111827] dark:text-[#F8FAFC] flex items-center gap-1 font-mono">
              {(broker.occupancyGeneratedSqFt || 0).toLocaleString('en-IN')}
              <span className="text-[10px] text-gray-400 dark:text-[#64748B]">Sq.Ft</span>
            </p>
            <span className="text-[10px] text-gray-500 dark:text-[#94A3B8]">Space filled</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3.5 space-y-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-[#64748B] uppercase tracking-wider block">
              Revenue Generated
            </span>
            <p className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">₹{formattedRevenue}</p>
            <span className="text-[10px] text-gray-500 dark:text-[#94A3B8]">Total rent generated</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3.5 space-y-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-[#64748B] uppercase tracking-wider block">
              Avg Closing Time
            </span>
            <p className="text-lg font-black text-[#111827] dark:text-[#F8FAFC] flex items-center gap-1 font-mono">
              <Clock className="w-4 h-4 text-amber-500" />
              {broker.averageClosingTimeDays || 14} <span className="text-xs">Days</span>
            </p>
            <span className="text-[10px] text-gray-500 dark:text-[#94A3B8]">From inquiry to deal</span>
          </CardContent>
        </Card>
      </div>

      {/* View Tabs */}
      <div className="flex border-b border-[#E5E7EB] dark:border-[#334155] gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-[#2563EB] text-[#2563EB] dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-gray-500 dark:text-[#94A3B8] hover:text-gray-800 dark:hover:text-[#F8FAFC]'
          }`}
        >
          Profile & Business Details
        </button>
        <button
          onClick={() => setActiveTab('deals')}
          className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'deals'
              ? 'border-[#2563EB] text-[#2563EB] dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-gray-500 dark:text-[#94A3B8] hover:text-gray-800 dark:hover:text-[#F8FAFC]'
          }`}
        >
          Closed Deals ({broker.deals?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('commission')}
          className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'commission'
              ? 'border-[#2563EB] text-[#2563EB] dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-gray-500 dark:text-[#94A3B8] hover:text-gray-800 dark:hover:text-[#F8FAFC]'
          }`}
        >
          Commission & Payments
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'documents'
              ? 'border-[#2563EB] text-[#2563EB] dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-gray-500 dark:text-[#94A3B8] hover:text-gray-800 dark:hover:text-[#F8FAFC]'
          }`}
        >
          Uploaded Documents ({broker.documents?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'timeline'
              ? 'border-[#2563EB] text-[#2563EB] dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-gray-500 dark:text-[#94A3B8] hover:text-gray-800 dark:hover:text-[#F8FAFC]'
          }`}
        >
          Activity Timeline
        </button>
      </div>

      {/* Tab 1: Profile & Business Details */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business & Registration Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#111827] dark:text-[#F8FAFC]">
                <ShieldCheck className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                Business & Tax Identifiers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#E5E7EB] dark:border-[#334155]">
                <span className="text-gray-500 dark:text-[#94A3B8]">RERA Registration No:</span>
                <span className="font-mono font-bold text-[#111827] dark:text-[#F8FAFC]">
                  {broker.reraNumber || 'TN/01/Agent/2024/00812'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E7EB] dark:border-[#334155]">
                <span className="text-gray-500 dark:text-[#94A3B8]">GST Number:</span>
                <span className="font-mono font-bold text-[#111827] dark:text-[#F8FAFC]">
                  {broker.gstNumber || '33AAACB1234F1Z9'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E7EB] dark:border-[#334155]">
                <span className="text-gray-500 dark:text-[#94A3B8]">PAN Number:</span>
                <span className="font-mono font-bold text-[#111827] dark:text-[#F8FAFC]">
                  {broker.panNumber || 'ABCDE1234F'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E7EB] dark:border-[#334155]">
                <span className="text-gray-500 dark:text-[#94A3B8]">Years of Experience:</span>
                <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">
                  {broker.yearsOfExperience || 8} Years
                </span>
              </div>

              {/* Operating Areas Pills */}
              <div className="pt-2">
                <span className="text-gray-500 dark:text-[#94A3B8] block mb-1.5">Operating Areas / Hubs:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(broker.operatingAreas || ['Chennai', 'Oragadam', 'Sriperumbudur']).map((area) => (
                    <span
                      key={area}
                      className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-300 border border-blue-200 dark:border-blue-900 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#111827] dark:text-[#F8FAFC]">
                <CreditCard className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                Bank & Settlement Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#E5E7EB] dark:border-[#334155]">
                <span className="text-gray-500 dark:text-[#94A3B8]">Account Holder:</span>
                <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">
                  {broker.bankDetails?.accountHolderName || broker.name}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E7EB] dark:border-[#334155]">
                <span className="text-gray-500 dark:text-[#94A3B8]">Bank Name:</span>
                <span className="font-medium text-[#111827] dark:text-[#F8FAFC]">
                  {broker.bankDetails?.bankName || 'HDFC Bank'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E7EB] dark:border-[#334155]">
                <span className="text-gray-500 dark:text-[#94A3B8]">Account Number:</span>
                <span className="font-mono font-bold text-[#111827] dark:text-[#F8FAFC]">
                  {broker.bankDetails?.accountNumber || '50200044192001'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E7EB] dark:border-[#334155]">
                <span className="text-gray-500 dark:text-[#94A3B8]">IFSC Code:</span>
                <span className="font-mono font-bold text-[#111827] dark:text-[#F8FAFC]">
                  {broker.bankDetails?.ifscCode || 'HDFC0000240'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500 dark:text-[#94A3B8]">UPI Handle:</span>
                <span className="font-mono font-bold text-[#2563EB] dark:text-blue-400">
                  {broker.bankDetails?.upiId || 'primecommercial@hdfcbank'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Owner Notes Card */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#111827] dark:text-[#F8FAFC]">
                <MessageSquare className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                Owner & Internal Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-900 dark:text-amber-200 font-medium">
                {broker.notes ||
                  'Good relationship with logistics companies. Prefers industrial warehouses with heavy power backup.'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Deals */}
      {activeTab === 'deals' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">Closed & Active Warehouse Lease Deals</CardTitle>
          </CardHeader>
          <CardContent>
            {(!broker.deals || broker.deals.length === 0) ? (
              <p className="text-xs text-gray-500 dark:text-[#94A3B8] py-4 text-center">No deals recorded for this broker yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800/60 text-gray-600 dark:text-[#CBD5E1] uppercase text-[10px] tracking-wider border-b border-[#E5E7EB] dark:border-[#334155]">
                    <tr>
                      <th className="p-3">Tenant Name</th>
                      <th className="p-3">Leased Warehouse</th>
                      <th className="p-3">Lease Start</th>
                      <th className="p-3 text-right">Monthly Rent (₹)</th>
                      <th className="p-3 text-right">Commission Earned (₹)</th>
                      <th className="p-3 text-center">Deal Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
                    {broker.deals.map((deal) => (
                      <tr key={deal.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-3 font-bold text-[#111827] dark:text-[#F8FAFC]">{deal.tenantName}</td>
                        <td className="p-3 text-gray-700 dark:text-[#CBD5E1]">{deal.warehouseName}</td>
                        <td className="p-3 font-mono text-gray-600 dark:text-[#94A3B8]">{deal.leaseStartDate}</td>
                        <td className="p-3 text-right font-mono font-medium text-[#111827] dark:text-[#F8FAFC]">
                          ₹{deal.monthlyRent.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-[#2563EB] dark:text-blue-400">
                          ₹{deal.commissionAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant={deal.status === 'Active' ? 'success' : 'neutral'}>
                            {deal.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Commission & Payments */}
      {activeTab === 'commission' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block">Total Commission Earned</span>
              <span className="text-xl font-black text-emerald-900 dark:text-emerald-200 font-mono">₹{formattedEarned}</span>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl">
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase block">Pending Payout Dues</span>
              <span className="text-xl font-black text-amber-900 dark:text-amber-200 font-mono">₹{formattedPending}</span>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl">
              <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase block">Last Paid Amount</span>
              <span className="text-xl font-black text-[#2563EB] dark:text-blue-400 font-mono">
                ₹{(broker.lastCommissionPaid || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-[#94A3B8] block mt-0.5 font-mono">
                Paid on: {broker.lastCommissionPaidDate || '2026-06-15'}
              </span>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">Payout & Settlement History</CardTitle>
            </CardHeader>
            <CardContent>
              {(!broker.payouts || broker.payouts.length === 0) ? (
                <p className="text-xs text-gray-500 dark:text-[#94A3B8] py-4 text-center">No commission payout history logged.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800/60 text-gray-600 dark:text-[#CBD5E1] uppercase text-[10px] tracking-wider border-b border-[#E5E7EB] dark:border-[#334155]">
                      <tr>
                        <th className="p-3">Payout Date</th>
                        <th className="p-3">Associated Warehouse</th>
                        <th className="p-3">Payment Method</th>
                        <th className="p-3">Transaction Reference</th>
                        <th className="p-3 text-right">Amount Paid (₹)</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
                      {broker.payouts.map((po) => (
                        <tr key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3 font-mono font-medium text-gray-700 dark:text-[#CBD5E1]">{po.date}</td>
                          <td className="p-3 text-gray-800 dark:text-[#F8FAFC] font-semibold">{po.dealWarehouse}</td>
                          <td className="p-3 text-gray-600 dark:text-[#CBD5E1]">{po.paymentMethod}</td>
                          <td className="p-3 font-mono text-[#2563EB] dark:text-blue-400">{po.referenceNo}</td>
                          <td className="p-3 text-right font-mono font-bold text-[#111827] dark:text-[#F8FAFC]">
                            ₹{po.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 text-center">
                            <Badge variant={po.status === 'Paid' ? 'success' : 'warning'}>
                              {po.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 4: Uploaded Documents */}
      {activeTab === 'documents' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">Verification Documents & KYC Files</CardTitle>
          </CardHeader>
          <CardContent>
            {(!broker.documents || broker.documents.length === 0) ? (
              <p className="text-xs text-gray-500 dark:text-[#94A3B8] py-4 text-center">No files uploaded for this broker.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {broker.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-[#E5E7EB] dark:border-[#334155] rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="truncate text-xs">
                        <p className="font-bold text-[#111827] dark:text-[#F8FAFC] truncate">{doc.fileName}</p>
                        <p className="text-[10px] text-gray-500 dark:text-[#94A3B8] font-mono">
                          {doc.type} • {doc.fileSize || '1.0 MB'}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-[#64748B]">Uploaded {doc.uploadDate}</p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Download className="w-3.5 h-3.5" />}
                      onClick={() => alert(`Downloading ${doc.fileName}...`)}
                      title="Download document"
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab 5: Activity Timeline */}
      {activeTab === 'timeline' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Activity & Interaction Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E7EB] dark:before:bg-[#334155]">
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-[#2563EB] ring-4 ring-blue-100 dark:ring-blue-900/40" />
                <p className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">Commission Payout Processed</p>
                <p className="text-[11px] text-gray-500 dark:text-[#94A3B8] font-mono">2026-06-15 at 02:30 PM</p>
                <p className="text-xs text-gray-600 dark:text-[#CBD5E1] mt-1">
                  Settled ₹45,000 for Warehouse 1 deal via Bank Transfer (TXN-99881122).
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-900/40" />
                <p className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">New Warehouse Lease Deal Closed</p>
                <p className="text-[11px] text-gray-500 dark:text-[#94A3B8] font-mono">2025-01-01 at 11:00 AM</p>
                <p className="text-xs text-gray-600 dark:text-[#CBD5E1] mt-1">
                  Brought Tenant 1 for Warehouse 1 (₹150,000/mo). Commission generated: ₹45,000.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-900/40" />
                <p className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">KYC Documents Audited</p>
                <p className="text-[11px] text-gray-500 dark:text-[#94A3B8] font-mono">2025-01-12 at 04:15 PM</p>
                <p className="text-xs text-gray-600 dark:text-[#CBD5E1] mt-1">
                  Verified PAN, GST, and RERA Broker License. Status upgraded to Active Partner.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Photo Upload / Edit Modal */}
      <ProfilePhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        entityName={broker.name}
        entityType="Broker"
        currentPhotoUrl={broker.photoUrl}
        onSavePhoto={handleSavePhoto}
        onShowToast={onShowToast}
      />
    </div>
  );
};
