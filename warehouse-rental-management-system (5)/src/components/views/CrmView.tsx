import React, { useState } from 'react';
import {
  Plus,
  Briefcase
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Lead, LeadStage } from '../../types';
import { LeadDetailView } from './LeadDetailView';
import {
  CrmRowActionGroup,
  ViewButton,
  SecondaryButton,
  PrimaryButton,
  DangerOutlineButton,
} from '../common/CrmActionButtons';

interface CrmViewProps {
  leads: Lead[];
  onAddLead: () => void;
  onEditLead: (lead: Lead) => void;
  onUpdateLeadStage: (leadId: string, newStage: LeadStage, fromStage?: LeadStage) => void;
  onDeleteLead: (lead: Lead) => void;
  searchQuery: string;
}

const STAGES: LeadStage[] = [
  'New Inquiry',
  'Site Visit',
  'Proposal',
  'Negotiation',
  'Closed'
];

export const CrmView: React.FC<CrmViewProps> = ({
  leads,
  onAddLead,
  onEditLead,
  onUpdateLeadStage,
  onDeleteLead,
  searchQuery
}) => {
  const [viewFormat, setViewFormat] = useState<'pipeline' | 'list'>('pipeline');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const [moveModal, setMoveModal] = useState<{
    isOpen: boolean;
    lead: Lead | null;
    targetStage: LeadStage | null;
  }>({
    isOpen: false,
    lead: null,
    targetStage: null
  });

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.companyName && l.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      l.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.preferredZone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLead = leads.find((l) => l.id === selectedLeadId);

  if (selectedLead) {
    return (
      <LeadDetailView
        lead={selectedLead}
        onBack={() => setSelectedLeadId(null)}
        onEditLead={(leadToEdit) => onEditLead(leadToEdit)}
        onDeleteLead={(leadToDelete) => {
          onDeleteLead(leadToDelete);
          setSelectedLeadId(null);
        }}
        onRequestMoveStage={(leadToMove, targetStage) => {
          setMoveModal({
            isOpen: true,
            lead: leadToMove,
            targetStage
          });
        }}
      />
    );
  }

  const getStageColor = (stage: LeadStage) => {
    switch (stage) {
      case 'New Inquiry':
        return 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Site Visit':
        return 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Proposal':
        return 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'Negotiation':
        return 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
      case 'Closed':
        return 'bg-green-50 dark:bg-green-950/80 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
    }
  };

  const handleOpenMoveModal = (lead: Lead, targetStage: LeadStage) => {
    setMoveModal({
      isOpen: true,
      lead,
      targetStage
    });
  };

  const handleConfirmMoveStage = () => {
    if (moveModal.lead && moveModal.targetStage) {
      onUpdateLeadStage(
        moveModal.lead.id,
        moveModal.targetStage,
        moveModal.lead.stage
      );
    }
    setMoveModal({ isOpen: false, lead: null, targetStage: null });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB] dark:border-[#334155]">
        <div>
          <h1 className="text-xl font-bold text-[#111827] dark:text-[#F8FAFC] tracking-tight">
            Tenant Inquiry CRM Pipeline
          </h1>
          <p className="text-xs text-gray-500 dark:text-[#94A3B8] mt-0.5">
            Manage prospective client leads, space requirements, site visits, and rental negotiations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Format Toggle */}
          <div className="flex items-center bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[10px] p-1 text-xs font-medium">
            <button
              onClick={() => setViewFormat('pipeline')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewFormat === 'pipeline'
                  ? 'bg-[#2563EB] text-white font-semibold'
                  : 'text-gray-600 dark:text-[#CBD5E1] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Pipeline Kanban
            </button>
            <button
              onClick={() => setViewFormat('list')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewFormat === 'list'
                  ? 'bg-[#2563EB] text-white font-semibold'
                  : 'text-gray-600 dark:text-[#CBD5E1] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              List View
            </button>
          </div>

          <Button
            variant="primary"
            onClick={onAddLead}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Lead
          </Button>
        </div>
      </div>

      {/* Pipeline Kanban View */}
      {viewFormat === 'pipeline' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {STAGES.map((stg) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stg);
            return (
              <div
                key={stg}
                className="bg-slate-50/70 dark:bg-[#111827]/60 border border-[#E5E7EB] dark:border-[#334155] rounded-[12px] p-3 space-y-3 min-w-[230px]"
              >
                {/* Column Header & Counter */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">{stg}</span>
                  <span className="text-[11px] font-semibold text-gray-600 dark:text-[#CBD5E1] bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] px-2 py-0.5 rounded-full shadow-2xs">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-3">
                  {stageLeads.length === 0 ? (
                    <div className="p-4 bg-white dark:bg-[#1E293B] border border-dashed border-[#E5E7EB] dark:border-[#334155] rounded-[10px] text-center">
                      <p className="text-[11px] text-gray-400 dark:text-[#64748B]">No active leads in this stage.</p>
                    </div>
                  ) : (
                    stageLeads.map((ld) => {
                      const currentIdx = STAGES.indexOf(ld.stage);
                      const prevStage = currentIdx > 0 ? STAGES[currentIdx - 1] : null;
                      const nextStage = currentIdx < STAGES.length - 1 ? STAGES[currentIdx + 1] : null;

                      return (
                        <Card
                          key={ld.id}
                          className="hover:border-[#2563EB] transition-all flex flex-col justify-between h-[380px]"
                        >
                          <CardContent className="p-3.5 flex flex-col h-full justify-between">
                            {/* Upper Details Section */}
                            <div className="space-y-2.5">
                              <div className="flex items-start justify-between gap-1">
                                <div className="min-w-0 flex-1">
                                  <h4
                                    className="font-bold text-xs text-[#111827] dark:text-[#F8FAFC] hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer truncate"
                                    title={ld.name}
                                    onClick={() => setSelectedLeadId(ld.id)}
                                  >
                                    {ld.name}
                                  </h4>
                                  {ld.companyName && (
                                    <p
                                      className="text-[10px] text-gray-500 dark:text-[#94A3B8] font-medium truncate"
                                      title={ld.companyName}
                                    >
                                      {ld.companyName}
                                    </p>
                                  )}
                                </div>
                                <span className="text-[10px] text-gray-400 dark:text-[#64748B] shrink-0 ml-1">
                                  {ld.createdAt}
                                </span>
                              </div>

                              <div className="text-[11px] text-gray-600 dark:text-[#CBD5E1] space-y-1 bg-slate-50/80 dark:bg-[#111827]/80 p-2.5 rounded-[8px] border border-[#E5E7EB] dark:border-[#334155]">
                                <p className="flex items-center justify-between">
                                  <span className="text-gray-400 dark:text-[#64748B]">Req Area:</span>
                                  <strong className="text-[#111827] dark:text-[#F8FAFC] truncate ml-1">
                                    {ld.requestedSqFt.toLocaleString('en-IN')} sq ft
                                  </strong>
                                </p>

                                <p className="flex items-center justify-between">
                                  <span className="text-gray-400 dark:text-[#64748B]">Target Budget:</span>
                                  <strong className="text-[#2563EB] dark:text-blue-400 truncate ml-1">
                                    ₹{ld.targetBudget.toLocaleString('en-IN')} / mo
                                  </strong>
                                </p>

                                <p className="flex items-center justify-between">
                                  <span className="text-gray-400 dark:text-[#64748B]">Zone:</span>
                                  <span className="truncate ml-1">{ld.preferredZone}</span>
                                </p>

                                {ld.brokerName && (
                                  <p className="text-[10px] text-gray-500 dark:text-[#94A3B8] flex items-center gap-1 mt-1 pt-1 border-t border-[#E5E7EB]/60 dark:border-[#334155] truncate">
                                    <Briefcase className="w-3 h-3 text-gray-400 dark:text-[#64748B] shrink-0" />
                                    <span className="truncate">{ld.brokerName}</span>
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Bottom Action Buttons Section */}
                            <div className="space-y-2 pt-2.5 border-t border-[#E5E7EB] dark:border-[#334155] mt-auto">
                              <ViewButton
                                className="w-full"
                                onClick={() => setSelectedLeadId(ld.id)}
                              >
                                View Details
                              </ViewButton>

                              <div className="flex items-center gap-2">
                                {prevStage && (
                                  <SecondaryButton
                                    className="flex-1 min-w-0"
                                    onClick={() => handleOpenMoveModal(ld, prevStage)}
                                  />
                                )}

                                {nextStage && (
                                  <PrimaryButton
                                    className="flex-1 min-w-0"
                                    onClick={() => handleOpenMoveModal(ld, nextStage)}
                                  />
                                )}
                              </div>

                              <DangerOutlineButton
                                className="w-full"
                                onClick={() => onDeleteLead(ld)}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View Format */
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#111827] dark:text-[#F8FAFC]">
                <thead className="bg-slate-50 dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155] text-gray-500 dark:text-[#CBD5E1] font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Lead Name / Company</th>
                    <th className="px-5 py-3.5">Pipeline Stage</th>
                    <th className="px-5 py-3.5">Requested Sq Ft</th>
                    <th className="px-5 py-3.5">Preferred Zone</th>
                    <th className="px-5 py-3.5">Target Monthly Budget</th>
                    <th className="px-5 py-3.5">Assigned Broker</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
                  {filteredLeads.map((ld) => {
                    const currentIdx = STAGES.indexOf(ld.stage);
                    const prevStage = currentIdx > 0 ? STAGES[currentIdx - 1] : null;
                    const nextStage = currentIdx < STAGES.length - 1 ? STAGES[currentIdx + 1] : null;

                    return (
                      <tr key={ld.id} className="hover:bg-slate-50/80 dark:hover:bg-[#273549]/50 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-[#111827] dark:text-[#F8FAFC]">
                          <div
                            className="cursor-pointer hover:text-[#2563EB] dark:hover:text-blue-400"
                            onClick={() => setSelectedLeadId(ld.id)}
                          >
                            <div>{ld.name}</div>
                            {ld.companyName && (
                              <div className="text-[10px] font-normal text-gray-500 dark:text-[#94A3B8]">
                                {ld.companyName}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStageColor(
                              ld.stage
                            )}`}
                          >
                            {ld.stage}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {ld.requestedSqFt.toLocaleString('en-IN')} sq ft
                        </td>
                        <td className="px-5 py-3.5">{ld.preferredZone}</td>
                        <td className="px-5 py-3.5 font-bold text-[#2563EB] dark:text-blue-400">
                          ₹{ld.targetBudget.toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 dark:text-[#CBD5E1]">
                          {ld.brokerName || 'Direct'}
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <CrmRowActionGroup
                            onView={() => setSelectedLeadId(ld.id)}
                            onPrevious={prevStage ? () => handleOpenMoveModal(ld, prevStage) : undefined}
                            onNext={nextStage ? () => handleOpenMoveModal(ld, nextStage) : undefined}
                            onMoveToBin={() => onDeleteLead(ld)}
                            hasPrevious={!!prevStage}
                            hasNext={!!nextStage}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stage Movement Confirmation Dialog */}
      {moveModal.isOpen && moveModal.lead && moveModal.targetStage && (
        <Modal
          isOpen={moveModal.isOpen}
          onClose={() => setMoveModal({ isOpen: false, lead: null, targetStage: null })}
          title="Move Lead"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <div className="p-4 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800 rounded-[12px] space-y-2">
              <p className="text-sm font-semibold text-[#111827] dark:text-[#F8FAFC]">
                Move &quot;{moveModal.lead.name}&quot; from{' '}
                <span className="font-bold text-[#2563EB] dark:text-blue-400">{moveModal.lead.stage}</span> to{' '}
                <span className="font-bold text-[#2563EB] dark:text-blue-400">{moveModal.targetStage}</span>?
              </p>
              <p className="text-xs text-gray-500 dark:text-[#94A3B8]">
                This will update the lead stage in the pipeline and log an entry in the Activity Timeline.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E7EB] dark:border-[#334155]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMoveModal({ isOpen: false, lead: null, targetStage: null })}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmMoveStage}
              >
                Move
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
