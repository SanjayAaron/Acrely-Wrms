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

const priorityRank: Record<AppNotification['priority'], number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  setNotifications,
  onNavigate,
}) => {
  const [activeModule, setActiveModule] = useState<NotificationModule>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<NotificationSortOption>('newest');
  const [visibleLimit, setVisibleLimit] = useState<number>(20);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );
  const totalCount = notifications.length;

  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    if (activeModule === 'Unread') {
      result = result.filter((n) => !n.isRead);
    } else if (activeModule !== 'All') {
      result = result.filter((n) => n.module === activeModule);
    }

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

    result.sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortOption === 'unread_first') {
        if (a.isRead !== b.isRead) {
          return a.isRead ? 1 : -1;
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

  const displayedNotifications = filteredNotifications.slice(0, visibleLimit);
  const hasMore = visibleLimit < filteredNotifications.length;

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
    handleToggleRead(notification.id);
    onClose();

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[16px] shadow-2xl w-[92vw] lg:w-[85vw] max-w-6xl h-[85vh] max-h-[850px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-3 duration-200">
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

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          <NotificationSidebar
            activeModule={activeModule}
            onSelectModule={(mod) => {
              setActiveModule(mod);
              setVisibleLimit(20);
            }}
            notifications={notifications}
          />

          <div className="flex-1 p-4 sm:p-5 overflow-y-auto bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col justify-between">
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

            {hasMore && (
              <div className="pt-6 pb-2 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleLimit((prev) => prev + 20)}
                  className="h-[40px] px-6 bg-white dark:bg-[#1E293B] hover:bg-slate-100 dark:hover:bg-[#273549] border border-[#E5E7EB] dark:border-[#334155] text-[#111827] dark:text-[#F8FAFC] text-xs font-semibold rounded-[10px] inline-flex items-center gap-2 transition-all duration-200 shadow-2xs active:scale-[0.98] cursor-pointer"
                >
                  <span>Load More Notifications</span>
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-[#94A3B8]" />
                </button>
                <p className="text-[11px] text-gray-400 dark:text-[#64748B] mt-1.5">
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
