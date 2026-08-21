import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Sparkles, AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { EmptyState } from '../../components/common/EmptyState';

export const StudentNotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useComplaints();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in" id="student-notifications-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-theme-muted mb-1">
            <Link to="/student/dashboard" className="hover:text-theme-primary">Dashboard</Link>
            <span>/</span>
            <span className="text-theme-primary font-semibold">Notifications</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-theme-primary">
            Campus Alerts & Updates
          </h1>
          <p className="text-xs text-theme-secondary mt-1">
            Real-time status updates on your filed complaints, AI similarity clusters, and emergency alerts.
          </p>
        </div>

        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllNotificationsAsRead}
            className="px-3.5 py-2 rounded-xl bg-surface border border-theme-subtle hover:bg-surface-hover text-xs font-semibold text-theme-primary transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-emerald-500" />
            Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications right now"
          description="When your tickets receive updates or campus announcements are posted, they will appear here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                notif.read
                  ? 'bg-surface border-theme-subtle opacity-80'
                  : 'bg-surface border-brand-primary/30 ring-1 ring-brand-primary/10 shadow-sm'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  notif.type === 'campus_alert'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : notif.type === 'ai_insight'
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                }`}
              >
                {notif.type === 'campus_alert' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : notif.type === 'ai_insight' ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-theme-primary">{notif.title}</h4>
                  <span className="text-[10px] text-theme-muted font-mono whitespace-nowrap">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-theme-secondary mt-1 leading-relaxed">{notif.message}</p>

                {notif.link && (
                  <div className="mt-2.5">
                    <Link
                      to={notif.link}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline"
                    >
                      View Complaint Details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
