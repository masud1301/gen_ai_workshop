import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Bell,
  MapPin,
  Building2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';

export const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { complaints, notifications } = useComplaints();
  const navigate = useNavigate();

  const myComplaints = complaints.filter(c => c.submittedBy.id === currentUser.id);
  const activeComplaints = myComplaints.filter(
    c => c.status !== 'resolved' && c.status !== 'closed'
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const recentNotifications = notifications.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in" id="student-dashboard">
      {/* Welcome Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-theme-primary">
          {greeting}, {currentUser.name.split(' ')[0]}
        </h1>
        <p className="text-xs sm:text-sm text-theme-secondary mt-1">
          Welcome to SMARTFIX AI. Easily report campus issues and track their resolution status.
        </p>
      </div>

      {/* Main Action Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-surface to-surface shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              Fast Campus Resolution
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-theme-primary">
              Having a problem on campus?
            </h2>
            <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
              Describe the problem in your own words and SmartFix AI will help route it to the right department.
            </p>
          </div>

          <Link
            to="/student/report"
            id="dashboard-report-issue-btn"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-bold shadow-md hover:shadow-lg transition-all shrink-0 self-start sm:self-center"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Report an Issue</span>
          </Link>
        </div>
      </div>

      {/* Active Complaints & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Complaints (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-primary" />
              <h3 className="text-base font-bold text-theme-primary">Active Complaints</h3>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-surface-elevated text-theme-secondary border border-theme-subtle">
                {activeComplaints.length}
              </span>
            </div>
            {myComplaints.length > 0 && (
              <Link
                to="/student/complaints"
                className="text-xs text-brand-primary hover:underline font-semibold flex items-center gap-1"
              >
                All Complaints ({myComplaints.length}) <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          {activeComplaints.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-theme-subtle bg-surface text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-theme-primary">No Active Complaints</h4>
              <p className="text-xs text-theme-muted max-w-sm mx-auto">
                You currently have no unresolved issues. If you notice any facility or equipment problems, feel free to report them.
              </p>
              <Link
                to="/student/report"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-theme-subtle text-theme-primary text-xs font-semibold transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Report Issue
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeComplaints.map(comp => (
                <div
                  key={comp.id}
                  onClick={() => navigate(`/student/complaints/${comp.id}`)}
                  className="p-4 sm:p-5 rounded-xl border border-theme-subtle bg-surface hover:border-theme-strong hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold text-theme-primary group-hover:text-brand-primary transition-colors">
                      {comp.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={comp.priority} size="sm" />
                      <StatusBadge status={comp.status} size="sm" />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-theme-muted mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-theme-muted" />
                      {comp.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-theme-muted" />
                      {comp.assignedDepartmentName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-primary" />
              <h3 className="text-base font-bold text-theme-primary">Recent Activity</h3>
            </div>
            <Link
              to="/student/notifications"
              className="text-xs text-brand-primary hover:underline font-semibold"
            >
              View all
            </Link>
          </div>

          <div className="p-5 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-3">
            {recentNotifications.length === 0 ? (
              <p className="text-xs text-theme-muted text-center py-6">
                No recent notifications.
              </p>
            ) : (
              recentNotifications.map(notif => (
                <div
                  key={notif.id}
                  className="p-3 rounded-xl border border-theme-subtle bg-surface-elevated/50 text-xs space-y-1"
                >
                  <p className="font-semibold text-theme-primary">{notif.title}</p>
                  <p className="text-[11px] text-theme-secondary line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-theme-muted block pt-1 font-mono">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
