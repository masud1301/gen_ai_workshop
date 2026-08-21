import React from 'react';
import { Building2, Clock, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { Department, Complaint } from '../../types';
import { normalizeStatus } from '../../services/adminAnalyticsService';

interface DepartmentAnalyticsSectionProps {
  departments: Department[];
  complaints: Complaint[];
}

export const DepartmentAnalyticsSection: React.FC<DepartmentAnalyticsSectionProps> = ({
  departments,
  complaints,
}) => {
  // Derive real statistics per department strictly from complaints array
  const departmentStats = departments.map((dept) => {
    const deptComplaints = complaints.filter(
      (c) =>
        c.department_id === dept.id ||
        c.assignedDepartmentId === dept.id ||
        (c.assignedDepartmentName && c.assignedDepartmentName.toLowerCase() === dept.name.toLowerCase())
    );

    const total = deptComplaints.length;
    const openCount = deptComplaints.filter((c) => normalizeStatus(c.status) === 'open').length;
    const inProgressCount = deptComplaints.filter((c) => normalizeStatus(c.status) === 'in_progress').length;
    const resolvedCount = deptComplaints.filter(
      (c) => normalizeStatus(c.status) === 'resolved' || normalizeStatus(c.status) === 'closed'
    ).length;

    const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 100;

    return {
      department: dept,
      total,
      openCount,
      inProgressCount,
      resolvedCount,
      activeLoad: openCount + inProgressCount,
      resolutionRate,
    };
  });

  // Sort by active workload descending
  const sortedStats = [...departmentStats].sort((a, b) => b.total - a.total);
  const totalDepartmentComplaints = complaints.length;

  return (
    <div className="p-6 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-4" id="department-analytics-section">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-theme-primary">Department Workload & Analytics</h3>
            <p className="text-xs text-theme-muted">Actual ticket queues, active workload, and resolution rates</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface-elevated text-theme-primary border border-theme-subtle">
          {departments.length} Departments
        </span>
      </div>

      {departments.length === 0 ? (
        <div className="p-8 text-center bg-surface-elevated/40 rounded-xl border border-dashed border-theme-subtle">
          <Layers className="w-8 h-8 mx-auto text-theme-muted mb-2 opacity-50" />
          <p className="text-xs font-semibold text-theme-primary">No departments available</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-theme-subtle text-theme-muted">
                <th className="pb-3 font-semibold">Department</th>
                <th className="pb-3 font-semibold text-center">Total Tickets</th>
                <th className="pb-3 font-semibold text-center">Open</th>
                <th className="pb-3 font-semibold text-center">In Progress</th>
                <th className="pb-3 font-semibold text-center">Resolved</th>
                <th className="pb-3 font-semibold text-right">Workload Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {sortedStats.map(({ department, total, openCount, inProgressCount, resolvedCount, activeLoad }) => {
                const sharePct = totalDepartmentComplaints > 0 ? Math.round((total / totalDepartmentComplaints) * 100) : 0;

                return (
                  <tr key={department.id} className="hover:bg-surface-elevated/60 transition-colors">
                    <td className="py-3.5">
                      <div className="font-bold text-theme-primary">{department.name}</div>
                      <div className="text-[11px] text-theme-muted">{department.headName || department.code || 'Campus Division'}</div>
                    </td>

                    <td className="py-3.5 text-center">
                      <span className="font-mono font-bold text-theme-primary px-2 py-0.5 rounded bg-surface-elevated border border-theme-subtle">
                        {total}
                      </span>
                    </td>

                    <td className="py-3.5 text-center">
                      <span className={`font-mono font-semibold ${openCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-theme-muted'}`}>
                        {openCount}
                      </span>
                    </td>

                    <td className="py-3.5 text-center">
                      <span className={`font-mono font-semibold ${inProgressCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-theme-muted'}`}>
                        {inProgressCount}
                      </span>
                    </td>

                    <td className="py-3.5 text-center">
                      <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {resolvedCount}
                      </span>
                    </td>

                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                          <div
                            className="h-full rounded-full bg-brand-primary"
                            style={{ width: `${sharePct}%` }}
                          />
                        </div>
                        <span className="font-mono font-semibold text-theme-primary w-8 text-right">
                          {sharePct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
