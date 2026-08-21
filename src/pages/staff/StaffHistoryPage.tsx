import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Star, Clock, Search, ArrowRight, UserCheck } from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { PriorityBadge, CategoryBadge } from '../../components/common/Badge';

export const StaffHistoryPage: React.FC = () => {
  const { complaints } = useComplaints();
  const [search, setSearch] = useState('');

  const resolvedComplaints = complaints.filter(c => c.status === 'resolved' || c.status === 'closed');
  const filtered = resolvedComplaints.filter(c => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.trackingNumber.toLowerCase().includes(q) ||
        c.building.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in" id="staff-history-page">
      <div>
        <div className="flex items-center gap-2 text-xs text-theme-muted mb-1">
          <Link to="/staff/dashboard" className="hover:text-theme-primary">Staff Dispatch</Link>
          <span>/</span>
          <span className="text-theme-primary font-semibold">Completed History</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-theme-primary">
          Resolved Maintenance Archive
        </h1>
        <p className="text-xs text-theme-secondary mt-1">
          Historical record of completed repairs, resolution durations, and student satisfaction ratings.
        </p>
      </div>

      <div className="p-4 rounded-2xl border border-theme-subtle bg-surface shadow-sm max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search completed jobs..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(comp => (
          <div
            key={comp.id}
            className="p-5 rounded-2xl border border-theme-subtle bg-surface hover:border-theme-strong shadow-sm transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-brand-primary">{comp.trackingNumber}</span>
                <CategoryBadge category={comp.category} size="sm" />
                <PriorityBadge priority={comp.priority} size="sm" />
              </div>
              <div className="flex items-center gap-2">
                {comp.satisfactionRating ? (
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    {comp.satisfactionRating}/5 Rating
                  </span>
                ) : (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                  </span>
                )}
              </div>
            </div>

            <Link to={`/student/complaints/${comp.id}`}>
              <h3 className="text-sm font-bold text-theme-primary hover:text-brand-primary transition-colors">
                {comp.title}
              </h3>
            </Link>

            <p className="text-xs text-theme-secondary mt-1 line-clamp-1">
              {comp.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-theme-subtle text-xs text-theme-muted">
              <span>📍 {comp.building} ({comp.roomNumber || comp.location}) • Resolved on {new Date(comp.updatedAt).toLocaleDateString()}</span>
              <Link
                to={`/student/complaints/${comp.id}`}
                className="px-3 py-1 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-theme-subtle text-xs font-semibold text-theme-primary transition-colors flex items-center gap-1"
              >
                View Log <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
