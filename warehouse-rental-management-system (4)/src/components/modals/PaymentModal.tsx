import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { RentPayment, Tenant, Warehouse } from '../../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: RentPayment) => void;
  tenants: Tenant[];
  warehouses: Warehouse[];
  paymentToEdit?: RentPayment | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  tenants,
  warehouses,
  paymentToEdit
}) => {
  const [formData, setFormData] = useState<Partial<RentPayment>>({
    invoiceNumber: `INV-2026-${Math.floor(Math.random() * 900) + 100}`,
    tenantId: '',
    warehouseId: '',
    amount: 150000,
    dueDate: '2026-08-05',
    status: 'Paid',
    paymentMethod: 'Bank Transfer'
  });

  useEffect(() => {
    if (paymentToEdit) {
      setFormData(paymentToEdit);
    } else {
      const activeTenant = tenants[0];
      setFormData({
        invoiceNumber: `INV-2026-${Math.floor(Math.random() * 900) + 100}`,
        tenantId: activeTenant?.id || '',
        tenantName: activeTenant?.name || 'Tenant 1',
        warehouseId: activeTenant?.warehouseId || warehouses[0]?.id || '',
        warehouseName: activeTenant?.warehouseName || warehouses[0]?.name || 'Warehouse 1',
        amount: activeTenant?.monthlyRent || 150000,
        dueDate: '2026-08-05',
        paidDate: '2026-08-02',
        status: 'Paid',
        paymentMethod: 'Bank Transfer'
      });
    }
  }, [paymentToEdit, tenants, warehouses, isOpen]);

  const handleTenantChange = (tenantId: string) => {
    const selectedTenant = tenants.find((t) => t.id === tenantId);
    if (selectedTenant) {
      setFormData({
        ...formData,
        tenantId: selectedTenant.id,
        tenantName: selectedTenant.name,
        warehouseId: selectedTenant.warehouseId,
        warehouseName: selectedTenant.warehouseName,
        amount: selectedTenant.monthlyRent
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPayment: RentPayment = {
      id: paymentToEdit?.id || `pm-${Date.now()}`,
      invoiceNumber: formData.invoiceNumber || 'INV-2026-000',
      tenantId: formData.tenantId || tenants[0]?.id || 'tn-1',
      tenantName: formData.tenantName || tenants[0]?.name || 'Tenant 1',
      warehouseId: formData.warehouseId || warehouses[0]?.id || 'wh-1',
      warehouseName: formData.warehouseName || warehouses[0]?.name || 'Warehouse 1',
      amount: Number(formData.amount) || 0,
      dueDate: formData.dueDate || '2026-08-05',
      paidDate: formData.status === 'Paid' ? formData.paidDate || '2026-08-02' : undefined,
      status: formData.status || 'Paid',
      paymentMethod: formData.paymentMethod || 'Bank Transfer'
    };
    onSave(newPayment);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={paymentToEdit ? 'Edit Rent Invoice' : 'Record Rent Payment'}
      description="Issue or record a monthly rental collection payment."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Invoice Reference #"
          value={formData.invoiceNumber || ''}
          onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
          required
        />

        <Select
          label="Select Tenant"
          value={formData.tenantId || ''}
          onChange={(e) => handleTenantChange(e.target.value)}
          options={tenants.map((t) => ({
            value: t.id,
            label: `${t.name} (${t.warehouseName} - ₹${t.monthlyRent.toLocaleString('en-IN')})`
          }))}
        />

        <Input
          label="Rent Amount (₹)"
          type="number"
          value={formData.amount ?? 0}
          onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate || ''}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />

          <Select
            label="Payment Status"
            value={formData.status || 'Paid'}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as RentPayment['status'] })
            }
            options={[
              { value: 'Paid', label: 'Paid' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Overdue', label: 'Overdue' }
            ]}
          />
        </div>

        {formData.status === 'Paid' && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Payment Collection Date"
              type="date"
              value={formData.paidDate || ''}
              onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
            />

            <Select
              label="Payment Method"
              value={formData.paymentMethod || 'Bank Transfer'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentMethod: e.target.value as RentPayment['paymentMethod']
                })
              }
              options={[
                { value: 'Bank Transfer', label: 'Bank Transfer / NEFT' },
                { value: 'UPI', label: 'UPI' },
                { value: 'Cheque', label: 'Cheque' },
                { value: 'Direct Deposit', label: 'Direct Deposit' }
              ]}
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Record Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
