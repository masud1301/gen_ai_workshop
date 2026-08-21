import React from 'react';
import { PriorityLevel, ComplaintStatus, IssueCategory } from '../../types';
import { AlertTriangle, Clock, CheckCircle2, Cpu, Wrench, Shield, Droplets, Zap, School, Coffee, Sparkles, Building2 } from 'lucide-react';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const configs = {
    critical: {
      label: 'Critical',
      className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
      dot: 'bg-rose-500 animate-pulse',
    },
    high: {
      label: 'High',
      className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      dot: 'bg-amber-500',
    },
    medium: {
      label: 'Medium',
      className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
      dot: 'bg-blue-500',
    },
    low: {
      label: 'Low',
      className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
      dot: 'bg-slate-400',
    },
  };

  const config = configs[priority] || configs.medium;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.className} ${sizeClasses} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<ComplaintStatus, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
    submitted: {
      label: 'Submitted',
      icon: Clock,
      className: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
    },
    ai_classified: {
      label: 'AI Classified',
      icon: Sparkles,
      className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    },
    assigned: {
      label: 'Assigned',
      icon: Wrench,
      className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    },
    in_progress: {
      label: 'In Progress',
      icon: Clock,
      className: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    },
    pending_verification: {
      label: 'Pending Verification',
      icon: AlertTriangle,
      className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    },
    resolved: {
      label: 'Resolved',
      icon: CheckCircle2,
      className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    },
    closed: {
      label: 'Closed',
      icon: CheckCircle2,
      className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    },
  };

  const config = configs[status] || configs.submitted;
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.className} ${sizeClasses} whitespace-nowrap`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {config.label}
    </span>
  );
};

interface CategoryBadgeProps {
  category: IssueCategory;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'md' }) => {
  const configs: Record<IssueCategory, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
    it_network: { label: 'IT & Wi-Fi', icon: Cpu },
    hostel_maintenance: { label: 'Hostel Maintenance', icon: Building2 },
    classroom_equipment: { label: 'Academic & AV', icon: School },
    campus_hygiene: { label: 'Hygiene & Waste', icon: Sparkles },
    electrical_power: { label: 'Electrical & Power', icon: Zap },
    plumbing_water: { label: 'Plumbing & Water', icon: Droplets },
    cafeteria_food: { label: 'Food & Cafeteria', icon: Coffee },
    library_resources: { label: 'Library', icon: School },
    security_safety: { label: 'Safety & Security', icon: Shield },
    transport_parking: { label: 'Transport & Parking', icon: Building2 },
  };

  const config = configs[category] || { label: category, icon: Building2 };
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg bg-surface-elevated text-theme-secondary border border-theme-subtle ${sizeClasses} whitespace-nowrap`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0 text-theme-muted" />
      {config.label}
    </span>
  );
};
