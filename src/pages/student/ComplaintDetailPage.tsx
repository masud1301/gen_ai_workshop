import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Sparkles,
  Send,
  User,
  Check,
  Circle
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';

export const ComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { complaints, addComment } = useComplaints();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [commentText, setCommentText] = useState('');

  const complaint = complaints.find(c => c.id === id);

  if (!complaint) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-theme-primary">Complaint Not Found</h2>
        <p className="text-xs text-theme-secondary">The requested ticket does not exist or has been archived.</p>
        <Link
          to="/student/complaints"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Complaints
        </Link>
      </div>
    );
  }

  // Timeline steps
  // Submitted -> AI Analyzed -> Assigned -> In Progress -> Resolved
  const timelineSteps = [
    { id: 'submitted', label: 'Submitted' },
    { id: 'ai_classified', label: 'AI Analyzed' },
    { id: 'assigned', label: 'Assigned' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'resolved', label: 'Resolved' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'submitted':
        return 0;
      case 'ai_classified':
        return 1;
      case 'assigned':
        return 2;
      case 'in_progress':
        return 3;
      case 'resolved':
      case 'closed':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIndex = getStepIndex(complaint.status);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(
      complaint.id,
      currentUser.id,
      currentUser.name,
      currentUser.role,
      commentText.trim(),
      currentUser.avatarUrl,
      false
    );

    setCommentText('');
    showToast('Comment posted', 'Message added to ticket conversation.', 'info');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2 animate-in fade-in" id="complaint-detail-page">
      {/* Header Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/student/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-theme-secondary hover:text-theme-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Complaints
        </Link>

        <div className="flex items-center gap-2">
          <PriorityBadge priority={complaint.priority} size="sm" />
          <StatusBadge status={complaint.status} size="sm" />
        </div>
      </div>

      {/* Main Complaint Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-6">
        <div>
          <span className="text-[11px] font-mono font-bold text-theme-muted block mb-1">
            {complaint.trackingNumber}
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-theme-primary">
            {complaint.title}
          </h1>
        </div>

        {/* Visual Timeline */}
        <div className="pt-2 pb-4 border-y border-theme-subtle">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted mb-4">
            Resolution Progress
          </h3>

          <div className="relative flex items-center justify-between">
            {/* Progress line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-theme-subtle -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-brand-primary -translate-y-1/2 z-0 transition-all duration-500"
              style={{
                width: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%`,
              }}
            />

            {/* Step circles */}
            {timelineSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step.id}
                  className="relative z-10 flex flex-col items-center gap-1.5"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-brand-primary text-white shadow-sm'
                        : 'bg-surface border-2 border-theme-subtle text-theme-muted'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] whitespace-nowrap ${
                      isCurrent
                        ? 'font-bold text-brand-primary'
                        : isCompleted
                        ? 'font-medium text-theme-primary'
                        : 'text-theme-muted'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Original Complaint Description */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted">
            Original Complaint
          </h3>
          <p className="text-sm text-theme-secondary leading-relaxed p-4 rounded-xl bg-surface-elevated border border-theme-subtle">
            {complaint.description}
          </p>
        </div>

        {/* AI Analysis Card */}
        {complaint.aiAnalysis && (
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-theme-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                AI Analysis Summary
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary">
                AI-assisted
              </span>
            </div>
            <p className="text-xs text-theme-secondary leading-relaxed">
              {complaint.aiAnalysis.summary || 'Complaint analyzed and mapped to campus maintenance staff.'}
            </p>
          </div>
        )}

        {/* Key Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-surface-elevated border border-theme-subtle space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
              Location
            </span>
            <p className="text-xs font-semibold text-theme-primary truncate">
              {complaint.location}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-elevated border border-theme-subtle space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
              Category
            </span>
            <p className="text-xs font-semibold text-theme-primary truncate capitalize">
              {complaint.standardCategory || complaint.category.replace('_', ' ')}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-elevated border border-theme-subtle space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
              Priority
            </span>
            <p className="text-xs font-semibold text-theme-primary capitalize">
              {complaint.standardPriority || complaint.priority}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-elevated border border-theme-subtle space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
              Department
            </span>
            <p className="text-xs font-semibold text-theme-primary truncate">
              {complaint.assignedDepartmentName}
            </p>
          </div>
        </div>

        {/* Attached Photo if exists */}
        {complaint.attachments && complaint.attachments.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted">
              Attached Photo
            </h3>
            <div className="w-48 h-36 rounded-xl overflow-hidden border border-theme-subtle">
              <img
                src={complaint.attachments[0]}
                alt="Complaint attachment"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Activity & Updates Stream */}
      <div className="p-6 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-theme-primary">
          Updates & Discussion
        </h3>

        {/* Existing Comments */}
        <div className="space-y-3">
          {(!complaint.comments || complaint.comments.length === 0) ? (
            <p className="text-xs text-theme-muted text-center py-4">
              No comments yet. Any status notes from maintenance staff will appear here.
            </p>
          ) : (
            complaint.comments.map(c => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl bg-surface-elevated border border-theme-subtle space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-theme-primary flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-theme-muted" />
                    {c.userName} ({c.userRole})
                  </span>
                  <span className="text-[10px] text-theme-muted">
                    {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-theme-secondary leading-relaxed pl-5">
                  {c.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Add comment input */}
        <form onSubmit={handleSendComment} className="flex gap-2 pt-2">
          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Add a follow-up note or message for the technician..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-brand-primary"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
