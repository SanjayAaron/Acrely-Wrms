import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Briefcase,
  Target,
  BarChart3,
  Settings,
  ChevronRight,
  ShieldCheck,
  Building,
  Trash2
} from 'lucide-react';
import { NavigationTab } from '../../types';

/**
 * Left Navigation Sidebar according to WRMS prompt specifications:
 * Sidebar items:
 * - Dashboard
 * - Warehouses
 * - Tenants
 * - Rent Payments
 * - Brokers
 * - CRM
 * - Reports
 * - Settings
 */

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavMenuItem {
  id: NavigationTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  onCloseMobile
}) => {
  const menuItems: NavMenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'warehouses',
      label: 'Warehouses',
      icon: <Building2 className="w-4 h-4" />
    },
    {
      id: 'tenants',
      label: 'Tenants',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'payments',
      label: 'Rent Payments',
      icon: <CreditCard className="w-4 h-4" />
    },
    {
      id: 'brokers',
      label: 'Brokers',
      icon: <Briefcase className="w-4 h-4" />
    },
    {
      id: 'crm',
      label: 'CRM',
      icon: <Target className="w-4 h-4" />
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />
    },
    {
      id: 'recycleBin',
      label: 'Recycle Bin',
      icon: <Trash2 className="w-4 h-4" />
    }
  ];

  const handleSelect = (id: NavigationTab) => {
    setActiveTab(id);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#E5E7EB] w-64 shrink-0">
      {/* Portfolio Info Box */}
      <div className="p-4 border-b border-[#E5E7EB]">
        <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-[12px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#2563EB] flex items-center justify-center font-semibold">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#111827]">Commercial Portfolio</p>
              <p className="text-[10px] text-gray-500">Rental Owner Mode</p>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Main Menu
        </div>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-[#111827] hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-gray-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Banner */}
      <div className="p-4 border-t border-[#E5E7EB]">
        <div className="p-3 bg-slate-50 rounded-[12px] border border-[#E5E7EB]">
          <div className="flex items-center gap-2 text-[#16A34A] mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-semibold">Rental Management Active</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">
            Non-inventory property management for warehouse landlords.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block sticky top-16 h-[calc(100vh-4rem)]">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
