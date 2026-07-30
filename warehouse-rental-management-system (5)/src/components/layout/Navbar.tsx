import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Menu,
  User,
  LogOut,
  Settings,
  ChevronDown,
  ShieldCheck,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { NavigationTab, UserRole } from '../../types';
import { AppNotification } from '../../types/notifications';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { useTheme } from '../../context/ThemeContext';
import logoIcon from '../../assets/bg eraser wrms.png';

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
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  // Dropdown UI states
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-b border-[#E5E7EB] dark:border-[#334155] px-4 lg:px-6 flex items-center justify-between shadow-xs transition-colors duration-150">
      {/* Left section: Brand & Mobile Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 text-gray-500 dark:text-[#94A3B8] hover:text-gray-700 dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-[#1E293B] rounded-lg lg:hidden cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => onNavigate && onNavigate('dashboard')}
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-[10px] overflow-hidden">
            <img src={logoIcon} alt="Acrely OS Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-[#111827] dark:text-[#F8FAFC]">
                Acrely OS
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 rounded">
                Owner Portal
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-[#94A3B8] hidden sm:block">
              Warehouse Rental Management System
            </p>
          </div>
        </div>
      </div>

      {/* Middle section: Global Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6 relative">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400 dark:text-[#64748B]" />
          <input
            type="text"
            placeholder="Search warehouses, tenants, invoices, brokers, CRM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full bg-slate-50 dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] text-xs text-[#111827] dark:text-[#F8FAFC] placeholder:text-gray-400 dark:placeholder:text-[#64748B] rounded-[10px] pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors"
          />
        </form>

        {/* Search Results Dropdown */}
        {isSearchFocused && (
          <div className="absolute top-11 left-0 right-0 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[12px] shadow-lg py-1.5 z-50">
            <div className="px-3 py-1 text-[10px] font-bold text-gray-400 dark:text-[#64748B] uppercase tracking-wider">
              Search Recommendations
            </div>
            {filteredSearchResults.length > 0 ? (
              filteredSearchResults.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => handleSelectSearchResult(item.tab)}
                  className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-[#CBD5E1] hover:bg-blue-50 dark:hover:bg-[#273549] hover:text-[#2563EB] dark:hover:text-[#F8FAFC] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-[10px] text-gray-400 dark:text-[#64748B]">{item.category}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-gray-400 dark:text-[#64748B]">No results found</div>
            )}
          </div>
        )}
      </div>

      {/* Right section: Theme Selector, Quick Actions, Currency Indicator, Notifications, Owner Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Theme Switcher Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="p-2 text-gray-600 dark:text-[#CBD5E1] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-medium"
            title={`Theme: ${theme.toUpperCase()} (Click to change)`}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-amber-500" />
            )}
            <span className="hidden xl:inline capitalize text-[11px] font-semibold">{theme}</span>
          </button>

          {isThemeMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[12px] shadow-xl py-1 z-50 animate-in fade-in duration-100">
              <button
                type="button"
                onClick={() => {
                  setTheme('light');
                  setIsThemeMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-semibold'
                    : 'text-gray-700 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#273549]'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTheme('dark');
                  setIsThemeMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-semibold'
                    : 'text-gray-700 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#273549]'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTheme('system');
                  setIsThemeMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                  theme === 'system'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-semibold'
                    : 'text-gray-700 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#273549]'
                }`}
              >
                <Laptop className="w-3.5 h-3.5 text-blue-500" />
                <span>System</span>
              </button>
            </div>
          )}
        </div>

        {/* Currency Tag */}
        <div className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-lg text-gray-700 dark:text-[#CBD5E1]">
          <span className="text-gray-400 dark:text-[#64748B] font-normal">Currency:</span>
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
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[12px] shadow-lg py-1.5 z-50 animate-in fade-in duration-100">
              <button
                onClick={() => {
                  onQuickAction('warehouse');
                  setIsQuickAddOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-[#CBD5E1] hover:bg-blue-50 dark:hover:bg-[#273549] hover:text-[#2563EB] dark:hover:text-[#F8FAFC] transition-colors font-medium cursor-pointer"
              >
                + Add Warehouse
              </button>
              <button
                onClick={() => {
                  onQuickAction('tenant');
                  setIsQuickAddOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-[#CBD5E1] hover:bg-blue-50 dark:hover:bg-[#273549] hover:text-[#2563EB] dark:hover:text-[#F8FAFC] transition-colors font-medium cursor-pointer"
              >
                + Add Tenant
              </button>
              <button
                onClick={() => {
                  onQuickAction('payment');
                  setIsQuickAddOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-[#CBD5E1] hover:bg-blue-50 dark:hover:bg-[#273549] hover:text-[#2563EB] dark:hover:text-[#F8FAFC] transition-colors font-medium cursor-pointer"
              >
                + Record Payment
              </button>
              <button
                onClick={() => {
                  onQuickAction('broker');
                  setIsQuickAddOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-[#CBD5E1] hover:bg-blue-50 dark:hover:bg-[#273549] hover:text-[#2563EB] dark:hover:text-[#F8FAFC] transition-colors font-medium cursor-pointer"
              >
                + Add Broker
              </button>
              <button
                onClick={() => {
                  onQuickAction('lead');
                  setIsQuickAddOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-[#CBD5E1] hover:bg-blue-50 dark:hover:bg-[#273549] hover:text-[#2563EB] dark:hover:text-[#F8FAFC] transition-colors font-medium cursor-pointer"
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
            className="p-2 text-gray-500 dark:text-[#94A3B8] hover:text-gray-700 dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-[#1E293B] rounded-lg relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2563EB] rounded-full animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[12px] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-[#E5E7EB] dark:border-[#334155] flex items-center justify-between">
                <span className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">Notifications</span>
                <span className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800">
                  {unreadCount} Unread
                </span>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-slate-700/60 max-h-72 overflow-y-auto">
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
                        n.isRead ? 'hover:bg-slate-50 dark:hover:bg-[#273549]' : 'bg-blue-50/40 dark:bg-blue-950/30 hover:bg-blue-50/80 dark:hover:bg-blue-900/40'
                      }`}
                    >
                      <div className="w-2 h-2 mt-1.5 rounded-full shrink-0 bg-[#2563EB]" style={{ opacity: n.isRead ? 0 : 1 }} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate ${n.isRead ? 'text-gray-700 dark:text-[#CBD5E1]' : 'text-[#111827] dark:text-[#F8FAFC]'}`}>
                          {n.title}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-[#94A3B8] line-clamp-1 mt-0.5">{n.description}</p>
                        <p className="text-[10px] text-gray-400 dark:text-[#64748B] mt-1">{n.timestamp}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-gray-400 dark:text-[#64748B]">No notifications</div>
                )}
              </div>

              {/* View More Notifications Button */}
              <div className="p-2 border-t border-[#E5E7EB] dark:border-[#334155] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    setIsNotificationCenterOpen(true);
                  }}
                  className="w-full text-xs text-[#2563EB] dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-[#273549] py-2 rounded-lg transition-colors cursor-pointer"
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
                ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100'
                : 'bg-amber-50 dark:bg-amber-950/60 text-[#F59E0B] dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
            }`}
            title="Click to toggle role between Owner & Editor"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Role: {userRole}</span>
          </button>
        )}

        {/* Owner Profile Avatar & Dropdown */}
        <div className="relative border-l border-[#E5E7EB] dark:border-[#334155] pl-2">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-[#1E293B] p-1 rounded-lg transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#2563EB] dark:text-blue-400 font-bold text-xs">
              {userRole === 'Owner' ? 'OW' : 'ED'}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-[#111827] dark:text-[#F8FAFC] leading-none">
                {userRole === 'Owner' ? 'Property Owner' : 'System Editor'}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-[#94A3B8] mt-0.5">ACRELY Portal</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-[#64748B] hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[12px] shadow-xl py-1.5 z-50">
              <div className="px-4 py-2 border-b border-[#E5E7EB] dark:border-[#334155]">
                <p className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">Admin User</p>
                <p className="text-[10px] text-gray-500 dark:text-[#94A3B8]">admin@acrely.com</p>
              </div>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onNavigate) onNavigate('settings');
                }}
                className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#273549] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-gray-500 dark:text-[#94A3B8]" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onNavigate) onNavigate('settings');
                }}
                className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#273549] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-gray-500 dark:text-[#94A3B8]" />
                <span>Settings</span>
              </button>
              <div className="border-t border-[#E5E7EB] dark:border-[#334155] my-1" />
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onLogout) onLogout();
                }}
                className="w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
