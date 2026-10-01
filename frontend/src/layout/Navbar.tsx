import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Bell, Check, Inbox, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { emailService } from '../services/emailService';
import { formatRelativeTime } from '../utils/formatters';

type Notification = Awaited<
  ReturnType<typeof emailService.getNotifications>
>["notifications"][number];

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);

  const refreshNotifications = useCallback(async () => {
    setIsLoadingNotifications(true);
    setNotificationError(null);

    try {
      const result = await emailService.getNotifications();
      setUnreadCount(result.unreadCount);
      setNotifications(result.notifications);
    } catch {
      setNotificationError('Notifications could not be loaded.');
    } finally {
      setIsLoadingNotifications(false);
    }
  }, []);

  useEffect(() => {
    void refreshNotifications();
  }, [refreshNotifications]);

  useEffect(() => {
    if (!isNotificationsOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsNotificationsOpen(false);
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isNotificationsOpen]);

  const openNotification = (notification: Notification) => {
    setNotifications((current) =>
      current.filter((item) => item.id !== notification.id)
    );
    setUnreadCount((count) => Math.max(0, count - 1));
    setIsNotificationsOpen(false);
    navigate(`/inbox/${notification.id}`);
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  const initials =
    user?.name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-20 flex items-center justify-between px-6 bg-surface/80 backdrop-blur-xl border-b border-white/10 z-30">
      
      {/* Greeting */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold font-headline text-on-surface">
          Good Evening, {firstName} 👋
        </h2>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">

        {/* Ask AI */}
        <button
          onClick={() => navigate('/ai-chat')}
          className="p-2 text-primary hover:bg-white/5 rounded-full transition-all active:scale-95 flex items-center gap-2 px-3 py-1.5 border border-primary/20 bg-primary/10 text-xs font-bold"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              const willOpen = !isNotificationsOpen;
              setIsNotificationsOpen(willOpen);
              if (willOpen) void refreshNotifications();
            }}
            className="p-2.5 text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-full transition-colors relative"
            aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
            aria-haspopup="dialog"
            aria-expanded={isNotificationsOpen}
            aria-controls="notifications-panel"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-5 h-5 rounded-full bg-error px-1 text-[10px] font-bold leading-5 text-white text-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <section
              id="notifications-panel"
              role="dialog"
              aria-label="Notifications"
              className="absolute right-0 top-full z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-surface-container shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div>
                  <h3 className="text-sm font-bold text-on-surface">Notifications</h3>
                  <p className="text-xs text-on-surface-variant">
                    {unreadCount} unread {unreadCount === 1 ? 'message' : 'messages'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="rounded-lg p-2 text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
                  aria-label="Close notifications"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {isLoadingNotifications ? (
                  <p className="px-4 py-8 text-center text-sm text-on-surface-variant">
                    Loading notifications...
                  </p>
                ) : notificationError ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-error">{notificationError}</p>
                    <button
                      type="button"
                      onClick={() => void refreshNotifications()}
                      className="mt-2 text-xs font-semibold text-primary hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center px-4 py-8 text-center">
                    <Check className="mb-2 h-5 w-5 text-primary" />
                    <p className="text-sm font-semibold text-on-surface">You’re all caught up</p>
                    <p className="mt-1 text-xs text-on-surface-variant">New unread emails will appear here.</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => openNotification(notification)}
                      className="block w-full border-b border-white/5 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-white/5"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-semibold text-on-surface">
                            {notification.senderName}
                          </span>
                          <span className="mt-1 block truncate text-sm font-bold text-on-surface">
                            {notification.subject}
                          </span>
                        </span>
                        <span className="shrink-0 text-[10px] text-on-surface-variant">
                          {formatRelativeTime(notification.receivedAt)}
                        </span>
                      </span>
                      <span className="mt-1 block truncate text-xs text-on-surface-variant">
                        {notification.snippet}
                      </span>
                    </button>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsNotificationsOpen(false);
                  navigate('/inbox');
                }}
                className="flex w-full items-center justify-center gap-2 border-t border-white/10 px-4 py-3 text-xs font-semibold text-primary hover:bg-white/5"
              >
                <Inbox className="h-4 w-4" />
                View inbox
              </button>
            </section>
          )}
        </div>

        {/* User Avatar */}
        <button
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden ring-2 ring-primary/30 cursor-pointer hover:ring-primary transition-all flex items-center justify-center"
          aria-label="Open account settings"
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name || 'User Avatar'}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-sm font-bold text-primary">
              {initials}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};