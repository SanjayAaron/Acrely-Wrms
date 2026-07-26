import React from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DeleteButton } from '../common/DeleteButton';
import { Warehouse, DocumentItem } from '../../types';
import { Building2, User, Zap, Maximize, ShieldCheck, Edit, FileText, MapPin } from 'lucide-react';

/**
 * Modal to view detailed specifications and full address of a Warehouse
 */

interface WarehouseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse: Warehouse | null;
  onEdit: (warehouse: Warehouse) => void;
  documents?: DocumentItem[];
  onDeleteDocument?: (doc: DocumentItem) => void;
}

export const WarehouseDetailModal: React.FC<WarehouseDetailModalProps> = ({
  isOpen,
  onClose,
  warehouse,
  onEdit,
  documents = [],
  onDeleteDocument
}) => {
  if (!warehouse) return null;

  const getStatusBadge = (status: Warehouse['status']) => {
    switch (status) {
      case 'Occupied':
        return <Badge variant="success">Occupied</Badge>;
      case 'Vacant':
        return <Badge variant="warning">Vacant</Badge>;
      case 'Maintenance':
        return <Badge variant="danger">Under Maintenance</Badge>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={warehouse.name}
      description="Property Overview & Complete Specifications"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Status Header Bar */}
        <div className="p-4 bg-slate-50 border border-[#E5E7EB] rounded-[12px] flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold shrink-0 mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#111827]">{warehouse.name}</span>
                {getStatusBadge(warehouse.status)}
              </div>
              
              {/* Full Warehouse Address Display */}
              <div className="mt-1.5 flex items-start gap-1.5 text-xs text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-[#2563EB] mt-0.5 shrink-0" />
                <div className="whitespace-pre-line font-medium leading-relaxed text-[#374151]">
                  {warehouse.address || warehouse.locationZone || 'Address not provided'}
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500">Monthly Rental Yield</p>
            <p className="text-lg font-bold text-[#2563EB]">
              ₹{warehouse.monthlyRent.toLocaleString('en-IN')} <span className="text-xs font-normal text-gray-500">/ mo</span>
            </p>
          </div>
        </div>

        {/* Specs Grid */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Technical & Spatial Specifications
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white border border-[#E5E7EB] rounded-[10px]">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Maximize className="w-3.5 h-3.5 text-blue-600" />
                <span>Total Floor Area</span>
              </div>
              <p className="text-sm font-semibold text-[#111827]">
                {warehouse.areaSqFt.toLocaleString('en-IN')} sq ft
              </p>
            </div>

            <div className="p-3 bg-white border border-[#E5E7EB] rounded-[10px]">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Power Grid</span>
              </div>
              <p className="text-sm font-semibold text-[#111827]">{warehouse.powerCapacity}</p>
            </div>

            <div className="p-3 bg-white border border-[#E5E7EB] rounded-[10px]">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Building2 className="w-3.5 h-3.5 text-green-600" />
                <span>Clear Height</span>
              </div>
              <p className="text-sm font-semibold text-[#111827]">{warehouse.ceilingHeightFt} Ft</p>
            </div>

            <div className="p-3 bg-white border border-[#E5E7EB] rounded-[10px]">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Security Deposit</span>
              </div>
              <p className="text-sm font-semibold text-[#111827]">
                ₹{warehouse.securityDeposit.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Occupancy / Tenant Section */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Tenant & Tenancy Status
          </h4>
          {warehouse.status === 'Occupied' ? (
            <div className="p-4 border border-[#E5E7EB] bg-blue-50/30 rounded-[12px] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-sm font-semibold text-[#111827]">
                    {warehouse.tenantName || 'Tenant 1'}
                  </span>
                </div>
                <Badge variant="blue">Active Tenancy Agreement</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#E5E7EB]/80 text-xs">
                <div>
                  <span className="text-gray-500 block">Lease Start</span>
                  <span className="font-medium text-[#111827]">{warehouse.leaseStart || '01 Jan 2025'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Lease Expiry</span>
                  <span className="font-medium text-[#111827]">{warehouse.leaseEnd || '31 Dec 2026'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border border-dashed border-[#E5E7EB] bg-slate-50 rounded-[12px] text-center">
              <p className="text-xs text-gray-600 mb-2">
                This warehouse is currently vacant and ready for client tenant assignment.
              </p>
            </div>
          )}
        </div>

        {/* Property Notes */}
        {warehouse.notes && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Property Overview & Notes
            </h4>
            <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-[10px] text-xs text-gray-700">
              {warehouse.notes}
            </div>
          </div>
        )}

        {/* Associated Property Documents */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Associated Property & Lease Documents
          </h4>
          {documents.filter(d => !d.associatedEntity || d.associatedEntity.includes(warehouse.name)).length > 0 ? (
            <div className="space-y-2">
              {documents.filter(d => !d.associatedEntity || d.associatedEntity.includes(warehouse.name)).map((doc) => (
                <div key={doc.id} className="p-3 bg-white border border-[#E5E7EB] rounded-[10px] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#2563EB]" />
                    <div>
                      <p className="text-xs font-semibold text-[#111827]">{doc.name}</p>
                      <p className="text-[10px] text-gray-500">{doc.category} • {doc.fileSize} • Uploaded {doc.uploadedDate}</p>
                    </div>
                  </div>
                  {onDeleteDocument && (
                    <DeleteButton onClick={() => onDeleteDocument(doc)} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-[10px] text-xs text-gray-500 text-center">
              No documents linked to this warehouse.
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-[#E5E7EB]">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="primary"
              icon={<Edit className="w-3.5 h-3.5" />}
              onClick={() => {
                onClose();
                onEdit(warehouse);
              }}
            >
              Edit Specs
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
