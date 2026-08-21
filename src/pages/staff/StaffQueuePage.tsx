import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Search,
  Filter,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Building2,
  FileText,
  X,
  Check,
  Send
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PriorityBadge, StatusBadge, CategoryBadge } from '../../components/common/Badge';
import { ComplaintStatus } from '../../types';

export const StaffQueuePage: React.FC = () => {
  const { complaints, updateComplaintStatus, assignComplaint, departments } = useComplaints();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal for adding resolution note / status transition
  const [activeComplaintId, setActiveComplaintId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'in_progress' | 'resolved' | null>(null);
  const [noteText, setNoteText] = useState('');

  const filtered = complaints.filter(comp => {
    if (deptFilter !== 'all' && comp.assignedDepartmentId !== deptFilter && comp.department_id !== deptFilter && comp.category !== deptFilter) return false;
    if (statusFilter !== 'all') {
      const normalizedStatus = comp.status?.toLowerCase().replace(/\s+/g, '_');
      const normalizedFilter = statusFilter.toLowerCase().replace(/\s+/g, '_');
      if (normalizedStatus !== normalizedFilter) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        comp.title?.toLowerCase().includes(q) ||
        comp.trackingNumber?.toLowerCase().includes(q) ||
        comp.location?.toLowerCase().includes(q) ||
        comp.assignedDepartmentName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenStatusModal = (comp: any, type: 'in_progress' | 'resolved') => {
    setActiveComplaintId(comp.id);
    setActionType(type);
    setNoteText(
      type === 'in_progress'
        ? `Technician ${currentUser.name} has arrived on-site and initiated diagnostics/repairs.`
        : `Issue verified and resolved successfully by ${currentUser.name}. Field testing complete.`
    );
  };

  const handleConfirmStatusChange = () => {
    if (!activeComplaintId || !actionType) return;
    const targetComp = complaints.find(c => c.id === activeComplaintId);
    if (!targetComp) return;

    if (actionType === 'in_progress') {
      updateComplaintStatus(activeComplaintId, 'in_progress', noteText || 'Work in progress on-site.');
      showToast('Work In Progress', `Status updated for ${targetComp.trackingNumber}`, 'info');
    } else if (actionType === 'resolved') {
      updateComplaintStatus(activeComplaintId, 'resolved', noteText || 'Issue resolved.');
      showToast('Ticket Resolved', `Resolution saved for ${targetComp.trackingNumber}`, 'success');
    }

    setActiveComplaintId(null);
    setActionType(null);
    setNoteText('');
  };

  return (
    <div className="space-y-6 animate-in fade-in" id="staff-queue-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-theme-muted mb-1">
            <Link to="/staff/dashboard" className="hover:text-theme-primary">Staff Dispatch</Link>
            <span>/</span>
            <span className="text-theme-primary font-semibold">Tickets & Work Queue</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-theme-primary">
            Department Tickets & Work Orders
          </h1>
          <p className="text-xs text-theme-secondary mt-1">
            Open tickets, assign yourself, transition status (Assigned → In Progress → Resolved), and log resolution notes.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl border border-theme-subtle bg-surface shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tickets, SF-001, rooms..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-brand-primary"
          />
        </div>

        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-brand-primary"
        >
          <option value="all">All Departments</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-brand-primary"
        >
          <option value="all">All Statuses</option>
          <option value="submitted">Submitted</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Queue items */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-theme-subtle bg-surface">
            <p className="text-xs text-theme-muted">No tickets match your filters.</p>
          </div>
        ) : (
          filtered.map(comp => {
            const isAssignedToMe = comp.assigned_staff_id === currentUser.id || comp.assignedStaffId === currentUser.id;
            const normalizedStatus = comp.status?.toLowerCase().replace(/\s+/g, '_');
            const isSubmitted = normalizedStatus === 'submitted' || normalizedStatus === 'ai_analyzed' || normalizedStatus === 'ai_classified';
            const isAssigned = normalizedStatus === 'assigned';
            const isInProgress = normalizedStatus === 'in_progress';
            const isResolved = normalizedStatus === 'resolved' || normalizedStatus === 'closed';

            return (
              <div
                key={comp.id}
                className="p-5 rounded-2xl border border-theme-subtle bg-surface hover:border-theme-strong shadow-sm transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-extrabold text-brand-primary px-2 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/20">
                      {comp.trackingNumber}
                    </span>
                    <CategoryBadge category={comp.category} size="sm" />
                    <PriorityBadge priority={comp.priority} size="sm" />
                    <StatusBadge status={comp.status} size="sm" />
                  </div>

                  <Link to={`/student/complaints/${comp.id}`}>
                    <h3 className="text-sm font-bold text-theme-primary hover:text-brand-primary transition-colors">
                      {comp.title || comp.issue}
                    </h3>
                  </Link>

                  <p className="text-xs text-theme-secondary line-clamp-2">
                    {comp.description || comp.original_message}
                  </p>

                  <div className="text-[11px] text-theme-muted flex flex-wrap items-center gap-3 pt-1">
                    <span>📍 {comp.location || comp.building}</span>
                    <span>🏢 {comp.assignedDepartmentName || 'Department'}</span>
                    <span className="font-semibold">
                      👤 {comp.assignedStaffName || (comp.assigned_staff_id ? 'Assigned' : 'Unassigned')}
                    </span>
                  </div>
                </div>

                {/* Workflow Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-theme-subtle flex-wrap">
                  {/* Step 1: Self-assign / Claim */}
                  {isSubmitted && (
                    <button
                      onClick={() => {
                        const deptId = comp.assignedDepartmentId || comp.department_id || 'dept_it_support';
                        const deptName = comp.assignedDepartmentName || 'Department Support';
                        assignComplaint(comp.id, currentUser.id, currentUser.name, deptId, deptName);
                        updateComplaintStatus(comp.id, 'assigned', `Claimed and assigned to ${currentUser.name}`);
                        showToast('Ticket Assigned', `Claimed ${comp.trackingNumber}`, 'success');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Assign to Me</span>
                    </button>
                  )}

                  {/* Step 2: Start Work */}
                  {isAssigned && (
                    <button
                      onClick={() => handleOpenStatusModal(comp, 'in_progress')}
                      className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Start Work</span>
                    </button>
                  )}

                  {/* Step 3: Resolve / Add Note */}
                  {isInProgress && (
                    <button
                      onClick={() => handleOpenStatusModal(comp, 'resolved')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolve Ticket</span>
                    </button>
                  )}

                  {isResolved && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Resolved</span>
                    </span>
                  )}

                  <Link
                    to={`/student/complaints/${comp.id}`}
                    className="px-3 py-2 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-theme-subtle text-theme-primary text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>Open Ticket</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resolution & Status Update Modal */}
      {activeComplaintId && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface border border-theme-subtle rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-theme-subtle">
              <div className="flex items-center gap-2">
                {actionType === 'resolved' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-600" />
                )}
                <h3 className="text-sm font-extrabold text-theme-primary">
                  {actionType === 'resolved' ? 'Resolve Ticket & Add Note' : 'Transition to In Progress'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveComplaintId(null);
                  setActionType(null);
                }}
                className="p-1 rounded-lg text-theme-muted hover:text-theme-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-theme-secondary">
                {actionType === 'resolved' ? 'Resolution Notes *' : 'Work Order Progress Note'}
              </label>
              <textarea
                rows={3}
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder={
                  actionType === 'resolved'
                    ? 'e.g. Replaced faulty HDMI cable and verified projector 1080p display signal with Dr. Vance.'
                    : 'e.g. Technician arrived on site. Running electrical diagnostics.'
                }
                className="w-full p-3 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-brand-primary"
              />
              <p className="text-[11px] text-theme-muted">
                This note will be automatically dispatched to the student and recorded on the ticket history timeline.
              </p>
            </div>

            <div className="pt-3 border-t border-theme-subtle flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveComplaintId(null);
                  setActionType(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-theme-muted hover:text-theme-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusChange}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5 ${
                  actionType === 'resolved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{actionType === 'resolved' ? 'Confirm Resolution' : 'Update Status'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffQueuePage;
