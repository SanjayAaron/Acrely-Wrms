import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  Briefcase,
  Calendar,
  FileText,
  Clock,
  Edit,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DeleteButton } from '../common/DeleteButton';
import { Lead, LeadStage } from '../../types';

interface LeadDetailViewProps {
  lead: Lead;
  onBack: () => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
  onRequestMoveStage: (lead: Lead, targetStage: LeadStage) => void;
}

const STAGES: LeadStage[] = [
  'New Inquiry',
  'Site Visit',
  'Proposal',
  'Negotiation',
  'Closed'
];

/**
 * LeadDetailView component renders the dedicated CRM Lead page (`/crm/[lead-id]`).
 * Contains detailed Lead Info, Warehouse Requirements, Broker info, Notes,
 * Activity Timeline / Stage History, and stage movement controls.
 */
export const LeadDetailView: React.FC<LeadDetailViewProps> = ({
  lead,
  onBack,
  onEditLead,
  onDeleteLead,
  onRequestMoveStage
}) => {
  const currentStageIndex = STAGES.indexOf(lead.stage);
  const prevStage = currentStageIndex > 0 ? STAGES[currentStageIndex - 1] : null;
  const nextStage = currentStageIndex < STAGES.length - 1 ? STAGES[currentStageIndex + 1] : null;

  const getStageBadgeVariant = (stg: LeadStage) => {
    switch (stg) {
      case 'New Inquiry':
        return 'info';
      case 'Site Visit':
        return 'warning';
      case 'Proposal':
        return 'neutral';
      case 'Negotiation':
        return 'warning';
      case 'Closed':
        return 'success';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Bar with Back Navigation & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Pipeline
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#111827] tracking-tight">
                {lead.name}
              </h1>
              <Badge variant={getStageBadgeVariant(lead.stage)}>
                {lead.stage}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              CRM Lead ID: <span className="font-mono">{lead.id}</span> • Registered on {lead.createdAt}
            </p>
          </div>
        </div>

        {/* Action Buttons Header */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Previous Stage Button (Hidden if in New Inquiry) */}
          {prevStage && (
            <Button
              variant="outline"
              size="sm"
              icon={<ChevronLeft className="w-4 h-4" />}
              onClick={() => onRequestMoveStage(lead, prevStage)}
            >
              ◀ Previous Stage
            </Button>
          )}

          {/* Next Stage Button (Hidden if in Closed) */}
          {nextStage && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onRequestMoveStage(lead, nextStage)}
            >
              ▶ Next Stage
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => onEditLead(lead)}
          >
            Edit Lead
          </Button>

          <DeleteButton
            label="Move to Recycle Bin"
            onClick={() => onDeleteLead(lead)}
          />
        </div>
      </div>

      {/* Pipeline Progress Stepper Visualizer */}
      <Card>
        <CardContent className="p-4">
          <div className="text-xs font-semibold text-gray-500 mb-3 flex items-center justify-between">
            <span>Pipeline Progression</span>
            <span>Stage {currentStageIndex + 1} of {STAGES.length}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {STAGES.map((stg, idx) => {
              const isCurrent = stg === lead.stage;
              const isPast = idx < currentStageIndex;

              return (
                <div
                  key={stg}
                  className={`p-2.5 rounded-[10px] text-center text-xs font-semibold border transition-all ${
                    isCurrent
                      ? 'bg-blue-50 border-[#2563EB] text-[#2563EB] shadow-xs'
                      : isPast
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-700'
                      : 'bg-slate-50 border-[#E5E7EB] text-gray-400'
                  }`}
                >
                  <div className="text-[10px] opacity-70 uppercase tracking-wider mb-0.5">
                    Step {idx + 1}
                  </div>
                  <div className="truncate">{stg}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Lead Information, Requirements, Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Information Card */}
          <Card>
            <CardHeader className="pb-3 border-b border-[#E5E7EB]">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#2563EB]" />
                Lead Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div>
                  <span className="text-gray-500 block mb-1">Company Name</span>
                  <p className="font-bold text-[#111827] text-sm flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    {lead.companyName || lead.name || 'N/A'}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500 block mb-1">Contact Person</span>
                  <p className="font-bold text-[#111827] text-sm flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    {lead.contactPerson || 'N/A'}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500 block mb-1">Phone Number</span>
                  <p className="font-semibold text-[#111827] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    {lead.phone || '+91 98765 00000'}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500 block mb-1">Email Address</span>
                  <p className="font-semibold text-[#111827] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    {lead.email || 'contact@leadcompany.com'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warehouse Requirement Card */}
          <Card>
            <CardHeader className="pb-3 border-b border-[#E5E7EB]">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#2563EB]" />
                Warehouse Requirement
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-[10px]">
                  <span className="text-gray-500 block text-[11px] mb-1">Required Area</span>
                  <span className="font-extrabold text-[#111827] text-sm">
                    {lead.requestedSqFt.toLocaleString('en-IN')} sq ft
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-[10px]">
                  <span className="text-gray-500 block text-[11px] mb-1">Target Budget</span>
                  <span className="font-extrabold text-[#2563EB] text-sm flex items-center gap-0.5">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {lead.targetBudget.toLocaleString('en-IN')} / mo
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-[10px]">
                  <span className="text-gray-500 block text-[11px] mb-1">Preferred Zone</span>
                  <span className="font-bold text-[#111827] text-sm flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    {lead.preferredZone}
                  </span>
                </div>
              </div>

              {/* Additional Requirement Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#E5E7EB] text-xs">
                <div>
                  <span className="text-gray-500 block mb-1">Assigned Broker</span>
                  <p className="font-semibold text-[#111827] flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                    {lead.brokerName || 'Direct Lead (No Broker)'}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500 block mb-1">Expected Move-In Date</span>
                  <p className="font-semibold text-[#111827] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    {lead.expectedMoveInDate || '2026-09-01'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Card */}
          <Card>
            <CardHeader className="pb-3 border-b border-[#E5E7EB]">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2563EB]" />
                Notes & Custom Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {lead.notes ? (
                <p className="text-xs text-gray-700 leading-relaxed bg-slate-50 border border-[#E5E7EB] p-3.5 rounded-[10px]">
                  {lead.notes}
                </p>
              ) : (
                <p className="text-xs text-gray-400 italic">No notes recorded for this lead.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Activity Timeline & Stage History */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-[#E5E7EB]">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2563EB]" />
                Activity Timeline & Stage History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {(!lead.activityTimeline || lead.activityTimeline.length === 0) ? (
                <div className="text-center py-6 text-gray-400 text-xs">
                  No stage movements recorded yet.
                </div>
              ) : (
                <div className="relative pl-4 border-l-2 border-[#E5E7EB] space-y-4">
                  {lead.activityTimeline.map((item) => (
                    <div key={item.id} className="relative group">
                      {/* Bullet node */}
                      <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-[#2563EB] ring-4 ring-blue-50" />

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-[#111827]">
                            {item.fromStage && item.toStage ? (
                              <span className="text-[#2563EB]">
                                {item.fromStage} → {item.toStage}
                              </span>
                            ) : (
                              'Lead Created'
                            )}
                          </span>
                          <span className="text-gray-400 font-mono text-[10px]">
                            {item.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 bg-slate-50 border border-[#E5E7EB] p-2 rounded-[8px]">
                          {item.description}
                        </p>

                        <div className="text-[10px] text-gray-400 flex items-center gap-1">
                          <span>by</span>
                          <span className="font-semibold text-gray-600">{item.performedBy}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stage Transition Actions Box */}
          <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-[#2563EB]/20">
            <CardContent className="p-4 space-y-3">
              <h4 className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                Pipeline Control
              </h4>
              <p className="text-[11px] text-gray-600">
                Move lead forward or backward through pipeline stages.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {prevStage ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs justify-center"
                    onClick={() => onRequestMoveStage(lead, prevStage)}
                  >
                    ◀ {prevStage}
                  </Button>
                ) : (
                  <div className="text-[11px] text-gray-400 italic flex items-center justify-center p-2 border border-dashed rounded-[8px] bg-white/60">
                    At Start Stage
                  </div>
                )}

                {nextStage ? (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs justify-center"
                    onClick={() => onRequestMoveStage(lead, nextStage)}
                  >
                    ▶ {nextStage}
                  </Button>
                ) : (
                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center p-2 border border-emerald-200 bg-emerald-50 rounded-[8px]">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Deal Closed
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
