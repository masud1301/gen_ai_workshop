import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  MapPin,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';

export const StudentComplaintsPage: React.FC = () => {
  const { complaints } = useComplaints();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // If student role, filter to their complaints or show all with clear tag
  const isStudent = currentUser.role === 'student';
  const baseList = isStudent
    ? complaints.filter(c => c.submittedBy.id === currentUser.id)
    : complaints;

  const filtered = baseList.filter(comp => {
    if (activeTab === 'active' && (comp.status === 'resolved' || comp.status === 'closed')) return false;
    if (activeTab === 'resolved' && comp.status !== 'resolved' && comp.status !== 'closed') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        comp.title.toLowerCase().includes(q) ||
        comp.location.toLowerCase().includes(q) ||
        comp.assignedDepartmentName.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in" id="student-complaints-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-theme-muted mb-1">
            <Link to="/student/dashboard" className="hover:text-theme-primary">Dashboard</Link>
            <span>/</span>
            <span className="text-theme-primary font-semibold">
              {isStudent ? 'My Complaints' : 'All Issues'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-theme-primary">
            {isStudent ? 'My Complaints' : 'Campus Issues'}
          </h1>
          <p className="text-xs sm:text-sm text-theme-secondary mt-1">
            Track reported complaints and follow resolution progress in real time.
          </p>
        </div>

        <Link
          to="/student/report"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold shadow-md transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Issue</span>
        </Link>
      </div>

      {/* Tabs & Search */}
      <div className="p-4 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-4">
        {/* Simple Tabs: All, Active, Resolved */}
        <div className="flex items-center gap-2 border-b border-theme-subtle pb-3">
          {[
            { id: 'all', label: 'All', count: baseList.length },
            { id: 'active', label: 'Active', count: baseList.filter(c => c.status !== 'resolved' && c.status !== 'closed').length },
            { id: 'resolved', label: 'Resolved', count: baseList.filter(c => c.status === 'resolved' || c.status === 'closed').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-theme-secondary hover:text-theme-primary hover:bg-surface-hover'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-surface-elevated text-theme-muted border border-theme-subtle'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, location, or department..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      {/* Complaints List */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-theme-subtle bg-surface text-center space-y-3">
          <Clock className="w-10 h-10 text-theme-muted mx-auto" />
          <h3 className="text-sm font-bold text-theme-primary">No complaints found</h3>
          <p className="text-xs text-theme-muted">
            {searchQuery
              ? 'Try searching for a different keyword or location.'
              : 'There are no complaints under this tab.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(comp => (
            <div
              key={comp.id}
              onClick={() => navigate(`/student/complaints/${comp.id}`)}
              className="p-5 rounded-2xl border border-theme-subtle bg-surface hover:border-theme-strong hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <h3 className="text-sm font-bold text-theme-primary group-hover:text-brand-primary transition-colors">
                  {comp.title}
                </h3>
                <div className="flex items-center gap-2 shrink-0">
                  <PriorityBadge priority={comp.priority} size="sm" />
                  <StatusBadge status={comp.status} size="sm" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-theme-muted mt-3 pt-3 border-t border-theme-subtle">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {comp.location}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {comp.assignedDepartmentName}
                </span>
                <span className="text-[11px] ml-auto">
                  {new Date(comp.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
