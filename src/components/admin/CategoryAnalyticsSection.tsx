import React from 'react';
import { Tag, BarChart3, PieChart as PieIcon, Layers } from 'lucide-react';
import { StandardCategory } from '../../types';
import { STANDARD_CATEGORIES } from '../../services/adminAnalyticsService';

interface CategoryAnalyticsSectionProps {
  distribution: Record<StandardCategory, number>;
  totalComplaints: number;
}

const CATEGORY_COLORS: Record<StandardCategory, { bg: string; text: string; bar: string }> = {
  'IT / Network': { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', bar: 'bg-blue-500' },
  'Electrical': { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-500' },
  'Classroom Equipment': { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', bar: 'bg-purple-500' },
  'Cleanliness': { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500' },
  'Water / Plumbing': { bg: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', bar: 'bg-cyan-500' },
  'Infrastructure': { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', bar: 'bg-indigo-500' },
  'Security': { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', bar: 'bg-rose-500' },
  'Other': { bg: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', bar: 'bg-slate-500' },
};

export const CategoryAnalyticsSection: React.FC<CategoryAnalyticsSectionProps> = ({
  distribution,
  totalComplaints,
}) => {
  return (
    <div className="p-6 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-4" id="category-analytics-section">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-theme-primary">Category Analytics</h3>
            <p className="text-xs text-theme-muted">Complaint distribution across standard campus categories</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface-elevated text-theme-primary border border-theme-subtle">
          {totalComplaints} Total Records
        </span>
      </div>

      {totalComplaints === 0 ? (
        <div className="p-8 text-center bg-surface-elevated/40 rounded-xl border border-dashed border-theme-subtle">
          <Layers className="w-8 h-8 mx-auto text-theme-muted mb-2 opacity-50" />
          <p className="text-xs font-semibold text-theme-primary">No complaints recorded</p>
          <p className="text-[11px] text-theme-muted mt-0.5">
            No active database records match the selected filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          {STANDARD_CATEGORIES.map((category) => {
            const count = distribution[category] || 0;
            const pct = totalComplaints > 0 ? Math.round((count / totalComplaints) * 100) : 0;
            const colors = CATEGORY_COLORS[category];

            return (
              <div key={category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: colors.bar.replace('bg-', '') }} />
                    <span className="font-semibold text-theme-primary">{category}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-theme-secondary font-medium">{count} tickets</span>
                    <span className="font-bold text-theme-primary w-10 text-right">{pct}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-surface-elevated overflow-hidden border border-theme-subtle/50">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
