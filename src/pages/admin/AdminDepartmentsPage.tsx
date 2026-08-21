import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, PlusCircle, Sparkles, Clock, Users, CheckCircle2, Settings2, ArrowRight, MapPin } from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { useToast } from '../../context/ToastContext';
import { Department } from '../../types';

export const AdminDepartmentsPage: React.FC = () => {
  const { departments, locations, complaints, updateDepartment } = useComplaints();
  const { showToast } = useToast();

  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [slaHours, setSlaHours] = useState(24);
  const [activeTab, setActiveTab] = useState<'departments' | 'locations'>('departments');

  const handleUpdateSLA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept) return;
    updateDepartment(selectedDept.id, {
      avgResolutionHours: Number(slaHours),
      slaAvgHours: Number(slaHours),
    });
    showToast('Department Rules Updated', `${selectedDept.name} SLA adjusted to ${slaHours} hours.`, 'success');
    setSelectedDept(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in" id="admin-departments-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-theme-muted mb-1">
            <Link to="/admin/dashboard" className="hover:text-theme-primary">Admin Cockpit</Link>
            <span>/</span>
            <span className="text-theme-primary font-semibold">Department Routing & Campus Locations</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-theme-primary">
            Department Dispatch & Campus Locations
          </h1>
          <p className="text-xs text-theme-secondary mt-1">
            Configure automated routing rules, category mappings, resolution SLAs, and Demo Campus data.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-surface border border-theme-subtle">
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'departments'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-theme-secondary hover:text-theme-primary'
            }`}
          >
            Departments ({departments.length})
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'locations'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-theme-secondary hover:text-theme-primary'
            }`}
          >
            Demo Locations ({locations.length})
          </button>
        </div>
      </div>

      {activeTab === 'departments' ? (
        /* Departments Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map(dept => {
            const activeTicketCount = complaints.filter(
              c => (c.assignedDepartmentId === dept.id || c.department_id === dept.id) && c.status !== 'resolved' && c.status !== 'closed' && c.status !== 'Resolved'
            ).length;

            return (
              <div
                key={dept.id}
                className="p-5 rounded-2xl border border-theme-subtle bg-surface shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {dept.slaTargetPercentage || dept.slaComplianceRate || 95}% SLA Match
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-theme-primary">{dept.name}</h3>
                    <p className="text-xs text-theme-muted">{dept.contactEmail || `${dept.id}@campus.edu`}</p>
                    <p className="text-xs text-theme-secondary mt-1">{dept.description}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-elevated border border-theme-subtle text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-theme-muted">Department Head:</span>
                      <span className="font-semibold text-theme-primary">{dept.headName || 'Assigned Lead'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-theme-muted">Active Workload:</span>
                      <span className="font-mono font-bold text-brand-primary">{activeTicketCount} open tickets</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-theme-muted">Target SLA Time:</span>
                      <span className="font-mono font-semibold text-theme-primary">{dept.avgResolutionHours || dept.slaAvgHours || 4} hrs</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-theme-subtle flex items-center justify-between">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Dispatch Active
                  </span>

                  <button
                    onClick={() => {
                      setSelectedDept(dept);
                      setSlaHours(dept.avgResolutionHours || dept.slaAvgHours || 24);
                    }}
                    className="px-3 py-1 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-theme-subtle text-xs font-semibold text-theme-primary transition-colors flex items-center gap-1"
                  >
                    <Settings2 className="w-3.5 h-3.5" /> Configure SLA
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Demo Campus Locations Grid */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-3">
            <MapPin className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">Demo Campus Location Registry</p>
              <p className="opacity-90">All 10 zones below are pre-loaded Demo Campus Locations for automated ticket geo-routing and issue clustering.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map(loc => (
              <div
                key={loc.id}
                className="p-4 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-primary" />
                    <h3 className="text-sm font-bold text-theme-primary">{loc.name}</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Demo Campus
                  </span>
                </div>
                <p className="text-xs text-theme-secondary">{loc.description}</p>
                <div className="pt-2 border-t border-theme-subtle flex items-center justify-between text-[11px] text-theme-muted">
                  <span>Building: {loc.building}</span>
                  <span className="font-mono">{loc.code || loc.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SLA Policy Modal */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-theme-subtle bg-surface p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-theme-primary">
              Configure SLA: {selectedDept.name}
            </h3>
            <p className="text-xs text-theme-secondary">
              Set the maximum resolution turnaround threshold before tickets are automatically escalated.
            </p>

            <form onSubmit={handleUpdateSLA} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-theme-secondary mb-1">
                  Target SLA Window (Hours)
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={slaHours}
                  onChange={e => setSlaHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-brand-primary font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-theme-subtle">
                <button
                  type="button"
                  onClick={() => setSelectedDept(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-theme-secondary hover:bg-surface-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-hover shadow-sm"
                >
                  Save Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
