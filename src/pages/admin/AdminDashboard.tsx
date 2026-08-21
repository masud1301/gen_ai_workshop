import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  MapPin,
  Building2,
  FolderOpen
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import {
  normalizeStatus,
  normalizePriority,
  normalizeToStandardCategory,
  generateAIInsights
} from '../../services/adminAnalyticsService';

export const AdminDashboard: React.FC = () => {
  const { complaints, departments } = useComplaints();
  const navigate = useNavigate();

  // 1. Calculate Real Metric Counts
  const openIssues = complaints.filter(c => {
    const s = normalizeStatus(c.status);
    return s === 'open';
  }).length;

  const highPriorityIssues = complaints.filter(c => {
    const p = normalizePriority(c.priority);
    return (p === 'High' || p === 'Emergency' || c.priority === 'critical' || c.priority === 'high') && c.status !== 'resolved' && c.status !== 'closed';
  }).length;

  const inProgressIssues = complaints.filter(c => {
    const s = normalizeStatus(c.status);
    return s === 'in_progress';
  }).length;

  const resolvedIssues = complaints.filter(c => {
    const s = normalizeStatus(c.status);
    return s === 'resolved' || s === 'closed';
  }).length;

  // 2. Derive Real AI Insights from Database
  const aiInsights = useMemo(() => {
    return generateAIInsights(complaints, departments);
  }, [complaints, departments]);

  // Primary prominent AI insight from actual records
  const primaryInsight = aiInsights.length > 0
    ? aiInsights[0]
    : {
        title: 'Campus Infrastructure Analysis',
        summary: 'Maintenance operations running within standard parameters across all campus facilities.',
        recommendation: 'Continue regular preventive maintenance checks.'
      };

  const recentIssues = complaints.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in" id="admin-dashboard">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-theme-primary">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-theme-secondary mt-1">
            Overview of campus facility health, active complaint resolution, and AI operational insights.
          </p>
        </div>

        <Link
          to="/admin/analytics"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-theme-subtle text-theme-primary text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-brand-primary" />
          <span>View Detailed Insights</span>
        </Link>
      </div>

      {/* Four Summary Cards: Open Issues, High Priority, In Progress, Resolved */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/student/complaints')}
          className="p-5 rounded-2xl border border-blue-500/20 bg-surface shadow-sm hover:border-blue-500/40 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Open Issues
            </span>
            <AlertCircle className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-theme-primary">
            {openIssues}
          </p>
          <p className="text-xs text-theme-muted">Awaiting staff assignment</p>
        </div>

        <div
          onClick={() => navigate('/student/complaints')}
          className="p-5 rounded-2xl border border-rose-500/20 bg-surface shadow-sm hover:border-rose-500/40 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              High Priority
            </span>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-theme-primary">
            {highPriorityIssues}
          </p>
          <p className="text-xs text-theme-muted">Urgent or safety escalation</p>
        </div>

        <div
          onClick={() => navigate('/student/complaints')}
          className="p-5 rounded-2xl border border-amber-500/20 bg-surface shadow-sm hover:border-amber-500/40 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              In Progress
            </span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-theme-primary">
            {inProgressIssues}
          </p>
          <p className="text-xs text-theme-muted">Under active repair</p>
        </div>

        <div
          onClick={() => navigate('/student/complaints')}
          className="p-5 rounded-2xl border border-emerald-500/20 bg-surface shadow-sm hover:border-emerald-500/40 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Resolved
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-theme-primary">
            {resolvedIssues}
          </p>
          <p className="text-xs text-theme-muted">Completed tickets</p>
        </div>
      </div>

      {/* Primary Real AI Insight Card */}
      <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-theme-primary">
              AI Insight
            </h2>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            Real Database Pattern
          </span>
        </div>

        <div className="space-y-1.5 pl-1">
          <h3 className="text-base font-bold text-theme-primary">
            {primaryInsight.title}
          </h3>
          <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
            {primaryInsight.summary}
          </p>
          {primaryInsight.recommendation && (
            <p className="text-xs text-theme-muted pt-1">
              <span className="font-semibold text-theme-primary">Recommendation: </span>
              {primaryInsight.recommendation}
            </p>
          )}
        </div>
      </div>

      {/* Recent Issues List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-theme-primary">
            Recent Issues
          </h2>
          <Link
            to="/student/complaints"
            className="text-xs text-brand-primary hover:underline font-semibold flex items-center gap-1"
          >
            View All ({complaints.length}) <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentIssues.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-theme-subtle bg-surface">
            <p className="text-xs text-theme-muted">No campus issues logged yet.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-theme-subtle bg-surface shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-theme-subtle bg-surface-elevated/50 text-theme-muted font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Complaint</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-subtle">
                  {recentIssues.map((comp) => (
                    <tr
                      key={comp.id}
                      onClick={() => navigate(`/student/complaints/${comp.id}`)}
                      className="hover:bg-surface-hover transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-semibold text-theme-primary max-w-xs truncate">
                        {comp.title}
                      </td>
                      <td className="py-3.5 px-4 text-theme-secondary">
                        {comp.location}
                      </td>
                      <td className="py-3.5 px-4 text-theme-secondary capitalize">
                        {comp.standardCategory || comp.category.replace('_', ' ')}
                      </td>
                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={comp.priority} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-theme-secondary">
                        {comp.assignedDepartmentName}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <StatusBadge status={comp.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
