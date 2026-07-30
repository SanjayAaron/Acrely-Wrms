import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Lead, Broker } from '../../types';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => void;
  brokers: Broker[];
  leadToEdit?: Lead | null;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  brokers,
  leadToEdit
}) => {
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    contactPerson: 'Contact Person',
    requestedSqFt: 12000,
    preferredZone: 'Zone A',
    targetBudget: 150000,
    stage: 'New Inquiry',
    notes: ''
  });

  useEffect(() => {
    if (leadToEdit) {
      setFormData(leadToEdit);
    } else {
      setFormData({
        name: `Lead ${Math.floor(Math.random() * 10) + 4}`,
        companyName: '',
        contactPerson: 'Representative Name',
        phone: '',
        email: '',
        requestedSqFt: 15000,
        preferredZone: 'Zone A',
        targetBudget: 180000,
        stage: 'New Inquiry',
        expectedMoveInDate: '',
        createdAt: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
  }, [leadToEdit, isOpen]);

  const handleBrokerChange = (brokerId: string) => {
    const selectedBroker = brokers.find((b) => b.id === brokerId);
    setFormData({
      ...formData,
      brokerId: selectedBroker ? selectedBroker.id : undefined,
      brokerName: selectedBroker ? selectedBroker.name : undefined
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      id: leadToEdit?.id || `ld-${Date.now()}`,
      name: formData.name || 'Lead',
      companyName: formData.companyName || formData.name || 'Lead Company',
      contactPerson: formData.contactPerson || 'Representative',
      phone: formData.phone || '+91 98765 00000',
      email: formData.email || 'contact@leadcompany.com',
      requestedSqFt: Number(formData.requestedSqFt) || 10000,
      preferredZone: formData.preferredZone || 'Zone A',
      targetBudget: Number(formData.targetBudget) || 100000,
      stage: formData.stage || 'New Inquiry',
      brokerId: formData.brokerId,
      brokerName: formData.brokerName,
      expectedMoveInDate: formData.expectedMoveInDate || '2026-09-01',
      createdAt: formData.createdAt || new Date().toISOString().split('T')[0],
      notes: formData.notes,
      activityTimeline: leadToEdit?.activityTimeline || [
        {
          id: `act-${Date.now()}`,
          performedBy: 'Owner',
          timestamp: 'Just now',
          description: `Lead created as ${formData.stage || 'New Inquiry'}`
        }
      ]
    };
    onSave(newLead);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={leadToEdit ? 'Edit Tenant Lead' : 'Add New CRM Lead'}
      description="Track potential clients inquiring for warehouse space."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Lead Name / Designation"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Lead 4"
            required
          />

          <Input
            label="Company Name"
            value={formData.companyName || ''}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="e.g. Apex Logistics"
          />

          <Input
            label="Contact Person"
            value={formData.contactPerson || ''}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            placeholder="e.g. Contact Person"
          />

          <Input
            label="Phone Number"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="e.g. +91 98765 43210"
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. contact@company.com"
          />

          <Input
            label="Requested Area (Sq Ft)"
            type="number"
            value={formData.requestedSqFt ?? 10000}
            onChange={(e) => setFormData({ ...formData, requestedSqFt: Number(e.target.value) })}
          />

          <Input
            label="Preferred Location Zone"
            value={formData.preferredZone || ''}
            onChange={(e) => setFormData({ ...formData, preferredZone: e.target.value })}
            placeholder="e.g. Zone A"
          />

          <Input
            label="Target Monthly Budget (₹)"
            type="number"
            value={formData.targetBudget ?? 0}
            onChange={(e) => setFormData({ ...formData, targetBudget: Number(e.target.value) })}
          />

          <Input
            label="Expected Move-In Date"
            type="date"
            value={formData.expectedMoveInDate || ''}
            onChange={(e) => setFormData({ ...formData, expectedMoveInDate: e.target.value })}
          />

          <Select
            label="Pipeline Stage"
            value={formData.stage || 'New Inquiry'}
            onChange={(e) =>
              setFormData({ ...formData, stage: e.target.value as Lead['stage'] })
            }
            options={[
              { value: 'New Inquiry', label: '1. New Inquiry' },
              { value: 'Site Visit', label: '2. Site Visit Scheduled' },
              { value: 'Proposal', label: '3. Proposal Sent' },
              { value: 'Negotiation', label: '4. In Negotiation' },
              { value: 'Closed', label: '5. Lease Closed' }
            ]}
          />

          <Select
            label="Assigned Broker (Optional)"
            value={formData.brokerId || ''}
            onChange={(e) => handleBrokerChange(e.target.value)}
            options={[
              { value: '', label: 'Direct Lead (No Broker)' },
              ...brokers.map((b) => ({ value: b.id, label: b.name }))
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-[#CBD5E1] mb-1.5">
            Requirement Notes
          </label>
          <textarea
            rows={2}
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="e.g. Needs high ceiling clearance and cold storage setup."
            className="w-full bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] text-[#111827] dark:text-[#F8FAFC] text-sm rounded-[12px] p-3 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save CRM Lead
          </Button>
        </div>
      </form>
    </Modal>
  );
};
