import React from 'react';
import { ChevronRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  valueColorClass?: string;
  onClick?: () => void;
}

/**
 * KPICard Component
 * Renders an interactive, clickable KPI Card with hover state feedback and detail popup trigger.
 */
export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtext,
  icon,
  valueColorClass = 'text-[#111827]',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 bg-white border border-[#E5E7EB] rounded-[12px] shadow-2xs space-y-1.5 transition-all ${
        onClick
          ? 'cursor-pointer hover:border-[#2563EB] hover:shadow-md group'
          : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 group-hover:text-[#2563EB] transition-colors">
          {title}
        </span>
        {icon && <div className="text-gray-400 group-hover:text-[#2563EB] transition-colors">{icon}</div>}
      </div>

      <div className="flex items-baseline justify-between">
        <p className={`text-xl font-bold ${valueColorClass} tracking-tight`}>
          {value}
        </p>
        {onClick && (
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all" />
        )}
      </div>

      {subtext && <span className="text-[11px] text-gray-400 block">{subtext}</span>}
    </div>
  );
};
