import React from 'react';

/**
 * LoadingSkeleton Component
 * Renders subtle animated skeleton cards while switching report tabs or changing date filters.
 */
export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Chart Skeleton */}
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-6 h-72 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-3 bg-slate-200 rounded w-1/6"></div>
        </div>
        <div className="h-44 bg-slate-100 rounded-lg w-full mt-4"></div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-4 bg-white border border-[#E5E7EB] rounded-[12px] space-y-2 h-24"
          >
            <div className="h-3 bg-slate-200 rounded w-1/3"></div>
            <div className="h-6 bg-slate-200 rounded w-1/2"></div>
            <div className="h-2.5 bg-slate-100 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
