import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProfileAvatar } from '../common/ProfileAvatar';
import { ProfilePhotoUploadModal } from '../common/ProfilePhotoUploadModal';
import { Broker, BrokerStatus, BrokerDocument } from '../../types';
import {
  Briefcase,
  Building2,
  Phone,
  Mail,
  Globe,
  Award,
  IndianRupee,
  FileText,
  Upload,
  Trash2,
  Check,
  Plus,
  X,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Clock,
  Camera
} from 'lucide-react';

interface BrokerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (broker: Broker) => void;
  onDelete?: (broker: Broker) => void;
  brokerToEdit?: Broker | null;
}

const DEFAULT_OPERATING_AREAS = ['Chennai', 'Oragadam', 'Sriperumbudur', 'Guindy', 'Ambattur'];

/**
 * Enterprise Broker Management Dialog Form.
 * Comprehensive 8-section broker profile configuration.
 */
export const BrokerModal: React.FC<BrokerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  brokerToEdit
}) => {
  const [formData, setFormData] = useState<Partial<Broker>>({
    name: '',
    brokerId: '',
    companyName: '',
    phone: '',
    whatsappNumber: '',
    email: '',
    website: '',
    reraNumber: '',
    gstNumber: '',
    panNumber: '',
    yearsOfExperience: 5,
    operatingAreas: ['Chennai', 'Oragadam'],
    commissionType: 'Percentage',
    commissionRatePercent: 5.0,
    pendingCommission: 0,
    totalCommissionEarned: 0,
    lastCommissionPaid: 0,
    commissionStatus: 'Settled',
    totalDealsClosed: 0,
    activeLeads: 0,
    warehousesLeased: 0,
    occupancyGeneratedSqFt: 0,
    revenueGeneratedInr: 0,
    averageClosingTimeDays: 14,
    status: 'Active Partner',
    bankDetails: {
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      upiId: ''
    },
    documents: [],
    notes: ''
  });

  const [customArea, setCustomArea] = useState<string>('');
  const [docUploadType, setDocUploadType] = useState<BrokerDocument['type']>('PAN');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  useEffect(() => {
    if (brokerToEdit) {
      setFormData({
        ...brokerToEdit,
        operatingAreas: brokerToEdit.operatingAreas || ['Chennai', 'Oragadam'],
        bankDetails: brokerToEdit.bankDetails || {
          accountHolderName: '',
          bankName: '',
          accountNumber: '',
          ifscCode: '',
          upiId: ''
        },
        documents: brokerToEdit.documents || []
      });
    } else {
      const generatedId = `BRK-2026-00${Math.floor(Math.random() * 90) + 10}`;
      setFormData({
        name: '',
        brokerId: generatedId,
        companyName: '',
        phone: '+91 ',
        whatsappNumber: '+91 ',
        email: '',
        website: '',
        reraNumber: '',
        gstNumber: '',
        panNumber: '',
        yearsOfExperience: 3,
        operatingAreas: ['Chennai', 'Oragadam'],
        commissionType: 'Percentage',
        commissionRatePercent: 5.0,
        pendingCommission: 0,
        totalCommissionEarned: 0,
        lastCommissionPaid: 0,
        commissionStatus: 'Settled',
        totalDealsClosed: 0,
        activeLeads: 0,
        warehousesLeased: 0,
        occupancyGeneratedSqFt: 0,
        revenueGeneratedInr: 0,
        averageClosingTimeDays: 14,
        status: 'Active Partner',
        bankDetails: {
          accountHolderName: '',
          bankName: '',
          accountNumber: '',
          ifscCode: '',
          upiId: ''
        },
        documents: [],
        notes: 'Good relationship with logistics companies. Prefers industrial warehouses.'
      });
    }
  }, [brokerToEdit, isOpen]);

  const toggleOperatingArea = (area: string) => {
    const currentAreas = formData.operatingAreas || [];
    if (currentAreas.includes(area)) {
      setFormData({
        ...formData,
        operatingAreas: currentAreas.filter((a) => a !== area)
      });
    } else {
      setFormData({
        ...formData,
        operatingAreas: [...currentAreas, area]
      });
    }
  };

  const handleAddCustomArea = () => {
    if (!customArea.trim()) return;
    const currentAreas = formData.operatingAreas || [];
    if (!currentAreas.includes(customArea.trim())) {
      setFormData({
        ...formData,
        operatingAreas: [...currentAreas, customArea.trim()]
      });
    }
    setCustomArea('');
  };

  const handleSimulateDocumentUpload = (type: BrokerDocument['type']) => {
    const newDoc: BrokerDocument = {
      id: `doc-${Date.now()}`,
      type,
      fileName: `${type.replace(/\s+/g, '_')}_${formData.name || 'Broker'}.pdf`,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: '1.2 MB'
    };
    const updatedDocs = [...(formData.documents || []), newDoc];
    setFormData({ ...formData, documents: updatedDocs });
  };

  const handleRemoveDocument = (docId: string) => {
    setFormData({
      ...formData,
      documents: (formData.documents || []).filter((d) => d.id !== docId)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBroker: Broker = {
      id: brokerToEdit?.id || `br-${Date.now()}`,
      name: formData.name || 'Broker Partner',
      brokerId: formData.brokerId || `BRK-2026-${Math.floor(Math.random() * 899) + 100}`,
      companyName: formData.companyName,
      phone: formData.phone || '+91 —',
      whatsappNumber: formData.whatsappNumber,
      email: formData.email || 'broker@agency.com',
      website: formData.website,
      reraNumber: formData.reraNumber,
      gstNumber: formData.gstNumber,
      panNumber: formData.panNumber,
      yearsOfExperience: Number(formData.yearsOfExperience) || 0,
      operatingAreas: formData.operatingAreas || [],
      commissionType: formData.commissionType || 'Percentage',
      commissionRatePercent: Number(formData.commissionRatePercent) || 5.0,
      pendingCommission: Number(formData.pendingCommission) || 0,
      totalCommissionEarned: Number(formData.totalCommissionEarned) || 0,
      lastCommissionPaid: Number(formData.lastCommissionPaid) || 0,
      commissionStatus: formData.commissionStatus || 'Settled',
      totalDealsClosed: Number(formData.totalDealsClosed) || 0,
      activeLeads: Number(formData.activeLeads) || 0,
      warehousesLeased: Number(formData.warehousesLeased) || 0,
      occupancyGeneratedSqFt: Number(formData.occupancyGeneratedSqFt) || 0,
      revenueGeneratedInr: Number(formData.revenueGeneratedInr) || 0,
      averageClosingTimeDays: Number(formData.averageClosingTimeDays) || 14,
      status: formData.status as BrokerStatus || 'Active Partner',
      bankDetails: formData.bankDetails,
      documents: formData.documents || [],
      notes: formData.notes
    };

    onSave(newBroker);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={brokerToEdit ? 'Edit Broker Details' : 'Add New Real Estate Broker'}
      description="Manage broker profile, commission, documents and performance."
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
        {/* Section 1: Basic Information */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 border border-[#E5E7EB] dark:border-[#334155] rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] dark:border-[#334155]">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
              <h3 className="font-bold text-sm text-[#111827] dark:text-[#F8FAFC]">Section 1: Basic Information & Profile Photo</h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPhotoModalOpen(true)}
              icon={<Camera className="w-3.5 h-3.5" />}
            >
              {formData.photoUrl ? 'Change Photo' : 'Upload Photo'}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-2">
            <ProfileAvatar
              photoUrl={formData.photoUrl}
              name={formData.name || 'New Broker'}
              size="lg"
              editable
              onEditClick={() => setIsPhotoModalOpen(true)}
            />
            <div>
              <p className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">
                Broker Profile Image
              </p>
              <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">
                JPG, JPEG, PNG, or WebP up to 5MB. Auto-cropped into a circular profile avatar.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Broker Name *"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Rajesh Kumar"
              required
            />

            <Input
              label="Company Name"
              value={formData.companyName || ''}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="e.g. Prime Commercial Realty"
            />

            <Input
              label="Broker ID (Auto Generated)"
              value={formData.brokerId || ''}
              onChange={(e) => setFormData({ ...formData, brokerId: e.target.value })}
              placeholder="BRK-2026-001"
              disabled
            />

            <Input
              label="Phone Number *"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98201 55432"
              required
            />

            <Input
              label="WhatsApp Number"
              value={formData.whatsappNumber || ''}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              placeholder="+91 98201 55432"
            />

            <Input
              label="Email Address *"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="broker@realtyagency.com"
              required
            />

            <div className="md:col-span-3">
              <Input
                label="Website (Optional)"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.realtyagency.com"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Business Information */}
        <div className="p-4 bg-slate-50/80 border border-[#E5E7EB] rounded-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
            <Building2 className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-bold text-sm text-[#111827]">Section 2: Business Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="RERA Registration Number"
              value={formData.reraNumber || ''}
              onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
              placeholder="TN/01/Agent/2024/00812"
            />

            <Input
              label="GST Number"
              value={formData.gstNumber || ''}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
              placeholder="33AAACB1234F1Z9"
            />

            <Input
              label="PAN Number"
              value={formData.panNumber || ''}
              onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
              placeholder="ABCDE1234F"
            />

            <Input
              label="Years of Experience"
              type="number"
              value={formData.yearsOfExperience ?? 5}
              onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
              placeholder="8"
            />
          </div>

          {/* Operating Areas (Multi Select) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-700">
              Operating Areas (Multi Select)
            </label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_OPERATING_AREAS.map((area) => {
                const isSelected = (formData.operatingAreas || []).includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleOperatingArea(area)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#2563EB] text-white shadow-2xs'
                        : 'bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] text-gray-700 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {area}
                  </button>
                );
              })}
            </div>

            {/* Custom Area addition */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customArea}
                onChange={(e) => setCustomArea(e.target.value)}
                placeholder="Add another area (e.g. Sriperumbudur Industrial Corridor)..."
                className="text-xs px-3 py-1.5 border border-[#E5E7EB] dark:border-[#334155] rounded-lg bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:border-[#2563EB] flex-1"
              />
              <Button type="button" size="sm" variant="outline" onClick={handleAddCustomArea}>
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>
          </div>
        </div>

        {/* Section 3: Commission Details */}
        <div className="p-4 bg-slate-50/80 border border-[#E5E7EB] rounded-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
            <IndianRupee className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-bold text-sm text-[#111827]">Section 3: Commission Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Commission Type"
              value={formData.commissionType || 'Percentage'}
              onChange={(e) => setFormData({ ...formData, commissionType: e.target.value as any })}
              options={[
                { value: 'Percentage', label: 'Percentage (%)' },
                { value: 'Fixed Amount', label: 'Fixed Amount (₹)' }
              ]}
            />

            <Input
              label={formData.commissionType === 'Fixed Amount' ? 'Commission Amount (₹)' : 'Commission Rate (%)'}
              type="number"
              step="0.1"
              value={formData.commissionRatePercent ?? 5.0}
              onChange={(e) => setFormData({ ...formData, commissionRatePercent: Number(e.target.value) })}
            />

            <Input
              label="Pending Commission (₹)"
              type="number"
              value={formData.pendingCommission ?? 0}
              onChange={(e) => setFormData({ ...formData, pendingCommission: Number(e.target.value) })}
            />

            <Input
              label="Total Commission Earned (₹)"
              type="number"
              value={formData.totalCommissionEarned ?? 0}
              onChange={(e) => setFormData({ ...formData, totalCommissionEarned: Number(e.target.value) })}
            />

            <Input
              label="Last Commission Paid (₹)"
              type="number"
              value={formData.lastCommissionPaid ?? 0}
              onChange={(e) => setFormData({ ...formData, lastCommissionPaid: Number(e.target.value) })}
            />

            <Select
              label="Commission Status"
              value={formData.commissionStatus || 'Settled'}
              onChange={(e) => setFormData({ ...formData, commissionStatus: e.target.value as any })}
              options={[
                { value: 'Settled', label: 'Settled' },
                { value: 'Pending Payout', label: 'Pending Payout' },
                { value: 'Partial', label: 'Partial' }
              ]}
            />
          </div>
        </div>

        {/* Section 4: Performance */}
        <div className="p-4 bg-slate-50/80 border border-[#E5E7EB] rounded-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
            <Award className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-bold text-sm text-[#111827]">Section 4: Performance</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Input
              label="Total Deals Closed"
              type="number"
              value={formData.totalDealsClosed ?? 0}
              onChange={(e) => setFormData({ ...formData, totalDealsClosed: Number(e.target.value) })}
            />

            <Input
              label="Active Leads"
              type="number"
              value={formData.activeLeads ?? 0}
              onChange={(e) => setFormData({ ...formData, activeLeads: Number(e.target.value) })}
            />

            <Input
              label="Warehouses Leased"
              type="number"
              value={formData.warehousesLeased ?? 0}
              onChange={(e) => setFormData({ ...formData, warehousesLeased: Number(e.target.value) })}
            />

            <Input
              label="Occupancy Generated (Sq.Ft)"
              type="number"
              value={formData.occupancyGeneratedSqFt ?? 0}
              onChange={(e) => setFormData({ ...formData, occupancyGeneratedSqFt: Number(e.target.value) })}
            />

            <Input
              label="Revenue Generated (₹)"
              type="number"
              value={formData.revenueGeneratedInr ?? 0}
              onChange={(e) => setFormData({ ...formData, revenueGeneratedInr: Number(e.target.value) })}
            />

            <Input
              label="Average Closing Time (Days)"
              type="number"
              value={formData.averageClosingTimeDays ?? 14}
              onChange={(e) => setFormData({ ...formData, averageClosingTimeDays: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Section 5: Status */}
        <div className="p-4 bg-slate-50/80 border border-[#E5E7EB] rounded-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
            <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-bold text-sm text-[#111827]">Section 5: Status</h3>
          </div>

          <Select
            label="Broker Partnership Status"
            value={formData.status || 'Active Partner'}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as BrokerStatus })}
            options={[
              { value: 'Active Partner', label: 'Active Partner' },
              { value: 'Preferred Broker', label: 'Preferred Broker' },
              { value: 'Inactive', label: 'Inactive' },
              { value: 'Suspended', label: 'Suspended' },
              { value: 'Blacklisted', label: 'Blacklisted' }
            ]}
          />
        </div>

        {/* Section 6: Bank Details */}
        <div className="p-4 bg-slate-50/80 border border-[#E5E7EB] rounded-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
            <CreditCard className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-bold text-sm text-[#111827]">Section 6: Bank Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Account Holder Name"
              value={formData.bankDetails?.accountHolderName || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bankDetails: { ...(formData.bankDetails || {}), accountHolderName: e.target.value }
                })
              }
              placeholder="Prime Commercial Realty Pvt Ltd"
            />

            <Input
              label="Bank Name"
              value={formData.bankDetails?.bankName || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bankDetails: { ...(formData.bankDetails || {}), bankName: e.target.value }
                })
              }
              placeholder="HDFC Bank"
            />

            <Input
              label="Account Number"
              value={formData.bankDetails?.accountNumber || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bankDetails: { ...(formData.bankDetails || {}), accountNumber: e.target.value }
                })
              }
              placeholder="50200044192001"
            />

            <Input
              label="IFSC Code"
              value={formData.bankDetails?.ifscCode || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bankDetails: { ...(formData.bankDetails || {}), ifscCode: e.target.value }
                })
              }
              placeholder="HDFC0000240"
            />

            <Input
              label="UPI ID"
              value={formData.bankDetails?.upiId || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bankDetails: { ...(formData.bankDetails || {}), upiId: e.target.value }
                })
              }
              placeholder="broker@hdfcbank"
            />
          </div>
        </div>

        {/* Section 7: Documents */}
        <div className="p-4 bg-slate-50/80 border border-[#E5E7EB] rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2563EB]" />
              <h3 className="font-bold text-sm text-[#111827]">Section 7: Documents</h3>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={docUploadType}
                onChange={(e) => setDocUploadType(e.target.value as any)}
                options={[
                  { value: 'PAN', label: 'Upload PAN' },
                  { value: 'Aadhaar', label: 'Upload Aadhaar' },
                  { value: 'Agreement', label: 'Upload Agreement' },
                  { value: 'GST Certificate', label: 'Upload GST Certificate' },
                  { value: 'Broker License', label: 'Upload Broker License' }
                ]}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={<Upload className="w-3.5 h-3.5" />}
                onClick={() => handleSimulateDocumentUpload(docUploadType)}
              >
                Upload File
              </Button>
            </div>
          </div>

          {/* Display Uploaded Files */}
          {(formData.documents || []).length === 0 ? (
            <p className="text-xs text-gray-400 italic py-2 text-center">
              No verification documents attached yet. Click 'Upload File' to simulate uploading PAN, GST or License.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(formData.documents || []).map((doc) => (
                <div
                  key={doc.id}
                  className="p-2.5 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-lg flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="w-4 h-4 text-[#2563EB] dark:text-blue-400 shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-gray-800 dark:text-[#F8FAFC] truncate">{doc.fileName}</p>
                      <span className="text-[10px] text-gray-400 dark:text-[#94A3B8] font-mono">
                        {doc.type} • {doc.uploadDate}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveDocument(doc.id)}
                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors"
                    title="Remove document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 8: Notes */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 border border-[#E5E7EB] dark:border-[#334155] rounded-xl space-y-2">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB] dark:border-[#334155]">
            <FileText className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
            <h3 className="font-bold text-sm text-[#111827] dark:text-[#F8FAFC]">Section 8: Notes</h3>
          </div>

          <textarea
            rows={4}
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Good relationship with logistics companies. Prefers industrial warehouses."
            className="w-full p-3 text-xs border border-[#E5E7EB] dark:border-[#334155] rounded-lg bg-white dark:bg-[#1E293B] focus:outline-none focus:border-[#2563EB] text-[#111827] dark:text-[#F8FAFC]"
          />
        </div>

        {/* Bottom Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
          <div>
            {brokerToEdit && onDelete && (
              <Button
                type="button"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => {
                  onDelete(brokerToEdit);
                  onClose();
                }}
              >
                Delete
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Broker
            </Button>
          </div>
        </div>
      </form>

      {/* Profile Photo Management Modal */}
      <ProfilePhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        entityName={formData.name || 'Broker'}
        entityType="Broker"
        currentPhotoUrl={formData.photoUrl}
        onSavePhoto={(newPhotoUrl) => {
          setFormData({ ...formData, photoUrl: newPhotoUrl || undefined });
        }}
      />
    </Modal>
  );
};
