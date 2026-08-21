import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Building2,
  ArrowRight,
  Wrench,
  Sparkles,
  Send,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import { ComplaintStatus } from '../../types';

export const StaffDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { complaints, updateComplaintStatus } = useComplaints();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Selected issue for quick resolve modal
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [statusToUpdate, setStatusToUpdate] = useState<ComplaintStatus>('in_progress');

  // Filter complaints
  const newComplaints = complaints.filter(
    c => c.status === 'submitted' || c.status === 'ai_classified' || c.status === 'assigned'
  );
  const inProgressComplaints = complaints.filter(c => c.status === 'in_progress');
  const resolvedComplaints = complaints.filter(
    c => c.status === 'resolved' || c.status === 'closed'
  );

  // Issues assigned to staff or their department
  const assignedToYou = complaints.filter(
    c => c.status !== 'resolved' && c.status !== 'closed'
  );

  const activeSelectedComplaint = complaints.find(c => c.id === selectedIssueId);

  const handleUpdateStatus = (status: ComplaintStatus) => {
    if (!selectedIssueId) return;
    updateComplaintStatus(selectedIssueId, status, resolutionNote || undefined);
    showToast(
      status === 'resolved' ? 'Issue Marked as Resolved' : 'Status Updated',
      `Complaint is now ${status.replace('_', ' ')}.`,
      'success'
    );
    setSelectedIssueId(null);
    setResolutionNote('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in" id="staff-dashboard">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-theme-primary">
          Staff Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-theme-secondary mt-1">
          Review work orders, update progress, and resolve campus maintenance tickets.
        </p>
      </div>

      {/* Summary Cards: New, In Progress, Resolved */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-blue-500/20 bg-surface shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              New
            </span>
            <AlertCircle className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-theme-primary">
            {newComplaints.length}
          </p>
          <p className="text-xs text-theme-muted">Awaiting maintenance action</p>
        </div>

        <div className="p-5 rounded-2xl border border-amber-500/20 bg-surface shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              In Progress
            </span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-theme-primary">
            {inProgressComplaints.length}
          </p>
          <p className="text-xs text-theme-muted">Currently undergoing repairs</p>
        </div>

        <div className="p-5 rounded-2xl border border-emerald-500/20 bg-surface shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Resolved
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-theme-primary">
            {resolvedComplaints.length}
          </p>
          <p className="text-xs text-theme-muted">Fixed and closed tickets</p>
        </div>
      </div>

      {/* Issues Assigned To You */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-theme-primary">
            Issues Assigned To You
          </h2>
          <span className="text-xs font-mono text-theme-muted">
            {assignedToYou.length} active tickets
          </span>
        </div>

        {assignedToYou.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-theme-subtle bg-surface text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-theme-primary">No pending issues assigned</h3>
            <p className="text-xs text-theme-muted">
              All assigned campus work orders are resolved. Great job!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {assignedToYou.map(comp => (
              <div
                key={comp.id}
                className="p-5 rounded-2xl border border-theme-subtle bg-surface hover:border-theme-strong shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-brand-primary">
                      {comp.trackingNumber}
                    </span>
                    <PriorityBadge priority={comp.priority} size="sm" />
                    <StatusBadge status={comp.status} size="sm" />
                  </div>

                  <h3 className="text-sm font-bold text-theme-primary">
                    {comp.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-theme-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {comp.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {comp.assignedDepartmentName}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {comp.submittedBy.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedIssueId(comp.id);
                      setStatusToUpdate(comp.status === 'in_progress' ? 'resolved' : 'in_progress');
                    }}
                    className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    Open Issue
                  </button>
                  <Link
                    to={`/student/complaints/${comp.id}`}
                    className="p-2 rounded-xl border border-theme-subtle hover:bg-surface-hover text-theme-secondary transition-colors"
                    title="View Full Detail"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Staff Quick Resolution Modal */}
      {activeSelectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-theme-subtle bg-surface shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-theme-subtle pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-brand-primary">
                  {activeSelectedComplaint.trackingNumber}
                </span>
                <h3 className="text-base font-bold text-theme-primary">
                  {activeSelectedComplaint.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIssueId(null)}
                className="text-xs text-theme-muted hover:text-theme-primary"
              >
                ✕
              </button>
            </div>

            {/* Complaint summary */}
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-surface-elevated border border-theme-subtle">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Student</span>
                  <p className="font-semibold text-theme-primary">{activeSelectedComplaint.submittedBy.name}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-elevated border border-theme-subtle">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Location</span>
                  <p className="font-semibold text-theme-primary">{activeSelectedComplaint.location}</p>
                </div>
              </div>

              {activeSelectedComplaint.aiAnalysis && (
                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-brand-primary flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Summary
                  </span>
                  <p className="text-theme-secondary leading-relaxed">
                    {activeSelectedComplaint.aiAnalysis.summary}
                  </p>
                </div>
              )}
            </div>

            {/* Status Change Controls */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-theme-primary">
                Update Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['assigned', 'in_progress', 'resolved'] as ComplaintStatus[]).map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusToUpdate(st)}
                    className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      statusToUpdate === st
                        ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                        : 'border-theme-subtle bg-surface-elevated text-theme-secondary hover:text-theme-primary'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution Note */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-theme-primary">
                Resolution / Progress Note
              </label>
              <textarea
                value={resolutionNote}
                onChange={e => setResolutionNote(e.target.value)}
                placeholder="e.g. Wi-Fi router replaced in Lab 2. Connection verified operational."
                rows={3}
                className="w-full p-3 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-brand-primary resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 pt-2 border-t border-theme-subtle">
              <button
                type="button"
                onClick={() => setSelectedIssueId(null)}
                className="px-4 py-2.5 rounded-xl border border-theme-subtle hover:bg-surface-hover text-xs font-semibold text-theme-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(statusToUpdate)}
                className="flex-1 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold shadow-md transition-colors"
              >
                {statusToUpdate === 'resolved' ? 'Mark as Resolved' : 'Save Status Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
