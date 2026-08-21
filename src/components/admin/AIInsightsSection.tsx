import React from 'react';
import { Sparkles, AlertOctagon, Repeat, MapPin, Building2, CopyCheck, ArrowRight, Info } from 'lucide-react';
import { AIInsightItem, RecurringClusterInsight } from '../../services/adminAnalyticsService';
import { Link } from 'react-router-dom';

interface AIInsightsSectionProps {
  insights: AIInsightItem[];
  recurringClusters: RecurringClusterInsight[];
}

export const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({
  insights,
  recurringClusters,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'recurring_problem':
        return <Repeat className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'repeated_location':
        return <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'possible_duplicate_complaints':
        return <CopyCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'department_attention':
        return <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  const getBadgeClass = (color: string) => {
    switch (color) {
      case 'rose':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'amber':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'purple':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'blue':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'emerald':
      default:
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6 shadow-sm space-y-5" id="ai-insights-section">
      {/* Header with clear boundary between AI analysis & Raw DB Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-theme-primary">
                SmartFix AI Insights Engine
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                AI Synthesis
              </span>
            </div>
            <p className="text-xs text-theme-secondary mt-0.5">
              Autonomous pattern detection, repeated problem diagnostics, and proactive campus maintenance recommendations.
            </p>
          </div>
        </div>

        {/* Notice of distinction */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface/80 border border-theme-subtle text-[11px] text-theme-muted shrink-0">
          <Info className="w-3.5 h-3.5 text-purple-500" />
          <span>Derived strictly from active database records</span>
        </div>
      </div>

      {/* Insight Cards Grid */}
      {insights.length === 0 ? (
        <div className="p-8 text-center bg-surface/50 rounded-xl border border-dashed border-theme-subtle">
          <Sparkles className="w-8 h-8 mx-auto text-theme-muted mb-2 opacity-50" />
          <p className="text-sm font-semibold text-theme-primary">No Anomaly Patterns Detected</p>
          <p className="text-xs text-theme-muted mt-1 max-w-md mx-auto">
            SmartFix AI has not detected recurring failures or abnormal hotspots in the currently filtered dataset.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="p-4 rounded-xl bg-surface border border-theme-subtle hover:border-purple-500/40 transition-all shadow-sm space-y-3 flex flex-col justify-between"
              id={insight.id}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-surface-elevated border border-theme-subtle shrink-0">
                      {getIcon(insight.type)}
                    </div>
                    <h3 className="text-xs font-bold text-theme-primary leading-tight">
                      {insight.title}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${getBadgeClass(
                      insight.badgeColor
                    )}`}
                  >
                    {insight.badge}
                  </span>
                </div>

                <p className="text-xs text-theme-secondary leading-relaxed">
                  {insight.description}
                </p>

                {/* Evidence Box */}
                <div className="p-2.5 rounded-lg bg-surface-elevated/70 border border-theme-subtle text-[11px] space-y-1">
                  <div className="font-semibold text-theme-primary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Database Evidence:
                  </div>
                  <p className="text-theme-muted leading-normal">
                    {insight.evidence}
                  </p>
                </div>
              </div>

              {/* Action Recommendation */}
              <div className="pt-2 border-t border-theme-subtle flex items-center justify-between text-[11px]">
                <span className="text-theme-secondary font-medium truncate pr-2">
                  💡 <strong className="text-theme-primary">Action:</strong> {insight.recommendation}
                </span>
                {insight.relatedComplaintIds.length > 0 && (
                  <Link
                    to={`/student/complaints/${insight.relatedComplaintIds[0]}`}
                    className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1 shrink-0 ml-auto"
                  >
                    <span>View Ticket</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
