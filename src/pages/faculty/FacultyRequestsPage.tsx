import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { School, Search, Filter, PlusCircle, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { PriorityBadge, StatusBadge, CategoryBadge } from '../../components/common/Badge';

export const FacultyRequestsPage: React.FC = () => {
  const { complaints } = useComplaints();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const facultyComplaints = complaints.filter(
    c => c.category === 'classroom_equipment' || c.category === 'it_network' || c.submittedBy.role === 'faculty'
  );

  const filtered = facultyComplaints.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.trackingNumber.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in" id="faculty-requests-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-theme-muted mb-1">
            <Link to="/faculty/dashboard" className="hover:text-theme-primary">Faculty Portal</Link>
            <span>/</span>
            <span className="text-theme-primary font-semibold">Academic Requests</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-theme-primary">
            Academic & Lab Requests Directory
          </h1>
          <p className="text-xs text-theme-secondary mt-1">
            Track active repair orders for lecture hall AV, lab equipment, and faculty research facilities.
          </p>
        </div>

        <Link
          to="/student/report"
          className="px-4 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-hover shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          New Request
        </Link>
      </div>

      <div className="p-4 rounded-2xl border border-theme-subtle bg-surface shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search academic requests..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-brand-primary"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-brand-primary"
        >
          <option value="all">All Statuses</option>
          <option value="submitted">Submitted</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(comp => (
          <div
            key={comp.id}
            className="p-5 rounded-2xl border border-theme-subtle bg-surface hover:border-theme-strong shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-brand-primary">{comp.trackingNumber}</span>
                <CategoryBadge category={comp.category} size="sm" />
                <PriorityBadge priority={comp.priority} size="sm" />
              </div>
              <StatusBadge status={comp.status} size="sm" />
            </div>

            <Link to={`/student/complaints/${comp.id}`}>
              <h3 className="text-sm font-bold text-theme-primary group-hover:text-brand-primary transition-colors">
                {comp.title}
              </h3>
            </Link>

            <p className="text-xs text-theme-secondary mt-1 line-clamp-2">
              {comp.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-theme-subtle text-xs text-theme-muted">
              <span>📍 {comp.building} ({comp.roomNumber || comp.location}) • {comp.assignedDepartmentName}</span>
              <Link
                to={`/student/complaints/${comp.id}`}
                className="px-3 py-1 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-theme-subtle text-xs font-semibold text-theme-primary transition-colors flex items-center gap-1"
              >
                Track SLA <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
