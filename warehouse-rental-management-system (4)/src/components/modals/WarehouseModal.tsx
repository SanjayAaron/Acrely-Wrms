import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Warehouse } from '../../types';

/**
 * Modal to Add or Edit a Warehouse
 * Includes form fields for property name, rent, area, power, height, address, and notes.
 */

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (warehouse: Warehouse) => void;
  warehouseToEdit?: Warehouse | null;
}

export const WarehouseModal: React.FC<WarehouseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  warehouseToEdit
}) => {
  // Form state to hold warehouse property fields
  const [formData, setFormData] = useState<Partial<Warehouse>>({
    name: '',
    status: 'Vacant',
    monthlyRent: 0,
    securityDeposit: 0,
    areaSqFt: 10000,
    address: '',
    powerCapacity: '50 kVA',
    ceilingHeightFt: 24,
    leaseEnd: '',
    notes: ''
  });

  // Populate form fields when editing an existing warehouse or resetting for a new one
  useEffect(() => {
    if (warehouseToEdit) {
      setFormData(warehouseToEdit);
    } else {
      setFormData({
        name: `Warehouse ${Math.floor(Math.random() * 10) + 5}`,
        status: 'Vacant',
        monthlyRent: 150000,
        securityDeposit: 450000,
        areaSqFt: 12000,
        address: `No. 24, SIPCOT Industrial Park,\nOragadam,\nChennai - 602105`,
        powerCapacity: '50 kVA',
        ceilingHeightFt: 25,
        leaseEnd: '',
        notes: ''
      });
    }
  }, [warehouseToEdit, isOpen]);

  // Handle form submission to save changes
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isOccupied = formData.status === 'Occupied';
    const newWarehouse: Warehouse = {
      id: warehouseToEdit?.id || `wh-${Date.now()}`,
      name: formData.name || 'Warehouse',
      status: formData.status || 'Vacant',
      tenantId: isOccupied ? formData.tenantId : undefined,
      tenantName: isOccupied ? formData.tenantName : undefined,
      monthlyRent: Number(formData.monthlyRent) || 0,
      securityDeposit: Number(formData.securityDeposit) || 0,
      areaSqFt: Number(formData.areaSqFt) || 10000,
      address: formData.address || '',
      powerCapacity: formData.powerCapacity || '50 kVA',
      ceilingHeightFt: Number(formData.ceilingHeightFt) || 24,
      leaseStart: isOccupied ? formData.leaseStart : undefined,
      leaseEnd: isOccupied ? formData.leaseEnd : undefined,
      notes: formData.notes
    };
    onSave(newWarehouse);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={warehouseToEdit ? 'Edit Warehouse Details' : 'Add New Warehouse'}
      description="Enter structural and rental specifications for your warehouse property."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Top 2-Column Grid for basic specifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Warehouse Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Warehouse 5"
            required
          />

          <Select
            label="Status"
            value={formData.status || 'Vacant'}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as Warehouse['status'] })
            }
            options={[
              { value: 'Vacant', label: 'Vacant' },
              { value: 'Occupied', label: 'Occupied' },
              { value: 'Maintenance', label: 'Under Maintenance' }
            ]}
          />

          <Input
            label="Monthly Rent (₹)"
            type="number"
            value={formData.monthlyRent ?? 0}
            onChange={(e) => setFormData({ ...formData, monthlyRent: Number(e.target.value) })}
            placeholder="e.g. 150000"
            required
          />

          <Input
            label="Security Deposit (₹)"
            type="number"
            value={formData.securityDeposit ?? 0}
            onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
            placeholder="e.g. 450000"
          />

          <Input
            label="Area (Sq Ft)"
            type="number"
            value={formData.areaSqFt ?? 10000}
            onChange={(e) => setFormData({ ...formData, areaSqFt: Number(e.target.value) })}
            placeholder="e.g. 12500"
          />

          <Input
            label="Power Capacity"
            value={formData.powerCapacity || ''}
            onChange={(e) => setFormData({ ...formData, powerCapacity: e.target.value })}
            placeholder="e.g. 75 kVA"
          />

          <Input
            label="Ceiling Height (Ft)"
            type="number"
            value={formData.ceilingHeightFt ?? 24}
            onChange={(e) => setFormData({ ...formData, ceilingHeightFt: Number(e.target.value) })}
            placeholder="e.g. 28"
          />
        </div>

        {/* Warehouse Address Field - Positioned below Ceiling Height (Ft) and above Lease End Date */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Warehouse Address
          </label>
          <textarea
            rows={3}
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder={`No. 24, SIPCOT Industrial Park,
Oragadam,
Chennai - 602105`}
            className="w-full bg-white border border-[#E5E7EB] text-[#111827] text-sm rounded-[12px] p-3 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>

        {/* Lease End Date Field - Required when status is Occupied, disabled when Vacant or Maintenance */}
        <Input
          label="Lease End Date"
          type="date"
          value={formData.leaseEnd || ''}
          onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })}
          disabled={formData.status !== 'Occupied'}
          required={formData.status === 'Occupied'}
          helperText={
            formData.status === 'Occupied'
              ? 'Required for occupied properties'
              : 'Disabled when Vacant or Under Maintenance'
          }
        />

        {/* Property Notes / Features */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Property Notes / Features
          </label>
          <textarea
            rows={3}
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="e.g. 4 loading docks, fire sprinkler system installed."
            className="w-full bg-white border border-[#E5E7EB] text-[#111827] text-sm rounded-[12px] p-3 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>

        {/* Modal Action Buttons: Cancel and Save Changes */}
        <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {warehouseToEdit ? 'Save Changes' : 'Create Warehouse'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
