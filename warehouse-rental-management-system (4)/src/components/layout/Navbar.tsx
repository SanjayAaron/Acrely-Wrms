import React, { useState, useRef, useEffect } from 'react';
import {
  Warehouse as WarehouseIcon,
  Search,
  Plus,
  Bell,
  Menu,
  User,
  LogOut,
  Settings,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { NavigationTab, UserRole } from '../../types';
import { AppNotification } from '../../types/notifications';
import { NotificationCenter } from '../notifications/NotificationCenter';

/**
 * Top Navbar for ACRELY Warehouse Rental Management System
 * Corporate Dashboard Layout (Primary Blue: #2563EB, White: #FFFFFF, Border: #E5E7EB)
 */

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  onQuickAction: (actionType: 'warehouse' | 'tenant' | 'payment' | 'lead' | 'broker') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLogout?: () => void;
  onNavigate?: (tab: NavigationTab) => void;
  userRole?: UserRole;
  onToggleRole?: () => void;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  onQuickAction,
  searchQuery,
  setSearchQuery,
  onLogout,
  onNavigate,
  userRole,
  onToggleRole,
  notifications,
  setNotifications,
}) => {
  // Dropdown UI states
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Compute unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Search items definition
  const searchCategories: { label: string; tab: NavigationTab; category: string }[] = [
    { label: 'Warehouses', tab: 'warehouses', category: 'Properties' },
    { label: 'Tenants', tab: 'tenants', category: 'Leases' },
    { label: 'Rent Payments', tab: 'payments', category: 'Finance' },
    { label: 'Brokers', tab: 'brokers', category: 'Contacts' },
    { label: 'CRM Leads', tab: 'crm', category: 'Sales Pipeline' },
    { label: 'Reports', tab: 'reports', category: 'Analytics' },
    { label: 'System Settings', tab: 'settings', category: 'Configuration' },
  ];

  // Filter search results based on input
  const filteredSearchResults = searchQuery.trim()
    ? searchCategories.filter(
        (item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchCategories;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredSearchResults.length > 0 && onNavigate) {
      onNavigate(filteredSearchResults[0].tab);
      setIsSearchFocused(false);
      setSearchQuery('');
    }
  };

  const handleSelectSearchResult = (tab: NavigationTab) => {
    if (onNavigate) {
      onNavigate(tab);
    }
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E5E7EB] px-4 lg:px-6 flex items-center justify-between shadow-xs">
      {/* Left section: Brand & Mobile Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-slate-100 rounded-lg lg:hidden"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => onNavigate && onNavigate('dashboard')}
        >
          <div className="w-9 h-9 bg-[#2563EB] rounded-[10px] flex items-center justify-center text-white font-bold shadow-xs">
            <WarehouseIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-[#111827]">
                ACRELY
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 bg-blue-50 text-[#2563EB] border border-blue-200 rounded">
                Owner Portal
              </span>
            </div>
            <p className="text-[11px] text-gray-500 hidden sm:block">
              Advanced Commercial Rental & Estate Logistics
            </p>
          </div>
        </div>
      </div>

      {/* Middle section: Global Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6 relative">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search warehouses, tenants, invoices, brokers, CRM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] rounded-[10px] pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors"
          />
        </form>

        {/* Search Results Dropdown */}
        {isSearchFocused && (
          <div className="absolute top-11 left-0 right-0 bg-white border border-[#E5E7EB] rounded-[12px] shadow-lg py-1.5 z-50">
            <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Search Recommendations
            </div>
            {filteredSearchResults.length > 0 ? (
              filteredSearchResults.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => handleSelectSearchResult(item.tab)}
                  className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-[#2563EB] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-[10px] text-gray-400">{item.category}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-gray-400">No results found</div>
            )}
          </div>
        )}
      </div>

      {/* Right section: Quick Actions, Currency Indicator, Notifications, Owner Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Currency Tag */}
        <div className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-slate-100 border border-[#E5E7EB] rounded-lg text-gray-700">
          <span className="text-gray-400 font-normal">Currency:</span>
          <span>₹ INR</span>
        </div>

        {/* Quick Add Button & Dropdown */}
        <div className="relative">
          <Button
            size="sm"
            variant="primary"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
          >
            <span className="hidden sm:inline">Quick Add</span>
          </Button>

          {/* Quick Add Menu Dropdown */}
          {isQuickAddOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-[12px] shadow-lg py-1.5 z-50 animate-in fade-in duration-100">
              <button
                onClick={() => {
                  onQuickAction('warehouse');
                  setIsQuickAddOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-[#2563EB] transition-colors font-medium"
              >
                + Add Warehouse
              </button>
              <button
                onClick={() => {
                  onQuickAction('tenant');
                  setIsQuickAddOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-[#2563EB] transition-colors font-medium"
              >
                + Add Tenant
              </button>
              <button
                onClick={() => {
                  onQuickAction('payment');
                  setIsQuickAddOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-[#2563EB] transition-colors font-medium"
              >
                + Record Payment
              </button>
              <button
                onClick={() => {
                  onQuickAction('broker');
                  setIsQuickAddOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-[#2563EB] transition-colors font-medium"
              >
                + Add Broker
              </button>
              <button
                onClick={() => {
                  onQuickAction('lead');
                  setIsQuickAddOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-[#2563EB] transition-colors font-medium"
              >
                + Add CRM Lead
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-slate-100 rounded-lg relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2563EB] rounded-full animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E7EB] rounded-[12px] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-[#E5E7EB] flex items-center justify-between">
                <span className="text-xs font-bold text-[#111827]">Notifications</span>
                <span className="text-[10px] font-semibold bg-blue-50 text-[#2563EB] px-2 py-0.5 rounded-full border border-blue-100">
                  {unreadCount} Unread
                </span>
              </div>
              <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        // Mark as read
                        setNotifications((prev) =>
                          prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item))
                        );
                        if (onNavigate && n.relatedEntity?.targetTab) {
                          onNavigate(n.relatedEntity.targetTab);
                        }
                      }}
                      className={`px-4 py-2.5 transition-colors flex items-start gap-3 cursor-pointer ${
                        n.isRead ? 'hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/80'
                      }`}
                    >
                      <div className="w-2 h-2 mt-1.5 rounded-full shrink-0 bg-[#2563EB]" style={{ opacity: n.isRead ? 0 : 1 }} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate ${n.isRead ? 'text-gray-700' : 'text-[#111827]'}`}>
                          {n.title}
                        </p>
                        <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{n.description}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{n.timestamp}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-gray-400">No notifications</div>
                )}
              </div>

              {/* View More Notifications Button -> Opens Modal without redirection */}
              <div className="p-2 border-t border-[#E5E7EB] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    setIsNotificationCenterOpen(true);
                  }}
                  className="w-full text-xs text-[#2563EB] font-semibold hover:bg-blue-50 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  View More Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notification Center Modal */}
        <NotificationCenter
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
          notifications={notifications}
          setNotifications={setNotifications}
          onNavigate={(tab) => {
            if (onNavigate) onNavigate(tab);
          }}
        />

        {/* Role Switcher Badge Button */}
        {userRole && onToggleRole && (
          <button
            onClick={onToggleRole}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-xs font-semibold border transition-all cursor-pointer ${
              userRole === 'Owner'
                ? 'bg-blue-50 text-[#2563EB] border-blue-200 hover:bg-blue-100'
                : 'bg-amber-50 text-[#F59E0B] border-amber-200 hover:bg-amber-100'
            }`}
            title="Click to toggle role between Owner & Editor"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Role: {userRole}</span>
          </button>
        )}

        {/* Owner Profile Avatar & Dropdown */}
        <div className="relative border-l border-[#E5E7EB] pl-2">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] font-bold text-xs">
              {userRole === 'Owner' ? 'OW' : 'ED'}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-[#111827] leading-none">
                {userRole === 'Owner' ? 'Property Owner' : 'System Editor'}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">ACRELY Portal</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-[12px] shadow-xl py-1.5 z-50">
              <div className="px-4 py-2 border-b border-[#E5E7EB]">
                <p className="text-xs font-bold text-[#111827]">Admin User</p>
                <p className="text-[10px] text-gray-500">admin@acrely.com</p>
              </div>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onNavigate) onNavigate('settings');
                }}
                className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-gray-500" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onNavigate) onNavigate('settings');
                }}
                className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-gray-500" />
                <span>Settings</span>
              </button>
              <div className="border-t border-[#E5E7EB] my-1" />
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onLogout) onLogout();
                }}
                className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

