import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-theme-strong bg-surface/50 my-4">
      <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-theme-subtle flex items-center justify-center text-theme-muted mb-4 shadow-sm">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-theme-primary mb-1">{title}</h4>
      <p className="text-xs text-theme-secondary max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold shadow-sm transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
