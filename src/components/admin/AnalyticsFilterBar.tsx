import React from 'react';
import { Filter, RotateCcw, Calendar, Tag, Building2, AlertTriangle, Activity, MapPin } from 'lucide-react';
import { StandardCategory, StandardPriority } from '../../types';
import { STANDARD_CATEGORIES } from '../../services/adminAnalyticsService';
import { Department } from '../../types';

export interface AnalyticsFilterState {
  dateRange: 'all' | 'today' | '7days' | '30days' | 'this_quarter';
  category: string; // 'all' or StandardCategory
  departmentId: string; // 'all' or specific id
  priority: string; // 'all' or StandardPriority
  status: string; // 'all' | 'Open' | 'In Progress' | 'Resolved'
  location: string; // 'all' or location name
}

interface AnalyticsFilterBarProps {
  filters: AnalyticsFilterState;
  onChange: (filters: AnalyticsFilterState) => void;
  departments: Department[];
  locations: string[];
}

export const AnalyticsFilterBar: React.FC<AnalyticsFilterBarProps> = ({
  filters,
  onChange,
  departments,
  locations,
}) => {
  const isFiltered =
    filters.dateRange !== 'all' ||
    filters.category !== 'all' ||
    filters.departmentId !== 'all' ||
    filters.priority !== 'all' ||
    filters.status !== 'all' ||
    filters.location !== 'all';

  const resetFilters = () => {
    onChange({
      dateRange: 'all',
      category: 'all',
      departmentId: 'all',
      priority: 'all',
      status: 'all',
      location: 'all',
    });
  };

  return (
    <div className="rounded-2xl border border-theme-subtle bg-surface p-4 sm:p-5 shadow-sm space-y-3.5" id="analytics-filter-bar">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-primary">
              Global Analytics Filters
            </h3>
            <p className="text-[11px] text-theme-muted">
              Dynamically updates all KPIs, category charts, department workloads, and insights
            </p>
          </div>
        </div>

        {isFiltered && (
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* 1. Date Range */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-theme-muted uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={e => onChange({ ...filters, dateRange: e.target.value as any })}
            className="w-full text-xs py-2 px-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-theme-primary focus:outline-none focus:border-brand-primary cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7days">Past 7 Days</option>
            <option value="30days">Past 30 Days</option>
            <option value="this_quarter">Current Quarter</option>
          </select>
        </div>

        {/* 2. Category */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-theme-muted uppercase tracking-wider flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Category
          </label>
          <select
            value={filters.category}
            onChange={e => onChange({ ...filters, category: e.target.value })}
            className="w-full text-xs py-2 px-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-theme-primary focus:outline-none focus:border-brand-primary cursor-pointer"
          >
            <option value="all">All Categories</option>
            {STANDARD_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Department */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-theme-muted uppercase tracking-wider flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            Department
          </label>
          <select
            value={filters.departmentId}
            onChange={e => onChange({ ...filters, departmentId: e.target.value })}
            className="w-full text-xs py-2 px-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-theme-primary focus:outline-none focus:border-brand-primary cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Priority */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-theme-muted uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={e => onChange({ ...filters, priority: e.target.value })}
            className="w-full text-xs py-2 px-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-theme-primary focus:outline-none focus:border-brand-primary cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="Emergency">Emergency</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* 5. Status */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-theme-muted uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3 h-3" />
            Status
          </label>
          <select
            value={filters.status}
            onChange={e => onChange({ ...filters, status: e.target.value })}
            className="w-full text-xs py-2 px-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-theme-primary focus:outline-none focus:border-brand-primary cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open Issues</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* 6. Location */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-theme-muted uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Location
          </label>
          <select
            value={filters.location}
            onChange={e => onChange({ ...filters, location: e.target.value })}
            className="w-full text-xs py-2 px-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-theme-primary focus:outline-none focus:border-brand-primary cursor-pointer"
          >
            <option value="all">All Campus Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
