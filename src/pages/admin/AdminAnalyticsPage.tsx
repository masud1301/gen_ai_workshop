import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Repeat,
  MapPin,
  Building2,
  Lightbulb,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import {
  detectRecurringProblems,
  generateAIInsights,
  normalizeToStandardCategory,
  normalizeStatus
} from '../../services/adminAnalyticsService';
import { StandardCategory } from '../../types';

export const AdminAnalyticsPage: React.FC = () => {
  const { complaints, departments } = useComplaints();

  // 1. Recurring Issues (from real database)
  const recurringClusters = useMemo(() => {
    return detectRecurringProblems(complaints);
  }, [complaints]);

  // 2. Frequently Reported Locations (from real database)
  const locationHotspots = useMemo(() => {
    const map: Record<string, { total: number; open: number; resolved: number }> = {};
    complaints.forEach(c => {
      const loc = (c.location || c.building || 'Campus Zone').trim();
      if (!map[loc]) {
        map[loc] = { total: 0, open: 0, resolved: 0 };
      }
      map[loc].total += 1;
      const s = normalizeStatus(c.status);
      if (s === 'resolved' || s === 'closed') {
        map[loc].resolved += 1;
      } else {
        map[loc].open += 1;
      }
    });
    return Object.entries(map)
      .map(([location, data]) => ({ location, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [complaints]);

  // 3. Department Workload (from real database)
  const departmentWorkloads = useMemo(() => {
    const map: Record<string, { name: string; total: number; open: number; resolved: number }> = {};
    
    // Initialize with known departments
    departments.forEach(d => {
      map[d.id] = { name: d.name, total: 0, open: 0, resolved: 0 };
    });

    complaints.forEach(c => {
      const deptId = c.department_id || c.assignedDepartmentId || 'dept_facility_management';
      const deptName = c.assignedDepartmentName || departments.find(d => d.id === deptId)?.name || 'General Maintenance';
      
      if (!map[deptId]) {
        map[deptId] = { name: deptName, total: 0, open: 0, resolved: 0 };
      }
      map[deptId].total += 1;
      const s = normalizeStatus(c.status);
      if (s === 'resolved' || s === 'closed') {
        map[deptId].resolved += 1;
      } else {
        map[deptId].open += 1;
      }
    });

    return Object.values(map).sort((a, b) => b.open - a.open);
  }, [complaints, departments]);

  // 4. AI Recommendations (from real database)
  const aiInsights = useMemo(() => {
    return generateAIInsights(complaints, departments);
  }, [complaints, departments]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in" id="admin-insights-page">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-theme-muted mb-1">
          <Link to="/admin/dashboard" className="hover:text-theme-primary">Admin Dashboard</Link>
          <span>/</span>
          <span className="text-theme-primary font-semibold">AI Insights</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-theme-primary">
          Campus Intelligence & AI Insights
        </h1>
        <p className="text-xs sm:text-sm text-theme-secondary mt-1">
          Actionable summaries, recurring patterns, and smart facility recommendations derived from reported complaints.
        </p>
      </div>

      {/* 4 Clean Sections:
          1. Recurring Issues
          2. Frequently Reported Locations
          3. Department Workload
          4. AI Recommendations
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Recurring Issues */}
        <div className="p-6 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Repeat className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-theme-primary">
                Recurring Issues
              </h2>
            </div>
            <span className="text-xs font-mono text-theme-muted">
              {recurringClusters.length} patterns detected
            </span>
          </div>

          <div className="space-y-3">
            {recurringClusters.length === 0 ? (
              <p className="text-xs text-theme-muted py-4 text-center">
                No repeated issue clusters detected across campus.
              </p>
            ) : (
              recurringClusters.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface-elevated border border-theme-subtle space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-theme-primary">
                      {item.category}
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                      {item.count} reports
                    </span>
                  </div>
                  <p className="text-theme-muted text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {item.location}
                  </p>
                  <p className="text-theme-secondary text-[11px] pt-1">
                    {item.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Frequently Reported Locations */}
        <div className="p-6 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-theme-primary">
                Frequently Reported Locations
              </h2>
            </div>
            <span className="text-xs font-mono text-theme-muted">
              By complaint volume
            </span>
          </div>

          <div className="space-y-3">
            {locationHotspots.length === 0 ? (
              <p className="text-xs text-theme-muted py-4 text-center">
                No location hotspots identified yet.
              </p>
            ) : (
              locationHotspots.slice(0, 4).map((loc, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface-elevated border border-theme-subtle space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-theme-primary">
                      {loc.location}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-theme-primary">
                      {loc.total} complaints
                    </span>
                  </div>

                  {/* Visual volume bar */}
                  <div className="w-full bg-theme-subtle h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (loc.total / Math.max(1, locationHotspots[0]?.total || 1)) * 100)}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-theme-muted pt-0.5">
                    <span>Active: {loc.open}</span>
                    <span>Resolved: {loc.resolved}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. Department Workload */}
        <div className="p-6 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-theme-primary">
                Department Workload
              </h2>
            </div>
            <span className="text-xs font-mono text-theme-muted">
              Capacity & Resolution
            </span>
          </div>

          <div className="space-y-3">
            {departmentWorkloads.map((dept, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-surface-elevated border border-theme-subtle space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-theme-primary">
                    {dept.name}
                  </span>
                  <span className="text-[11px] font-bold text-brand-primary">
                    {dept.open} open issues
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-theme-muted pt-1 border-t border-theme-subtle">
                  <span>Total Assigned: {dept.total}</span>
                  <span>Resolved: {dept.resolved}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. AI Recommendations */}
        <div className="p-6 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-theme-primary">
                AI Recommendations
              </h2>
            </div>
            <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">
              Automated
            </span>
          </div>

          <div className="space-y-3">
            {aiInsights.length === 0 ? (
              <p className="text-xs text-theme-muted py-4 text-center">
                No special actions required at this time.
              </p>
            ) : (
              aiInsights.slice(0, 3).map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-1.5 text-xs"
                >
                  <h3 className="font-bold text-theme-primary flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    {rec.title}
                  </h3>
                  <p className="text-theme-secondary text-[11px] leading-relaxed">
                    {rec.description}
                  </p>
                  {rec.recommendation && (
                    <p className="text-[11px] text-theme-muted pt-1 border-t border-purple-500/10">
                      <span className="font-bold text-purple-700 dark:text-purple-300">Action: </span>
                      {rec.recommendation}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
