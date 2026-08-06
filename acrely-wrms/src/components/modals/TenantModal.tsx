import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Tenant, Warehouse } from '../../types';

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tenant: Tenant) => void;
  warehouses: Warehouse[];
  tenantToEdit?: Tenant | null;
}

export const TenantModal: React.FC<TenantModalProps> = ({
  isOpen,
  onClose,
  onSave,
  warehouses,
  tenantToEdit
}) => {
  const [formData, setFormData] = useState<Partial<Tenant>>({
    name: 'Tenant 1',
    warehouseId: '',
    warehouseName: '',
    monthlyRent: 150000,
    securityDeposit: 450000,
    leaseStart: '2025-01-01',
    leaseEnd: '2026-12-31',
    status: 'Active',
    contactPerson: 'Contact Person 1',
    email: 'contact@tenant1.com',
    phone: '+91 —',
    documentsUploaded: true
  });

  useEffect(() => {
    if (tenantToEdit) {
      setFormData(tenantToEdit);
    } else {
      const availableWh = warehouses.find((w) => w.status === 'Vacant') || warehouses[0];
      setFormData({
        name: `Tenant ${Math.floor(Math.random() * 10) + 3}`,
        warehouseId: availableWh?.id || '',
        warehouseName: availableWh?.name || 'Warehouse 1',
        monthlyRent: availableWh?.monthlyRent || 150000,
        securityDeposit: availableWh?.securityDeposit || 450000,
        leaseStart: '2026-01-01',
        leaseEnd: '2027-12-31',
        status: 'Active',
        contactPerson: 'Contact Representative',
        email: 'tenant@client.com',
        phone: '+91 —',
        documentsUploaded: true
      });
    }
  }, [tenantToEdit, warehouses, isOpen]);

  const handleWarehouseChange = (warehouseId: string) => {
    const selectedWh = warehouses.find((w) => w.id === warehouseId);
    if (selectedWh) {
      setFormData({
        ...formData,
        warehouseId: selectedWh.id,
        warehouseName: selectedWh.name,
        monthlyRent: selectedWh.monthlyRent,
        securityDeposit: selectedWh.securityDeposit
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTenant: Tenant = {
      id: tenantToEdit?.id || `tn-${Date.now()}`,
      name: formData.name || 'Tenant',
      warehouseId: formData.warehouseId || warehouses[0]?.id || 'wh-1',
      warehouseName: formData.warehouseName || warehouses[0]?.name || 'Warehouse 1',
      monthlyRent: Number(formData.monthlyRent) || 0,
      securityDeposit: Number(formData.securityDeposit) || 0,
      leaseStart: formData.leaseStart || '2026-01-01',
      leaseEnd: formData.leaseEnd || '2027-12-31',
      status: formData.status || 'Active',
      contactPerson: formData.contactPerson || 'Representative',
      email: formData.email || 'contact@client.com',
      phone: formData.phone || '+91 —',
      documentsUploaded: formData.documentsUploaded ?? true
    };
    onSave(newTenant);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tenantToEdit ? 'Edit Tenant Information' : 'Add New Tenant'}
      description="Register a client company or individual tenant renting a warehouse."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Tenant Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Tenant 3"
            required
          />

          <Select
            label="Assigned Warehouse Property"
            value={formData.warehouseId || ''}
            onChange={(e) => handleWarehouseChange(e.target.value)}
            options={warehouses.map((w) => ({
              value: w.id,
              label: `${w.name} (${w.status} - ₹${w.monthlyRent.toLocaleString('en-IN')}/mo)`
            }))}
          />

          <Input
            label="Contact Representative"
            value={formData.contactPerson || ''}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            placeholder="e.g. Contact Person"
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. contact@tenant.com"
          />

          <Input
            label="Agreed Monthly Rent (₹)"
            type="number"
            value={formData.monthlyRent ?? 0}
            onChange={(e) => setFormData({ ...formData, monthlyRent: Number(e.target.value) })}
            required
          />

          <Input
            label="Security Deposit (₹)"
            type="number"
            value={formData.securityDeposit ?? 0}
            onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
          />

          <Input
            label="Lease Start Date"
            type="date"
            value={formData.leaseStart || ''}
            onChange={(e) => setFormData({ ...formData, leaseStart: e.target.value })}
          />

          <Input
            label="Lease End Date"
            type="date"
            value={formData.leaseEnd || ''}
            onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {tenantToEdit ? 'Update Tenant' : 'Save Tenant'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
