import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  variant?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose' | 'default';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  onClick,
}) => {
  const variantStyles = {
    default: 'border-theme-subtle bg-surface',
    blue: 'border-blue-500/20 bg-surface',
    purple: 'border-purple-500/20 bg-surface',
    emerald: 'border-emerald-500/20 bg-surface',
    amber: 'border-amber-500/20 bg-surface',
    rose: 'border-rose-500/20 bg-surface',
  };

  const iconStyles = {
    default: 'bg-surface-elevated text-theme-primary border border-theme-subtle',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`p-5 rounded-2xl border ${variantStyles[variant]} shadow-sm hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer hover:border-theme-strong' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider truncate">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconStyles[variant]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-theme-primary">
          {value}
        </span>
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-theme-subtle text-xs text-theme-muted">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium ${
                trend.direction === 'up'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : trend.direction === 'down'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-theme-muted'
              }`}
            >
              {trend.direction === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
              {trend.direction === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
              {trend.value}
            </span>
          )}
          <span className="truncate">{subtitle || trend?.label}</span>
        </div>
      )}
    </div>
  );
};
