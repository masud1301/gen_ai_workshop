import React from 'react';
import { Repeat, MapPin, Tag, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { RecurringClusterInsight } from '../../services/adminAnalyticsService';
import { Link } from 'react-router-dom';

interface RecurringProblemsSectionProps {
  clusters: RecurringClusterInsight[];
}

export const RecurringProblemsSection: React.FC<RecurringProblemsSectionProps> = ({
  clusters,
}) => {
  return (
    <div className="p-6 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-4" id="recurring-problems-section">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Repeat className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-theme-primary">Recurring Problem Detection</h3>
            <p className="text-xs text-theme-muted">
              Correlated complaints grouped by category, location, and keywords
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          {clusters.length} {clusters.length === 1 ? 'Cluster' : 'Clusters'} Identified
        </span>
      </div>

      {clusters.length === 0 ? (
        <div className="p-8 text-center bg-surface-elevated/40 rounded-xl border border-dashed border-theme-subtle">
          <Sparkles className="w-8 h-8 mx-auto text-theme-muted mb-2 opacity-50" />
          <p className="text-xs font-semibold text-theme-primary">No recurring issue clusters detected</p>
          <p className="text-[11px] text-theme-muted mt-0.5">
            Complaints in the filtered set do not show multiple recurring patterns at the same location.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {clusters.map((cluster) => (
            <div
              key={cluster.id}
              className="p-4 rounded-xl bg-surface-elevated border border-theme-subtle hover:border-amber-500/30 transition-all space-y-3 flex flex-col justify-between"
              id={cluster.id}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-theme-primary">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                      <span>{cluster.location}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      {cluster.category}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
                    {cluster.count} Repeated Reports
                  </span>
                </div>

                {/* Insight Message as requested: "Network-related complaints are repeatedly being reported around the same location." */}
                <p className="text-xs text-theme-secondary font-medium leading-relaxed">
                  "{cluster.message}"
                </p>

                {/* Keyword Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {cluster.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-theme-subtle text-theme-muted"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Linked Complaint List Preview */}
              <div className="pt-2 border-t border-theme-subtle/80 space-y-1.5">
                <div className="text-[10px] font-bold text-theme-muted uppercase tracking-wider">
                  Associated Complaints:
                </div>
                <div className="space-y-1">
                  {cluster.complaints.slice(0, 2).map((comp) => (
                    <div key={comp.id} className="flex items-center justify-between text-[11px]">
                      <span className="text-theme-primary truncate max-w-[200px] sm:max-w-[260px]">
                        • {comp.title}
                      </span>
                      <Link
                        to={`/student/complaints/${comp.id}`}
                        className="text-[10px] font-mono text-brand-primary hover:underline shrink-0 font-semibold"
                      >
                        {comp.trackingNumber || 'SF-Ticket'}
                      </Link>
                    </div>
                  ))}
                  {cluster.complaints.length > 2 && (
                    <span className="text-[10px] text-theme-muted italic">
                      + {cluster.complaints.length - 2} more linked reports
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
