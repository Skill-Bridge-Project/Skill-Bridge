import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  ArrowLeft,
  RefreshCw,
  BriefcaseBusiness,
  MessageCircle,
  Info,
  BellOff,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export default function Notifications() {
  const { token, user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = useCallback(
    async (refresh = false) => {
      if (!token) {
        setNotifications([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await api.get('/notifications');

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.notifications ||
            response.data?.data ||
            [];

        const safeData = Array.isArray(data) ? data : [];

        setNotifications(safeData);

        // Temporary debugging: remove after confirming the issue is fixed.
        console.log('Logged-in user:', {
          id: user?._id,
          role: user?.role,
        });

        console.table(
          safeData.map((n) => ({
            id: n._id,
            title: n.title,
            message: n.message,
            link: n.link,
          }))
        );
      } catch (error) {
        console.error(
          'Notifications error:',
          error.response?.status,
          error.response?.data || error.message
        );

        toast.error(
          error.response?.data?.message ||
            'Unable to load notifications.'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token, user]
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    const item = notifications.find((n) => n._id === id);

    if (!item || item.read) return;

    setUpdatingId(id);

    try {
      await api.put(`/notifications/${id}/read`, {});

      setNotifications((previous) =>
        previous.map((n) =>
          n._id === id ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Could not update notification.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const markAllAsRead = async () => {
    if (!unreadCount || markingAll) return;

    setMarkingAll(true);

    try {
      await api.put('/notifications/read-all', {});

      setNotifications((previous) =>
        previous.map((n) => ({ ...n, read: true }))
      );

      toast.success('All notifications marked as read.');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Could not update notifications.'
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const deleteNotification = async (id) => {
    setUpdatingId(id);

    try {
      await api.delete(`/notifications/${id}`);

      setNotifications((previous) =>
        previous.filter((n) => n._id !== id)
      );

      toast.success('Notification deleted.');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Could not delete notification.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getType = (notification) => {
    const text =
      `${notification.title || ''} ${notification.message || ''}`
        .toLowerCase();

    if (
      text.includes('message') ||
      text.includes('texted') ||
      text.includes('sent you a message')
    ) {
      return 'message';
    }

    if (
      text.includes('application') ||
      text.includes('job') ||
      text.includes('interview')
    ) {
      return 'job';
    }

    return 'general';
  };

  const getIcon = (type) => {
    if (type === 'message') return <MessageCircle size={20} />;
    if (type === 'job') return <BriefcaseBusiness size={20} />;
    return <Info size={20} />;
  };

  const formatDate = (date) => {
    if (!date) return '';

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return '';

    return parsed.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const dashboardPath =
    user?.role === 'employer'
      ? '/employer/dashboard'
      : '/student/dashboard';

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });
const getNotificationLink = (notification) => {
  const link = notification.link || '';

  if (user?.role === 'employer') {
    if (link.includes('/notifications')) {
      return '/notifications';
    }

    if (link.includes('/applicants')) {
      return '/employer/manage-applicants';
    }

    if (link.startsWith('/student/')) {
      return '/employer/manage-applicants';
    }
  }

  if (user?.role === 'student') {
    if (link.includes('/employer/')) {
      return '/student/applications';
    }

    if (link === '/applications') {
      return '/student/applications';
    }

    if (link.startsWith('/interviews')) {
      return '/student/applications';
    }
  }

  return link || '/';
};
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:py-10">
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          to={dashboardPath}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Bell size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Notifications
                </h1>

                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
                  Stay updated on job applications, messages, and activity on SkillBridge.
                </p>

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                    : "You're all caught up"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => fetchNotifications(true)}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? 'animate-spin' : ''}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={markAllAsRead}
                disabled={!unreadCount || markingAll}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
              >
                <CheckCheck size={16} />
                {markingAll ? 'Updating...' : 'Mark all read'}
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All notifications' },
                { value: 'unread', label: 'Unread' },
                { value: 'read', label: 'Read' },
              ].map((option) => {
                const active = filter === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilter(option.value)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? 'border-blue-700 bg-blue-700 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {option.label}

                    {option.value === 'unread' && unreadCount > 0 && (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-xs ${
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-sm text-slate-500">
              Showing {filteredNotifications.length} of {notifications.length}
            </p>
          </div>
        </section>

        <section className="mt-5 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <BellOff size={26} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                {notifications.length === 0
                  ? 'No notifications yet'
                  : 'No notifications found'}
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">
                {notifications.length === 0
                  ? 'Updates about applications and messages will appear here when there is new activity.'
                  : 'Try another filter to see your notifications.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const type = getType(notification);
              const busy = updatingId === notification._id;

              return (
                <article
                  key={notification._id}
                  className={`rounded-2xl border p-4 shadow-sm transition hover:shadow-md sm:p-5 ${
                    notification.read
                      ? 'border-slate-200 bg-white'
                      : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        type === 'message'
                          ? 'bg-indigo-100 text-indigo-800'
                          : type === 'job'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {getIcon(type)}

                      {!notification.read && (
                        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-blue-50 bg-blue-700" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h2 className="break-words text-base font-bold text-slate-900">
                            {notification.title || 'Notification'}
                          </h2>

                          <p className="mt-1 text-xs font-medium text-slate-500">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>

                        {!notification.read && (
                          <span className="shrink-0 rounded-full border border-blue-200 bg-white px-2.5 py-1 text-xs font-bold text-blue-800">
                            Unread
                          </span>
                        )}
                      </div>

                      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                        {notification.message || 'You have a new update.'}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-slate-200 pt-3">
                        {notification.link && (
                          <Link
to={getNotificationLink(notification)}
                            onClick={() => {
                              if (!notification.read) {
                                markAsRead(notification._id);
                              }
                            }}
                            className="inline-flex items-center gap-1 text-sm font-bold text-blue-700 hover:text-blue-900 hover:underline"
                          >
                            {type === 'message'
                              ? 'Open conversation'
                              : 'View details'}
                            <ChevronRight size={16} />
                          </Link>
                        )}

                        {!notification.read && (
                          <button
                            type="button"
                            onClick={() => markAsRead(notification._id)}
                            disabled={busy}
                            className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 transition hover:text-blue-800 disabled:opacity-50"
                          >
                            <Check size={15} />
                            Mark as read
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => deleteNotification(notification._id)}
                          disabled={busy}
                          className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-slate-600 transition hover:text-red-700 disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <p className="mt-6 text-center text-xs text-slate-500">
          SkillBridge · Your updates in one place
        </p>
      </div>
    </main>
  );
}
