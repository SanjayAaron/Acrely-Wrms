import React, { useState, useMemo } from 'react';
import {
  AppNotification,
  NotificationModule,
  NotificationSortOption,
} from '../../types/notifications';
import { NavigationTab } from '../../types';
import { NotificationHeader } from './NotificationHeader';
import { NotificationSidebar } from './NotificationSidebar';
import { NotificationCard } from './NotificationCard';
import { NotificationEmptyState } from './NotificationEmptyState';
import { ChevronDown } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  onNavigate: (tab: NavigationTab) => void;
}

/**
 * Priority order rank map for sorting by priority (Critical > High > Medium > Low)
 */
const priorityRank: Record<AppNotification['priority'], number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

/**
 * Main Notification Center Modal Component
 * Displays a professional centered modal (80% width x 85% height) with backdrop blur,
 * category filters sidebar, search bar, sorting options, card feed, and Load More footer.
 */
export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  setNotifications,
  onNavigate,
}) => {
  // Active Filter & Search States
  const [activeModule, setActiveModule] = useState<NotificationModule>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<NotificationSortOption>('newest');

  // Incremental Pagination State (loads 20 items per batch)
  const [visibleLimit, setVisibleLimit] = useState<number>(20);

  // Compute Unread and Total Counts across all notifications
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );
  const totalCount = notifications.length;

  // Filter & Sort Notifications
  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    // 1. Module / Category Filter
    if (activeModule === 'Unread') {
      result = result.filter((n) => !n.isRead);
    } else if (activeModule !== 'All') {
      result = result.filter((n) => n.module === activeModule);
    }

    // 2. Search Query Matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.module.toLowerCase().includes(q) ||
          n.priority.toLowerCase().includes(q) ||
          (n.relatedEntity?.id && n.relatedEntity.id.toLowerCase().includes(q))
      );
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortOption === 'unread_first') {
        if (a.isRead !== b.isRead) {
          return a.isRead ? 1 : -1; // Unread first
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === 'priority') {
        const diff = priorityRank[b.priority] - priorityRank[a.priority];
        if (diff !== 0) return diff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return result;
  }, [notifications, activeModule, searchQuery, sortOption]);

  // Paginated View subset
  const displayedNotifications = filteredNotifications.slice(0, visibleLimit);
  const hasMore = visibleLimit < filteredNotifications.length;

  // Action Handlers
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.isRead));
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleViewDetails = (notification: AppNotification) => {
    // Mark as read when navigating
    handleToggleRead(notification.id);
    onClose();

    // Navigate directly to the related entity's module tab
    if (notification.relatedEntity?.targetTab) {
      onNavigate(notification.relatedEntity.targetTab);
    } else {
      onNavigate('payments');
    }
  };

  const handleResetFilters = () => {
    setActiveModule('All');
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Card Container: ~80% Screen Width & 85% Height */}
      <div className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-2xl w-[92vw] lg:w-[85vw] max-w-6xl h-[85vh] max-h-[850px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-3 duration-200">
        {/* Header */}
        <NotificationHeader
          unreadCount={unreadCount}
          totalCount={totalCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={setSortOption}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearRead={handleClearRead}
          onClose={onClose}
        />

        {/* Modal Main Body Grid: Sidebar + Scrollable Card Feed */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          {/* Left Sidebar Filters */}
          <NotificationSidebar
            activeModule={activeModule}
            onSelectModule={(mod) => {
              setActiveModule(mod);
              setVisibleLimit(20);
            }}
            notifications={notifications}
          />

          {/* Main Card List Container */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto bg-[#F8FAFC] flex flex-col justify-between">
            {displayedNotifications.length > 0 ? (
              <div className="space-y-3">
                {displayedNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onViewDetails={handleViewDetails}
                    onToggleRead={handleToggleRead}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <NotificationEmptyState onReset={handleResetFilters} />
            )}

            {/* Footer - Load More Notifications (Loads next 20 items) */}
            {hasMore && (
              <div className="pt-6 pb-2 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleLimit((prev) => prev + 20)}
                  className="h-[40px] px-6 bg-white hover:bg-slate-100 border border-[#E5E7EB] text-[#111827] text-xs font-semibold rounded-[10px] inline-flex items-center gap-2 transition-all duration-200 shadow-2xs active:scale-[0.98] cursor-pointer"
                >
                  <span>Load More Notifications</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Showing {displayedNotifications.length} of {filteredNotifications.length} notifications
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
